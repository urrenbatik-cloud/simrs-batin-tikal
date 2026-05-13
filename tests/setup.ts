/**
 * Vitest global setup — runs before any test module evaluates.
 *
 * The Drizzle/postgres.js connection in db/index.ts throws if DATABASE_URL
 * is missing. Service files transitively import db. We populate stub
 * values here so module evaluation succeeds; tests that exercise actual
 * DB calls should be integration tests (separate folder/run target),
 * never unit tests.
 */
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://stub:stub@localhost:5432/stub"
process.env.NEXT_PUBLIC_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://stub.supabase.co"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "stub-anon"
process.env.SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "stub-service"
