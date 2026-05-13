/**
 * Drizzle database connection.
 *
 * Uses Supabase Supavisor pooler (port 6543, transaction mode) at runtime.
 * Transaction mode is the correct choice for serverless (Vercel) — short-lived
 * connections that should not hold state across function invocations.
 *
 * NOTE: Direct DB connection (port 5432, IPv6-only on Free tier) is used
 * ONLY by drizzle-kit for migrations from a developer machine. The app
 * runtime always uses the pooler URL set in DATABASE_URL env var.
 */
import "server-only"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "@/db/schema"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL not set")
}

// `prepare: false` recommended for Supavisor transaction pooler
// (prepared statements not supported across pooled connections).
const queryClient = postgres(connectionString, {
  prepare: false,
  // Connection pool size — serverless = 1 per invocation typically
  max: 1,
})

export const db = drizzle(queryClient, { schema })
export type Database = typeof db
