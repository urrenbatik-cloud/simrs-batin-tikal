/**
 * encounter — Kunjungan pasien (the convergence hub).
 *
 * Per Blueprint v2.0 §4.7.3 + Appendix A.3 (P3-D Encounter-as-Convergence ⭐⭐
 * — HIGHEST-VALUE Khanza adoption):
 *   - UUID PK + semantic nomor_kunjungan (modernizes Khanza no_rawat composite fragility)
 *   - Encounter is THE convergence point — clinical detail tables (lab, prescription,
 *     diagnostic, treatment) FK here in future phases
 *   - Billing derived from clinical events, NOT source-of-truth (deferred to billing modul)
 *
 * Per Phase 0 EXIT (locked):
 *   - Simple state field 'open' | 'closed' | 'cancelled' — formal state machine
 *     framework deferred per §V.U.3
 *   - data_klinis JSONB envelope for flexible extension
 */
import { sql } from "drizzle-orm"
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  check,
} from "drizzle-orm/pg-core"
import { auditColumns } from "./_audit"
import { patientTable } from "./patient"

export const encounterTable = pgTable(
  "encounter",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    // P3-D modernization — UUID PK + separate semantic ID
    // Format suggestion: YYYYMMDD-NNNNN-{RJ|RI|IGD} (date + sequence + type)
    nomorKunjungan: text("nomor_kunjungan").notNull(),

    // Convergence point — every clinical sub-table will FK here
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patientTable.id),

    // Visit metadata
    tanggalKunjungan: timestamp("tanggal_kunjungan", {
      withTimezone: true,
    }).notNull(),
    // 'rawat_jalan' | 'rawat_inap' | 'igd' | 'observasi'
    jenisKunjungan: text("jenis_kunjungan").notNull(),
    // 'open' | 'closed' | 'cancelled' — simple state machine (Phase 0 EXIT locked)
    statusKunjungan: text("status_kunjungan").notNull().default("open"),

    // Clinical context — narrative is appropriate as free text per P8-C
    // (constrained-input bias applies to identifiers; chief complaint is genuinely narrative)
    keluhanUtama: text("keluhan_utama"),

    // JSONB envelope for flexible extension without migration churn
    // dataKlinis: { tekanan_darah, suhu, nadi, respirasi, sao2, gcs_e, gcs_v, gcs_m, ... }
    // Future modul (lab, prescription) extends this or adds FK tables to encounter.id
    dataKlinis: jsonb("data_klinis"),

    // Closure metadata (populated on status transition)
    closedAt: timestamp("closed_at", { withTimezone: true }),
    closedBy: uuid("closed_by"),

    ...auditColumns(),
  },
  (t) => [
    // Composite uniqueness: nomor_kunjungan unique per RS
    index("encounter_nomor_per_rs_idx").on(t.rsId, t.nomorKunjungan),
    index("encounter_patient_idx").on(t.patientId),
    index("encounter_tanggal_idx").on(t.tanggalKunjungan),
    index("encounter_status_idx").on(t.statusKunjungan),
    check(
      "encounter_jenis_check",
      sql`${t.jenisKunjungan} IN ('rawat_jalan', 'rawat_inap', 'igd', 'observasi')`,
    ),
    check(
      "encounter_status_check",
      sql`${t.statusKunjungan} IN ('open', 'closed', 'cancelled')`,
    ),
  ],
)

export type Encounter = typeof encounterTable.$inferSelect
export type EncounterInsert = typeof encounterTable.$inferInsert
