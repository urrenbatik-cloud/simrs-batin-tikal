import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { db } from "@/db"

function deepError(err: unknown): unknown {
  if (!(err instanceof Error)) return String(err)
  const out: Record<string, unknown> = {
    name: err.name,
    message: err.message,
  }
  // Drizzle wraps the underlying postgres.js error in `cause`
  const e = err as Error & { cause?: unknown; code?: unknown }
  if (e.cause) out.cause = deepError(e.cause)
  if (e.code) out.code = e.code
  return out
}

export async function GET() {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      hasDbUrl: !!process.env.DATABASE_URL,
      dbUrlPrefix: process.env.DATABASE_URL?.slice(0, 30) + "...",
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nodeVersion: process.version,
    },
  }

  // Test 1: HTTPS to Supabase REST (control — no DB pooler involved)
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rs?select=id,kode_rs&limit=1`
    const resp = await fetch(url, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    })
    checks.supabaseRest = {
      ok: resp.ok,
      status: resp.status,
      body: await resp.json().catch(() => null),
    }
  } catch (err) {
    checks.supabaseRest = { ok: false, error: deepError(err) }
  }

  // Test 2: Drizzle via Supavisor pooler
  try {
    const result = await db.execute(
      sql`SELECT 1 AS ok, current_database() AS db`,
    )
    checks.drizzlePooler = { ok: true, row: result }
  } catch (err) {
    checks.drizzlePooler = { ok: false, error: deepError(err) }
  }

  return NextResponse.json(checks, { status: 200 })
}
