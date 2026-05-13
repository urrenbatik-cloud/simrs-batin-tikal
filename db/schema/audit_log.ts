/**
 * audit_log — Universal append-only audit trail.
 *
 * Per Blueprint v2.0 §5.6.1 (Mandatory Audit Trail Pattern):
 *   - Captures table_name, row_id, operation, old_values, new_values, user_id, timestamp
 *   - Trigger-based population on audit-grade tables
 *   - APPEND-ONLY — no UPDATE/DELETE permitted (enforced by RLS policies)
 *
 * Foundation for BPK + Itjenad forensic queries. Trigger functions read
 * current_setting('app.current_user_id') from session context — service
 * layer sets this via SET LOCAL before each request transaction.
 */
import { sql } from "drizzle-orm"
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  check,
} from "drizzle-orm/pg-core"

export const auditLogTable = pgTable(
  "audit_log",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    // What changed
    tableName: text("table_name").notNull(),
    rowId: uuid("row_id").notNull(),
    operation: text("operation").notNull(), // 'INSERT' | 'UPDATE' | 'DELETE'

    // Before/after snapshots — JSONB for queryability
    oldValues: jsonb("old_values"),
    newValues: jsonb("new_values"),

    // Who + when (no FK to users — keep audit independent of cascade behaviors)
    userId: uuid("user_id"),
    rsId: uuid("rs_id"), // For tenant-scoped audit queries

    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index("audit_log_table_row_idx").on(t.tableName, t.rowId),
    index("audit_log_user_idx").on(t.userId),
    index("audit_log_occurred_idx").on(t.occurredAt),
    index("audit_log_rs_idx").on(t.rsId),
    check(
      "audit_log_operation_check",
      sql`${t.operation} IN ('INSERT', 'UPDATE', 'DELETE')`,
    ),
  ],
)

export type AuditLog = typeof auditLogTable.$inferSelect
