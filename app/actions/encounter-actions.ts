"use server"

import { revalidatePath } from "next/cache"
import {
  createEncounter,
  createEncounterSchema,
  closeEncounter,
  cancelEncounter,
  EncounterNotFoundError,
  EncounterStateError,
  EncounterVersionConflictError,
} from "@/services/encounterService"
import { requireSession } from "@/lib/session"
import type { ActionState } from "./patient-actions"
// NOTE: do NOT `export type { ActionState }` from this file. Next.js "use
// server" modules forbid non-Server-Action exports. Turbopack incorrectly
// includes type re-exports in the runtime bundle and references them as
// values, causing a ReferenceError at module evaluation time (Bug 5 of
// Session 1). Client components that need ActionState should import it
// directly from "./patient-actions".

export async function createEncounterAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireSession()

    const raw = {
      patientId: String(formData.get("patientId") ?? "").trim(),
      tanggalKunjungan:
        String(formData.get("tanggalKunjungan") ?? "").trim() ||
        new Date().toISOString(),
      jenisKunjungan: String(formData.get("jenisKunjungan") ?? "").trim(),
      keluhanUtama:
        String(formData.get("keluhanUtama") ?? "").trim() || undefined,
    }

    const parsed = createEncounterSchema.safeParse(raw)
    if (!parsed.success) {
      return {
        success: false,
        message:
          "Validasi gagal: " +
          parsed.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; "),
        fieldErrors: parsed.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      }
    }

    const encounter = await createEncounter(
      { userId: session.userId, rsId: session.rsId },
      parsed.data,
    )
    revalidatePath(`/patients/${parsed.data.patientId}`)
    return { success: true, patientId: encounter.patientId }
  } catch (err) {
    // EVERY path returns ActionState — never let exceptions escape.
    // The Vercel 500 page would otherwise be shown if anything throws.
    console.error("[createEncounterAction] uncaught:", err)
    const message = err instanceof Error ? err.message : String(err)
    // Include cause chain for diagnosis
    let causeMsg = ""
    if (err instanceof Error && (err as Error & { cause?: unknown }).cause) {
      const c = (err as Error & { cause?: unknown }).cause
      causeMsg =
        " | cause: " + (c instanceof Error ? c.message : String(c)).slice(0, 200)
    }
    return { success: false, message: `Error: ${message}${causeMsg}` }
  }
}

export async function closeEncounterAction(
  encounterId: string,
  expectedVersion: number,
  patientId: string,
): Promise<ActionState> {
  try {
    const session = await requireSession()
    await closeEncounter(
      { userId: session.userId, rsId: session.rsId },
      encounterId,
      expectedVersion,
    )
    revalidatePath(`/patients/${patientId}`)
    return { success: true, patientId }
  } catch (err) {
    if (
      err instanceof EncounterStateError ||
      err instanceof EncounterVersionConflictError ||
      err instanceof EncounterNotFoundError
    ) {
      return { success: false, message: err.message }
    }
    console.error("[closeEncounterAction] uncaught:", err)
    return {
      success: false,
      message: err instanceof Error ? err.message : String(err),
    }
  }
}

export async function cancelEncounterAction(
  encounterId: string,
  expectedVersion: number,
  patientId: string,
): Promise<ActionState> {
  try {
    const session = await requireSession()
    await cancelEncounter(
      { userId: session.userId, rsId: session.rsId },
      encounterId,
      expectedVersion,
    )
    revalidatePath(`/patients/${patientId}`)
    return { success: true, patientId }
  } catch (err) {
    if (
      err instanceof EncounterStateError ||
      err instanceof EncounterVersionConflictError ||
      err instanceof EncounterNotFoundError
    ) {
      return { success: false, message: err.message }
    }
    console.error("[cancelEncounterAction] uncaught:", err)
    return {
      success: false,
      message: err instanceof Error ? err.message : String(err),
    }
  }
}
