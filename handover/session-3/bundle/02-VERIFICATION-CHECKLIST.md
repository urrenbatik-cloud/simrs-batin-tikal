# Verification Checklist — Session 3 Bootstrap

**Audience:** Fresh AI session at Session 3 start
**Purpose:** Verify state-of-the-world matches bundle claims BEFORE any substantive work
**Authority:** Owner Policy §B (Compaction-Aware Verification — mandatory protocol)

If ANY check fails, **STOP and surface to Owner**. Do not "fix" or "proceed anyway". Discrepancy = potential data corruption or bundle drift; only Owner can authorize reconciliation.

---

## Pre-Flight Setup

```bash
# 1. Confirm working directory is fresh (no leftover state from another project)
pwd
ls -la
# Expected: empty or just bundle files (no existing simrs-bt/ folder)
```

```bash
# 2. Clone repo with Owner-supplied PAT
PAT=<PASTE FROM OWNER'S CREDENTIALS SHARE>
git clone "https://x-access-token:${PAT}@github.com/urrenbatik-cloud/simrs-batin-tikal.git" simrs-bt
cd simrs-bt

# 3. IMMEDIATELY scrub PAT from .git/config (per §J.3)
git remote set-url origin "https://github.com/urrenbatik-cloud/simrs-batin-tikal.git"
unset PAT
grep -E "ghp_|x-access-token" .git/config && echo "❌ LEAKED" || echo "✅ PAT clean"
# Expected: ✅ PAT clean
```

---

## Verification Check 1 — Git State Matches Bundle Origin

```bash
git branch --show-current
# Expected: main

git rev-parse --short HEAD
# Expected: a6094ac
# (or newer commit if Owner has pushed between bundle creation and Session 3 start)

git log --oneline -5
# Expected first 4 (Session 2 final state):
#   a6094ac docs: Session 2 Option A continuation — P2 (vercel dev) + P3 (demo prep)
#   1387a19 docs: Session 2 EXIT + CHECKPOINT-LOG entry (CP-2.1 → CP-2.6)
#   ee66d4c feat(tests): vitest safety net — 61 tests across build-smoke + unit
#   fc220f9 docs: SESSION-1-EXIT addendum revision — Bug 5 RESOLVED + observability lesson
```

❌ **If `HEAD != a6094ac` AND no Session-3-related commits are visible:**
- Bundle is stale OR repo was modified.
- Action: ask Owner to confirm latest state. Do NOT proceed.

✅ **If `HEAD == a6094ac` exactly:** baseline match, proceed.

✅ **If `HEAD` is newer with Session-3-prefixed commits:** another session started — STOP, surface to Owner ("apakah ada session paralel?").

---

## Verification Check 2 — Working Tree Clean

```bash
git status --short
# Expected: empty (no output)
```

❌ **If output is not empty:**
- Untracked files or local modifications exist.
- Action: report to Owner; do NOT proceed until reconciled.

---

## Verification Check 3 — Node + Dependencies

```bash
node --version
# Expected: v22.x.x (or newer; Session 2 used v22.22.2)

npm install
# Expected: clean install, no errors. Takes 30-90 seconds.
# If errors, surface to Owner — likely package-lock drift.
```

---

## Verification Check 4 — Test Baseline Invariant

Per Owner Policy §C: **61 tests is the floor**. Must NOT decrease.

```bash
npm test 2>&1 | grep -E "(Test Files|Tests)" | tail -2
# Expected:
#   Test Files  4 passed (4)
#       Tests  61 passed (61)
```

❌ **If `Tests < 61`:** test regression. STOP, surface to Owner.
❌ **If `Tests` count not visible or test file count != 4:** test infrastructure drift.

✅ **If `Tests >= 61`:** baseline maintained, proceed.

---

## Verification Check 5 — TypeScript Clean

```bash
npx tsc --noEmit 2>&1 | grep -c "error TS"
# Expected: 0
```

❌ **If output > 0:** TypeScript errors exist. Surface to Owner.

---

## Verification Check 6 — Build Verification (Optional, slower)

This requires `.env.local` with stub values (or real values via `vercel env pull`). Skip if no env credentials yet.

```bash
# Only if Owner has shared Supabase credentials AND `.env.local` is populated
npx next build 2>&1 | tail -10
# Expected:
#   ✓ Compiled successfully in XXs
#   Finished TypeScript in XXs
#   (no "Error:" lines)
```

---

## Verification Check 7 — Live DB State (Supabase Management API)

This requires Owner to share fresh Supabase Management API token (`sbp_...`). Wait until Owner provides it.

```bash
SBP=<PASTE FROM OWNER'S CREDENTIALS SHARE>

# Check 7a — Project alive
curl -s "https://api.supabase.com/v1/projects/gdihcqizwramcmqinqai" \
  -H "Authorization: Bearer ${SBP}" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print('name:',d.get('name'),'| status:',d.get('status'))"
# Expected: name: simrs-batin-tikal | status: ACTIVE_HEALTHY

# Check 7b — Tables exist
PAYLOAD='{"query":"SELECT count(*) as n FROM information_schema.tables WHERE table_schema='\''public'\'' AND table_name IN ('\''rs'\'','\''users'\'','\''patient'\'','\''encounter'\'','\''audit_log'\'');"}'
curl -s -X POST "https://api.supabase.com/v1/projects/gdihcqizwramcmqinqai/database/query" \
  -H "Authorization: Bearer ${SBP}" -H "Content-Type: application/json" -d "$PAYLOAD" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print('tables:',d[0]['n'])"
# Expected: tables: 5

# Check 7c — Audit log evidence from Session 2
PAYLOAD='{"query":"SELECT table_name, operation, count(*) FROM audit_log GROUP BY table_name, operation ORDER BY table_name, operation;"}'
curl -s -X POST "https://api.supabase.com/v1/projects/gdihcqizwramcmqinqai/database/query" \
  -H "Authorization: Bearer ${SBP}" -H "Content-Type: application/json" -d "$PAYLOAD" \
  | python3 -c "
import json,sys
d = json.load(sys.stdin)
for r in d:
    print(f\"  {r['table_name']:15s} {r['operation']:8s} = {r['count']}\")
"
# Expected (approximate — counts may grow if Owner did extra testing):
#   encounter       DELETE   = 8
#   encounter       INSERT   >= 9
#   encounter       UPDATE   >= 1     ← Session 2 P0 evidence
#   patient         DELETE   >= 1
#   patient         INSERT   >= 2
#   patient         UPDATE   >= 2

# Check 7d — Specific encounter evidence (close transition tested in Session 2 P0)
PAYLOAD='{"query":"SELECT nomor_kunjungan, status_kunjungan, version, closed_at IS NOT NULL as has_closed FROM encounter WHERE nomor_kunjungan='\''20260513-00001-RJ'\'';"}'
curl -s -X POST "https://api.supabase.com/v1/projects/gdihcqizwramcmqinqai/database/query" \
  -H "Authorization: Bearer ${SBP}" -H "Content-Type: application/json" -d "$PAYLOAD" \
  | python3 -c "
import json,sys
d = json.load(sys.stdin)
if d:
    r = d[0]
    print(f\"  {r['nomor_kunjungan']} status={r['status_kunjungan']} v={r['version']} has_closed={r['has_closed']}\")
else:
    print('NOT FOUND')
"
# Expected: 20260513-00001-RJ status=closed v=2 has_closed=True
# (If status != closed OR v < 2, P0 evidence is missing — Session 2 work may have been rolled back)

unset SBP
```

❌ **If 7a fails:** Supabase project down or token invalid. Owner must verify.
❌ **If 7b returns != 5:** Schema drift — migrations may have been reverted.
❌ **If 7c shows `encounter UPDATE = 0`:** Session 2 P0 evidence missing.
❌ **If 7d returns NOT FOUND OR status != closed:** baseline encounter removed/modified.

---

## Verification Check 8 — File Inventory Match

```bash
# Confirm expected file structure
ls services/ 2>&1
# Expected: auditService.ts, encounterService.ts, patientService.ts

ls app/actions/ 2>&1
# Expected: auth-actions.ts, encounter-actions.ts, patient-actions.ts

ls tests/ 2>&1
# Expected: build-smoke/, setup.ts, stubs/, unit/

ls docs/ 2>&1
# Expected: DEMO-SCRIPT.md, KARUMKIT-BRIEF.md, LOCAL-DEV-SETUP.md
```

❌ **If any expected file/folder missing:** repo state drift.

---

## Verification Summary Template

After running all checks, output to Owner in this format:

```
=== Session 3 Bootstrap Verification ===
Check 1 (Git state):       ✅ HEAD a6094ac, main branch, log matches
Check 2 (Working tree):    ✅ Clean
Check 3 (npm install):     ✅ No errors
Check 4 (Tests):           ✅ 61 passed / 4 files
Check 5 (TypeScript):      ✅ 0 errors
Check 6 (Build):           ⏳ Pending .env.local from Owner OR skipped
Check 7a (Supabase alive): ✅ ACTIVE_HEALTHY
Check 7b (5 tables):       ✅ 5
Check 7c (Audit history):  ✅ encounter UPDATE = 1, patient counts match
Check 7d (Closed encntr):  ✅ 20260513-00001-RJ status=closed v=2
Check 8 (File inventory):  ✅ All expected paths present

Baseline verified. Ready for Session 3 P1.3 (Approach B confirmed).
Awaiting Owner approval to proceed.
```

If ANY check is ❌, replace template above with:

```
❌ BOOTSTRAP FAILURE — Check N failed: <description>

Bundle bundle_origin claimed: <expected>
Actual state observed: <actual>

This indicates: <hypothesis>

Recommended action: <ask Owner what they'd like — do NOT auto-resolve>

PAUSING all substantive work until Owner clarifies.
```

---

## After All Checks Pass

Fresh session is cleared to execute Session 3 Mission per `01-SESSION-3-BOOTSTRAP.md` → Turn 2 onwards.

Proceed to read `03-P1-3-DESIGN-DECISION.md` to confirm Approach B with Owner.

---

*End of verification checklist.*
