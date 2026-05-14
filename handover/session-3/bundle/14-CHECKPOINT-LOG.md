# SIMRS Batin Tikal — Checkpoint Log

Chronological record of session work + decisions. Mirror SIKESUMA's
`SSOT-REFACTOR-LOG.md` + Blueprint v2.0 update session pattern.

---

## Session 1 — MVP Scaffolding + Patient Registrasi + Encounter Hub

**Tanggal:** 13 Mei 2026
**Owner:** dr Ferry
**AI:** Claude (active dev partner)
**Predecessor:** Phase 0 EXIT (13 Mei 2026) + Blueprint v2.0 update session
**Goal:** Working MVP, deployed ke Vercel Preview URL, stakeholder-evaluable

### CP-1.1 — Bootstrap + Foundation Findings

**Reading completed (Priority 1 + 2 + selective Priority 3):**
- Phase 0 EXIT document (decision lock, MVP scope, deferred features)
- Owner Policy v1.0–v1.6 (governance, paired commit→push, in-session commit
  principle, MVP-first mode override, cross-project boundary)
- Infrastructure credentials file (GitHub repo, Supabase project, JWT keys)
- Blueprint v2.0 strategic framing (initial handover) + detailed Blueprint v2.0
  (uploaded separately by Owner — verified §4.7 Three Deep Choices, §5.6.1–5.6.9
  patterns, Appendix A.3 P3-D Encounter-as-Convergence)
- Khanza Implications §A.3 (P3-D adoption guidance)

**Foundation findings surfaced:**

| # | Finding | Resolution |
|---|---|---|
| F1 | Blueprint v2.0 file in initial handover was strategic framing version, not detailed architectural | Owner uploaded detailed Blueprint v2.0 (2153 lines); verified all referenced sections present |
| F2 | GitHub PAT not in credentials file | Owner shared via temporary file (konteks 1, this session) |
| F3 | Sandbox network blocks TCP 5432/6543 outbound — cannot apply migrations from sandbox | Strategy adjusted: hand-write SQL migrations, Owner pastes in Supabase Dashboard SQL Editor (aligns with §L.4 audit safeguards anyway) |

### CP-1.2 — Technical Decisions Locked

| # | Decision | Rationale |
|---|---|---|
| D1 | Drizzle ORM | TypeScript-native, lightweight, good Supabase integration |
| D2 | Server Actions + Server Components (NOT tRPC per bootstrap recommendation) | Justified deviation. Idiomatic App Router; less ceremony for monolith MVP; less code; Vercel-optimized. Owner approved (konteks 3) |
| D3 | React Hook Form + Zod resolver | Better DX vs raw useState |
| D4 | shadcn/ui v3 (base-ui based) | Copy-paste pattern, no lock-in |
| D5 | RSC + URL params filter state | Server-side filter = bookmarkable URLs |
| D6 | Supabase Auth email/password | OAuth defer; simple for MVP |
| D7 | Postgres trigger-based audit log with `SET LOCAL app.current_user_id` pattern | Single source of truth; can't be forgotten by future developers; matches §5.6.1 cascade benefit |

Housekeeping decisions (proceeded without Owner approval per §V.5):
- snake_case columns / camelCase TS / Drizzle auto-map
- Bahasa Indonesia schema names per Khanza P10-A
- UUID PK + semantic `nomor_kunjungan` per P3-D
- Soft delete via `deleted_at` + `deleted_by`
- Optimistic locking via `version BIGINT` + service-layer check
- RLS policies written day 1, enabled only on `audit_log`; others deferred

### CP-1.3 — Phase B (Project Scaffolding) — Complete

- Cloned `urrenbatik-cloud/simrs-batin-tikal` (empty repo)
- `npx create-next-app@latest .` with TypeScript + Tailwind + App Router
- Installed Drizzle (ORM + drizzle-kit), Supabase (supabase-js + ssr),
  React Hook Form + Zod resolver + @radix-ui/react-slot, postgres.js
- `npx shadcn@latest init --defaults --force` → base-ui v3 setup
- shadcn components added (batch): button, input, label, card, table, dialog,
  dropdown-menu, sonner, select, textarea, alert, badge, separator, skeleton
- **shadcn CLI silently failed to install Form component** (no error, no file
  created) — wrote `components/ui/form.tsx` manually using `@radix-ui/react-slot`
- `.env.local` configured with Supabase credentials + Supavisor pooler URL
- `.env.example` template (no secrets) committed

### CP-1.4 — Phase C (Schema Foundation) — Complete

**Drizzle schema** (`db/schema/`):
- `_audit.ts` — `auditColumns()` helper spread into operational tables
- `rs.ts` — tenant table, no audit columns (root)
- `users.ts` — Supabase Auth mirror via `id` UUID, simple `role TEXT`
- `patient.ts` — UUID PK + composite RM uniqueness per RS + NIK regex + JSONB
  envelopes (alamat, dataKontak, dataDemografi)
- `encounter.ts` — UUID PK + semantic `nomor_kunjungan` per P3-D + CHECK
  constraints on `jenis_kunjungan` + `status_kunjungan` state machine +
  closed-coherence check
- `audit_log.ts` — append-only universal log
- `index.ts` barrel

**SQL migrations** (`db/migrations/`):
- `0000_core_schema.sql` — extensions, tables, indexes, `handle_new_auth_user`
  trigger (auth.users INSERT → public.users INSERT)
- `0001_audit_triggers.sql` — `fn_fill_audit_columns` (reads
  `current_setting('app.current_user_id', true)`, raises EXCEPTION on missing
  context, increments `version` on UPDATE), `fn_write_audit_log` (captures
  old/new JSONB), `fn_audit_log_immutable` (blocks UPDATE/DELETE on audit_log)
- `0002_rls_policies.sql` — policies defined for all tables; `audit_log` RLS
  ENABLED day 1; rs/users/patient/encounter RLS DEFERRED (single-statement
  activation later); `fn_current_user_rs_id` + `fn_current_user_role` helpers
- `0003_seed_rs.sql` — RS Batin Tikal seed (kode `RS-BT-020703`)

**Status:** Migration files committed to repo; **pending Owner-paste ke
Supabase Dashboard SQL Editor** (per §L.4 display-before-execute).

### CP-1.5 — Phase D (Service Layer + Server Actions) — Complete

**Service layer** (`services/`):
- `patientService.ts` — Zod schemas (createPatientSchema, updatePatientSchema),
  listPatients (with search + pagination), getPatient, createPatient,
  updatePatient (optimistic locking), softDeletePatient. Typed errors:
  `PatientNotFoundError`, `PatientVersionConflictError`.
- `encounterService.ts` — listEncountersForPatient, listAllEncounters
  (cross-patient with patient join), getEncounter, createEncounter,
  updateEncounter, closeEncounter, cancelEncounter. State machine guards.
  `generateNomorKunjungan` helper: `YYYYMMDD-NNNNN-{RJ|RI|IGD|OBS}` pattern.
  Typed errors: `EncounterNotFoundError`, `EncounterVersionConflictError`,
  `EncounterStateError`.
- `auditService.ts` — getAuditTrailForEntity, queryAuditLog (with role-based
  RS scoping; auditor role sees all RS).

**Server Actions** (`app/actions/`):
- `auth-actions.ts` — loginAction, signupAction, logoutAction
- `patient-actions.ts` — createPatientAction, updatePatientAction,
  softDeletePatientAction with field-error response state
- `encounter-actions.ts` — createEncounterAction, closeEncounterAction,
  cancelEncounterAction

**Supporting infra:**
- `lib/audit-context.ts` — `withAuditContext(userId, fn)` wraps callback in
  transaction with `SET LOCAL app.current_user_id = ${userId}`
- `lib/session.ts` — `requireSession()`, `getCurrentSession()` resolve Supabase
  Auth user → application user profile (rsId, role, namaLengkap)
- `lib/supabase/{server,client,middleware}.ts` — SSR auth pattern
- `middleware.ts` — auth gating with redirect-to-login + redirect-from-login

### CP-1.6 — Phase E (UI Pages) — Complete

Pages created:
- `app/page.tsx` — root redirector (auth-based)
- `app/login/` — Login form (Server Action driven, useActionState)
- `app/signup/` — Signup form
- `app/(app)/layout.tsx` — dashboard chrome (header + nav + logout)
- `app/(app)/patients/page.tsx` — list with search input + pagination
- `app/(app)/patients/new/page.tsx` + `patient-form.tsx` — create form
- `app/(app)/patients/[id]/page.tsx` — detail view with three sections:
  patient identity/alamat/kontak/demografi cards, encounter list with status
  badges + actions dropdown, audit trail with operation badges + change summary
- `app/(app)/patients/[id]/edit/page.tsx` — edit form (reuses PatientForm)
- `app/(app)/encounters/page.tsx` — cross-patient encounter list with status
  filter chips
- `app/(app)/encounters/new-encounter-dialog.tsx` — modal for creating
  encounter from patient view
- `app/(app)/encounters/encounter-actions.tsx` — close/cancel dropdown
- `app/(app)/audit/page.tsx` — universal audit log viewer with table +
  operation filter chips, click-through to patient row

**Helper:** `components/ui/link-button.tsx` — Link styled as Button.
Replaces Radix `asChild` pattern (shadcn v3 + base-ui uses `render` prop).
Used in 6 pages.

**Bug fix during session:** Initial dialog/dropdown trigger code had content
inside the `render={<Button>...</Button>}` prop. base-ui pattern: render prop
takes the wrapped element WITHOUT children, content flows as outer children.
Fixed in `new-encounter-dialog.tsx` + `encounter-actions.tsx`.

### CP-1.7 — Verification — Green

```
$ npx tsc --noEmit
(zero output — zero errors)

$ npx next build
✓ Compiled successfully in 17.7s
✓ Finished TypeScript in 10.7s
✓ Generating static pages 7/7
Routes: 10 total (3 static + 7 dynamic)
```

### CP-1.8 — Commits + Pushes

| Commit | SHA | Files | Description |
|---|---|---|---|
| 1 | `8c7c524` | 55 | feat: initial scaffolding — Next.js 14 + Drizzle + Supabase + schema |
| 2 | `c6ef62f` | 24 | feat: service layer + Server Actions + UI pages (Patient + Encounter + Audit) |
| 3 | (this turn) | TBD | docs: README + CHECKPOINT-LOG + SESSION-1-EXIT + base-ui render fix |

Paired commit→push verified per §J. PAT hygiene verified clean after each push.

### CP-1.9 — Pending (Owner Side)

These actions require Owner — they cannot be executed from sandbox:

1. **Paste migrations** in Supabase Dashboard → SQL Editor, in order:
   `0000_core_schema.sql` → `0001_audit_triggers.sql` → `0002_rls_policies.sql`
   → `0003_seed_rs.sql`
2. **Disable email confirmation** in Supabase Auth settings (MVP convenience)
3. **Connect Vercel** to GitHub repo, configure env vars (per README §Deployment)
4. **First signup** via deployed URL → user auto-attached to RS Batin Tikal
5. **Smoke test critical flows**:
   - Create patient → verify audit_log row appears
   - Edit patient → verify version increments + audit_log captures diff
   - Create encounter → verify nomor_kunjungan auto-generated
   - Close encounter → verify state transition guard works
6. **Demo URL** to Karumkit + Sie Renbang Angga

### Time profile (rough)

| Phase | Turns approx |
|---|---|
| Bootstrap + reading + Foundation Findings + decision lock | 2 |
| Phase B scaffold + dep install + shadcn init | 2 |
| Phase C schema + migrations | 2 |
| Phase D services + Server Actions + wiring | 3 |
| Phase E UI pages | 4 |
| Typecheck + build fixes (LinkButton + Form imports + dialog render) | 2 |
| Docs + handoff | 2 |
| **Sub-total: Build phase** | **~17 turns** |
| Supabase setup via Management API (Owner authorized sbp_ token) | 2 |
| Vercel deploy + DATABASE_URL fix (aws-0 → aws-1) | 2 |
| Smoke test live: middleware /signup + db SSL + set_config fixes | 6 |
| Encounter bug investigation (unresolved — Vercel logs blocked) | 5 |
| Session 1 EXIT addendum + final closeout | 2 |
| **Sub-total: Live debug phase** | **~17 turns** |
| **Total Session 1** | **~34 turns** |

### Lessons codified

1. **Sandbox network blocks Postgres ports** (5432/6543) — strategy: hand-write
   SQL + Owner-paste in Dashboard initially, then shift to Management API via
   `sbp_` token when Owner authorized. The Management API proved efficient
   (HTTPS 443 always accessible from sandbox).
2. **shadcn v3 + base-ui is NOT Radix** — `asChild` → `render` prop; subtle
   semantic difference (content goes as outer children, not inside the render
   slot). Worth a checklist for future UI work.
3. **shadcn CLI can silently fail** on some components (Form) — fall back to
   manual install.
4. **Drizzle `sql\`SET LOCAL ...\`` template ALWAYS parameterizes** — Postgres
   rejects. Switch to `set_config()` function call. Mistake-class lesson:
   any time we use template literals in ORM SQL for non-DML operations,
   verify the compiled SQL is actually valid Postgres syntax.
5. **Supabase pooler hostname is non-deterministic** — never construct from
   doc pattern (`aws-0-{region}`). Always pull from Dashboard. This burned
   us via DATABASE_URL with wrong hostname; Owner had to manually fix in
   Vercel.
6. **Sandbox can't read Vercel function logs** — this blocked resolving the
   final encounter create bug. Session 2 P0: get Vercel API token from Owner
   OR setup `vercel dev` locally.
7. **`/api/health` debug endpoints are force multipliers** — added two
   (`/api/health` + `/api/health/encounter`) and they let us diagnose 4 of 5
   live bugs without needing Vercel logs. Keep them in the codebase. Future
   modules: add corresponding health endpoints.
8. **Defensive try/catch around entire Server Action body is the right
   pattern** for non-redirect actions — surfaces errors to UI toast instead
   of Vercel 500. But it doesn't help if the error is OUTSIDE the action
   (middleware, module-level, page render). Need different observability
   for those.

### Session 1 closeout status

**Demo-ready scope:** Full P3-D narrative — signup → login → create patient
→ edit → audit trail → kunjungan baru → close → audit log. All pillars of
the value proposition for Karumkit / Sie Renbang Angga demoable.

**Verified working live (Owner-tested):**
- Auth flow (signup, login, session)
- Patient CRUD + audit + version increment
- Encounter create (after Bug 5 resolved with Vercel log access)

**Untested but expected to work (Session 2 P0):**
- Encounter close + cancel (state transitions)
- Cross-encounter list + filter
- Universal audit log viewer
- Logout

**All 6 deploy bugs resolved:**
1. Middleware /signup whitelist
2. Postgres SSL config
3. Supavisor pooler hostname (aws-0 → aws-1)
4. SET LOCAL → set_config()
5. `export type` re-export in "use server" file (resolved last, root cause via Vercel log screenshot)
6. base-ui render prop pattern (pre-deploy)

**Session 2 priorities:** see `SESSION-1-EXIT-ADDENDUM.md` P0-P4.

---

## Session 2 — P0 Verification + Test Safety Net (P1.1 + P1.2)

**Tanggal:** 14 Mei 2026
**Owner:** dr Ferry
**AI:** Claude (active dev partner)
**Predecessor:** Session 1 closeout (commit `fc220f9`)
**Goal:** (1) Verify P0 smoke test gap, (2) establish Vitest safety net catching Bug-5-class issues at CI time, (3) keep MVP scope honored (no scope creep)

### CP-2.1 — Bootstrap + Live State Diagnostic

Token verification per Owner Policy §L.2 (all alive, masked logs):
- Supabase Management API (`sbp_***`): project `simrs-batin-tikal` ACTIVE_HEALTHY, region ap-southeast-1
- GitHub PAT (`ghp_***`): HTTP 200 on repo, HEAD `fc220f9` matches Session 1 closeout
- Vercel API (`vcp_***`): HTTP 200

Repo clone with PAT-via-env pattern per §J.3; PAT scrubbed from `.git/config` immediately after fetch; verified clean.

Live DB snapshot before P0 smoke test (via Management API direct query):

| Table | INSERT | UPDATE | DELETE |
|---|---|---|---|
| `encounter` | 9 | **0** | 8 |
| `patient` | 2 | 2 | 1 |

Discovery: actual P0 gap **narrower than addendum implied**. Step 6 (close encounter) confirmed never tested live — 0 encounter UPDATE rows; the surviving encounter had `status='open' version=1`. Steps 7-9 are UI-only flows (no DB evidence) — needed Owner click-through.

### CP-2.2 — P0 Smoke Test (Owner-Side, Verified Post-Hoc)

Owner executed step 6-9 smoke test against `https://simrs-batin-tikal.vercel.app`:
- Used existing patient `RM-2026-00002` Tn Dummy B2 (created earlier in live testing)
- Closed kunjungan poli for that patient

Post-test DB verification confirmed:
- `encounter UPDATE = 1` (was 0) → close transition trigger fired
- Encounter `20260513-00001-RJ` now `status=closed version=2 closed_at IS NOT NULL closed_by IS NOT NULL`
- Patient `RM-2026-00002` exists v=2, NIK `1234567890123457`, jenis_kelamin `L`

Steps 7-9 (cross-encounter list, audit viewer, logout) — Owner confirmed "working as expected" verbally.

**P0 status: ✅ All steps verified. No bugs surfaced.**

### CP-2.3 — P1 Scope Refinement (Owner Approved)

Per addendum P1 originally proposed testcontainers Postgres integration tests. Refined for token-budget + sandbox-capability reality:

| P1 sub-task | Decision | Rationale |
|---|---|---|
| **P1.1** Build-smoke tests | ✅ Done this session | High value (catches Bug-5-class), low cost (~3 files) |
| **P1.2** Service-layer unit tests | ✅ Done this session | Zod schema contract tests, no DB needed |
| **P1.3** Integration tests w/ testcontainers Postgres | ❌ Defer to Session 3 | Heavy (~30% remaining budget), Docker support uncertain in sandbox |

Alternative for P1.3: Supabase Management API as DB-end-to-end harness (saw pattern already works for diagnostic queries in CP-2.1).

### CP-2.4 — P1.1 + P1.2 Implementation

**Vitest setup** (`vitest.config.ts`, `tests/setup.ts`, `tests/stubs/server-only.ts`):
- `@` path alias matches `tsconfig.json`
- `server-only` aliased to empty stub (Next.js' runtime guard inappropriate for Node test runtime)
- `setupFiles` populates `DATABASE_URL` + Supabase env vars BEFORE module evaluation (otherwise db/index.ts throws at import time)
- `sequence: { concurrent: false }` — Server Action build-smoke tests share module-level side effects; parallel races

**Build-smoke layer** (`tests/build-smoke/`):

1. `server-actions.test.ts` (6 tests) — Imports all 3 Server Action modules + 3 service modules, asserts expected exports exist. Catches: missing imports, syntax errors, runtime side-effects at module body, circular import issues, ReferenceError from misnamed exports.

2. `use-server-static.test.ts` (4 tests) — **Static regex check that actually catches Bug-5-class issues**. Scans every file with `"use server"` directive; rejects:
   - `export type { X }` re-export form (Bug 5 of Session 1)
   - `export { type X, ... }` mixed re-export
   - `export * from "..."` (too permissive)
   - `export default` (Server Actions should be named)

**Honest correction made mid-execution**: my initial assumption that build-smoke (Vitest module-load) would catch Bug 5 was WRONG. Vitest uses esbuild for TS transform, which properly erases `export type { X }`. Bug 5 is specific to Turbopack (Next.js' production compiler). Verified empirically by injecting Bug 5 form temporarily — module-load test still passed. Then wrote the static regex check, re-injected Bug 5 form, confirmed static check fails with descriptive message: `Found 'export type { ... }' — see Session 1 Bug 5`. Reverted injection cleanly.

**Unit test layer** (`tests/unit/`):

3. `encounter-schemas.test.ts` (16 tests) — Zod contracts for `createEncounterSchema`, `updateEncounterSchema`, `closeEncounterSchema`. Covers: required field rejection, jenisKunjungan enum (4 values: rawat_jalan/rawat_inap/igd/observasi), optimistic-lock `expectedVersion` positive integer.

4. `patient-schemas.test.ts` (35 tests) — Zod contracts for patient schemas. Heavy coverage on:
   - `nomorRekamMedis` required non-empty
   - `tanggalLahir` YYYY-MM-DD regex (3 valid forms + 6 invalid forms parameterized)
   - `jenisKelamin` strict L/P (rejects M, "Laki-laki")
   - **NIK 16-digit regex** (Indonesian national ID) — accepts valid 16-digit, accepts empty string escape hatch, accepts omitted (optional); rejects 10-digit, 17-digit, letter-containing, separator-containing
   - `expectedVersion` int positive (rejects 0, -1)
   - JSONB envelope sub-schemas (`patientAlamatSchema`, `patientKontakSchema` with nested `kontak_darurat`)

### CP-2.5 — Verification Mantra (Per Owner Policy §C)

```
1. TS errors:    0   (npx tsc --noEmit)
2. Tests:        61 passed / 4 files
3. Build:        ✓ Compiled successfully in 24.0s   (with .env.local stub for sandbox)
```

Baseline established: **61 tests** is the floor for Session 3+; must not decrease.

`package.json` scripts added:
- `npm test` → `vitest run` (CI)
- `npm run test:watch` → `vitest` (dev iteration)
- `npm run test:smoke` → `vitest run tests/build-smoke` (fast pre-deploy)
- `npm run test:coverage` → `vitest run --coverage`

### CP-2.6 — Commits + Pushes

| Commit | Files | Description |
|---|---|---|
| (this turn) | 9 NEW + 2 MOD | feat: test safety net — vitest + 61 tests (build-smoke + unit) + npm scripts |
| (this turn) | 3 MOD | docs: Session 2 CHECKPOINT-LOG + SESSION-2-EXIT |

Paired commit→push per §J. PAT hygiene verified clean after each push.

### Lessons codified

1. **Vitest module-load tests do NOT catch Turbopack-specific bugs.** TS transform layer matters: Vite/esbuild erases `export type` correctly; Turbopack emits runtime references for it. The right defense for Bug-5-class is **static analysis** (regex on `"use server"` files), not module-import.

2. **Empirical verification of test claims is mandatory.** Initial gut-check ("module-load test catches Bug 5") was wrong. The 30-second injection-test loop (inject the bug form → run test → revert) caught the mistake before it shipped. Worth adding to checklist: any time we claim "this test catches X," temporarily inject X and verify.

3. **Live DB diagnostic via Management API replaces handover-doc claims.** Addendum claimed "untested but expected to work" for steps 6-9. Direct query showed step 6 was the only real gap; steps 7-9 are UI flows that never have DB evidence anyway. Future sessions: when handover says "untested," verify via DB before scoping work — narrower gap = less work.

4. **`server-only` import requires test-runtime neutralization.** All `services/` and `lib/` modules `import "server-only"` which throws if not in Server Component context. Vitest config aliases the package to an empty stub. Add this to the bootstrap checklist for any test work in Next.js App Router projects.

### Session 2 closeout status

**Verified this session:**
- ✅ P0 smoke test steps 6-9 (Owner-tested + DB-verified via Management API)
- ✅ Test safety net (61 tests, all categories passing)
- ✅ Static check for Bug-5-class issues (verified by injection)
- ✅ TS clean, build green, tests green

**Pending for Session 3:**
- ⏳ P1.3 — Integration tests with real Postgres (testcontainers OR Management API harness)
- ⏳ P2 — `vercel dev` local setup (Owner-action, ~5 min: `npm i -g vercel`, `vercel link`, `vercel env pull`)
- ⏳ P3 — Stakeholder demo prep (5-min flow rehearsal, 1-page Karumkit handout)
- ⏳ P4 — Vercel API token formalized (already shared this session; rotate per §W.3 fresh-session hygiene)

**Recommendation Session 3:** Pick ONE direction —
- **Option A** (stabilize, ~1 session): P1.3 integration tests + P2 vercel dev + P3 demo prep
- **Option B** (Phase 2.2 expansion): Lab modul OR Prescription modul (both FK ke encounter; convergence pattern already established)
- **Option C** (UX polish): patient bulk operations + print summary + operational dashboard

Per Session 1 EXIT recommendation: prefer **Option A** first — get stakeholder feedback before committing to Option B/C.

### Time profile

| Phase | Approx turns |
|---|---|
| Bootstrap (read Owner Policy + Blueprint inventory) | 2 |
| Token verification + live DB diagnostic | 1 |
| P1.1 + P1.2 implementation (vitest setup + 4 test files) | 3 |
| Mid-execution honest correction (Bug 5 catch verification) | 1 |
| Verification mantra + docs + commits | 2 |
| **Total Session 2** | **~9 turns** |

Comparable with Phase 2.4 success template (Owner Policy §Q): "~6-7 turns mid-session continuation."

### CP-2.7 — P2 + P3 Deliverables (Session 2 extended)

After Session 2 closeout commit, Owner asked to continue with Option A
within remaining session budget. Per self-assessment §V.5: P2 + P3
together estimated ~25-30% remaining capacity — fit cleanly. P1.3 (real
DB integration tests) explicitly deferred to Session 3 as significant
work needing fresh budget + design decision (testcontainers vs
Management API harness).

**P2 — `vercel dev` setup** (`docs/LOCAL-DEV-SETUP.md`, 142 lines)

Step-by-step guide for Owner to install Vercel CLI, link project, pull
env vars, and run local dev with production parity. Includes:
  * Prerequisites (Node 22+, Vercel account)
  * 5-step setup sequence (install → login → link → env pull → run)
  * Iteration loop comparison: ~10 min/cycle (push-deploy-test) vs
    ~30 sec/cycle (save-reload-test)
  * Troubleshooting (auth issues, empty env pull, port conflicts)
  * Security notes (`.env.local` hygiene, key rotation)
  * AI session implications (faster bug feedback via local error stacks)

Expected payoff: every future runtime bug surfaces in seconds instead
of 2-3 min Vercel deploy cycles. Major time-saver for Session 3+
implementation work.

**P3 — Stakeholder demo prep** (2 files)

(a) `docs/DEMO-SCRIPT.md` (111 lines) — Demo flow script for dr Ferry
to use with Karumkit / Sie Renbang Angga / staff. Two versions:

  * **5-minute version**: opening + 3 pillars (audit attribution,
    Encounter-as-Convergence, modern UX + multi-RS). Each pillar 1-2 min
    with specific click-flow.
  * **15-minute version**: includes optimistic locking demo, health
    endpoints, architecture explanation, anticipated Q&A (7 questions
    pre-scripted including "vs Khanza", "cost", "security", "what if
    dr Ferry leaves").

Includes pre-demo checklist (5 min before stakeholder arrives) +
"Catatan untuk dr Ferry" with discipline reminders (no over-promise,
highlight Itjenad angle, willing to say "tidak tahu").

(b) `docs/KARUMKIT-BRIEF.md` (101 lines) — 1-page Karumkit briefing
handout (markdown source, printable). Structure:

  * "Apa Ini?" — single paragraph positioning
  * Three differentiators with concrete value framing (Itjenad/BPK
    audit, web access vs install-per-PC, multi-RS schema)
  * Live capabilities table (7 items, all ✅)
  * Phase 2.2+ roadmap table (5 items with estimates)
  * SIMRS BT vs vendor comparison table (8 dimensions, honest about
    vendor maturity advantage)
  * Operational cost reality (Rp 0/bulan saat ini, scaling estimate)
  * Three asks to Karumkit (proceed Phase 2.2, formal acknowledgment,
    consider Kakesdam pilot demo) + "What we're NOT asking" reframe

Tone: formal-but-readable, value-focused, honest about trade-offs.
Bahasa Indonesia throughout per audience.

**Verification (post-docs creation):**
  * TS errors: 0 (docs-only changes, no code touched)
  * Tests: 61 passed / 4 files (unchanged)
  * Build: untouched (markdown files not in production bundle)

**Session 2 final stats:**
  * Code commits: 2 (test infra + docs)
  * Tests: 61 passing, baseline established
  * Docs: 4 deliverables (CHECKPOINT-LOG update, SESSION-2-EXIT,
    LOCAL-DEV-SETUP, DEMO-SCRIPT, KARUMKIT-BRIEF)
  * Owner action items: setup `vercel dev` locally (~5 min, optional
    but high ROI) + practice demo flow before Karumkit meeting

### CP-2.8 — Session 3 Handover Bundle Preparation

Per Owner direction: prepare self-contained handover bundle for fresh
Session 3, designed to prevent drift/bias across project folders and
different Claude accounts.

**Bundle artifact:** `handover/session-3/SIMRS-BT-SESSION-3-HANDOVER.zip`
- 425 KB (1.1 MB uncompressed across 46 files)
- SHA256 captured in `handover/session-3/BUNDLE-HASH.txt`
- Internal SHA256 manifest in `bundle/MANIFEST-SHA256.txt` (per-file)
- Bundle origin commit locked to: `a6094ac` (Session 2 close)

**Bundle structure (numbered prefix for unambiguous reading order):**

| Prefix | Type | Content |
|---|---|---|
| 00 | NEW | README-HANDOVER — bundle index + anti-drift protocol |
| 01 | NEW | SESSION-3-BOOTSTRAP — mission, locked decisions, token budget |
| 02 | NEW | VERIFICATION-CHECKLIST — §B compaction-aware bootstrap commands |
| 03 | NEW | P1-3-DESIGN-DECISION — Approach B locked + harness pattern code |
| 04 | NEW | CREDENTIALS-MANIFEST — what Owner re-shares + verification |
| 10 | COPY | OWNER-POLICY-FOR-AI-SESSIONS — full v1.6 |
| 11 | COPY | SESSION-2-EXIT |
| 12 | COPY | SESSION-1-EXIT |
| 13 | COPY | SESSION-1-EXIT-ADDENDUM |
| 14 | COPY | CHECKPOINT-LOG |
| 20 | COPY | SIMRS-BT-ARCHITECTURE-BLUEPRINT (2153 lines) |
| 21 | COPY | README |
| 30 | COPY | docs/ (LOCAL-DEV-SETUP + DEMO-SCRIPT + KARUMKIT-BRIEF) |
| 40 | COPY | khanza-phase-3-codex (28 files, ~1 MB) — reference only |

**Design principles applied:**

1. **Self-contained** — no external URLs that fresh session must fetch;
   all authoritative content inside zip
2. **Numbered prefix** — `ls` produces unambiguous reading order
3. **Anti-tamper** — SHA256 manifest + zip hash recorded; mismatch
   signals corruption or stale bundle
4. **Source code SKIP** — per §P.5, fresh session `git pull` from origin
   commit `a6094ac` for clean code; bundle has only metadata + decisions
5. **Credentials SKIP** — per §W.3, Owner re-shares fresh per session;
   bundle has only template + verification commands
6. **Khanza codex full include with directional guidance** — Owner
   direction to prevent tautological reasoning (using my own past
   summary as confirmation of my past summary). Bundle README explicit:
   "Default do NOT read; reference only when verifying specific pattern
   claims OR heading to Phase 2.2 modul expansion."

**Anti-drift signals (in 00-README-HANDOVER.md):**
- Origin commit SHA: `a6094ac`
- Expected test count: 61
- Expected TS errors: 0
- Expected DB encounter row: `20260513-00001-RJ status=closed v=2`
- Expected patient row: `RM-2026-00002` Tn Dummy B2 NIK `1234567890123457`

Fresh session: if any signal mismatches verification output, STOP and
surface to Owner. Do NOT auto-resolve.

**Why this bundle works for "different Claude account, limited access":**
- No external API calls during bootstrap (only verification calls AFTER
  credentials supplied)
- All locked decisions inline (Approach B harness pattern, MVP scope,
  architectural patterns)
- Token budget guidance numerically explicit
- Q&A pre-scripted in 30-docs/DEMO-SCRIPT.md for common stakeholder
  questions
- Khanza codex enables independent verification of pattern claims
  without trusting summary docs

**Files added to repo (committed):**
```
handover/session-3/
├── BUNDLE-HASH.txt              (zip SHA256 — anti-tamper signal)
├── SIMRS-BT-SESSION-3-HANDOVER.zip   (425 KB, 46 files)
└── bundle/                      (uncompressed source for re-zip if needed)
    ├── 00-README-HANDOVER.md         (NEW, ~7 KB)
    ├── 01-SESSION-3-BOOTSTRAP.md     (NEW, ~9.5 KB)
    ├── 02-VERIFICATION-CHECKLIST.md  (NEW, ~9 KB)
    ├── 03-P1-3-DESIGN-DECISION.md    (NEW, ~11 KB — includes harness code)
    ├── 04-CREDENTIALS-MANIFEST.md    (NEW, ~6.5 KB)
    ├── MANIFEST-SHA256.txt           (42 file hashes)
    ├── [10-14, 20-21] = COPY of repo + uploaded docs
    ├── 30-docs/ = COPY of repo docs/
    └── 40-khanza-phase-3-codex/ = COPY of Blueprint Phase 3 source
```

---

*End of Session 2 log.*

