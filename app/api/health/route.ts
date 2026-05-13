import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { db } from "@/db"

/**
 * Debug health endpoint — checks DB connectivity from Vercel runtime.
 * Returns JSON instead of crashing the app, so we can diagnose issues.
 *
 * Public route (no auth) — safe because it only returns connectivity status,
 * never user data.
 */
export async function GET() {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      hasDbUrl: !!process.env.DATABASE_URL,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  }

  try {
    const result = await db.execute(sql`SELECT 1 AS ok, current_database() AS db, version() AS pg_version`)
    checks.db = {
      ok: true,
      row: Array.isArray(result) ? result[0] : result,
    }
  } catch (err) {
    checks.db = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack?.split("\n").slice(0, 5) : undefined,
    }
  }

  try {
    const result = await db.execute(
      sql`SELECT COUNT(*)::int AS rs_count FROM public.rs`,
    )
    checks.tables = {
      ok: true,
      rs_count: Array.isArray(result) ? result[0] : result,
    }
  } catch (err) {
    checks.tables = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    }
  }

  return NextResponse.json(checks, { status: 200 })
}
