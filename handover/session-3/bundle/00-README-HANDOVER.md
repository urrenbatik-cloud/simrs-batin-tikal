# SIMRS BT — Session 3 Handover Bundle

**Bundle name:** `SIMRS-BT-SESSION-3-HANDOVER.zip`
**Created:** 14 Mei 2026
**Bundle origin commit:** `a6094ac`
**Repository:** `urrenbatik-cloud/simrs-batin-tikal`
**Predecessor session:** Session 2 closed (P0 verified + 61 tests + P2/P3 docs)
**Successor scope:** Session 3 — Option A finalization (P1.3 integration tests via Approach B, plus optional P4 token rotation)

---

## ⚠️ Read This First — Anti-Drift Protocol

This bundle is **self-contained**. Do NOT search the web, do NOT assume external URLs are valid, do NOT rely on memory from prior conversations. Every authoritative document needed for Session 3 bootstrap is inside this zip.

**Why:** Past sessions discovered that AI memory drift + compaction summaries can cause spurious "I think this was done" claims. The bundle is the single source of truth. If a claim in this bundle conflicts with an external claim, **the bundle wins**.

If you (fresh AI session) cannot verify a claim against this bundle, STOP and surface to Owner.

---

## Bundle Reading Order (Mandatory)

Fresh session MUST read in this sequence before any substantive work:

### Step 1 — Orientation (this file)
- `00-README-HANDOVER.md` ← you are here

### Step 2 — Operating prompt
- `01-SESSION-3-BOOTSTRAP.md` — Mission, locked decisions, deliverables, token budget

### Step 3 — Governance + verification
- `10-OWNER-POLICY-FOR-AI-SESSIONS.md` — full policy v1.6 (especially §B, §J, §L, §P, §V, §W)
- `02-VERIFICATION-CHECKLIST.md` — bootstrap verify scripts (run these first thing)

### Step 4 — State of the world
- `11-SESSION-2-EXIT.md` — most recent state snapshot
- `14-CHECKPOINT-LOG.md` — full chronological log Sessions 1 + 2

### Step 5 — Design decision (BLOCKING — Owner must approve in turn 1)
- `03-P1-3-DESIGN-DECISION.md` — Approach B recommended; Owner confirms

### Step 6 — Credentials handshake
- `04-CREDENTIALS-MANIFEST.md` — tells Owner what to re-share fresh

### Step 7 — Historical context (read only if relevant question arises)
- `12-SESSION-1-EXIT.md` — Session 1 baseline
- `13-SESSION-1-EXIT-ADDENDUM.md` — Bug 5 lessons + observability principles
- `20-SIMRS-BT-ARCHITECTURE-BLUEPRINT.md` — full 2153-line v2.0 architecture
- `21-README.md` — repo README
- `30-docs/*` — local dev, demo scripts, Karumkit brief (P2/P3 deliverables)
- `40-khanza-phase-3-codex/*` — full Phase 3 Codex bundle (28 files) — **REFERENCE ONLY**

### About the Khanza Phase 3 Codex (40-khanza-phase-3-codex/)

**Default: do NOT read.** These 28 files (~1 MB) are the primary source material that informed Blueprint v2.0's design choices. They are included to prevent **tautological reasoning** — if fresh session needs to verify a pattern claim (e.g., "P3-D Encounter-as-Convergence works because Khanza does X"), the original codex is here, not a summary in another doc.

**Read selectively when:**
- A specific pattern claim needs verification against original source
- Session 3+ heads to Phase 2.2 modul expansion (lab, prescription, billing) — those depend on `KHANZA-CODEX-PHASE-3-IMPLICATIONS-FOR-SIMRS-BT.md` (1147 lines, D3) and `KHANZA-CODEX-PHASE-3-PATTERNS-REGISTRY.md` (904 lines, D1)
- Anti-bias check needed: "did I summarize this correctly in CHECKPOINT-LOG?"

**Do NOT read by default** to avoid:
- Token waste (~100K+ tokens if read fully)
- Circular validation (using my own past summary as confirmation of my past summary)
- Scope drift away from P1.3 mission

---

## Bundle File-to-Purpose Map

| File | Type | Purpose |
|---|---|---|
| `00-README-HANDOVER.md` | NEW | This file — bundle navigation |
| `01-SESSION-3-BOOTSTRAP.md` | NEW | Operating prompt — fresh session pastes as first message |
| `02-VERIFICATION-CHECKLIST.md` | NEW | Bootstrap verification scripts (§B compaction-aware) |
| `03-P1-3-DESIGN-DECISION.md` | NEW | Approach B recommendation, requires Owner approval turn 1 |
| `04-CREDENTIALS-MANIFEST.md` | NEW | What Owner re-shares + verification commands |
| `10-OWNER-POLICY-FOR-AI-SESSIONS.md` | COPY | Full policy v1.6, all addendums |
| `11-SESSION-2-EXIT.md` | COPY | Session 2 final state |
| `12-SESSION-1-EXIT.md` | COPY | Session 1 baseline |
| `13-SESSION-1-EXIT-ADDENDUM.md` | COPY | Bug 5 + observability lessons |
| `14-CHECKPOINT-LOG.md` | COPY | Full chronological CP-1.1 → CP-2.7 |
| `20-SIMRS-BT-ARCHITECTURE-BLUEPRINT.md` | COPY | Blueprint v2.0 (2153 lines) |
| `21-README.md` | COPY | Repo README (live status) |
| `30-docs/LOCAL-DEV-SETUP.md` | COPY | `vercel dev` setup |
| `30-docs/DEMO-SCRIPT.md` | COPY | Stakeholder demo flow |
| `30-docs/KARUMKIT-BRIEF.md` | COPY | 1-page Karumkit handout |
| `40-khanza-phase-3-codex/*` | COPY | Phase 3 Codex (28 files) — reference only |

---

## Owner Pre-Session Action Items

Before opening Session 3 chat:

1. ☐ Upload `SIMRS-BT-SESSION-3-HANDOVER.zip` to fresh session
2. ☐ Paste content of `01-SESSION-3-BOOTSTRAP.md` as first message
3. ☐ Re-share credentials per `04-CREDENTIALS-MANIFEST.md` (fresh GitHub PAT + Supabase sbp_ + optional Vercel vcp_)
4. ☐ Decide on optional asks: P4 (Vercel token rotation), P2.2 modul direction if Option A nears completion

---

## Anti-Drift Signals

To detect bundle corruption / outdated bundle / context drift:

| Signal | Expected value | If mismatch |
|---|---|---|
| Origin commit SHA | `a6094ac` | Bundle is stale — Owner regenerate before use |
| Session 2 test count | **61 tests** in `tests/` directory after `git pull` | Tests regressed — investigate before proceeding |
| TS errors | **0** after `npx tsc --noEmit` | Code drift — verify against Session 2 exit state |
| Live DB encounter row | `20260513-00001-RJ status=closed v=2` | DB drift — Owner clarify smoke test history |
| RM-2026-00002 in patient table | Exists, NIK `1234567890123457`, v=2 | Bundle may not match current DB state |

Fresh session: if ANY of these mismatch what `02-VERIFICATION-CHECKLIST.md` produces when run, STOP and reconcile with Owner before substantive work.

---

## Bundle Integrity (Anti-Tamper)

This bundle SHA will be computed at zip-creation time and recorded in:
- `handover/session-3/BUNDLE-HASH.txt` (in the repo, signed by commit)
- The `bundle_origin_commit` field in this README will be updated to the exact commit SHA where bundle was finalized

If hash mismatch on receive: bundle was modified after commit. Owner should regenerate.

---

## Session Continuity Promise

This bundle is designed so that:
- A fresh Claude session at a different Anthropic account
- Working in a different sandbox / different working directory
- With NO memory of prior sessions
- Can execute Session 3 P1.3 + (optional) P4 with quality equivalent to in-session continuation

**Trade-off:** the bundle preparation cost is paid in Session 2 (this turn). Session 3 fresh session cost is reduced because all context is pre-curated.

---

*End of bundle index. Proceed to `01-SESSION-3-BOOTSTRAP.md`.*
