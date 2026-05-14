# SIMRS Batin Tikal — Session 3 EXIT

**Status:** ✅ Session 3 closed — P1.3 integration tests in place via Hybrid γ
**Tanggal:** 14 Mei 2026
**Owner:** dr Ferry
**Predecessor:** Session 2 EXIT (`1387a19`)
**Successor:** Session 4 (recommendations at bottom)

---

## Mission Accomplished

| Goal | Status |
|---|---|
| Bootstrap from handover bundle (anti-drift) | ✅ Hash verified, MANIFEST OK, mandatory reading done |
| P0 live state re-verification | ✅ Bundle commit matches HEAD; DB state matches baseline |
| **P1.3 — Integration tests** | ✅ Hybrid γ: SQL path (sandbox) + Drizzle path (Owner-local) |
| Test baseline floor §C | ✅ 61 unit tests preserved; integration tests *added*, not replaced |
| Owner Policy §J paired commit+push | ✅ 3 commits, each pushed immediately |
| Owner Policy §L credential hygiene | ✅ PAT scrubbed from `.git/config`, no tokens in logs |
| Vercel region perf incident | ✅ Diagnosed + Owner fixed (us → sin1) |

## Test Baseline (Session 3 → Session 4 invariant)

```
Default (npm test, no integration env):
  Test Files: 4 passed | 4 skipped (8)
  Tests:      61 passed | 34 skipped (95)
  TS errors:  0

Integration sandbox (npm run test:integration, real env):
  Test Files: 4 passed (4)
  Tests:      18 SQL pass | 16 Drizzle skip (34)
  Duration:   ~165s

Integration full (with INTEGRATION_DIRECT_POSTGRES=1):
  Expected:   34 pass | 0 skip
  Owner verifies locally — sandbox lacks raw pg egress
```

**Per Owner Policy §C: 61 unit tests is the floor. The 34 integration tests are additive — they do not count against the unit-test invariant. Total Session 3 floor = 61 unit + 34 integration = 95 total.**

## What Hybrid γ Means

Each integration test file has two `describe` blocks gated independently:

```typescript
describe.skipIf(!hasIntegrationEnv())(
  "service — SQL path (Management API)", ...
)

describe.skipIf(!hasDirectPostgresEgress())(
  "service — Drizzle path (service layer)", ...
)
```

Two paths cover two concerns:

**SQL path** verifies DB-side semantics directly — audit triggers, optimistic-lock primitive, CHECK constraints, FK enforcement, state transitions, audit_log immutability. Uses raw SQL via the Supabase Management API's `/database/query` endpoint (HTTPS only — no Postgres protocol needed). The audit-context wrapper `BEGIN; SET LOCAL app.current_user_id = '<uid>'; <user query>; COMMIT` mirrors the production `withAuditContext` pattern.

**Drizzle path** verifies service-layer orchestration — that `createPatient`/`updatePatient`/`closeEncounter` correctly compose the primitives and throw typed errors (`PatientVersionConflictError`, `EncounterStateError`, etc) on the expected paths. Uses the real `postgres.js` driver over raw TCP to the Supavisor pooler.

The two paths overlap deliberately — when both pass, you know the DB AND the service layer agree. The SQL path is sandbox-runnable (HTTPS-only egress); the Drizzle path needs full pg egress so it's gated by `INTEGRATION_DIRECT_POSTGRES=1` and verified locally by Owner.

## Tests by File

| File | SQL pass | Drizzle (skipped here) | Coverage |
|---|---:|---:|---|
| `tests/integration/patient.test.ts` | 8 | 5 | INSERT audit, UPDATE version, optimistic lock, audit immutability, CHECK constraints (jenis_kelamin, NIK), audit context missing, soft delete + service equivalents |
| `tests/integration/encounter.test.ts` | 4 | 6 | INSERT with status default, FK to patient, close transition, optimistic lock + service equivalents (nomor_kunjungan generation, type-code mapping, state machine errors) |
| `tests/integration/audit.test.ts` | 3 | 3 | INSERT+UPDATE attribution, old_values nullability, occurred_at monotonic + service queries (getAuditTrailForEntity, queryAuditLog filters) |
| `tests/integration/auth.test.ts` | 3 | 2 | users.email UNIQUE, role values, deleted_at exclusion + service queries (users SELECT via Drizzle) |
| **Total** | **18** | **16** | |

## Key Discoveries This Session

### 1. Sandbox Network Constraint
The dev sandbox egress proxy allows HTTPS port 443 only — Postgres protocol (port 6543 Supavisor) is blocked at TCP layer. Connection attempts to `aws-0-ap-southeast-1.pooler.supabase.com:6543` time out with CONNECT_TIMEOUT. This was the trigger for Hybrid γ: instead of forcing all tests through Drizzle (and skipping all of them in sandbox), the SQL path runs the same DB-side assertions through HTTPS.

### 2. Management API Multi-Statement Result Semantics
The `/database/query` endpoint returns the rows of the LAST statement that produced any output. If the last statement returned zero rows, the API falls back to the prior statement. This caused the optimistic-lock test to fail initially: `SELECT set_config(...); UPDATE WHERE version=stale` returned the `set_config` row (1 row) instead of an empty result.

Fix: wrap user queries in `BEGIN; SET LOCAL app.current_user_id = '<uid>'; <query>; COMMIT`. COMMIT returns nothing, so the API surfaces the user query's RETURNING rows — correctly empty when zero matched. As a bonus, `SET LOCAL` is identical-semantic to the production `set_config(..., is_local=true)` but cleaner-reading; we can use it here because Management API takes literal SQL (no parameter binding, unlike Drizzle's `sql` template that parameterizes).

### 3. audit_log Cleanup Requires Trigger Bypass
The audit_log immutability trigger (migration 0001) raises on UPDATE/DELETE — by design. Test teardown needs to clean rows that fail-loud trigger would block. Solution: `SET session_replication_role = 'replica'` for the duration of the DELETE, then restore to `'origin'`. This bypass is documented as test-teardown-only and never permitted from application code.

### 4. Per-test Management API Latency
Each Management API call is ~300–1500 ms. Cumulative across 4–6 sequential calls per test (insert + assert + audit query + cleanup), default vitest 5s timeout is too tight. Mitigations: bumped `testTimeout` and `hookTimeout` to 20s; batched `cleanFixtures` from 3 round-trips to 1 multi-statement call. Total integration suite ~165s for 18 SQL tests.

### 5. Vercel Region Performance (Off-Track Bonus)
During session, Owner noticed SIMRS-BT slower than SIKESUMA in production. Root cause: Vercel function region was `iad1` (us-east) while Supabase is `ap-southeast-1` (Singapore) — every server-rendered request had ~250ms RTT to DB. Owner switched Vercel region to `sin1` (Singapore); app immediately fast. Documented as ranked perf hypotheses; #1 hypothesis confirmed correct. Optional `vercel.json` lock proposed but deferred (not committed).

Remaining hypotheses for future investigation (independent of region):
- #2: 3× sequential `supabase.auth.getUser()` per request (middleware + layout + page) — likely the next biggest contributor
- #3: `force-dynamic` everywhere may cache more aggressively
- #4: Cold start on first request
- #5: Heavy UI deps in initial bundle
- #6: Redundant users SELECT in `getCurrentSession`

## Owner Verification Step

To run the Drizzle path locally and confirm 34/34 integration tests pass:

```bash
# In project root, with .env.local containing the dev credentials
export INTEGRATION_DIRECT_POSTGRES=1
export SUPABASE_PROJECT_REF=gdihcqizwramcmqinqai
export SUPABASE_MGMT_TOKEN=<sbp_... from temporary_supabase.txt>
export DATABASE_URL=<pooler URL from .env.local>
npm run test:integration
```

Expected output:
```
Tests: 34 passed (34)
Duration: ~3 minutes
```

If Drizzle path tests fail with timeout/connection errors locally, check:
1. Owner's network can reach `aws-0-ap-southeast-1.pooler.supabase.com:6543` (firewall, VPN, hotspot tethering)
2. DATABASE_URL pooler password is correct
3. `INTEGRATION_DIRECT_POSTGRES=1` actually set in shell

## Commits This Session

```
06027b3 feat(tests/integration): Approach B harness — Management API SQL adapter
2aa8e0c test(integration): patient + encounter — hybrid γ (SQL path + Drizzle path)
7c18c60 test(integration): audit + auth — hybrid γ (DB invariants + service queries)
[this commit] docs: Session 3 EXIT — P1.3 hybrid γ finalized
```

Each commit was paired with a push immediately per Owner Policy §J. PAT-via-URL pattern used for push; `.git/config` scrubbed after each per §L.2 (no PAT persisted in repo working tree).

## Files Created This Session

```
tests/integration/harness.ts          # 250 LOC — Management API adapter + gates + cleanup
tests/integration/patient.test.ts     # 13 tests (8 SQL + 5 Drizzle)
tests/integration/encounter.test.ts   # 10 tests (4 SQL + 6 Drizzle)
tests/integration/audit.test.ts       # 6 tests (3 SQL + 3 Drizzle)
tests/integration/auth.test.ts        # 5 tests (3 SQL + 2 Drizzle)
vitest.config.ts                      # MOD — testTimeout/hookTimeout 20s
package.json                          # MOD — added "test:integration" script
SESSION-3-EXIT.md                     # this file
CHECKPOINT-LOG.md                     # MOD — CP-3.1 to CP-3.5 entries
```

## What's NOT in This Session (Scope Honored)

- **No P4** (Vercel API token rotation) — token budget priority allocated to P1.3 thoroughness
- **No `vercel.json` region lock-in** — dashboard setting is sufficient; codifying it is a separate concern (5-line commit, Session 4 candidate)
- **No new modul** (Lab, Prescription, Billing) — Phase 2.2 per Blueprint is post-MVP
- **No UI polish** (bulk operations, dashboards, password reset) — Phase 2.x post-MVP
- **No CI runner setup** — Owner runs tests locally; future GitHub Actions integration is Session 4+ candidate

## Session 4 Recommendations

**Option A: Stabilize + Demo (low risk, high signal)**
1. Owner runs full integration suite locally to confirm 34/34 pass with `INTEGRATION_DIRECT_POSTGRES=1`
2. Optional: commit `vercel.json` `{"regions": ["sin1"]}` to lock region preference in source
3. Karumkit demo per `docs/DEMO-SCRIPT.md` 5-min flow
4. Update DEMO-SCRIPT and KARUMKIT-BRIEF with any new findings from rehearsal

**Option B: GitHub Actions CI (deferred from this session)**
- Set up Actions runner with full network egress to run integration suite on every push
- Use Supabase Management Token as repo secret (read-only restricted token if available)
- Gate merges to main on green integration suite
- Estimated ~1 session

**Option C: Performance hypotheses #2+ (perf followup)**
- Profile production with sin1 region locked in
- If still slow, attack hypothesis #2 (3× auth check) — consolidate `getCurrentSession` calls
- Optionally hypothesis #6 (redundant users SELECT in session resolution)
- Estimated half-session

**Option D: Phase 2.2 modul** (Lab, Prescription, Billing per Blueprint § Encounter-as-Convergence)
- Only after Option A demo confirms current scope satisfies stakeholders
- Each modul adds: table + service + UI + integration tests (~1 session per modul minimum)

**Strong recommendation: Option A first.** Demo readiness is the bottleneck; perf + CI + modul expansion all come after stakeholder validation of current MVP.

## Sign-off

Session 3 substantively complete. Code committed + pushed to
`urrenbatik-cloud/simrs-batin-tikal` main branch via paired commit-push per §J.

Architectural patterns from Blueprint v2.0 honored — no scope creep into
deferred patterns. Hybrid γ pattern documented for any future test additions.

Owner action items: (1) verify integration suite locally with full pg egress
(`INTEGRATION_DIRECT_POSTGRES=1 npm run test:integration` should give 34/34
pass), (2) decision on Session 4 direction.

Next AI session can pick up from this exit document + bootstrap from
`handover/session-3/` bundle structure if needed (a Session 4 bundle is not
required — `handover/session-3/` remains the source of truth for project
state, with this EXIT doc layering on top).

Baseline = 61 unit + 34 integration / 0 TS errors / build green / all
pushed.

---

*End of Session 3 EXIT.*
