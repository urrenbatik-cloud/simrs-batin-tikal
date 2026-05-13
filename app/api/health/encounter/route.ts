import { NextResponse } from "next/server"
import { eq, isNull, and } from "drizzle-orm"
import { db } from "@/db"
import { patientTable } from "@/db/schema/patient"
import { usersTable } from "@/db/schema/users"
import { rsTable } from "@/db/schema/rs"
import { createEncounter } from "@/services/encounterService"

function deepError(err: unknown): unknown {
  if (!(err instanceof Error)) return String(err)
  const e = err as Error & { cause?: unknown; code?: unknown }
  const out: Record<string, unknown> = { name: e.name, message: e.message }
  if (e.code) out.code = e.code
  if (e.stack) out.stack = e.stack.split("\n").slice(0, 8)
  if (e.cause) out.cause = deepError(e.cause)
  return out
}

/**
 * Replay createEncounter end-to-end with hardcoded inputs (the existing
 * patient + user from the DB). Cleans up after itself. Surfaces actual
 * error chain in JSON so we can diagnose without Vercel log access.
 */
export async function GET() {
  const steps: Record<string, unknown> = {}

  try {
    // Find first available user + first patient + RS
    const [user] = await db.select().from(usersTable).limit(1)
    const [rs] = await db.select().from(rsTable).limit(1)
    const [patient] = await db
      .select()
      .from(patientTable)
      .where(
        and(eq(patientTable.rsId, rs.id), isNull(patientTable.deletedAt)),
      )
      .limit(1)

    steps.fixtures = {
      userId: user?.id,
      userEmail: user?.email,
      rsId: rs?.id,
      patientId: patient?.id,
      patientNama: patient?.namaLengkap,
    }

    if (!user || !rs || !patient) {
      return NextResponse.json(
        { ok: false, error: "fixtures missing", steps },
        { status: 200 },
      )
    }

    // Replay the encounter create
    const input = {
      patientId: patient.id,
      tanggalKunjungan: new Date().toISOString(),
      jenisKunjungan: "rawat_jalan" as const,
      keluhanUtama: "Health endpoint replay test",
      dataKlinis: undefined,
    }
    steps.input = input

    const encounter = await createEncounter(
      { userId: user.id, rsId: rs.id },
      input,
    )

    steps.created = {
      id: encounter.id,
      nomorKunjungan: encounter.nomorKunjungan,
      version: encounter.version,
    }

    // Cleanup — delete the test encounter
    const { encounterTable } = await import("@/db/schema/encounter")
    await db.delete(encounterTable).where(eq(encounterTable.id, encounter.id))
    steps.cleanup = "ok"

    return NextResponse.json({ ok: true, steps }, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { ok: false, steps, error: deepError(err) },
      { status: 200 },
    )
  }
}
