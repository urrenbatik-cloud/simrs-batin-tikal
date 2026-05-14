/**
 * Integration tests — patient.
 *
 * Hybrid γ structure (Session 3 P1.3):
 *
 *   describe "patient — SQL path (Management API)"
 *     Runs whenever SUPABASE_PROJECT_REF + SUPABASE_MGMT_TOKEN + real
 *     DATABASE_URL are set. Verifies DB-side semantics (audit triggers,
 *     constraints, immutability, version increment) using raw SQL via
 *     the Management API endpoint — mirrors the production audit-context
 *     pattern via `set_config('app.current_user_id', uid, true)`.
 *
 *   describe "patient — Drizzle path (service layer)"
 *     Additionally gated by INTEGRATION_DIRECT_POSTGRES=1 — requires raw
 *     TCP egress to the Supavisor pooler (port 6543). Runs `vercel dev`
 *     locally or in a CI runner with full network. Verifies the service
 *     layer correctly orchestrates the same DB primitives + custom error
 *     types (PatientVersionConflictError, PatientNotFoundError).
 *
 * Both blocks share `cleanFixtures(prefix)` for teardown isolation.
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
import {
  createPatient,
  updatePatient,
  softDeletePatient,
  listPatients,
  getPatient,
  PatientNotFoundError,
  PatientVersionConflictError,
} from "@/services/patientService"

// ────────────────────────────────────────────────────────────────────────
// SQL path — Management API. Runs in any HTTPS-capable environment.
// ────────────────────────────────────────────────────────────────────────
describe.skipIf(!hasIntegrationEnv())(
  "patient — SQL path (Management API)",
  () => {
    let prefix: string

    beforeEach(() => {
      prefix = testPrefix()
    })

    afterEach(async () => {
      await cleanFixtures(prefix)
    })

    it("INSERT via session set_config — audit trigger attributes correctly", async () => {
      const ctx = await getTestContext()
      const rows = await runSqlAsUser<{
        id: string
        version: number
        created_by: string
      }>(
        ctx.userId,
        `INSERT INTO public.patient
          (nomor_rekam_medis, nama_lengkap, tanggal_lahir, jenis_kelamin,
           rs_id, created_by, updated_by)
         VALUES
          ('${prefix}-RM-001', '${prefix} SQL Path', '1990-01-15', 'L',
           '${ctx.rsId}', '${ctx.userId}', '${ctx.userId}')
         RETURNING id, version::int, created_by;`,
      )
      expect(rows).toHaveLength(1)
      expect(rows[0].version).toBe(1)
      expect(rows[0].created_by).toBe(ctx.userId)

      // audit_log row should exist with user_id from set_config
      const audit = await runSql<{ user_id: string; operation: string }>(
        `SELECT user_id, operation FROM public.audit_log
         WHERE table_name = 'patient' AND row_id = ${sqlString(rows[0].id)};`,
      )
      expect(audit).toHaveLength(1)
      expect(audit[0].operation).toBe("INSERT")
      expect(audit[0].user_id).toBe(ctx.userId)
    })

    it("UPDATE increments version, audit_log captures old/new diff", async () => {
      const ctx = await getTestContext()
      const inserted = await runSqlAsUser<{ id: string }>(
        ctx.userId,
        `INSERT INTO public.patient
          (nomor_rekam_medis, nama_lengkap, tanggal_lahir, jenis_kelamin,
           rs_id, created_by, updated_by)
         VALUES
          ('${prefix}-RM-002', '${prefix} Initial', '1985-06-10', 'P',
           '${ctx.rsId}', '${ctx.userId}', '${ctx.userId}')
         RETURNING id;`,
      )
      const id = inserted[0].id

      const updated = await runSqlAsUser<{ version: number }>(
        ctx.userId,
        `UPDATE public.patient
         SET nama_lengkap = '${prefix} Updated', updated_by = '${ctx.userId}'
         WHERE id = ${sqlString(id)} AND version = 1
         RETURNING version::int;`,
      )
      expect(updated[0].version).toBe(2)

      const audit = await runSql<{
        operation: string
        old_nama: string | null
        new_nama: string | null
        new_version: number | null
      }>(
        `SELECT operation,
                (old_values->>'nama_lengkap') AS old_nama,
                (new_values->>'nama_lengkap') AS new_nama,
                (new_values->>'version')::int AS new_version
         FROM public.audit_log
         WHERE table_name = 'patient' AND row_id = ${sqlString(id)}
         ORDER BY occurred_at ASC;`,
      )
      expect(audit).toHaveLength(2)
      expect(audit[0].operation).toBe("INSERT")
      expect(audit[1].operation).toBe("UPDATE")
      expect(audit[1].old_nama).toBe(`${prefix} Initial`)
      expect(audit[1].new_nama).toBe(`${prefix} Updated`)
      expect(audit[1].new_version).toBe(2)
    })

    it("UPDATE WHERE version=stale returns 0 rows (optimistic lock primitive)", async () => {
      const ctx = await getTestContext()
      const inserted = await runSqlAsUser<{ id: string }>(
        ctx.userId,
        `INSERT INTO public.patient
          (nomor_rekam_medis, nama_lengkap, tanggal_lahir, jenis_kelamin,
           rs_id, created_by, updated_by)
         VALUES
          ('${prefix}-RM-003', '${prefix} Lock Test', '1992-03-21', 'L',
           '${ctx.rsId}', '${ctx.userId}', '${ctx.userId}')
         RETURNING id;`,
      )
      const id = inserted[0].id

      const r1 = await runSqlAsUser<{ version: number }>(
        ctx.userId,
        `UPDATE public.patient
         SET nama_lengkap = '${prefix} v2', updated_by = '${ctx.userId}'
         WHERE id = ${sqlString(id)} AND version = 1
         RETURNING version::int;`,
      )
      expect(r1).toHaveLength(1)
      expect(r1[0].version).toBe(2)

      const r2 = await runSqlAsUser<{ version: number }>(
        ctx.userId,
        `UPDATE public.patient
         SET nama_lengkap = '${prefix} stale', updated_by = '${ctx.userId}'
         WHERE id = ${sqlString(id)} AND version = 1
         RETURNING version::int;`,
      )
      expect(r2).toHaveLength(0)

      const final = await runSql<{ nama_lengkap: string; version: number }>(
        `SELECT nama_lengkap, version::int FROM public.patient WHERE id = ${sqlString(id)};`,
      )
      expect(final[0].nama_lengkap).toBe(`${prefix} v2`)
      expect(final[0].version).toBe(2)
    })

    it("audit_log immutability — direct UPDATE/DELETE raises EXCEPTION", async () => {
      const ctx = await getTestContext()
      const inserted = await runSqlAsUser<{ id: string }>(
        ctx.userId,
        `INSERT INTO public.patient
          (nomor_rekam_medis, nama_lengkap, tanggal_lahir, jenis_kelamin,
           rs_id, created_by, updated_by)
         VALUES
          ('${prefix}-RM-004', '${prefix} Immutable', '1988-08-08', 'L',
           '${ctx.rsId}', '${ctx.userId}', '${ctx.userId}')
         RETURNING id;`,
      )
      const auditRow = await runSql<{ id: string }>(
        `SELECT id FROM public.audit_log
         WHERE table_name = 'patient' AND row_id = ${sqlString(inserted[0].id)}
         LIMIT 1;`,
      )
      expect(auditRow).toHaveLength(1)
      const auditId = auditRow[0].id

      await expect(
        runSql(
          `UPDATE public.audit_log SET operation = 'TAMPERED'
           WHERE id = ${sqlString(auditId)};`,
        ),
      ).rejects.toThrow(/audit_log is append-only/i)

      await expect(
        runSql(`DELETE FROM public.audit_log WHERE id = ${sqlString(auditId)};`),
      ).rejects.toThrow(/audit_log is append-only/i)

      const stillThere = await runSql<{ operation: string }>(
        `SELECT operation FROM public.audit_log WHERE id = ${sqlString(auditId)};`,
      )
      expect(stillThere[0].operation).toBe("INSERT")
    })

    it("CHECK constraint — jenis_kelamin only accepts 'L' or 'P'", async () => {
      const ctx = await getTestContext()
      await expect(
        runSqlAsUser(
          ctx.userId,
          `INSERT INTO public.patient
            (nomor_rekam_medis, nama_lengkap, tanggal_lahir, jenis_kelamin,
             rs_id, created_by, updated_by)
           VALUES
            ('${prefix}-RM-BAD', '${prefix} Bad', '1990-01-01', 'X',
             '${ctx.rsId}', '${ctx.userId}', '${ctx.userId}');`,
        ),
      ).rejects.toThrow(/patient_jenis_kelamin_check/i)
    })

    it("CHECK constraint — NIK must be 16 digits or NULL", async () => {
      const ctx = await getTestContext()
      await expect(
        runSqlAsUser(
          ctx.userId,
          `INSERT INTO public.patient
            (nomor_rekam_medis, nik, nama_lengkap, tanggal_lahir, jenis_kelamin,
             rs_id, created_by, updated_by)
           VALUES
            ('${prefix}-RM-NIK', '12345', '${prefix} Bad NIK', '1990-01-01', 'L',
             '${ctx.rsId}', '${ctx.userId}', '${ctx.userId}');`,
        ),
      ).rejects.toThrow(/patient_nik_format_check/i)
    })

    it("audit context missing — INSERT with NULL created_by + no session raises", async () => {
      const ctx = await getTestContext()
      // Skip set_config; trigger sees NEW.created_by IS NULL → raises
      // (fail-loud guard from migration 0001).
      await expect(
        runSql(
          `INSERT INTO public.patient
            (nomor_rekam_medis, nama_lengkap, tanggal_lahir, jenis_kelamin, rs_id)
           VALUES
            ('${prefix}-RM-NO-CTX', '${prefix} No Ctx', '1990-01-01', 'L',
             '${ctx.rsId}');`,
        ),
      ).rejects.toThrow(/audit context missing/i)
    })

    it("soft delete via UPDATE deleted_at — version bumps, audit captures", async () => {
      const ctx = await getTestContext()
      const inserted = await runSqlAsUser<{ id: string }>(
        ctx.userId,
        `INSERT INTO public.patient
          (nomor_rekam_medis, nama_lengkap, tanggal_lahir, jenis_kelamin,
           rs_id, created_by, updated_by)
         VALUES
          ('${prefix}-RM-DEL', '${prefix} Soft Delete', '1970-12-25', 'P',
           '${ctx.rsId}', '${ctx.userId}', '${ctx.userId}')
         RETURNING id;`,
      )
      const id = inserted[0].id

      await runSqlAsUser(
        ctx.userId,
        `UPDATE public.patient
         SET deleted_at = now(), deleted_by = '${ctx.userId}',
             updated_by = '${ctx.userId}'
         WHERE id = ${sqlString(id)} AND version = 1;`,
      )

      const after = await runSql<{
        deleted_at: string | null
        deleted_by: string | null
        version: number
      }>(
        `SELECT deleted_at::text, deleted_by, version::int
         FROM public.patient WHERE id = ${sqlString(id)};`,
      )
      expect(after[0].deleted_at).not.toBeNull()
      expect(after[0].deleted_by).toBe(ctx.userId)
      expect(after[0].version).toBe(2)

      const audit = await runSql<{ op: string; deleted_at_after: string | null }>(
        `SELECT operation AS op,
                (new_values->>'deleted_at') AS deleted_at_after
         FROM public.audit_log
         WHERE table_name = 'patient' AND row_id = ${sqlString(id)}
         ORDER BY occurred_at ASC;`,
      )
      expect(audit).toHaveLength(2)
      expect(audit[1].op).toBe("UPDATE")
      expect(audit[1].deleted_at_after).not.toBeNull()
    })
  },
)

// ────────────────────────────────────────────────────────────────────────
// Drizzle path — service layer. Skipped in HTTPS-only environments.
// Owner runs locally via `INTEGRATION_DIRECT_POSTGRES=1 npm run test:integration`.
// ────────────────────────────────────────────────────────────────────────
describe.skipIf(!hasDirectPostgresEgress())(
  "patient — Drizzle path (service layer)",
  () => {
    let prefix: string

    beforeEach(() => {
      prefix = testPrefix()
    })

    afterEach(async () => {
      await cleanFixtures(prefix)
    })

    it("createPatient — returns typed row, version=1, audit attribution correct", async () => {
      const ctx = await getTestContext()
      const created = await createPatient(ctx, {
        nomorRekamMedis: `${prefix}-RM-D1`,
        namaLengkap: `${prefix} Drizzle Alpha`,
        tanggalLahir: "1990-01-15",
        jenisKelamin: "L",
      })
      expect(created.nomorRekamMedis).toBe(`${prefix}-RM-D1`)
      expect(created.namaLengkap).toBe(`${prefix} Drizzle Alpha`)
      expect(created.version).toBe(1)
      expect(created.createdBy).toBe(ctx.userId)
      expect(created.deletedAt).toBeNull()

      const audit = await runSql<{ user_id: string; operation: string }>(
        `SELECT user_id, operation FROM public.audit_log
         WHERE table_name = 'patient' AND row_id = ${sqlString(created.id)};`,
      )
      expect(audit).toHaveLength(1)
      expect(audit[0].operation).toBe("INSERT")
      expect(audit[0].user_id).toBe(ctx.userId)
    })

    it("updatePatient — version increment + service-managed transaction commits", async () => {
      const ctx = await getTestContext()
      const created = await createPatient(ctx, {
        nomorRekamMedis: `${prefix}-RM-D2`,
        namaLengkap: `${prefix} Initial`,
        tanggalLahir: "1985-06-10",
        jenisKelamin: "P",
      })
      const updated = await updatePatient(ctx, created.id, {
        namaLengkap: `${prefix} Updated`,
        expectedVersion: 1,
      })
      expect(updated.version).toBe(2)
      expect(updated.namaLengkap).toBe(`${prefix} Updated`)
      expect(updated.createdAt.toISOString()).toBe(created.createdAt.toISOString())
    })

    it("updatePatient with stale expectedVersion throws PatientVersionConflictError", async () => {
      const ctx = await getTestContext()
      const created = await createPatient(ctx, {
        nomorRekamMedis: `${prefix}-RM-D3`,
        namaLengkap: `${prefix} Concurrent`,
        tanggalLahir: "1992-03-21",
        jenisKelamin: "L",
      })
      await updatePatient(ctx, created.id, {
        namaLengkap: `${prefix} Edit One`,
        expectedVersion: 1,
      })
      await expect(
        updatePatient(ctx, created.id, {
          namaLengkap: `${prefix} Edit Two`,
          expectedVersion: 1,
        }),
      ).rejects.toBeInstanceOf(PatientVersionConflictError)
      const final = await getPatient(ctx, created.id)
      expect(final.namaLengkap).toBe(`${prefix} Edit One`)
      expect(final.version).toBe(2)
    })

    it("getPatient on missing id throws PatientNotFoundError", async () => {
      const ctx = await getTestContext()
      await expect(
        getPatient(ctx, "00000000-0000-0000-0000-000000000000"),
      ).rejects.toBeInstanceOf(PatientNotFoundError)
    })

    it("softDeletePatient hides row from listPatients, marks deletedAt+deletedBy", async () => {
      const ctx = await getTestContext()
      const created = await createPatient(ctx, {
        nomorRekamMedis: `${prefix}-RM-D4`,
        namaLengkap: `${prefix} Will Be Deleted`,
        tanggalLahir: "1970-12-25",
        jenisKelamin: "P",
      })
      await softDeletePatient(ctx, created.id, 1)
      const list = await listPatients(ctx, { search: `${prefix} Will` })
      expect(list.rows.find((r) => r.id === created.id)).toBeUndefined()

      const raw = await runSql<{
        deleted_at: string | null
        deleted_by: string | null
        version: number
      }>(
        `SELECT deleted_at::text, deleted_by, version::int
         FROM public.patient WHERE id = ${sqlString(created.id)};`,
      )
      expect(raw[0].deleted_at).not.toBeNull()
      expect(raw[0].deleted_by).toBe(ctx.userId)
      expect(raw[0].version).toBe(2)
    })
  },
)
