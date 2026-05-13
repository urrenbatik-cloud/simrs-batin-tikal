/**
 * Audit context helper.
 *
 * Per Blueprint v2.0 §5.6.1: BEFORE INSERT/UPDATE triggers populate audit
 * columns by reading current_setting('app.current_user_id', true). This helper
 * wraps a service call in a transaction with SET LOCAL so the trigger has
 * what it needs.
 *
 * Use pattern (from Server Actions / Route Handlers):
 *
 *   const result = await withAuditContext(userId, async (tx) => {
 *     return tx.insert(patientTable).values({...}).returning();
 *   });
 *
 * The transaction commits on success or rolls back on error.
 */
import "server-only"
import { sql } from "drizzle-orm"
import type { ExtractTablesWithRelations } from "drizzle-orm"
import type { PgTransaction } from "drizzle-orm/pg-core"
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js"
import { db } from "@/db"
import * as schema from "@/db/schema"

export type Tx = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>

/**
 * Execute callback inside a transaction with SET LOCAL app.current_user_id.
 *
 * If userId is null/undefined, the audit triggers will raise. Service layer
 * therefore MUST always have a resolved user id from auth before calling
 * this helper (returns 401-ready error if no auth).
 */
export async function withAuditContext<T>(
  userId: string,
  fn: (tx: Tx) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    // SET LOCAL — confined to this transaction, auto-cleared on COMMIT/ROLLBACK
    await tx.execute(sql`SET LOCAL app.current_user_id = ${userId}`)
    return fn(tx)
  })
}

/**
 * Read-only operations don't strictly need audit context (no triggers fire on
 * SELECT). But we expose this for consistency + future audit-on-read patterns.
 */
export async function withReadContext<T>(
  userId: string | null,
  fn: (tx: Tx) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    if (userId) {
      await tx.execute(sql`SET LOCAL app.current_user_id = ${userId}`)
    }
    return fn(tx)
  })
}
