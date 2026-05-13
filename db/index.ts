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

// Supavisor pooler REQUIRES SSL. postgres.js doesn't enable SSL by default
// unless URL has ?sslmode=require OR ssl option passed explicitly.
// We pass it explicitly to avoid relying on URL formatting in env vars.
//
// `prepare: false` is mandatory for Supavisor transaction pooler — prepared
// statements aren't supported across pooled connections.
//
// `max: 1` because each serverless invocation creates its own client; no need
// to pool within a single Lambda execution.
const queryClient = postgres(connectionString, {
  prepare: false,
  max: 1,
  ssl: "require",
  // Surface connection errors with context (vs silent timeouts)
  connect_timeout: 10,
  idle_timeout: 20,
  onnotice: () => {}, // suppress NOTICE noise
})

export const db = drizzle(queryClient, { schema })
export type Database = typeof db
