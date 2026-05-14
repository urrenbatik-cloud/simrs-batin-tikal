# The Khanza Codex — Phase 3 Execution Strategy & Post-Compaction Playbook

**File:** `KHANZA-CODEX-PHASE-3-EXECUTION-STRATEGY.md`
**Versi:** 1.0
**Tanggal:** 13 Mei 2026
**Document type:** **Execution strategy + Post-compaction emergency playbook** — operational guidance untuk completing remaining Phase 3 deliverables
**Author:** Phase 3a Khanza spoke session AI (per Owner Context 2 direction)
**Owner:** dr Ferry
**Status:** Awaiting Owner approval untuk strategy adoption + D2 production start

---

## 0. Purpose

Dokumen ini menjawab Owner direction (Context 2):
> "considering sebelumnya sudah 2 kali compaction, buat strategy, token estimate, check point, post compaction strategy sehingga tidak terjadi drift dan bias, while target pekerjaan can still be achieved"

Tiga fungsi utama:
1. **Strategy framework** — bagaimana sisa Phase 3 deliverables (D2, D3, D4) dieksekusi
2. **Token budget management** — estimasi consumption + checkpoint guidance
3. **Post-compaction emergency playbook** — recovery procedure jika compaction terjadi mid-deliverable

---

## 1. Current State Assessment

### 1.1 Phase 3a Cumulative Output (Completed)

| Document | Lines | Status |
|---|---|---|
| `KHANZA-CODEX-PHASE-3-PRE-FLIGHT-REPORT.md` | 628 | ✅ Complete (immutable historical) |
| `KHANZA-CODEX-METHODOLOGY-MUTUAL-VERIFICATION.md` | 385 | ✅ Complete (living reference) |
| `KHANZA-CODEX-LINEAGE-AUDIT-LOG.md` (v1.1) | 542 | ✅ Complete (append-only) |
| `KHANZA-CODEX-PHASE-3-PATTERNS-REGISTRY.md` | 904 | ✅ Complete (Owner-approved) |
| **TOTAL produced** | **2,459 lines** | |

### 1.2 Compaction Events This Session

- **Compaction #1:** Mid-Pre-Flight verification work
- **Compaction #2:** Post-cross-review pre-finalization
- **Compaction #3 risk:** Increasing as session extends

**Pattern observed:** Compactions happen roughly every 30-50K tokens of heavy work. Conservative estimate suggests <50% capacity remaining for new substantive output without 3rd compaction.

### 1.3 Phase 3 Remaining Deliverables

Per Handover Brief §5:

| # | Deliverable | Est. Lines | Complexity | Sources Required |
|---|---|---|---|---|
| D2 | `CAUSAL-CHAINS.md` | ~400-600 | Medium (relationship synthesis) | PATTERNS-REGISTRY + Phase 2 Closeout §4 |
| D3 | `IMPLICATIONS-FOR-SIMRS-BT.md` | ~700-1000 | **High** (forward roadmap, strategic) | PATTERNS-REGISTRY + CAUSAL-CHAINS + Phase 2 §6 |
| D4 | `IMPLICATIONS-FOR-SIKESUMA.md` | ~300-500 | Medium-high (boundary-sensitive) | Same + Owner-mediated SIKESUMA notes |
| **TOTAL** | | **~1,400-2,100 lines** | | |

---

## 2. Token Budget Analysis

### 2.1 Empirical Token Consumption Estimates (This Session)

| Activity | Estimated Token Consumption | Notes |
|---|---|---|
| Initial Pre-Flight (6 workstreams + tool outputs) | ~30-40K | Heavy bash output |
| Predecessor analysis ingestion | ~3-5K | Mostly text reading |
| Empirical re-verification (R3, R9) | ~10-15K | Drill-down with multiple bash calls |
| 4 documents production | ~25-35K output | Large structured writes |
| Owner exchanges + consistency audits | ~10-15K | Multiple rounds |
| Source-of-truth reading | ~10-15K | Phase 2 docs, Brief |
| **Cumulative estimate** | **~90-125K tokens** | Within 200K window |

### 2.2 Per-Deliverable Token Estimates (Forward)

| Deliverable | Output Lines | Output Tokens | Input/Reading Tokens | Total Estimated |
|---|---|---|---|---|
| **D2 CAUSAL-CHAINS** | 400-600 | ~10-15K | ~5-8K (PATTERNS-REGISTRY in context) | **~15-23K** |
| **D3 IMPLICATIONS-FOR-SIMRS-BT** | 700-1000 | ~18-25K | ~10-15K (multiple sources) | **~28-40K** |
| **D4 IMPLICATIONS-FOR-SIKESUMA** | 300-500 | ~8-12K | ~5-8K | **~13-20K** |
| **REMAINING TOTAL** | 1400-2100 | 36-52K output | 20-31K reading | **56-83K** |

### 2.3 Compaction Probability Assessment

**Current session capacity remaining:** Estimated 60-80K useful tokens before drift-inducing compaction.

| Scenario | Compaction Risk | Recommended |
|---|---|---|
| Continue single-session, all 3 deliverables | 🔴 HIGH (>70% chance of 3rd compaction mid-D3) | ❌ Not recommended |
| Single-session D2 only; fresh sessions for D3 + D4 | 🟢 LOW (D2 within safe budget) | ✅ **RECOMMENDED** |
| Single-session D2 + D4; fresh session for D3 | 🟡 MEDIUM (D4 smaller but still adds risk) | ⚠️ Possible |
| Fresh session for each of D2, D3, D4 | 🟢 LOWEST (3x bootstrap cost but safest) | ⚠️ Owner-orchestration heavy |

**Recommendation:** Option 2 — produce D2 this session; use fresh sessions for D3 and D4. Rationale:
- D2 is smallest and most tightly coupled to PATTERNS-REGISTRY (already in context)
- D3 is largest + most consequential; deserves fresh-session clarity
- D4 has boundary discipline criticality; fresh session reduces accidental drift

---

## 3. Per-Deliverable Strategy

### 3.1 Deliverable 2: CAUSAL-CHAINS (This Session)

**Scope** (per Brief §5.2):
- Document cross-primitive causal relationships
- Two main causal threads (anti-primitive clusters)
- Positive causal thread (timeless primitives)
- Force relationships (reinforcing vs constraining)

**Sources needed (already in context — no re-read required):**
- PATTERNS-REGISTRY (just produced)
- Lineage Log decisions

**Structure plan:**
1. Preamble (purpose, methodology)
2. Section A — Negative Causal Threads
   - Thread 1: Choice 1 cluster causation
   - Thread 2: Choice 2 cluster causation
3. Section B — Positive Causal Thread (Choice 3)
4. Section C — Cross-Cluster Reinforcement Patterns
5. Section D — Force Relationships Matrix
6. Closing — handoff to D3

**Estimated:** 450-550 lines, ~18K tokens

**Execution checkpoint:** Mid-document (line ~250) check token consumption + write incremental progress.

### 3.2 Deliverable 3: IMPLICATIONS-FOR-SIMRS-BT (RECOMMEND FRESH SESSION)

**Why fresh session optimal:**
- Largest deliverable (700-1000 lines)
- Most strategically consequential (SIMRS BT spoke is primary consumer)
- Fresh perspective valuable for "what should SIMRS BT do" questions
- Owner-mediated cross-project boundary critical — fresh session less likely to drift

**Fresh session bootstrap requirements:**
- Read order documented in §5 below
- Anchor verification per Methodology §2.2
- ~30-60 minutes bootstrap, then production

### 3.3 Deliverable 4: IMPLICATIONS-FOR-SIKESUMA (RECOMMEND FRESH SESSION)

**Why fresh session optimal:**
- Cross-project boundary discipline ABSOLUTE — fresh session won't have implicit SIMRS BT framings to bleed in
- Smallest but most boundary-sensitive
- Owner must brief separately on SIKESUMA-relevant notes

---

## 4. Checkpoint Protocol

### 4.1 In-Session Checkpoints (For D2 Production This Session)

**Checkpoint 1 — Pre-D2 Production**
- Verify source-of-truth in context: PATTERNS-REGISTRY ✓ Lineage Log ✓
- Confirm structure plan: 5 sections + closing
- Update Lineage Log L033 entry: "D2 production started"
- ✅ Approval gate from Owner before starting

**Checkpoint 2 — Mid-D2 Production (line ~250)**
- Pause; verify token budget healthy
- Flush partial content to file
- Brief self-check: structure on track, no drift detected

**Checkpoint 3 — Post-D2 Production**
- Verify all sections present
- Cross-reference primitives correctly cited
- Update Lineage Log L034: "D2 complete"
- Owner gate before D3 (which will be fresh session)

### 4.2 Per-Deliverable Closure Protocol

Every deliverable closes with these required artifacts:

1. **Document itself** in `/mnt/user-data/outputs/`
2. **Lineage Log entry** (next L0xx) documenting completion + key decisions
3. **State summary** for next session (1-paragraph or §5 update)
4. **Owner gate** before next deliverable

### 4.3 Pre-Compaction Detection Heuristics

Signs we're approaching compaction risk:
- Long tool outputs accumulating (>20K chars in single bash result)
- Multiple repeated reads of same source (suggests in-context state degrading)
- Owner exchanges becoming summary-heavy (responses needing to re-establish context)
- My responses starting to repeat prior findings unnecessarily

**Mitigation if detected:**
- IMMEDIATELY flush state to MD file
- Write brief "recovery brief" before continuing
- Hand back to Owner for fresh-session decision

---

## 5. Post-Compaction Recovery Playbook

### 5.1 Fresh Session Bootstrap Procedure

A fresh session resuming Phase 3 work MUST execute these steps:

#### Step 1 — Read Methodology + Lineage (10-15 min)
```
1. Read: /mnt/user-data/outputs/KHANZA-CODEX-METHODOLOGY-MUTUAL-VERIFICATION.md
   - Understand mutual cross-verification pattern
   - Internalize anti-drift discipline
2. Read: /mnt/user-data/outputs/KHANZA-CODEX-LINEAGE-AUDIT-LOG.md
   - Current version determines current state
   - Read §7 "Pending Owner Gate" for next action
   - Read latest L0xx entries for most recent decisions
```

#### Step 2 — Read Authoritative State (15-30 min)
```
3. Read: /mnt/user-data/outputs/KHANZA-CODEX-PHASE-3-PATTERNS-REGISTRY.md
   - 46 primitives catalog
   - 3 Deep Choices framework
   - Layer 1 tag semantics
4. Read: /mnt/user-data/outputs/KHANZA-CODEX-PHASE-3-PRE-FLIGHT-REPORT.md (only if questioning empirical baseline)
5. Read: /mnt/user-data/outputs/KHANZA-CODEX-PHASE-3-CAUSAL-CHAINS.md (if exists; produced in D2)
6. Read: /home/claude/codex/KHANZA-CODEX-PHASE-2-CLOSEOUT.md
   - Phase 2 authoritative summary
   - 5 Implicit Beliefs, Optimization Trade-off Matrix
7. Read: /home/claude/codex/KHANZA-CODEX-PHASE-3-HANDOVER-BRIEF.md
   - Phase 3 mandate
   - Cross-project boundary discipline (CRITICAL)
   - Per-deliverable spec (§5)
```

#### Step 3 — Empirical Verification Anchors (10-15 min)
Per Methodology §2.2, verify critical anchors before substantive work:
```bash
# Anchor counts (should match)
cd /home/claude/SIMRS-Khanza  # repo at this path; if absent, clone from GitHub
grep -c "reg_periksa" sik.sql  # expect ~350 FK refs context
find src/ -name "*.java" | wc -l  # expect 1627
grep -cE "^CREATE TABLE" sik.sql  # expect 1156

# Confirm Phase 3a corrections still hold
grep -oE "\`kode_[a-z_]+\`" sik.sql | sort -u | wc -l  # expect 79 distinct (R3 verification)
grep -rilE "like[[:space:]]+['\"]%[\"\']\+" --include="*.java" src/ | wc -l  # expect ~346 (R9 verification)
```

#### Step 4 — Owner Check-In (5-10 min)
Before substantive work, fresh session MUST:
- Confirm reading complete
- State understanding of current position (e.g., "I see Lineage at L034; D2 complete; awaiting D3 production")
- Confirm scope of own task (which deliverable)
- Receive Owner direction to proceed

#### Step 5 — Resume Substantive Work
Only after Steps 1-4 complete and Owner gate received.

### 5.2 Mid-Deliverable Compaction Recovery

If compaction happens DURING deliverable production:

**Situation A: Compaction summary preserved + partial deliverable file exists**
1. Read partial file at `/mnt/user-data/outputs/KHANZA-CODEX-PHASE-3-{deliverable}.md`
2. Identify last completed section
3. Re-read source-of-truth per §5.1
4. Continue from last completed section
5. Cross-check completed sections for tone/discipline consistency

**Situation B: Partial deliverable lost (worst case)**
1. Read Lineage Log latest entries — find which deliverable was in progress
2. Per §5.1 bootstrap
3. Owner check-in: confirm scope and any decisions made before compaction
4. Restart deliverable from scratch
5. **Do NOT relitigate completed Owner-approved decisions**

### 5.3 Anti-Drift Checklist (Post-Compaction)

Before producing any new content, fresh session verifies:

- [ ] PATTERNS-REGISTRY 46 primitives count confirmed
- [ ] Severity tally 5C + 5H + 2N confirmed (per L028)
- [ ] 4 prefix epochs in P9-B (no_, kd_, kode_, id_) confirmed (per L024)
- [ ] P7-D Critical retention with 346 unsafe files (per L026)
- [ ] N1 Form-as-Table as 46th primitive (per L027)
- [ ] Cross-project boundary: NO SIKESUMA clone/query/edit
- [ ] License clean: NO verbatim Java/SQL copy
- [ ] "Khanza optimized rationally" tone discipline

---

## 6. Anti-Drift & Anti-Bias Safeguards

### 6.1 Drift Risks Specific to Remaining Deliverables

| Risk | Affected Deliverable | Mitigation |
|---|---|---|
| Re-interpreting 3 Deep Choices | D2 CAUSAL-CHAINS | PATTERNS-REGISTRY §2 is canonical; cite by reference |
| Inflating SIMRS BT scope beyond Codex insights | D3 IMPLICATIONS-FOR-SIMRS-BT | Stick to "what Codex shows + recommendations"; no new architecture invention |
| Crossing SIKESUMA boundary | D4 IMPLICATIONS-FOR-SIKESUMA | Owner-mediated reference only; no clone/query/edit |
| Re-litigating P7-D severity | D2, D3 | L026 is canonical; reference Critical without re-debate |
| Tone slippage to critical/dismissive | All | Lead each anti-primitive with "Khanza optimized for X" context |

### 6.2 Bias Risks Specific to Multi-Session Continuation

| Bias | Affected | Mitigation |
|---|---|---|
| Fresh session reverence ("predecessor was Owner-approved, untouchable") | D3, D4 | Methodology §3.1 — evidence-based corrections allowed |
| Fresh session overcorrection ("predecessor was wrong on X, must be wrong on Y") | D3, D4 | Evaluate each claim independently |
| Successor confidence inflation ("my methodology is more rigorous") | D3, D4 | Lineage Log shows: every session has methodology errors |
| Owner-fatigue compromise (lowering quality to finish faster) | All | Maintain per-deliverable Owner gate even if slow |

### 6.3 Discipline Anchors (Universal — All Sessions)

**Locked-in from Phase 1-2-3a (cannot be relitigated without solid evidence):**
- 46 primitives baseline (45 + N1 Form-as-Table per L027)
- Severity tally 5C + 5H + 2N (per L028)
- 3 Deep Choices framework as organizing principle
- License: Khanza.Soft Media custom (per L022)
- Cross-project boundary discipline
- "Khanza optimized rationally" tone
- Additive-only lineage discipline

**Open for evidence-based refinement:**
- Specific evidence numbers (counting methodology variances acceptable ±5-10%)
- Mixed tag boundary cases
- Layer 1 tag assignments for edge primitives
- Force relationship classifications in CAUSAL-CHAINS
- Implementation recommendations in IMPLICATIONS docs

---

## 7. Decision Matrix for Owner

### 7.1 Strategy Adoption Decision

Owner choices:

**Choice A — Adopt this strategy as-is (Option 2 recommendation):**
- D2 produced this session
- D3 + D4 in fresh sessions
- Lineage Log L033+ tracks transitions

**Choice B — Adopt strategy but modify boundary:**
- D2 + D4 this session (since D4 is smaller)
- D3 only in fresh session

**Choice C — Override; single-session marathon for all 3:**
- High compaction risk
- Owner accepts risk for continuity

**Choice D — Owner-modified strategy** — please specify

### 7.2 D2 Production Approval

Independent of strategy choice above:
- ✅ Approve D2 CAUSAL-CHAINS production this session
- ⚠️ Hold D2 production pending strategy resolution

### 7.3 Default Delegation Status

Owner has previously confirmed default delegation per recommendations. If unchanged:
- Default = proceed with Choice A
- D2 production this session
- Owner orchestrates D3 + D4 with fresh sessions

---

## 8. Token Health Telemetry (To Update During D2 Production)

**Pre-D2 estimate:** ~60-80K useful tokens remaining

**During D2 production, monitor:**
- After preamble + Section A: estimate ~5K consumed → 55-75K remaining
- After Section B + C: estimate ~10K consumed → 45-65K remaining
- After Section D + closing: estimate ~15K consumed → 40-60K remaining
- Plus verification + delivery: ~3K → ~37-57K remaining

**Adequate margin for D2 completion + handoff.**

If during D2 production we approach 30K remaining or below:
- Flush partial state
- Halt + hand off to Owner
- Fresh session resumes per §5.2

---

## 9. Documents This Strategy Adds

If strategy approved:
- This file (this strategy doc) → `/mnt/user-data/outputs/KHANZA-CODEX-PHASE-3-EXECUTION-STRATEGY.md`
- Lineage Log L033 entry documenting strategy adoption
- Lineage Log L034 entry on D2 completion
- (Each subsequent deliverable adds L0xx entries)

---

## 10. Continuity Promise

This strategy serves as the **anchor reference** for any post-compaction recovery:
- Self-contained playbook (§5)
- Anti-drift safeguards (§6)
- State snapshot up to current moment

A fresh Phase 3 session bootstrap target: **30-60 minutes** to reach productive state, per §5.1 sequence.

**Drift prevention guarantee:** As long as Methodology MD, Lineage Log, PATTERNS-REGISTRY, and this strategy document are intact in `/mnt/user-data/outputs/`, the project can survive multiple compactions without losing essential state.

---

**End of Execution Strategy v1.0. Awaiting Owner direction on §7 decision matrix.**
