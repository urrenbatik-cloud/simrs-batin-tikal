"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  createPatient,
  createPatientSchema,
  updatePatient,
  updatePatientSchema,
  softDeletePatient,
  PatientNotFoundError,
  PatientVersionConflictError,
} from "@/services/patientService"
import { requireSession } from "@/lib/session"

export interface ActionState {
  success: boolean
  message?: string
  fieldErrors?: Record<string, string[]>
  patientId?: string
}

export async function createPatientAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession()

  const raw = {
    nomorRekamMedis: String(formData.get("nomorRekamMedis") ?? "").trim(),
    nik: String(formData.get("nik") ?? "").trim() || undefined,
    namaLengkap: String(formData.get("namaLengkap") ?? "").trim(),
    tanggalLahir: String(formData.get("tanggalLahir") ?? "").trim(),
    jenisKelamin: String(formData.get("jenisKelamin") ?? "").trim(),
    tempatLahir: String(formData.get("tempatLahir") ?? "").trim() || undefined,
    alamat: {
      alamat_lengkap: String(formData.get("alamatLengkap") ?? "").trim() || undefined,
      kota: String(formData.get("kota") ?? "").trim() || undefined,
      provinsi: String(formData.get("provinsi") ?? "").trim() || undefined,
      kode_pos: String(formData.get("kodePos") ?? "").trim() || undefined,
    },
    dataKontak: {
      telepon_utama:
        String(formData.get("teleponUtama") ?? "").trim() || undefined,
      email: String(formData.get("email") ?? "").trim() || undefined,
    },
    dataDemografi: {
      pekerjaan: String(formData.get("pekerjaan") ?? "").trim() || undefined,
      agama: String(formData.get("agama") ?? "").trim() || undefined,
      status_pernikahan:
        String(formData.get("statusPernikahan") ?? "").trim() || undefined,
    },
  }

  const parsed = createPatientSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal — perbaiki kolom yang ditandai.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    }
  }

  try {
    const patient = await createPatient(
      { userId: session.userId, rsId: session.rsId },
      parsed.data,
    )
    revalidatePath("/patients")
    revalidatePath(`/patients/${patient.id}`)
    return { success: true, patientId: patient.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    // Duplicate RM detection — Postgres unique violation
    if (message.includes("patient_rm_per_rs_uidx") || message.includes("duplicate")) {
      return {
        success: false,
        message: `Nomor rekam medis "${parsed.data.nomorRekamMedis}" sudah digunakan.`,
        fieldErrors: { nomorRekamMedis: ["Nomor rekam medis sudah digunakan"] },
      }
    }
    console.error("[createPatientAction]", err)
    return { success: false, message }
  }
}

export async function updatePatientAction(
  patientId: string,
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession()

  const raw = {
    expectedVersion: Number(formData.get("expectedVersion") ?? 0),
    nomorRekamMedis: String(formData.get("nomorRekamMedis") ?? "").trim(),
    nik: String(formData.get("nik") ?? "").trim() || undefined,
    namaLengkap: String(formData.get("namaLengkap") ?? "").trim(),
    tanggalLahir: String(formData.get("tanggalLahir") ?? "").trim(),
    jenisKelamin: String(formData.get("jenisKelamin") ?? "").trim(),
    tempatLahir: String(formData.get("tempatLahir") ?? "").trim() || undefined,
    alamat: {
      alamat_lengkap: String(formData.get("alamatLengkap") ?? "").trim() || undefined,
      kota: String(formData.get("kota") ?? "").trim() || undefined,
      provinsi: String(formData.get("provinsi") ?? "").trim() || undefined,
      kode_pos: String(formData.get("kodePos") ?? "").trim() || undefined,
    },
    dataKontak: {
      telepon_utama: String(formData.get("teleponUtama") ?? "").trim() || undefined,
      email: String(formData.get("email") ?? "").trim() || undefined,
    },
    dataDemografi: {
      pekerjaan: String(formData.get("pekerjaan") ?? "").trim() || undefined,
      agama: String(formData.get("agama") ?? "").trim() || undefined,
      status_pernikahan: String(formData.get("statusPernikahan") ?? "").trim() || undefined,
    },
  }

  const parsed = updatePatientSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    await updatePatient(
      { userId: session.userId, rsId: session.rsId },
      patientId,
      parsed.data,
    )
    revalidatePath("/patients")
    revalidatePath(`/patients/${patientId}`)
    return { success: true, patientId }
  } catch (err) {
    if (err instanceof PatientVersionConflictError) {
      return { success: false, message: err.message }
    }
    if (err instanceof PatientNotFoundError) {
      return { success: false, message: "Pasien tidak ditemukan." }
    }
    console.error("[updatePatientAction]", err)
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    }
  }
}

export async function softDeletePatientAction(
  patientId: string,
  expectedVersion: number,
): Promise<void> {
  const session = await requireSession()
  await softDeletePatient(
    { userId: session.userId, rsId: session.rsId },
    patientId,
    expectedVersion,
  )
  revalidatePath("/patients")
  redirect("/patients")
}
