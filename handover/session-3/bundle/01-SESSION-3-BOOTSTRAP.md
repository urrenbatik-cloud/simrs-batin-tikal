# SIMRS BT — Session 3 Bootstrap Prompt

**For Owner:** Paste this entire content as your first message to fresh Claude session, after uploading `SIMRS-BT-SESSION-3-HANDOVER.zip`.

**For Fresh AI Session:** This is your operating brief. Read fully before any tool call.

---

## Mission

Execute **Option A finalization** from Session 2 EXIT recommendation:

**Primary objective: P1.3 — Integration tests with real Postgres via Supabase Management API harness (Approach B, already approved Session 2).**

**Secondary objectives (only if primary done with budget remaining):**
- P4 — Vercel API token formalization for log access (optional)
- Session 3 EXIT documentation (mandatory at session close)

---

## Locked Decisions (DO NOT Relitigate)

These were decided in earlier sessions. AI MUST NOT re-debate; if Owner brings them up, refer to source doc:

| Decision | Locked in | Source |
|---|---|---|
| MVP scope = Patient Registrasi + Encounter Hub only | Phase 0 EXIT | Owner Policy §Y.2 |
| Encounter-as-Convergence (P3-D) verbatim adoption | Phase 0 EXIT | Blueprint v2.0 §4.7.3 |
| Audit columns universal day 1 | Phase 0 EXIT | Blueprint v2.0 §5.6.1 |
| Service layer pattern | Phase 0 EXIT | Blueprint v2.0 §5.6.9 |
| Bahasa Indonesia schema names | Phase 0 EXIT | Khanza P10-A |
| Inline Zod (not centralized lib) for MVP | Phase 0 EXIT | Blueprint v2.0 §5.6.8 deferred |
| Simple `role TEXT` (not 4-table RBAC) for MVP | Phase 0 EXIT | Blueprint v2.0 §5.6.7 deferred |
| `set_config()` NOT `SET LOCAL` for audit context | Session 1 Bug 4 | CHECKPOINT-LOG CP-1.9 lesson 4 |
| No `export type { X }` re-export in "use server" files | Session 1 Bug 5 | CHECKPOINT-LOG CP-2.4 |
| 61-test baseline floor (must INCREASE, not decrease) | Session 2 | Owner Policy §C |
| P1.3 integration tests via Management API harness (NOT testcontainers) | Session 2 | This bundle `03-P1-3-DESIGN-DECISION.md` |

---

## Locked Architectural Patterns (DO NOT Break)

From `10-OWNER-POLICY-FOR-AI-SESSIONS.md` §U.4 — these MUST be preserved:

🔴 **Audit trail visible in UI** — every patient/encounter modification shows in audit log
🔴 **End-to-end working flow** — input → save → retrieve → edit → audit visible
🔴 **Production URL on Vercel** — NOT localhost; Karumkit must access from own device

From Blueprint v2.0 §4.7 (UNCHANGED across all sessions):
- Time Model: queryable (audit-trail enabled)
- Definition Locality: centralized (service layer)
- Convergence Model: encounter-as-convergence (P3-D)

---

## Bootstrap Execution Order (Mandatory)

### Turn 1 — Bootstrap + verification

```bash
# Step 1: Verify bundle integrity
ls bundle/  # expect 00-README-HANDOVER.md and 01..04, 10..21, 30-docs/, 40-khanza-phase-3-codex/

# Step 2: Read these files in order (do NOT skip)
cat 00-README-HANDOVER.md
cat 01-SESSION-3-BOOTSTRAP.md      # this file
cat 02-VERIFICATION-CHECKLIST.md   # then EXECUTE its commands
cat 03-P1-3-DESIGN-DECISION.md     # confirm Approach B with Owner
cat 04-CREDENTIALS-MANIFEST.md     # request Owner re-share credentials

# Step 3: Run verification checklist (do not proceed if any check fails)
# (commands inside 02-VERIFICATION-CHECKLIST.md)

# Step 4: After ALL checks green + Owner re-shares credentials, confirm understanding to Owner
# Output 1-paragraph confirmation: "Bootstrap complete, baseline verified, ready for P1.3 with Approach B. Proceed?"
```

### Turn 2 onwards — P1.3 Implementation

After Owner confirms "proceed":

1. **Setup harness infrastructure**:
   - New file `tests/integration/harness.ts` — helper functions wrapping Management API SQL endpoint
   - Pattern proven Session 2 (see `04-CREDENTIALS-MANIFEST.md` for code snippet)
   - Functions: `runSql(query)`, `insertFixture(table, rows)`, `cleanFixtures(prefix)`, `withTestTransaction()`
   - Test data isolation: prefix all test rows with `TEST-{uuid}-` so cleanup is reliable
   - Setup creates a fresh ephemeral RS row + test user; teardown deletes all `TEST-*` prefixed rows

2. **Integration test files** (one per service, ~4 files):
   - `tests/integration/auth.test.ts` — signup → users table populated → handle_new_auth_user trigger fires correctly
   - `tests/integration/patient.test.ts` — create → audit_log INSERT row appears → edit → audit_log UPDATE row appears with field-level diff → version increments → optimistic lock conflict on stale version
   - `tests/integration/encounter.test.ts` — create → nomor_kunjungan format matches YYYYMMDD-NNNNN-{RJ|RI|IGD|OBS} → close → status transitions open→closed, closed_at + closed_by populated, version increments → cancel rejected after close
   - `tests/integration/audit.test.ts` — trigger fires correctly → audit_log row contains expected before/after JSONB → audit_log immutability enforced (UPDATE/DELETE raises EXCEPTION) → `app.current_user_id` context propagates correctly

3. **Verification mantra** per Owner Policy §C after each commit:
   ```
   npx tsc --noEmit            # 0 errors
   npm test                     # >= 61 tests (target: 75-85 after P1.3)
   npm run test:smoke           # build-smoke + static check pass
   npx next build               # ✓ Compiled successfully (with .env.local)
   ```

4. **Commit + push paired** per §J after each logical unit (probably 2-3 commits total for P1.3).

5. **Update CHECKPOINT-LOG** with CP-3.x entries as you go (not retroactively).

### Final Turn — Session 3 EXIT

Before declaring session done:
1. Update `CHECKPOINT-LOG.md` with final Session 3 entries
2. Create `SESSION-3-EXIT.md` (mirror format of `SESSION-2-EXIT.md` from bundle)
3. Update `tests/` test count baseline floor (likely 75-90 tests after P1.3)
4. Commit + push paired
5. (Optional) Prepare Session 4 handover bundle if Phase 2.2 work foreseen

---

## Token Budget Guidance

Per Owner Policy §V.5:

| Activity | Estimated budget |
|---|---|
| Bootstrap + verification + confirm to Owner | ~10% |
| P1.3 harness file (~1 file) | ~15% |
| 4 integration test files (~50-100 lines each) | ~30-40% |
| Verification + commits + CHECKPOINT-LOG updates | ~10% |
| SESSION-3-EXIT documentation | ~10% |
| **Total estimate** | **~75-85% budget** |

**Buffer:** ~15-25% reserved for unexpected debugging (Management API quirks, fixture isolation issues, etc).

**§V.5 trigger:** If at any point capacity drops below 30%, surface to Owner: "Phase X estimated heavy — recommend split atau abbreviate."

**§V.5 hard stop:** Below 20% remaining, generate handoff brief instead of starting new substantive work.

---

## Constraints from Lessons Learned (Do NOT Repeat)

| Lesson source | Constraint |
|---|---|
| Bug 3 (Session 1) | DO NOT construct Supabase pooler hostname from doc pattern. Use what Owner provides verbatim. |
| Bug 4 (Session 1) | DO NOT use `sql\`SET LOCAL ...\`` in Drizzle. Use `set_config(...)` function. |
| Bug 5 (Session 1) | DO NOT add `export type { X }` re-export to ANY `"use server"` file. (Static check now blocks this at CI — see `tests/build-smoke/use-server-static.test.ts`) |
| Session 2 mid-execution correction | DO empirically verify claims about what tests catch. 30-second injection-test loop. |
| Owner Policy §J | DO push immediately after commit. Never end turn with unpushed commits. |
| Owner Policy §L.5 | DO mask token prefixes in chat (`ghp_***[MASKED]`). Never echo raw token values. |
| Owner Policy §P.1 | DO commit + push in current session. Handover bundle is for compaction recovery, not normal workflow. |

---

## Communication Style (Owner Preferences)

- **Language:** Mixed Indonesian + English technical terms (matches Owner's writing style)
- **Tone:** Honest, professional, willing to surface mistakes proactively
- **Honesty over flattery:** If you find an error in earlier work, surface it directly. Owner respects this more than reassurance.
- **No over-explanation:** Owner is technically literate. Don't over-justify decisions Owner already approved.
- **Token efficiency:** Owner Policy §V.1 — solo Owner + AI = Claude IS the dev team. Tokens are operational resource.
- **Owner is single source of coordination** (§X): Do NOT cross-touch SIKESUMA work. Reference SIKESUMA patterns READ-ONLY if needed.

---

## Success Criteria for Session 3

✅ **Minimum acceptable** (Option A finalized):
- Approach B harness operational
- At least 2 integration test files working (patient + encounter most valuable)
- TS clean, baseline floor raised from 61
- Commits pushed paired per §J
- SESSION-3-EXIT.md generated

✅ **Target**:
- All 4 integration test files (~15-25 new tests)
- P4 Vercel API token formalized
- Updated demo / handover docs if relevant
- Session 4 scope confirmed (Phase 2.2 modul vs UX polish)

✅ **Stretch**:
- Bug surfaces during integration testing → captured + fixed in same session
- CI workflow file (`.github/workflows/test.yml`) added to enforce tests on push

---

## How to End Session 3

When Owner indicates done OR you've completed target:
1. Run final verification mantra (commit count, test count, TS errors, build status)
2. Create `SESSION-3-EXIT.md` in repo root
3. Update `CHECKPOINT-LOG.md` final entry
4. Commit + push paired
5. Report to Owner with:
   - What was completed
   - What remains (if anything)
   - Recommendation for Session 4 direction
   - File listing via `present_files` tool

---

*End of bootstrap prompt. Fresh session: proceed to read `02-VERIFICATION-CHECKLIST.md` next.*
