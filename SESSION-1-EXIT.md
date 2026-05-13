# SIMRS Batin Tikal — Session 1 EXIT

**Status:** ⏳ Session 1 substantially complete — pending Owner-side deployment actions

**Tanggal:** 13 Mei 2026
**Owner:** dr Ferry
**Predecessor:** Phase 0 EXIT (decision lock) + Blueprint v2.0 update session
**Successor:** Session 1B (smoke test + Vercel verify + remaining polish) OR
              Session 2 (Phase 2.2 modul expansion) depending on outcome

---

## Mission Accomplished

| Goal (per Bootstrap) | Status |
|---|---|
| Scaffold Next.js + TypeScript + Tailwind | ✅ Done |
| Drizzle ORM setup | ✅ Done |
| Supabase client + Auth | ✅ Done |
| 5-table schema with audit columns + `rs_id` + `version` | ✅ Done |
| Audit trigger pattern (`SET LOCAL app.current_user_id`) | ✅ Done |
| RLS policies defined (audit_log enabled, others deferred) | ✅ Done |
| Service layer (Patient + Encounter + Audit) | ✅ Done |
| Server Actions (auth + patient + encounter) | ✅ Done |
| UI pages (login, signup, patients CRUD, encounters, audit viewer) | ✅ Done |
| TypeScript zero errors + build green | ✅ Done |
| Deployed to Vercel Preview URL | ⏳ **Pending Owner action** |
| Smoke test critical paths | ⏳ **Pending deployment** |
| Owner-evaluable demo URL | ⏳ **Pending deployment** |

## What Owner Needs To Do Next

### Step 1 — Apply migrations to Supabase (15 min)

Open https://supabase.com/dashboard/project/gdihcqizwramcmqinqai/sql/new

Run these 4 files in order (paste content, click Run, wait for green):

1. `db/migrations/0000_core_schema.sql`
2. `db/migrations/0001_audit_triggers.sql`
3. `db/migrations/0002_rls_policies.sql`
4. `db/migrations/0003_seed_rs.sql`

Verify after migration 0003:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;
-- Expected: audit_log, encounter, patient, rs, users

SELECT id, kode_rs, nama_rs FROM rs;
-- Expected: 1 row
```

### Step 2 — Configure Supabase Auth (2 min)

Dashboard → Authentication → Providers → Email
- **"Confirm email" = OFF** (so first signup can immediately login)

Optional: Authentication → URL Configuration → Site URL =
`https://simrs-batin-tikal.vercel.app` (after Vercel connect)

### Step 3 — Connect Vercel (5 min)

1. https://vercel.com/new → Import `urrenbatik-cloud/simrs-batin-tikal`
2. Framework Preset: auto-detected as Next.js
3. Environment Variables (paste all 4 — values from credentials file):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://gdihcqizwramcmqinqai.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-jwt>
   SUPABASE_SERVICE_ROLE_KEY=<service-role-jwt>
   DATABASE_URL=postgresql://postgres.gdihcqizwramcmqinqai:KHULXD2Rq98T21Ig6s0WHGm0MFUMR3nh@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
4. Click Deploy

Expected: 2-4 minute build. Preview URL like `simrs-batin-tikal.vercel.app`
or `simrs-batin-tikal-<hash>-urrenbatik-cloud.vercel.app`.

### Step 4 — Smoke test (10 min)

Open the Vercel URL and run through this flow:

1. **Root redirect:** `/` → `/login`
2. **Signup:** `/signup` → register dr Ferry's account → auto-redirect to `/patients`
3. **First patient:**
   - `/patients/new` → fill required fields (RM number, nama, tanggal lahir, jenis kelamin) → Simpan
   - Should redirect to `/patients/[id]` showing the patient
   - Audit Trail card should show 1 row: `INSERT` operation, your name, "Pasien terdaftar"
4. **Edit:** Click "Edit" → change nama or tanggal lahir → save
   - Audit Trail should now show 2 rows; the UPDATE row should say `Diubah: nama_lengkap` (or whatever changed)
   - `Versi Data` should now be 2
5. **Encounter:** Click "Kunjungan Baru" → select jenis (e.g. Rawat Jalan) → keluhan utama → submit
   - Should appear in patient's "Riwayat Kunjungan" section
   - `nomor_kunjungan` should be `YYYYMMDD-00001-RJ` format
6. **Close encounter:** Click action menu → Tutup Kunjungan → confirm
   - Status badge should change to "Selesai"
   - Action menu should hide (closed kunjungan = no further actions)
7. **Cross-encounter view:** Top nav → "Kunjungan"
   - Should see the encounter you created across all patients
   - Filter "Selesai" should show just the closed one
8. **Audit log:** Top nav → "Audit Log"
   - Should see ≥3 rows: 1× INSERT patient, 1× UPDATE patient, 1× INSERT encounter, 1× UPDATE encounter (close)
   - Filter by tabel "Pasien" or "Kunjungan" should work
9. **Logout** → return to /login

If any step fails, see Troubleshooting below.

## Stakeholder Demo Script (For Karumkit / Sie Renbang Angga)

After successful smoke test, share the Vercel URL with one of these scripts:

**Short version (5 minutes, non-technical):**
> "Pak, ini SIMRS BT yang sedang saya bangun internal. Buka URL ini, daftarkan akun, lalu coba: tambah pasien baru, ubah nama, lihat di bagian bawah halaman pasien — semua perubahan tercatat siapa dan kapan. Bisa untuk audit Itjenad / BPK kalau diperlukan."

**Longer version (15 minutes, walk-through):**
1. Tunjukkan signup → login
2. Tunjukkan tambah pasien (fokus pada form yang clean + searchable)
3. Tunjukkan edit + audit trail (highlight: setiap perubahan permanen)
4. Tunjukkan kunjungan baru (semantic ID `YYYYMMDD-NNNNN-JENIS`)
5. Tunjukkan audit log universal — semua perubahan lintas pasien & kunjungan
6. Contrast vs Khanza/vendor (jika perlu): modern web vs Java Swing, audit attribution vs hanya timestamp, multi-RS-ready vs single-RS.

## Troubleshooting

### Build fails on Vercel

- Check env vars set on Vercel (Production + Preview both)
- Build log usually identifies the missing var

### Signup says "RS not configured"

- Migration 0003 not yet run. Apply it in Supabase SQL Editor.

### "audit context missing" error on patient create

- Trigger function expected `SET LOCAL app.current_user_id` but didn't find it
- Service code wraps in `withAuditContext` so this should never trigger from
  app paths. If it does, check that `getCurrentSession()` returned a valid
  user.

### "Invalid login credentials" on first signup

- Possible: "Confirm email" still ON in Supabase Auth. Disable it.
- Or: user not actually created — check Supabase Dashboard → Authentication → Users

### Migration 0000 fails with "function gen_random_uuid does not exist"

- `pgcrypto` extension not enabled. Migration 0000 includes
  `CREATE EXTENSION IF NOT EXISTS pgcrypto;` but on Free tier sometimes it
  needs Dashboard → Database → Extensions → enable `pgcrypto` manually first.

### Encounter creation fails — "patient_id not found"

- Patient lookup filters by `rs_id`. The auth.users → public.users trigger
  attaches new users to the first RS row. If 0003 didn't run before signup,
  user attachment is broken. Apply 0003, re-signup, retry.

## Known Issues / Tech Debt (Document for Future Sessions)

1. **`SET LOCAL` through pooler transaction mode**: design depends on
   `prepare: false` + explicit `db.transaction` — verified at build time, not
   yet runtime-tested under load.
2. **First signup race**: if Supabase fires `handle_new_auth_user` trigger
   BEFORE the RS seed row exists, the trigger raises EXCEPTION (intentional —
   prevents orphan users). Mitigation: apply 0003 before first signup.
3. **No real-time updates**: list pages reload manually. Supabase Realtime
   subscription post-MVP if needed for multi-operator workflows.
4. **No bulk import**: patient master must be entered one-at-a-time. CSV
   import = Phase 2.2 feature.
5. **No print/export**: PDF reports + Excel export = Phase 2.2 feature.
6. **Auth: no password reset flow**: Supabase supports this via magic link.
   Add UI later — out of MVP scope.
7. **No `app/(app)/encounters/[id]` route**: encounter detail accessed via
   patient view only. If standalone encounter detail page wanted, easy add.
8. **Vercel build warning**: `middleware.ts` deprecation in Next.js 16.2 —
   should rename to `proxy.ts` eventually. Functional for now.

## What's NOT in this MVP (per Phase 0 EXIT decision lock)

❌ Full 4-table RBAC (§5.6.7) — simple role TEXT only
❌ Centralized validation library (§5.6.8) — Zod inline
❌ Saga / transaction patterns (§5.6.3) — simple SQL txn only
❌ Sentry / error tracking (§5.6.5)
❌ State machine framework — simple status field
❌ Multi-RS RLS activation
❌ Billing modul / Lab modul / Prescription modul — Phase 2.2+
❌ Comprehensive tests

These are documented in CHECKPOINT-LOG §CP-1.2 as Owner-approved deferrals.

## Session 2 Recommendations

Pick ONE of these directions for next focused session:

**Option A — Stabilize & polish MVP** (small, ~1 session)
- Add password reset flow
- Add patient bulk-edit / batch operations
- Add print-friendly patient summary
- Add basic operational dashboard (counts: pasien aktif, kunjungan hari ini)
- Smoke test scripts as Vitest tests
- Owner-Sie-Renbang-Angga feedback loop on UX

**Option B — Phase 2.2 expansion** (multi-session)
- Lab modul (FK ke encounter)
- Prescription modul (FK ke encounter)
- Basic Billing modul (charges derived from clinical events per P3-D)

**Option C — Centralized validation library extraction** (§5.6.8)
- Extract Zod schemas to `lib/validators/` shared module
- Composable atomic validators (`isNIK`, `isNomorRekamMedis`, `isKodeICD10`)
- Run validators in 3 places: UI / Server Action / DB constraint

Recommendation: **Option A** first — get real stakeholder feedback before
committing to Option B/C. Stakeholder reality may reveal that the existing MVP
already covers more than enough for Phase 2.1 demo + Karumkit buy-in.

## Files Created This Session

```
Schema + migrations
  db/schema/_audit.ts
  db/schema/rs.ts
  db/schema/users.ts
  db/schema/patient.ts
  db/schema/encounter.ts
  db/schema/audit_log.ts
  db/schema/index.ts
  db/migrations/0000_core_schema.sql
  db/migrations/0001_audit_triggers.sql
  db/migrations/0002_rls_policies.sql
  db/migrations/0003_seed_rs.sql
  db/index.ts
  drizzle.config.ts

Library + wiring
  lib/audit-context.ts
  lib/session.ts
  lib/supabase/server.ts
  lib/supabase/client.ts
  lib/supabase/middleware.ts
  middleware.ts

Services
  services/patientService.ts
  services/encounterService.ts
  services/auditService.ts

Server Actions
  app/actions/auth-actions.ts
  app/actions/patient-actions.ts
  app/actions/encounter-actions.ts

UI Pages
  app/page.tsx (root redirect)
  app/login/page.tsx + login-form.tsx
  app/signup/page.tsx + signup-form.tsx
  app/(app)/layout.tsx
  app/(app)/patients/page.tsx
  app/(app)/patients/patient-form.tsx
  app/(app)/patients/new/page.tsx
  app/(app)/patients/[id]/page.tsx
  app/(app)/patients/[id]/edit/page.tsx
  app/(app)/encounters/page.tsx
  app/(app)/encounters/new-encounter-dialog.tsx
  app/(app)/encounters/encounter-actions.tsx
  app/(app)/audit/page.tsx

Components
  components/ui/form.tsx (manual install — CLI silently failed)
  components/ui/link-button.tsx (asChild → render bridge)

Docs
  README.md (replaced default)
  CHECKPOINT-LOG.md
  SESSION-1-EXIT.md (this file)
  .env.example
```

## Sign-off

Session 1 substantially complete. Code committed + pushed to
`urrenbatik-cloud/simrs-batin-tikal` main branch.

Build verified green. Architectural patterns from Blueprint v2.0 §5.6
implemented as designed. Phase 0 EXIT scope honored — no scope creep, no
feature outside MVP.

Owner action required to bring the demo to life: 30 minutes of paste +
configure work, no code changes needed.

Next AI session can pick up from this exit document directly. All design
decisions are documented; rationale is in CHECKPOINT-LOG.

---

*End of Session 1 EXIT.*
