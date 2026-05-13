"use client"

import { useActionState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  createPatientAction,
  updatePatientAction,
  type ActionState,
} from "@/app/actions/patient-actions"
import type { Patient } from "@/db/schema/patient"

interface PatientFormProps {
  mode: "create" | "edit"
  patient?: Patient
}

type Alamat = {
  alamat_lengkap?: string
  kota?: string
  provinsi?: string
  kode_pos?: string
}

type Kontak = {
  telepon_utama?: string
  email?: string
}

type Demografi = {
  pekerjaan?: string
  agama?: string
  status_pernikahan?: string
}

export function PatientForm({ mode, patient }: PatientFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const boundAction =
    mode === "edit" && patient
      ? updatePatientAction.bind(null, patient.id)
      : createPatientAction

  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(boundAction, null)

  useEffect(() => {
    if (state?.success && state.patientId) {
      toast.success(
        mode === "create"
          ? "Pasien berhasil didaftarkan."
          : "Data pasien diperbarui.",
      )
      router.push(`/patients/${state.patientId}`)
    } else if (state?.message && !state.success) {
      toast.error(state.message)
    }
  }, [state, mode, router])

  const fieldError = (name: string) => state?.fieldErrors?.[name]?.[0]
  const alamat = (patient?.alamat as Alamat | null) ?? null
  const kontak = (patient?.dataKontak as Kontak | null) ?? null
  const demografi = (patient?.dataDemografi as Demografi | null) ?? null

  return (
    <form action={formAction} ref={formRef} className="space-y-6">
      {mode === "edit" && patient && (
        <input type="hidden" name="expectedVersion" value={patient.version} />
      )}

      {state?.message && !state.success && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Identitas</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Nomor Rekam Medis *"
            name="nomorRekamMedis"
            defaultValue={patient?.nomorRekamMedis ?? ""}
            placeholder="RM-2026-00001"
            error={fieldError("nomorRekamMedis")}
            required
          />
          <Field
            label="NIK (16 digit)"
            name="nik"
            defaultValue={patient?.nik ?? ""}
            placeholder="1234567890123456"
            error={fieldError("nik")}
            inputMode="numeric"
            maxLength={16}
          />
          <Field
            label="Nama Lengkap *"
            name="namaLengkap"
            defaultValue={patient?.namaLengkap ?? ""}
            error={fieldError("namaLengkap")}
            required
            className="sm:col-span-2"
          />
          <Field
            label="Tanggal Lahir *"
            name="tanggalLahir"
            type="date"
            defaultValue={
              (patient?.tanggalLahir as string | undefined) ?? ""
            }
            error={fieldError("tanggalLahir")}
            required
          />
          <div className="space-y-2">
            <Label htmlFor="jenisKelamin">Jenis Kelamin *</Label>
            <Select
              name="jenisKelamin"
              defaultValue={patient?.jenisKelamin ?? "L"}
              required
            >
              <SelectTrigger id="jenisKelamin">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Laki-laki</SelectItem>
                <SelectItem value="P">Perempuan</SelectItem>
              </SelectContent>
            </Select>
            {fieldError("jenisKelamin") && (
              <p className="text-sm text-destructive">{fieldError("jenisKelamin")}</p>
            )}
          </div>
          <Field
            label="Tempat Lahir"
            name="tempatLahir"
            defaultValue={patient?.tempatLahir ?? ""}
            className="sm:col-span-2"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alamat</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="alamatLengkap">Alamat Lengkap</Label>
            <Textarea
              id="alamatLengkap"
              name="alamatLengkap"
              defaultValue={alamat?.alamat_lengkap ?? ""}
              rows={2}
            />
          </div>
          <Field
            label="Kota / Kabupaten"
            name="kota"
            defaultValue={alamat?.kota ?? ""}
          />
          <Field
            label="Provinsi"
            name="provinsi"
            defaultValue={alamat?.provinsi ?? ""}
          />
          <Field
            label="Kode Pos"
            name="kodePos"
            defaultValue={alamat?.kode_pos ?? ""}
            maxLength={10}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kontak</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Field
            label="No. Telepon Utama"
            name="teleponUtama"
            defaultValue={kontak?.telepon_utama ?? ""}
            type="tel"
          />
          <Field
            label="Email"
            name="email"
            defaultValue={kontak?.email ?? ""}
            type="email"
            error={fieldError("dataKontak.email")}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Demografi</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          <Field
            label="Pekerjaan"
            name="pekerjaan"
            defaultValue={demografi?.pekerjaan ?? ""}
          />
          <Field
            label="Agama"
            name="agama"
            defaultValue={demografi?.agama ?? ""}
          />
          <Field
            label="Status Pernikahan"
            name="statusPernikahan"
            defaultValue={demografi?.status_pernikahan ?? ""}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            mode === "edit" && patient
              ? router.push(`/patients/${patient.id}`)
              : router.push("/patients")
          }
        >
          Batal
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Menyimpan..."
            : mode === "create"
              ? "Simpan Pasien"
              : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  )
}

interface FieldProps {
  label: string
  name: string
  defaultValue?: string | number | readonly string[]
  placeholder?: string
  type?: string
  required?: boolean
  error?: string
  className?: string
  inputMode?: "numeric" | "text" | "email" | "tel"
  maxLength?: number
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  required,
  error,
  className,
  inputMode,
  maxLength,
}: FieldProps) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
