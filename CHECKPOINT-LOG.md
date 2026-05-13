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

**Demo-ready scope:** Patient registration + audit trail (signup → login →
create patient → edit patient → see audit trail with version increment).
This subset proves the value proposition for stakeholders (Karumkit / Sie
Renbang Angga).

**Deferred to Session 2:**
- Encounter create + close + cancel (P3-D narrative)
- Cross-encounter list, audit log universal viewer
- Smoke test steps 5-9

**Session 2 P0:** Resolve encounter create with Vercel logs access. See
`SESSION-1-EXIT-ADDENDUM.md` for detailed bug investigation log + Session 2
priority order.

---

*End of Session 1 log.*
