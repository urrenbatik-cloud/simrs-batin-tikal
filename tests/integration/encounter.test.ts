/**
 * Integration tests — encounter (Encounter-as-Convergence hub, P3-D).
 *
 * Hybrid γ structure — see patient.test.ts header for rationale.
 *
 * SQL path covers DB-side semantics: nomor_kunjungan generation, FK to
 * patient, status_kunjungan state transitions, version increment, audit
 * chain. Drizzle path covers service layer error mapping
 * (EncounterStateError, EncounterVersionConflictError).
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
import { createPatient } from "@/services/patientService"
import {
  createEncounter,
  closeEncounter,
  cancelEncounter,
  updateEncounter,
  getEncounter,
  EncounterStateError,
  EncounterVersionConflictError,
} from "@/services/encounterService"

// ────────────────────────────────────────────────────────────────────────
// SQL path — Management API (sandbox-runnable)
// ────────────────────────────────────────────────────────────────────────
describe.skipIf(!hasIntegrationEnv())(
  "encounter — SQL path (Management API)",
  () => {
    let prefix: string

    beforeEach(() => {
      prefix = testPrefix()
    })

    afterEach(async () => {
      await cleanFixtures(prefix)
    })

    /**
     * Create a patient row via SQL — returns the row id for FK use.
     * Mirrors the trigger contract: created_by/updated_by passed explicitly
     * AND set_config wrapping for audit_log attribution.
     */
    async function makePatientSql(ctx: { rsId: string; userId: string }) {
      const rows = await runSqlAsUser<{ id: string }>(
        ctx.userId,
        `INSERT INTO public.patient
          (nomor_rekam_medis, nama_lengkap, tanggal_lahir, jenis_kelamin,
           rs_id, created_by, updated_by)
         VALUES
          ('${prefix}-RM-PAT', '${prefix} Encounter Patient',
           '1995-04-12', 'L',
           '${ctx.rsId}', '${ctx.userId}', '${ctx.userId}')
         RETURNING id`,
      )
      return rows[0].id
    }

    it("INSERT encounter — audit fires; version=1; status defaults 'open'", async () => {
      const ctx = await getTestContext()
      const patientId = await makePatientSql(ctx)

      const rows = await runSqlAsUser<{
        id: string
        version: number
        status_kunjungan: string
        closed_at: string | null
      }>(
        ctx.userId,
        `INSERT INTO public.encounter
          (nomor_kunjungan, patient_id, tanggal_kunjungan,
           jenis_kunjungan, keluhan_utama, rs_id, created_by, updated_by)
         VALUES
          ('20260514-99999-RJ', '${patientId}', '2026-05-14',
           'rawat_jalan', '${prefix} keluhan',
           '${ctx.rsId}', '${ctx.userId}', '${ctx.userId}')
         RETURNING id, version::int, status_kunjungan, closed_at::text`,
      )
      expect(rows).toHaveLength(1)
      expect(rows[0].status_kunjungan).toBe("open")
      expect(rows[0].version).toBe(1)
      expect(rows[0].closed_at).toBeNull()

      const audit = await runSql<{ user_id: string; operation: string }>(
        `SELECT user_id, operation FROM public.audit_log
         WHERE table_name = 'encounter' AND row_id = ${sqlString(rows[0].id)};`,
      )
      expect(audit).toHaveLength(1)
      expect(audit[0].operation).toBe("INSERT")
      expect(audit[0].user_id).toBe(ctx.userId)
    })

    it("FK constraint — INSERT encounter with non-existent patient_id raises", async () => {
      const ctx = await getTestContext()
      const fakeId = "00000000-0000-0000-0000-000000000000"
      await expect(
        runSqlAsUser(
          ctx.userId,
          `INSERT INTO public.encounter
            (nomor_kunjungan, patient_id, tanggal_kunjungan, jenis_kunjungan,
             rs_id, created_by, updated_by)
           VALUES
            ('${prefix}-FK-FAIL', '${fakeId}', '2026-05-14', 'rawat_jalan',
             '${ctx.rsId}', '${ctx.userId}', '${ctx.userId}')`,
        ),
      ).rejects.toThrow(/foreign key|patient_id/i)
    })

    it("close transition — status=open→closed; closed_at/closed_by populated; audit UPDATE", async () => {
      const ctx = await getTestContext()
      const patientId = await makePatientSql(ctx)

      const inserted = await runSqlAsUser<{ id: string }>(
        ctx.userId,
        `INSERT INTO public.encounter
          (nomor_kunjungan, patient_id, tanggal_kunjungan, jenis_kunjungan,
           keluhan_utama, rs_id, created_by, updated_by)
         VALUES
          ('20260514-88888-RJ', '${patientId}', '2026-05-14', 'rawat_jalan',
           '${prefix} for close', '${ctx.rsId}', '${ctx.userId}', '${ctx.userId}')
         RETURNING id`,
      )
      const id = inserted[0].id

      const closed = await runSqlAsUser<{
        status_kunjungan: string
        closed_at: string | null
        closed_by: string | null
        version: number
      }>(
        ctx.userId,
        `UPDATE public.encounter
         SET status_kunjungan = 'closed',
             closed_at = now(),
             closed_by = '${ctx.userId}',
             updated_by = '${ctx.userId}'
         WHERE id = ${sqlString(id)} AND version = 1
         RETURNING status_kunjungan, closed_at::text, closed_by, version::int`,
      )
      expect(closed[0].status_kunjungan).toBe("closed")
      expect(closed[0].closed_at).not.toBeNull()
      expect(closed[0].closed_by).toBe(ctx.userId)
      expect(closed[0].version).toBe(2)

      const audit = await runSql<{
        operation: string
        old_status: string | null
        new_status: string | null
      }>(
        `SELECT operation,
                (old_values->>'status_kunjungan') AS old_status,
                (new_values->>'status_kunjungan') AS new_status
         FROM public.audit_log
         WHERE table_name = 'encounter' AND row_id = ${sqlString(id)}
         ORDER BY occurred_at ASC`,
      )
      expect(audit).toHaveLength(2)
      expect(audit[1].operation).toBe("UPDATE")
      expect(audit[1].old_status).toBe("open")
      expect(audit[1].new_status).toBe("closed")
    })

    it("encounter rows: optimistic lock primitive — stale version UPDATE returns 0 rows", async () => {
      const ctx = await getTestContext()
      const patientId = await makePatientSql(ctx)
      const inserted = await runSqlAsUser<{ id: string }>(
        ctx.userId,
        `INSERT INTO public.encounter
          (nomor_kunjungan, patient_id, tanggal_kunjungan, jenis_kunjungan,
           keluhan_utama, rs_id, created_by, updated_by)
         VALUES
          ('20260514-77777-RJ', '${patientId}', '2026-05-14', 'rawat_jalan',
           '${prefix} lock', '${ctx.rsId}', '${ctx.userId}', '${ctx.userId}')
         RETURNING id`,
      )
      const id = inserted[0].id

      // First UPDATE: v=1 → v=2
      const r1 = await runSqlAsUser<{ version: number }>(
        ctx.userId,
        `UPDATE public.encounter
         SET keluhan_utama = '${prefix} edit-1', updated_by = '${ctx.userId}'
         WHERE id = ${sqlString(id)} AND version = 1
         RETURNING version::int`,
      )
      expect(r1).toHaveLength(1)
      expect(r1[0].version).toBe(2)

      // Stale: WHERE version=1 → 0 rows
      const r2 = await runSqlAsUser<{ version: number }>(
        ctx.userId,
        `UPDATE public.encounter
         SET keluhan_utama = '${prefix} stale', updated_by = '${ctx.userId}'
         WHERE id = ${sqlString(id)} AND version = 1
         RETURNING version::int`,
      )
      expect(r2).toHaveLength(0)
    })
  },
)

// ────────────────────────────────────────────────────────────────────────
// Drizzle path — service layer (skipped without INTEGRATION_DIRECT_POSTGRES)
// ────────────────────────────────────────────────────────────────────────
describe.skipIf(!hasDirectPostgresEgress())(
  "encounter — Drizzle path (service layer)",
  () => {
    let prefix: string

    beforeEach(() => {
      prefix = testPrefix()
    })

    afterEach(async () => {
      await cleanFixtures(prefix)
    })

    async function makePatient() {
      const ctx = await getTestContext()
      const patient = await createPatient(ctx, {
        nomorRekamMedis: `${prefix}-RM-PAT`,
        namaLengkap: `${prefix} Encounter Patient`,
        tanggalLahir: "1995-04-12",
        jenisKelamin: "L",
      })
      return { ctx, patient }
    }

    it("createEncounter generates YYYYMMDD-NNNNN-{TYPE} nomor_kunjungan", async () => {
      const { ctx, patient } = await makePatient()
      const enc = await createEncounter(ctx, {
        patientId: patient.id,
        tanggalKunjungan: "2026-05-14",
        jenisKunjungan: "rawat_jalan",
        keluhanUtama: `${prefix} keluhan`,
      })
      expect(enc.nomorKunjungan).toMatch(/^20260514-\d{5}-RJ$/)
      expect(enc.statusKunjungan).toBe("open")
      expect(enc.version).toBe(1)
    })

    it("type-code mapping: rawat_inap→RI, igd→IGD, observasi→OBS", async () => {
      const { ctx, patient } = await makePatient()
      const e1 = await createEncounter(ctx, {
        patientId: patient.id,
        tanggalKunjungan: "2026-05-14",
        jenisKunjungan: "rawat_inap",
        keluhanUtama: `${prefix} ri`,
      })
      const e2 = await createEncounter(ctx, {
        patientId: patient.id,
        tanggalKunjungan: "2026-05-14",
        jenisKunjungan: "igd",
        keluhanUtama: `${prefix} igd`,
      })
      const e3 = await createEncounter(ctx, {
        patientId: patient.id,
        tanggalKunjungan: "2026-05-14",
        jenisKunjungan: "observasi",
        keluhanUtama: `${prefix} obs`,
      })
      expect(e1.nomorKunjungan).toMatch(/^20260514-\d{5}-RI$/)
      expect(e2.nomorKunjungan).toMatch(/^20260514-\d{5}-IGD$/)
      expect(e3.nomorKunjungan).toMatch(/^20260514-\d{5}-OBS$/)
    })

    it("closeEncounter sets closed_at + version=2; transitions blocked thereafter", async () => {
      const { ctx, patient } = await makePatient()
      const enc = await createEncounter(ctx, {
        patientId: patient.id,
        tanggalKunjungan: "2026-05-14",
        jenisKunjungan: "rawat_jalan",
        keluhanUtama: `${prefix} close`,
      })
      const closed = await closeEncounter(ctx, enc.id, 1)
      expect(closed.statusKunjungan).toBe("closed")
      expect(closed.closedBy).toBe(ctx.userId)
      expect(closed.version).toBe(2)
    })

    it("cancelEncounter on closed encounter raises EncounterStateError", async () => {
      const { ctx, patient } = await makePatient()
      const enc = await createEncounter(ctx, {
        patientId: patient.id,
        tanggalKunjungan: "2026-05-14",
        jenisKunjungan: "rawat_jalan",
        keluhanUtama: `${prefix} cancel-after-close`,
      })
      const closed = await closeEncounter(ctx, enc.id, 1)
      await expect(
        cancelEncounter(ctx, enc.id, closed.version),
      ).rejects.toBeInstanceOf(EncounterStateError)
      const reread = await getEncounter(ctx, enc.id)
      expect(reread.statusKunjungan).toBe("closed")
    })

    it("updateEncounter on closed encounter raises EncounterStateError", async () => {
      const { ctx, patient } = await makePatient()
      const enc = await createEncounter(ctx, {
        patientId: patient.id,
        tanggalKunjungan: "2026-05-14",
        jenisKunjungan: "rawat_jalan",
        keluhanUtama: `${prefix} edit-after-close`,
      })
      await closeEncounter(ctx, enc.id, 1)
      await expect(
        updateEncounter(ctx, enc.id, {
          expectedVersion: 2,
          keluhanUtama: `${prefix} should not stick`,
        }),
      ).rejects.toBeInstanceOf(EncounterStateError)
    })

    it("closeEncounter with stale expectedVersion throws EncounterVersionConflictError", async () => {
      const { ctx, patient } = await makePatient()
      const enc = await createEncounter(ctx, {
        patientId: patient.id,
        tanggalKunjungan: "2026-05-14",
        jenisKunjungan: "rawat_jalan",
        keluhanUtama: `${prefix} version-conflict`,
      })
      // bump version 1→2 via update
      await updateEncounter(ctx, enc.id, {
        expectedVersion: 1,
        keluhanUtama: `${prefix} v2`,
      })
      // close with stale v=1 → conflict
      await expect(closeEncounter(ctx, enc.id, 1)).rejects.toBeInstanceOf(
        EncounterVersionConflictError,
      )
      const reread = await getEncounter(ctx, enc.id)
      expect(reread.statusKunjungan).toBe("open")
      expect(reread.version).toBe(2)
    })
  },
)
