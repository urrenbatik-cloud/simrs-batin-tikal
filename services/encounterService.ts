/**
 * EncounterService — business logic for kunjungan (encounter hub).
 *
 * Per Blueprint v2.0 §4.7.3 + Appendix A.3 (Encounter-as-Convergence):
 * encounter is THE convergence point; clinical detail tables will FK here
 * in future modul. State machine: 'open' → 'closed' or 'cancelled'.
 */
import "server-only"
import { and, desc, eq, isNull, sql } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { encounterTable, type Encounter } from "@/db/schema/encounter"
import { patientTable } from "@/db/schema/patient"
import { withAuditContext } from "@/lib/audit-context"

export const createEncounterSchema = z.object({
  patientId: z.string().uuid(),
  tanggalKunjungan: z.string().min(1, "Tanggal kunjungan wajib diisi"),
  jenisKunjungan: z.enum(["rawat_jalan", "rawat_inap", "igd", "observasi"]),
  keluhanUtama: z.string().optional().or(z.literal("")),
  dataKlinis: z.record(z.string(), z.any()).optional(),
})

export const updateEncounterSchema = z.object({
  expectedVersion: z.number().int().positive(),
  jenisKunjungan: z
    .enum(["rawat_jalan", "rawat_inap", "igd", "observasi"])
    .optional(),
  keluhanUtama: z.string().optional().or(z.literal("")),
  dataKlinis: z.record(z.string(), z.any()).optional(),
})

export const closeEncounterSchema = z.object({
  expectedVersion: z.number().int().positive(),
})

export type CreateEncounterInput = z.infer<typeof createEncounterSchema>
export type UpdateEncounterInput = z.infer<typeof updateEncounterSchema>

export class EncounterNotFoundError extends Error {
  constructor(id: string) {
    super(`Encounter ${id} not found`)
    this.name = "EncounterNotFoundError"
  }
}
export class EncounterVersionConflictError extends Error {
  constructor() {
    super("Encounter sudah diubah oleh pengguna lain. Silakan reload.")
    this.name = "EncounterVersionConflictError"
  }
}
export class EncounterStateError extends Error {
  constructor(currentState: string, attempted: string) {
    super(
      `Transisi state tidak valid: encounter ${currentState} tidak dapat ${attempted}.`,
    )
    this.name = "EncounterStateError"
  }
}

interface ServiceContext {
  userId: string
  rsId: string
}

/**
 * Generate semantic nomor_kunjungan per P3-D modernization.
 * Format: YYYYMMDD-NNNNN-{TYPE} (e.g., 20260513-00001-RJ)
 *
 * Sequence is per-RS per-day; relies on a sub-query that counts existing
 * encounters today for the same RS.
 */
async function generateNomorKunjungan(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  rsId: string,
  jenisKunjungan: string,
  tanggalKunjungan: Date,
): Promise<string> {
  const yyyymmdd =
    tanggalKunjungan.toISOString().slice(0, 10).replace(/-/g, "")
  const typeCode =
    jenisKunjungan === "rawat_jalan"
      ? "RJ"
      : jenisKunjungan === "rawat_inap"
        ? "RI"
        : jenisKunjungan === "igd"
          ? "IGD"
          : "OBS"

  // Count today's encounters for this RS to derive sequence
  const [countRow] = await tx
    .select({ count: sql<number>`count(*)::int` })
    .from(encounterTable)
    .where(
      and(
        eq(encounterTable.rsId, rsId),
        sql`${encounterTable.tanggalKunjungan}::date = ${tanggalKunjungan.toISOString().slice(0, 10)}::date`,
      ),
    )

  const sequence = String((countRow?.count ?? 0) + 1).padStart(5, "0")
  return `${yyyymmdd}-${sequence}-${typeCode}`
}

export async function listEncountersForPatient(
  ctx: ServiceContext,
  patientId: string,
  options: { limit?: number; offset?: number } = {},
): Promise<{ rows: Encounter[]; total: number }> {
  const limit = Math.min(options.limit ?? 50, 200)
  const offset = options.offset ?? 0

  const whereClause = and(
    eq(encounterTable.patientId, patientId),
    eq(encounterTable.rsId, ctx.rsId),
    isNull(encounterTable.deletedAt),
  )

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(encounterTable)
      .where(whereClause)
      .orderBy(desc(encounterTable.tanggalKunjungan))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(encounterTable)
      .where(whereClause),
  ])

  return { rows, total: totalRow[0]?.count ?? 0 }
}

export async function listAllEncounters(
  ctx: ServiceContext,
  options: { status?: "open" | "closed" | "cancelled"; limit?: number; offset?: number } = {},
): Promise<{ rows: (Encounter & { patientNama: string; patientRm: string })[]; total: number }> {
  const limit = Math.min(options.limit ?? 50, 200)
  const offset = options.offset ?? 0

  const baseFilter = and(
    eq(encounterTable.rsId, ctx.rsId),
    isNull(encounterTable.deletedAt),
  )
  const whereClause = options.status
    ? and(baseFilter, eq(encounterTable.statusKunjungan, options.status))
    : baseFilter

  const [rows, totalRow] = await Promise.all([
    db
      .select({
        id: encounterTable.id,
        nomorKunjungan: encounterTable.nomorKunjungan,
        patientId: encounterTable.patientId,
        tanggalKunjungan: encounterTable.tanggalKunjungan,
        jenisKunjungan: encounterTable.jenisKunjungan,
        statusKunjungan: encounterTable.statusKunjungan,
        keluhanUtama: encounterTable.keluhanUtama,
        dataKlinis: encounterTable.dataKlinis,
        closedAt: encounterTable.closedAt,
        closedBy: encounterTable.closedBy,
        rsId: encounterTable.rsId,
        createdAt: encounterTable.createdAt,
        createdBy: encounterTable.createdBy,
        updatedAt: encounterTable.updatedAt,
        updatedBy: encounterTable.updatedBy,
        deletedAt: encounterTable.deletedAt,
        deletedBy: encounterTable.deletedBy,
        version: encounterTable.version,
        patientNama: patientTable.namaLengkap,
        patientRm: patientTable.nomorRekamMedis,
      })
      .from(encounterTable)
      .leftJoin(patientTable, eq(encounterTable.patientId, patientTable.id))
      .where(whereClause)
      .orderBy(desc(encounterTable.tanggalKunjungan))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(encounterTable)
      .where(whereClause),
  ])

  return {
    rows: rows.map((r) => ({
      ...r,
      patientNama: r.patientNama ?? "(unknown)",
      patientRm: r.patientRm ?? "",
    })),
    total: totalRow[0]?.count ?? 0,
  }
}

export async function getEncounter(
  ctx: ServiceContext,
  id: string,
): Promise<Encounter> {
  const [row] = await db
    .select()
    .from(encounterTable)
    .where(
      and(
        eq(encounterTable.id, id),
        eq(encounterTable.rsId, ctx.rsId),
        isNull(encounterTable.deletedAt),
      ),
    )
    .limit(1)
  if (!row) throw new EncounterNotFoundError(id)
  return row
}

export async function createEncounter(
  ctx: ServiceContext,
  input: CreateEncounterInput,
): Promise<Encounter> {
  return withAuditContext(ctx.userId, async (tx) => {
    // Verify patient exists in this RS
    const [pat] = await tx
      .select({ id: patientTable.id })
      .from(patientTable)
      .where(
        and(
          eq(patientTable.id, input.patientId),
          eq(patientTable.rsId, ctx.rsId),
          isNull(patientTable.deletedAt),
        ),
      )
      .limit(1)
    if (!pat) throw new Error(`Patient ${input.patientId} not found in this RS`)

    const tanggalKunjungan = new Date(input.tanggalKunjungan)
    const nomorKunjungan = await generateNomorKunjungan(
      tx,
      ctx.rsId,
      input.jenisKunjungan,
      tanggalKunjungan,
    )

    const [row] = await tx
      .insert(encounterTable)
      .values({
        nomorKunjungan,
        patientId: input.patientId,
        tanggalKunjungan,
        jenisKunjungan: input.jenisKunjungan,
        statusKunjungan: "open",
        keluhanUtama: input.keluhanUtama || null,
        dataKlinis: input.dataKlinis ?? null,
        rsId: ctx.rsId,
        createdBy: ctx.userId,
        updatedBy: ctx.userId,
      })
      .returning()
    return row
  })
}

export async function updateEncounter(
  ctx: ServiceContext,
  id: string,
  input: UpdateEncounterInput,
): Promise<Encounter> {
  return withAuditContext(ctx.userId, async (tx) => {
    const { expectedVersion, ...patch } = input

    // Block updates on closed/cancelled
    const [current] = await tx
      .select({ status: encounterTable.statusKunjungan })
      .from(encounterTable)
      .where(
        and(
          eq(encounterTable.id, id),
          eq(encounterTable.rsId, ctx.rsId),
          isNull(encounterTable.deletedAt),
        ),
      )
      .limit(1)
    if (!current) throw new EncounterNotFoundError(id)
    if (current.status !== "open") {
      throw new EncounterStateError(current.status, "diedit")
    }

    const [row] = await tx
      .update(encounterTable)
      .set({
        ...(patch.jenisKunjungan !== undefined && {
          jenisKunjungan: patch.jenisKunjungan,
        }),
        ...(patch.keluhanUtama !== undefined && {
          keluhanUtama: patch.keluhanUtama || null,
        }),
        ...(patch.dataKlinis !== undefined && {
          dataKlinis: patch.dataKlinis ?? null,
        }),
        updatedBy: ctx.userId,
      })
      .where(
        and(
          eq(encounterTable.id, id),
          eq(encounterTable.rsId, ctx.rsId),
          eq(encounterTable.version, expectedVersion),
          isNull(encounterTable.deletedAt),
        ),
      )
      .returning()
    if (!row) throw new EncounterVersionConflictError()
    return row
  })
}

export async function closeEncounter(
  ctx: ServiceContext,
  id: string,
  expectedVersion: number,
): Promise<Encounter> {
  return withAuditContext(ctx.userId, async (tx) => {
    const [current] = await tx
      .select({ status: encounterTable.statusKunjungan })
      .from(encounterTable)
      .where(
        and(
          eq(encounterTable.id, id),
          eq(encounterTable.rsId, ctx.rsId),
          isNull(encounterTable.deletedAt),
        ),
      )
      .limit(1)
    if (!current) throw new EncounterNotFoundError(id)
    if (current.status !== "open") {
      throw new EncounterStateError(current.status, "ditutup")
    }

    const [row] = await tx
      .update(encounterTable)
      .set({
        statusKunjungan: "closed",
        closedAt: new Date(),
        closedBy: ctx.userId,
        updatedBy: ctx.userId,
      })
      .where(
        and(
          eq(encounterTable.id, id),
          eq(encounterTable.rsId, ctx.rsId),
          eq(encounterTable.version, expectedVersion),
          isNull(encounterTable.deletedAt),
        ),
      )
      .returning()
    if (!row) throw new EncounterVersionConflictError()
    return row
  })
}

export async function cancelEncounter(
  ctx: ServiceContext,
  id: string,
  expectedVersion: number,
): Promise<Encounter> {
  return withAuditContext(ctx.userId, async (tx) => {
    const [current] = await tx
      .select({ status: encounterTable.statusKunjungan })
      .from(encounterTable)
      .where(
        and(
          eq(encounterTable.id, id),
          eq(encounterTable.rsId, ctx.rsId),
          isNull(encounterTable.deletedAt),
        ),
      )
      .limit(1)
    if (!current) throw new EncounterNotFoundError(id)
    if (current.status === "closed") {
      throw new EncounterStateError("closed", "dibatalkan")
    }

    const [row] = await tx
      .update(encounterTable)
      .set({
        statusKunjungan: "cancelled",
        updatedBy: ctx.userId,
      })
      .where(
        and(
          eq(encounterTable.id, id),
          eq(encounterTable.rsId, ctx.rsId),
          eq(encounterTable.version, expectedVersion),
          isNull(encounterTable.deletedAt),
        ),
      )
      .returning()
    if (!row) throw new EncounterVersionConflictError()
    return row
  })
}
