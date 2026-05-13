import Link from "next/link"
import { notFound } from "next/navigation"
import { requireSession } from "@/lib/session"
import { getPatient, PatientNotFoundError } from "@/services/patientService"
import { Button } from "@/components/ui/button"
import { PatientForm } from "../../patient-form"
import { LinkButton } from "@/components/ui/link-button"

export const dynamic = "force-dynamic"
export const metadata = { title: "Edit Pasien — SIMRS Batin Tikal" }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPatientPage({ params }: PageProps) {
  const { id } = await params
  const session = await requireSession()

  let patient
  try {
    patient = await getPatient(
      { userId: session.userId, rsId: session.rsId },
      id,
    )
  } catch (err) {
    if (err instanceof PatientNotFoundError) notFound()
    throw err
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <LinkButton variant="ghost" size="sm" href={`/patients/${patient.id}`}>← Kembali</LinkButton>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">Edit Pasien</h1>
        <p className="text-sm text-muted-foreground font-mono">
          RM: {patient.nomorRekamMedis} · {patient.namaLengkap}
        </p>
      </div>
      <PatientForm mode="edit" patient={patient} />
    </div>
  )
}
