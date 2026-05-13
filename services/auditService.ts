/**
 * AuditService — query universal audit trail.
 *
 * Per Blueprint v2.0 §5.6.1 audit query API: expose "what was state of X at
 * time T" + "who changed X when" for auditor consumption.
 *
 * Read-only — no write operations exposed (audit_log is append-only via DB
 * trigger + RLS). All writes happen automatically via the audit triggers
 * defined in migration 0001.
 */
import "server-only"
import { and, desc, eq, gte, lte, sql } from "drizzle-orm"
import { db } from "@/db"
import { auditLogTable, type AuditLog } from "@/db/schema/audit_log"
import { usersTable } from "@/db/schema/users"

interface ServiceContext {
  userId: string
  rsId: string
  role: string
}

export type AuditLogWithUser = AuditLog & {
  userEmail: string | null
  userNama: string | null
}

export async function getAuditTrailForEntity(
  ctx: ServiceContext,
  tableName: string,
  rowId: string,
  options: { limit?: number; offset?: number } = {},
): Promise<{ rows: AuditLogWithUser[]; total: number }> {
  const limit = Math.min(options.limit ?? 50, 200)
  const offset = options.offset ?? 0

  const baseFilter = and(
    eq(auditLogTable.tableName, tableName),
    eq(auditLogTable.rowId, rowId),
  )
  // Auditor role sees all RS; normal users see only own RS
  const whereClause =
    ctx.role === "auditor"
      ? baseFilter
      : and(baseFilter, eq(auditLogTable.rsId, ctx.rsId))

  const [rows, totalRow] = await Promise.all([
    db
      .select({
        id: auditLogTable.id,
        tableName: auditLogTable.tableName,
        rowId: auditLogTable.rowId,
        operation: auditLogTable.operation,
        oldValues: auditLogTable.oldValues,
        newValues: auditLogTable.newValues,
        userId: auditLogTable.userId,
        rsId: auditLogTable.rsId,
        occurredAt: auditLogTable.occurredAt,
        userEmail: usersTable.email,
        userNama: usersTable.namaLengkap,
      })
      .from(auditLogTable)
      .leftJoin(usersTable, eq(auditLogTable.userId, usersTable.id))
      .where(whereClause)
      .orderBy(desc(auditLogTable.occurredAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(auditLogTable)
      .where(whereClause),
  ])

  return { rows, total: totalRow[0]?.count ?? 0 }
}

export interface AuditLogQuery {
  tableName?: string
  operation?: "INSERT" | "UPDATE" | "DELETE"
  userId?: string
  from?: Date
  to?: Date
  limit?: number
  offset?: number
}

export async function queryAuditLog(
  ctx: ServiceContext,
  query: AuditLogQuery = {},
): Promise<{ rows: AuditLogWithUser[]; total: number }> {
  const limit = Math.min(query.limit ?? 50, 200)
  const offset = query.offset ?? 0

  const filters = []
  if (ctx.role !== "auditor") {
    filters.push(eq(auditLogTable.rsId, ctx.rsId))
  }
  if (query.tableName) filters.push(eq(auditLogTable.tableName, query.tableName))
  if (query.operation) filters.push(eq(auditLogTable.operation, query.operation))
  if (query.userId) filters.push(eq(auditLogTable.userId, query.userId))
  if (query.from) filters.push(gte(auditLogTable.occurredAt, query.from))
  if (query.to) filters.push(lte(auditLogTable.occurredAt, query.to))

  const whereClause = filters.length > 0 ? and(...filters) : undefined

  const [rows, totalRow] = await Promise.all([
    db
      .select({
        id: auditLogTable.id,
        tableName: auditLogTable.tableName,
        rowId: auditLogTable.rowId,
        operation: auditLogTable.operation,
        oldValues: auditLogTable.oldValues,
        newValues: auditLogTable.newValues,
        userId: auditLogTable.userId,
        rsId: auditLogTable.rsId,
        occurredAt: auditLogTable.occurredAt,
        userEmail: usersTable.email,
        userNama: usersTable.namaLengkap,
      })
      .from(auditLogTable)
      .leftJoin(usersTable, eq(auditLogTable.userId, usersTable.id))
      .where(whereClause)
      .orderBy(desc(auditLogTable.occurredAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(auditLogTable)
      .where(whereClause),
  ])

  return { rows, total: totalRow[0]?.count ?? 0 }
}
