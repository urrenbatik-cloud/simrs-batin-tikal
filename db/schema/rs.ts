/**
 * rs — Master Rumah Sakit (Tenants).
 *
 * Per Blueprint v2.0 §5.6.6: rs_id propagates to every operational table.
 * Initial deployment = 1 RS (RS Tk.IV 02.07.03 Batin Tikal); G5 Karumkit
 * vision = multi-RS network. Schema multi-tenant ready from day 1; RLS
 * policies defined (see migrations) but activation deferred per Phase 0 EXIT.
 *
 * NOTE: rs table itself has NO audit/rs_id columns — it is the root tenant
 * definition. Created/updated metadata tracked via audit_log entries.
 */
import { sql } from "drizzle-orm"
import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core"

export const rsTable = pgTable("rs", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  // Semantic ID (TNI AD context)
  kodeRs: text("kode_rs").notNull().unique(),
  namaRs: text("nama_rs").notNull(),

  // Flexible attribution per Blueprint pattern (JSONB envelope)
  // Holds: { satker, kotama, alamat, kontak, akreditasi, ... }
  profilRs: jsonb("profil_rs"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
})

export type Rs = typeof rsTable.$inferSelect
export type RsInsert = typeof rsTable.$inferInsert
