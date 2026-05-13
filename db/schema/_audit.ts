/**
 * Universal audit + tenancy columns.
 *
 * Implements Blueprint v2.0 §5.6.1 (Mandatory Audit Trail):
 *   - created_at / created_by / updated_at / updated_by — actor attribution
 *   - deleted_at / deleted_by — soft delete (P1-C selective permanence)
 *   - version BIGINT — optimistic locking (§5.6.2 Concurrency Control)
 *
 * Implements Blueprint v2.0 §5.6.6 (Multi-Tenant Schema):
 *   - rs_id — tenant scoping; RLS policies enabled later when 2+ RS reality
 *
 * NOTE: created_at/updated_at population is handled by DB triggers
 * (see db/migrations/0000_*.sql) reading current_setting('app.current_user_id').
 * Triggers are the single allowed exception to DB-passive philosophy (P7-B
 * preserved at service layer; audit triggers required for §5.6.1 cascade benefit).
 */
import { sql } from "drizzle-orm"
import {
  bigint,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { rsTable } from "./rs"
import { usersTable } from "./users"

// Helper — call inside pgTable column builder to spread universal columns.
// Drizzle pattern: spread into object literal.
export const auditColumns = () => ({
  // Tenancy
  rsId: uuid("rs_id")
    .notNull()
    .references(() => rsTable.id),

  // Audit (populated by triggers; defaults are safety nets)
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => usersTable.id),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedBy: uuid("updated_by")
    .notNull()
    .references(() => usersTable.id),

  // Soft delete
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  deletedBy: uuid("deleted_by").references(() => usersTable.id),

  // Optimistic locking
  version: bigint("version", { mode: "number" }).notNull().default(1),
})
