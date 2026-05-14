# P1.3 Design Decision — Integration Test Approach

**Status:** ✅ DECIDED — Approach B (Supabase Management API harness)
**Decided in:** Session 2 close (Owner approval, 14 Mei 2026)
**Authority:** Owner direction; do NOT relitigate
**Fresh session action:** Confirm to Owner "menggunakan Approach B" in first turn before executing

---

## The Decision

P1.3 integration tests run against **real Postgres in the Supabase dev project (`gdihcqizwramcmqinqai`)** via the **Management API SQL endpoint** as the harness layer.

NOT via testcontainers Postgres, NOT via Docker, NOT via local Postgres install.

---

## Why Approach B (vs Approach A)

### Approach A — testcontainers Postgres

| Aspect | Assessment |
|---|---|
| Test isolation | ✅ Perfect — each test gets fresh container |
| Sandbox compatibility | ⚠️ Requires Docker daemon; AI sandbox may not have it |
| Setup complexity | ❌ Heavy — install testcontainers, configure DOCKER_HOST, manage container lifecycle |
| Per-test runtime | ❌ Slow — container start ~3-5 sec; full suite minutes |
| Schema bootstrapping | ❌ Need to replay all 4 migrations on each container init |
| First-class for Drizzle | ⚠️ Works but requires careful config |
| Production parity | ⚠️ Standard Postgres image, not Supabase-specific (no `auth.users`, no triggers we wrote against `auth.users`) |

### Approach B — Supabase Management API Harness

| Aspect | Assessment |
|---|---|
| Test isolation | ⚠️ Shared DB — must use unique prefixes / cleanup discipline |
| Sandbox compatibility | ✅ HTTPS only, works everywhere AI works |
| Setup complexity | ✅ Light — wrap `fetch()` to Management API SQL endpoint |
| Per-test runtime | ✅ Fast — single HTTP roundtrip ~200-400ms |
| Schema bootstrapping | ✅ Schema already deployed in real Supabase dev project |
| First-class for Drizzle | ⚠️ Tests query via Management API direct SQL, not Drizzle client — but service layer uses Drizzle so we cover that too via mocked-tx unit tests separately |
| Production parity | ✅ HIGHEST — actual Supabase environment with `auth.users`, triggers, RLS, the real thing |

### Tie-breaker considerations

1. **Sandbox reliability**: Approach A risks "Docker not available" surprise mid-Session 3. Approach B uses HTTPS that's always working.
2. **Pattern already proven**: Session 2 used Management API for diagnostic queries successfully (CP-2.1, CP-2.2 evidence). Re-use that pattern, not invent new infrastructure.
3. **Production parity wins**: The audit trigger function reads `current_setting('app.current_user_id', true)` — this is the actual chain we want to verify. Testcontainers replicates *generic* Postgres; Management API tests the *actual* deployed schema with the actual trigger functions.
4. **Risk profile**: Approach B's main risk is test isolation (parallel tests stepping on each other). Mitigated by uuid-prefixed fixtures + serial test execution (vitest's `sequence.concurrent=false` already configured in Session 2).
5. **Cost asymmetry**: If Approach B fails late in Session 3, fallback to Approach A is hours of work. If Approach A fails (Docker missing), fallback is starting over. Approach B has lower variance.

### Why not BOTH

Approach A in *addition to* B would be redundant: same test surface, double the maintenance. Pick one. Approach B chosen for the reasons above. If multi-modul Phase 2.2 ever wants stricter isolation (e.g., parallel test runs), add Approach A then as optional supplementary, not replacement.

---

## Approach B — Harness Pattern (Reference Code)

This is the seed pattern. Fresh session: adapt as needed for actual P1.3 tests; this is a starting point, not a frozen spec.

### `tests/integration/harness.ts`

```typescript
/**
 * Integration test harness — Supabase Management API.
 *
 * Sends raw SQL queries to the real dev Supabase project via Management API
 * SQL endpoint. Bypasses Drizzle ORM (which is what we're testing); used as
 * setup/teardown/assertion layer outside the system under test.
 *
 * REQUIRES env vars at test runtime:
 *   - SUPABASE_PROJECT_REF
 *   - SUPABASE_MGMT_TOKEN  (sbp_... token, Owner re-shares per session)
 *
 * These are NOT in tests/setup.ts (which uses stubs). Integration tests
 * load real env via dotenv-loading at the top of harness.ts, expecting
 * Owner to populate .env.test (gitignored) or pass via CLI:
 *
 *   SUPABASE_MGMT_TOKEN=$TOKEN npm run test:integration
 */
import { randomUUID } from "node:crypto"

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF
const MGMT_TOKEN = process.env.SUPABASE_MGMT_TOKEN

if (!PROJECT_REF || !MGMT_TOKEN) {
  throw new Error(
    "Integration tests require SUPABASE_PROJECT_REF + SUPABASE_MGMT_TOKEN env vars. " +
    "See bundle/04-CREDENTIALS-MANIFEST.md.",
  )
}

const SQL_ENDPOINT = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`

export async function runSql<T = Record<string, unknown>>(
  query: string,
): Promise<T[]> {
  const res = await fetch(SQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MGMT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Management API SQL failed: HTTP ${res.status} — ${body}`)
  }
  const data = await res.json()
  if (Array.isArray(data)) return data as T[]
  // Error responses are objects with 'message' field
  if (data && typeof data === "object" && "message" in data) {
    throw new Error(`Management API SQL error: ${(data as { message: string }).message}`)
  }
  return []
}

/**
 * Generates a test-isolated prefix for fixture rows.
 * All fixtures created in a test should use this prefix; teardown deletes
 * everything with this prefix, no cross-contamination between tests.
 */
export function testPrefix(): string {
  return `TEST-${randomUUID().slice(0, 8)}`
}

/**
 * Standard teardown — call in test's afterEach.
 * Deletes ALL test-prefixed rows across the operational tables.
 * Audit log rows are append-only by trigger; teardown explicitly bypasses
 * the immutability guard for cleanup using session_replication_role=replica.
 */
export async function cleanFixtures(prefix: string): Promise<void> {
  // Order matters: child tables first to satisfy FK constraints
  await runSql(`DELETE FROM public.encounter WHERE id IN (
    SELECT id FROM public.encounter
    WHERE keluhan_utama LIKE '${prefix}%'
       OR nomor_kunjungan LIKE '${prefix}%'
  );`)

  await runSql(`DELETE FROM public.patient WHERE
    nomor_rekam_medis LIKE '${prefix}%'
    OR nama_lengkap LIKE '${prefix}%';`)

  // Audit log cleanup requires bypassing the immutability trigger.
  // SAFE because we're in a dev/test project and only deleting our own
  // test-prefixed rows by row_id match.
  await runSql(`
    SET session_replication_role = 'replica';
    DELETE FROM public.audit_log WHERE
      (table_name = 'patient' OR table_name = 'encounter')
      AND new_values::text LIKE '%${prefix}%';
    SET session_replication_role = 'origin';
  `)
}

/**
 * Get a baseline RS row id + a test user id to use as actor for service
 * layer calls. Created lazily on first call, cached.
 */
let cachedRsId: string | null = null
let cachedUserId: string | null = null

export async function getTestContext(): Promise<{ rsId: string; userId: string }> {
  if (cachedRsId && cachedUserId) {
    return { rsId: cachedRsId, userId: cachedUserId }
  }
  const rsRows = await runSql<{ id: string }>(
    `SELECT id FROM public.rs WHERE kode_rs = 'RS-BT-020703' LIMIT 1;`,
  )
  if (!rsRows.length) throw new Error("No RS row found — migration 0003 not applied?")
  cachedRsId = rsRows[0].id

  const userRows = await runSql<{ id: string }>(
    `SELECT id FROM public.users WHERE rs_id = '${cachedRsId}' LIMIT 1;`,
  )
  if (!userRows.length) throw new Error("No user row found — Owner needs to signup at least once.")
  cachedUserId = userRows[0].id

  return { rsId: cachedRsId, userId: cachedUserId }
}
```

### Example test pattern — `tests/integration/patient.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { runSql, testPrefix, cleanFixtures, getTestContext } from "./harness"
import { createPatient } from "@/services/patientService"

describe("patientService integration", () => {
  let prefix: string

  beforeEach(() => {
    prefix = testPrefix()
  })

  afterEach(async () => {
    await cleanFixtures(prefix)
  })

  it("creates patient + audit_log INSERT row appears with attribution", async () => {
    const ctx = await getTestContext()

    const result = await createPatient(ctx, {
      nomorRekamMedis: `${prefix}-RM-001`,
      namaLengkap: `${prefix} Test Patient`,
      tanggalLahir: "1990-01-15",
      jenisKelamin: "L",
    })

    expect(result.namaLengkap).toBe(`${prefix} Test Patient`)
    expect(result.version).toBe(1)
    expect(result.createdBy).toBe(ctx.userId)

    // Verify audit_log captured the INSERT
    const auditRows = await runSql<{ operation: string; user_id: string }>(
      `SELECT operation, user_id FROM public.audit_log
       WHERE table_name = 'patient' AND row_id = '${result.id}';`,
    )
    expect(auditRows).toHaveLength(1)
    expect(auditRows[0].operation).toBe("INSERT")
    expect(auditRows[0].user_id).toBe(ctx.userId)
  })

  // ... edit version increment test, optimistic-lock-conflict test, soft-delete test
})
```

---

## What This Decision Locks

| Item | Locked? | Notes |
|---|---|---|
| Test runtime = real Supabase dev DB | ✅ | Cannot use Docker / local PG |
| Cleanup via prefix-based DELETE | ✅ | UUID prefix per test |
| Audit log cleanup uses `session_replication_role=replica` | ✅ | Required since trigger blocks UPDATE/DELETE |
| Fixtures created via Management API SQL, NOT Drizzle | ✅ | Avoids circular dependency (Drizzle is system-under-test for some paths) |
| Service-layer calls use Drizzle (production path) | ✅ | This is what we're testing |
| Tests run serial (vitest `sequence.concurrent=false`) | ✅ | Already configured Session 2; required because shared DB |

---

## What Fresh Session Must NOT Do

❌ Install testcontainers / Docker
❌ Spin up local Postgres
❌ Modify Supabase dev project schema for test convenience (no `_test` suffixed tables)
❌ Run integration tests in CI without Owner-provided sbp_ token (skip via env-guard if missing)
❌ Touch the `audit_log` immutability trigger to make cleanup easier (use `session_replication_role` bypass pattern)

---

## Owner Sign-Off Recap

**Session 2 close, 14 Mei 2026, Owner approval:**
> "Approach B (testcontainers vs Management API harness) — Approach B."

This document operationalizes that approval into concrete patterns. Fresh session: confirm understanding to Owner in turn 1 with this exact phrase:

> "Approach B confirmed (Management API harness, real Supabase dev DB, UUID-prefixed cleanup). Ready to proceed?"

Wait for Owner's "ya" before writing the harness file.

---

*End of design decision.*
