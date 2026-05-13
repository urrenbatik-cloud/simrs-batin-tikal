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
export type { ActionState }

export async function createEncounterAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession()

  const raw = {
    patientId: String(formData.get("patientId") ?? "").trim(),
    tanggalKunjungan:
      String(formData.get("tanggalKunjungan") ?? "").trim() ||
      new Date().toISOString(),
    jenisKunjungan: String(formData.get("jenisKunjungan") ?? "").trim(),
    keluhanUtama: String(formData.get("keluhanUtama") ?? "").trim() || undefined,
  }

  const parsed = createEncounterSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    }
  }

  try {
    const encounter = await createEncounter(
      { userId: session.userId, rsId: session.rsId },
      parsed.data,
    )
    revalidatePath(`/patients/${parsed.data.patientId}`)
    return { success: true, patientId: encounter.patientId }
  } catch (err) {
    console.error("[createEncounterAction]", err)
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    }
  }
}

export async function closeEncounterAction(
  encounterId: string,
  expectedVersion: number,
  patientId: string,
): Promise<ActionState> {
  const session = await requireSession()

  try {
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
    console.error("[closeEncounterAction]", err)
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    }
  }
}

export async function cancelEncounterAction(
  encounterId: string,
  expectedVersion: number,
  patientId: string,
): Promise<ActionState> {
  const session = await requireSession()

  try {
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
    console.error("[cancelEncounterAction]", err)
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    }
  }
}
