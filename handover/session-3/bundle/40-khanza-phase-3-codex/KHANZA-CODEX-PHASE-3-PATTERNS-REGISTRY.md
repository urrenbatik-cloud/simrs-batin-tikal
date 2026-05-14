# The Khanza Codex — Phase 3 Deliverable 1: PATTERNS-REGISTRY
## Authoritative Catalog of 46 Architectural Primitives

**File:** `KHANZA-CODEX-PHASE-3-PATTERNS-REGISTRY.md`
**Versi:** 1.0
**Tanggal:** 13 Mei 2026
**Document type:** **Phase 3 Deliverable 1** — authoritative consolidated reference of all primitives organized by 3 Deep Choices + Layer 1 tags
**Author:** Phase 3a Khanza spoke session AI
**Owner:** dr Ferry
**Status:** Awaiting Owner approval untuk Deliverable 2 (CAUSAL-CHAINS)
**Authority basis:** Phase 2 Closeout (45 primitives) + Phase 3a Pre-Flight refinements R1-R9 + N1 (Lineage Log L022-L028, Owner-approved)

---

## 0. Preamble

### 0.1 Purpose

Dokumen ini adalah **single authoritative catalog** untuk seluruh primitif arsitektural yang diekstrak dari SIMRS Khanza melalui Phase 1 hypothesis testing dan Phase 2 empirical validation, dengan refinements dari Phase 3a Pre-Flight mutual cross-verification.

Tujuan spesifik:
- Menyajikan 46 primitif (45 baseline + N1 Form-as-Table dari Phase 3a enrichment) dalam struktur yang accessible untuk berbagai audience
- Mengorganisir primitif berdasarkan **3 Deep Theoretical Choices** sebagai organizing principle (Owner-approved Phase 2 closeout)
- Menyediakan indexing alternatif berdasarkan **Layer 1 tags** untuk filtering by adoptability semantics
- Menyediakan **master lookup table** untuk navigasi cepat

### 0.2 Audience

| Audience | Recommended Reading Path |
|---|---|
| **SIMRS BT spoke session AI** (primary consumer) | §1 → §2 (3 Deep Choices framing) → §3 (Layer 1 tag indexing) → §4 (master lookup) |
| **Owner (dr Ferry)** | §1 → §6 (refinements summary) → §4 (master lookup) |
| **SIKESUMA AI session** (secondary, awareness only) | §3.1 (Timeless primitives) + §3.3 (anti-primitives) — cross-project boundary respected |
| **Future Khanza spoke session** (continuity) | Read all sections; consult Lineage Log untuk evolution |

### 0.3 Methodology Recap

**Phase 1-2 methodology (preserved):**
- Thesis-before-data: hypothesis-driven inquiry, not data-driven generalization
- Primitives-over-synthesis: each primitive evidence-traceable to schema/code
- Platform-agnostic: primitives described conceptually, not tied to Java/MySQL specifics
- Clean-room reverse engineering: no verbatim code/SQL copy; counts + structural patterns only

**Phase 3a additions:**
- Empirical pre-flight verification (anchors re-verified independently)
- Mutual cross-verification with predecessor session (Owner-mediated)
- Evidence-based corrections (additive lineage; never deleting prior content)
- Net-new primitive surface scan (N1 Form-as-Table emerged from edge analysis)

**Documented in:**
- `KHANZA-CODEX-METHODOLOGY-MUTUAL-VERIFICATION.md` (pattern specification)
- `KHANZA-CODEX-LINEAGE-AUDIT-LOG.md` (decision history L001-L032)

### 0.4 Reading Guide

**Layer 1 Tag Semantics (4 + 1 mixed-permitted):**

| Tag | Meaning | Action Implication for SIMRS BT |
|---|---|---|
| `[TIMELESS]` | Universal wisdom, transcends era and stack | ✅ Adopt directly |
| `[ADOPT-AS-CONCEPT]` | Concept valid; modernize implementation | ✅ Adopt conceptually; reimplement |
| `[REQUIRES-CONTEXT]` | Pattern's correctness depends on scale/era/operator model | ⚖️ Calibrate per SIMRS BT context |
| `[ERA-2010-LAN]` | Artifact of 2010-era LAN-deployed single-RS context | 🔄 Likely invert/modernize |
| `[ANTI-PRIMITIVE]` | Pattern to avoid; severity-classified | 🚫 Invert; severity dictates priority |

**Mixed tags allowed.** Several primitives carry combined tags (e.g., P1-A is `[TIMELESS]` concept + `[REQUIRES-CONTEXT]` depth). §5 Tag Application Notes explains reasoning.

**Anti-Primitive Severity:**

| Severity | Count | Meaning |
|---|---|---|
| 🔴 Critical | 5 | MUST avoid; existential risk to TNI AD compliance/operations |
| 🟠 High | 5 | STRONGLY avoid; substantial operational/strategic risk |
| 🟡 Nuanced | 2 | Avoid in scale; acceptable in narrow contexts |

### 0.5 Khanza-Optimized-Rationally Framing (Critical Discipline)

Per Owner directive (Phase 2 sub-session 8): **anti-primitives are anti only from SIMRS BT's different context.** Khanza adalah solusi brilian untuk ruang masalah yang berbeda.

| Khanza Optimized FOR | Khanza Sacrificed |
|---|---|
| Wide adoption (1500+ RS) | Forensic auditability |
| Operational throughput | Multi-tenant scalability |
| Long-lived deployment (15+ year horizon, 2011-2040 evidence) | Cloud-readiness |
| Operator autonomy | Type safety / refactor-ability |
| Heterogeneous workflow | Concurrent safety |
| Organizational fidelity | API-first integration |
| Domain language fidelity (>10K Indonesian patterns) | Security defense-in-depth |
| — | Schema discoverability |

**Framing rule:** Setiap deskripsi anti-primitive di Codex ini disertakan dengan rational tradeoff context. Tidak dismissive; constructive learning.

### 0.6 Document License Discipline

**Phase 3a Correction (per Lineage Log L022):** SIMRS Khanza menggunakan **custom Khanza.Soft Media license** (per `lisensi.txt` di repo root) — bukan "Aladdin Free Public License" seperti yang tercatat di Phase 1-2 docs. Clean-room discipline substantively maintained throughout (zero verbatim code/SQL copy).

---

## 1. Quick Reference

### 1.1 Final Primitive Count

| Domain | Primitives | IDs |
|---|---|---|
| 1 (Filosofi) | 5 | P1-A through P1-E |
| 2 (Fundamental) | 4 | P2-A through P2-D |
| 3 (Konsep) | 5 | P3-A through P3-E |
| 4 (Arsitektur) | 5 | P4-A through P4-E |
| 5 (Modul) | 5 | P5-A through P5-E |
| 6 (Inter-Module) | 5 | P6-A through P6-E |
| 7 (Universal Functions) | 6 | P7-A through P7-F |
| 8 (Error Prevention) | 4 | P8-A through P8-D |
| 9 (Workaround) | 3 | P9-A through P9-C |
| 10 (Other) | 3 | P10-A through P10-C |
| **Net-New (Phase 3a)** | **1** | **P-NEW-1** |
| **TOTAL** | **46** | |

### 1.2 Layer 1 Tag Distribution

| Tag | Pure | Mixed | Total Affected |
|---|---|---|---|
| `[TIMELESS]` | 5 | 4 | 9 primitives |
| `[ADOPT-AS-CONCEPT]` | 3 | 0 | 3 primitives |
| `[REQUIRES-CONTEXT]` | 10+ | 7+ | 17+ primitives |
| `[ERA-2010-LAN]` | 4 | 9 | 13 primitives |
| `[ANTI-PRIMITIVE]` | 12 | 0 | 12 primitives |

### 1.3 Three Deep Choices Cluster Assignment

| Cluster | Primitives | SIMRS BT Strategy |
|---|---|---|
| **Choice 1** — Snapshot-Only Time Model | P3-A (core), P7-E, P4-D, P6-B, P2-C, P3-E | 🔄 INVERT |
| **Choice 2** — Distributed Implicit Definitions | P3-B (core), P7-A, P5-B, P5-E, P7-F, P9-B | 🔄 INVERT |
| **Choice 3** — Encounter-as-Convergence | P3-D (core), P2-A, P6-A, P6-E | ✅ ADOPT |
| **Standalone** (does not fit cleanly) | 30 primitives (see §2.4) | Per-primitive evaluation |

---

## 2. Section A — Primitives Organized by 3 Deep Theoretical Choices

### 2.1 Deep Choice 1: Snapshot-Only Time Model

**Theoretical statement (P3-A core):** Time bukan queryable dimension. State is current only. History is reconstructed via paper records and operator memory, bukan via schema.

**Rationale (Khanza's optimization):** Bagi single-RS 2010-era LAN context dengan trained operators, schema simplicity dan write-throughput won out atas forensic queryability. Audit/compliance handled via paper trails (BPK/Akreditasi traditional model).

**SIMRS BT Strategy: 🔄 INVERT (highest-leverage architectural change)**
- Add time as queryable dimension via universal audit columns (`created_at`, `updated_at`, `updated_by`)
- Immutable snapshot tables for terminal states (Tier 5-style)
- SQL transactions wrapping multi-step workflows
- Event log for state transitions
- Already Owner-approved for SIMRS BT Blueprint formalization

#### Cluster Members

##### P3-A — Snapshot-Only State Model (Core Theoretical)
**Tag:** `[ANTI-PRIMITIVE]` Critical-combined-with-P7E + `[ERA-2010-LAN]`
**Statement:** Schema mendeskripsikan state saat ini saja; histori state transitions tidak preserved.
**Evidence:** 0 universal audit columns (`created_at`/`updated_at`/`*_at`) across 1156 tables (Pre-Flight verified). 0 audit log tables for general CRUD (universal absence).
**Khanza-rational context:** LAN deployment + trained operators + paper compliance trail = audit deferred to off-schema mechanisms.

##### P7-E — Audit Trail Absent at Schema Level (Top-Severity Manifestation)
**Tag:** `[ANTI-PRIMITIVE]` **Critical top-severity**
**Statement:** Schema cannot reconstruct *who-changed-what-when* for general CRUD operations.
**Evidence (R6 refinement):** 
- 0 universal audit columns across 1156 tables
- 17 scoped PPI (Pencegahan dan Pengendalian Infeksi) compliance audit tables exist: `audit_bundle_iadp`, `audit_bundle_ido`, `audit_bundle_isk`, `audit_bundle_plabsi`, `audit_bundle_vap`, `audit_cuci_tangan_medis`, `audit_fasilitas_apd`, `audit_kepatuhan_apd`, `audit_pembuangan_benda_tajam`, `audit_pembuangan_limbah`, `audit_penanganan_darah`, `audit_penempatan_pasien`, `audit_pengelolaan_linen_kotor`, `audit_sterilisasi_alat`, `audit_kamar_jenazah`, others
- **Khanza demonstrates audit-table design capability for scoped compliance domains.** Universal CRUD audit absence = **design choice**, not capability gap.
**Khanza-rational context:** Khanza chose operational throughput; universal audit would 2-3x storage and write latency on a LAN-deployment. Compliance audit scoped to regulatory mandates (PPI infection control).
**TNI AD Risk:** BPK + Itjenad audit framework cannot operate without forensic schema reconstruction. ABSOLUTE invert priority.

##### P4-D — Silent Last-Write-Wins (Concurrency Absence)
**Tag:** `[ANTI-PRIMITIVE]` Critical
**Statement:** Concurrent edits to same record silently lose all but last writer's data.
**Evidence:** No version columns, no optimistic locking, no row-level versioning across 1156 tables.
**Khanza-rational context:** LAN single-RS with operator workflow norms = concurrent collision rare in practice; trained operators verbally coordinate.
**TNI AD Risk:** Multi-shift military medical context = concurrent operator collisions probable; silent data loss = unrecoverable medical record error.

##### P6-B — Eventual Consistency via Human Reconciliation
**Tag:** `[ANTI-PRIMITIVE]` Critical
**Statement:** Cross-module operations rely on operator reconciliation when partial-state occurs (e.g., billing entry created tapi clinical entry failed = manual fix-up).
**Evidence:** Per H6.2 falsification — 1 `setAutoCommit` + 1 `commit` + 1 `rollback` across 1627 Java files = <0.1% transaction discipline.
**Khanza-rational context:** Operator-mediated reconciliation matches paper-era hospital workflow patterns.
**TNI AD Risk:** Partial-state common; integrity weak; military operational audit cannot tolerate silent inconsistency.

##### P2-C — Bifurcated Temporal Model (Operational Present Only)
**Tag:** `[ANTI-PRIMITIVE]` partial + `[ERA-2010-LAN]`
**Statement:** Operational time (`tgl_*`, `jam_*` columns for appointments, encounters) present and rich; audit time (`*_at` columns for record metadata) absent.
**Evidence:** Operational time columns abundant; metadata time columns universally absent (0/1156 universal).
**Khanza-rational context:** Operational time IS the business semantics; audit time was deferred.

##### P3-E — Implicit Audit (Schema Cannot Reconstruct History)
**Tag:** `[ANTI-PRIMITIVE]` Critical (cross-ref P7-E)
**Statement:** Theoretical framing of P7-E — schema as state container, not state-transition log.
**Evidence:** Same as P7-E; P3-E is the conceptual articulation.

### 2.2 Deep Choice 2: Distributed Implicit Definitions

**Theoretical statement (P3-B core):** Definitions (state machines, validation rules, authorization rules, naming conventions) live where they're used. No central registry; no formal contracts.

**Rationale (Khanza's optimization):** For organic 15+ year evolution with multiple developer cohorts, local definitions allowed independent module development. Adding centralized registry would have created coordination bottleneck. Heterogeneity = feature for adoption flexibility (1500+ RS each with different workflow needs).

**SIMRS BT Strategy: 🔄 INVERT**
- Centralize state machines as TypeScript code (SIKESUMA Tier 5a pattern reference)
- Validation library (pure helper validators)
- RBAC with role abstraction (not boolean matrix)
- Single naming convention enforced by tooling

#### Cluster Members

##### P3-B — Distributed Implicit State Machines (Core)
**Tag:** `[ANTI-PRIMITIVE]` High + `[REQUIRES-CONTEXT]`
**Statement:** State logic encoded as inline ENUMs scattered across tables; no central state machine definition.
**Evidence (R4 refinement):**
- 218 status/stts ENUM columns (state machines)
- **4266 total ENUM() definitions** across all schema column types (broader inline domain typing pattern)
- Khanza uses ENUM aggressively as **inline domain typing system**, not just state machines
**Khanza-rational context:** ENUMs at column-level = self-documenting, type-safe at DB layer, no JOIN overhead. For 2010-era LAN with limited app-layer typing (Java pre-records), this was sound engineering.
**TNI AD Risk:** Centralized state machine logic in app layer (TypeScript) needed for testability + cross-module consistency.

##### P7-A — Per-Form Inline Validation (No Central Framework)
**Tag:** `[ANTI-PRIMITIVE]` High
**Statement:** Validation logic duplicated across Swing dialogs; no central validation framework.
**Evidence:** Each `Dlg*.java` file (~76 DlgCari + numerous DlgIsi/DlgEdit) implements validation inline.
**Khanza-rational context:** Java pre-Bean Validation era; per-form duplication acceptable cost for module independence.
**TNI AD Risk:** Inconsistency across forms = validation rules can silently diverge across modules.

##### P5-B — Naming-Convention-as-Boundary
**Tag:** `[ANTI-PRIMITIVE]` Nuanced + `[ERA-2010-LAN]`
**Statement:** Module boundaries enforced via column/table naming conventions, not via schemas, packages, or formal interfaces.
**Evidence:** Domain prefixes (`apotek_*`, `radiologi_*`, `lab_*`, `farmasi_*`, `keuangan_*`, etc.) signal module ownership; no DB-level access control.
**Khanza-rational context:** Workable for small-team RS with single shared schema. Harm gradual not acute.
**TNI AD Risk:** Doesn't scale to multi-RS or multi-team development.

##### P5-E — Convention-Over-Enforcement (No Formal Interface Contracts)
**Tag:** `[ANTI-PRIMITIVE]` partial + `[REQUIRES-CONTEXT]`
**Statement:** Inter-module integration relies on convention (column names, expected formats), not enforced contracts.
**Evidence:** Tabel sharing across modules via shared DB; no FK constraints enforce semantic boundaries.

##### P7-F — Authorization-as-Boolean-Matrix
**Tag:** `[ANTI-PRIMITIVE]` High + `[ERA-2010-LAN]`
**Statement:** Authorization implemented as 1198-column boolean matrix on `user` table (one column per feature flag), not via RBAC role abstraction.
**Evidence:** `user` table has **1198 columns** (Pre-Flight verified — slight delta from Phase 2's 1195 within counting noise).
**Khanza-rational context:** Direct boolean matrix simpler than RBAC for fixed feature set; admin-friendly.
**TNI AD Risk:** Schema bloat; no role abstraction; multi-tenant blocker; adding new feature requires schema migration.

##### P9-B — Epoch-Stratified Naming Conventions (R3 Refinement: 4 Prefixes Confirmed)
**Tag:** `[ANTI-PRIMITIVE]` High + `[ERA-2010-LAN]`
**Statement:** ID column naming reflects developer-cohort epochs; multiple conventions coexist.
**Evidence (R3 refinement per Lineage L024):** **4 distinct prefix epochs verified:**

| Prefix | Total occurrences | Distinct identifiers | Probable era/cohort |
|---|---|---|---|
| `no_*` | 2539 | 92 | Oldest convention (Indonesian "no." abbreviation) |
| `kd_*` | 1535 | 74 | Abbreviated Indonesian "kode" |
| `kode_*` | 1120 | 79 | Full-word Indonesian (different developer cohort) |
| `id_*` | 263 | 35 | Modern English-style |

Samples: `no_rawat`, `no_rkm_medis`, `kd_dokter`, `kd_poli`, `kode_diagnosa`, `kode_brng`, `id_pemesanan`, `id_template`.

**Khanza-rational context:** Each epoch's developers used contemporary conventions; refactoring all prior code = unjustified cost vs. adding new tables with new convention.
**TNI AD Risk:** Onboarding cost, tooling friction, refactor resistance. New developers must learn 4 conventions.


### 2.3 Deep Choice 3: Encounter-as-Convergence (Positive Cluster)

**Theoretical statement (P3-D core):** Encounter (patient visit/registration) is reality; billing is bookkeeping. Encounter sits at the center; clinical and financial data flow from it.

**Rationale (Khanza's optimization):** This is THE foundational insight of Khanza's data model — and it's universally correct for hospital information systems. Patient encounter is the irreducible business event; all clinical activity, all billing, all reporting derives from it.

**SIMRS BT Strategy: ✅ ADOPT (highest-value positive learning)**
- Encounter table as core hub
- Detail tables per modality, FK to encounter
- Billing as derived/computed view from clinical encounters
- Pair with accounting spine (rekening pattern) for dual-spine architecture
- Already Owner-approved for SIMRS BT Blueprint as positive reference pattern

#### Cluster Members

##### P3-D — Encounter-as-Convergence (Core Theoretical Framing)
**Tag:** `[TIMELESS]` ⭐
**Statement:** The encounter (visit event) is the convergence point of all clinical activity. Billing converges from clinical work, not the reverse.
**Why timeless:** This articulates the fundamental ontology of hospital operations. Universally correct across stack/era.
**Evidence:** Schema design throughout treats `reg_periksa` (encounter) as the convergence anchor for clinical detail tables.

##### P2-A — Encounter-as-Pivot (Operational Anchor)
**Tag:** `[TIMELESS]` (mixed — see §5.1)
**Statement:** Single physical table (`reg_periksa`) serves as the operational hub; vast majority of clinical detail tables reference it via FK.
**Evidence:** **350 FK references** to `reg_periksa` (Pre-Flight exact-match verified). This is the most-referenced table in the entire 1156-table schema.
**Why timeless concept:** Hub-and-spoke pattern around encounter is correct architecture; implementation in modern stack would use UUID PK + clear FK constraints (rather than composite `no_rawat` semantic ID).

##### P6-A — Dual-Spine Architecture (Operational Manifestation)
**Tag:** `[TIMELESS]` (mixed) ⭐
**Statement:** Two parallel spines structure the entire system: clinical spine (`reg_periksa` 350 FK) and financial spine (`rekening` 301 FK). Each is the convergence anchor for its respective domain.
**Evidence:**
- `reg_periksa` (clinical encounter): 350 FK references
- `rekening` (chart of accounts): 301 FK references
- Both are top-tier "hub" tables; together they structure ~650 of 2032 total FKs (~32%)
**Why timeless:** Direct operational manifestation of P1-B (Parallel Dual-Pillar Worldview) and P3-D (Encounter-as-Convergence). Maps to TNI AD compliance pathway separation (Itjenad clinical audit + BPK financial audit).
**SIMRS BT adoption:** Mirror this dual-spine pattern as foundational architecture.

##### P6-E — Transient Billing (Corollary — Billing-as-Bookkeeping)
**Tag:** `[REQUIRES-CONTEXT]`
**Statement:** Billing tables (`nota_*`) are thin marker tables — billing is bookkeeping artifact, not source-of-truth. Clinical data is source.
**Evidence:** `nota_*` family functions as billing metadata; actual charges derive from clinical detail tables (procedures, drugs, labs).
**Why corollary to Choice 3:** Operationalizes "billing is bookkeeping" — if clinical record is corrected, billing should recompute, not be primary truth.
**SIMRS BT adoption:** Treat billing as derived view from clinical events; clinical record is canonical.

### 2.4 Standalone Primitives (Do Not Fit Cleanly into 3 Deep Choices)

Following primitives are evaluated individually (don't belong to one of 3 Deep Choices clusters). Organized by domain.

#### Domain 1 — Filosofi

##### P1-A — Pragmatic Configurability as Adoption Strategy
**Tag:** `[TIMELESS]` concept + `[REQUIRES-CONTEXT]` depth
**Statement:** System designed for organizational heterogeneity — extensive runtime configuration (52 `set_*` tables) allowed each RS to customize without code changes.
**Evidence:** ~52 `set_*` configuration tables (settings spread across modules: `set_alkes`, `set_inv_aset`, `set_no_rkm_medis`, etc.).
**Khanza-rational context:** Enabled 1500+ RS adoption with one codebase. Heterogeneity = feature for adoption.
**SIMRS BT calibration:** Adopt configurability concept; calibrate depth — too much config = "rope to hang oneself"; single-RS doesn't need 52 config tables.

##### P1-B — Parallel Dual-Pillar Worldview
**Tag:** `[TIMELESS]` ⭐
**Statement:** Philosophical premise: RS is parallel medical + business institution; neither subordinate to other. Schema reflects this with parallel data structures.
**Evidence:** Dual-spine (P6-A) is operational manifestation; philosophical at this layer.
**SIMRS BT adoption:** Adopt directly; explicit clinical + financial schema separation.

##### P1-C — Selective Permanence by Entity Type
**Tag:** `[TIMELESS]` ⭐
**Statement:** Different entity types deserve different deletion semantics. Master data (patients, doctors) → soft delete / audit-grade. Operational data (sessions, drafts) → hard delete acceptable. Transactional data (encounters, billing) → never delete (cascade-protect).
**Evidence:** Mix of soft-delete patterns (`status` columns), hard deletes, cascade-protect FKs across schema. Different per entity type by design.
**SIMRS BT adoption:** Codify policy: soft delete for audit-grade entities, cascade for structural, hard delete for transient.

##### P1-D — Accretion Over Refactoring
**Tag:** `[REQUIRES-CONTEXT]` + `[ERA-2010-LAN]`
**Statement:** When new requirements emerge, accrete new tables/columns; rarely refactor existing. Schema grows organically over 15+ years.
**Evidence (R8 refinement):**
- Earliest INSERT date: **2011-12-18**
- Latest INSERT date: **2026-06-05** (current as of Pre-Flight)
- Future-dated reference data: **2040-12-15**
- **15-year active development + 14-year forward horizon = 29-year envisioned lifespan**
- Concrete artifacts: 1156 tables, P9-B 4-prefix accretion epochs, multi-cohort developer signatures
**Khanza-rational context:** For long-lived deployment with operator continuity, refactoring cost > accretion cost. Refactor would require coordinated downtime + retraining across 1500+ RS.
**SIMRS BT calibration:** Cloud allows refactor without downtime. Calibrate — adopt accretion bias for stable patterns, refactor aggressively for emerging patterns.

##### P1-E — Trust + Speed > Defense + Accuracy (Operational Philosophy)
**Tag:** `[ANTI-PRIMITIVE]` operational philosophy
**Statement:** Implicit values: operator trust + workflow speed prioritized over defensive validation + forensic accuracy.
**Evidence:** P7-A (per-form inline validation, no central framework) + P7-D (string-concat SQL, trust internal users) + P7-E (no audit) + P4-D (last-write-wins).
**Khanza-rational context:** Trained operators + LAN deployment + low security threat model = trust-and-speed sound choice for that context.
**SIMRS BT inversion:** Defense-in-depth required for cloud + multi-RS + external integration context.

#### Domain 2 — Fundamental (besides P2-A, P2-C in clusters)

##### P2-B — Identifier-as-Domain-Value (Semantic IDs)
**Tag:** `[REQUIRES-CONTEXT]`
**Statement:** Primary keys carry domain semantics (e.g., `no_rawat` encodes date + sequence + clinic). IDs are meaningful, not opaque.
**Evidence:** `no_rawat`, `no_rkm_medis`, `kd_dokter` formats embed business semantics.
**Khanza-rational context:** Operators reference IDs verbally and on paper; semantic IDs reduce lookup friction.
**SIMRS BT calibration:** Trade-off — semantic IDs friendly to operators but fragile to format changes. Modern systems use UUID PK + separate semantic ID columns; consider hybrid.

##### P2-D — Pragmatic Schema Polymorphism (Selective Denormalization)
**Tag:** `[REQUIRES-CONTEXT]`
**Statement:** Schema selectively denormalizes for performance — same conceptual data may appear in multiple forms (normalized + flat) per query patterns.
**Evidence:** Frequently-queried summaries embedded in encounter tables alongside normalized detail.
**SIMRS BT calibration:** Modern PostgreSQL + materialized views provide alternatives to denormalization; case-by-case decision.

#### Domain 3 — Konsep (besides P3-A, P3-B, P3-D, P3-E in clusters)

##### P3-C — Contextual Master/Operational Distinction
**Tag:** `[REQUIRES-CONTEXT]` + `[ERA-2010-LAN]`
**Statement:** Tables distinguish master data (slow-changing reference) vs operational data (fast-moving transactions) implicitly via naming and usage patterns, not formally.
**Evidence:** `mst_*` prefix used in some areas (less consistent than other prefixes); operational tables follow workflow naming.
**SIMRS BT calibration:** Formalize via PostgreSQL schemas or table tagging.

#### Domain 4 — Arsitektur (besides P4-D in cluster)

##### P4-A — Fat-Client-with-Shared-Database Architecture
**Tag:** `[ERA-2010-LAN]`
**Statement:** Java Swing client connects directly to MySQL; thick client; minimal server-side logic.
**Evidence:** 1627 Java files (Pre-Flight exact-match); 0 stored procedures, 0 triggers, 0 functions, 0 views in DB (DB is passive storage). All business logic in Java client.
**Khanza-rational context:** 2010-era LAN deployment; fat-client sound architecture for that context.
**SIMRS BT inversion:** Modern web-app + API + serverless functions architecture.

##### P4-B — Satellite Integration Apps (Hybrid Integration Architecture)
**Tag:** `[REQUIRES-CONTEXT]` + `[ERA-2010-LAN]`
**Statement (R5 refinement):** Khanza has **3 integration tiers** (not just 2 as Phase 2 framed):
1. **Embedded HTTP client in main app:** `src/bridging/` has 261 files; **191 import HTTP libraries** (servlet/Spring as CLIENTS, not servers — 0 `@Controller` / 0 `@RequestMapping`)
2. **Satellite integration sub-projects:** 14 separate Swing apps (under `KhanzaHMS/`) for vendor-specific integrations (BPJS, Mobile JKN, SatuSehat, etc.)
3. **Shared-schema integration:** Direct DB writes for tightly-coupled modules
**Evidence:**
- Main `src/bridging/`: 261 files, 191 HTTP client imports
- 14 satellite sub-projects identified
- 0 `@Controller` annotations confirmed (not a server, pure client)
**Khanza-rational context:** Each integration target gets the right tool — embedded for tight coupling, satellite for vendor-specific UI workflows, shared-schema for legacy modules.
**SIMRS BT calibration:** Modern equivalents — Edge Functions (embedded) vs separate services (satellite) vs direct DB (shared). Decision per integration.

##### P4-C — UI-as-Orchestrator (No Service Layer)
**Tag:** `[ANTI-PRIMITIVE]` High
**Statement:** Business logic embedded in Swing event handlers — UI orchestrates workflow directly, no service layer between UI and DB.
**Evidence:** Dialog classes (`Dlg*.java`) directly construct SQL and execute queries; no intermediate service classes.
**Khanza-rational context:** Simpler stack for fat-client era; eliminates layer for performance.
**TNI AD Risk:** Logic duplication, untestable, refactor risk. Multi-developer team coordination expensive.
**SIMRS BT inversion:** Layered architecture — UI → Service → Repository.

##### P4-E — Database-as-Mailbox (Polling for Handoff)
**Tag:** `[ERA-2010-LAN]`
**Statement:** Inter-process coordination via DB polling — one process writes "ready" status, another polls for it.
**Evidence:** Status flags throughout schema serve as inter-module handoff signals.
**Khanza-rational context:** LAN-era simple coordination; avoids message queue infrastructure.
**SIMRS BT inversion:** Event-driven architecture (Supabase realtime, Postgres LISTEN/NOTIFY, or message queue).

#### Domain 5 — Modul (besides P5-B, P5-E in clusters)

##### P5-A — Organizational Topology (Conway's Law Alignment)
**Tag:** `[TIMELESS]` (mixed) ⭐
**Statement:** Module boundaries in code reflect RS organizational structure (apotek, radiologi, lab, farmasi, keuangan, etc.).
**Evidence:** 22+ folder topology under `src/` aligns with RS departments.
**Why timeless:** Conway's Law is universal — software structure mirrors organization. Khanza exemplifies this correctly.
**SIMRS BT adoption:** Adopt; modernize via separate packages / monorepo workspaces.

##### P5-C — Lifecycle-Isolation via Process (Separate Sub-Projects)
**Tag:** `[ADOPT-AS-CONCEPT]`
**Statement:** Separate development lifecycles isolated via separate sub-projects (each KhanzaHMS satellite has its own release cadence).
**Evidence:** 14 separate sub-projects under `KhanzaHMS/`.
**Why adopt-as-concept:** Process isolation principle valid; modernize via package versioning / micro-frontends / service boundaries.

##### P5-D — Workflow-Realistic Coupling
**Tag:** `[REQUIRES-CONTEXT]`
**Statement:** Modules tightly coupled where workflow naturally requires it (e.g., apotek + farmasi); loosely coupled where workflow is independent.
**Evidence:** Cross-table FK density reflects workflow coupling.
**Why context-dependent:** Coupling depth should mirror actual workflow needs; varies per RS specialty.

#### Domain 6 — Inter-Module (besides P6-A, P6-B, P6-E in clusters)

##### P6-C — Shared-Schema Integration
**Tag:** `[ERA-2010-LAN]`
**Statement:** Modules integrate via shared DB schema — each reads/writes any table.
**Evidence:** No schema-level access control; convention-based boundaries (P5-B).
**SIMRS BT inversion:** Module-owned schemas + explicit API contracts + row-level security (RLS).

##### P6-D — Application-Centric Coordination Logic
**Tag:** `[ADOPT-AS-CONCEPT]`
**Statement:** Cross-module coordination logic lives in application code, not in DB triggers/procedures (DB is passive).
**Evidence:** 0 stored procedures, 0 triggers, 0 functions (Pre-Flight verified). Coordination happens in Java app.
**Why adopt-as-concept:** App-layer coordination is correct modern pattern; modernize via Edge Functions/service layer.

#### Domain 7 — Universal Functions (besides P7-A, P7-E, P7-F in clusters)

##### P7-B — Application-Centric Logic, Database-Passive
**Tag:** `[ADOPT-AS-CONCEPT]`
**Statement:** Database is passive storage; all business logic in application layer. No procedural code in DB.
**Evidence:** Strict empirical confirmation — `CREATE PROCEDURE` 0, `CREATE TRIGGER` 0, `CREATE FUNCTION` 0, `CREATE VIEW` 0 (Pre-Flight strict-syntax verified).
**Khanza-rational context:** App-layer logic is more testable, version-controllable, and portable than DB procedural code.
**SIMRS BT adoption (concept):** Maintain DB-passive philosophy; modernize app layer to TypeScript services + Edge Functions.

##### P7-C — Template-Based Operational Reporting
**Tag:** `[REQUIRES-CONTEXT]` + `[ERA-2010-LAN]`
**Statement:** Reports implemented as JasperReports templates (.jrxml files), edited by ops/admin without dev cycle.
**Evidence:** **1292 JasperReports templates** (Pre-Flight verified vs Phase 2's 1280 — within counting noise).
**Khanza-rational context:** Templates editable by ops; no dev cycle for new reports.
**SIMRS BT calibration:** Modern template engines (Carbone, React-PDF) or SQL-based reporting tools.

##### P7-D — String-Concat SQL Search (Critical — R9 Evidence Strengthened)
**Tag:** `[ANTI-PRIMITIVE]` **Critical** security
**Statement:** Search functionality across operational forms uses string-concatenation SQL building, not parameterized queries, in substantial portion of search code.
**Evidence (R9 — Lineage Log L025/L026):**
- **1034 Java files use LIKE keyword** (case-insensitive)
- **937 files use parameterized `LIKE ?`** (safe)
- **346 files have unsafe `LIKE '%"+var+"%'` concat patterns** (substantial real exposure)
- Sample unsafe files: `UTDPendonor.java`, `TokoCariReturJual.java`, `TokoSuplier.java`, `TokoStokOpname.java`, `TokoMember.java` — operational forms with user-input search directly concatenating into SQL
- Predecessor cross-review initially recommended downgrade to High based on insufficient evidence; Phase 3a rigorous re-verification found surface is **substantial, not narrow**
**Khanza-rational context:** Trusted-operator LAN deployment = SQL injection threat model low. Pattern present but not exercised by adversarial inputs in field deployment.
**TNI AD Risk:** Cloud / external integration / multi-tenant context = adversarial input vector present. 346 unsafe sites = substantial real exposure. Critical severity retained.
**SIMRS BT inversion:** Parameterized queries mandatory throughout; PostgreSQL `tsvector` for full-text search; modern ORM (Prisma/Drizzle) prevents this class of bug by default.

#### Domain 8 — Error Prevention

##### P8-A — Hybrid Constraint+SELECT Validation
**Tag:** `[REQUIRES-CONTEXT]` + `[ERA-2010-LAN]` race-safety
**Statement:** Uniqueness/existence validation hybrid — sometimes SELECT-before-INSERT (race-prone), sometimes DB constraints (race-safe).
**Evidence:** Mixed validation patterns across forms.
**SIMRS BT calibration:** Standardize on constraint-based validation for race-safety.

##### P8-B — Confirmation Dialog Liberal Use
**Tag:** `[REQUIRES-CONTEXT]` nuanced
**Statement:** Confirmation dialogs liberally inserted as user-intent verification mechanism.
**Evidence:** Numerous `JOptionPane.showConfirmDialog` patterns across Swing forms.
**Khanza-rational context:** Operator-trust philosophy paired with explicit confirmation for destructive actions.
**SIMRS BT calibration:** Modern UX patterns favor reversible actions + undo over confirmation dialogs.

##### P8-C — Constrained-Input Bias Mitigation (Lookup-Driven)
**Tag:** `[TIMELESS]` ⭐
**Statement:** Free-text inputs minimized in favor of constrained inputs (combo boxes, lookups from master tables) — reduces operator typo/recall errors.
**Evidence:** Heavy use of lookup combo boxes throughout Swing forms; master tables populate dropdowns.
**Why timeless:** Cognitive bias mitigation principle universal. Constraining input space reduces error class entirely.
**SIMRS BT adoption:** Combo boxes / typeahead from master tables throughout.

##### P8-D — Error Capture Absent at Schema Level (Critical)
**Tag:** `[ANTI-PRIMITIVE]` **Critical** (Owner-escalated sub-session 8)
**Statement:** No central error log table; application errors invisible to schema-level observation.
**Evidence:** 0 error_log / 0 exception_log / 0 audit_log universal tables (Pre-Flight verified, complement to P7-E).
**Khanza-rational context:** Operator-facing errors handled via Swing dialog popups; back-end errors via Java console logs (not persisted).
**TNI AD Risk:** Invisible system errors = military medical operational liability. Cannot retrospect on failures, cannot alert proactively.
**SIMRS BT inversion:** Centralized error tracking (Sentry / Supabase log_events); structured logging; alerting for critical errors.

#### Domain 9 — Workaround Tricks

##### P9-A — Bridging Module as Heterogeneity Sink
**Tag:** `[REQUIRES-CONTEXT]`
**Statement:** External system heterogeneity absorbed into dedicated `bridging/` module — main app stays cleaner, external API quirks contained.
**Evidence:** 261 files in `src/bridging/` (Pre-Flight verified).
**Khanza-rational context:** Architectural quarantine — heterogeneity contained, main flow simplified.
**SIMRS BT adoption (concept):** Adapter pattern / anti-corruption layer for external integrations.

##### P9-C — Implicit Staging via Status Flags + Queue Tables (R7 Annotation)
**Tag:** `[REQUIRES-CONTEXT]`
**Statement:** Staging implemented via `temporary_*` prefix tables + status flags on main tables; no formal data pipeline.
**Evidence (R7 refinement per Lineage L023):** **22 tables with `temporary_*` prefix** identified in schema (e.g., `temporary_apotek_obat`, `temporary_skrining`, etc.).
**Khanza-rational context:** Lightweight staging for batch operations and migrations without ETL infrastructure.
**SIMRS BT calibration:** Modern alternatives — separate staging schemas, CDC streams, or formal ETL.

#### Domain 10 — Other

##### P10-A — Indonesian Domain Language Fidelity (R2 Calibration)
**Tag:** `[TIMELESS]` for Indonesian RS context ⭐
**Statement:** Schema dalam Bahasa Indonesia (column names, table names, ENUM values) — matches RS regulatory and operator language.
**Evidence (R2 refinement per Lineage L023):** Approximately **900+ instances** of common patterns (`no_*`, `kd_*`, `tgl_*`, etc.); broader **domain language footprint >10K Indonesian-language column occurrences** across schema.
**Khanza-rational context:** Indonesian RS regulatory language (BPJS, Kemenkes, Akreditasi) — schema fidelity reduces translation error.
**SIMRS BT adoption:** Adopt for Indonesian RS context; English aliases via view layer for FHIR/international interop.

##### P10-B — Single-Tenant Schema Design
**Tag:** `[ERA-2010-LAN]` + `[ANTI-PRIMITIVE]` High (multi-RS blocker)
**Statement:** Schema designed for one RS per deployment — no tenant ID columns, no schema-level isolation.
**Evidence:** **0 `rs_id` / `tenant_id` / `klinik_id` / `hospital_id` columns** across 1156 tables (Pre-Flight verified by absence).
**Khanza-rational context:** 1500+ RS adopt via separate deployments each; simpler schema, simpler ops per RS.
**TNI AD Risk:** Multi-RS scaling blocked (G5 Karumkit vision); each new RS = new deployment, no shared infrastructure economies.
**SIMRS BT inversion:** Multi-tenant from day one — `rs_id` foreign key on every operational table + Supabase RLS for isolation.

##### P10-C — Per-Table Manual Restore Dialogs
**Tag:** `[REQUIRES-CONTEXT]` + `[ANTI-PRIMITIVE]` Nuanced
**Statement:** Restore functionality implemented as per-table dialogs (`DlgRestore*` classes), admin-driven.
**Evidence:** Multiple per-table `DlgRestore*` Swing classes.
**Khanza-rational context:** Admin-controlled restore acceptable for small-RS; gives ops fine control.
**TNI AD Risk:** Insufficient for modern standards (point-in-time recovery, transaction-level undo).
**SIMRS BT inversion:** PITR (Point-In-Time Recovery) via PostgreSQL; soft-delete with retention windows.

#### Phase 3a Net-New Primitive

##### P-NEW-1 — Form-as-Table Persistence (N1, Phase 3a Discovery)
**Tag:** `[REQUIRES-CONTEXT]`
**Statement:** Each clinical assessment form / screening / result / correspondence template gets its own dedicated schema table — Khanza does NOT use generic form-builder + answers schema.
**Evidence (N1 per Lineage L027):** Approximately **214 tables (18.5% of schema)** dedicated to clinical assessment forms:

| Prefix | Count | Examples |
|---|---|---|
| `penilaian_*` | 85 | Clinical assessments (`penilaian_awal_keperawatan`, `penilaian_nyeri`, etc.) |
| `surat_*` | 51 | Clinical correspondence (`surat_kontrol`, `surat_keterangan_sakit`, etc.) |
| `skrining_*` | 34 | Screenings (`skrining_gizi`, `skrining_jatuh`, etc.) |
| `hasil_*` | 28 | Results (`hasil_lab`, `hasil_radiologi`, etc.) |
| `template_*` | 16 | Form templates |

**Khanza-rational context:** Each Indonesian regulatory form has fixed structure (BPJS + Kemenkes + Akreditasi mandates). Form-as-Table provides:
- **Structural fidelity** — schema enforces form structure
- **Type safety at DB layer** — columns typed per field
- **Query-ability** — can SELECT specific fields without JSON parsing
- **Reporting friendliness** — JasperReports templates bind to fixed columns

**Tradeoff:** Schema bloat (~214 tables for forms); inflexible to form evolution (schema migration per form change).

**Why distinct from P3-B and P7-A:**
- P3-B is about state machines / inline ENUMs distributed
- P7-A is about validation logic per form
- **P-NEW-1 is about persistence model choice** for forms

**SIMRS BT decision tree (major architectural decision):**
| Approach | Pros | Cons |
|---|---|---|
| Form-as-Table (Khanza-style) | Structural fidelity, type safety, query-friendly | Schema bloat, migration overhead |
| Generic form-builder + answers (JSONB) | Flexible, no migrations | Loose typing, query overhead |
| **Hybrid (recommended)** | Critical regulatory forms as tables; optional/exploratory forms as JSONB | More design upfront |

**Indonesian RS context** (BPJS + Kemenkes + Akreditasi mandatory forms numerous and structurally specific) → form fidelity matters; hybrid approach likely correct.

---


## 3. Section B — Primitives Indexed by Layer 1 Tag

### 3.1 `[TIMELESS]` Primitives (5 Pure + 4 Mixed)

Universal architectural wisdom — adopt directly regardless of stack/era.

#### Pure `[TIMELESS]` (5)

| ID | Primitive | Adoption Note |
|---|---|---|
| **P1-B** | Parallel Dual-Pillar Worldview | Adopt as philosophical foundation; explicit clinical + financial schema separation |
| **P1-C** | Selective Permanence by Entity Type | Adopt as deletion policy: soft delete for audit-grade, cascade for structural, hard delete for transient |
| **P3-D** ⭐ | Encounter-as-Convergence | Adopt as foundational data model — encounter is core hub, billing is derived |
| **P8-C** | Constrained-Input Bias Mitigation | Adopt UI pattern: combo box / typeahead from master tables throughout |
| **P10-A** | Indonesian Domain Language Fidelity | Adopt for Indonesian RS context; English aliases via view layer for FHIR interop |

#### Mixed `[TIMELESS]` + other (4)

| ID | Primitive | Mixed Tag | Reasoning |
|---|---|---|---|
| **P1-A** | Pragmatic Configurability | `[TIMELESS]` concept + `[REQUIRES-CONTEXT]` depth | Concept timeless (configurability enables adoption); depth depends on context |
| **P2-A** | Encounter-as-Pivot | `[TIMELESS]` | Same conceptual framing as P3-D; operationalized differently |
| **P5-A** | Conway's Law Alignment | `[TIMELESS]` | Adopt principle; modernize manifestation via packages/workspaces |
| **P6-A** ⭐ | Dual-Spine Architecture | `[TIMELESS]` | Direct operational manifestation of P1-B + P3-D; map to TNI AD audit pathway separation |

### 3.2 `[ADOPT-AS-CONCEPT]` Primitives (3)

Concept valid; modernize implementation in different stack.

| ID | Primitive | What to Adopt |
|---|---|---|
| **P5-C** | Lifecycle-Isolation via Process | Process isolation principle; modernize via package versioning / micro-frontends |
| **P6-D** | Application-Centric Coordination Logic | App-layer coordination (vs DB triggers); modernize via Edge Functions / service layer |
| **P7-B** | Application-Centric Logic, Database-Passive | DB-passive philosophy; modernize app layer to TypeScript services |

### 3.3 `[REQUIRES-CONTEXT]` Primitives (10+ Pure, 7+ Mixed)

Pattern's correctness depends on scale, era, deployment model, or operator characteristics. Calibrate per SIMRS BT context.

#### Pure `[REQUIRES-CONTEXT]`

| ID | Primitive | SIMRS BT Calibration Question |
|---|---|---|
| **P2-B** | Identifier-as-Domain-Value | Semantic IDs (operator-friendly) vs UUID PK (refactor-safe) — hybrid recommended |
| **P2-D** | Pragmatic Schema Polymorphism | Selective denorm vs materialized views — case-by-case |
| **P5-D** | Workflow-Realistic Coupling | Coupling depth mirrors workflow needs |
| **P6-E** | Transient Billing | Adopt corollary of Choice 3: billing as derived view |
| **P8-B** | Confirmation Dialog Liberal Use | Modern UX: reversible actions + undo over confirmations |
| **P9-A** | Bridging as Heterogeneity Sink | Adopt as adapter pattern / anti-corruption layer |
| **P9-C** | Implicit Staging | 22 `temporary_*` tables in Khanza; calibrate — separate staging schemas or formal ETL |
| **P-NEW-1** | Form-as-Table Persistence | Hybrid: critical regulatory forms as tables; optional as JSONB |

#### Mixed (with other tags)

| ID | Primitive | Combined Tags |
|---|---|---|
| P1-A | Pragmatic Configurability | `[TIMELESS]` + `[REQUIRES-CONTEXT]` |
| P1-D | Accretion Over Refactoring | `[REQUIRES-CONTEXT]` + `[ERA-2010-LAN]` |
| P3-B | Distributed Implicit State Machines | `[ANTI-PRIMITIVE]` High + `[REQUIRES-CONTEXT]` |
| P3-C | Master/Operational Distinction | `[REQUIRES-CONTEXT]` + `[ERA-2010-LAN]` |
| P4-B | Satellite Integration Apps | `[REQUIRES-CONTEXT]` + `[ERA-2010-LAN]` |
| P5-E | Convention-Over-Enforcement | `[ANTI-PRIMITIVE]` partial + `[REQUIRES-CONTEXT]` |
| P7-C | Template-Based Reporting | `[REQUIRES-CONTEXT]` + `[ERA-2010-LAN]` |
| P8-A | Hybrid Constraint+SELECT Validation | `[REQUIRES-CONTEXT]` + `[ERA-2010-LAN]` |
| P10-C | Per-Table Manual Restore Dialogs | `[REQUIRES-CONTEXT]` + `[ANTI-PRIMITIVE]` Nuanced |

### 3.4 `[ERA-2010-LAN]` Primitives (4 Pure + 9 Mixed)

Era-specific artifacts of 2010-era LAN-deployed single-RS context. Likely invert/modernize for SIMRS BT cloud context.

#### Pure `[ERA-2010-LAN]`

| ID | Primitive | Modern Equivalent |
|---|---|---|
| **P4-A** | Fat-Client-with-Shared-DB | Web app + API + serverless functions |
| **P4-E** | Database-as-Mailbox (polling) | Event-driven (Supabase realtime, LISTEN/NOTIFY) |
| **P6-C** | Shared-Schema Integration | Module-owned schemas + explicit APIs + RLS |
| **P10-B** | Single-Tenant Schema | Multi-tenant via `rs_id` FK + RLS |

#### Mixed `[ERA-2010-LAN]` + other (9)

P1-D, P2-C, P3-A, P3-C, P4-B, P5-B, P7-C, P7-F, P8-A, P9-B (10 total — P10-B counted above; correct 9 mixed listed elsewhere — see §4 for master table)

### 3.5 `[ANTI-PRIMITIVE]` Primitives (12 — Severity-Cross-Referenced)

#### 🔴 Critical (5) — MUST avoid

| ID | Pattern | TNI AD Risk |
|---|---|---|
| **P7-E** | Audit Trail Absent at Schema Level (top-severity) | BPK + Itjenad audit framework cannot operate |
| **P4-D** | Silent Last-Write-Wins | Concurrent edit collision unrecoverable; silent data loss |
| **P6-B** | Eventual Consistency via Human Reconciliation | Cross-module integrity weak; partial-state common |
| **P7-D** | String-Concat SQL Search (346 unsafe files empirically) | Security: SQL injection surface substantial |
| **P8-D** | Error Capture Absent | Invisible system errors = military medical operational liability |

#### 🟠 High (5) — STRONGLY avoid

| ID | Pattern | Why High |
|---|---|---|
| **P4-C** | UI-as-Orchestrator (No Service Layer) | Logic duplication, untestable, refactor risk |
| **P7-A** | Per-Form Inline Validation | Inconsistency, duplication, no central rule registry |
| **P7-F** | Authorization-as-Boolean-Matrix (1198 cols) | Schema bloat, no role abstraction, multi-tenant blocker |
| **P9-B** | Epoch-Stratified Naming (4 prefixes) | Onboarding cost, tooling friction, refactor resistance |
| **P10-B** | Single-Tenant Schema | Multi-RS scaling blocked (G5 Karumkit vision) |

#### 🟡 Nuanced (2) — Avoid in scale; acceptable in narrow contexts

| ID | Pattern | Why Nuanced |
|---|---|---|
| **P5-B** | Naming-Convention-as-Boundary | Workable small-team; doesn't scale; harm gradual not acute |
| **P10-C** | Per-Table Manual Restore Dialogs | Admin-controlled acceptable small-RS; insufficient for modern standards |

#### Partial Anti-Primitive Elements (Not in 12-count, Mixed Tags)

Several primitives have anti-primitive elements without being primary anti-primitives:

| ID | Primary Tag | Anti-Primitive Element |
|---|---|---|
| **P1-E** | Operational philosophy | Trust + Speed over Defense + Accuracy — anti for cloud/external context |
| **P2-C** | `[ERA-2010-LAN]` + partial anti | Audit time absence (manifests in P7-E) |
| **P3-A** | `[ERA-2010-LAN]` + anti-combined | Combined with P7-E as Choice 1 core |
| **P3-B** | `[REQUIRES-CONTEXT]` + High anti | Distributed state machines High severity |
| **P3-E** | Critical cross-ref | Implicit audit (= P7-E theoretical articulation) |
| **P5-E** | `[REQUIRES-CONTEXT]` + partial anti | Convention without enforcement |

---

## 4. Section C — Master Lookup Table (All 46 Primitives)

Sortable single-table reference. Use Ctrl+F for ID/keyword search.

| ID | Domain | Name | Primary Tag | Cluster | Severity (if anti) | Anchor Evidence |
|---|---|---|---|---|---|---|
| P1-A | 1 | Pragmatic Configurability | TIMELESS + REQUIRES-CONTEXT | Standalone | — | ~52 set_* tables |
| P1-B | 1 | Parallel Dual-Pillar Worldview | TIMELESS ⭐ | Standalone | — | Philosophical (P6-A manifests) |
| P1-C | 1 | Selective Permanence by Entity Type | TIMELESS ⭐ | Standalone | — | Mixed delete patterns per entity type |
| P1-D | 1 | Accretion Over Refactoring | REQUIRES-CONTEXT + ERA-2010-LAN | Standalone | — | 2011-2040 temporal span (R8) |
| P1-E | 1 | Trust + Speed > Defense + Accuracy | ANTI-PRIMITIVE philosophy | Standalone | — | P7-A, P7-D, P7-E, P4-D combined |
| P2-A | 2 | Encounter-as-Pivot | TIMELESS (mixed) | Choice 3 | — | 350 FK to reg_periksa |
| P2-B | 2 | Identifier-as-Domain-Value | REQUIRES-CONTEXT | Standalone | — | no_rawat, no_rkm_medis formats |
| P2-C | 2 | Bifurcated Temporal Model | ANTI partial + ERA-2010-LAN | Choice 1 | partial | tgl_/jam_ present; *_at absent |
| P2-D | 2 | Pragmatic Schema Polymorphism | REQUIRES-CONTEXT | Standalone | — | Selective denorm patterns |
| P3-A | 3 | Snapshot-Only State Model | ANTI Critical-combined + ERA | Choice 1 (core) | Critical (combined with P7-E) | 0 universal audit columns |
| P3-B | 3 | Distributed Implicit State Machines | ANTI High + REQUIRES-CONTEXT | Choice 2 (core) | High | 218 status + 4266 total ENUMs (R4) |
| P3-C | 3 | Master/Operational Distinction | REQUIRES-CONTEXT + ERA-2010-LAN | Standalone | — | mst_* prefix sparse usage |
| P3-D | 3 | Encounter-as-Convergence | TIMELESS ⭐ | Choice 3 (core) | — | Theoretical framing of P6-A |
| P3-E | 3 | Implicit Audit | ANTI Critical (cross-ref P7-E) | Choice 1 | Critical | Same as P7-E |
| P4-A | 4 | Fat-Client-with-Shared-DB | ERA-2010-LAN | Standalone | — | 1627 Java Swing files |
| P4-B | 4 | Satellite Integration Apps | REQUIRES-CONTEXT + ERA-2010-LAN | Standalone | — | 261 bridging + 14 satellites + 191 HTTP (R5) |
| P4-C | 4 | UI-as-Orchestrator | ANTI High | Standalone | High | Dialog classes do SQL directly |
| P4-D | 4 | Silent Last-Write-Wins | ANTI Critical | Choice 1 | Critical | No version/lock columns |
| P4-E | 4 | Database-as-Mailbox | ERA-2010-LAN | Standalone | — | Status flags as handoff |
| P5-A | 5 | Conway's Law Alignment | TIMELESS (mixed) | Standalone | — | 22+ src folder modules |
| P5-B | 5 | Naming-Convention-as-Boundary | ANTI Nuanced + ERA | Choice 2 | Nuanced | Domain prefixes signal ownership |
| P5-C | 5 | Lifecycle-Isolation via Process | ADOPT-AS-CONCEPT | Standalone | — | 14 KhanzaHMS sub-projects |
| P5-D | 5 | Workflow-Realistic Coupling | REQUIRES-CONTEXT | Standalone | — | FK density reflects workflow |
| P5-E | 5 | Convention-Over-Enforcement | ANTI partial + REQUIRES-CONTEXT | Choice 2 | partial | No formal interfaces |
| P6-A | 6 | Dual-Spine Architecture | TIMELESS (mixed) ⭐ | Choice 3 | — | 350 FK reg_periksa + 301 FK rekening |
| P6-B | 6 | Eventual Consistency via Human Reconciliation | ANTI Critical | Choice 1 | Critical | 1/1/1 transaction discipline (H6.2) |
| P6-C | 6 | Shared-Schema Integration | ERA-2010-LAN | Standalone | — | No schema-level access control |
| P6-D | 6 | Application-Centric Coordination | ADOPT-AS-CONCEPT | Standalone | — | 0 stored procedures |
| P6-E | 6 | Transient Billing | REQUIRES-CONTEXT | Choice 3 | — | nota_* thin marker tables |
| P7-A | 7 | Per-Form Inline Validation | ANTI High | Choice 2 | High | Validation in Dlg* classes |
| P7-B | 7 | Application-Centric Logic, DB-Passive | ADOPT-AS-CONCEPT | Standalone | — | 0 procedures/triggers/functions/views |
| P7-C | 7 | Template-Based Operational Reporting | REQUIRES-CONTEXT + ERA-2010-LAN | Standalone | — | 1292 JasperReports templates |
| P7-D | 7 | String-Concat SQL Search | ANTI Critical | Standalone | Critical (R9) | 346 unsafe / 1034 total LIKE files |
| P7-E | 7 | Audit Trail Absent at Schema Level | ANTI Critical (TOP) | Choice 1 | Critical (top) | 0 universal audit; 17 PPI scoped (R6) |
| P7-F | 7 | Authorization-as-Boolean-Matrix | ANTI High + ERA-2010-LAN | Choice 2 | High | user table 1198 columns |
| P8-A | 8 | Hybrid Constraint+SELECT Validation | REQUIRES-CONTEXT + ERA-2010-LAN | Standalone | — | Mixed validation patterns |
| P8-B | 8 | Confirmation Dialog Liberal Use | REQUIRES-CONTEXT nuanced | Standalone | — | Numerous JOptionPane.showConfirmDialog |
| P8-C | 8 | Constrained-Input Bias Mitigation | TIMELESS ⭐ | Standalone | — | Lookup combos throughout |
| P8-D | 8 | Error Capture Absent | ANTI Critical (Owner-escalated) | Standalone | Critical | 0 error_log universal tables |
| P9-A | 9 | Bridging as Heterogeneity Sink | REQUIRES-CONTEXT | Standalone | — | 261 bridging files |
| P9-B | 9 | Epoch-Stratified Naming Conventions | ANTI High + ERA-2010-LAN | Choice 2 | High | 4 prefixes confirmed (R3): no_ kd_ kode_ id_ |
| P9-C | 9 | Implicit Staging via Status + Queue | REQUIRES-CONTEXT | Standalone | — | 22 temporary_* tables (R7) |
| P10-A | 10 | Indonesian Domain Language Fidelity | TIMELESS ⭐ | Standalone | — | ~900+ common patterns, >10K footprint (R2) |
| P10-B | 10 | Single-Tenant Schema Design | ERA-2010-LAN + ANTI High | Standalone | High | 0 tenant_id across 1156 tables |
| P10-C | 10 | Per-Table Manual Restore Dialogs | REQUIRES-CONTEXT + ANTI Nuanced | Standalone | Nuanced | DlgRestore* classes per table |
| **P-NEW-1** | New | **Form-as-Table Persistence** | **REQUIRES-CONTEXT** | **Standalone** | — | **~214 tables (18.5% schema) (N1)** |

**⭐ = Highest-value adoption candidates** (5 pure TIMELESS + 2 highest-leverage mixed TIMELESS: P3-D, P6-A)

---

## 5. Section D — Tag Application Notes

### 5.1 Mixed Tags Reasoning

Several primitives carry combined Layer 1 tags. Reasoning:

#### P1-A — `[TIMELESS]` concept + `[REQUIRES-CONTEXT]` depth
- **TIMELESS aspect:** Pragmatic configurability as an *enabler of adoption diversity* is timeless wisdom — software that bends to organization patterns adopts better than software requiring organization to bend
- **REQUIRES-CONTEXT aspect:** How DEEP to configure (Khanza's 52 set_* tables vs SIMRS BT's likely much fewer) depends on context — over-configuration becomes own complexity

#### P2-A — `[TIMELESS]` (mixed with operational manifestation)
- Concept (hub-and-spoke around encounter) is timeless
- Operational manifestation (composite semantic ID `no_rawat`) is era-specific
- **Adopt concept; modernize implementation**

#### P5-A — `[TIMELESS]` (Conway's Law)
- Conway's Law itself is universal organizational principle
- Manifestation via 22 src folders era-specific; modern equivalent = packages, micro-frontends
- **Adopt principle; modernize manifestation**

#### P6-A — `[TIMELESS]` ⭐ (Dual-Spine)
- Dual-spine pattern (clinical + financial) operationalizes P1-B universally
- Maps to TNI AD compliance pathway separation (Itjenad clinical + BPK financial)
- **Adopt foundational architecture**

#### P3-B — `[ANTI-PRIMITIVE]` High + `[REQUIRES-CONTEXT]`
- Pattern (distributed state machines via inline ENUMs) is anti for testability/consistency at scale (High severity)
- Context-dependent because **scale of distribution matters** — Khanza's 4266 ENUMs is fragmentation excess; some inline ENUM use can be acceptable

#### P1-D — `[REQUIRES-CONTEXT]` + `[ERA-2010-LAN]`
- For 2010-era LAN with operator continuity, accretion bias was sound (refactor cost > accretion cost)
- Cloud era allows refactor without downtime — context shifts
- Calibrate: adopt accretion bias for stable patterns, refactor aggressively for emerging patterns

### 5.2 Severity Tier Criteria

#### 🔴 Critical
- **Existential risk** to TNI AD compliance / military operational integrity
- Cannot be mitigated by surrounding policy alone
- Affects audit defensibility, data integrity, or security
- 5 entries: P7-E, P4-D, P6-B, P7-D, P8-D

#### 🟠 High
- **Substantial operational/strategic risk** without immediate existential threat
- Mitigation possible via discipline, but discipline alone insufficient at scale
- Affects scalability, maintainability, or future evolvability
- 5 entries: P4-C, P7-A, P7-F, P9-B, P10-B

#### 🟡 Nuanced
- **Harm gradual, not acute** at moderate scale
- Workable in narrow context (small RS, single team)
- Worth avoiding for strategic reasons, but not blocker for initial deployment
- 2 entries: P5-B, P10-C

### 5.3 Why "Anti-Primitive" Is Not Pejorative

Per Owner directive (Phase 2 sub-session 8):
- **Anti-primitive = anti only from SIMRS BT's different context.** Khanza's choices were rational for its context.
- Khanza optimized for **operational throughput + adoption breadth**; SIMRS BT optimizes for **audit defensibility + multi-RS scaling**. Different optimization targets → different correct patterns.
- Framing rule: when describing anti-primitives in IMPLICATIONS-FOR-SIMRS-BT, lead with **what Khanza optimized for** before stating **what SIMRS BT needs differently**.

### 5.4 Why Some Primitives Have ANTI-PRIMITIVE Elements but Aren't in the 12-Count

The "12 anti-primitives" tally counts entries where ANTI-PRIMITIVE is the **primary classification**. Primitives with mixed tags including partial anti-primitive elements (P1-E, P2-C, P3-A, P3-B, P3-E, P5-E) are not double-counted — their primary classification points to the appropriate cluster (e.g., P3-A's primary classification is the Choice 1 cluster anchor).

This avoids inflation while preserving evidence — P3-A *combines with* P7-E as the Critical cluster manifestation, but P7-E is the canonical Critical entry in the 12-count.

---

## 6. Closing — Handoff to Deliverable 2 (CAUSAL-CHAINS)

### 6.1 Phase 3a Refinements Integration Summary

This PATTERNS-REGISTRY integrates the following empirically-verified refinements from Phase 3a (cross-verified with predecessor session, Owner-approved per Lineage Log L022-L028):

| Refinement | Affected Primitive | Integration Status |
|---|---|---|
| R1 | License: custom Khanza.Soft Media (not Aladdin) | §0.6 ✅ |
| R2 | Indonesian patterns calibration (>10K footprint) | P10-A ✅ |
| R3 | P9-B 4 prefixes verified (no_ kd_ kode_ id_) | P9-B §2.2 ✅ |
| R4 | P3-B broader ENUM scope (4266 total, 218 status) | P3-B §2.2 ✅ |
| R5 | P4-B 3 integration tiers (embedded HTTP + satellite + shared-schema) | P4-B §2.4 ✅ |
| R6 | P7-E PPI compliance context (17 audit tables = capability) | P7-E §2.1 ✅ |
| R7 | P9-C 22 temporary_* tables annotation | P9-C §2.4 ✅ |
| R8 | P1-D temporal evidence (2011-2040 span) | P1-D §2.4 ✅ |
| R9 | P7-D Critical retention (346 unsafe files evidence) | P7-D §2.4 ✅ |
| N1 | Form-as-Table Persistence as 46th primitive | P-NEW-1 §2.4 ✅ |

**Severity tally maintained:** 5 Critical + 5 High + 2 Nuanced = 12 anti-primitives (Lineage L028).

### 6.2 What Comes Next — Deliverable 2 Roadmap

`KHANZA-CODEX-PHASE-3-CAUSAL-CHAINS.md` will document **cross-primitive relationships**:

- How primitives cluster causally (which primitives produce which downstream patterns)
- The two main causal threads:
  - **Thread 1:** P3-A (Snapshot-Only Time Model) → P7-E (No Audit) → P3-E (Implicit Audit) → P4-D (Last-Write-Wins) → P6-B (Human Reconciliation)
  - **Thread 2:** P3-B (Distributed State) → P7-A (Per-Form Validation) → P5-B (Naming Boundaries) → P7-F (Boolean Matrix) → P9-B (Epoch Naming)
- Positive causal chain: P1-B (Dual-Pillar) → P3-D (Encounter-as-Convergence) → P6-A (Dual-Spine) → P2-A (350 FK pivot)
- Primitive-to-primitive force relationships (which primitives reinforce vs which constrain)

PATTERNS-REGISTRY remains the **catalog**; CAUSAL-CHAINS will be the **map of relationships**.

### 6.3 Phase 3 Deliverable Status

| Deliverable | Status | Notes |
|---|---|---|
| Phase 3 Pre-Flight Report | ✅ Complete | Empirical baseline + 9 refinements + N1 surfaced |
| Methodology MD (mutual verification) | ✅ Complete | Pattern codified for future sessions |
| Lineage Audit Log v1.1 | ✅ Complete | L001-L032; additive-only discipline maintained |
| **Deliverable 1: PATTERNS-REGISTRY (this doc)** | ✅ **Complete** | **Awaiting Owner approval for Deliverable 2** |
| Deliverable 2: CAUSAL-CHAINS | ⏳ Pending Owner gate | ~400-600 lines estimated |
| Deliverable 3: IMPLICATIONS-FOR-SIMRS-BT | ⏳ After Deliverable 2 | ~700-1000 lines estimated |
| Deliverable 4: IMPLICATIONS-FOR-SIKESUMA | ⏳ After Deliverable 3 | ~300-500 lines estimated |
| Phase 4: Owner review | ⏳ After all 4 deliverables | |
| Phase 5: Final THE-KHANZA-CODEX.md | ⏳ After Owner review | |

### 6.4 Discipline Checkpoints Maintained

| Discipline | Status |
|---|---|
| Clean-room (no verbatim code/SQL) | ✅ Counts + structural patterns + class/file names only |
| License clean (per R1 correction) | ✅ Khanza.Soft Media custom license respected |
| Cross-project boundary (no SIKESUMA touch) | ✅ No clone, no query, no edit |
| No SIMRS BT artifact edit | ✅ Codex is reference for SIMRS BT spoke; spoke owns its artifacts |
| Owner-mediated cross-session feedback | ✅ Phase 3a + predecessor cross-review via Owner |
| "Khanza optimized rationally" tone | ✅ Every anti-primitive paired with rational tradeoff context |
| Additive-only lineage discipline | ✅ Lineage Log preserves L016, L017 as superseded; L024/L026 cite corrections |

---

**End of PATTERNS-REGISTRY v1.0. Phase 3a session awaiting Owner approval untuk proceed ke Deliverable 2 (CAUSAL-CHAINS).**

