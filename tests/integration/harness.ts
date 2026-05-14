/**
 * Integration test harness — Supabase Management API (Approach B).
 *
 * Sends raw SQL queries to the real dev Supabase project via Management API
 * SQL endpoint. Bypasses Drizzle ORM (which is what we're testing for the
 * service layer); used here as a setup/teardown/assertion layer OUTSIDE the
 * system under test.
 *
 * Per `handover/session-3/bundle/03-P1-3-DESIGN-DECISION.md`:
 *   - Test isolation via UUID-prefixed fixtures (`TEST-{uuid8}-`)
 *   - Cleanup via DELETE in dependency order (encounter → patient)
 *   - audit_log cleanup uses `session_replication_role=replica` to bypass
 *     the immutability trigger (defined in migration 0001)
 *   - Tests run serial (vitest sequence.concurrent=false — already configured)
 *
 * REQUIRED env vars at test runtime:
 *   SUPABASE_PROJECT_REF   — e.g. "gdihcqizwramcmqinqai"
 *   SUPABASE_MGMT_TOKEN    — sbp_... token (Owner re-shares per session, §W.3)
 *   DATABASE_URL           — pooler URL (Drizzle uses this for service calls)
 *
 * If any of these is missing, the harness throws at first use — NOT at
 * module load — so unit tests that transitively import nothing here still
 * work in CI without integration credentials.
 *
 * Usage in tests (note: harness is intentionally vitest-agnostic so it can
 * also be invoked from one-off scripts; test files import `describe` from
 * vitest themselves and combine with `hasIntegrationEnv()`):
 *
 *   import { describe, it, expect, beforeEach, afterEach } from "vitest"
 *   import {
 *     hasIntegrationEnv, getTestContext, runSql, cleanFixtures, testPrefix,
 *   } from "./harness"
 *
 *   describe.skipIf(!hasIntegrationEnv())("patientService", () => {
 *     let prefix: string
 *     beforeEach(() => { prefix = testPrefix() })
 *     afterEach(async () => { await cleanFixtures(prefix) })
 *
 *     it("...", async () => { ... })
 *   })
 *
 * `describe.skipIf(true)` skips the whole block (not failed) when env vars
 * are absent — so `npm test` without sbp_ token still passes the floor.
 */
import { randomUUID } from "node:crypto"

const PROJECT_REF_ENV = "SUPABASE_PROJECT_REF"
const MGMT_TOKEN_ENV = "SUPABASE_MGMT_TOKEN"
const DATABASE_URL_ENV = "DATABASE_URL"
const DIRECT_PG_ENV = "INTEGRATION_DIRECT_POSTGRES"

// A DATABASE_URL that hits localhost or `stub` is the unit-test stub from
// `tests/setup.ts` — integration tests need a real pooler URL.
const STUB_URL_MARKERS = ["localhost:5432/stub", "stub:stub@"]

/**
 * Gates SQL-path integration tests (Management API HTTPS, sandbox-runnable).
 * Returns true iff SUPABASE_PROJECT_REF, SUPABASE_MGMT_TOKEN, and a
 * real (non-stub) DATABASE_URL are all present.
 */
export function hasIntegrationEnv(): boolean {
  const ref = process.env[PROJECT_REF_ENV]
  const token = process.env[MGMT_TOKEN_ENV]
  const dbUrl = process.env[DATABASE_URL_ENV]
  if (!ref || !token || !dbUrl) return false
  if (STUB_URL_MARKERS.some((m) => dbUrl.includes(m))) return false
  return true
}

/**
 * Additional gate for Drizzle-path integration tests. These tests call
 * service functions (createPatient, etc.) which use the postgres.js driver
 * over raw TCP to the Supavisor pooler. Environments without TCP egress on
 * port 6543 (e.g. some CI sandboxes or development containers behind
 * HTTPS-only egress proxies) will time out.
 *
 * Owner opts in by setting INTEGRATION_DIRECT_POSTGRES=1 when running tests
 * locally (vercel dev, GH Actions runner with full network). Default off:
 * skip cleanly when not set, so SQL-path tests can still run sandboxed.
 *
 * Per `handover/session-3/bundle/03-P1-3-DESIGN-DECISION.md` and Session 3
 * discovery: the original Approach B design assumed Drizzle path. Hybrid
 * γ retains it but gates it so it only fires where it can succeed.
 */
export function hasDirectPostgresEgress(): boolean {
  if (!hasIntegrationEnv()) return false
  const flag = process.env[DIRECT_PG_ENV]
  return flag === "1" || flag === "true"
}

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) {
    throw new Error(
      `Integration test env var "${name}" is missing. ` +
        `See handover/session-3/bundle/04-CREDENTIALS-MANIFEST.md for the ` +
        `Owner re-share pattern. Required: ${PROJECT_REF_ENV}, ` +
        `${MGMT_TOKEN_ENV}, ${DATABASE_URL_ENV}.`,
    )
  }
  return v
}

function sqlEndpoint(): string {
  return `https://api.supabase.com/v1/projects/${requireEnv(PROJECT_REF_ENV)}/database/query`
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${requireEnv(MGMT_TOKEN_ENV)}`,
    "Content-Type": "application/json",
    "User-Agent": "simrs-bt-integration-harness/1.0",
  }
}

/**
 * Execute raw SQL via Management API and return rows.
 *
 * On error, throws with the API's message text so test failures surface the
 * actual DB error (foreign key violations, check constraints, raised
 * exceptions from triggers, etc).
 */
export async function runSql<T = Record<string, unknown>>(
  query: string,
): Promise<T[]> {
  const res = await fetch(sqlEndpoint(), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ query }),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(
      `Management API SQL failed (HTTP ${res.status}): ${text.slice(0, 500)}`,
    )
  }
  const data = JSON.parse(text)
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === "object" && "message" in data) {
    throw new Error(
      `Management API SQL error: ${(data as { message: string }).message}`,
    )
  }
  return []
}

/**
 * Execute SQL with `app.current_user_id` set on the session — mirrors what
 * `lib/audit-context.ts withAuditContext()` does in production code.
 *
 * The audit trigger (`fn_fill_audit_columns`, migration 0001) reads
 * `current_setting('app.current_user_id', true)` to attribute INSERT/UPDATE
 * authorship. Service layer calls set_config(..., true) inside a Drizzle
 * transaction; this helper reproduces that mechanism in test SQL.
 *
 * The query is wrapped in BEGIN / SET LOCAL / <user query> / COMMIT.
 * Reasons:
 *
 *   1. SET LOCAL ties the setting to the explicit transaction and clears it
 *      on COMMIT — identical semantics to the production withAuditContext.
 *
 *   2. The Management API SQL endpoint returns the rows of the LAST statement
 *      that produced any. COMMIT returns nothing, so the API falls back to
 *      the user's query — which correctly returns its RETURNING rows (or []
 *      when zero rows matched, as expected for optimistic-lock-style tests).
 *      Without this wrapping, a UPDATE/DELETE that matched zero rows would
 *      surface the `set_config()` SELECT row instead of [].
 *
 *   3. SET LOCAL accepts a literal value here (no parameter binding through
 *      Management API), which avoids the constraint that forced production
 *      code to use set_config(name, value, true) instead (Drizzle's sql
 *      template always parameterizes — see lib/audit-context.ts comment).
 */
export async function runSqlAsUser<T = Record<string, unknown>>(
  userId: string,
  query: string,
): Promise<T[]> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    throw new Error(`runSqlAsUser: userId is not a UUID: ${userId}`)
  }
  // Strip a single trailing semicolon if present so we own statement
  // delimitation deterministically.
  const trimmed = query.trim().replace(/;\s*$/, "")
  return runSql<T>(`
    BEGIN;
    SET LOCAL app.current_user_id = '${userId}';
    ${trimmed};
    COMMIT;
  `)
}

/**
 * Generates a test-isolated prefix for fixture rows. All fixtures created in
 * a test should embed this prefix in a text field (nama_lengkap,
 * keluhan_utama, etc.) so cleanFixtures can find and delete them.
 *
 * 8 hex chars = 16M unique prefixes; collision risk negligible within a
 * single test run.
 */
export function testPrefix(): string {
  return `TEST-${randomUUID().slice(0, 8)}`
}

/**
 * Tear down all fixtures created under the given prefix. Run from afterEach.
 *
 * Order matters:
 *   1. encounter rows (FK to patient — must go before patient)
 *   2. patient rows
 *   3. audit_log rows pointing at the deleted rows (immutability trigger
 *      bypassed via session_replication_role=replica)
 *
 * The audit_log cleanup uses LIKE on new_values::text to find rows that
 * captured the prefix. Without this, repeated test runs would accumulate
 * audit history forever in the dev DB.
 *
 * SAFE because:
 *   - Runs only in the dev project (`gdihcqizwramcmqinqai`)
 *   - Only deletes rows whose JSONB or text fields contain the test's UUID
 *     prefix — never touches Owner's manually-created fixtures
 */
export async function cleanFixtures(prefix: string): Promise<void> {
  if (!prefix.startsWith("TEST-")) {
    throw new Error(
      `cleanFixtures refusing to run with non-test prefix "${prefix}" — ` +
        `safety guard against accidentally targeting real data.`,
    )
  }

  // Batch all teardown into a single Management API call (multi-statement)
  // to cut latency. Statement order matters:
  //   1. encounter (FK → patient must go first)
  //   2. patient
  //   3. audit_log with immutability trigger bypassed via
  //      session_replication_role='replica' (test-teardown-only)
  await runSql(`
    DELETE FROM public.encounter
    WHERE keluhan_utama LIKE '${prefix}%'
       OR nomor_kunjungan LIKE '%${prefix}%';

    DELETE FROM public.patient
    WHERE nomor_rekam_medis LIKE '${prefix}%'
       OR nama_lengkap LIKE '${prefix}%';

    SET session_replication_role = 'replica';
    DELETE FROM public.audit_log
    WHERE (table_name = 'patient' OR table_name = 'encounter')
      AND (
        (new_values->>'nama_lengkap') LIKE '${prefix}%' OR
        (new_values->>'nomor_rekam_medis') LIKE '${prefix}%' OR
        (new_values->>'keluhan_utama') LIKE '${prefix}%' OR
        (new_values->>'nomor_kunjungan') LIKE '%${prefix}%' OR
        (old_values->>'nama_lengkap') LIKE '${prefix}%' OR
        (old_values->>'nomor_rekam_medis') LIKE '${prefix}%' OR
        (old_values->>'keluhan_utama') LIKE '${prefix}%' OR
        (old_values->>'nomor_kunjungan') LIKE '%${prefix}%'
      );
    SET session_replication_role = 'origin';
  `)
}

/**
 * Resolves rs.id + a usable user.id for service calls. Cached after first
 * resolution since these are stable references for the lifetime of the test
 * process.
 *
 * The user is taken from whatever already exists in users (Owner created at
 * least one via signup during Session 1/2). If none exists, throws — Owner
 * needs to signup at least once in the app before integration tests work.
 */
let cachedRsId: string | null = null
let cachedUserId: string | null = null

export async function getTestContext(): Promise<{
  rsId: string
  userId: string
}> {
  if (cachedRsId && cachedUserId) {
    return { rsId: cachedRsId, userId: cachedUserId }
  }
  const rsRows = await runSql<{ id: string }>(
    `SELECT id FROM public.rs WHERE kode_rs = 'RS-BT-020703' LIMIT 1;`,
  )
  if (!rsRows.length) {
    throw new Error(
      "No rs row with kode_rs='RS-BT-020703' — migration 0003_seed_rs.sql " +
        "appears not to have run on this project.",
    )
  }
  cachedRsId = rsRows[0].id

  const userRows = await runSql<{ id: string }>(
    `SELECT id FROM public.users
     WHERE rs_id = '${cachedRsId}' AND deleted_at IS NULL
     ORDER BY created_at ASC
     LIMIT 1;`,
  )
  if (!userRows.length) {
    throw new Error(
      "No active user in users table for this rs. Owner needs to signup " +
        "at least once via the app before integration tests can run.",
    )
  }
  cachedUserId = userRows[0].id

  return { rsId: cachedRsId, userId: cachedUserId }
}

/**
 * Convenience SQL escape — wrap a string literal for safe interpolation
 * into a SQL fragment when bind parameters aren't available (Management API
 * SQL endpoint doesn't accept them).
 *
 * Doubles single quotes per SQL string-literal rules. Use ONLY for values
 * that have already been validated by the calling code; never for arbitrary
 * untrusted input (the harness is test-only, but discipline matters).
 */
export function sqlString(s: string): string {
  return `'${s.replace(/'/g, "''")}'`
}
