# The Khanza Codex — Phase 2 Domain 7 Validation
## Universal Functions & Logic

**File:** `KHANZA-CODEX-PHASE-2-DOMAIN-7-UNIVERSAL-FUNCTIONS.md`
**Versi:** 1.0
**Tanggal:** 13 Mei 2026
**Phase:** 2 (Targeted Data Collection) — sub-session 4 / 10
**Domain:** 7 — Universal Functions & Logic
**Status:** Awaiting Owner gate (§7.5 Phase 1 bundle)
**Parent input:** `KHANZA-CODEX-PHASE-1-HYPOTHESES.md` v1.0 §4.7
**Author:** Khanza spoke session AI (Phase 2 sub-session 4)
**Validation method:** Schema analysis (sik.sql for triggers/procedures/columns) + Java source pattern-counting (validation, calculation, search, authorization) + library inventory. No verbatim code/SQL copy.

**New in this sub-session:** Layer 1 tagging system applied per Owner direction. Setiap primitive di-tag dengan classification (`[TIMELESS]`, `[ERA-2010-LAN]`, `[ADOPT-AS-CONCEPT]`, `[ANTI-PRIMITIVE]`, `[REQUIRES-CONTEXT]`).

---

## Daftar Isi

1. [Hipotesis yang Di-test](#1-hipotesis-yang-di-test)
2. [Per-Hipotesis Validation](#2-per-hipotesis-validation)
3. [Cross-Hipotesis Observations](#3-cross-hipotesis-observations)
4. [Conceptual Primitives Extracted (with Layer 1 Tagging)](#4-conceptual-primitives-extracted-with-layer-1-tagging)
5. [Anti-Primitives Running List (for Phase 5 Codex)](#5-anti-primitives-running-list-for-phase-5-codex)
6. [Owner Gate Request](#6-owner-gate-request)

---

## 1. Hipotesis yang Di-test

| ID | Statement (singkat) |
|---|---|
| **H7.1** | Validation multi-level inkonsisten (UI mostly, business logic sparingly, DB FK) |
| **H7.2** | Calculation di Java service classes (imperative), bukan stored procedure |
| **H7.3** | Reporting pakai JasperReports + SQL queries, bukan OLAP/cube |
| **H7.4** | Search pakai LIKE pattern + indexed column, bukan full-text search |
| **H7.5** | Audit trail column-based (created_at, updated_at, updated_by) per entity |
| **H7.6** | Authorization role-based dengan granularity menu/form level |

---

## 2. Per-Hipotesis Validation

### 2.1 H7.1 — Validation Multi-Level Inkonsisten

#### Status: **CONFIRMED** ✅

#### Evidence Summary

**Validation coverage di package operasional (file using `JOptionPane`/`isEmpty` patterns):**

| Package | Coverage | %  |
|---|---|---|
| `keuangan/` | 155 / 167 files | 93% |
| `rekammedis/` | 188 / 239 files | 79% |
| `kepegawaian/` | 57 / 73 files | 78% |

**Shared validation utility presence:**
- `src/fungsi/validasi.java` — exists tapi **single utility file**
- No central validation framework / library

**Implication:** validation **widespread** (79-93%) tapi **per-file inline**. Tidak ada single source of truth untuk validation rules. Setiap form re-implements validation logic.

#### Refined Statement

> **H7.1' — Validation di Khanza adalah per-form inline implementation, dengan 80-93% coverage di critical operational packages.** Ada minimal shared utility (`fungsi/validasi.java`), tapi bulk of validation di-write fresh di setiap form. Database-level enforcement terbatas ke FK constraints (2032 instances per Domain 6 finding) — no CHECK constraints universal, no triggers.

#### Conceptual Abstraction

**Primitive P7-A — Per-Form Inline Validation**
**Tag: `[ANTI-PRIMITIVE]`**

Pattern: Setiap form/dialog mengimplementasikan validation logic-nya sendiri inline, tanpa central rule registry atau composable validator framework.

**Trade-off:**
- ✅ Low ceremony untuk feature baru
- ❌ **Duplikasi rules** — same validation logic di multiple files
- ❌ **Inconsistency** — variations di seberapa strict validation per-form
- ❌ **Tidak testable** dalam isolation (terikat ke Swing event)
- ❌ **Rule update expensive** — kalau policy change (mis. NIK format), harus touch banyak files

**Why ANTI:** Kontras dengan SIKESUMA pattern (per intro doc §5): 12 pure function validators C1-C12, composable, testable, dashboard-aggregated. SIKESUMA pattern **substantially better** untuk audit-defensibility dan maintainability. SIMRS BT inherit pattern dari SIKESUMA.

---

### 2.2 H7.2 — Calculation di Java, Bukan Stored Procedure

#### Status: **CONFIRMED with extreme nuance** ✅

#### Evidence Summary

**Database-side logic infrastructure (sik.sql):**

| Mechanism | Count |
|---|---|
| Stored procedures (`CREATE PROCEDURE`) | **0** |
| Stored functions (`CREATE FUNCTION`) | **0** |
| Database triggers (`CREATE TRIGGER`) | **0** (recall Domain 6) |

**Database is COMPLETELY PASSIVE** — no logic at DB level beyond:
- Foreign key constraints (referential integrity)
- NOT NULL / DEFAULT / type constraints (schema-level)

ALL business logic, calculation, dan invariant enforcement di **Java application code**.

#### Refined Statement

> **H7.2' — Khanza extreme database-passive: ZERO stored procedures, ZERO functions, ZERO triggers.** Database role minimized to "typed referential storage". Semua calculation, business rules, dan invariants implemented di Java application code. Tidak ada DB-side computation atau enforcement beyond schema constraints.

#### Conceptual Abstraction

**Primitive P7-B — Application-Centric Logic, Database-Passive**
**Tag: `[ADOPT-AS-CONCEPT]`** (concept valid, implementation needs modernization)

Pattern: Architectural choice untuk minimize database logic — DB sebagai storage layer only, semua logic di application.

**Trade-off (valid sebagai concept):**
- ✅ **Stack flexibility** — DB engine swappable kalau abstraction layer cukup tipis
- ✅ **Logic auditable in source code** (single language)
- ✅ **Easier unit testing** — pure functions
- ✅ **Modern stack alignment** — Supabase + TypeScript pattern fits this
- ❌ Concurrency risk (no transactional discipline, per Domain 4/6) — but this is implementation, not concept

**Why ADOPT-AS-CONCEPT:** Concept dari "database-passive + application-centric" valid untuk modern web stack. SIKESUMA mengikuti pattern serupa (Supabase = passive PostgreSQL with RLS, business logic in TypeScript). SIMRS BT akan inherit pattern.

**Modernization required:** untuk SIMRS BT, "database-passive" tetap valid TAPI dengan **DB triggers untuk invariants security-critical** (mis. immutability dari snapshot per SIKESUMA Tier 5 R7c). Hybrid: passive-but-not-naive.

---

### 2.3 H7.3 — Reporting via JasperReports

#### Status: **STRONGLY CONFIRMED** ✅✅

#### Evidence Summary

**JasperReports infrastructure inventory:**

| Asset Type | Count |
|---|---|
| `.jrxml` template files in `report/` | **1280** |
| `.jasper` compiled report files | **1281** |
| Java files using JasperReports library | **905** |
| Items in `report/` folder total | 2562 |

**OLAP / Data warehouse:**
- 0 OLAP / cube / warehouse references in code (8 raw matches investigated, all false positives — substring "olap" in unrelated context)
- 0 dedicated reporting infrastructure outside JasperReports

**Reporting pattern:**
- 1280 distinct reports (significant variety — registration history, surat jaminan, persetujuan tindakan medis, etc.)
- Each .jrxml is **runtime-editable template** (can be modified with iReport/JasperStudio without code recompile)
- SQL queries embedded dalam .jrxml — reports tightly coupled ke schema specifics

#### Conceptual Abstraction

**Primitive P7-C — Template-Based Operational Reporting**
**Tag: `[REQUIRES-CONTEXT]` + `[ERA-2010-LAN]` for JasperReports specifically**

Pattern: Operational reporting via **externalized templates** (XML-based) yang user/admin dapat modify tanpa code change. SQL queries embedded di template untuk data retrieval.

**Trade-off:**
- ✅ **Externalized format** — admin RS dapat modify report layout tanpa programming
- ✅ **Many reports** — 1280 templates indicates rich reporting needs
- ✅ **Tightly typed** — SQL + JasperReports pipeline mature
- ❌ **Desktop-era heavy** — JasperReports designed for thick client (print + PDF)
- ❌ **Maintenance burden** — 1280 templates accumulate over time, hard to keep consistent
- ❌ **No modern web preview** — JasperServer / web version exists tapi separate infrastructure
- ❌ **Slow when complex** — SQL queries per report, no caching layer, no warehouse

**Why both tags:** Pattern of "externalized template-based reporting" adalah `[REQUIRES-CONTEXT]` — for some use cases (legal documents, surat jaminan, persetujuan with fixed format), template approach **still valid** in modern stack. JasperReports specifically adalah `[ERA-2010-LAN]` — modern web equivalents (React-PDF, Recharts for analytics, server-side PDF via Puppeteer) more lightweight.

**Modernization untuk SIMRS BT:**
- Tightly-formatted documents (surat jaminan, formulir resmi): template-based generation (React-PDF atau similar) — adopt concept
- Dashboard analytics: live React components dengan Recharts (SIKESUMA pattern) — different paradigm
- Operational reports: case-by-case decision

---

### 2.4 H7.4 — Search via LIKE Pattern

#### Status: **CONFIRMED with security concern** ⚠️

#### Evidence Summary

**Search infrastructure:**

| Pattern | Count |
|---|---|
| Files in `src/keuangan/` using `' like '` SQL pattern | **135 / 167** |
| `DlgCari*` (search dialog) class files | **76** |
| Full-text search libraries (Lucene/Elasticsearch) | **0** |
| FULLTEXT indexes di sik.sql | **0** |

**Pattern observable dari Java source structure:**
- SQL `LIKE '%' + variable + '%'` pattern via **string concatenation**
- Java code constructs SQL query strings dengan concat dari user input
- Single SQL string per search, no query parameterization observed in pattern

**⚠️ SECURITY CONCERN:** Pattern of "string concat into SQL" adalah classic **SQL injection vulnerability**. Sample observed (structural reference, not verbatim copy): typical pattern is `query = "... like '%" + textfield.getText() + "%' ..."` — direct user input concatenation into SQL string.

**Catatan disiplin:** saya tidak menyimpan / quote actual user input handling code; observation adalah pattern-level. SQL injection risk adalah inference dari structural pattern, bukan from inspection of specific vulnerability.

#### Refined Statement

> **H7.4' — Khanza pakai LIKE-based search dengan string concatenation pattern, no parameterized queries observed di typical search dialogs.** Tidak ada full-text search infrastructure (Lucene, FULLTEXT index, atau Elasticsearch). Search performance bergantung pada index per kolom yang dicari. Pattern berisiko SQL injection di banyak entry points (76+ DlgCari dialogs).

#### Conceptual Abstraction

**Anti-Primitive P7-D — String-Concat SQL Search**
**Tag: `[ANTI-PRIMITIVE]`** (security risk)

Pattern: Search functionality implemented via direct string concatenation user input ke SQL WHERE clause.

**Why ANTI:**
- ❌ **SQL injection** vulnerability potential di each entry point
- ❌ **Performance unpredictable** — LIKE '%x%' tidak dapat use B-tree index
- ❌ **No relevance ranking** — exact match vs prefix vs substring treated equally
- ❌ **Tidak scale** ke large datasets

**Modernization untuk SIMRS BT (CRITICAL):**
- ✅ **Parameterized queries** mandatory (Supabase client / TypeScript ORM enforces by default)
- ✅ **Full-text search** via PostgreSQL `tsvector` atau dedicated search service
- ✅ **Search dengan relevance ranking** (PostgreSQL `ts_rank`)
- ✅ **Faceted filtering** via indexed columns + parametrized queries

**Catatan:** P7-D adalah anti-primitive yang **explicit untuk avoid**. Wajib include di "Patterns to Avoid" section final Codex.

---

### 2.5 H7.5 — Audit Trail Column-Based Per Entity

#### Status: **FALSIFIED** ❌ (significant unexpected finding)

#### Evidence Summary

**Hypothesis predicted columns seperti `updated_at`, `updated_by`, `last_user`, dll. ada di tabel utama.**

**Reality:**

| Column Pattern | Count in sik.sql |
|---|---|
| `\`updated_by\``, `\`last_user\``, `\`user_update\``, `\`update_by\`` (exact match) | **0** |
| `\`updated_at\``, `\`last_update\``, `\`tgl_update\``, `\`tgl_entry\`` (operational timestamp) | **0** (exact match in tested set) |
| TIMESTAMP/DATETIME columns total | 289 (from Domain 2 — but these are operational, mostly tgl_*+jam_* PK components, not audit) |

**Schema-wide audit infrastructure search:**
- `audit_*` tables exist (15+ tables) — TAPI semua adalah **clinical infection control audit** (audit_bundle_iadp, audit_bundle_ido, audit_bundle_isk, audit_cuci_tangan_medis, audit_kepatuhan_apd, dll. — semua adalah IPCN/Komite PPI workflow)
- NO `audit_log`, NO `change_history`, NO `entity_version` table
- NO systematic per-row change tracking di schema level

**Conclusion:** **Khanza schema tidak punya systematic audit trail at all.** History reconstruction dari standard tables **impossible** — overwrites are silent dan unrecoverable.

#### Refined Statement (FALSIFICATION)

> **H7.5 FALSIFIED — Khanza schema TIDAK punya systematic audit trail.** Tidak ada universal `updated_at` / `updated_by` columns, tidak ada `audit_log` table untuk system events, tidak ada history per entity. Audit_* tables yang ada semuanya clinical (PPI infection control workflow), bukan system change tracking. Untuk audit "siapa yang ubah field X dari A ke B kapan", **tidak ada answer** di schema.

#### Conceptual Abstraction

**Anti-Primitive P7-E — Audit Trail Absent at Schema Level**
**Tag: `[ANTI-PRIMITIVE]`** (highest severity)

Pattern: System dengan **no schema-level audit infrastructure**. Changes are direct UPDATE; previous state lost; identity of editor lost; timing of change lost (except for the audit-irrelevant `tgl_*+jam_*` operational columns).

**Implications:**
- ❌ **Cannot answer audit questions** about row history — impossible to reconstruct "what changed when"
- ❌ **No forensic capability** — kalau ada fraud / mistake, tidak dapat trace back
- ❌ **No compliance with strict audit frameworks** — Itjenad, BPK, akreditasi standards yang require traceable change history cannot be satisfied
- ❌ **No undo** — petugas yang salah edit cannot recover previous state
- ❌ **No regulatory readiness** — Permenkes RME (Rekam Medis Elektronik) increasingly require audit trail; Khanza schema needs retrofit

**Why ANTI-PRIMITIVE for SIMRS BT (TNI AD context absolutely critical):**

TNI AD audit framework (BPK + Itjenad + Wasrik) **CANNOT operate** dengan pattern ini. SIMRS BT **HARUS** punya systematic audit trail at schema level dari V1.

**Modernization untuk SIMRS BT:**
- ✅ **SIKESUMA Tier 5a pattern** adalah counter-pattern: immutable snapshot per terminal state transition (R7c at DB + app layer)
- ✅ **Audit log table** dengan event sourcing untuk critical entities (per the encounter spine + accounting spine in P6-A)
- ✅ **Row-level timestamps minimum:** `created_at`, `updated_at`, `updated_by` columns universal (cheap, single defense layer — better than zero)
- ✅ **Tier 5-style snapshot** untuk terminal state transitions (mis. SK ditetapkan → snapshot POK)

P7-E adalah anti-primitive yang **paling kritis** untuk avoid di SIMRS BT. Wajib top-of-list di "Patterns to Avoid" section.

---

### 2.6 H7.6 — Authorization Role-Based

#### Status: **REFINED (extreme outlier)** ⚠️⚠️

#### Evidence Summary

**Authorization model investigation:**

Tabel-tabel related ke authorization yang exist:
- `user` — single table
- `petugas` — single table (dengan PK = NIP, identity master)

Tabel-tabel yang TIDAK ada:
- ❌ `role` — no role definition table
- ❌ `user_role` — no user-role mapping
- ❌ `role_menu` — no role-permission mapping
- ❌ `hak_akses` — checked in Domain 5, not present
- ❌ `permission` — no separate permission definition

**Critical finding — `user` table structure:**

| Metric | Value |
|---|---|
| Total columns in `user` table | **1196** |
| Columns of type `enum('true','false')` (boolean permission flags) | **1195** |
| Columns of other types (id_user, password) | 1 (+ password = 2) |
| Comparison: `pasien` table columns | 36 |
| Comparison: `reg_periksa` table columns | 19 |

**`user` table adalah 36× wider dari `pasien`, 63× wider dari `reg_periksa`.** This is extreme denormalization — column-per-feature design.

**Sample feature columns (each = a boolean permission flag):** `penyakit`, `obat_penyakit`, `dokter`, `jadwal_praktek`, `pasien`, `registrasi`, `tindakan_ralan`, `kamar_inap`, `tindakan_ranap`, `operasi`, `rujukan_keluar`, `rujukan_masuk`, `beri_obat`, `resep_pulang`, `obat`, `stok_opname_obat`, `pengadaan_obat`, `keuntungan_penjualan`, `ipsrs_barang`, etc.

**Authorization check pattern:**
- Permission check = `SELECT specific_column FROM user WHERE id_user = ?`
- Single column read = single boolean = "can user access feature X"
- Adding new feature = `ALTER TABLE user ADD COLUMN new_feature_name ENUM('true','false')`

#### Refined Statement (DRAMATIC refinement)

> **H7.6' — Khanza authorization BUKAN role-based. Adalah extreme denormalized direct-flag-matrix:** `user` table punya **1195 boolean permission columns**, satu per fitur. Tidak ada role abstraction, tidak ada role-permission mapping, tidak ada permission groups. Setiap fitur baru ditambahkan via `ALTER TABLE user ADD COLUMN`. Permission check = single column read.

#### Conceptual Abstraction

**Anti-Primitive P7-F — Authorization-as-Boolean-Matrix (Schema)**
**Tag: `[ANTI-PRIMITIVE]`** + `[ERA-2010-LAN]`

Pattern: User permissions modeled as **direct flags on user table** (column per feature), bukan via role abstraction.

**Trade-off (sebagai anti-primitive untuk modern context):**
- ✅ **Simple permission check** — single column read, O(1) lookup
- ✅ **No join required** untuk authorization
- ✅ **Per-user fine-grained control** — admin dapat tweak individual user
- ❌ **Schema bloat** — 1195 columns bloated single table
- ❌ **Schema change required for new features** — ALTER TABLE every feature addition
- ❌ **No role concept** — kalau 10 users punya same permission set, must update 10 rows individually
- ❌ **No permission grouping** — "kasir" role yang inherit base + cashier permissions tidak modelable
- ❌ **Tidak multi-tenant** — kalau RS lain punya features berbeda, schema diverge
- ❌ **Tidak auditable** — siapa grant siapa permission kapan tidak tracked (consistent dengan P7-E)

**Why ANTI-PRIMITIVE + ERA-2010-LAN:**
- ANTI-PRIMITIVE: violates basic normalization, doesn't scale, no role abstraction
- ERA-2010-LAN: single-RS deployment context membuat schema bloat tolerable (one RS, one user table, manual admin sufficient). Modern multi-RS / cloud / SaaS context tidak afford pattern ini.

**Modernization untuk SIMRS BT:**
- ✅ **RBAC** (Role-Based Access Control) — `roles`, `permissions`, `user_roles`, `role_permissions` (4 tables, normalized)
- ✅ **Supabase RLS** untuk row-level enforcement
- ✅ **Audit trail** untuk permission grants/revokes
- ✅ **Feature flags** terpisah dari user permissions (Phase-based rollout)

---

## 3. Cross-Hipotesis Observations

### 3.1 Khanza Schema sebagai "Minimal-Defenses Storage"

Combined finding lintas H7.2 + H7.5 + H6.4 (recall) + H4.4 (recall):

Khanza database adalah **extremely passive storage layer**. Inventory of defenses absent:

| Defense Mechanism | Khanza Status |
|---|---|
| Stored procedures | ❌ Zero |
| Stored functions | ❌ Zero |
| Database triggers | ❌ Zero (Domain 6) |
| CHECK constraints (beyond NOT NULL) | ❌ Minimal |
| Audit trail columns | ❌ Zero universal |
| Audit log tables | ❌ Zero (only clinical IPCN audit) |
| Row-version / optimistic locking | ❌ Zero (Domain 4) |
| Application-level explicit transactions | ❌ Minimal (Domain 6) |
| FOREIGN KEY constraints | ✅ 2032 instances (the **only** defense) |

**Schema sebagai "thin layer atas data."** Single defense (FK) + everything else assumed to be handled by application code. Combined dengan P4-C (UI-as-Orchestrator), ini berarti **business invariants ada di Swing form classes** — fragile.

### 3.2 The Adopt-As-Concept Trap

Several Khanza primitives **look like good ideas** at concept level (P7-B database-passive, P7-C templated reports) tapi punya **implementation traps** yang specific ke 2010-era choices.

**Pattern of risk:** SIMRS BT engineer reads Codex, sees "Khanza pakai database-passive — should we adopt?". Naive answer "yes, copy this". Better answer: "yes, concept valid, **but** modernize implementation completely":

| Concept | Khanza Implementation | SIMRS BT Modernization |
|---|---|---|
| Database-passive | Zero DB-side logic (incl. zero triggers) | Mostly-passive PostgreSQL, **but** triggers untuk security-critical invariants (immutability snapshots) |
| Templated reports | JasperReports + .jrxml + thick client viewer | React-PDF / server-side PDF / Recharts for analytics — externalized format concept valid, implementation different |
| Application-centric logic | All logic in Swing forms inline | SIKESUMA Pure Helpers + DI Service — concept valid, layered implementation |

**Implikasi untuk Phase 5 Codex:** "Adopt-as-concept" primitives perlu **explicit modernization guidance**, bukan just "this is the pattern". Otherwise SIMRS BT akan **inherit traps** disguised as wisdom.

### 3.3 Operational vs Audit Time-Tracking

Important distinction observed (recall Domain 2 H2.3 — bifurcated temporal model):

Khanza punya **operational time** (tgl_*+jam_* di clinical event rows) — abundant (244 + 84 + 289 columns), used for **when clinical event happened**.

Khanza punya **ZERO audit time** (updated_at, updated_by columns) — **completely absent**. Used (per design): **never**.

**Pattern:** Khanza care about **kapan event terjadi** (operational, for clinical workflow), bukan tentang **kapan record di-create/update** (audit, for tracking).

Ini adalah **conscious design choice** (atau era-specific blindspot). Untuk RS operasional, kapan dokter periksa adalah primary concern; kapan operator input data adalah footnote.

**Untuk SIMRS BT TNI AD context:** kedua-duanya kritis — operational time untuk clinical accuracy, audit time untuk BPK/Itjenad compliance. **Cannot inherit Khanza's blindspot.**

---

## 4. Conceptual Primitives Extracted (with Layer 1 Tagging)

| Primitif | Statement | Tag |
|---|---|---|
| **P7-A — Per-Form Inline Validation** | Setiap form mengimplementasikan validation logic-nya sendiri inline, tanpa central rule registry | `[ANTI-PRIMITIVE]` |
| **P7-B — Application-Centric Logic, Database-Passive** | DB role minimized to storage; semua business logic at application layer | `[ADOPT-AS-CONCEPT]` (concept valid, implementation needs hybrid passive-with-strategic-triggers) |
| **P7-C — Template-Based Operational Reporting** | Operational reports via externalized templates dengan embedded SQL | `[REQUIRES-CONTEXT]` (concept) + `[ERA-2010-LAN]` (JasperReports specifically) |
| **P7-D — String-Concat SQL Search** | Search via SQL LIKE with string concatenation from user input | `[ANTI-PRIMITIVE]` (security risk: SQL injection) |
| **P7-E — Audit Trail Absent at Schema Level** | No systematic audit infrastructure: no updated_at, no audit_log, no history | `[ANTI-PRIMITIVE]` (highest severity — incompatible dengan TNI AD audit context) |
| **P7-F — Authorization-as-Boolean-Matrix** | User permissions sebagai 1195 boolean columns di single user table; no role abstraction | `[ANTI-PRIMITIVE]` + `[ERA-2010-LAN]` |

---

## 5. Anti-Primitives Running List (for Phase 5 Codex "Patterns to Avoid")

Sebagai layer 2 running list per Owner direction. Updated through sub-session 4.

### 5.1 Critical Anti-Primitives (Highest Severity)

| ID | Pattern | Severity | Source Domain | Why Critical |
|---|---|---|---|---|
| **P7-E** | Audit Trail Absent at Schema Level | 🔴 Critical | Domain 7 | TNI AD audit framework cannot operate |
| **P4-D** | Silent Last-Write-Wins (no concurrency control) | 🔴 Critical | Domain 4 | Silent data loss; audit forensic impossible |
| **P6-B** | Eventual Consistency via Human Reconciliation | 🔴 Critical | Domain 6 | Cross-module integrity weak |
| **P7-D** | String-Concat SQL Search | 🔴 Critical | Domain 7 | Security: SQL injection potential |

### 5.2 High-Severity Anti-Primitives

| ID | Pattern | Severity | Source Domain |
|---|---|---|---|
| **P4-C** | UI-as-Orchestrator (No Service Layer) | 🟠 High | Domain 4 |
| **P7-F** | Authorization-as-Boolean-Matrix (1195 cols) | 🟠 High | Domain 7 |
| **P7-A** | Per-Form Inline Validation | 🟠 High | Domain 7 |

### 5.3 Nuanced Anti-Primitives (avoid in modern context)

| ID | Pattern | Severity | Source Domain |
|---|---|---|---|
| **P5-B** | Naming-Convention-as-Boundary | 🟡 Nuanced | Domain 5 |

### 5.4 Era-Specific Artifacts (Not anti per se, but obsolete)

| ID | Pattern | Source Domain | Modernization Path |
|---|---|---|---|
| **P4-A** | Fat-Client-with-Shared-Database | Domain 4 | N-tier web stack (React + Supabase) |
| **P4-E** | Database-as-Mailbox (polling) | Domain 4 | Real-time push (Supabase Realtime) |
| **P7-C** | Template-Based Reporting (JasperReports) | Domain 7 | React-PDF / Recharts |
| **P7-F** | Authorization-as-Boolean-Matrix | Domain 7 | RBAC + RLS |

---

## 6. Owner Gate Request

### 6.1 Hasil Sub-Session 4 (Domain 7)

**6 hipotesis tested. Distribusi status:**

| Status | Count | Hipotesis |
|---|---|---|
| ✅ Confirmed (with elaboration) | 2 | H7.1, H7.2 |
| ✅✅ Strongly Confirmed | 1 | H7.3 |
| ⚠️ Refined | 2 | H7.4 (security concern added), H7.6 (extreme outlier) |
| ❌ **Falsified** | **1** | **H7.5 — no schema audit trail at all** |

### 6.2 Most Significant Findings

1. **H7.5 FALSIFIED — No systematic audit trail** at schema level. This is **the most serious anti-pattern discovery sepanjang Phase 2 so far**. P7-E adalah top-priority entry untuk "Patterns to Avoid" di final Codex.

2. **H7.6 dramatic refinement — 1196-column user table** dengan 1195 boolean permission flags. Extreme denormalization yang functionally works tapi schema-bloat severe + zero role abstraction.

3. **Database-as-thin-storage confirmed** lintas H7.2 + recall H6.4: ZERO procedures, ZERO functions, ZERO triggers — schema adalah minimal-defenses.

### 6.3 Layer 1 Tagging — First Application

Domain 7 adalah first domain dengan Layer 1 tagging applied:
- 1 primitif `[ADOPT-AS-CONCEPT]` (P7-B)
- 1 primitif `[REQUIRES-CONTEXT]` + `[ERA-2010-LAN]` (P7-C)
- 4 primitives `[ANTI-PRIMITIVE]` (P7-A, P7-D, P7-E, P7-F)
- 0 primitives `[TIMELESS]`

**Interpretation:** Domain 7 (universal functions/logic) adalah domain dengan **highest concentration of anti-primitives**. Banyak Khanza patterns di sini are era-specific atau insufficient untuk modern context. Bukan signifikansi Khanza-as-product critique — adalah signifikansi recognition bahwa **15 years of operational software evolution + 2010 deployment constraints** menciptakan patterns yang need explicit non-adoption decision.

### 6.4 Boundary Discipline Verification

| Test | Result |
|---|---|
| Findings adalah konsep? | ✅ Semua di §4 sebagai primitif platform-agnostic |
| Platform-agnostic? | ✅ Pattern descriptions stack-independent |
| Abstract enough? | ✅ "Kenapa" + trade-offs articulated |
| License-clean? | ✅ No code/SQL/method body verbatim copy. Counts, class names, column names sebagai metadata refs. Sample LIKE pattern noted **structurally** (string-concat) tanpa actual code paste. |
| Relevan untuk SIMRS BT? | ✅ Semua 6 primitives directly inform SIMRS BT design (4 anti-primitives untuk avoid + 1 adopt-as-concept + 1 requires-context) |

### 6.5 Pertanyaan untuk Owner

1. **Approval status** Domain 7?

2. **Anti-primitive severity classification** — saya introduce 4-level severity (🔴 Critical, 🟠 High, 🟡 Nuanced, era-specific). Setuju, atau Owner prefer different scheme?

3. **P7-E (audit trail absent)** — saya rate as Critical severity. Apakah Owner setuju ini deserves explicit mention di SIMRS Batin Tikal Architecture Blueprint sebagai **non-negotiable design constraint**?

4. **Next sub-session** — saran per §7.2 priority order: **Domain 3 (Konsep & Theoretical Framework)** atau **Domain 1 (Filosofi)**. Keduanya synthesis-heavy. Saya recommend **Domain 3 first** karena ada concrete theoretical structures untuk validate (state-transition di reg_periksa per H3.2, master-vs-operational separation per H3.3, dll.). Domain 1 punya more abstract questions yang better emerge from accumulated findings.

5. **Mid-Phase-2 reflection** — kita sudah selesai 4 dari 10 domains (Domain 2, 4, 5, 6, 7). Apakah Owner ingin mid-phase synthesis check-in sebelum continue ke Domain 3 + Domain 1 + remaining? Atau push through dan synthesis dilakukan di Phase 3 yang dedicated?

---

**End of Phase 2 Domain 7 validation. Sub-session 4 complete. Awaiting Owner gate before sub-session 5.**
