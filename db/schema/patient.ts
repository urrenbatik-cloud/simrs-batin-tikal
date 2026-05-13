/**
 * patient — Master rekam medis pasien.
 *
 * Per Phase 0 EXIT (locked schema), with Khanza P3-D + P10-A guidance:
 *   - UUID PK for system integrity + refactor safety (P3-D modernization)
 *   - Semantic nomor_rekam_medis for operator-facing ID (P3-D positive)
 *   - Indonesian field names per P10-A (RS context = Indonesian fidelity)
 *   - JSONB envelopes (alamat, kontak, demografi) per SIKESUMA-proven pattern
 *
 * Universal audit columns via auditColumns() helper (§5.6.1).
 * rs_id scoping (§5.6.6). version BIGINT (§5.6.2).
 */
import { sql } from "drizzle-orm"
import {
  date,
  jsonb,
  pgTable,
  text,
  uuid,
  index,
  check,
} from "drizzle-orm/pg-core"
import { auditColumns } from "./_audit"

export const patientTable = pgTable(
  "patient",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    // Semantic / operator-facing identifier — unique within RS (composite with rs_id)
    nomorRekamMedis: text("nomor_rekam_medis").notNull(),

    // Optional national ID (16-digit Indonesian NIK)
    nik: text("nik"),

    // Identity (Bahasa Indonesia per P10-A)
    namaLengkap: text("nama_lengkap").notNull(),
    tanggalLahir: date("tanggal_lahir").notNull(),
    // 'L' (Laki-laki) or 'P' (Perempuan) — CHECK constraint added in SQL migration
    jenisKelamin: text("jenis_kelamin").notNull(),
    tempatLahir: text("tempat_lahir"),

    // JSONB envelopes — flexible without migration churn
    // alamat: { jalan, rt, rw, kelurahan, kecamatan, kota, provinsi, kode_pos, alamat_lengkap }
    alamat: jsonb("alamat"),
    // dataKontak: { telepon_utama, telepon_alternatif, email, kontak_darurat: { nama, hubungan, telepon } }
    dataKontak: jsonb("data_kontak"),
    // dataDemografi: { pekerjaan, agama, status_pernikahan, pendidikan, suku, kewarganegaraan, golongan_darah }
    dataDemografi: jsonb("data_demografi"),

    ...auditColumns(),
  },
  (t) => [
    // Composite uniqueness: same RM number can exist in different RS
    index("patient_rm_per_rs_idx").on(t.rsId, t.nomorRekamMedis),
    index("patient_nik_idx").on(t.nik),
    index("patient_nama_idx").on(t.namaLengkap),
    check("patient_jenis_kelamin_check", sql`${t.jenisKelamin} IN ('L', 'P')`),
    check(
      "patient_nik_format_check",
      sql`${t.nik} IS NULL OR ${t.nik} ~ '^[0-9]{16}$'`,
    ),
  ],
)

export type Patient = typeof patientTable.$inferSelect
export type PatientInsert = typeof patientTable.$inferInsert
