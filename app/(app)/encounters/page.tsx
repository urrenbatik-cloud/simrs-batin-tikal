import Link from "next/link"
import { LinkButton } from "@/components/ui/link-button"
import { requireSession } from "@/lib/session"
import { listAllEncounters } from "@/services/encounterService"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const dynamic = "force-dynamic"
export const metadata = { title: "Kunjungan — SIMRS Batin Tikal" }

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>
}

export default async function EncountersPage({ searchParams }: PageProps) {
  const session = await requireSession()
  const params = await searchParams
  const status = params.status as "open" | "closed" | "cancelled" | undefined
  const page = Math.max(Number(params.page ?? 1), 1)
  const limit = 25
  const offset = (page - 1) * limit

  const { rows, total } = await listAllEncounters(
    { userId: session.userId, rsId: session.rsId },
    { status, limit, offset },
  )
  const totalPages = Math.max(Math.ceil(total / limit), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Kunjungan</h1>
        <p className="text-sm text-muted-foreground">
          Semua kunjungan terdaftar — {total.toLocaleString("id-ID")} total
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Status</CardTitle>
          <CardDescription>Filter kunjungan berdasarkan status</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <FilterButton href="/encounters" active={!status}>Semua</FilterButton>
          <FilterButton href="/encounters?status=open" active={status === "open"}>
            Terbuka
          </FilterButton>
          <FilterButton href="/encounters?status=closed" active={status === "closed"}>
            Selesai
          </FilterButton>
          <FilterButton href="/encounters?status=cancelled" active={status === "cancelled"}>
            Dibatalkan
          </FilterButton>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Tidak ada kunjungan{status ? ` dengan status ${status}` : ""}.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Kunjungan</TableHead>
                  <TableHead>Pasien</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-xs">{e.nomorKunjungan}</TableCell>
                    <TableCell>
                      <Link
                        href={`/patients/${e.patientId}`}
                        className="underline-offset-2 hover:underline"
                      >
                        <div className="font-medium">{e.patientNama}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {e.patientRm}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>{formatDateTime(e.tanggalKunjungan)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{jenisLabel(e.jenisKunjungan)}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={e.statusKunjungan} />
                    </TableCell>
                    <TableCell className="text-right">
                      <LinkButton variant="ghost" size="sm" href={`/patients/${e.patientId}`}>Lihat Pasien</LinkButton>
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
            <LinkButton variant="outline" size="sm" href={`/encounters?${new URLSearchParams({ status: status ?? "", page: String(page - 1) })}`}>
                ← Sebelumnya
              </LinkButton>
          )}
          <span className="px-3 py-1.5 text-muted-foreground">
            Halaman {page} dari {totalPages}
          </span>
          {page < totalPages && (
            <LinkButton variant="outline" size="sm" href={`/encounters?${new URLSearchParams({ status: status ?? "", page: String(page + 1) })}`}>
                Berikutnya →
              </LinkButton>
          )}
        </div>
      )}
    </div>
  )
}

function FilterButton({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <LinkButton variant={active ? "default" : "outline"} size="sm" href={href}>{children}</LinkButton>
  )
}

function formatDateTime(d: Date | string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
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
