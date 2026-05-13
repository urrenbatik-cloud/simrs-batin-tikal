import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PatientForm } from "../patient-form"
import { LinkButton } from "@/components/ui/link-button"

export const metadata = { title: "Pasien Baru — SIMRS Batin Tikal" }

export default function NewPatientPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <LinkButton variant="ghost" size="sm" href="/patients">← Kembali</LinkButton>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">Daftarkan Pasien Baru</h1>
        <p className="text-sm text-muted-foreground">
          Lengkapi data pasien. Field yang ditandai (*) wajib diisi.
        </p>
      </div>
      <PatientForm mode="create" />
    </div>
  )
}
