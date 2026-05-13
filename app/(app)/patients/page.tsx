import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { requireSession } from "@/lib/session"
import { listPatients } from "@/services/patientService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Badge } from "@/components/ui/badge"
import { LinkButton } from "@/components/ui/link-button"

export const dynamic = "force-dynamic"

export const metadata = { title: "Pasien — SIMRS Batin Tikal" }

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function PatientsPage({ searchParams }: PageProps) {
  const session = await requireSession()
  const params = await searchParams
  const search = params.q ?? ""
  const page = Math.max(Number(params.page ?? 1), 1)
  const limit = 25
  const offset = (page - 1) * limit

  const { rows, total } = await listPatients(
    { userId: session.userId, rsId: session.rsId },
    { search, limit, offset },
  )

  const totalPages = Math.max(Math.ceil(total / limit), 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Pasien</h1>
          <p className="text-sm text-muted-foreground">
            Daftar pasien terdaftar — {total.toLocaleString("id-ID")} total
          </p>
        </div>
        <LinkButton href="/patients/new">
            <Plus className="size-4" /> Pasien Baru
          </LinkButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cari Pasien</CardTitle>
          <CardDescription>
            Cari berdasarkan nama, nomor rekam medis, atau NIK.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form method="get" className="flex gap-2">
            <div className="relative flex-1">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={search}
                placeholder="Ketik nama, RM, atau NIK..."
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="secondary">
              Cari
            </Button>
            {search && (
              <LinkButton type="button" variant="ghost" href="/patients">Reset</LinkButton>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              {search
                ? `Tidak ditemukan pasien untuk pencarian "${search}".`
                : "Belum ada pasien terdaftar. Klik 'Pasien Baru' untuk mendaftarkan."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. RM</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>NIK</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Tanggal Lahir</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm">
                      {p.nomorRekamMedis}
                    </TableCell>
                    <TableCell className="font-medium">{p.namaLengkap}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {p.nik ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {p.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(p.tanggalLahir as string)}</TableCell>
                    <TableCell className="text-right">
                      <LinkButton variant="ghost" size="sm" href={`/patients/${p.id}`}>Lihat</LinkButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 text-sm">
          {page > 1 && (
            <LinkButton variant="outline" size="sm" href={`/patients?${new URLSearchParams({ q: search, page: String(page - 1) })}`}>
                ← Sebelumnya
              </LinkButton>
          )}
          <span className="px-3 py-1.5 text-muted-foreground">
            Halaman {page} dari {totalPages}
          </span>
          {page < totalPages && (
            <LinkButton variant="outline" size="sm" href={`/patients?${new URLSearchParams({ q: search, page: String(page + 1) })}`}>
                Berikutnya →
              </LinkButton>
          )}
        </div>
      )}
    </div>
  )
}

function formatDate(s: string | null) {
  if (!s) return "—"
  try {
    return new Date(s).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return s
  }
}
