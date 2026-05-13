import { NextResponse } from "next/server"
import { eq, isNull, and } from "drizzle-orm"
import { db } from "@/db"
import { patientTable } from "@/db/schema/patient"
import { usersTable } from "@/db/schema/users"
import { rsTable } from "@/db/schema/rs"
import {
  createEncounter,
  createEncounterSchema,
} from "@/services/encounterService"

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
 * patient + user from the DB). Two test modes via ?mode= query:
 * - mode=service (default): direct service call
 * - mode=action: simulate FormData → Zod → service (the actual action flow)
 *
 * Cleans up after itself. Surfaces actual error chain in JSON.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get("mode") || "service"
  const steps: Record<string, unknown> = { mode }

  try {
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
      rsId: rs?.id,
      patientId: patient?.id,
    }

    if (!user || !rs || !patient) {
      return NextResponse.json({ ok: false, error: "fixtures missing", steps })
    }

    let parsedInput: Record<string, unknown>

    if (mode === "action") {
      // Simulate the action's FormData processing exactly
      const fd = new FormData()
      fd.append("patientId", patient.id)
      fd.append("tanggalKunjungan", new Date().toISOString().slice(0, 16)) // datetime-local format
      fd.append("jenisKunjungan", "rawat_jalan")
      fd.append("keluhanUtama", "Action flow replay")

      const raw = {
        patientId: String(fd.get("patientId") ?? "").trim(),
        tanggalKunjungan:
          String(fd.get("tanggalKunjungan") ?? "").trim() ||
          new Date().toISOString(),
        jenisKunjungan: String(fd.get("jenisKunjungan") ?? "").trim(),
        keluhanUtama:
          String(fd.get("keluhanUtama") ?? "").trim() || undefined,
      }
      steps.raw = raw

      const parsed = createEncounterSchema.safeParse(raw)
      if (!parsed.success) {
        steps.parseError = parsed.error.issues
        return NextResponse.json({ ok: false, steps })
      }
      parsedInput = parsed.data
      steps.parsed = parsedInput
    } else {
      parsedInput = {
        patientId: patient.id,
        tanggalKunjungan: new Date().toISOString(),
        jenisKunjungan: "rawat_jalan",
        keluhanUtama: "Service replay",
      }
      steps.input = parsedInput
    }

    const encounter = await createEncounter(
      { userId: user.id, rsId: rs.id },
      parsedInput as Parameters<typeof createEncounter>[1],
    )
    steps.created = {
      id: encounter.id,
      nomorKunjungan: encounter.nomorKunjungan,
      version: encounter.version,
    }

    // Cleanup
    const { encounterTable } = await import("@/db/schema/encounter")
    await db.delete(encounterTable).where(eq(encounterTable.id, encounter.id))
    steps.cleanup = "ok"

    return NextResponse.json({ ok: true, steps })
  } catch (err) {
    return NextResponse.json({ ok: false, steps, error: deepError(err) })
  }
}
