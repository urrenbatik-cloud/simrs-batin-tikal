/**
 * PatientService — business logic for patient master.
 *
 * Per Blueprint v2.0 §5.6.9 (Service Layer Architecture):
 *   - Pure TypeScript, no UI dependency, no direct DB driver coupling
 *   - Composable; transaction units; testable with mocked DB
 *
 * All write operations route through withAuditContext to populate audit trail.
 */
import "server-only"
import { and, desc, eq, ilike, isNull, sql } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { patientTable, type Patient } from "@/db/schema/patient"
import { withAuditContext } from "@/lib/audit-context"

// --- Validation schemas (Zod inline per route — Phase 0 EXIT decision) -----

export const patientAlamatSchema = z
  .object({
    jalan: z.string().optional(),
    rt: z.string().optional(),
    rw: z.string().optional(),
    kelurahan: z.string().optional(),
    kecamatan: z.string().optional(),
    kota: z.string().optional(),
    provinsi: z.string().optional(),
    kode_pos: z.string().optional(),
    alamat_lengkap: z.string().optional(),
  })
  .optional()

export const patientKontakSchema = z
  .object({
    telepon_utama: z.string().optional(),
    telepon_alternatif: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    kontak_darurat: z
      .object({
        nama: z.string().optional(),
        hubungan: z.string().optional(),
        telepon: z.string().optional(),
      })
      .optional(),
  })
  .optional()

export const patientDemografiSchema = z
  .object({
    pekerjaan: z.string().optional(),
    agama: z.string().optional(),
    status_pernikahan: z.string().optional(),
    pendidikan: z.string().optional(),
    suku: z.string().optional(),
    kewarganegaraan: z.string().optional(),
    golongan_darah: z.string().optional(),
  })
  .optional()

export const createPatientSchema = z.object({
  nomorRekamMedis: z.string().min(1, "Nomor rekam medis wajib diisi"),
  nik: z
    .string()
    .regex(/^[0-9]{16}$/, "NIK harus 16 digit angka")
    .optional()
    .or(z.literal("")),
  namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  tanggalLahir: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal: YYYY-MM-DD"),
  jenisKelamin: z.enum(["L", "P"]),
  tempatLahir: z.string().optional().or(z.literal("")),
  alamat: patientAlamatSchema,
  dataKontak: patientKontakSchema,
  dataDemografi: patientDemografiSchema,
})

export const updatePatientSchema = createPatientSchema.partial().extend({
  expectedVersion: z.number().int().positive(),
})

export type CreatePatientInput = z.infer<typeof createPatientSchema>
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>

// --- Errors ---------------------------------------------------------------

export class PatientNotFoundError extends Error {
  constructor(id: string) {
    super(`Patient ${id} not found`)
    this.name = "PatientNotFoundError"
  }
}

export class PatientVersionConflictError extends Error {
  constructor() {
    super("Data sudah diubah oleh pengguna lain. Silakan reload.")
    this.name = "PatientVersionConflictError"
  }
}

// --- Service operations ---------------------------------------------------

interface ServiceContext {
  userId: string
  rsId: string
}

export async function listPatients(
  ctx: ServiceContext,
  options: { search?: string; limit?: number; offset?: number } = {},
): Promise<{ rows: Patient[]; total: number }> {
  const limit = Math.min(options.limit ?? 50, 200)
  const offset = options.offset ?? 0
  const search = options.search?.trim() ?? ""

  const baseFilter = and(
    eq(patientTable.rsId, ctx.rsId),
    isNull(patientTable.deletedAt),
  )

  const whereClause = search
    ? and(
        baseFilter,
        sql`(
          ${patientTable.namaLengkap} ILIKE ${`%${search}%`}
          OR ${patientTable.nomorRekamMedis} ILIKE ${`%${search}%`}
          OR ${patientTable.nik} ILIKE ${`%${search}%`}
        )`,
      )
    : baseFilter

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(patientTable)
      .where(whereClause)
      .orderBy(desc(patientTable.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(patientTable)
      .where(whereClause),
  ])

  return { rows, total: totalRow[0]?.count ?? 0 }
}

export async function getPatient(
  ctx: ServiceContext,
  id: string,
): Promise<Patient> {
  const [row] = await db
    .select()
    .from(patientTable)
    .where(
      and(
        eq(patientTable.id, id),
        eq(patientTable.rsId, ctx.rsId),
        isNull(patientTable.deletedAt),
      ),
    )
    .limit(1)

  if (!row) throw new PatientNotFoundError(id)
  return row
}

export async function createPatient(
  ctx: ServiceContext,
  input: CreatePatientInput,
): Promise<Patient> {
  return withAuditContext(ctx.userId, async (tx) => {
    const [row] = await tx
      .insert(patientTable)
      .values({
        nomorRekamMedis: input.nomorRekamMedis,
        nik: input.nik || null,
        namaLengkap: input.namaLengkap,
        tanggalLahir: input.tanggalLahir,
        jenisKelamin: input.jenisKelamin,
        tempatLahir: input.tempatLahir || null,
        alamat: input.alamat ?? null,
        dataKontak: input.dataKontak ?? null,
        dataDemografi: input.dataDemografi ?? null,
        rsId: ctx.rsId,
        createdBy: ctx.userId,
        updatedBy: ctx.userId,
      })
      .returning()
    return row
  })
}

export async function updatePatient(
  ctx: ServiceContext,
  id: string,
  input: UpdatePatientInput,
): Promise<Patient> {
  return withAuditContext(ctx.userId, async (tx) => {
    const { expectedVersion, ...patch } = input

    // Optimistic locking — version match required
    const [row] = await tx
      .update(patientTable)
      .set({
        ...(patch.nomorRekamMedis !== undefined && {
          nomorRekamMedis: patch.nomorRekamMedis,
        }),
        ...(patch.nik !== undefined && { nik: patch.nik || null }),
        ...(patch.namaLengkap !== undefined && {
          namaLengkap: patch.namaLengkap,
        }),
        ...(patch.tanggalLahir !== undefined && {
          tanggalLahir: patch.tanggalLahir,
        }),
        ...(patch.jenisKelamin !== undefined && {
          jenisKelamin: patch.jenisKelamin,
        }),
        ...(patch.tempatLahir !== undefined && {
          tempatLahir: patch.tempatLahir || null,
        }),
        ...(patch.alamat !== undefined && { alamat: patch.alamat ?? null }),
        ...(patch.dataKontak !== undefined && {
          dataKontak: patch.dataKontak ?? null,
        }),
        ...(patch.dataDemografi !== undefined && {
          dataDemografi: patch.dataDemografi ?? null,
        }),
        // updatedBy/updatedAt set by trigger; we set updatedBy here as a
        // defensive measure (trigger will overwrite from session context).
        updatedBy: ctx.userId,
      })
      .where(
        and(
          eq(patientTable.id, id),
          eq(patientTable.rsId, ctx.rsId),
          eq(patientTable.version, expectedVersion),
          isNull(patientTable.deletedAt),
        ),
      )
      .returning()

    if (!row) {
      // Either not found, wrong RS, or version mismatch
      const exists = await tx
        .select({ version: patientTable.version })
        .from(patientTable)
        .where(
          and(
            eq(patientTable.id, id),
            eq(patientTable.rsId, ctx.rsId),
            isNull(patientTable.deletedAt),
          ),
        )
        .limit(1)
      if (exists[0]) throw new PatientVersionConflictError()
      throw new PatientNotFoundError(id)
    }
    return row
  })
}

export async function softDeletePatient(
  ctx: ServiceContext,
  id: string,
  expectedVersion: number,
): Promise<void> {
  await withAuditContext(ctx.userId, async (tx) => {
    const [row] = await tx
      .update(patientTable)
      .set({
        deletedAt: new Date(),
        deletedBy: ctx.userId,
        updatedBy: ctx.userId,
      })
      .where(
        and(
          eq(patientTable.id, id),
          eq(patientTable.rsId, ctx.rsId),
          eq(patientTable.version, expectedVersion),
          isNull(patientTable.deletedAt),
        ),
      )
      .returning({ id: patientTable.id })
    if (!row) throw new PatientNotFoundError(id)
  })
}
