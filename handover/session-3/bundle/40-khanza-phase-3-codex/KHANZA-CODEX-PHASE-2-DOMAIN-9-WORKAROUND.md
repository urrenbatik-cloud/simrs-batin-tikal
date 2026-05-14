# The Khanza Codex — Phase 2 Domain 9 Validation
## Workaround Tricks (Trik Workaround Yang Dipakai)

**File:** `KHANZA-CODEX-PHASE-2-DOMAIN-9-WORKAROUND.md`
**Versi:** 1.0
**Tanggal:** 13 Mei 2026
**Phase:** 2 (Targeted Data Collection) — sub-session 7 / ~8 (paired dengan Domain 8)
**Domain:** 9 — Workaround Tricks
**Status:** Awaiting Owner gate (consolidated dengan Domain 8 above)
**Parent input:** `KHANZA-CODEX-PHASE-1-HYPOTHESES.md` v1.0 §4.9
**Author:** Khanza spoke session AI (Phase 2 sub-session 7)
**Validation method:** Substantial pre-validation cross-reference dari Domain 1/5/7 + targeted new validation (naming inconsistency, staging tables)

**Domain character:** Domain ringan-menengah. Predictions substantially pre-validated. Layer 1 tagging applied.

---

## Daftar Isi

1. [Hipotesis yang Di-test](#1-hipotesis-yang-di-test)
2. [Per-Hipotesis Validation](#2-per-hipotesis-validation)
3. [Conceptual Primitives Extracted](#3-conceptual-primitives-extracted)
4. [Combined Owner Gate Request (Domain 8 + 9)](#4-combined-owner-gate-request-domain-8--9)

---

## 1. Hipotesis yang Di-test

| ID | Statement (singkat) | Pre-validation level |
|---|---|---|
| **H9.1** | Schema mengandung "evolutionary debt" — kolom historically meaningful tapi vestigial | Strong (Domain 1 P1-D Accretion) |
| **H9.2** | Module bridging shows most workarounds — external dependency volatile | Strong (Phase 1: 261 bridging files) |
| **H9.3** | Naming convention inkonsisten lintas modul reflects different developers/epochs | New validation needed |
| **H9.4** | Beberapa tabel berfungsi sebagai "staging" untuk data transformation | New validation needed |
| **H9.5** | Authorization implementation menunjukkan workaround | Strong (Domain 7 P7-F) |

---

## 2. Per-Hipotesis Validation

### 2.1 H9.1 — Evolutionary Debt di Schema

#### Status: **CONFIRMED via cross-reference** ✅

#### Evidence Summary

Pre-validated by P1-D (Accretion Over Refactoring) dengan extreme example user table 1196 columns. Schema evolved through 15+ years of accretion — kolom yang relevant pada era 2012 mungkin tidak active pada era 2024 tapi remain di schema untuk backward compatibility.

**Cross-reference:** P1-D fully covers this. No new primitive needed — H9.1 adalah operational manifestation of accretion philosophy.

---

### 2.2 H9.2 — Bridging Module shows Most Workarounds

#### Status: **STRONGLY CONFIRMED** ✅✅

#### Evidence Summary

| Module | Java file count | Character |
|---|---|---|
| `src/bridging/` | **261 files** | Extreme — third-largest module |
| `src/rekammedis/` | 239 files | Clinical core |
| `src/keuangan/` | 167 files | Financial core |
| `src/kepegawaian/` | 73 files | HR |

**Bridging module is third-largest, exceeding HR + Inventory + many other domain modules combined.**

**Sample vendor variety di bridging/** (file naming reveals diversity):
- `AkunRekeningBankJabar`, `AkunRekeningBankJateng`, `AkunRekeningBankMandiri`, `AkunRekeningBankPapua` — 4 bank vendor variants
- `ApiBPJS`, `ApiBPJSAesKeySpec`, `ApiBPJSAplicare`, `ApiBPJSEnc`, `ApiBPJSLZString`, `ApiApotekBPJS` — 6+ BPJS sub-protocols (Aplicare = referral, Apotek = pharmacy, plus encryption sub-libraries)

**Pattern:** Setiap external API integration generates its own integration code surface. Workarounds accumulate per vendor + per API version + per protocol quirk.

#### Conceptual Abstraction

**Primitive P9-A — Bridging Module sebagai Heterogeneity Sink**
**Tag: `[REQUIRES-CONTEXT]`** (concept valid; Khanza scale extreme)

Pattern: Sistem yang integrate dengan **banyak external partners volatile** (regulators, banks, payment gateways, lab analyzers) menampung integration complexity di **dedicated module** terpisah dari core domain logic.

**Trade-off:**
- ✅ **Isolation** — protocol changes di bank Mandiri tidak affect clinical modules
- ✅ **Vendor-specific code locality** — Mandiri bridge file is one cohesive unit
- ❌ **Module bloat** — 261 files reflects accumulated 15+ years vendor changes
- ❌ **Coordination overhead** — kalau core domain change, need to verify each bridge masih works
- ❌ **Testing complexity** — each vendor needs separate test fixture

**Why REQUIRES-CONTEXT:**
- Concept of "isolate external integration di dedicated module" universally valuable
- Khanza implementation pattern (separate Java class per vendor variant) is era-specific (no contract testing, no shared abstractions)
- Modern equivalent: **abstract integration layer** (interface-based) + **vendor adapters** + **contract tests** per vendor

**Modernization untuk SIMRS BT:**
- ✅ Adopt principle: dedicated integration module/folder/package
- ✅ **Improvement:** abstract common operations (sendPayment, getReferralData, postObservation) ke interfaces
- ✅ **Vendor adapters implement interfaces** — adding new vendor = new adapter, not new bridge
- ✅ **Contract tests per vendor** ensure breakage detected early
- ✅ **Versioning explicit** untuk volatile vendors (BPJS, SatuSehat)

---

### 2.3 H9.3 — Naming Inconsistency Lintas Modul

#### Status: **STRONGLY CONFIRMED** ✅✅ (with quantitative evidence)

#### Evidence Summary

**Identifier column prefix usage:**

| Prefix | Count | Era / Era Mapping |
|---|---|---|
| `no_*` | **3,235** | Original era (no_rkm_medis, no_rawat, no_nota) — Indonesian abbreviations |
| `kd_*` | **1,719** | Original era (kd_dokter, kd_rek, kd_poli) — Indonesian abbreviations |
| `kode_*` | **1,612** | Later era — full Indonesian word |
| `id_*` | **291** | Newest era — English, mostly FHIR/SatuSehat tables (id_encounter, id_medicationrequest, id_immunization, dll.) |

**Total ID-prefix usage: 6,857 across schema.** **4 different conventions coexist** untuk same conceptual role (identifier column).

**Era mapping:**
- 2008-2015 era: `no_*` + `kd_*` (Indonesian abbreviations, most prevalent)
- 2015-2020 era: `kode_*` (Indonesian full word, slightly later style)
- 2020+ era: `id_*` (English, driven by FHIR/SatuSehat international interoperability)

**Insight:** Schema literally **archaeological**. Newer integration with SatuSehat (Kemenkes FHIR standard) introduced English `id_*` naming, but **didn't refactor** older Indonesian conventions. Evidence of P1-D Accretion at column-naming level.

#### Conceptual Abstraction

**Primitive P9-B — Epoch-Stratified Naming Conventions**
**Tag: `[ANTI-PRIMITIVE]`** + `[ERA-2010-LAN]`

Pattern: Long-lived schema accumulates **multiple naming conventions** dari different developer eras / generations. Newer conventions overlay older ones tanpa retroactive cleanup.

**Trade-off:**
- ✅ **Migration smooth** — no breaking change saat introducing new convention
- ❌ **Onboarding cost** — newcomer harus learn semua 4 conventions
- ❌ **AI/tooling friction** — code generators, ORMs, AI assistants harus handle convention drift
- ❌ **Refactoring resistance** — fixing inconsistency requires touching huge surface
- ❌ **Documentation gap** — "kenapa beberapa kolom no_X dan beberapa kolom kode_X?" tidak documented

**Why ANTI-PRIMITIVE + ERA-2010-LAN:**
- ANTI-PRIMITIVE: violates DRY, increases cognitive load
- ERA-2010-LAN: artifact dari era ketika refactoring schema diset cost (1500+ RS deployments)

**Modernization untuk SIMRS BT:**
- ✅ **Choose ONE convention** (suggestion: `id_*` for primary keys, English for international interop, Indonesian for domain-specific business terms)
- ✅ **Document convention** in schema design doc
- ✅ **Enforce via tooling** (lint rules, migration review)
- ✅ **Refactor freely di early phases** — cloud deploy makes coordinated migration cheap

---

### 2.4 H9.4 — Staging Tables for Data Transformation

#### Status: **REFINED** ⚠️ (pattern exists but distributed, not formalized)

#### Evidence Summary

**Explicit staging-prefix tables:**

| Pattern | Count |
|---|---|
| `temp_*` or `tmp_*` or `staging_*` or `stg_*` prefix | **2** (minimal) |
| `antri*` (antrian queue) tables | **5+** (antriapotek, antrianiterasi, antriaps, etc.) |
| `log_*` (specific integration logs) | At least 1 (`log_dukcapil_aceh`) |

**Pattern observed:** Khanza tidak punya **formalized staging schema**. Yang ada:
- **Antrian (queue) tables** — function as ephemeral state holders untuk workflow handoff
- **Integration log tables** — capture external API responses (e.g., dukcapil verification)
- **Implicit staging via status_lanjut** — record stays in main table dengan status flag indicating processing state

**Conclusion:** Pattern of staging EXISTS but adalah **distributed across naming conventions and table roles**, bukan eksplisit "staging table" concept. Mirror P3-C contextual master/operational pattern.

#### Conceptual Abstraction

**Primitive P9-C — Implicit Staging via Status Flags + Queue Tables**
**Tag: `[REQUIRES-CONTEXT]`**

Pattern: Untuk handle intermediate processing state (data masuk dari external → validation → committed to operational), Khanza pakai:
- Status columns di main table (status='pending' → status='committed')
- Queue tables (antrian) sebagai ephemeral holders
- Integration log tables untuk audit per vendor

Tidak ada formalized staging schema atau ETL pipeline.

**Trade-off:**
- ✅ **Simple** — no separate staging tier
- ✅ **Co-located data** — staged + committed in same table
- ❌ **No clear boundary** between "verified" and "unverified" data
- ❌ **Queries must always filter** by status (forgetting = surface unverified data)
- ❌ **No bulk staging ops** without affecting operational queries

**Modernization untuk SIMRS BT:**
- For external data ingestion (BPJS, SatuSehat), consider explicit staging schema
- Use Supabase: `staging` schema dengan dedicated tables, vs `public` operational schema
- Move from staging → operational via validated transaction
- Audit log per stage transition

---

### 2.5 H9.5 — Authorization Workaround

#### Status: **CONFIRMED via cross-reference** ✅

#### Evidence Summary

Pre-validated by Domain 7 P7-F (Authorization-as-Boolean-Matrix). **Authorization workaround IS the design** — bukan sub-pattern dari designed RBAC. Schema check confirmed: NO separate `role`, `permission`, `hak_akses`, `priviledge` tables. Entire authorization mechanism = `user.column_name = 'true'`.

**No new primitive** — P7-F adalah the entire authorization implementation, classified as anti-primitive (High severity) + era-specific.

---

## 3. Conceptual Primitives Extracted

| Primitif | Statement | Tag |
|---|---|---|
| **P9-A — Bridging Module as Heterogeneity Sink** | Dedicated module untuk accumulate external integration complexity | `[REQUIRES-CONTEXT]` (concept valid, scale extreme) |
| **P9-B — Epoch-Stratified Naming Conventions** | Multiple identifier prefixes (`no_`, `kd_`, `kode_`, `id_`) coexist dari different eras | `[ANTI-PRIMITIVE]` (High) + `[ERA-2010-LAN]` |
| **P9-C — Implicit Staging via Status Flags + Queue Tables** | No formal staging schema; status flags dan antrian tables function as ephemeral state | `[REQUIRES-CONTEXT]` |

**Tag distribution Domain 9:**

| Tag | Count |
|---|---|
| `[REQUIRES-CONTEXT]` | 2 (P9-A, P9-C) |
| `[ANTI-PRIMITIVE]` | 1 (P9-B — High severity, new entry) |
| `[ERA-2010-LAN]` | 1 partial (P9-B) |

**Note:** H9.1, H9.2, H9.5 confirmed mostly via cross-reference (P1-D, P7-F primitif sufficient). New primitives focus on novel insights dari Domain 9 specifically.

---

## 4. Combined Owner Gate Request (Domain 8 + 9)

### 4.1 Hasil Sub-Session 7 (Domain 8 + Domain 9 Paired)

**Total 11 hipotesis tested (6 Domain 8 + 5 Domain 9). Distribusi:**

| Status | Count |
|---|---|
| ✅ Confirmed via cross-reference | 5 (H8.1, H8.2, H8.5, H9.1, H9.5) |
| ✅ Confirmed (new validation) | 3 (H8.3, H8.6, H9.2) |
| ✅✅ Strongly Confirmed | 2 (H8.4, H9.3) |
| ⚠️ Refined | 1 (H9.4 — staging pattern distributed, not formalized) |
| ❌ Falsified | 0 |

### 4.2 New Anti-Primitives Identified

| ID | Pattern | Severity | Domain |
|---|---|---|---|
| **P8-D** | Error Capture Absent (Schema Level) | 🟠 High | 8 |
| **P9-B** | Epoch-Stratified Naming Conventions | 🟠 High + Era-Specific | 9 |

### 4.3 Updated "Patterns to Avoid" Running List

🔴 **Critical** (4): P7-E, P4-D, P6-B, P7-D
🟠 **High** (5 — two new additions): P4-C, P7-A, P7-F, **P8-D** ✨, **P9-B** ✨
🟡 **Nuanced** (1): P5-B
**Era-Specific Artifacts** (5+): P4-A, P4-B, P4-E, P7-C, P9-B (also)

Anti-primitive count progression sepanjang Phase 2:
- After Domain 4: 2 critical + 1 high
- After Domain 6: 3 critical + 2 high
- After Domain 7: 4 critical + 3 high
- After Domain 8+9: **4 critical + 5 high** (+1 nuanced) = **10 total**

**Convergence:** Phase 2 nearing close. Anti-primitive yield stabilizing. Domain 10 (catchall) unlikely to surface major new findings.

### 4.4 Significance Assessment

**Sub-session 7 mostly confirmatory** — predictions held via combined cross-reference + targeted new validation. **Two new High-severity anti-primitives** (P8-D, P9-B) significant additions to Patterns to Avoid list.

**Methodology validated:** Phase 1 hypothesis quality solid — confirmation density tinggi, falsification minimal (only 2 di all of Phase 2: H6.2 dan H7.5).

### 4.5 Mid-Phase Reflection Comparison

Per mid-phase reflection §10.3 plan: sub-session 7 = Domain 8+9 paired. **Executed as planned.** Sub-session 8 next = Domain 10 (catchall).

### 4.6 Boundary Discipline Verification

| Test | Result |
|---|---|
| Findings adalah konsep? | ✅ All P8-* and P9-* primitives at concept level |
| Platform-agnostic? | ✅ |
| Abstract enough? | ✅ |
| License-clean? | ✅ Counts, table prefix patterns, naming convention frequency — no method body atau SQL string copy |
| Relevan untuk SIMRS BT? | ✅ All primitives inform design decisions (especially P8-D error monitoring) |

### 4.7 Pertanyaan untuk Owner (Combined Domain 8 + 9)

1. **Approval status** Domain 8 + Domain 9?

2. **Sub-session 8** — Domain 10 (Other / catchall): saran options:
   - **Option A:** Run Domain 10 immediately (light effort, completes Phase 2)
   - **Option B:** Pause untuk Owner offline review before Domain 10
   - My recommendation: **Option A** — Domain 10 catchall is light, akan close Phase 2 cleanly

3. **Phase 2 → Phase 3 transition** — setelah Domain 10, saya recommend **dedicated Phase 2 closeout summary** (1 document) sebelum start Phase 3. Closeout berisi:
   - All P*-* primitives consolidated
   - Hypothesis test status comprehensive
   - Anti-primitives final list
   - Phase 3 prep checklist

4. **Anti-primitive count** — sudah 11 anti-primitives total (4 Critical + 6 High + 1 Nuanced). Apakah Owner ingin Critical Recommendations untuk Blueprint (currently 3 di mid-phase reflection §8.1-8.3) di-expand untuk include semua 4 Critical + maybe 1-2 top High, atau keep di 3 high-impact only?

5. **P8-D Error Capture** — apakah deserve inclusion di Critical Recommendations untuk Blueprint? Currently 🟠 High, tapi for TNI AD operational risk management context, mungkin **rise to Critical** because invisible system errors = operational liability untuk military medical facility?

---

**End of Phase 2 Domain 8 + Domain 9 paired validation. Awaiting Owner gate sebelum sub-session 8 (Domain 10).**
