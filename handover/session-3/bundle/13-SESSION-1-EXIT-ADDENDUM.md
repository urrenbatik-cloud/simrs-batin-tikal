# SIMRS Batin Tikal — Session 1 EXIT Addendum

**Tanggal:** 14 Mei 2026 (continued from SESSION-1-EXIT.md baseline)
**Status:** ✅ Session 1 closed — **full demo capability achieved**, all 6 deploy bugs resolved
**Successor:** Session 2 — smoke test steps 6-9 completion + test safety net + stakeholder demo prep

This addendum supplements `SESSION-1-EXIT.md` with everything learned from
the live-deploy bug hunt during Owner's stakeholder smoke test. The
baseline document captured what was built; this captures what BROKE and
how we fixed each issue — including the highest-value process lesson:
**request observability access UPFRONT** rather than iterating blindly.

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
| **Encounter create** | ✅ **RESOLVED** — see Bug 5 below |
| Encounter close/cancel | ⏳ Untested (next: Session 2 P0 smoke test) |
| Cross-encounter list | ⏳ Untested |
| Universal audit log viewer | ⏳ Untested |
| Logout | ✅ Likely working (auth path verified) |

**Demo-ready scope:** patient registration + audit trail + **encounter
create** (P3-D Encounter-as-Convergence narrative). All three pillars of
the value proposition now demonstrable to Karumkit/Sie Renbang Angga.

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

### Bug 5 — `export type { ... }` re-export breaks Turbopack `"use server"` modules ⭐ MOST IMPORTANT
**Symptom:** Owner submits encounter dialog. Vercel returns 500 "This page couldn't load. ERROR <id>". `encounter_count` in DB remains 0. `audit_log` shows zero entries for encounter table.

**Investigation path (what I tried that DIDN'T work):**
- `/api/health/encounter?mode=service` → succeeds (service layer fine)
- `/api/health/encounter?mode=action` → succeeds (FormData + Zod + service all fine)
- Wrap `createEncounterAction` body in catch-all try/catch (`5b4bea6`) → didn't surface error to toast
- Incognito window test → same failure (eliminated browser cache theory)
- Hypothesis dump: middleware crash, module load error, page render error — couldn't isolate without logs

**What broke the deadlock:** Owner shared Vercel Logs UI screenshot. The error stack was:
```
ReferenceError: ActionState is not defined
    at module evaluation (.next/server/chunks/ssr/_0ktqfsf._.js:1:7974)
    at instantiateModule
    at getOrInstantiateModuleFromParent
    at Context.commonJsRequire
    digest: '487176100'
```

**Root cause:** `encounter-actions.ts` had:
```typescript
"use server"
// ...
import type { ActionState } from "./patient-actions"
export type { ActionState }   // ← THE BUG
```

Next.js + Turbopack `"use server"` compiler behavior:
- Allows inline `export interface Foo { ... }` (TypeScript-only construct, properly erased at compile time) — that's why `patient-actions.ts` with its inline `export interface ActionState` worked fine.
- BREAKS on `export type { Foo }` re-export form — Turbopack emits a runtime reference to `ActionState` (which is a type, not a value) in the compiled module. At module load time, the `ActionState` identifier doesn't resolve → ReferenceError → module evaluation fails before any of my code (including the catch-all wrap) gets a chance to run.

**Why my defensive try/catch couldn't help:** The error fires at **module evaluation time** — before `createEncounterAction` is even available to be called. Vercel returns 500 for the POST without ever entering the action function body.

**Fix (`1af51e2`):**
1. Removed `export type { ActionState }` from `encounter-actions.ts`
2. Updated `new-encounter-dialog.tsx` to import `ActionState` directly from `patient-actions` (where it's the original inline `export interface`)
3. Added header comment in `encounter-actions.ts` warning future-session AIs about this constraint

**Verification:** Owner tested post-fix → encounter create works end-to-end ✅

**Lesson (most important from Session 1):** In Next.js `"use server"` files, exports must be Server Action functions. Type-only constructs are allowed only as **inline declarations** (`export interface Foo {}`), not as **re-exports** (`export type { Foo }`, `export { type Foo }`). Turbopack's compiler has different handling for these two forms — inline = erased, re-export = runtime reference (broken).

**Related lesson (process):** When a post-deploy bug can't be reproduced via debug endpoints, the bug is probably at a layer BEFORE your code runs (module load, framework internals, middleware). **Request observability access UPFRONT** rather than iterating blindly — see "Process Lessons" section below.

### Bug 6 — base-ui Dialog render prop pattern
**Symptom:** Build-time only (caught before deploy). Initial code put content INSIDE `render={<Button>...</Button>}` instead of as children of the Trigger.
**Root cause:** shadcn/ui v3 uses base-ui (not Radix). `render` prop receives the wrapped element WITHOUT children; content goes via parent's children. Different pattern from Radix `asChild`.
**Fix:** Moved content to be children of `DialogTrigger`/`DropdownMenuTrigger`, render prop receives bare `<Button />` (`7596634 docs: README + CHECKPOINT-LOG + SESSION-1-EXIT + base-ui render fix`).
**Lesson:** When working with shadcn v3 + base-ui, always check the shadcn dialog.tsx source for the canonical pattern (it uses `render={<Button .../>}` with children outside).

---

## Why So Many Live-Deploy Bugs?

**All 6 bugs (1-5 + base-ui) were runtime-only or framework-specific.** None caught by TypeScript or `next build`. Each required:
1. Code change in sandbox
2. Commit + push
3. Vercel auto-deploy wait (~2 minutes)
4. Owner test
5. Symptom report back
6. Hypothesis from sandbox without Vercel log access
7. Repeat

Time per iteration: ~5-10 minutes. Total time burned debugging post-deploy: estimated 60-90 minutes of session budget. Bug 5 alone burned ~30 minutes before Owner shared the Vercel log screenshot.

**Root cause of the inefficiency:** Sandbox environment can't run `vercel dev` locally, so the entire production-like runtime is invisible until pushed. There is no equivalent of "local dev iteration" available in this AI-session model. Compounded by AI not requesting observability access (Vercel logs) early enough.

---

## Process Lessons (Owner Policy Candidates)

### Lesson A — Request observability access UPFRONT when sandbox can't observe production ⭐

**Pattern that caused 30+ minutes of wasted iteration on Bug 5:**

```
Bug appears in production → AI hypothesizes from code alone
  → Pushes "fix" → waits → Owner tests → still fails
  → AI hypothesizes again from same blind angle
  → Repeat 3-5 times
  → Eventually realize you need real error data
```

**Better pattern:**

```
Bug appears in production with non-trivial symptom (e.g. generic 500)
  → AI's FIRST move: request the actual error stack
       - Vercel UI → Logs → screenshot
       - OR Vercel API token (mirrors Supabase sbp_ pattern)
       - OR browser DevTools → Network tab → response body
  → Owner shares stack in 2 minutes
  → AI fixes in 5 minutes based on real data
```

**Decision rule for future AI sessions:** If two iteration cycles (push → test → still broken) fail to surface a clear error message, **STOP iterating** and request observability data. The cost of asking (~5 min round-trip) is far less than the cost of iterating blindly (5 min × N attempts).

### Lesson B — Defensive try/catch only catches errors AFTER the function starts

Wrapping a Server Action body in catch-all try/catch is good practice for user-facing error surfacing. But it does NOT catch:
- Module-level errors (file fails to load — Bug 5)
- Middleware errors
- Framework internal errors before the handler runs
- Errors in `redirect()` flow (NEXT_REDIRECT pattern)

For those, you need framework-level observability (function logs) or different debugging strategy.

### Lesson C — Health endpoints are necessary but not sufficient

I built two `/api/health` endpoints (DB connectivity + encounter replay). They isolated 4 of 5 bugs successfully. But Bug 5 fired at module load — the health endpoint for `/encounter/route.ts` loaded its own clean module and never hit the bug in `encounter-actions.ts`. Modules are loaded on-demand per route in Next.js.

**Takeaway:** Health endpoints validate that THEIR module path works. For Server Actions, you'd need a health endpoint that imports and CALLS each action module to verify module load works. Worth considering as a Session 2 deploy-time smoke test.

### Lesson D — In `"use server"` files: inline `export interface` OK, `export type { Foo }` BROKEN

Codify this as a hard rule in Owner Policy or in `OWNER-POLICY-FOR-AI-SESSIONS.md`:

> Files with `"use server"` directive must NOT use the type re-export form (`export type { X } from "..."` or `export type { X }`). Define types inline via `export interface` or move shared types to a non-action utility file (e.g., `lib/action-types.ts`).

---

## Session 2 — Priority Order

### P0 — Complete Smoke Test Steps 6-9 (gate to stakeholder demo)

With encounter create now working, the remaining smoke test flow needs verification:

- Step 6: Close encounter → state badge changes "Terbuka" → "Selesai", actions hide
- Step 7: Cross-encounter list (`/encounters`) with status filter chips
- Step 8: Universal audit log viewer (`/audit`) with table + operation filters
- Step 9: Logout → return to `/login`, session cleared

Expected to mostly work since they share the same `withAuditContext` pattern as encounter create (now verified). But the unverified paths could still hide latent bugs. Worth a quick Owner smoke pass.

### P1 — Establish Test Safety Net

Critical-path integration tests with testcontainers Postgres:

```
tests/integration/
├── auth.test.ts       — signup, login, session resolution
├── patient.test.ts    — CRUD + audit columns + version increment
├── encounter.test.ts  — CRUD + nomor generation + state machine
└── audit.test.ts      — trigger fires, immutability enforced
```

Plus a `tests/build-smoke/` directory for Next.js module-load tests — would have caught Bug 5 (`ActionState is not defined`) at compile/CI time:

```typescript
// tests/build-smoke/server-actions.test.ts
test("all server action modules load without error", async () => {
  await import("@/app/actions/auth-actions")
  await import("@/app/actions/patient-actions")
  await import("@/app/actions/encounter-actions")  // would have thrown ReferenceError
})
```

Run via `vitest run` in CI before deploy.

### P2 — Local Dev Setup (`vercel dev`)

Owner installs Vercel CLI: `npm i -g vercel`
- `vercel link` connects local dir to project
- `vercel env pull` populates `.env.local` from Vercel env vars
- `vercel dev` starts local development server with full prod env parity

Pays off as soon as 1-2 runtime bugs surface — debug cycle goes from ~10 min/iteration (push → deploy → test) to ~30 sec/iteration (save → test).

### P3 — Stakeholder Demo Prep

With encounter scope now demoable:
- Practice 5-min demo flow: signup → create patient → edit → audit → kunjungan baru → close → audit log
- Prepare 1-page handout for Karumkit highlighting the differentiators (audit attribution, multi-RS-ready, modern UX)
- Schedule meeting with Sie Renbang Angga

### P4 — Vercel API Token (Observability)

Lower priority now that Bug 5 is solved, but worth establishing for next post-deploy issue. Owner generates token at https://vercel.com/account/tokens (Full Access, 7-day expiry), shares via temporary file pattern — AI can fetch function logs directly via Vercel API rather than waiting for screenshots.

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

Three updates to consider for `OWNER-POLICY-FOR-AI-SESSIONS.md`:

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
2. Add a build-smoke test that imports every Server Action module to verify module-load works (would have caught Bug 5)
3. Verify health endpoints return OK before declaring deployment "done"
4. NOT rely solely on build-time TypeScript/lint checks — these miss SSL config, parameter binding, runtime env var format issues, AND module-load errors from framework-specific quirks (Bug 5)
5. If sandbox can't run prod-parity locally (e.g., `vercel dev`), increase pre-deploy paranoia: explicitly test each external dependency, validate env var format (not just presence)

### §O — Observability access escalation (NEW, from Session 1 Bug 5 learning)

When a post-deploy bug occurs:
1. **First attempt:** Read code, hypothesize, fix in sandbox, push.
2. **If fails (still broken):** Request Owner to share error stack from browser DevTools Network tab OR Vercel function logs UI.
3. **DO NOT iterate blindly more than 2x** without real error data. The cost of asking is ~5 min round-trip; the cost of blind iteration is 5-10 min × N attempts (typically 3-5 attempts before backing off).
4. Prefer programmatic access to logs (Vercel API token, GitHub Actions logs, etc.) when available.

### §P addendum — Framework-specific constraints to codify

Maintain a list of subtle framework gotchas discovered in sessions, so future-session AIs don't re-discover them painfully:

- **Next.js `"use server"` files:** no `export type { X }` re-export form. Inline `export interface` is fine. (Bug 5)
- **Drizzle `sql\`SET LOCAL ...\``:** always parameterized → Postgres rejects. Use `set_config()` function instead. (Bug 4)
- **Supabase Supavisor pooler hostname:** non-deterministic per project. Never construct from doc pattern. (Bug 3)
- **shadcn/ui v3 + base-ui:** uses `render` prop, NOT Radix `asChild`. Content goes as outer children. (base-ui bug, pre-deploy)
- **postgres.js + Supavisor:** must set `ssl: 'require'` + `prepare: false`. (Bug 2)
- **Next.js middleware:** explicitly whitelist all public auth routes (including `/signup`, not just `/login`). (Bug 1)

---

## Final Commit Log Summary

Session 1 commits, in order:

| SHA | Description |
|---|---|
| `8c7c524` | feat: initial scaffolding — Next.js 16 + Drizzle + Supabase + schema |
| `c6ef62f` | feat: service layer + Server Actions + UI pages |
| `7596634` | docs: README + CHECKPOINT-LOG + SESSION-1-EXIT + base-ui render fix |
| `696ba41` | fix(middleware): allow /signup as public route (Bug 1) |
| `4d6b3f0` | fix(db): force ssl=require for Supavisor pooler + add /api/health (Bug 2) |
| `4e2d59a` | debug: expose error.cause chain + add Supabase REST control |
| `49a4a7f` | fix(audit): SET LOCAL → set_config() — parameter-safe for Drizzle (Bug 4) |
| `0a11bc3` | docs(audit): clarify set_config vs SET LOCAL in module docstrings |
| `3b48957` | debug: /api/health/encounter — replay encounter create flow |
| `5b4bea6` | fix(encounter-actions): wrap all three actions in try/catch (defensive, didn't catch Bug 5) |
| `6596fbf` | debug: /api/health/encounter?mode=action — replay full action flow |
| `19c0101` | docs: premature SESSION-1-EXIT addendum (Bug 5 marked unresolved at that point) |
| `1af51e2` | **fix(encounter-actions): remove illegal type re-export from 'use server' file (Bug 5 ROOT CAUSE)** ⭐ |
| **this** | docs: SESSION-1-EXIT addendum revision — Bug 5 resolved + observability lesson |

All pushed to `main` on https://github.com/urrenbatik-cloud/simrs-batin-tikal.

Plus 1 environment fix (Bug 3) applied by Owner directly in Vercel env vars: `DATABASE_URL` hostname changed from `aws-0` to `aws-1`.

---

## Honest Assessment

**What worked well:**
- Schema design held up under live testing (audit columns, triggers, version increments all functioned correctly)
- Service layer abstraction made debugging easier (could test service directly via debug endpoint)
- Health endpoint pattern was a force multiplier for diagnosis without full Vercel logs (resolved 4 of 6 bugs alone)
- Management API workflow with Owner-shared `sbp_` token was efficient
- The actual encounter bug, once log access came, took 5 minutes to fix — proving the diagnostic infrastructure was right, just needed the missing data

**What didn't work well:**
- AI assumed pooler URL pattern instead of pulling from Dashboard (Bug 3) — pure carelessness
- AI used `SET LOCAL` template literal without realizing Drizzle would parameterize it (Bug 4) — should have been caught by reading Drizzle docs more carefully
- AI used `export type { X }` re-export form in a `"use server"` file (Bug 5) — Next.js+Turbopack-specific quirk, hard to know without prior burn
- **Most importantly: AI iterated blindly on Bug 5 for ~30 minutes before requesting log access.** Should have asked after 2nd unexplained iteration. This is the highest-value process lesson from Session 1.
- No safety net (tests, local dev) to catch runtime bugs before they hit Owner during smoke test

**Net outcome:** Demo can proceed with FULL scope (patient + encounter). Stakeholder narrative complete:
- Audit attribution layer (Itjenad / BPK accountability)
- Encounter-as-Convergence pattern (P3-D from Blueprint v2.0)
- Multi-RS architecture (deferred activation, single statement to flip on)
- Modern web UX vs Khanza Java Swing legacy

Steps 6-9 untested but expected to work — they share the same service+action pattern as encounter create, which is now verified. Worth 10 min of Owner smoke test before stakeholder demo to confirm.

---

*End of Session 1 EXIT Addendum (revised).*
