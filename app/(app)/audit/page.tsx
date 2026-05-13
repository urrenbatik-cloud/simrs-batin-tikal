import Link from "next/link"
import { LinkButton } from "@/components/ui/link-button"
import { requireSession } from "@/lib/session"
import { queryAuditLog } from "@/services/auditService"
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
export const metadata = { title: "Audit Log — SIMRS Batin Tikal" }

interface PageProps {
  searchParams: Promise<{
    table?: string
    operation?: string
    page?: string
  }>
}

export default async function AuditPage({ searchParams }: PageProps) {
  const session = await requireSession()
  const params = await searchParams
  const tableName = params.table
  const operation = params.operation as "INSERT" | "UPDATE" | "DELETE" | undefined
  const page = Math.max(Number(params.page ?? 1), 1)
  const limit = 50
  const offset = (page - 1) * limit

  const { rows, total } = await queryAuditLog(
    {
      userId: session.userId,
      rsId: session.rsId,
      role: session.role,
    },
    { tableName, operation, limit, offset },
  )
  const totalPages = Math.max(Math.ceil(total / limit), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Audit Log</h1>
        <p className="text-sm text-muted-foreground">
          Riwayat semua perubahan data — {total.toLocaleString("id-ID")} entri
          {session.role === "auditor"
            ? " (mode auditor — lintas RS)"
            : ` (RS Anda)`}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
          <CardDescription>
            Saring berdasarkan tabel atau jenis operasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-xs uppercase text-muted-foreground mb-2">Tabel</div>
            <div className="flex gap-2 flex-wrap">
              <FilterChip
                href={buildHref({ operation })}
                active={!tableName}
                label="Semua"
              />
              <FilterChip
                href={buildHref({ table: "patient", operation })}
                active={tableName === "patient"}
                label="Pasien"
              />
              <FilterChip
                href={buildHref({ table: "encounter", operation })}
                active={tableName === "encounter"}
                label="Kunjungan"
              />
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground mb-2">Operasi</div>
            <div className="flex gap-2 flex-wrap">
              <FilterChip
                href={buildHref({ table: tableName })}
                active={!operation}
                label="Semua"
              />
              <FilterChip
                href={buildHref({ table: tableName, operation: "INSERT" })}
                active={operation === "INSERT"}
                label="Buat"
              />
              <FilterChip
                href={buildHref({ table: tableName, operation: "UPDATE" })}
                active={operation === "UPDATE"}
                label="Ubah"
              />
              <FilterChip
                href={buildHref({ table: tableName, operation: "DELETE" })}
                active={operation === "DELETE"}
                label="Hapus"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Tidak ada entri audit.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Tabel</TableHead>
                  <TableHead>Operasi</TableHead>
                  <TableHead>Row ID</TableHead>
                  <TableHead>Oleh</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDateTime(a.occurredAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{a.tableName}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={operationVariant(a.operation)}>
                        {operationLabel(a.operation)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {a.tableName === "patient" && (
                        <Link
                          href={`/patients/${a.rowId}`}
                          className="font-mono text-xs underline-offset-2 hover:underline"
                        >
                          {a.rowId.slice(0, 8)}…
                        </Link>
                      )}
                      {a.tableName !== "patient" && (
                        <span className="font-mono text-xs text-muted-foreground">
                          {a.rowId.slice(0, 8)}…
                        </span>
                      )}
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

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 text-sm">
          {page > 1 && (
            <LinkButton variant="outline" size="sm" href={buildHref({ table: tableName, operation, page: page - 1 })}>
                ← Sebelumnya
              </LinkButton>
          )}
          <span className="px-3 py-1.5 text-muted-foreground">
            Halaman {page} dari {totalPages}
          </span>
          {page < totalPages && (
            <LinkButton variant="outline" size="sm" href={buildHref({ table: tableName, operation, page: page + 1 })}>
                Berikutnya →
              </LinkButton>
          )}
        </div>
      )}
    </div>
  )
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string
  active: boolean
  label: string
}) {
  return (
    <LinkButton variant={active ? "default" : "outline"} size="sm" href={href}>{label}</LinkButton>
  )
}

function buildHref(opts: { table?: string; operation?: string; page?: number }): string {
  const params = new URLSearchParams()
  if (opts.table) params.set("table", opts.table)
  if (opts.operation) params.set("operation", opts.operation)
  if (opts.page && opts.page > 1) params.set("page", String(opts.page))
  const qs = params.toString()
  return qs ? `/audit?${qs}` : "/audit"
}

function formatDateTime(d: Date | string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
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
  if (op === "INSERT") {
    const n = (newValues as Record<string, unknown>) ?? {}
    if (n.nama_lengkap) return `Dibuat: ${String(n.nama_lengkap)}`
    if (n.nomor_kunjungan) return `Kunjungan ${String(n.nomor_kunjungan)}`
    return "Baris baru dibuat"
  }
  if (op === "UPDATE" && oldValues && newValues) {
    const o = oldValues as Record<string, unknown>
    const n = newValues as Record<string, unknown>
    const changed: string[] = []
    for (const key of Object.keys(n)) {
      if (key === "updated_at" || key === "version" || key === "updated_by") continue
      if (JSON.stringify(o[key]) !== JSON.stringify(n[key])) changed.push(key)
    }
    if (changed.length === 0) return "—"
    if (changed.length <= 3) return changed.join(", ")
    return `${changed.slice(0, 3).join(", ")} (+${changed.length - 3})`
  }
  return ""
}
