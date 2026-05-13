import Link from "next/link"
import { notFound } from "next/navigation"
import { Pencil } from "lucide-react"
import { requireSession } from "@/lib/session"
import {
  getPatient,
  PatientNotFoundError,
} from "@/services/patientService"
import { listEncountersForPatient } from "@/services/encounterService"
import { getAuditTrailForEntity } from "@/services/auditService"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { NewEncounterDialog } from "../../encounters/new-encounter-dialog"
import { EncounterActions } from "../../encounters/encounter-actions"
import { LinkButton } from "@/components/ui/link-button"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PatientDetailPage({ params }: PageProps) {
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

  const [{ rows: encounters }, { rows: auditTrail }] = await Promise.all([
    listEncountersForPatient(
      { userId: session.userId, rsId: session.rsId },
      patient.id,
      { limit: 50 },
    ),
    getAuditTrailForEntity(
      {
        userId: session.userId,
        rsId: session.rsId,
        role: session.role,
      },
      "patient",
      patient.id,
      { limit: 20 },
    ),
  ])

  const alamat = patient.alamat as Record<string, string> | null
  const kontak = patient.dataKontak as Record<string, string | object> | null
  const demografi = patient.dataDemografi as Record<string, string> | null
  const kontakDarurat = kontak?.kontak_darurat as
    | Record<string, string>
    | undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <LinkButton variant="ghost" size="sm" href="/patients">← Daftar Pasien</LinkButton>
        </div>
        <div className="flex gap-2">
          <LinkButton variant="outline" href={`/patients/${patient.id}/edit`}>
              <Pencil className="size-4" /> Edit
            </LinkButton>
          <NewEncounterDialog patientId={patient.id} patientNama={patient.namaLengkap} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{patient.namaLengkap}</CardTitle>
                <CardDescription className="font-mono mt-1">
                  RM: {patient.nomorRekamMedis}
                  {patient.nik ? ` · NIK: ${patient.nik}` : ""}
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {patient.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <DataRow label="Tanggal Lahir" value={formatDate(patient.tanggalLahir as string)} />
            <DataRow label="Tempat Lahir" value={patient.tempatLahir} />

            <Separator />
            <SectionTitle>Alamat</SectionTitle>
            <DataRow label="Alamat" value={alamat?.alamat_lengkap} />
            <DataRow label="Kota" value={alamat?.kota} />
            <DataRow label="Provinsi" value={alamat?.provinsi} />
            <DataRow label="Kode Pos" value={alamat?.kode_pos} />

            <Separator />
            <SectionTitle>Kontak</SectionTitle>
            <DataRow label="Telepon" value={kontak?.telepon_utama as string} />
            <DataRow label="Email" value={kontak?.email as string} />
            {kontakDarurat && (
              <DataRow
                label="Kontak Darurat"
                value={`${kontakDarurat.nama ?? "—"} (${kontakDarurat.hubungan ?? "—"}) · ${kontakDarurat.telepon ?? ""}`}
              />
            )}

            <Separator />
            <SectionTitle>Demografi</SectionTitle>
            <DataRow label="Pekerjaan" value={demografi?.pekerjaan} />
            <DataRow label="Agama" value={demografi?.agama} />
            <DataRow label="Status Pernikahan" value={demografi?.status_pernikahan} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata Sistem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <DataRow label="Versi Data" value={String(patient.version)} small />
              <DataRow
                label="Dibuat"
                value={formatDateTime(patient.createdAt)}
                small
              />
              <DataRow
                label="Diperbarui"
                value={formatDateTime(patient.updatedAt)}
                small
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Encounters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Riwayat Kunjungan</CardTitle>
              <CardDescription>{encounters.length} kunjungan terdaftar</CardDescription>
            </div>
            <NewEncounterDialog patientId={patient.id} patientNama={patient.namaLengkap} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {encounters.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Belum ada kunjungan. Klik &quot;Kunjungan Baru&quot;.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Kunjungan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Keluhan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {encounters.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-xs">{e.nomorKunjungan}</TableCell>
                    <TableCell>{formatDateTime(e.tanggalKunjungan)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {jenisLabel(e.jenisKunjungan)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={e.statusKunjungan} />
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {e.keluhanUtama ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <EncounterActions encounter={e} patientId={patient.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Audit Trail */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Perubahan (Audit Trail)</CardTitle>
          <CardDescription>
            Setiap perubahan pada data pasien ini dicatat secara permanen.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {auditTrail.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              Belum ada entri audit.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Operasi</TableHead>
                  <TableHead>Oleh</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditTrail.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDateTime(a.occurredAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={operationVariant(a.operation)}>
                        {operationLabel(a.operation)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {a.userNama ?? a.userEmail ?? "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {summarizeChange(a.operation, a.oldValues, a.newValues)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function DataRow({
  label,
  value,
  small,
}: {
  label: string
  value: string | null | undefined
  small?: boolean
}) {
  return (
    <div
      className={`grid ${small ? "grid-cols-[140px_1fr]" : "sm:grid-cols-[180px_1fr]"} gap-2`}
    >
      <div className="text-muted-foreground">{label}</div>
      <div className={value ? "" : "text-muted-foreground/50"}>
        {value ?? "—"}
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
      {children}
    </h3>
  )
}

function formatDate(s: string | null) {
  if (!s) return null
  try {
    return new Date(s).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return s
  }
}

function formatDateTime(d: Date | string | null) {
  if (!d) return null
  try {
    return new Date(d).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return String(d)
  }
}

function jenisLabel(j: string) {
  return (
    { rawat_jalan: "Rawat Jalan", rawat_inap: "Rawat Inap", igd: "IGD", observasi: "Observasi" }[j] ?? j
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    open: "default",
    closed: "secondary",
    cancelled: "destructive",
  }
  const labels: Record<string, string> = {
    open: "Terbuka",
    closed: "Selesai",
    cancelled: "Dibatalkan",
  }
  return <Badge variant={variants[status] ?? "outline"}>{labels[status] ?? status}</Badge>
}

function operationVariant(
  op: string,
): "default" | "secondary" | "destructive" | "outline" {
  return op === "INSERT" ? "default" : op === "UPDATE" ? "secondary" : "destructive"
}

function operationLabel(op: string) {
  return { INSERT: "Buat", UPDATE: "Ubah", DELETE: "Hapus" }[op] ?? op
}

function summarizeChange(
  op: string,
  oldValues: unknown,
  newValues: unknown,
): string {
  if (op === "INSERT") return "Pasien terdaftar"
  if (op === "UPDATE" && oldValues && newValues) {
    const o = oldValues as Record<string, unknown>
    const n = newValues as Record<string, unknown>
    const changed: string[] = []
    for (const key of Object.keys(n)) {
      if (key === "updated_at" || key === "version" || key === "updated_by") continue
      if (JSON.stringify(o[key]) !== JSON.stringify(n[key])) changed.push(key)
    }
    if (changed.length === 0) return "Tidak ada perubahan field"
    if (changed.length <= 3) return `Diubah: ${changed.join(", ")}`
    return `Diubah: ${changed.slice(0, 3).join(", ")} (+${changed.length - 3} lain)`
  }
  return ""
}
