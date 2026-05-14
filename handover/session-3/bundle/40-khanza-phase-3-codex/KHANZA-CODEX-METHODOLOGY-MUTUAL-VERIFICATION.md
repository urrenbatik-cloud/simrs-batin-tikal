# The Khanza Codex — Methodology: Mutual Cross-Verification Pattern
## Anti-Drift Discipline for Multi-Session Multi-Phase Work

**File:** `KHANZA-CODEX-METHODOLOGY-MUTUAL-VERIFICATION.md`
**Versi:** 1.0
**Tanggal:** 13 Mei 2026
**Document type:** **Methodology specification** — pattern documentation untuk inter-session continuity discipline
**Authority:** Phase 3a session AI (codifying Owner-directed pattern from sub-session interaction 13 Mei 2026)
**Owner:** dr Ferry
**Status:** Living document — additive corrections allowed (per same pattern it documents); never deleting prior content

---

## 0. Purpose & Audience

### 0.1 Purpose

Document **explicit methodology pattern** untuk Khanza Codex multi-session work yang ditemukan/diformalkan Owner pada Phase 3a:

> *"saling melengkapi, saling mengkoreksi" — verifikasi temuan dari sesi sebelumnya tidak hanya dengan membaca dokumentasi tetapi dengan pemeriksaan empiris langsung. Filosofi: jangan terburu-buru, verifikasi fondasi secara empiris, edge cases adalah peluang enrichment, dan bukti solid untuk koreksi adalah improvement bukan drift.*

Pattern ini berlaku untuk:
- Phase-to-phase handoffs (Phase 1 → 2 → 3 → 4 → 5)
- Cross-session continuity (fresh session inheriting from terminated session)
- Quality assurance against single-session drift/bias

### 0.2 Audience

Audiens utama: **future Khanza Codex spoke session AI** — Phase 3b/c/d/e, Phase 4, Phase 5, atau any new fresh session yang inherit Codex work.

Audiens sekunder:
- Owner (dr Ferry) sebagai reviewer/decision-maker
- Future SIMRS BT spoke sessions (akan adopt similar pattern)
- Future SIKESUMA AI sessions (cross-project lateral peer awareness)

### 0.3 What This Document IS NOT

- Bukan replacement untuk methodology di Phase 1 brief (thesis-before-data, primitives-over-synthesis, platform-agnostic, clean-room) — those remain authoritative
- Bukan permission to relitigate Owner-approved findings without solid evidence
- Bukan license to skip Owner gates
- Bukan substitute untuk fresh session value — pattern PRESERVES need for fresh sessions

---

## 1. Core Pattern — Mutual Cross-Verification

### 1.1 Three Foundational Principles

#### Principle 1 — Empirical Verification, Not Document-Trust

**Rule:** Each successor session verifies predecessor findings **empirically against source** (Khanza repo), not just by reading predecessor documentation.

**Why:**
- Documents can carry forward errors transparently
- Reading-only inheritance creates drift propagation risk
- Empirical re-check catches subtle errors before they propagate

**Practical implementation:**
- Read prior session output → identify high-leverage anchor claims → re-verify via source-level grep/find/file inspection
- Don't re-test EVERY claim (waste); DO re-test anchors, falsifications, severity classifications, mixed-tag boundary cases

#### Principle 2 — Edge Cases = Enrichment Opportunities

**Rule:** Findings that don't fit cleanly into existing primitives are **candidates for enrichment**, not noise to discard.

**Why:**
- 45-primitive registry was Owner-approved snapshot at given point
- Empirical re-verification may surface patterns prior session missed
- "Missed" patterns may be primitive refinements, new candidate primitives, or simple clarifications

**Practical implementation:**
- During empirical verification, run BROAD edge scans (table prefix analysis, file-pattern analysis, structural scans)
- Surface anomalies as **enrichment candidates** for Owner decision
- Don't unilaterally adopt; Owner approves classification (refinement vs new primitive vs hold for later)

#### Principle 3 — Solid Evidence = Improvement, Not Drift

**Rule:** When successor finds evidence contradicting predecessor's specific claim, evidence-backed correction is **improvement**, not drift. When evidence is unclear/missing, defer to predecessor's Owner-approved position.

**Why:**
- "Drift" = unjustified deviation from Owner-approved foundation
- "Improvement" = empirically-grounded correction that enhances accuracy
- Distinction is **evidence strength**, not session-of-origin

**Practical implementation:**
- For any proposed correction: state predecessor's claim, state empirical finding, show evidence (counts, paths, file names), state proposed refinement, request Owner adjudication
- Owner has final authority to accept correction or maintain prior position

### 1.2 Pattern Asymmetry — Who Verifies Whom

| Direction | Allowed | Disallowed |
|---|---|---|
| Successor verifies predecessor | ✅ Empirical re-check; surface refinements | ❌ Unilateral revision without Owner gate |
| Predecessor reviews successor (if Owner facilitates) | ✅ Cross-check, challenge, defend prior framing | ❌ Direct edit of successor artifacts (no AI-to-AI cross-touch) |
| Owner mediates between sessions | ✅ Authoritative judgment, scope direction | (no constraint — Owner is single source of coordination) |

**Critical:** No direct AI-to-AI communication. All cross-session feedback flows via Owner (mirroring cross-project boundary discipline §2 of various briefs).

### 1.3 Phase 3a Demonstration Case (Live Example)

This pattern was **operationalized during Phase 3a** (Pre-Flight + Predecessor Analysis sub-sessions):

**Step 1 — Phase 1-2 session** authored 45 primitives, 12 anti-primitives, 3 Deep Choices framework. Owner-approved.

**Step 2 — Phase 1-2 session terminated.** Handover brief written for fresh Phase 3 session.

**Step 3 — Phase 3a session (fresh)** read Phase 1-2 output, BUT Owner directed empirical pre-flight verification. Phase 3a:
- Re-verified all 15 anchor counts via direct schema/code inspection
- Re-verified 2 falsifications (H6.2, H7.5) via independent grep patterns
- Surfaced 6 enrichment candidates from edge scans
- Self-corrected own methodology error (false positive on stored procedures grep)
- Produced Pre-Flight Report awaiting Owner gate

**Step 4 — Owner facilitated cross-review:** Owner asked predecessor (Phase 1-2 session) to review Phase 3a Pre-Flight Report.

**Step 5 — Predecessor analysis:**
- Endorsed 8 of 9 Pre-Flight refinements
- Pushed back on 1 (R9 P7-D severity — recommended downgrade further)
- **Caught Phase 3a miss**: `kode_*` prefix in P9-B (Phase 3a scanned 3 prefixes only, missed 4th)
- Confirmed N1 (Form-as-Table) was genuine Phase 2 gap

**Step 6 — Phase 3a re-verifies predecessor's push-backs:**
- R3 `kode_*` claim: **Predecessor was right** — verified empirically (1120-1151 occurrences, 79 distinct identifiers); Phase 3a adopts.
- R9 P7-D severity claim: **Empirical re-check with rigorous case-insensitive pattern revealed 346 unsafe files** (vs 2 Phase 3a originally found, vs predecessor's "76+ entry points"). Actually MORE Critical-justified than either prior position indicated.

**Step 7 — Phase 3a final judgment** (per Owner's authority delegation):
- Most predecessor push-backs adopted
- One push-back overridden with evidence-based counter-finding (R9)
- All decisions evidence-traced

**Pattern verified working.** This is the template for future sessions.

---

## 2. Per-Session Workflow Discipline

### 2.1 Successor Session Entry Checklist

Fresh session inheriting prior work MUST:

- [ ] Read prior phase output per stated reading order
- [ ] Identify anchor claims (high-leverage counts/findings multiple primitives depend on)
- [ ] **Decide pre-flight scope with Owner** before producing new content
- [ ] Run empirical verification proportionate to scope
- [ ] Surface deltas (with evidence) and enrichment candidates
- [ ] Produce Pre-Flight Report (if depth scope) or shorter verification note (if light scope)
- [ ] **STOP at Owner gate** — don't proceed to main deliverable without explicit Owner direction
- [ ] Self-log any methodology errors found during own verification

### 2.2 Anchor Categories (Verification Priority)

Not all claims equally important to verify. Triage:

| Priority | Category | Verification Effort | Examples |
|---|---|---|---|
| **P1** | Anchor counts multiple primitives depend on | High — exact reverification | reg_periksa 350 FK, user table 1198 cols |
| **P1** | Falsifications (high-value findings) | High — independent pattern test | H6.2 transactions, H7.5 audit |
| **P1** | Anti-primitive severity classifications | High — rigorous evidence | All 5 Critical anti-primitives |
| **P2** | Mixed-tag primitives (boundary cases) | Medium — verify both faces present | P1-A, P2-A, P5-A, P6-A |
| **P2** | Net-new primitive candidates from edges | Medium — evidence-build | Phase 3a N1 (Form-as-Table) |
| **P3** | Single-anchor specific counts | Low — within counting noise OK | JasperReports 1280 vs 1292 |
| **P3** | Tag classifications (non-mixed) | Low — only if seems mis-fitted | Most TIMELESS pure |

### 2.3 Empirical Verification Method Guidelines

#### Pattern Specification Best Practices

Based on errors learned in Phase 3a:

| Don't | Do |
|---|---|
| Use case-sensitive patterns for SQL keywords (`\bLIKE\b`) | Use case-insensitive (`grep -i 'like'`) — SQL is case-insensitive |
| Use loose patterns matching table names accidentally (`CREATE.*PROCEDURE`) | Use strict syntax patterns matching SQL grammar precisely |
| Trust single-pattern result | Cross-verify with alternative pattern (multiple greps converging) |
| Count occurrences only | Distinguish: total occurrences vs distinct identifiers vs files-containing |
| Compare absolute counts in isolation | Provide context ratios (safe/unsafe, distinct/total) |

#### Counting Methodology Disclosure

When reporting counts, **always specify what was counted**:
- "350 FK references to reg_periksa" — INSERT INTO ref / CREATE TABLE constraints / both?
- "176 status enums" — ENUM columns named status* / state-machine ENUMs / all ENUMs?
- "76+ entry points" — files / classes / methods / dialog windows?

Counting variance ±5-10% within reasonable methodology differences is **noise**, not delta.

### 2.4 Reporting Format (Pre-Flight Report Template)

Sections that proved valuable in Phase 3a Pre-Flight Report:
1. **Executive Summary** — TL;DR + Owner decision matrix
2. **Methodology** — what scope, what method
3. **Anchor Verification Table** — claim / measured / status / primitive anchored
4. **Deltas Identified** — per delta with evidence + recommendation
5. **Enrichment Candidates** — per finding with evidence + Owner decision needed
6. **Self-Corrections Logged** — own methodology errors found
7. **Recommendation** — proceed / pause / refine
8. **Pertanyaan untuk Owner** — concrete decisions sought
9. **Appendices** — reproducible commands, verification trail

Future sessions can adapt this template per their pre-flight scope (light vs depth).

---

## 3. Evidence-Based Correction Protocol

### 3.1 When Successor Disagrees with Predecessor

**Required protocol:**

```
[Successor finds evidence contradicting predecessor claim]
   ↓
1. State predecessor's claim verbatim (with citation)
2. State empirical finding (with method/commands)
3. Estimate evidence strength (high/medium/low)
4. Propose refinement options:
   - Adopt successor finding (overwrite)
   - Mixed framing (annotate prior with new evidence)
   - Hold for further verification
5. Surface to Owner via Pre-Flight Report or note
6. STOP — wait for Owner adjudication
7. Implement Owner's decision; log decision rationale
```

### 3.2 When Successor's Evidence is Weaker than Predecessor's

**Required protocol:**
- Defer to predecessor's Owner-approved position
- Log the question raised + why successor couldn't resolve
- Future session may verify with stronger method

### 3.3 When Predecessor Disagrees with Successor (Cross-Review Case)

Example: Phase 1-2 reviewing Phase 3a Pre-Flight (the live case).

**Required protocol:**
- Predecessor reviews via reading + can run own empirical checks (if Owner provides access)
- Predecessor articulates disagreement with evidence
- Owner facilitates via routing predecessor's review to successor
- Successor re-engages, verifies predecessor's push-back empirically
- Successor reaches final judgment (per Owner's "final judgment is yours")
- Final position evidence-traced

This is **exactly what happened in Phase 3a** with R3 (kode_*) and R9 (P7-D severity).

### 3.4 Special Case — Both Predecessor and Successor are Wrong

Discovered in Phase 3a R9: empirical rigor revealed BOTH initial positions undercounted unsafe surface.

**Required protocol:**
- Successor must be willing to **override own prior recommendation** based on new evidence
- This is NOT "flip-flopping" — it's pattern working (cross-verification surfacing truth)
- Solid evidence trumps prior framing, no matter source

---

## 4. Tone & Discipline Maintained

### 4.1 What Doesn't Change Across Sessions

The following disciplines apply universally:

- ✅ "Khanza optimized rationally" framing (Owner-directive)
- ✅ License clean (no verbatim code/SQL copy)
- ✅ Cross-project boundary (no SIKESUMA touch, no SIMRS BT artifact edit)
- ✅ Platform-agnostic primitive descriptions
- ✅ Per-deliverable Owner gate respect
- ✅ No AI-to-AI direct communication

### 4.2 What Changes Across Sessions

- ✅ Specific evidence-based primitive details may refine
- ✅ Severity classifications may shift with new evidence
- ✅ Layer 1 tag boundary cases may reclassify
- ✅ Net-new primitives may emerge (with solid evidence)
- ✅ Counting calibration may improve

**Decision authority:** Owner. Successor proposes; Owner disposes.

---

## 5. Fresh Session Compatibility

### 5.1 Why Fresh Sessions Still Needed

Owner's design uses fresh sessions to:
- Prevent context-window contamination
- Provide blind-spot audit (fresh eyes catch errors)
- Maintain reproducibility (no implicit shared state)

This methodology document does NOT eliminate that need. Fresh sessions still valuable for:
- Phase transitions (e.g., Phase 4 review session)
- Major iteration cycles
- Cross-spoke handoffs
- Periodic audit checkpoints

### 5.2 What Fresh Session Needs

A fresh session must be able to:
- Read this methodology document → understand the pattern
- Read lineage audit log → understand decision history
- Read relevant phase outputs → understand current state
- Make independent judgments → not just defer to prior sessions
- Surface own findings → contribute to lineage

This methodology supports — not replaces — fresh session value.

### 5.3 Bootstrap Time Budget

Fresh session bootstrap should take ~30-60 minutes:
- Read methodology + lineage: 10-15 min
- Read relevant phase outputs: 15-30 min
- Owner clarification of session scope: 5-10 min
- Initial empirical orientation: 10-15 min

Then proceed to substantive work.

---

## 6. Anti-Patterns to Avoid

### 6.1 Drift Patterns (What This Methodology Prevents)

| Anti-Pattern | Example | Counter |
|---|---|---|
| **Document-trust drift** | "Phase 2 says X, so X is true" | Re-verify empirically |
| **Reverence drift** | "Predecessor session was Owner-approved, so untouchable" | Owner-approved at point in time; new evidence allows refinement |
| **Cargo-cult correction** | "I'll correct because correcting is what I'm supposed to do" | Only correct with solid evidence |
| **Edge-discard drift** | "Doesn't fit existing primitives, discard" | Edge findings ARE the enrichment surface |
| **Single-pattern over-confidence** | "Grep returned 2, so it's narrow" | Cross-verify with alternative patterns |

### 6.2 Bias Patterns (What This Methodology Prevents)

| Anti-Pattern | Example | Counter |
|---|---|---|
| **Successor overcorrection** | "Predecessor wrong on R3, must be wrong on others" | Evaluate each claim independently |
| **Predecessor defensiveness** | "Successor doesn't understand context" | Engage substantively, defend with evidence or yield |
| **False humility** | "Owner said proceed, who am I to question?" | Owner explicitly empowers successor to challenge with evidence |
| **False confidence** | "My empirical method is rigorous, predecessor was sloppy" | Predecessor may have method differences; reconcile, don't assume |

---

## 7. Methodology Self-Audit

### 7.1 How This Methodology Will Be Improved

Following its own principles:

- Future sessions may surface limitations of this methodology
- Owner may direct refinements
- Refinements added to this document additively (never deleting prior content)
- New versioning (v1.0, v1.1, etc.) with corrections logged

### 7.2 Known Limitations

- Doesn't specify exhaustive Pre-Flight scope (Owner judgment per session)
- Doesn't quantify "solid evidence" threshold (depends on claim category)
- Doesn't handle cases where Owner is unavailable for gate (assume all phases have Owner)
- Doesn't address what happens if predecessor session has factual error AND was Owner-approved (we'd just correct with evidence per §3.1)

---

## 8. References

### 8.1 Related Documents

- `KHANZA-CODEX-PHASE-1-HYPOTHESES.md` — methodology foundation (thesis-before-data, primitives-over-synthesis)
- `KHANZA-CODEX-PHASE-2-CLOSEOUT.md` — Phase 2 final state
- `KHANZA-CODEX-PHASE-3-HANDOVER-BRIEF.md` — Phase 3 entry
- `KHANZA-CODEX-PHASE-3-PRE-FLIGHT-REPORT.md` — first Pre-Flight using this pattern
- `KHANZA-CODEX-LINEAGE-AUDIT-LOG.md` — additive audit history

### 8.2 Owner Source Direction

This methodology codifies Owner direction received during Phase 3a sub-session:

> "saya cenderung memulai dengan preparation pre-flight, check konsistensi hasil sesi sebelumnya secara empirical, mengidentifikasi edge lainnya sebagai potensi pengayaan, perbedaan berdasarkan valid solid prove bukan drift untuk saya, tetapi lebih ke improvement karena menguasai hidden character, saya berharap pondasi yang solid, pemahaman setiap edge, kemajuan menurut saya hanya natural consequences dari pondasi yang solid."

And:

> "konteks 1 dan konteks 2 (saling melengkapi, saling mengkoreksi, (verifikasi temuan dari sesi sebelumnya tidak hanya dengan membaca dokumentasi tetapi dengan pemeriksaan empiris langsung.), Filosofi (jangan terburu-buru, verifikasi fondasi secara empiris, edge cases adalah peluang enrichment, dan bukti solid untuk koreksi adalah improvement bukan drift.)"

---

**End of Methodology Document v1.0. Living document — future sessions may add refinements per §7.1, never deleting prior content.**
