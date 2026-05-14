# The Khanza Codex — Phase 3 Deliverable 3: IMPLICATIONS-FOR-SIMRS-BT
## Forward-Looking Architectural Roadmap untuk SIMRS Batin Tikal

**File:** `KHANZA-CODEX-PHASE-3-IMPLICATIONS-FOR-SIMRS-BT.md`
**Versi:** 1.0
**Tanggal:** 13 Mei 2026
**Document type:** **Phase 3 Deliverable 3** — synthesis of Khanza primitives menjadi actionable architectural guidance untuk SIMRS BT spoke session
**Author:** Phase 3b Khanza spoke session AI
**Owner:** dr Ferry
**Intended consumer:** SIMRS BT spoke session AI (separate session — Owner-mediated transfer)
**Status:** Awaiting Owner approval untuk D4 (IMPLICATIONS-FOR-SIKESUMA) production
**Authority basis:** PATTERNS-REGISTRY v1.0 (46 primitives, L022-L028) + CAUSAL-CHAINS v1.0 + Lineage Log v1.3 closure L039
**Successor org context:** Karumkit RS Tk.IV 02.07.03 Batin Tikal, TNI AD

---

## 0. Preamble

### 0.1 Purpose

Dokumen ini adalah **synthesis reference** untuk SIMRS Batin Tikal (SIMRS BT) spoke session — translation Khanza Codex findings (46 primitives + 5 causal chains + 3 Deep Theoretical Choices) menjadi **actionable architectural guidance** untuk desain SIMRS BT.

Khanza Codex menyediakan tiga layer:

| Layer | Document | Purpose |
|---|---|---|
| **Catalog** | PATTERNS-REGISTRY | 46 primitif individu (what) |
| **Map** | CAUSAL-CHAINS | bagaimana primitives saling memproduksi (why) |
| **Roadmap** | **This document (D3)** | apa yang SIMRS BT lakukan dengan findings (how) |

D3 adalah **roadmap layer** — translates "what + why" menjadi "how" untuk SIMRS BT context.

### 0.2 Intended Consumer & Cross-Project Boundary

**Primary consumer:** SIMRS BT spoke session AI (separate Codex spoke).

**Boundary discipline (CRITICAL — per Owner Policy Addendum v1.5 §S):**
- Dokumen ini adalah **reference document**, BUKAN edit terhadap SIMRS BT artifacts
- Phase 3b Khanza session **TIDAK** menyentuh SIMRS BT Blueprint, repo, atau live artifacts
- Owner akan brief SIMRS BT session secara terpisah dengan dokumen ini sebagai input
- SIMRS BT session retain autonomy untuk adopt, adapt, atau reject specific recommendations dengan rationale
- Cross-spoke feedback flows via Owner only (no AI-to-AI direct communication)

**Tone discipline (carry-over from all Phase 2-3 docs):** "Khanza optimized rationally" — setiap anti-primitive paired dengan rational context (Khanza optimized FOR X; SIMRS BT context differs IN Y; therefore SIMRS BT chooses Z). Khanza adalah brilliant solution untuk different problem space, bukan "wrong" system.

### 0.3 SIMRS BT Context Assumptions (Per Phase 1-2 Brief Carry-Over)

Per Phase 1 brief dan Phase 2 mid-phase reflection, SIMRS BT context berbeda dari Khanza dalam dimensional analysis:

| Dimension | Khanza Context (2010-era LAN) | SIMRS BT Context (cloud-era TNI AD) |
|---|---|---|
| **Deployment** | On-premise LAN single-RS | Cloud + multi-RS (G5 Karumkit vision) |
| **Stack** | Java Swing + MySQL fat-client | Web + API + PostgreSQL (Supabase) |
| **Audit framework** | Paper-based (BPK + Akreditasi inspectors) | Forensic schema-level (BPK + Itjenad digital audit) |
| **Operator model** | Trained operators in single facility | Multi-shift + multi-facility + military discipline |
| **Compliance** | Civilian RS regulatory baseline | Military medical + state audit + civilian compliance (Akreditasi) |
| **Integration** | Bridging modules + satellite apps | API-first + external partner-grade integration |
| **Threat model** | Internal trusted operators | External adversarial + insider risk + audit forensics |
| **Lifecycle horizon** | 2011-2040 evidence (29-year envisioned) | Multi-decade institutional commitment |
| **Tenancy** | Single-tenant per deployment | Multi-tenant ready (rs_id from day one) |

These dimensional differences explain why several Khanza primitives — rational dalam Khanza context — menjadi anti dalam SIMRS BT context. Dokumen organize recommendations sesuai dimensional analysis ini.

### 0.4 Reading Guide

**Document structure:**

| Section | Topic | Approx Length |
|---|---|---|
| **§A** | Adopt (TIMELESS + ADOPT-AS-CONCEPT primitives) | ~200 lines |
| **§B** | Calibrate (REQUIRES-CONTEXT primitives) | ~130 lines |
| **§C** | Invert (Anti-primitives Critical + High elevated + brief) | ~270 lines |
| **§D** | 3 Deep Choices Application | ~80 lines |
| **§E** | Recommended Blueprint Sections (9 pattern guidance items) | ~210 lines |
| **§F** | Inversion Sequencing | ~90 lines |
| **Closing** | Handoff to D4 + discipline checklist | ~30 lines |

**Cross-reference convention:**
- `P_X` → primitive in PATTERNS-REGISTRY (e.g., P7-E, P-NEW-1)
- `Chain N` → causal chain in CAUSAL-CHAINS (e.g., Chain 4)
- `L_NNN` → Lineage Log entry (e.g., L026 for P7-D Critical retention)
- ⭐ marks highest-value adoption candidates
- 🔴🟠🟡 anti-primitive severity tier

**Recommended reading paths:**

| Reader | Path |
|---|---|
| SIMRS BT architect (primary) | §A → §F (sequencing) → §E (Blueprint patterns) → §C (specific inversions) |
| SIMRS BT engineer (implementation) | §E → §C → §B (per-task lookup) |
| Owner / strategic reviewer | §0 → §D → §F → Closing |
| Future Khanza session | All sections + Lineage Log §6.7+ |

### 0.5 Methodology & Discipline Checkpoints

This document maintains all carry-over disciplines:

| Discipline | Approach |
|---|---|
| Clean-room reverse engineering | Zero verbatim Java/SQL code copy throughout |
| License | Khanza.Soft Media custom license respected (L022) |
| Cross-project boundary | No SIMRS BT artifact touch; no SIKESUMA reference at all |
| "Khanza optimized rationally" tone | Each anti-primitive leads with rational Khanza context |
| Lineage references | Cite primitive IDs, chain numbers, Lineage entries |
| Additive-only | No relitigation of Owner-approved decisions (L022-L028 stand) |
| Sequencing logic | Per CAUSAL-CHAINS §6.2: Chain 4 foundation → Chain 3 schema → Chain 2 audit → Chain 1 layers |

---

## 1. Section A — Adopt (TIMELESS Primitives + ADOPT-AS-CONCEPT)

This section covers primitives where SIMRS BT should **adopt directly** atau **adopt-as-concept** (modernize implementation). 5 pure `[TIMELESS]` + 4 mixed `[TIMELESS]` + 3 `[ADOPT-AS-CONCEPT]` = 12 primitives.

### A.1 P1-B — Parallel Dual-Pillar Worldview ⭐

**Tag:** `[TIMELESS]` (pure)
**Khanza pattern:** Philosophical premise — RS adalah parallel medical + business institution; neither subordinate. Schema reflects this with parallel data structures (manifested in P6-A dual-spine).

**SIMRS BT adoption guidance:**

1. **Codify dual-pillar premise as Blueprint preamble.** State explicitly: clinical and financial pillars are co-equal; neither subordinate. This frames every subsequent architectural decision.
2. **Physically separate schemas at PostgreSQL level.** Recommended: `clinical` schema + `financial` schema (atau alias yang sesuai TNI AD naming). Module boundaries enforced at DB layer, bukan hanya naming convention (avoids P5-B anti-pattern).
3. **RLS policies per pillar.** Clinical staff can read clinical detail; financial staff can read financial detail; appropriate cross-pillar roles for unified workflows (encounter completion + billing).
4. **Audit pathway separation.** Itjenad clinical audit operates on clinical schema; BPK financial audit operates on financial schema. Cross-pillar joins via materialized views with audit-grade lineage.

**Rationale:** Maps directly to TNI AD compliance pathway separation. Adopting P1-B as philosophical foundation cascades into structural conditions for Chain 4 (positive) and supports Chain 2 (audit) inversion.

**Cross-references:** Manifests operationally via P6-A (§A.9); see CAUSAL-CHAINS Chain 4.

### A.2 P1-C — Selective Permanence by Entity Type ⭐

**Tag:** `[TIMELESS]` (pure)
**Khanza pattern:** Different entity types deserve different deletion semantics. Master data soft-delete; operational data cascade-protect; transient data hard-delete acceptable.

**SIMRS BT adoption guidance:**

Codify **deletion policy matrix** sebagai Blueprint discipline. Recommended tiers:

| Tier | Entity Examples | Deletion Policy |
|---|---|---|
| **Audit-grade** | patients, doctors, encounters, billing records, medication orders | Soft delete (`deleted_at` column) + retention window + audit trail of deletion event |
| **Structural master** | poli, diagnosa_icd10, jenis_obat, master pricing tables | Cascade-protect via FK constraints; deletion requires explicit acknowledgment + alternate-reference availability |
| **Operational transient** | session tokens, draft form states, UI preferences, queue items processed | Hard delete acceptable; no audit trail required |

**Implementation patterns:**
- Audit-grade tier: `deleted_at TIMESTAMPTZ NULL` + RLS policy excluding deleted rows from default view
- Structural tier: PostgreSQL `ON DELETE RESTRICT` or `ON DELETE SET NULL` per business logic
- Transient tier: Direct DELETE; consider TTL cleanup job

**Rationale:** Audit forensic requirements (Chain 2 inversion) + operational hygiene. Without selective permanence, either schema bloats with stale data atau audit reconstruction fails on deleted records.

**Cross-references:** Supports §E.1 (Mandatory Audit Trail) implementation.

### A.3 P3-D — Encounter-as-Convergence ⭐⭐ (HIGHEST-VALUE ADOPTION)

**Tag:** `[TIMELESS]` (pure) — Chain 4 core
**Khanza pattern:** Encounter (patient visit) is reality; billing is bookkeeping. Encounter sits at center; clinical activity flows from it; billing derives from clinical work, not reverse.

**SIMRS BT adoption guidance:**

This is the **single highest-value positive learning** dari Khanza. Adopt verbatim sebagai data model foundation:

1. **Encounter table sebagai core hub.** Naming: `clinical.kunjungan` atau `clinical.encounter` (per SIMRS BT naming convention). Houses encounter event metadata (start, end, type, encounter_status, attending_physician_id, patient_id, rs_id).
2. **UUID primary key + semantic ID column.** UUID PK for system integrity + refactor safety. Separate `nomor_kunjungan` column for operator-facing semantic ID (Khanza-style human-readable: date + sequence + clinic). Solves Khanza's `no_rawat` fragility while preserving operator UX.
3. **Clinical detail tables FK to encounter.** Procedure records, prescription orders, lab results, imaging studies, nursing notes — semua reference `kunjungan.id`. Encounter is convergence point.
4. **Billing derived from clinical events, NOT source-of-truth.** Charges computed from clinical detail tables via service layer; billing tables (`financial.nota_*` equivalent) carry presentation/aggregate state, not authoritative pricing decisions.

**Implementation pattern:**
- Encounter table sebagai hub (mirip Khanza `reg_periksa` 350 FK pattern)
- Service layer function `calculateEncounterCharges(encounterId)` returns computed charges
- Billing finalization snapshots computed charges into immutable `tagihan_final` table (P1-C tier)

**Rationale:** Universal correctness for hospital information systems. Matches operational reality (encounter = irreducible business event). Maps to BPJS + Kemenkes claim submission model (encounter-based billing).

**Cross-references:** Chain 4 core; operationally manifests via P6-A (§A.9); see CAUSAL-CHAINS Chain 4 evidence (350 FK to reg_periksa).

### A.4 P8-C — Constrained-Input Bias Mitigation ⭐

**Tag:** `[TIMELESS]` (pure)
**Khanza pattern:** Free-text inputs minimized in favor of constrained inputs (combo boxes, lookups from master tables). Reduces operator typo/recall errors.

**SIMRS BT adoption guidance:**

Adopt sebagai **universal UI input discipline**:

1. **Master table lookups for any field with finite domain.** Doctor selection → lookup from `master.dokter`; diagnosis → lookup dari `master.diagnosa_icd10`; medication → lookup dari `master.obat`; poli → lookup dari `master.poli`. ZERO free-text untuk semantic identifiers.
2. **Typeahead/combobox UI components throughout.** React Select + Supabase typeahead query patterns; debounced server-side filter to handle large master tables.
3. **FK constraints enforce lookup-only at DB layer.** UI typeahead + DB FK = defense in depth; impossible to silently insert invalid reference.
4. **Free-text reserved for genuinely-narrative fields.** Chief complaint, clinical note, examination findings — free-text appropriate. ID fields, classification fields, picklists — never free-text.

**Cognitive load reduction:**
- Constrained input reduces operator decision space (faster entry)
- Eliminates entire error class (typo invalidating downstream queries)
- Forces master data hygiene as side-benefit (operators surface missing entries)

**Cross-references:** Complements §E.8 (Centralized Validation Library) — validation layer rejects invalid references; UI typeahead prevents invalid input upstream.

### A.5 P10-A — Indonesian Domain Language Fidelity ⭐

**Tag:** `[TIMELESS]` for Indonesian RS context (pure)
**Khanza pattern (R2 calibration):** Schema in Bahasa Indonesia. ~900+ instances common patterns; >10K total Indonesian-language column occurrence footprint.

**SIMRS BT adoption guidance:**

1. **Primary schema in Bahasa Indonesia.** Column names: `tgl_lahir`, `nomor_rekam_medis`, `kode_dokter`, etc. ENUM values dalam Bahasa Indonesia. Table names dalam Bahasa Indonesia.
2. **Single naming convention** — avoid Khanza's 4-prefix epoch fragmentation (see §C.9 P9-B brief). Recommended: full Indonesian words (`kode_*` style, not abbreviated `kd_*`). Tooling-enforced via linter atau schema validation.
3. **English aliases via view layer for FHIR/international interop.** PostgreSQL views with English column names map to Indonesian-named base tables. External partners receive English-named API responses; internal operators see Indonesian schema.
4. **Bilingual documentation.** Schema docs, API docs, Blueprint sections accessible in both languages. Onboarding-friendly for international devs + regulatory-fidelity for Indonesian audit.

**Rationale:** BPJS + Kemenkes + Akreditasi mandates dan formularies use Indonesian. Schema fidelity reduces translation error in regulatory submission, billing audit, dan operator interaction. TNI AD context: Indonesian language fidelity strongly preferred (military medical operates in Indonesian).

**Cross-references:** Distinct from P9-B inversion (§C.9) — fidelity to Indonesian is good; epoch fragmentation across `no_*`/`kd_*`/`kode_*`/`id_*` is bad.

### A.6 P1-A — Pragmatic Configurability (Mixed: TIMELESS concept + REQUIRES-CONTEXT depth)

**Khanza pattern:** ~52 `set_*` configuration tables enabling per-RS customization without code changes; enabled 1500+ RS adoption.

**SIMRS BT adoption guidance:**

**Adopt the CONCEPT** of runtime configurability — calibrate the DEPTH:

- ✅ **Per-RS configuration table (`pengaturan_rs` atau similar)** holding parameters that genuinely vary per RS deployment (clinic hours, BPJS connection params, RS info, surat keterangan templates)
- ✅ **Feature toggles for staged rollout** — boolean flags controlling beta features per RS
- ⚠️ **Calibrate depth aggressively.** Khanza's 52 config tables were optimized untuk 1500+ heterogeneous RS adoption. SIMRS BT initially serves 1 RS dengan multi-RS expansion (G5 vision) — proportional config, bukan maksimum
- ❌ **Avoid config-for-config's-sake.** Per Owner direction carry-over ("too much config = rope to hang oneself"). Configuration adds operational complexity; only configure what genuinely varies between deployments.

**Suggested:** ~10-15 configuration tables initially; expand only when genuine per-RS variation surface.

**Cross-references:** Supports multi-tenant readiness (Chain 3 inversion via §E.6) — config per `rs_id` from day one.

### A.7 P2-A — Encounter-as-Pivot (Mixed TIMELESS — operational anchor)

**Khanza pattern:** Single physical table (`reg_periksa`) serves as operational hub with 350 FK references — most-referenced table in 1156-table schema.

**SIMRS BT adoption guidance:**

Same conceptual framing as P3-D (§A.3); P2-A is operational manifestation.

**Pattern:**
- Encounter table = highest-FK-density table in schema (target ~60-80% of clinical detail tables FK to it)
- Hub-and-spoke topology around encounter
- Modernization vs Khanza:
  - UUID PK (vs Khanza's `no_rawat` composite semantic key)
  - Separate `nomor_kunjungan` column for operator-facing semantic ID
  - `created_at` + `updated_at` + `updated_by` (Chain 2 inversion built-in)
  - `rs_id` FK (Chain 3 inversion built-in)

This single architectural decision compounds — solves operator UX (semantic ID), refactor safety (UUID), audit (timestamps), and multi-tenancy (rs_id) simultaneously.

**Cross-references:** P3-D framing (§A.3); P6-A dual-spine manifestation (§A.9).

### A.8 P5-A — Conway's Law Alignment (Mixed TIMELESS)

**Khanza pattern:** Module boundaries reflect organizational team boundaries (apotek/lab/radiologi/farmasi/keuangan modules align with RS departmental structure).

**SIMRS BT adoption guidance:**

**Adopt principle** (universal architectural wisdom) — **modernize manifestation**:

1. **Map SIMRS BT module structure to TNI AD military medical organizational structure.** Module boundaries reflect Karumkit departmental authority (Yanmasum, Yanmed, etc.).
2. **TypeScript monorepo workspaces per domain** — `@simrs-bt/clinical-encounter`, `@simrs-bt/clinical-pharmacy`, `@simrs-bt/clinical-lab`, `@simrs-bt/financial-billing`, `@simrs-bt/financial-accounting`, `@simrs-bt/admin-rbac`, etc.
3. **Avoid Khanza's anti-form** — naming-convention-as-boundary (P5-B). Use formal package boundaries with explicit interface contracts.
4. **Conway-aware refactoring:** when org structure changes, refactor module boundaries; when adding department, add module.

**Cross-references:** Contrasts with P5-B anti (§C.9 brief); supports §E.9 (Service Layer Architecture).

### A.9 P6-A — Dual-Spine Architecture ⭐ (Mixed TIMELESS — Direct Operational Manifestation)

**Tag:** `[TIMELESS]` (mixed) ⭐
**Khanza pattern:** Two parallel spines structure entire system — clinical spine (`reg_periksa` 350 FK) + financial spine (`rekening` 301 FK). Together ~32% of all 2032 FKs route through these hubs.

**SIMRS BT adoption guidance:**

Direct adoption — **foundation architecture decision**:

1. **Two parallel anchor tables:**
   - **Clinical spine:** `clinical.kunjungan` (encounter) — target highest-FK density in clinical schema
   - **Financial spine:** `financial.akun` atau `financial.rekening` (chart of accounts) — target highest-FK density in financial schema
2. **Each spine = convergence hub for its domain:**
   - Clinical detail tables FK to `kunjungan.id`
   - Financial transactions FK to `akun.id`
   - Cross-pillar bridges via explicit foreign keys (e.g., `financial.tagihan.kunjungan_id`)
3. **Modernized vs Khanza:**
   - UUID PKs (refactor-safe)
   - Universal audit columns (Chain 2 inversion built-in)
   - `rs_id` FK on both (Chain 3 inversion built-in)
   - RLS policies per spine (pillar-aware authorization)
4. **TNI AD audit pathway mapping:**
   - **Clinical spine** → Itjenad audit queries (clinical record forensics, treatment compliance)
   - **Financial spine** → BPK audit queries (revenue/expense, claim integrity, BPJS settlements)
   - Clear separation prevents audit-of-audit confusion; auditors operate within their authority

**Rationale:** Universal correctness (hospital is genuinely dual-pillar) + maps to TNI AD audit organizational structure. Highest-value structural decision in SIMRS BT design.

**Cross-references:** Chain 4 core (CAUSAL-CHAINS §4); operationalizes P1-B (§A.1) + P3-D (§A.3); supports §E.1 (Audit Trail) + §E.6 (Multi-Tenant) implementation.

### A.10 P5-C — Lifecycle-Isolation via Process (ADOPT-AS-CONCEPT)

**Tag:** `[ADOPT-AS-CONCEPT]`
**Khanza pattern:** Separate development lifecycles isolated via 14 separate sub-projects (KhanzaHMS satellites).

**SIMRS BT adoption guidance:**

**Adopt the principle** (independent release lifecycles per module) — **modernize manifestation**:

1. **Monorepo + per-package versioning** as primary pattern. Modules can release independently while sharing infrastructure.
2. **Separate microservices** reserved for genuinely-independent lifecycles (e.g., external integration adapters, batch jobs, reporting service).
3. **Avoid Khanza's 14-sub-project sprawl** — balance autonomy against maintenance cost. Recommended: 5-8 top-level packages dengan clear ownership.
4. **CI/CD per-package release pipelines.** Independent versioning + dependency graphs.

**Cross-references:** Supports P5-A Conway alignment (§A.8); see §E.9 (Service Layer Architecture).

### A.11 P6-D — Application-Centric Coordination Logic (ADOPT-AS-CONCEPT)

**Tag:** `[ADOPT-AS-CONCEPT]`
**Khanza pattern:** Cross-module coordination logic lives in application code (Java client), not in DB triggers/procedures. DB is passive storage. Verified: 0 stored procedures, 0 triggers, 0 functions, 0 views.

**SIMRS BT adoption guidance:**

**Adopt the philosophy** (app-layer coordination) — **modernize implementation**:

1. **Service layer hosts coordination logic.** TypeScript services orchestrate multi-module workflows (e.g., complete-encounter triggers billing computation + inventory update + report queue).
2. **Edge Functions for serverless coordination.** Supabase Edge Functions for event-driven workflows (e.g., BPJS submission, document generation).
3. **AUDIT TRIGGER EXCEPTION** — DB triggers acceptable for audit trail population (see §E.1). This is the single allowed exception to DB-passive philosophy.
4. **Materialized views for read-heavy aggregations** (e.g., daily encounter summary). Read-only views OK; business logic stays in app.

**Cross-references:** P7-B philosophy (§A.12); supports §E.9 (Service Layer Architecture).

### A.12 P7-B — Application-Centric Logic, Database-Passive (ADOPT-AS-CONCEPT)

**Tag:** `[ADOPT-AS-CONCEPT]`
**Khanza pattern:** Database deliberately passive — pure storage, no business logic. Verified: 0 procedures/triggers/functions/views.

**SIMRS BT adoption guidance:**

**Adopt philosophy** — DB as durable storage layer; business logic in app layer where it's testable, version-controllable, portable.

**Modernize via:**
- TypeScript service layer for business logic (testable, type-safe)
- Edge Functions for serverless execution (Supabase)
- App-level transactions wrapping multi-step workflows (Chain 2 inversion — §E.3)
- Materialized views for read aggregations (DB does data shaping, not logic)
- **Allowed exceptions:** Audit trail triggers (§E.1); referential integrity constraints (FK ON DELETE rules)

**Avoid:**
- Business logic in stored procedures (testability tax)
- Cross-table consistency via triggers (use service layer + transactions)
- Computed columns hiding business rules (use service layer + materialized views)

**Cross-references:** P6-D coordination (§A.11); the audit trigger exception is well-bounded in §E.1.

---

## 2. Section B — Calibrate (REQUIRES-CONTEXT Primitives)

This section covers primitives whose correctness depends on scale, era, deployment model, atau operator characteristics. SIMRS BT should **calibrate** these per its context — neither adopt verbatim nor invert wholesale.

### B.1 P1-D — Accretion Over Refactoring

**Khanza pattern (R8 evidence):** Schema grew organically 2011-2026 (15-year active) + future-dated reference data 2040 (14-year forward) = 29-year envisioned lifespan. Refactor cost prohibitive across 1500+ deployments.

**SIMRS BT calibration:**
- ✅ **Adopt accretion bias for stable patterns** — once a domain pattern matures, don't refactor cosmetically
- 🔄 **Refactor aggressively for emerging patterns** — cloud + monorepo + CI/CD enables refactor without coordinated downtime
- 🎯 **Net guidance:** First 2-3 years (early SIMRS BT) → refactor freely; year 3+ (matured patterns) → accretion bias

### B.2 P2-B — Identifier-as-Domain-Value

**Khanza pattern:** Primary keys carry domain semantics (`no_rawat` encodes date + sequence + clinic; `no_rkm_medis` encodes patient origin).

**SIMRS BT calibration:**
- **Hybrid recommended:** UUID PK (refactor-safe, system integrity) + semantic ID column for operator UX
- Operators reference semantic ID verbally and on paper; system internals use UUID
- Examples: `kunjungan.id` (UUID PK) + `kunjungan.nomor_kunjungan` (semantic, e.g., `RJ-20260513-001`)
- Indexed semantic ID column; UI displays semantic, queries by UUID

### B.3 P2-D — Pragmatic Schema Polymorphism

**Khanza pattern:** Schema selectively denormalizes for performance — same conceptual data appears in multiple forms (normalized + flat) per query patterns.

**SIMRS BT calibration:**
- PostgreSQL materialized views + indexed views provide modern alternative to denormalization
- Use materialized views for read-heavy aggregations (dashboard summaries, BPJS submission)
- Reserve actual denormalization for genuinely performance-critical hot paths
- Case-by-case decision; default to normalized + materialized view for new aggregates

### B.4 P3-C — Master/Operational Distinction

**Khanza pattern:** Tables distinguish master data (slow-changing reference) vs operational data (fast-moving transactions) implicitly via naming and usage, not formally.

**SIMRS BT calibration:**
- **Formalize via PostgreSQL schemas:** `master.*` schema for reference data; `operational.*` (atau `clinical.*` + `financial.*`) for transactions; `audit.*` for forensic
- Master schema: low-write, high-read, RLS read-everyone
- Operational schema: high-write, RLS per-tenant + per-role
- This formalization also supports Chain 3 inversion (multi-tenant)

### B.5 P4-B — Satellite Integration Apps (R5 — Three Tiers)

**Khanza pattern (R5 refinement):** Three integration tiers:
1. Embedded HTTP-client integration (191 imports in main app `src/bridging/` 261 files)
2. Separate KhanzaHMS satellite sub-projects (14 satellites)
3. Shared-schema integration via direct DB reads/writes

**SIMRS BT calibration:**
- **Modernize all three tiers:** API-first design
- Embedded HTTP client → typed API client per external partner (BPJS, ApotekNet, Satusehat)
- Satellite sub-projects → either monorepo packages atau separate microservices (P5-C calibration)
- Shared-schema → **eliminate** (replace with explicit API contracts + RLS — Chain 3 inversion)
- Adapter pattern (anti-corruption layer) per external integration

### B.6 P5-D — Workflow-Realistic Coupling

**Khanza pattern:** Modules tightly coupled where workflow naturally requires it (apotek + farmasi); loosely coupled where workflow independent.

**SIMRS BT calibration:**
- Adopt principle — module coupling should mirror actual workflow dependencies
- Tight coupling acceptable when workflow demands it (encounter completion ↔ billing computation)
- Loose coupling for genuinely independent flows (reporting, integration adapters)
- Per-RS workflow variation handled via service-layer orchestration, not schema coupling

### B.7 P5-E — Convention-Over-Enforcement (Partial Anti)

**Khanza pattern:** Inter-module integration relies on convention (column names, expected formats), not enforced contracts.

**SIMRS BT calibration:**
- **Lean toward enforcement** for new SIMRS BT codebase — TypeScript interfaces + runtime validators (Zod/io-ts) + FK constraints
- Conventions remain useful for cosmetic consistency (naming, file structure)
- Enforced contracts for cross-module data contracts (avoid Khanza's P5-E anti-form at scale)

### B.8 P6-E — Transient Billing (Choice 3 Corollary)

**Khanza pattern:** Billing tables (`nota_*`) function as thin marker tables — billing is bookkeeping artifact, not source-of-truth. Clinical data is canonical.

**SIMRS BT calibration:**
- Adopt the philosophy (clinical canonical; billing derived) — see P3-D (§A.3) adoption
- **Modernize transience:** Billing has two layers:
  - **Computed layer:** Service-layer functions derive charges from clinical events (transient in compute sense)
  - **Snapshot layer:** Once billing finalized (claim submitted, payment recorded), snapshot becomes immutable per P1-C (§A.2) audit-grade tier
- This distinction matters for BPK audit: snapshot is forensic record; computation layer recomputable

### B.9 P7-C — Template-Based Operational Reporting

**Khanza pattern:** 1292 JasperReports templates (R5 verified) editable by ops/admin without dev cycle.

**SIMRS BT calibration:**
- **Adopt the principle** — ops-editable templates reduce dev bottleneck
- **Modernize toolchain:** 
  - Modern template engines (Carbone for PDF, React-PDF for in-app rendering)
  - Atau SQL-based reporting tools (Metabase, Looker, Apache Superset)
  - Atau hybrid: JasperReports compat layer + modern alternatives
- Indonesian RS reality: BPJS + Kemenkes + Akreditasi require many fixed-format reports — template approach validated
- Volume calibration: SIMRS BT will likely need 50-200 templates initially, not 1292 (Khanza accreted 15 years)

### B.10 P8-A — Hybrid Constraint+SELECT Validation

**Khanza pattern:** Uniqueness/existence validation hybrid — sometimes SELECT-before-INSERT (race-prone), sometimes DB constraints (race-safe).

**SIMRS BT calibration:**
- **Standardize on constraint-based validation** for race-safety
- UNIQUE constraints, EXCLUSION constraints (for time-range non-overlap), CHECK constraints for invariants
- SELECT-before-INSERT acceptable only for UX-friendly error messages (with constraint as ultimate guard)
- Modern ORMs (Prisma, Drizzle) make constraint-based validation ergonomic

### B.11 P8-B — Confirmation Dialog Liberal Use

**Khanza pattern:** Confirmation dialogs liberally inserted as user-intent verification mechanism.

**SIMRS BT calibration:**
- **Modern UX favors reversible actions + undo** over confirmation dialogs
- Reserve confirmation dialogs for **truly destructive irreversible operations** (final claim submission, encounter closure with no reopen path, medication administration confirmation)
- Use undo/soft-delete pattern (P1-C tier mapping) for most "destructive" operations — reversibility reduces dialog fatigue
- TNI AD military medical context: confirmation appropriate for critical clinical actions (medication, intervention)

### B.12 P9-A — Bridging as Heterogeneity Sink

**Khanza pattern:** 261 files in `src/bridging/` quarantine external system heterogeneity.

**SIMRS BT calibration:**
- **Adopt principle** — anti-corruption layer pattern (DDD term) absorbs external system quirks
- Per-external-partner adapter modules: `@simrs-bt/integration-bpjs`, `@simrs-bt/integration-satusehat`, etc.
- Adapter contract: external API → SIMRS BT canonical types (and vice versa)
- Main app touches only canonical types; adapter handles external schema/quirks
- Modernize: typed API clients (OpenAPI codegen where possible) + integration tests

### B.13 P9-C — Implicit Staging (R7 — 22 temporary_* tables)

**Khanza pattern (R7 evidence):** 22 `temporary_*` prefix tables + status flags for batch operations and migrations.

**SIMRS BT calibration:**
- **Modernize staging patterns:**
  - Formal staging schemas (`staging.*` PostgreSQL schema) for batch imports
  - CDC streams atau event sourcing for real-time data flows
  - Job tables with explicit lifecycle states (queue → processing → complete → failed)
- Avoid `temporary_*` prefix sprawl — formalize lifecycle in schema design

### B.14 P-NEW-1 — Form-as-Table Persistence (N1 — Phase 3a Discovery)

**Khanza pattern (N1 evidence):** ~214 tables (18.5% schema) dedicated to clinical assessment forms — `penilaian_*` 85, `surat_*` 51, `skrining_*` 34, `hasil_*` 28, `template_*` 16. Each regulatory form gets dedicated schema table.

**SIMRS BT calibration — MAJOR ARCHITECTURAL DECISION:**

This is the single most consequential calibration choice. Three approaches:

| Approach | Pros | Cons | When |
|---|---|---|---|
| **Form-as-Table** (Khanza-style) | Structural fidelity, type safety, query-friendly, JasperReports binds easily | Schema bloat, migration overhead per form change | Critical regulatory forms with fixed structure |
| **Generic form-builder + answers** (JSONB) | Flexible, no migrations, rapid iteration | Loose typing, query overhead, reporting harder | Exploratory/optional forms with frequent change |
| **Hybrid (RECOMMENDED)** | Best of both | Higher design upfront | Default for SIMRS BT |

**Hybrid recommendation:**

1. **Critical regulatory forms → Form-as-Table** (BPJS-mandated, Kemenkes-required, Akreditasi-spec'd):
   - Examples: `clinical.penilaian_awal_keperawatan`, `clinical.skrining_jatuh`, `clinical.surat_kontrol`
   - Each as dedicated table with typed columns matching regulatory specification
   - JasperReports/Carbone templates bind to fixed columns
2. **Exploratory/optional forms → JSONB-based form builder:**
   - User-defined questionnaires, internal-use audits, draft templates
   - Generic schema: `dynamic_forms` table + `dynamic_form_responses` JSONB
3. **Migration path between tiers:** when exploratory form matures into regulatory artifact, schema migration promotes JSONB → typed table

**Volume estimate:** SIMRS BT likely needs ~30-60 typed regulatory form tables initially (vs Khanza's 214 accreted over 15 years).

**Rationale:** Indonesian RS context (numerous structurally-specific regulatory forms) makes form fidelity essential; pure JSONB approach inadequate for BPK/Akreditasi audit. Hybrid captures regulatory rigor where required + flexibility where appropriate.

---

## 3. Section C — Invert (Anti-Primitives Critical + High)

Per Owner-approved Section C scoping (per Phase 2 Closeout §6.1 strategic emphasis): **8 elevated anti-primitives** (5 Critical + 3 High elevated) receive full architectural treatment; **4 remaining** (P9-B, P10-B, P5-B, P10-C) covered briefly with cross-reference to fuller treatment elsewhere (§E pattern detail, §F sequencing).

### Critical Tier (🔴) — Must Invert; Existential Risk

#### C.1 P7-E — Audit Trail Absent at Schema Level 🔴 (TOP SEVERITY)

**Khanza pattern (R6 evidence):**
- 0 universal audit columns (`created_at`/`updated_at`/`*_at`) across 1156 tables
- 17 scoped PPI compliance audit tables exist — audit-table design capability demonstrated; universal absence is design CHOICE, not capability gap

**Khanza-rational context:**
- 2010-era LAN deployment + trained operators + paper compliance trail
- Universal audit would add 2-3× storage + write latency on LAN deployment
- Compliance audit handled via paper (BPK/Akreditasi traditional inspectors check paper records)
- Operational throughput prioritized over forensic queryability

**SIMRS BT TNI AD context (why this becomes Critical):**
- BPK + Itjenad digital audit framework cannot operate without schema-level forensic reconstruction
- Modern healthcare compliance (Akreditasi current standards) requires audit trail
- Military medical context requires integrity attestation for legal/disciplinary cases
- Multi-RS coordination requires cross-RS audit trail visibility

**Inversion pattern (mandatory):**

1. **Universal audit columns on every operational table:**
   - `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
   - `created_by UUID NOT NULL REFERENCES users(id)`
   - `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`
   - `updated_by UUID NOT NULL REFERENCES users(id)`
   - `deleted_at TIMESTAMPTZ NULL` (soft delete per P1-C tier)
   - `deleted_by UUID NULL REFERENCES users(id)`
2. **Trigger-based audit population** (sole exception to DB-passive philosophy P7-B):
   - PostgreSQL `BEFORE INSERT/UPDATE` triggers populate timestamps + user from session context
   - Session context: `current_setting('app.current_user_id')` set per request
3. **Audit log table for high-stakes operations:**
   - `audit.audit_log` table — captures (table_name, row_id, operation, old_values JSONB, new_values JSONB, user_id, timestamp)
   - Trigger-based population on tables flagged audit-grade
   - Append-only; no UPDATE or DELETE on audit log
4. **Immutable snapshot tables for terminal states** (P1-C audit-grade tier):
   - When encounter closes / billing finalizes / claim submits → snapshot to immutable table
   - Append-only; no update path
5. **Audit query API:** service-layer functions exposing "what was state of X at time T" + "who changed X when" for auditor consumption

**Cascade benefit:** P7-E inversion is **Chain 2 head** — implementing audit infrastructure enables P4-D inversion (version columns become queryable conflict context) and P6-B inversion (transactions become naturally implementable atop audit log).

**Cross-references:** Chain 2 (CAUSAL-CHAINS §2); §E.1 (Mandatory Audit Trail) — pattern formalization for Blueprint.

#### C.2 P4-D — Silent Last-Write-Wins 🔴

**Khanza pattern:** No version columns, no optimistic locking, no row-level versioning across 1156 tables. Concurrent edits silently lose all but last writer's data.

**Khanza-rational context:**
- LAN single-RS with trained operators in shared physical workspace
- Operators verbally coordinate ("aku lagi edit pasien Pak Budi" — verbal handoff sufficient)
- Concurrent collisions rare in practice for that operating model

**SIMRS BT TNI AD context:**
- Multi-shift military medical: shift handover transitions create concurrent edit windows
- Multi-facility (G5 Karumkit network): no verbal coordination possible
- Web client: operators may have stale page state from minutes/hours ago
- Silent loss of medical record edit = **unrecoverable patient safety incident**

**Inversion pattern:**

1. **Optimistic locking via version column** on every operational table:
   - `version BIGINT NOT NULL DEFAULT 1`
   - Service layer: UPDATE WHERE `id = ? AND version = ?` — if zero rows affected, conflict
2. **Conflict detection UI:** when conflict detected, present operator with three options:
   - **Reload** (discard local edits, fetch latest)
   - **Override** (force write; logs conflict event with audit trail showing other operator's lost changes)
   - **Merge** (field-level merge UI for complex conflicts)
3. **Conflict event audit:** every override logged with audit trail (per §C.1 audit infrastructure); facilitates post-hoc forensic review
4. **Real-time presence indicators** (optional UX enhancement): show other operator viewing/editing same record (Supabase Realtime presence)

**Implementation dependency:** Requires §C.1 (audit infrastructure) for conflict event logging.

**Cross-references:** Chain 2 (CAUSAL-CHAINS §2); §E.2 (Concurrency Control Pattern).

#### C.3 P6-B — Eventual Consistency via Human Reconciliation 🔴

**Khanza pattern (H6.2 evidence):** 1 `setAutoCommit` + 1 `commit` + 1 `rollback` across 1627 Java files = <0.1% transaction discipline. Cross-module operations rely on operator reconciliation when partial-state occurs.

**Khanza-rational context:**
- Paper-era hospital workflow norms: operators reconcile discrepancies as they notice
- Operator-mediated reconciliation matches Khanza's trust-and-speed philosophy (P1-E)
- LAN deployment + low transaction volume = partial-state rare

**SIMRS BT TNI AD context:**
- Higher transaction volume (cloud-scale, multi-RS)
- Web client + network: partial failures (network drop mid-workflow) more common
- Military operational audit cannot tolerate silent inconsistency
- BPK audit specifically tests for billing-clinical reconciliation; manual workaround inadequate

**Inversion pattern:**

1. **Transactional discipline as architectural requirement:**
   - Multi-step workflows wrapped in SQL transactions (SERIALIZABLE isolation for clinical-financial coordination)
   - Service layer functions are transaction units: enter with `BEGIN`, exit with `COMMIT`/`ROLLBACK`
2. **Saga pattern for cross-service operations:**
   - When transaction crosses service boundaries (e.g., BPJS claim submission with multiple async steps), use saga pattern with compensating actions
   - Each step explicitly defines rollback action
3. **Idempotency keys for retry safety:**
   - External API calls (BPJS, payment gateway) use idempotency keys
   - Retries safe from partial-state amplification
4. **Reconciliation jobs as belt-and-suspenders** (not primary mechanism):
   - Nightly reconciliation jobs detect any residual inconsistency
   - Alert (not silent fix) — operator review required
   - Audit log records reconciliation events

**Implementation dependency:** Requires §C.1 (audit) for reconciliation event logging; benefits from §C.2 (concurrency) for conflict resolution.

**Cross-references:** Chain 2 (CAUSAL-CHAINS §2); §E.3 (Transaction Discipline).

#### C.4 P7-D — String-Concat SQL Search 🔴 (R9 Critical Retention)

**Khanza pattern (R9 — L025/L026 evidence):**
- 1034 Java files use LIKE keyword (case-insensitive)
- 937 files use parameterized `LIKE ?` (safe)
- **346 files have unsafe `LIKE '%"+var+"%'` concat patterns** (substantial real exposure)
- Predecessor cross-review initially recommended downgrade to High; Phase 3a rigorous re-verification revealed 346 unsafe sites — more Critical-justified than either initial position indicated
- Owner-approved Critical retention (L026)

**Khanza-rational context:**
- Trusted-operator LAN deployment = SQL injection threat model low
- Pattern present but not exercised by adversarial inputs in field deployment

**SIMRS BT TNI AD context:**
- Cloud + external integration + multi-tenant = adversarial input vector present
- Web client exposes search forms to broader attack surface
- 346 unsafe sites would translate to substantial exploit surface if pattern replicated
- TNI AD security posture: defense-in-depth mandatory

**Inversion pattern:**

1. **Parameterized queries mandatory throughout:**
   - ORM-mediated queries (Prisma, Drizzle) prevent this class by default
   - Raw SQL paths: parameter binding only (`$1`, `$2`, never concat)
2. **Full-text search via PostgreSQL `tsvector`:**
   - For complex search (medical record search across multiple fields), use `tsvector` + `tsquery`
   - Indexed full-text search; safe by construction
3. **Input sanitization layer** (validation library — §E.8):
   - Whitelist allowed characters per field type
   - Reject SQL metacharacters in semantic identifier fields
4. **Static analysis CI gate:**
   - ESLint rules (e.g., `no-template-curly-in-string` for SQL contexts)
   - SQL injection static scanning (e.g., Semgrep rules)
   - Block PR merge on detected concat patterns
5. **Penetration testing in CI/CD:**
   - SQL injection regression tests against search endpoints
   - OWASP ZAP / sqlmap automated scanning

**Cross-references:** §E.4 (SQL Injection Mitigation) — pattern formalization.

#### C.5 P8-D — Error Capture Absent 🔴 (Owner-Escalated)

**Khanza pattern:** 0 error_log / 0 exception_log / 0 audit_log universal tables. Application errors invisible to schema-level observation. Operator-facing errors via Swing dialog popups; back-end errors via Java console (not persisted).

**Khanza-rational context:**
- Operator immediate-feedback model: error popup, operator retries
- Back-end errors → Java console logs on operator workstation (transient)
- For trained operators in shared workspace, error context easily reconstructible verbally

**SIMRS BT TNI AD context:**
- Invisible system errors = military medical operational liability
- Cannot retrospect on failures (silent corruption potential)
- Cannot alert proactively (system degradation goes unnoticed)
- Multi-RS distributed errors require centralized observation

**Inversion pattern:**

1. **Centralized error tracking infrastructure:**
   - Sentry (atau equivalent: Bugsnag, Rollbar) for application error capture
   - Captures stack trace, user context, request context, environment
2. **Schema-level error log table:**
   - `audit.system_errors` — captures application-level error events with context
   - Append-only; long retention for audit forensics
3. **Structured logging throughout:**
   - JSON-structured logs with correlation IDs (per request, per workflow)
   - Log levels: DEBUG, INFO, WARN, ERROR, FATAL
   - Centralized log aggregation (Supabase log_events, atau external)
4. **Alerting for critical errors:**
   - Real-time alerts for error patterns (rate spike, new error class)
   - On-call rotation with paging (military operational tempo)
5. **User-friendly error UX:**
   - End-user sees friendly message + error reference ID
   - Engineer can look up error reference in Sentry/log aggregator
   - No raw stack traces to operators

**Cross-references:** §E.5 (Error Tracking Infrastructure).

### High Tier (🟠) — Elevated 3 (Per Owner Strategic Emphasis)

#### C.6 P4-C — UI-as-Orchestrator (No Service Layer) 🟠

**Khanza pattern:** Swing event handlers (Dialog classes) become orchestrators — receive user input, validate, build SQL, execute, handle results. No intermediate service layer.

**Khanza-rational context:**
- Fat-client + LAN architecture (P4-A) precludes service layer naturally
- Module teams developed Dialog classes independently — simpler coordination model
- For 2010-era Java without modern service-layer ergonomics, this was sound

**SIMRS BT context:**
- Web + API architecture creates layers by definition
- Business logic must live somewhere; UI is wrong place (untestable, duplication-prone)
- Multi-client future (mobile, desktop, integration partners) requires shared service layer

**Inversion pattern:**

1. **Service layer as first-class architectural tier:**
   - TypeScript service classes/functions: `EncounterService`, `BillingService`, `PrescriptionService`
   - Pure business logic — no UI dependency, no DB driver dependency
   - Composable via dependency injection (atau function composition)
2. **UI as thin orchestrator of API calls:**
   - React components call service-layer-exposed API endpoints
   - Form submission → API call → service function → DB
   - UI logic: presentation, input collection, optimistic updates
3. **API layer between UI and service:**
   - REST atau tRPC atau GraphQL — typed contracts
   - API endpoints thin: validation + auth + service function call
4. **Service layer testability:**
   - Unit tests on service functions (mocked DB)
   - Integration tests on service+DB
   - No UI in test loop for business logic verification

**Cascade benefit:** P4-C inversion is **Chain 1 head** — implementing service layer enables P7-A inversion (validation library has home) and P3-B inversion (state machines can be TypeScript code with central registry).

**Cross-references:** Chain 1 (CAUSAL-CHAINS §1); §E.9 (Service Layer Architecture).

#### C.7 P7-A — Per-Form Inline Validation 🟠

**Khanza pattern:** Validation logic duplicated across Swing dialogs (~76 DlgCari + numerous DlgIsi/DlgEdit). Each form implements validation inline.

**Khanza-rational context:**
- Java pre-Bean-Validation era; per-form duplication acceptable cost for module independence
- Each module team owned their validation; coordination overhead minimal
- Validation rules tightly tied to form UX — co-location made sense

**SIMRS BT context:**
- Modern stack (Zod, Yup, Bean Validation) makes centralized validation ergonomic
- Multi-client future requires validation on server (cannot trust client-side only)
- Validation rule drift across forms = data quality erosion

**Inversion pattern:**

1. **Centralized validation library:**
   - Pure helper validators in shared module (e.g., `@simrs-bt/validators`)
   - Per-domain validators: `patientValidators`, `prescriptionValidators`, `billingValidators`
   - TypeScript types derived from validator schemas (Zod's `infer` pattern atau equivalent)
2. **Validation at multiple layers, single source of truth:**
   - Same validator runs on UI (instant feedback) + API (defense-in-depth) + service layer (business rule enforcement)
   - DB constraints as final guard
3. **Composable validators:**
   - Combine atomic validators (required, isUUID, isNomorRekamMedis, etc.) into form validators
   - Reuse across forms via composition
4. **Error message localization:**
   - Indonesian error messages by default
   - Field-level error attribution for UX

**Implementation dependency:** Requires §C.6 (service layer) for validation library hosting; SIKESUMA C1-C12 pattern as conceptual reference (Owner has reference architecture for this pattern).

**Cross-references:** Chain 1 (CAUSAL-CHAINS §1); §E.8 (Centralized Validation Library).

#### C.8 P7-F — Authorization-as-Boolean-Matrix 🟠 (1198 cols)

**Khanza pattern:** Authorization implemented as 1198-column boolean matrix on `user` table — one column per feature flag (`can_access_apotek_obat`, `can_view_keuangan`, etc.).

**Khanza-rational context:**
- Boolean matrix simpler than RBAC for fixed feature set
- Admin-friendly: feature flags directly visible per user; admin checkbox UI matches schema
- For single-RS with stable feature set, this was sound engineering
- 1198 columns accreted over 15 years as features added

**SIMRS BT context:**
- Multi-tenant requires role abstraction (each tenant doesn't replicate 1198-column user table)
- Feature additions shouldn't require schema migration on user table
- TNI AD military hierarchy maps naturally to roles, not feature flags
- Audit requirement: who has what permission, when granted, by whom — requires role abstraction

**Inversion pattern:**

1. **RBAC abstraction with 4 core tables:**
   - `auth.roles` — role definitions (e.g., "dokter_umum", "perawat_rawat_inap", "admin_keuangan", "kepala_yanmed")
   - `auth.permissions` — atomic permission definitions (e.g., "encounter.create", "billing.finalize", "audit.view")
   - `auth.role_permissions` — many-to-many: roles to permissions
   - `auth.user_roles` — many-to-many: users to roles (with `rs_id` for multi-tenant)
2. **Permission check API:**
   - Service layer function: `hasPermission(userId, permission, context)` — returns boolean
   - Used in API endpoints + service functions + UI (conditional rendering)
3. **Permission grant audit:**
   - Audit log entries for grant/revoke operations
   - Effective-permission queries: "what permissions does user X have right now"
   - Historical-permission queries: "what permissions did user X have on date Y"
4. **Optional: scoped permissions for fine-grained control:**
   - Permission can be scoped to entity (e.g., "encounter.view scoped to own-patient-only")
   - Scope evaluator at service layer

**Cross-references:** §E.7 (RBAC Pattern); supports Chain 3 inversion (multi-tenant authorization).

### High Tier (🟠) — Brief 2 (Per Section C Scoping)

#### C.9 P9-B — Epoch-Stratified Naming (4 prefixes: R3) 🟠 — BRIEF

**Khanza pattern (R3 — L024):** 4 distinct prefix epochs verified: `no_*` (2539 occ, 92 distinct), `kd_*` (1535/74), `kode_*` (1120/79), `id_*` (263/35).

**SIMRS BT inversion (brief):** **Single naming convention enforced by tooling.** Recommended: `kode_*` full Indonesian word style (preserves Indonesian fidelity per P10-A § A.5). Linter rules + schema validation in CI/CD reject deviation. Onboarding cost reduced from learning 4 conventions to 1.

**Cross-references:** Resolved through P10-A adoption guidance (§A.5).

#### C.10 P10-B — Single-Tenant Schema Design 🟠 — BRIEF (BUT SEQUENCING-CRITICAL)

**Khanza pattern:** 0 `rs_id`/`tenant_id`/`klinik_id`/`hospital_id` across 1156 tables. Schema designed for one RS per deployment.

**SIMRS BT inversion (brief — full pattern detail in §E.6):**

**Multi-tenant from day one.** `rs_id` FK on every operational table; PostgreSQL Row-Level Security (RLS) for tenant isolation. Even if SIMRS BT initially serves one RS, schema readiness for multi-RS expansion (G5 Karumkit vision) avoids order-of-magnitude harder retrofit later.

**Note:** Although Section C treatment is brief, this is **sequencing priority #2** per §F. Full pattern formalization in §E.6 (Multi-Tenant Schema Patterns).

**Cross-references:** Chain 3 (CAUSAL-CHAINS §3); §E.6; §F sequencing #2.

### Nuanced Tier (🟡) — Brief 2

#### C.11 P5-B — Naming-Convention-as-Boundary 🟡 — BRIEF

**Khanza pattern:** Module boundaries enforced via column/table naming conventions (`apotek_*`, `radiologi_*`, etc.), not via schemas, packages, or DB-level access control.

**SIMRS BT inversion (brief):** **Formal package + schema boundaries.** PostgreSQL schemas per module domain (or per pillar — see §A.1). TypeScript monorepo packages with explicit `package.json` dependencies (per §A.8 P5-A Conway alignment). Linter rules prevent cross-package imports without explicit dependency declaration.

**Severity rationale (Nuanced):** Harm gradual not acute; workable in small teams. Becomes problematic at scale.

**Cross-references:** §A.8 (P5-A adoption); §E.9 (Service Layer).

#### C.12 P10-C — Per-Table Manual Restore Dialogs 🟡 — BRIEF

**Khanza pattern:** Restore functionality implemented as per-table dialogs (`DlgRestore*` classes), admin-driven.

**SIMRS BT inversion (brief):** **PostgreSQL Point-In-Time Recovery (PITR)** for catastrophic restore scenarios (Supabase native). **Soft-delete with retention windows** (per P1-C tier — §A.2) for routine "undelete" needs. **Audit log replay** for forensic state reconstruction. Eliminates need for per-table restore dialogs entirely.

**Severity rationale (Nuanced):** Admin-controlled restore acceptable small-RS; insufficient for modern standards.

**Cross-references:** §A.2 (P1-C deletion policy); §E.1 (audit trail enables audit log replay).

---

## 4. Section D — 3 Deep Theoretical Choices Application

Per CAUSAL-CHAINS §5, architectural decisions cluster around theoretical choices. SIMRS BT's task isn't "invert N anti-primitives individually" — it's **make different theoretical choices that propagate to better operational manifestations**.

### D.1 Deep Choice 1 — Time Model

| Aspect | Khanza Choice | SIMRS BT Choice |
|---|---|---|
| **Theoretical statement** | Snapshot-only: time is now; history not queryable | **Queryable time dimension: time is a queryable axis** |
| **Core primitive** | P3-A (Snapshot-Only State Model) | Universal audit infrastructure + immutable snapshots |
| **Operational cluster** | P7-E + P4-D + P6-B + P2-C + P3-E | §E.1 + §E.2 + §E.3 + selective permanence (§A.2) |
| **SIMRS BT propagation** | — | Audit columns universal → version columns viable → transactions naturally implementable → forensic queries serve BPK/Itjenad → snapshot tables for terminal states |

**Practical translation:** When SIMRS BT designer faces "should this need audit?" the answer is **yes by default** — flip Khanza's implicit-no to explicit-yes. Decision propagates: forces selective permanence (P1-C), enables concurrency control (P4-D inversion), supports transactional discipline (P6-B inversion).

### D.2 Deep Choice 2 — Definition Locality

| Aspect | Khanza Choice | SIMRS BT Choice |
|---|---|---|
| **Theoretical statement** | Distributed implicit: definitions live where used; no central registry | **Centralized explicit: definitions in TypeScript code; central registry** |
| **Core primitive** | P3-B (Distributed Implicit State Machines) | TypeScript state machines + validation library + RBAC |
| **Operational cluster** | P7-A + P5-B + P5-E + P7-F + P9-B | §E.7 + §E.8 + formal package boundaries (§A.8) |
| **SIMRS BT propagation** | — | State machines as TS code → testable + cross-module consistent → validation library has home → RBAC role abstraction → naming convention enforceable |

**Practical translation:** When SIMRS BT designer faces "where should this rule live?" the answer is **single source of truth in service layer**. Decision propagates: forces service layer existence (P4-C inversion via §C.6), enables centralized validation (P7-A inversion via §C.7), supports RBAC (P7-F inversion via §C.8).

### D.3 Deep Choice 3 — Convergence Model (POSITIVE — ADOPT)

| Aspect | Khanza Choice | SIMRS BT Choice |
|---|---|---|
| **Theoretical statement** | Encounter-as-convergence: encounter is reality; billing is bookkeeping | ✅ **ADOPT verbatim** |
| **Core primitive** | P3-D ⭐ | P3-D (same) |
| **Operational cluster** | P2-A + P6-A + P6-E | Same — adopt directly with modernization |
| **SIMRS BT propagation** | — | Encounter hub → clinical detail FK to encounter → billing derived → dual-spine architecture (P6-A) → TNI AD audit pathway separation |

**Practical translation:** When SIMRS BT designer faces "should this be authoritative or derived?" the answer follows clinical-primacy. Clinical record = source-of-truth; billing = computed view. This is Chain 4 (positive) and **highest-value learning** from Khanza.

### D.4 Three Choices Cumulative Propagation

The three choices are not independent — they compound:

```
Time: queryable          ─┐
                          ├─→ Service layer required (audit trigger needs context)
Definitions: centralized ─┘    ├─→ Validation library viable
                               ├─→ State machines testable
                               └─→ RBAC implementable
                          
Convergence: encounter ─→ Dual-spine ─→ Audit pathway separation
                                   └─→ Tenant boundary alignment
```

**Cascade implication:** Making the three Deep Choices well-aligned at architecture-design time costs far less than retrofitting later. This is why **Phase 3 Codex framing prioritizes Deep Choices over individual primitive inversions** — get the choices right, primitives follow.

---

## 5. Section E — Recommended Blueprint Sections

This section provides **9 pattern guidance items** untuk SIMRS BT Blueprint inclusion. Each item: cross-reference + rationale + suggested formalization wording + cross-chain implication.

**SIMRS BT spoke session may adapt formalization wording verbatim or with modifications appropriate to SIMRS BT specific naming conventions and design choices.**

### E.1 Mandatory Audit Trail Pattern

**Cross-reference:** P7-E (§C.1); Chain 2 head.

**Rationale:** Universal audit columns + audit log table enable BPK + Itjenad forensic queries. Required for TNI AD digital audit framework. Single most-important Chain 2 inversion.

**Suggested formalization wording (for SIMRS BT Blueprint):**

> *"Every operational table SHALL include the following audit columns: `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at` (nullable), `deleted_by` (nullable). The `audit.audit_log` table SHALL capture INSERT/UPDATE/DELETE events for audit-grade tables with old/new value JSONB snapshots. Audit log is append-only — no UPDATE or DELETE permissions. Audit population uses BEFORE INSERT/UPDATE triggers reading `current_setting('app.current_user_id')` from session context (single allowed exception to DB-passive architecture)."*

**Cross-chain implication:** Enables P4-D inversion (§E.2) — version conflict resolution requires audit context. Enables P6-B inversion (§E.3) — transactions become naturally testable atop audit. Foundation of Chain 2.

### E.2 Concurrency Control Pattern

**Cross-reference:** P4-D (§C.2); Chain 2.

**Rationale:** Web client + multi-shift + multi-RS deployment creates concurrent edit reality Khanza's LAN model avoided. Silent data loss unacceptable for medical records.

**Suggested formalization wording:**

> *"Every operational table SHALL include a `version BIGINT NOT NULL DEFAULT 1` column. All UPDATE operations from service layer MUST include `WHERE id = $1 AND version = $2` clause; zero affected rows indicates conflict. Conflict UI SHALL present three options: Reload (discard local edits), Override (force write with audit-logged conflict event), or Merge (field-level conflict resolution for complex cases). Override events SHALL be audit-logged with full before/after snapshots for forensic review."*

**Cross-chain implication:** Depends on §E.1 (audit infrastructure). Pairs with §E.3 (transactions) for atomic version-checked operations.

### E.3 Transaction Discipline Pattern

**Cross-reference:** P6-B (§C.3); Chain 2.

**Rationale:** Cross-module workflows require atomic guarantees. BPK audit specifically tests billing-clinical reconciliation; manual workarounds inadequate.

**Suggested formalization wording:**

> *"Multi-step workflows touching multiple tables SHALL be wrapped in SQL transactions with isolation level appropriate to the operation (SERIALIZABLE for clinical-financial coordination; READ COMMITTED for read-heavy workflows). Service-layer functions are transaction units — they enter with BEGIN, exit with COMMIT or ROLLBACK; never partial commit. Cross-service workflows (e.g., external API submission with multiple async steps) use saga pattern with explicit compensating actions per step. External API calls use idempotency keys for retry safety. Nightly reconciliation jobs detect residual inconsistency and ALERT (no silent fix); operator review required."*

**Cross-chain implication:** Built atop §E.1 + §E.2. Completes Chain 2 inversion.

### E.4 SQL Injection Mitigation Pattern

**Cross-reference:** P7-D (§C.4); R9/L026 Critical retention.

**Rationale:** 346 unsafe sites in Khanza demonstrate the pattern's prevalence; SIMRS BT cloud + external integration context = adversarial exposure.

**Suggested formalization wording:**

> *"Parameterized queries SHALL be mandatory throughout the codebase. ORM-mediated queries (Prisma, Drizzle, or equivalent) are the default; raw SQL paths require parameter binding only — string concatenation of variables into SQL is prohibited. Full-text search SHALL use PostgreSQL `tsvector`/`tsquery` (not LIKE concat). Input validation layer (§E.8) SHALL whitelist allowed characters per field type. CI/CD gate SHALL include static analysis (Semgrep rules or equivalent) blocking PR merge on detected concat patterns. Penetration testing (OWASP ZAP, sqlmap) SHALL run as automated regression in CI."*

**Cross-chain implication:** Independent of audit chain; depends on §E.8 (validation) for input sanitization layer.

### E.5 Error Tracking Infrastructure Pattern

**Cross-reference:** P8-D (§C.5); Owner-escalated.

**Rationale:** Invisible system errors = military medical operational liability. Cannot retrospect on failures; cannot alert proactively.

**Suggested formalization wording:**

> *"Application errors SHALL be captured to centralized error tracking infrastructure (Sentry or equivalent) including stack trace, user context, request context, and environment metadata. Schema-level `audit.system_errors` table SHALL persist error events with structured context for long-term audit retention. All log output SHALL be JSON-structured with correlation IDs traceable across request/workflow boundaries. Critical error patterns (rate spike, new error class) SHALL trigger real-time alerts to on-call rotation with paging appropriate to TNI AD operational tempo. End-user error display SHALL be user-friendly with reference ID; raw stack traces never exposed to operators."*

**Cross-chain implication:** Supports §E.1 (audit) by capturing application-layer failures audit log cannot reach. Independent infrastructure dimension.

### E.6 Multi-Tenant Schema Patterns ⭐ (Sequencing Priority #2)

**Cross-reference:** P10-B (§C.10); Chain 3 head.

**Rationale:** Multi-tenant retrofit from single-tenant is order-of-magnitude harder than multi-tenant from day one. G5 Karumkit network vision makes this architecturally critical.

**Suggested formalization wording:**

> *"Every operational table SHALL include `rs_id UUID NOT NULL REFERENCES rs(id)` column. Reference master tables (master.diagnosa_icd10, master.obat globally-shared catalogs) MAY exclude `rs_id` if genuinely cross-tenant; tenant-customized master data includes `rs_id`. PostgreSQL Row-Level Security (RLS) policies SHALL enforce tenant isolation: every operational table has RLS policy `(rs_id = current_setting('app.current_rs_id')::UUID)` for SELECT/UPDATE/DELETE. Cross-tenant queries require explicit elevated role with audit logging. Initial deployment MAY serve a single RS, but schema is structurally multi-tenant-ready from inception."*

**Cross-chain implication:** Foundation for Chain 3 inversion. Enables §E.7 (RBAC with tenant scoping). Schema-level decision; expensive to retrofit.

### E.7 RBAC Pattern

**Cross-reference:** P7-F (§C.8); Chain 3.

**Rationale:** Khanza's 1198-column boolean matrix doesn't scale to multi-tenant; feature additions shouldn't require user-table schema migration. TNI AD military hierarchy maps naturally to roles.

**Suggested formalization wording:**

> *"Authorization SHALL use 4-table RBAC abstraction: `auth.roles` (role definitions), `auth.permissions` (atomic permission definitions, dot-notation e.g. `encounter.create`), `auth.role_permissions` (M2M roles to permissions), `auth.user_roles` (M2M users to roles, with `rs_id` for tenant scope). Service layer SHALL expose `hasPermission(userId, permission, context)` check used at API endpoint guard + service function precondition + UI conditional rendering. Permission grant/revoke operations SHALL emit audit log entries enabling historical permission queries (`who had permission X at time T`). Scoped permissions (e.g., `encounter.view scoped to own-patient`) supported via scope evaluator at service layer."*

**Cross-chain implication:** Depends on §E.6 (tenant scoping). Replaces P7-F boolean matrix entirely.

### E.8 Centralized Validation Library Pattern

**Cross-reference:** P7-A (§C.7); Chain 1.

**Rationale:** Validation rule drift across forms erodes data quality. Modern stack makes centralized validation ergonomic. Validation must run on server (cannot trust client-side only).

**Suggested formalization wording:**

> *"Validation rules SHALL be defined in shared `@simrs-bt/validators` module as pure functions/schemas (Zod, Yup, or equivalent). TypeScript types SHALL be derived from validator schemas (single source of truth). The SAME validator SHALL run at three layers: (1) UI (instant feedback), (2) API endpoint (defense-in-depth), (3) service layer (business rule enforcement). DB constraints serve as final guard. Validators SHALL be composable — atomic validators (isUUID, isNomorRekamMedis, isKodeICD10) combine into form validators. Error messages SHALL be Indonesian by default with field-level attribution. Reference architectural pattern: pure validator helpers in dedicated module, called from service layer."*

**Cross-chain implication:** Depends on §E.9 (service layer) for hosting. Completes Chain 1 mid-stack inversion.

### E.9 Service Layer Architecture Pattern

**Cross-reference:** P4-C (§C.6); Chain 1 head.

**Rationale:** Logic must live somewhere; UI is wrong place (untestable, duplication-prone, multi-client-incompatible). Service layer is foundational architectural tier.

**Suggested formalization wording:**

> *"Business logic SHALL live in TypeScript service layer (e.g., `EncounterService`, `BillingService`, `PrescriptionService`) — pure business logic with no UI dependency and no direct DB driver coupling. Services SHALL be composable via dependency injection or function composition. UI components SHALL be thin orchestrators of API calls: form submission → API endpoint → service function → DB. API layer (REST, tRPC, or GraphQL) sits between UI and service: thin endpoints with validation (§E.8) + auth (§E.7) + service function invocation. Service functions SHALL be transaction units (§E.3). Unit tests cover services with mocked DB; integration tests cover service + DB; UI tests cover presentation logic only. Multi-client future (web, mobile, integration partners) consumes same service layer via API."*

**Cross-chain implication:** Chain 1 head. Enables §E.8 (validation library has home), P3-B inversion (state machines as TS code), §A.11/§A.12 modern realization (P6-D + P7-B modernization).

---

## 6. Section F — Inversion Sequencing

Per CAUSAL-CHAINS §6.2, **implementation order matters**. Inverting an anti-primitive without upstream causes leads to re-work; inverting upstream causes cascades benefits.

### F.1 Recommended Sequence

| Priority | Phase | What | Why |
|---|---|---|---|
| **#1** | **Foundation** | **Adopt Chain 4 (P1-B + P3-D + P6-A)** — dual-spine architecture from day one | Universal correctness; creates structural conditions for downstream inversions; minimal cost when done at start |
| **#2** | **Schema** | **Invert Chain 3 (P10-B + P7-F → §E.6 + §E.7)** — `rs_id` everywhere + RLS + RBAC | Schema decision; expensive to retrofit; G5 Karumkit network vision requires this |
| **#3** | **Audit** | **Invert Chain 2 top (P7-E → §E.1)** then cascade to P4-D (§E.2), P6-B (§E.3) | Audit infrastructure enables version columns + transactions to function meaningfully |
| **#4** | **Layers** | **Invert Chain 1 top (P4-A web/API + P4-C service layer → §E.9)** then cascade to P7-A (§E.8), P3-B (state machines as TS) | Service layer enables centralized validation + testable state machines |
| **Continuous** | **All phases** | **Adopt TIMELESS primitives + P-NEW-1 hybrid** (§A) | Multipliers — each adopted improves multiple chains |

### F.2 Cascade Benefit Framing

**Inverting upstream cascades benefits:**

- **Adopt Chain 4 first** (P1-B + P3-D + P6-A) → Dual-spine schema naturally supports tenant boundaries (helps #2) + audit pathway separation (helps #3) + module organization (helps #4)
- **Invert P10-B + add RLS** (#2) → `rs_id` everywhere makes RBAC tenant-aware naturally (P7-F inversion easier) → multi-tenant becomes structural reality not afterthought
- **Invert P7-E first within Chain 2** (#3 step 1) → Audit infrastructure makes version columns meaningful (P4-D inversion has context) → transactions become naturally testable (P6-B inversion implementable)
- **Invert P4-A + P4-C first within Chain 1** (#4 step 1) → Service layer creates home for validation library (P7-A inversion) → state machines move to TS code (P3-B inversion) → entire Chain 1 lower stack inverts as side-effect

### F.3 Anti-Sequence (What NOT To Do)

**Inverting in reverse order creates re-work cycles:**

- ❌ Build centralized validation library before service layer exists → validation leaks back into UI components (Khanza's anti-form)
- ❌ Add version columns before audit infrastructure → conflict resolution has no forensic context, operators cannot determine which version to keep
- ❌ Add RBAC before `rs_id` schema decision → role-permission grants don't scope to tenant, multi-tenant retrofit re-touches every grant
- ❌ Implement encounter hub last → other inversions reference "encounter" before its structure stabilizes

### F.4 Owner Decision Surface

SIMRS BT spoke session may calibrate sequence based on:
- **Initial deployment scope** (if truly single-RS for 3+ years, #2 multi-tenant could move to phase 2)
- **External integration timeline** (if BPJS integration in month 1, §E.4 SQL injection mitigation accelerated)
- **Audit framework rollout** (if Itjenad digital audit launches year 1, §E.1 priority elevated)
- **Team velocity** (recommended sequence assumes ~3-month phases; calibrate per actual capacity)

**The sequencing logic (foundation → schema → audit → layers) is more important than the specific phase timing.** SIMRS BT session retains autonomy to adjust timing per its constraints.

---

## 7. Closing — Handoff to D4 (IMPLICATIONS-FOR-SIKESUMA)

### 7.1 D3 Scope Recap

This document translates Khanza Codex findings into actionable architectural roadmap for SIMRS BT spoke session:

| Section | Content | Status |
|---|---|---|
| §A | 12 primitives adoption guidance (TIMELESS + ADOPT-AS-CONCEPT) | ✅ Complete |
| §B | 14 REQUIRES-CONTEXT primitives + P-NEW-1 calibration guidance | ✅ Complete |
| §C | 5 Critical + 3 High elevated (full) + 4 brief anti-primitives | ✅ Complete |
| §D | 3 Deep Choices Application + cumulative propagation | ✅ Complete |
| §E | 9 Recommended Blueprint Sections with formalization wording | ✅ Complete |
| §F | Inversion Sequencing + cascade framing + anti-sequence | ✅ Complete |

### 7.2 What D3 Provides (For SIMRS BT Session)

- **Adoption catalog**: which Khanza primitives to adopt + how (§A)
- **Calibration framework**: which require context-specific judgment + decision criteria (§B)
- **Inversion patterns**: how to invert Critical + High anti-primitives concretely (§C)
- **Theoretical alignment**: 3 Deep Choices application = decision compass at architecture-design time (§D)
- **Blueprint-ready wording**: 9 formalization paragraphs ready for SIMRS BT Blueprint adoption with appropriate modifications (§E)
- **Implementation sequence**: priority order + cascade logic + anti-sequence warnings (§F)

### 7.3 Discipline Self-Check (Per Bootstrap §6.3)

- ✅ All 5 pure TIMELESS primitives addressed in §A with concrete adoption guidance (P1-B, P1-C, P3-D, P8-C, P10-A)
- ✅ All 5 Critical anti-primitives addressed in §C with specific inversion patterns (P7-E, P4-D, P6-B, P7-D, P8-D)
- ✅ 3 Deep Choices framework integrated as §D
- ✅ Inversion sequencing follows CAUSAL-CHAINS Chain 4-first logic (§F)
- ✅ "Khanza optimized rationally" tone maintained — each anti-primitive leads with rational Khanza context
- ✅ No verbatim Java/SQL copy
- ✅ No SIMRS BT artifact edit (reference doc only)
- ✅ Cross-project boundary maintained — no SIKESUMA clone/query/edit; one Owner-mediated conceptual reference (§C.7 SIKESUMA C1-C12 pattern, consistent with Phase 3a CAUSAL-CHAINS §1.5 precedent)
- ✅ License clean (Khanza.Soft Media custom respected)
- ✅ Lineage references throughout (primitive IDs, Chain numbers, L_NNN entries)
- ⏳ Owner gate required before D4 production

### 7.4 Handoff to D4 (IMPLICATIONS-FOR-SIKESUMA)

D4 will translate Khanza findings relevant to SIKESUMA (TNI AD financial system) — secondary cross-project notes. Per Bootstrap §7, D4 covers Khanza primitives applicable to SIKESUMA (financial spine P6-A, Indonesian language P10-A, audit trail necessity P7-E inversion, transaction discipline P6-B inversion), patterns SIKESUMA should AVOID (single-tenant P10-B, string-concat SQL P7-D, error capture absence P8-D), and SIKESUMA spoke session guidance — owner-mediated brief expected; **cross-project boundary ABSOLUTE — no SIKESUMA clone/query/edit.**

### 7.5 Owner Gate (Mandatory Before D4)

Phase 3b session **STOPS HERE** awaiting Owner review:

| Decision | Options |
|---|---|
| **D3 approval** | ✅ Approve as-is / 🔧 Approve with refinements / 🔄 Refinement required |
| **Section C scoping retrospective** | Option B (adopted) worked / Should have been Option A / Mixed feedback |
| **Proceed to D4** | ✅ Green light D4 / ⏸ Hold D4 / 🔄 Refinements first |
| **Empirical spot-check** | None needed / Verify specific anchor X |

Phase 3b session standby for Owner direction.

---

**End of Phase 3 Deliverable 3: IMPLICATIONS-FOR-SIMRS-BT v1.0.** Lineage Log entries L040 (D3 production decisions) + L041 (D3 completion) appended in companion update. Phase 3b session awaiting Owner gate before D4 production.

