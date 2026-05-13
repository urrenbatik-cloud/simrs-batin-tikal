/**
 * users — Application user profile, joined to Supabase Auth.
 *
 * Pattern:
 *   - id mirrors auth.users.id (UUID) — one-to-one with Supabase Auth row
 *   - Trigger on auth.users INSERT auto-creates users row (see migrations)
 *
 * Per Phase 0 EXIT: simple `role TEXT` column for MVP; full 4-table RBAC
 * (§5.6.7) deferred until complexity demands.
 *
 * users table itself avoids circular dep on auditColumns helper (it's referenced BY
 * audit helper). Manual timestamps only.
 */
import { sql } from "drizzle-orm"
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { rsTable } from "./rs"

export const usersTable = pgTable("users", {
  // Mirrors auth.users.id from Supabase Auth schema
  id: uuid("id").primaryKey(),

  // Profile
  email: text("email").notNull().unique(),
  namaLengkap: text("nama_lengkap").notNull(),

  // Initial tenancy (which RS this user primarily belongs to)
  rsId: uuid("rs_id")
    .notNull()
    .references(() => rsTable.id),

  // Simple role for MVP — full RBAC deferred per Phase 0 EXIT
  // Values: 'admin' | 'dokter' | 'perawat' | 'pendaftaran' | 'kasir' | 'auditor'
  role: text("role").notNull().default("pendaftaran"),

  // Soft delete (user deactivation)
  deletedAt: timestamp("deleted_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
})

export type User = typeof usersTable.$inferSelect
export type UserInsert = typeof usersTable.$inferInsert
