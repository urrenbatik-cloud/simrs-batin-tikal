# SIMRS Batin Tikal

**Sistem Informasi Manajemen Rumah Sakit** — RS Tk.IV 02.07.03 Batin Tikal, TNI AD.

Phase 2.1 MVP: **Patient Registrasi + Encounter Hub** — proof-of-concept demonstrating internal TNI AD SIMRS capability.

## Status (per Session 1, 13 Mei 2026)

| Aspek | Status |
|---|---|
| Schema foundation | ✅ Migrations 0000–0003 written; **pending Owner-paste ke Supabase Dashboard** |
| Service layer | ✅ Patient + Encounter + Audit services |
| Auth | ✅ Supabase Auth email/password |
| UI | ✅ Login, signup, patients (list/new/view/edit), encounters (list + dialog), audit log viewer |
| TypeScript | ✅ `npx tsc --noEmit` zero errors |
| Build | ✅ `npx next build` success — all 10 routes compile |
| Deployment | ⏳ Vercel connect pending Owner action |
| Runtime smoke test | ⏳ Pending Vercel deployment |

## Architectural Foundation (Blueprint v2.0)

Locked from day 1 (cheap-upfront, expensive-retrofit patterns):

| Pattern | Source | Implementation |
|---|---|---|
| Universal audit columns | §5.6.1 | `db/schema/_audit.ts` helper + trigger `fn_fill_audit_columns` |
| Append-only audit log | §5.6.1 | `audit_log` table + `fn_write_audit_log` trigger + `fn_audit_log_immutable` |
| Optimistic locking | §5.6.2 | `version BIGINT` column + trigger increment + service-layer `WHERE version = ?` check |
| Multi-tenant `rs_id` | §5.6.6 | Every operational table; RLS policies defined; activation deferred |
| Encounter-as-Convergence ⭐⭐ | §4.7.3 + Appendix A.3 (Khanza P3-D) | UUID PK + semantic `nomor_kunjungan` + clinical-detail-FK-target |
| Service layer | §5.6.9 | `services/*.ts` pure TS, transaction units via `withAuditContext` |
| Indonesian schema | Khanza P10-A | Bahasa Indonesia field names throughout |

Deferred per Phase 0 EXIT (expensive-upfront, retrofittable):
- Full 4-table RBAC (§5.6.7) — simple `role TEXT` for MVP
- Centralized validation library (§5.6.8) — inline Zod
- Transaction sagas (§5.6.3) — simple SQL transactions
- Sentry / error tracking (§5.6.5)
- RLS activation across all tables (only `audit_log` enabled day 1)

## Tech Stack (Locked Session 1)

- **Framework:** Next.js 16 (App Router, Server Components + Server Actions)
- **Language:** TypeScript strict
- **Database:** Supabase (PostgreSQL 16) + Auth
- **ORM:** Drizzle ORM (postgres.js driver, Supavisor pooler at runtime)
- **UI:** Tailwind CSS v4 + shadcn/ui v3 (base-ui based)
- **Forms:** React Hook Form + Zod
- **Validation:** Zod inline per route
- **Deployment:** Vercel

## Project Structure

```
simrs-batin-tikal/
├── app/
│   ├── (app)/                          # Authenticated routes (dashboard chrome)
│   │   ├── layout.tsx                  # Shared header + nav
│   │   ├── patients/
│   │   │   ├── page.tsx                # List + search
│   │   │   ├── new/page.tsx            # Create form
│   │   │   ├── [id]/page.tsx           # Detail + encounters + audit trail
│   │   │   ├── [id]/edit/page.tsx      # Edit form
│   │   │   └── patient-form.tsx        # Shared form (create/edit)
│   │   ├── encounters/
│   │   │   ├── page.tsx                # Cross-patient list
│   │   │   ├── new-encounter-dialog.tsx
│   │   │   └── encounter-actions.tsx
│   │   └── audit/page.tsx              # Universal audit log viewer
│   ├── actions/                        # Server Actions
│   ├── login/, signup/                 # Public auth pages
│   └── layout.tsx                      # Root layout
├── components/ui/                      # shadcn primitives + LinkButton helper
├── db/
│   ├── schema/                         # Drizzle TypeScript schema
│   ├── migrations/                     # Hand-written SQL (authoritative)
│   │   ├── 0000_core_schema.sql
│   │   ├── 0001_audit_triggers.sql
│   │   ├── 0002_rls_policies.sql
│   │   └── 0003_seed_rs.sql
│   └── index.ts                        # postgres.js + Supavisor pooler config
├── lib/
│   ├── supabase/{server,client,middleware}.ts
│   ├── audit-context.ts                # withAuditContext: SET LOCAL inside txn
│   ├── session.ts                      # requireSession / getCurrentSession
│   └── utils.ts
├── services/                           # Business logic (§5.6.9)
│   ├── patientService.ts
│   ├── encounterService.ts
│   └── auditService.ts
├── middleware.ts                       # Next.js middleware (auth gating)
└── drizzle.config.ts
```

## Environment Variables

`.env.local` for local dev, and Vercel env vars for deployment:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-jwt>
SUPABASE_SERVICE_ROLE_KEY=<service-role-jwt>
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
```

`DATABASE_URL` uses **Supavisor pooler transaction mode (port 6543)** — required for serverless. Direct DB (port 5432) is IPv6-only on Free tier.

## Deployment (Owner Actions Required)

### 1. Apply migrations to Supabase

Open Supabase Dashboard → SQL Editor. Run each file in order; paste the SQL, then click **Run**:

1. `db/migrations/0000_core_schema.sql` — tables, indexes, auth→users sync trigger
2. `db/migrations/0001_audit_triggers.sql` — audit fill + log triggers + immutability guard
3. `db/migrations/0002_rls_policies.sql` — RLS policies (only audit_log enabled day 1)
4. `db/migrations/0003_seed_rs.sql` — RS Batin Tikal initial tenant

Each migration is wrapped in `BEGIN; … COMMIT;` so it's all-or-nothing.

**Verify migration 0000 success:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('rs', 'users', 'patient', 'encounter', 'audit_log')
ORDER BY table_name;
-- Expected: 5 rows
```

**Verify migration 0003 success:**
```sql
SELECT id, kode_rs, nama_rs FROM public.rs;
-- Expected: 1 row, kode_rs = 'RS-BT-020703'
```

### 2. Disable email confirmation (MVP)

Supabase Dashboard → Authentication → Providers → Email → **"Confirm email" = OFF**.

This lets first signup login immediately without email verification.

### 3. Connect Vercel

1. vercel.com → New Project → Import `urrenbatik-cloud/simrs-batin-tikal`
2. Framework preset: Next.js (auto-detected)
3. Add Environment Variables (Production + Preview):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://gdihcqizwramcmqinqai.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-jwt from credentials file>
   SUPABASE_SERVICE_ROLE_KEY=<service-role-jwt>
   DATABASE_URL=postgresql://postgres.gdihcqizwramcmqinqai:<password>@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
4. Deploy. Get the preview URL.

### 4. First signup

Open the Vercel URL → /signup. The first user automatically:
- Creates row in `auth.users`
- Triggers `handle_new_auth_user()` → creates row in `public.users` with `role = 'pendaftaran'` and `rs_id` = the seeded RS Batin Tikal row.

Subsequent signups follow the same path.

## Audit Trail Design

Every write transaction sets `app.current_user_id` via `SET LOCAL` (handled by `lib/audit-context.ts`):

```typescript
return withAuditContext(userId, async (tx) => {
  return tx.insert(patientTable).values({...}).returning()
})
```

The trigger function reads `current_setting('app.current_user_id', true)`:
- If present → populate `created_by`/`updated_by`/`updated_at` + increment `version`
- If absent → raise EXCEPTION (fail-loud, prevent silent attribution loss)

`audit_log` rows are inserted by trigger automatically. `audit_log` is APPEND-ONLY — UPDATE/DELETE blocked by trigger + RLS policy.

## RLS Activation (Multi-RS Future)

When 2+ RS deployment arrives, single statement per table:

```sql
ALTER TABLE public.rs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encounter ENABLE ROW LEVEL SECURITY;
```

Policies are already defined; no edits needed.

## Demo Flow (For Stakeholders — Sie Renbang / Karumkit)

After deployment:

1. Open Vercel URL → land on /login
2. Click "Daftar" → register first account (e.g., your name + email)
3. Login → land on /patients (empty)
4. Click "Pasien Baru" → fill form → submit
5. View patient detail → see audit trail showing "Pasien terdaftar" with timestamp + your name
6. Click "Edit" → change a field → save → see audit trail show "Diubah: nama_lengkap" with both before/after
7. Click "Kunjungan Baru" → create encounter → see it in patient's encounter list
8. Navigate to /encounters → cross-patient list with status filter
9. Navigate to /audit → universal audit log viewer with table + operation filters

**This is the proof-of-concept narrative**: every action tracked, queryable, modern web UX.

## Notes for Future Sessions (Phase 2.2+)

- **Centralized validation library** (§5.6.8): Extract Zod schemas to `lib/validators/` when modul count grows past 2-3.
- **Full RBAC** (§5.6.7): Migrate `role TEXT` → 4-table abstraction when permission grain demands.
- **Encounter clinical details**: Future modul (lab, prescription, diagnostic, treatment) FK to `encounter.id`. The convergence pattern is established.
- **Tests**: Critical-path tests deferred for MVP. Vitest setup + service-layer unit tests recommended Session 2.
- **Sentry**: Defer until post-MVP.
- **Saga patterns**: For BPJS submission, payment gateway integration — deferred to Phase 2.2+.
