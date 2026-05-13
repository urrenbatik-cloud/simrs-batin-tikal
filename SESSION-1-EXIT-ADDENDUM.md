# SIMRS Batin Tikal — Session 1 EXIT Addendum

**Tanggal:** 14 Mei 2026 (continued from SESSION-1-EXIT.md baseline)
**Status:** Session 1 closed — partial demo capability achieved, encounter create unresolved
**Successor:** Session 2 — local dev setup + encounter bug resolution + smoke test completion

This addendum supplements `SESSION-1-EXIT.md` with everything learned from
the live-deploy bug hunt during Owner's stakeholder smoke test. The
baseline document captured what was built; this captures what BROKE and
how we fixed (or didn't) each issue.

---

## What Actually Got Deployed & Working (Live)

URL: **https://simrs-batin-tikal.vercel.app**

| Capability | Status |
|---|---|
| Signup → login flow | ✅ Working |
| Patient list (empty state) | ✅ Working |
| **Patient create** | ✅ Working (verified by Owner: created "Tn Dummy B") |
| **Patient edit + audit trail** | ✅ Working (verified version increment 1→2) |
| **Audit log capture (INSERT + UPDATE)** | ✅ Verified in DB |
| Encounter create | ❌ **Broken** — Vercel 500, root cause not isolated |
| Encounter close/cancel | ⏳ Untested (gated by create) |
| Cross-encounter list | ⏳ Untested |
| Universal audit log viewer | ⏳ Untested |
| Logout | ✅ Likely working (auth path verified) |

**Demo-ready scope:** patient registration + audit trail. This alone
demonstrates the value proposition (every action tracked, modern UX,
multi-RS-ready) to Karumkit/Sie Renbang Angga. Encounter scope must be
fixed before showing P3-D Encounter-as-Convergence story.

---

## Bug-Fix Log (Chronological, Each With Root Cause + Lesson)

### Bug 1 — `/signup` redirects back to `/login`
**Symptom:** Owner clicks "Daftar" on `/login` page, browser appears not to change.
**Root cause:** Middleware's `isAuthRoute` whitelist only included `/login` and `/auth`, not `/signup`. Unauthenticated requests to `/signup` were redirected to `/login?redirectTo=/signup`.
**Fix:** Added `/signup` to whitelist (`696ba41 fix(middleware): allow /signup as public route`).
**Lesson:** Whitelist completeness for public routes must be reviewed against every UI link to public pages. Easy miss — Auth setup checklist for future sessions.

### Bug 2 — DB connection from Vercel: SSL not negotiated
**Symptom:** Post-signup, navigating to `/patients` showed Vercel 500.
**Root cause hypothesis:** `postgres.js` driver doesn't enable SSL by default. Supavisor pooler at port 6543 requires SSL. The URL didn't include `?sslmode=require`.
**Fix:** Added `ssl: 'require'` to postgres() options in `db/index.ts` (`4d6b3f0 fix(db): force ssl=require for Supavisor pooler + add /api/health debug endpoint`).
**Note:** This fix was committed but may not have been strictly necessary — the actual blocker turned out to be Bug 3 (pooler hostname). Keeping the SSL setting is defensive and correct.
**Lesson:** Always set SSL options explicitly for serverless → managed-Postgres connections. Don't rely on URL query string parsing being honored by the driver.

### Bug 3 — Wrong Supavisor pooler hostname (aws-0 vs aws-1)
**Symptom:** `/api/health` returned `(ENOTFOUND) tenant/user postgres.gdihcqizwramcmqinqai not found` for Drizzle pooler test. Supabase REST control test PASSED (proving env vars + project id were correct).
**Root cause:** Supabase assigns projects to pooler instances non-deterministically. AI assumed `aws-0-ap-southeast-1.pooler.supabase.com` based on the typical doc example. Project was actually on `aws-1-ap-southeast-1.pooler.supabase.com`. Per Supabase GitHub discussion #35749: the only authoritative source is the Dashboard → Settings → Database → Connection String panel.
**Fix:** Owner edited `DATABASE_URL` in Vercel env vars (`aws-0` → `aws-1`) + redeployed. Verified via `/api/health` immediately after.
**Lesson:** Never construct Supabase pooler URLs from documentation pattern. Always pull from Dashboard. Future session bootstrap: add this to the credentials gathering step (Owner copy from Dashboard → paste, AI does not guess).

### Bug 4 — `SET LOCAL` with parameter binding rejected by Postgres
**Symptom:** Patient create failed with `Failed query: SET LOCAL app.current_user_id = $1 params: <uuid>`.
**Root cause:** PostgreSQL's `SET LOCAL <var> = <value>` statement does NOT accept bind parameters. Drizzle's sql template literal compiles `sql\`SET LOCAL app.current_user_id = ${userId}\`` to `SET LOCAL app.current_user_id = $1` (with `$1` as a bind parameter). Postgres rejects this with syntax error.
**Fix:** Switched to `set_config(setting, value, is_local)` function call: `sql\`SELECT set_config('app.current_user_id', ${userId}, true)\``. Functions accept parameters normally. Same transaction-scoped semantics with `is_local=true` (`49a4a7f fix(audit): SET LOCAL → set_config() — parameter-safe for Drizzle`).
**Lesson:** SQL DDL/SET statements that look DML-like still don't accept parameters. When using ORMs with template literals, prefer function calls over statement-level configuration. Worth a checklist note: "any `sql\`SET ...\`` in Drizzle — does the value need to be a literal? Use raw or function call instead."

### Bug 5 — Encounter create returns Vercel 500 with no diagnostic info
**Symptom:** Owner submits encounter dialog. Vercel returns 500 "This page couldn't load. ERROR <id>". `encounter_count` in DB remains 0. `audit_log` shows zero entries for encounter table.
**Investigation:**
- `/api/health/encounter?mode=service` works (direct service call succeeds, generates nomor `YYYYMMDD-00001-RJ`, cleanup OK).
- `/api/health/encounter?mode=action` works (FormData simulation + Zod parse + service all green).
- Wrapping the entire `createEncounterAction` body in catch-all try/catch (`5b4bea6`) did NOT surface the error to UI toast — meaning the exception is NOT inside the action body.
- Incognito window test (eliminates browser cache + Server Action ID staleness) — STILL fails identically.
**Hypotheses remaining:**
1. Module-level import error in `encounter-actions.ts` (would prevent the catch from even running)
2. Middleware throws on POST to `/patients/[id]` (the URL Server Action posts to)
3. Next.js internal pre-action handler crashes
4. Page render after `revalidatePath` crashes server-side (but encounter_count=0 contradicts this)
**Status:** Unresolved. Requires Vercel function logs access to diagnose definitively. Sandbox cannot read Vercel logs.
**Workaround for demo:** Stakeholder demo can be scoped to Patient registration + audit trail only. The P3-D Encounter narrative deferred to Session 2.

### Bug 6 — base-ui Dialog render prop pattern
**Symptom:** Build-time only (caught before deploy). Initial code put content INSIDE `render={<Button>...</Button>}` instead of as children of the Trigger.
**Root cause:** shadcn/ui v3 uses base-ui (not Radix). `render` prop receives the wrapped element WITHOUT children; content goes via parent's children. Different pattern from Radix `asChild`.
**Fix:** Moved content to be children of `DialogTrigger`/`DropdownMenuTrigger`, render prop receives bare `<Button />` (`7596634 docs: README + CHECKPOINT-LOG + SESSION-1-EXIT + base-ui render fix`).
**Lesson:** When working with shadcn v3 + base-ui, always check the shadcn dialog.tsx source for the canonical pattern (it uses `render={<Button .../>}` with children outside).

---

## Why So Many Live-Deploy Bugs?

**All 5 bugs (1, 2, 3, 4, 5) were runtime-only.** None caught by TypeScript or `next build`. Each required:
1. Code change in sandbox
2. Commit + push
3. Vercel auto-deploy wait (~2 minutes)
4. Owner test
5. Symptom report back
6. Hypothesis from sandbox without Vercel log access
7. Repeat

Time per iteration: ~5-10 minutes. Total time burned debugging post-deploy: estimated 60-90 minutes of session budget.

**Root cause of the inefficiency:** Sandbox environment can't run `vercel dev` locally, so the entire production-like runtime is invisible until pushed. There is no equivalent of "local dev iteration" available in this AI-session model.

**The bug we couldn't resolve (Bug 5)** would likely have been solved in minutes if we had:
- A way to read Vercel function logs
- A `vercel dev` local environment
- Integration tests that exercise Server Actions end-to-end

---

## Session 2 — Priority Order

### P0 — Resolve Encounter Create (blocking stakeholder demo P3-D narrative)

**Required:** Vercel logs access. Options for Session 2 bootstrap:

**Option A — Owner shares Vercel API token** (preferred, mirrors Supabase Management API pattern from this session):

1. Owner goes to https://vercel.com/account/tokens
2. Click "Create Token", scope: Full Access, expiration: 7 days
3. Paste token to AI via temporary file pattern (same as Supabase `sbp_...` token)
4. AI uses Vercel API to read function logs for failing requests:
   ```
   GET https://api.vercel.com/v3/deployments/<deploymentId>/events
   Authorization: Bearer <token>
   ```

**Option B — Owner manually shares logs:**
- https://vercel.com/angga-perdanas-projects/simrs-batin-tikal/logs
- Filter by failing request timestamp
- Copy-paste error stack to AI

**Option C — `vercel dev` local setup** (slower start, but pays off):
- Owner installs Vercel CLI: `npm i -g vercel`
- `vercel link` to connect local dir to project
- `vercel env pull` to populate `.env.local` from Vercel env vars
- `vercel dev` starts local development server with full prod env parity
- AI iterates locally via sandbox shell commands instead of deploy cycle

### P1 — Establish Test Safety Net

Critical-path integration tests with testcontainers Postgres:

```
tests/integration/
├── auth.test.ts       — signup, login, session resolution
├── patient.test.ts    — CRUD + audit columns + version increment
├── encounter.test.ts  — CRUD + nomor generation + state machine
└── audit.test.ts      — trigger fires, immutability enforced
```

Run via `vitest run` in CI before deploy. Each test:
1. Spins up clean Postgres container with our schema + triggers
2. Calls service layer directly
3. Asserts DB state

This catches Bug 4 (set_config) and Bug 5 (whatever it actually is) in seconds, not in the deploy-debug cycle.

### P2 — Complete Smoke Test 6-9 (after P0 unblocks)

Steps remaining from SESSION-1-EXIT.md demo flow:
- Step 6: Close encounter (state transition → "Selesai")
- Step 7: Cross-encounter list + filter
- Step 8: Universal audit log viewer
- Step 9: Logout

### P3 — Stakeholder Demo Prep

Once Steps 3-9 all working:
- Practice 5-min demo script
- Prepare 1-page handout for Karumkit
- Schedule meeting with Sie Renbang Angga

---

## Vercel Deployment Health Endpoints (For Session 2 Diagnosis)

I left two debug endpoints in the codebase. They proved invaluable during Session 1 — keep them for Session 2 ops:

**`GET /api/health`** — DB connectivity probe
- Returns env var presence (no secrets leaked)
- Tests Supabase REST (HTTPS control)
- Tests Drizzle via Supavisor pooler
- Reveals error.cause chain if either fails

**`GET /api/health/encounter?mode=service|action`** — Encounter create end-to-end replay
- mode=service: direct service layer call
- mode=action: simulates the action's FormData + Zod parse + service flow
- Cleans up after itself (delete the test encounter)
- Surfaces error chain if anything throws

Both are public (no auth) — safe because they only return status info, never user data. Useful pattern: future modules can add similar `/api/health/<module>` endpoints as deploy-time smoke tests.

---

## Self-Knowledge Updates for Owner Policy

Two updates to consider for `OWNER-POLICY-FOR-AI-SESSIONS.md`:

### §L addendum — Management API patterns

Add to §L (Audit Safeguards): when Owner authorizes Management API access (Supabase `sbp_...`, Vercel API token, etc.), the AI SHOULD:
1. Verify token type by URL prefix or test endpoint before use
2. Probe current state before making changes (idempotency check)
3. Display planned changes to Owner; for irreversible/destructive operations, wait for explicit "ya, run"
4. For reversible config changes (auth settings, env vars), proceed with brief announcement
5. Verify result via independent introspection query
6. Suppress token from logs / shell history

The Supabase Management API usage in Session 1 followed this pattern successfully (probe → display → execute → verify). Codify it.

### §N addendum — Deploy verification

Add new section: when deploying to a serverless platform (Vercel), AI MUST:
1. Add at least one `/api/health` endpoint that probes critical dependencies (DB, external APIs)
2. Verify health endpoint returns OK before declaring deployment "done"
3. NOT rely solely on build-time TypeScript/lint checks — these miss SSL config, parameter binding, runtime env var format issues
4. If sandbox can't run prod-parity locally (e.g., `vercel dev`), increase pre-deploy paranoia: explicitly test each external dependency, validate env var format (not just presence)

---

## Final Commit Log Summary

Session 1 commits, in order:

| SHA | Description |
|---|---|
| `8c7c524` | feat: initial scaffolding — Next.js 16 + Drizzle + Supabase + schema |
| `c6ef62f` | feat: service layer + Server Actions + UI pages |
| `7596634` | docs: README + CHECKPOINT-LOG + SESSION-1-EXIT + base-ui render fix |
| `696ba41` | fix(middleware): allow /signup as public route |
| `4d6b3f0` | fix(db): force ssl=require for Supavisor pooler + add /api/health |
| `4e2d59a` | debug: expose error.cause chain + add Supabase REST control |
| `49a4a7f` | fix(audit): SET LOCAL → set_config() — parameter-safe for Drizzle |
| `0a11bc3` | docs(audit): clarify set_config vs SET LOCAL in module docstrings |
| `3b48957` | debug: /api/health/encounter — replay encounter create flow |
| `5b4bea6` | fix(encounter-actions): wrap all three actions in try/catch |
| `6596fbf` | debug: /api/health/encounter?mode=action — replay full action flow |
| **this** | docs: SESSION-1-EXIT-ADDENDUM with bug log + Session 2 priorities |

All pushed to `main` on https://github.com/urrenbatik-cloud/simrs-batin-tikal.

---

## Honest Assessment

**What worked well:**
- Schema design held up under live testing (audit columns, triggers, version increments all functioned)
- Service layer abstraction made debugging easier (could test service directly via debug endpoint)
- Health endpoint pattern was a force multiplier for diagnosis without Vercel logs
- Management API workflow with Owner-shared `sbp_` token was efficient

**What didn't work well:**
- AI assumed pooler URL pattern instead of pulling from Dashboard (Bug 3)
- AI used `SET LOCAL` template literal without realizing Drizzle would parameterize it (Bug 4) — should have been caught by reading Drizzle docs more carefully
- No safety net (tests, local dev) to catch runtime bugs before they hit Owner during smoke test
- Couldn't resolve Bug 5 without Vercel logs access — should have requested Vercel API token at first sign of trouble, not after multiple iterations

**Net outcome:** Demo can proceed with patient registration scope. Encounter scope deferred to Session 2 P0 task with Vercel logs as the unlock.

---

*End of Session 1 EXIT Addendum.*
