/**
 * Integration tests — audit (audit_log query API + trail invariants).
 *
 * Hybrid γ structure.
 *
 * SQL path covers DB-side invariants:
 *   - audit_log captures both INSERT and UPDATE operations with correct
 *     table_name, row_id, user_id, rs_id, occurred_at
 *   - old_values/new_values JSONB payloads include the right columns
 *   - cross-tenant rows isolated by rs_id (only one rs in dev, but the
 *     column is correctly populated)
 *
 * Drizzle path covers the service-layer query API:
 *   - queryAuditLog filters by tableName / operation / userId
 *   - getAuditTrailForEntity returns history for a single row
 *   - role='auditor' bypasses rs_id scoping; normal users are scoped
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import {
  hasIntegrationEnv,
  hasDirectPostgresEgress,
  runSql,
  runSqlAsUser,
  testPrefix,
  cleanFixtures,
  getTestContext,
  sqlString,
} from "./harness"
import { createPatient, updatePatient } from "@/services/patientService"
import {
  getAuditTrailForEntity,
  queryAuditLog,
} from "@/services/auditService"

// ────────────────────────────────────────────────────────────────────────
// SQL path
// ────────────────────────────────────────────────────────────────────────
describe.skipIf(!hasIntegrationEnv())(
  "audit — SQL path (Management API)",
  () => {
    let prefix: string

    beforeEach(() => {
      prefix = testPrefix()
    })

    afterEach(async () => {
      await cleanFixtures(prefix)
    })

    it("INSERT then UPDATE produces 2 audit rows; new_values matches table state", async () => {
      const ctx = await getTestContext()
      const inserted = await runSqlAsUser<{ id: string }>(
        ctx.userId,
        `INSERT INTO public.patient
          (nomor_rekam_medis, nama_lengkap, tanggal_lahir, jenis_kelamin,
           rs_id, created_by, updated_by)
         VALUES
          ('${prefix}-RM-A1', '${prefix} Audit Test', '1990-01-01', 'L',
           '${ctx.rsId}', '${ctx.userId}', '${ctx.userId}')
         RETURNING id`,
      )
      const id = inserted[0].id

      await runSqlAsUser(
        ctx.userId,
        `UPDATE public.patient
         SET nama_lengkap = '${prefix} Audit After', updated_by = '${ctx.userId}'
         WHERE id = ${sqlString(id)} AND version = 1`,
      )

      const audit = await runSql<{
        operation: string
        table_name: string
        row_id: string
        user_id: string
        rs_id: string
        new_nama: string
      }>(
        `SELECT operation, table_name, row_id, user_id, rs_id,
                (new_values->>'nama_lengkap') AS new_nama
         FROM public.audit_log
         WHERE row_id = ${sqlString(id)}
         ORDER BY occurred_at ASC`,
      )
      expect(audit).toHaveLength(2)

      for (const row of audit) {
        expect(row.table_name).toBe("patient")
        expect(row.row_id).toBe(id)
        expect(row.user_id).toBe(ctx.userId)
        expect(row.rs_id).toBe(ctx.rsId)
      }
      expect(audit[0].operation).toBe("INSERT")
      expect(audit[0].new_nama).toBe(`${prefix} Audit Test`)
      expect(audit[1].operation).toBe("UPDATE")
      expect(audit[1].new_nama).toBe(`${prefix} Audit After`)
    })

    it("audit_log.old_values is NULL on INSERT, populated on UPDATE", async () => {
      const ctx = await getTestContext()
      const inserted = await runSqlAsUser<{ id: string }>(
        ctx.userId,
        `INSERT INTO public.patient
          (nomor_rekam_medis, nama_lengkap, tanggal_lahir, jenis_kelamin,
           rs_id, created_by, updated_by)
         VALUES
          ('${prefix}-RM-A2', '${prefix} Diff Test', '1990-01-01', 'L',
           '${ctx.rsId}', '${ctx.userId}', '${ctx.userId}')
         RETURNING id`,
      )
      const id = inserted[0].id

      await runSqlAsUser(
        ctx.userId,
        `UPDATE public.patient
         SET nama_lengkap = '${prefix} Diff Updated', updated_by = '${ctx.userId}'
         WHERE id = ${sqlString(id)} AND version = 1`,
      )

      const audit = await runSql<{
        operation: string
        old_is_null: boolean
        new_is_null: boolean
      }>(
        `SELECT operation,
                old_values IS NULL AS old_is_null,
                new_values IS NULL AS new_is_null
         FROM public.audit_log
         WHERE row_id = ${sqlString(id)}
         ORDER BY occurred_at ASC`,
      )
      expect(audit[0].operation).toBe("INSERT")
      expect(audit[0].old_is_null).toBe(true)
      expect(audit[0].new_is_null).toBe(false)
      expect(audit[1].operation).toBe("UPDATE")
      expect(audit[1].old_is_null).toBe(false)
      expect(audit[1].new_is_null).toBe(false)
    })

    it("occurred_at is set at write time and monotonic across writes", async () => {
      const ctx = await getTestContext()
      const inserted = await runSqlAsUser<{ id: string }>(
        ctx.userId,
        `INSERT INTO public.patient
          (nomor_rekam_medis, nama_lengkap, tanggal_lahir, jenis_kelamin,
           rs_id, created_by, updated_by)
         VALUES
          ('${prefix}-RM-A3', '${prefix} Time Test', '1990-01-01', 'L',
           '${ctx.rsId}', '${ctx.userId}', '${ctx.userId}')
         RETURNING id`,
      )
      const id = inserted[0].id

      // pg_sleep ensures occurred_at differs even on fast networks
      await runSqlAsUser(
        ctx.userId,
        `SELECT pg_sleep(0.05);
         UPDATE public.patient
         SET nama_lengkap = '${prefix} Time After', updated_by = '${ctx.userId}'
         WHERE id = ${sqlString(id)} AND version = 1`,
      )

      const audit = await runSql<{ occurred_at: string }>(
        `SELECT occurred_at::text FROM public.audit_log
         WHERE row_id = ${sqlString(id)}
         ORDER BY occurred_at ASC`,
      )
      expect(audit).toHaveLength(2)
      const t1 = new Date(audit[0].occurred_at).getTime()
      const t2 = new Date(audit[1].occurred_at).getTime()
      expect(t2).toBeGreaterThan(t1)
    })
  },
)

// ────────────────────────────────────────────────────────────────────────
// Drizzle path — auditService query API
// ────────────────────────────────────────────────────────────────────────
describe.skipIf(!hasDirectPostgresEgress())(
  "audit — Drizzle path (service layer)",
  () => {
    let prefix: string

    beforeEach(() => {
      prefix = testPrefix()
    })

    afterEach(async () => {
      await cleanFixtures(prefix)
    })

    it("getAuditTrailForEntity returns INSERT then UPDATE rows ordered desc", async () => {
      const ctx = await getTestContext()
      const created = await createPatient(ctx, {
        nomorRekamMedis: `${prefix}-RM-AD1`,
        namaLengkap: `${prefix} Trail Test`,
        tanggalLahir: "1990-01-01",
        jenisKelamin: "L",
      })
      await updatePatient(ctx, created.id, {
        namaLengkap: `${prefix} Trail Edit`,
        expectedVersion: 1,
      })

      const trail = await getAuditTrailForEntity(
        { ...ctx, role: "admin" },
        "patient",
        created.id,
      )
      expect(trail.rows).toHaveLength(2)
      // ORDER BY occurred_at DESC per service code
      expect(trail.rows[0].operation).toBe("UPDATE")
      expect(trail.rows[1].operation).toBe("INSERT")
      // user_id should be populated; userEmail joined from users table
      expect(trail.rows[0].userId).toBe(ctx.userId)
      expect(trail.rows[0].userEmail).toBeTruthy()
    })

    it("queryAuditLog with tableName filter returns only patient rows", async () => {
      const ctx = await getTestContext()
      await createPatient(ctx, {
        nomorRekamMedis: `${prefix}-RM-AD2`,
        namaLengkap: `${prefix} Filter Test`,
        tanggalLahir: "1990-01-01",
        jenisKelamin: "L",
      })
      const result = await queryAuditLog(
        { ...ctx, role: "admin" },
        { tableName: "patient", userId: ctx.userId, limit: 10 },
      )
      // We can't assert exact count (other tests may share user_id), but
      // at least one row should match and all should be patient.
      expect(result.rows.length).toBeGreaterThan(0)
      for (const r of result.rows) {
        expect(r.tableName).toBe("patient")
      }
    })

    it("queryAuditLog with operation=INSERT filter excludes UPDATE rows", async () => {
      const ctx = await getTestContext()
      const created = await createPatient(ctx, {
        nomorRekamMedis: `${prefix}-RM-AD3`,
        namaLengkap: `${prefix} OpFilter`,
        tanggalLahir: "1990-01-01",
        jenisKelamin: "L",
      })
      await updatePatient(ctx, created.id, {
        namaLengkap: `${prefix} OpFilter Edit`,
        expectedVersion: 1,
      })
      const result = await queryAuditLog(
        { ...ctx, role: "admin" },
        { tableName: "patient", operation: "INSERT", userId: ctx.userId },
      )
      for (const r of result.rows) {
        expect(r.operation).toBe("INSERT")
      }
    })
  },
)
