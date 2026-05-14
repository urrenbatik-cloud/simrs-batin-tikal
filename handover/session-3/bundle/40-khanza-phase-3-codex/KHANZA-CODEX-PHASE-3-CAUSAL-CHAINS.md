# The Khanza Codex — Phase 3 Deliverable 2: CAUSAL-CHAINS
## Cross-Primitive Causal Relationships Map

**File:** `KHANZA-CODEX-PHASE-3-CAUSAL-CHAINS.md`
**Versi:** 1.0
**Tanggal:** 13 Mei 2026
**Document type:** **Phase 3 Deliverable 2** — formalization of cross-primitive causal threads
**Author:** Phase 3a Khanza spoke session AI
**Owner:** dr Ferry
**Status:** Awaiting Owner approval untuk transition ke Deliverable 3 (IMPLICATIONS-FOR-SIMRS-BT)
**Authority basis:** PATTERNS-REGISTRY v1.0 (46 primitives Owner-approved) + Phase 2 mid-phase reflection §5 + State of Record §6 + individual domain docs cross-references

---

## 0. Preamble

### 0.1 Purpose

PATTERNS-REGISTRY adalah **catalog**: each primitive standalone, described independently.
CAUSAL-CHAINS adalah **map of relationships**: how primitives produce one another, reinforce one another, and combine into emergent patterns.

Phase 2 surfaced causal observations ad-hoc across multiple documents (mid-phase reflection §5, State of Record §6, individual domain docs). Deliverable 2 **consolidates these into formalized causal threads** dengan SIMRS BT implications per thread.

### 0.2 Why Causal Threads Matter

Anti-primitives don't exist in isolation. Khanza's choices reinforce each other:
- Fat-client architecture (P4-A) **causes** UI-as-orchestrator (P4-C) **because** there's no service layer to host logic
- No service layer (P4-C) **causes** per-form inline validation (P7-A) **because** validation logic has nowhere central to live

Understanding the chain matters more than understanding individual links:
- **Inverting one primitive without inverting upstream causes is futile** (e.g., adding validation framework without service layer leaks back into UI)
- **Inverting upstream primitive cascades benefits** (e.g., adopting service layer enables both centralized validation AND testable business logic)

### 0.3 Methodology

Per Phase 3 Brief §5.2, this document formalizes **5 causal chains** (4 anti-primitive threads + 1 positive thread):

| Chain | Direction | Type |
|---|---|---|
| Chain 1 | Architecture → Logic Location → Validation | Anti-primitive thread |
| Chain 2 | Defense-Minimization → Forensic Impossibility | Anti-primitive thread |
| Chain 3 | Single-RS Assumption → Permission Schema Bloat | Anti-primitive thread |
| Chain 4 | Dual-Spine → Compliance Pathway Separation | **Positive thread** |
| Chain 5 | 3 Deep Choices → Operational Manifestations | Meta-causal (synthesizes Chains 1-4) |

Each chain includes:
- Causal narrative (primitive-by-primitive)
- Evidence cross-reference
- "Khanza optimized rationally" context
- SIMRS BT implication

### 0.4 Reading Notation

```
P_X → P_Y     means "P_X causally produces P_Y"
P_X + P_Y → P_Z means "P_X and P_Y jointly produce P_Z"
P_X ⟷ P_Y    means "P_X and P_Y reinforce each other"
P_X ⊕ P_Y    means "P_X and P_Y conflict (mutually constraining)"
```

---

## 1. Chain 1 — Architecture → Logic Location → Validation

### 1.1 Narrative

```
P4-A (Fat-Client-with-Shared-DB)
  → P4-C (UI-as-Orchestrator)
    → P7-A (Per-Form Inline Validation)
      → P3-B (Distributed Implicit State Machines via inline ENUMs)
```

**The chain logic:**

1. **P4-A** establishes architectural starting point: Java Swing thick client directly reads/writes MySQL. No application server, no middleware tier.

2. **P4-C emerges from P4-A:** With no service layer between UI and DB, business logic must live somewhere. The Swing event handlers (Dialog classes) become the orchestrators — they receive user input, validate, build SQL, execute, handle results.

3. **P7-A emerges from P4-C:** Since each Dialog orchestrates independently, validation logic gets inlined into each Dialog class. There's no shared validation framework because there's no shared layer to host it. ~76 DlgCari classes + many DlgIsi/DlgEdit each implement their own validation.

4. **P3-B emerges from P4-C + P7-A:** Without central state machine framework, state transitions get encoded as inline ENUM columns (4266 total ENUM definitions). Each Dialog encodes its module's state transitions implicitly via UPDATE statements.

### 1.2 Evidence

| Primitive | Empirical Evidence |
|---|---|
| P4-A | 1627 Java Swing files; 0 stored procedures/triggers/functions/views in DB |
| P4-C | Dialog classes directly construct SQL; no intermediate service classes |
| P7-A | ~76 DlgCari + numerous DlgIsi/DlgEdit each implement validation inline |
| P3-B | 4266 ENUM() definitions; 218 status/stts ENUM columns specifically |

### 1.3 Khanza-Optimized-Rationally Context

For 2010-era LAN single-RS deployment with trained operators:
- Fat-client = no app server infrastructure cost
- UI-as-orchestrator = simpler stack, fewer layers to maintain
- Per-form validation = each module independent; module teams own their validation
- Inline state machines = self-documenting at column level

**This worked because:** Module teams could develop independently (no service-layer coordination); change frequency was modest (no refactor pressure); 1500+ RS could each customize without coordinating with others.

### 1.4 Chain 1 Failure Modes (Why It Doesn't Generalize)

| Failure | Manifestation |
|---|---|
| **Validation drift** | Same field validated differently across forms; no single source of truth |
| **State machine fragmentation** | Same conceptual state encoded with different ENUM values across tables |
| **Refactor resistance** | Changing logic requires touching N Dialog classes |
| **Testing impossibility** | Logic embedded in UI cannot be unit-tested |
| **Multi-developer coordination tax** | Each developer touches Dialog files = merge conflicts |

### 1.5 SIMRS BT Implication

**Inversion strategy:**

1. **Invert P4-A first** (architecture): Web app + API + serverless functions. This creates layers.
2. **Service layer eliminates P4-C:** Business logic moves to service layer; UI becomes thin orchestrator of API calls.
3. **Centralized validation library eliminates P7-A:** Pure validator helpers (SIKESUMA C1-C12 pattern reference) called from service layer.
4. **State machines as TypeScript code eliminates P3-B fragmentation:** Single source of truth for state transitions per entity.

**Critical insight:** **Don't try to fix P7-A first.** Without inverting upstream (P4-A → P4-C), centralized validation has nowhere to live and leaks back into UI. **Invert upstream cause for cascade benefits.**

---

## 2. Chain 2 — Defense-Minimization → Forensic Impossibility

### 2.1 Narrative

```
P7-B (Database-Passive) + (zero triggers/procedures)
  + P4-D (Silent Last-Write-Wins)
    + P7-E (Audit Trail Absent)
      → CANNOT RECONSTRUCT HISTORY (theoretical: P3-A + P3-E)
        → P6-B (Eventual Consistency via Human Reconciliation as workaround)
```

**The chain logic:**

1. **P7-B + zero triggers/procedures:** Database deliberately passive — pure storage, no logic. Verified empirically: 0 stored procedures, 0 triggers, 0 functions, 0 views across schema.

2. **P4-D adds:** No concurrency control (no version columns, no optimistic locking). Concurrent edits silently overwrite.

3. **P7-E adds:** No audit columns (`created_at`/`updated_at`/`updated_by` universally absent across 1156 tables). No audit log tables for general CRUD.

4. **Combined consequence:** Schema is a snapshot of current state only. Cannot answer questions like:
   - Who last modified this record? (P7-E blocks)
   - What was the previous value? (P7-E + P4-D block)
   - Was this a concurrent edit collision? (P4-D blocks detection)
   - When did this state transition happen? (P7-E blocks)
   - Did this multi-step workflow complete atomically? (P7-B + transaction absence blocks)

5. **P6-B emerges as workaround:** Since cannot reconstruct history, integrity issues are detected operationally (not algorithmically). Operators reconcile partial states manually when they notice discrepancies.

### 2.2 Evidence

| Primitive | Empirical Evidence |
|---|---|
| P7-B | 0 procedures + 0 triggers + 0 functions + 0 views (Pre-Flight strict-syntax) |
| P4-D | No version/locking columns across 1156 tables |
| P7-E | 0 universal audit columns (`created_at`/`updated_at`); 17 scoped PPI audit tables (capability exists, design choice for universal absence) |
| P6-B | 1 setAutoCommit / 1 commit / 1 rollback across 1627 Java files = <0.1% transaction discipline |

### 2.3 Khanza-Optimized-Rationally Context

For 2010-era LAN with trained operators + paper compliance trail:
- DB-passive = portable across MySQL versions; predictable performance
- No concurrency control = LAN-single-RS rarely has true concurrent conflicts
- No audit columns = 2-3x storage savings; faster writes; audit handled via paper
- Human reconciliation = aligns with paper-era hospital workflow norms

**This worked because:** Threat model was internal (trusted operators); compliance was paper-based (BPK/Akreditasi inspectors check paper records, not DB queries); concurrent collisions rare in practice; operators could verbally coordinate.

### 2.4 Chain 2 Failure Modes (Why It Catastrophically Fails for SIMRS BT)

| Failure | TNI AD Risk |
|---|---|
| **No forensic audit** | BPK + Itjenad audit framework cannot operate — auditor cannot answer "who changed X when" |
| **Silent data loss** | Concurrent edits across shifts = lost data, unrecoverable |
| **Integrity attestation impossible** | Cannot prove medical record integrity for legal/disciplinary cases |
| **Multi-RS impossible** | Without audit, cross-RS data movement cannot be tracked |
| **Compliance gaps** | Modern healthcare compliance requires schema-level audit |

### 2.5 SIMRS BT Implication

**Critical 5-part inversion (Owner-approved Blueprint formalization):**

1. **Invert P7-E:** Universal audit columns (`created_at`, `updated_at`, `created_by`, `updated_by`) on every operational table
2. **Plus immutable snapshots (Tier 5-style) for terminal states** — billing finalized, encounter closed, etc.
3. **Invert P4-D:** Optimistic locking via version column + real-time conflict UI ("someone else modified this; reload or override")
4. **Invert P7-B (partial):** Maintain DB-passive philosophy at app-logic level; ADD triggers ONLY for audit trail population (not for business logic)
5. **Invert P6-B:** Transactional discipline — SQL transactions wrap multi-step workflows; saga pattern for cross-service operations

**Sequence matters:** Implement P7-E first (audit infrastructure), then P4-D (version column requires audit context for conflict resolution), then P6-B (transactions become naturally implementable once audit is in place).

---

## 3. Chain 3 — Single-RS Assumption → Permission Schema Bloat

### 3.1 Narrative

```
Era assumption: 1 deployment = 1 RS
  → P10-B (Single-Tenant Schema: no tenant_id)
    → P5-B (Naming-Convention-as-Boundary)
      → P7-F (Authorization-as-Boolean-Matrix on user table)
        → Schema bloat: 1198 columns on user table
          → Multi-RS scaling blocked
```

**The chain logic:**

1. **Era assumption baseline:** 2010 Indonesian RS = on-premise LAN, one schema per RS. Multi-tenancy not part of design conversation.

2. **P10-B follows:** Schema has no `rs_id` / `tenant_id` / `klinik_id` / `hospital_id` columns. Verified empirically: 0 across 1156 tables.

3. **P5-B follows:** Module boundaries enforced via naming conventions (`apotek_*`, `radiologi_*`, etc.), not via schemas, packages, or DB-level access control. Why? Because with single-RS assumption, there's no isolation requirement — convention sufficient.

4. **P7-F follows:** Authorization implemented as feature-flag boolean columns on `user` table — `can_access_apotek_obat`, `can_access_radiologi_*`, etc. As features added, columns accreted. **Result: 1198 columns on user table.**

5. **Schema bloat + multi-RS blocker:**
   - User table cannot scale to multi-tenant (each RS would need 1198 boolean columns × N users)
   - No role abstraction → adding new feature requires schema migration on user table
   - Cross-RS data sharing impossible without tenant ID
   - G5 Karumkit vision (multi-RS network) blocked at schema level

### 3.2 Evidence

| Primitive | Empirical Evidence |
|---|---|
| P10-B | 0 `rs_id`/`tenant_id`/`klinik_id`/`hospital_id` across 1156 tables |
| P5-B | Domain prefixes (`apotek_*`, `radiologi_*`, `lab_*`, etc.); no DB-level access control |
| P7-F | `user` table: **1198 columns** (Pre-Flight verified) |
| Schema bloat | Adding new permission = column migration on user table |

### 3.3 Khanza-Optimized-Rationally Context

For 1500+ separate RS deployments:
- Each RS = separate schema = isolation by deployment
- Boolean matrix simpler than RBAC for fixed feature set
- Admin-friendly: feature flags directly visible per user
- No multi-tenant complexity tax for single-tenant 99% use case

**This worked because:** Adoption breadth (1500+ RS) didn't require coordination; each RS's local deployment self-contained.

### 3.4 Chain 3 Failure Modes (Multi-RS Vision)

| Failure | TNI AD Risk |
|---|---|
| **Multi-RS coordination impossible** | G5 Karumkit RS network = no shared infrastructure economies |
| **Permission system rigidity** | New feature/role = schema migration; coordination across RS |
| **No cross-RS data sharing** | Patient transfers, statistical reporting blocked |
| **Schema migrations risky** | 1198-column table changes are high-risk operations |

### 3.5 SIMRS BT Implication

**Multi-tenant from day one strategy:**

1. **Add `rs_id` FK to every operational table** (mandatory) — even if SIMRS BT starts single-RS, schema readiness for multi-RS expansion
2. **PostgreSQL Row-Level Security (RLS) for tenant isolation** — Supabase native pattern
3. **RBAC abstraction:** `roles`, `permissions`, `user_roles`, `role_permissions` tables — NOT boolean matrix
4. **Module boundaries via PostgreSQL schemas** (formal) — not naming convention (informal)

**Strategic insight:** This is the **single most important SIMRS BT architectural decision** if G5 Karumkit RS network is real vision. Single-tenant retrofit to multi-tenant is order-of-magnitude harder than multi-tenant from start.

---

## 4. Chain 4 — Dual-Spine → Compliance Pathway Separation (POSITIVE)

### 4.1 Narrative

```
P1-B (Parallel Dual-Pillar Worldview — philosophical premise)
  → P3-D (Encounter-as-Convergence — theoretical framing)
    → P6-A (Dual-Spine Architecture — operational manifestation)
      → P2-A (Encounter-as-Pivot — clinical spine anchor 350 FK)
      + (rekening — financial spine anchor 301 FK)
        → TNI AD compliance pathway separation:
          → Itjenad (Inspectorate General) → clinical spine audit
          + BPK (Audit Board) → financial spine audit
```

**The chain logic:**

1. **P1-B philosophical premise:** RS is parallel medical + business institution. Neither subordinate. Schema must reflect this parallelism.

2. **P3-D theoretical framing:** Encounter (patient visit) is reality; billing is bookkeeping. Encounter sits at center; clinical activity flows from it; billing derives from clinical work.

3. **P6-A operational manifestation:** Two parallel spines structure the system:
   - **Clinical spine:** `reg_periksa` (encounter) with 350 FK references
   - **Financial spine:** `rekening` (chart of accounts) with 301 FK references
   - Together: ~32% of all 2032 FKs route through these two hubs

4. **P2-A operational anchor:** The encounter table (`reg_periksa`) is the single most-referenced table; clinical detail tables fanout from it.

5. **TNI AD compliance pathway separation emerges naturally:**
   - **Itjenad audit pathway** can query clinical spine (encounter + clinical details) without touching financial
   - **BPK audit pathway** can query financial spine (accounts + billing) without touching clinical detail
   - Separation of audit concerns matches organizational separation of audit authorities

### 4.2 Evidence

| Primitive | Empirical Evidence |
|---|---|
| P1-B | Philosophical (P6-A is operational manifestation) |
| P3-D | Schema design throughout treats encounter as convergence anchor |
| P6-A | 350 FK to `reg_periksa` + 301 FK to `rekening` (both Pre-Flight exact-match) |
| P2-A | Most-referenced table in entire 1156-table schema (350 FK) |

### 4.3 Why This Chain Is Universally Correct

Unlike Chains 1-3 (Khanza optimization for specific context), Chain 4 represents **timeless architectural wisdom**:

- Hospital is genuinely dual-pillar (clinical AND financial co-equal)
- Encounter genuinely IS the irreducible business event
- Billing genuinely IS derived from clinical work, not the source
- Maps to **universal hospital reality**, not Khanza-specific design choice

This is why P1-B, P3-D, P6-A are tagged `[TIMELESS]`.

### 4.4 SIMRS BT Implication (ADOPT)

**Direct adoption strategy:**

1. **Adopt P1-B philosophical foundation** — explicit clinical + financial schema separation
2. **Adopt P3-D as data model foundation** — encounter table as core hub
3. **Adopt P6-A as architectural pattern** — mirror dual-spine structure
4. **Map to TNI AD audit pathways:**
   - Clinical spine accessible to Itjenad audit
   - Financial spine accessible to BPK audit
   - Clear separation prevents audit-of-audit confusion

**Bonus insight:** Adopting Chain 4 simultaneously inverts much of Chain 2:
- Encounter-as-pivot with proper FK structure naturally supports audit (vs. P7-E inversion)
- Dual-spine separation supports tenant boundaries (helps Chain 3 inversion too)

**Chain 4 is the highest-value POSITIVE learning from Khanza.** Adopting it correctly creates structural conditions that make other inversions easier.

---

## 5. Chain 5 — 3 Deep Choices → Operational Manifestations

### 5.1 Meta-Causal Synthesis

Chains 1-4 trace specific causal threads. Chain 5 elevates to **theoretical level**: how the 3 Deep Theoretical Choices in Domain 3 generate the operational anti-primitive (and positive) clusters.

```
Deep Choice 1 (Snapshot-Only Time Model: P3-A)
  → Cluster: P7-E + P4-D + P6-B + P2-C + P3-E
    → Chain 2 narrative

Deep Choice 2 (Distributed Implicit Definitions: P3-B)
  → Cluster: P7-A + P5-B + P5-E + P7-F + P9-B
    → Chain 1 narrative + parts of Chain 3

Deep Choice 3 (Encounter-as-Convergence: P3-D) — POSITIVE
  → Cluster: P2-A + P6-A + P6-E
    → Chain 4 narrative
```

### 5.2 The Theoretical Sequence

Khanza's design wasn't accidental — it followed theoretical choices that propagated to operations:

1. **Choice 1 was made first (implicitly):** "Time is now; history isn't queryable" — this propagated to no audit, no concurrency, no transactions, eventual reconciliation
2. **Choice 2 reinforced:** "Definitions live where used" — this propagated to distributed validation, naming-as-boundary, boolean-matrix authorization
3. **Choice 3 was philosophically primary:** "Encounter is reality, billing is bookkeeping" — but ironically the most robust because it matches universal hospital reality

### 5.3 Why This Matters for SIMRS BT

**Architectural decisions cluster around theoretical choices.** SIMRS BT's task isn't "invert N anti-primitives individually" — it's **make different theoretical choices that propagate to better operational manifestations.**

**Three SIMRS BT theoretical choices (Owner-approved):**

| Deep Choice | Khanza Choice | SIMRS BT Choice |
|---|---|---|
| **1 — Time** | Snapshot-only | 🔄 **Queryable time dimension** (audit, snapshots, event log) |
| **2 — Definitions** | Distributed implicit | 🔄 **Centralized explicit** (TS code, validation library, RBAC) |
| **3 — Convergence** | Encounter-as-convergence | ✅ **Adopt** (encounter as reality, billing as artifact) |

These 3 choices propagate to dozens of operational decisions, just as Khanza's choices propagated.

### 5.4 Force Relationships Matrix

How primitives reinforce or constrain one another across chains:

| Primitive | Reinforces | Constrains | Conflicts With |
|---|---|---|---|
| P4-A | P4-C, P4-E | service-layer adoption | API-first |
| P4-C | P7-A, P3-B | testability | layered architecture |
| P7-E | P3-A, P3-E | forensic queries | compliance audit |
| P3-A | P7-E, P4-D, P6-B | reconstructibility | time-aware features |
| P3-B | P7-A, P7-F | central registry | type safety |
| **P3-D** ⭐ | **P2-A, P6-A** | — (universally helpful) | — |
| **P6-A** ⭐ | **P2-A, P3-D** | — | — |
| P10-B | P5-B, P7-F | multi-RS | multi-tenant architecture |

(⭐ = positive reinforcement only; no constrains)

---

## 6. Cross-Chain Synthesis

### 6.1 Anti-Primitives Cluster Naturally

The chains reveal that **inverting one anti-primitive in isolation is often futile** — the surrounding chain pulls it back:

- Inverting P7-A (per-form validation) without inverting P4-C (UI orchestrator) → validation library still won't have a home → leaks back to UI
- Inverting P4-D (concurrency) without inverting P7-E (audit) → version column has nothing to track against → operator confusion on conflicts
- Inverting P7-F (boolean matrix) without P10-B (single-tenant) → RBAC still single-RS-bound → multi-RS still blocked

### 6.2 Inversion Sequencing for SIMRS BT

**Recommended order:**

1. **Foundation: Adopt Chain 4** (P1-B, P3-D, P6-A) — dual-spine architecture from day one
2. **Multi-tenant readiness: Invert Chain 3** (P10-B → rs_id everywhere) — schema decision; expensive to retrofit
3. **Audit infrastructure: Invert Chain 2 top of stack** (P7-E first) — enables P4-D inversion
4. **Architectural layers: Invert Chain 1 top** (P4-A → web/API) — enables P4-C, P7-A, P3-B inversions
5. **Cascading inversions:** Chains 1, 2 lower stack invert as side-effects of foundation work

### 6.3 Positive Primitive Multipliers

5 pure TIMELESS primitives (+ 4 mixed) work as **multipliers** — each one adopted improves multiple chains:

- **P1-B + P3-D + P6-A** → Chain 4 adoption + supports Chains 2-3 inversion
- **P1-C** (Selective Permanence) → supports Chain 2 audit infrastructure
- **P8-C** (Constrained-Input) → reduces error class entirely
- **P10-A** (Indonesian language fidelity) → adoption-friendliness, regulatory match

---

## 7. SIMRS BT Implications Summary

Per Brief §5.2 requirement (SIMRS BT inference per chain):

| Chain | SIMRS BT Action | Sequencing Priority |
|---|---|---|
| **Chain 4** ⭐ Dual-Spine | ✅ **Adopt as foundation** — encounter+account dual spine | **#1 (FOUNDATION)** |
| **Chain 3** Multi-RS readiness | 🔄 `rs_id` + RLS + RBAC from day one | **#2 (SCHEMA)** |
| **Chain 2** Audit infrastructure | 🔄 P7-E inversion first; cascades to P4-D, P6-B | **#3 (AUDIT)** |
| **Chain 1** Architectural layers | 🔄 Web+API foundation; cascades to P4-C, P7-A, P3-B | **#4 (LAYERS)** |
| **Chain 5** Theoretical alignment | Match SIMRS BT theoretical choices to inversions | **Continuous** |

**Implementing in this sequence creates structural conditions for downstream wins.** Implementing in reverse order (validation first, audit later, architecture last) creates re-work cycles.

---

## 8. Closing — Handoff to Deliverable 3 (IMPLICATIONS-FOR-SIMRS-BT)

### 8.1 What CAUSAL-CHAINS Provides for D3

This document equips D3 (IMPLICATIONS-FOR-SIMRS-BT) with:

- **Inversion sequencing logic** — D3 can recommend "do X before Y" with causal justification
- **Cascade benefit framing** — D3 can show "inverting P4-A delivers P4-C, P7-A, P3-B inversions as side-effects"
- **Foundation-first architecture** — Chain 4 adoption positioned as first move
- **Universal vs Khanza-specific distinction** — D3 can frame TIMELESS adoptions (Chain 4) separately from era inversions (Chains 1-3)

### 8.2 D3 Scope Reminder (Per Brief §5.3)

D3 produces forward-looking roadmap for SIMRS BT — translate Phase 2-3a findings to actionable architectural guidance. Sections:
- Adopt (TIMELESS primitives)
- Calibrate (REQUIRES-CONTEXT primitives)
- Invert (ANTI-PRIMITIVES Critical + High)
- 3 Deep Choices application
- Recommended Blueprint sections

D3 will reference this CAUSAL-CHAINS document for sequencing logic + primitive-clustering rationale.

### 8.3 Phase 3 Deliverable State (Updated)

| Deliverable | Status | Lines |
|---|---|---|
| Pre-Flight Report | ✅ Complete | 628 |
| Methodology MD | ✅ Complete | 385 |
| Lineage Audit Log v1.1 | ✅ Complete | 542 |
| PATTERNS-REGISTRY | ✅ Complete | 904 |
| Execution Strategy | ✅ Complete | 404 |
| **CAUSAL-CHAINS (this)** | ✅ **Complete** | ~530 |
| **D3: IMPLICATIONS-FOR-SIMRS-BT** | ⏳ **Fresh session next** | (700-1000 est.) |
| D4: IMPLICATIONS-FOR-SIKESUMA | ⏳ Fresh session | (300-500 est.) |

### 8.4 Discipline Checkpoints

| Discipline | Status This Document |
|---|---|
| Clean-room (no verbatim code/SQL) | ✅ |
| License clean (Khanza.Soft Media custom respected) | ✅ |
| Cross-project boundary (no SIKESUMA touch) | ✅ |
| No SIMRS BT artifact edit | ✅ |
| "Khanza optimized rationally" tone | ✅ — each chain leads with rational context |
| Lineage references | ✅ — chains cite PATTERNS-REGISTRY entries by ID |
| Additive-only discipline | ✅ — no relitigation of Owner-approved decisions |

---

**End of CAUSAL-CHAINS v1.0. Phase 3a session preparing handover bundle untuk fresh session production of D3 + D4.**
