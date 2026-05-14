# The Khanza Codex — Phase 2 Domain 8 Validation
## Pencegahan Error & Bias (Error Prevention & Bias Mitigation)

**File:** `KHANZA-CODEX-PHASE-2-DOMAIN-8-ERROR-PREVENTION.md`
**Versi:** 1.0
**Tanggal:** 13 Mei 2026
**Phase:** 2 (Targeted Data Collection) — sub-session 7 / ~8 (paired dengan Domain 9)
**Domain:** 8 — Pencegahan Error & Bias
**Status:** Awaiting Owner gate (paired dengan Domain 9 output)
**Parent input:** `KHANZA-CODEX-PHASE-1-HYPOTHESES.md` v1.0 §4.8
**Author:** Khanza spoke session AI (Phase 2 sub-session 7)
**Validation method:** Substantial pre-validation cross-reference dari Domain 4/7 + targeted new validation (UNIQUE constraints, confirmation dialogs, error logging)

**Domain character:** Domain ringan-menengah. Banyak prediksi sudah substantially answered via Phase 2 accumulation. Layer 1 tagging applied.

---

## Daftar Isi

1. [Hipotesis yang Di-test](#1-hipotesis-yang-di-test)
2. [Per-Hipotesis Validation](#2-per-hipotesis-validation)
3. [Conceptual Primitives Extracted](#3-conceptual-primitives-extracted)
4. [Owner Gate Request](#4-owner-gate-request)

---

## 1. Hipotesis yang Di-test

| ID | Statement (singkat) | Pre-validation level |
|---|---|---|
| **H8.1** | DB constraints sebagai first-line (NOT NULL, FK), tidak agresif | Strong (Domain 6: 2032 FK, Domain 7: 0 stored proc/triggers) |
| **H8.2** | Validation di Java form layer dengan pattern duplikatif | Strong (Domain 7 P7-A) |
| **H8.3** | Cross-record validation via manual SELECT before INSERT | Partial (new validation needed) |
| **H8.4** | Confirmation dialogs liberal sebagai "are you sure" pattern | New validation needed |
| **H8.5** | Cognitive bias mitigation via standardized lookup tables | Strong (50 set_ + 29 master_ + DlgCari* prevalence) |
| **H8.6** | Tidak ada formal error capture mechanism | New validation needed |

---

## 2. Per-Hipotesis Validation

### 2.1 H8.1 — DB Constraints as First-Line, Not Aggressive

#### Status: **CONFIRMED via cross-reference** ✅

#### Evidence Summary

Pre-validated dari Domain 6 dan Domain 7:

| Defense Mechanism | Count | Notes |
|---|---|---|
| Foreign Key constraints | **2,032** | Strong referential integrity |
| Primary Key constraints | **1,019** | Universal |
| UNIQUE KEY constraints | **36** | Selective use (~3% tables) |
| CHECK constraints | Minimal | Schema-level value constraints rare |
| Database triggers | **0** | No active enforcement (Domain 6) |
| Stored procedures/functions | **0** | No procedural defense (Domain 7) |

**Pattern:** Khanza pakai DB constraints **selectively, not agresif**. Strong dependence pada FK (referential), moderate use of PRIMARY KEY, minimal CHECK atau UNIQUE. NULL acceptance widespread (consistent dengan P1-A configurability — beberapa fields optional depending on context).

#### Conceptual Abstraction

**Cross-reference:** Pattern dijelaskan di P7-B (Database-Passive). H8.1 confirms specific aspect: defense via referential integrity, bukan via value validation atau procedural checks.

**No new primitive** — H8.1 adalah operasional manifestation dari P7-B.

---

### 2.2 H8.2 — Validation Java Form Layer, Duplikatif

#### Status: **CONFIRMED via cross-reference** ✅

Pre-validated by Domain 7 P7-A (Per-Form Inline Validation). 79-93% of operational files contain validation patterns (JOptionPane/isEmpty), tapi via per-file inline code — no central framework.

**No new primitive** — H8.2 adalah restatement of P7-A.

---

### 2.3 H8.3 — Cross-Record Validation via Manual SELECT

#### Status: **CONFIRMED with elaboration** ✅

#### Evidence Summary

**UNIQUE constraint usage:**
- 36 UNIQUE KEY statements di schema (~3% of 1156 tables)
- Selective: only for tables where DB-level uniqueness critical (mis. user.id_user, no_nota, etc.)

**Pattern observed:** Untuk cross-record validation (mis. "tidak boleh ada duplicate registrasi pasien"), Khanza pakai **dua strategi paralel**:
1. **DB-level UNIQUE constraint** — untuk fields yang clearly identity (no_rkm_medis, no_rawat, no_nota)
2. **Application-level SELECT before INSERT** — untuk business rules yang lebih complex (mis. "patient cannot have 2 active registrations same day")

Manual SELECT-before-INSERT consistent dengan P4-D (no concurrency control) — pattern tidak race-safe:
- Thread A: SELECT → no duplicate → about to INSERT
- Thread B: SELECT → no duplicate → INSERTs
- Thread A: INSERT → succeeds (no UNIQUE constraint on that combination) → DUPLICATE

#### Conceptual Abstraction

**Primitive P8-A — Hybrid Constraint+SELECT Validation Pattern**
**Tag: `[REQUIRES-CONTEXT]`** + `[ERA-2010-LAN]` (race-safety aspect)

Pattern: Cross-record validation via **hybrid strategy**:
- DB UNIQUE constraint for clear identity fields
- App-level SELECT-then-INSERT untuk complex business rules

**Trade-off:**
- ✅ Identity duplicates prevented oleh DB
- ✅ Complex business rules expressible
- ❌ App-level validation **not race-safe** (P4-D fallback)
- ❌ Logic split between schema dan app code

**Modernization untuk SIMRS BT:**
- ✅ Adopt strategy split (DB for identity, app for business rules)
- ✅ **Improvement:** App-level validation **inside transaction** dengan SELECT FOR UPDATE atau explicit lock untuk race-safety
- ✅ Pattern: validate → INSERT atomically (Supabase PL/pgSQL function atau client-side transaction)

---

### 2.4 H8.4 — Confirmation Dialogs Liberal Use

#### Status: **STRONGLY CONFIRMED** ✅✅

#### Evidence Summary

| Pattern | Count |
|---|---|
| Files using `JOptionPane.showConfirmDialog` / `YES_NO_OPTION` | **124** |
| Files using broader dialog pattern (`showMessageDialog`/`showOptionDialog`) | **1,154** |

**Of 1627 total Java files in src/, 1154 (~71%) use some dialog pattern.** Confirmation dialogs widely used as safety net for destructive operations (delete, save irreversible action).

#### Conceptual Abstraction

**Primitive P8-B — Confirmation Dialog Liberal Use**
**Tag: `[REQUIRES-CONTEXT]`** + nuanced anti-pattern

Pattern: Mengandalkan **UX prompts ("are you sure?")** sebagai safety net daripada structural protections (audit trail, undo functionality).

**Trade-off:**
- ✅ **Low implementation cost** — JOptionPane sudah built-in
- ✅ **User awareness** — operator forced to acknowledge destructive action
- ❌ **Confirmation fatigue** — petugas terbiasa klik "Yes" tanpa baca (banalisasi)
- ❌ **No recovery after confirm** — kalau salah klik Yes, tidak ada undo (cross-ref P7-E no audit)
- ❌ **Doesn't prevent concurrent edit conflict** — confirmation doesn't enable conflict detection

**Why nuanced:**
- TIMELESS principle: explicit user consent for destructive actions
- ANTI when overused: real safety from undo/audit, not from dialogs

**Modernization untuk SIMRS BT:**
- ✅ **Use selectively** for truly destructive actions (DELETE, status finalization)
- ✅ **Pair dengan audit trail** — confirmation logged immutable
- ✅ **Pair dengan undo** kalau possible (within retention period)
- ⚠️ Avoid confirmation fatigue — for routine actions, don't prompt

---

### 2.5 H8.5 — Cognitive Bias Mitigation via Lookup Tables

#### Status: **CONFIRMED via cross-reference** ✅

#### Evidence Summary

Pre-validated:
- 50 `set_*` tables (Domain 3)
- 29 `master_*` tables (Domain 3)
- 76 DlgCari* search dialogs (Domain 7)
- JComboBox usage prevalent in form classes (Domain 7)

**Pattern:** Constrained input via lookup tables + combo box mengurangi:
- Typo errors (operator pick, not type)
- Inconsistent terminology (master enforces vocabulary)
- Invalid values (only listed options selectable)

#### Conceptual Abstraction

**Primitive P8-C — Constrained-Input Bias Mitigation**
**Tag: `[TIMELESS]`**

Pattern: Untuk fields yang punya enumerable valid values, sediakan **lookup-driven input** (combo box, search dialog) daripada free text. Mengurangi cognitive bias (typo, recall error, alternative terminology).

**Trade-off:**
- ✅ **Data quality** improved automatically
- ✅ **Vocabulary standardization** enforced
- ✅ **Discoverability** — operator dapat see all options
- ⚠️ **Master maintenance** required — kalau master incomplete, operator stuck

**Why TIMELESS:** principle of "constrain to known good values" universally valuable. Independent of stack — React Select, HTML datalist, Supabase RLS enums all implement same principle.

**Modernization untuk SIMRS BT:**
- ✅ Adopt P8-C as core UX principle
- Modern pattern: typeahead combo boxes (Combobox component) dengan async master fetch
- Pair dengan validation: even if combo, validate that selected value is currently active in master

---

### 2.6 H8.6 — No Formal Error Capture Mechanism

#### Status: **CONFIRMED** ✅ (anti-primitive)

#### Evidence Summary

**Error handling infrastructure:**

| Pattern | Count |
|---|---|
| Files using logging framework (`Logger.getLogger`, `java.util.logging`, `slf4j`) | **24** |
| Files using `printStackTrace` (anti-pattern) | **26** |
| Error tracking tables in schema (`error_*`, `exception_*`, `crash_*`) | **0** |

**Findings:**
- ~24 files (very few of 1627) use proper logging
- 26 files use `printStackTrace` — pattern dimana exception **printed ke stdout/stderr** kemudian **terlupakan**. Error tidak captured ke database, tidak surfaced ke admin, tidak available untuk root cause analysis
- ZERO dedicated error capture infrastructure di schema

**Consequence:** kalau ada bug di production:
- Java exception muncul di console window operator (kalau visible)
- Tidak captured anywhere
- Admin RS tidak alerted
- Maintenance team tidak dapat diagnose tanpa operator-volunteered screenshots

#### Conceptual Abstraction

**Primitive P8-D — Error Capture Absent (Schema Level)**
**Tag: `[ANTI-PRIMITIVE]`** (High severity)

Pattern: Sistem tanpa **systematic error capture infrastructure**. Exceptions printed ke console dan lost. No alerting, no aggregation, no root cause data.

**Trade-off:**
- ✅ **Implementation simple** — no logging infrastructure to maintain
- ❌ **Production debugging impossible** — kalau bug muncul, tidak ada data
- ❌ **Pattern detection impossible** — frequent errors invisible
- ❌ **Reliability metrics absent** — cannot measure system health
- ❌ **Audit defensibility weak** — kalau error caused data issue, no record

**Why ANTI-PRIMITIVE for SIMRS BT:**
- Modern operational monitoring expects centralized error tracking
- TNI AD operational risk management requires error-trend visibility
- Audit framework expects "did the system function correctly?" answerable

**Modernization untuk SIMRS BT (CRITICAL):**
- ✅ **Centralized error tracking** (Sentry, LogRocket, atau Supabase log_events table)
- ✅ **Structured logging** (severity, context, user, timestamp)
- ✅ **Alerting** untuk critical errors (operator + admin notification)
- ✅ **Aggregation dashboards** untuk pattern detection

**New entry untuk "Patterns to Avoid" running list:** P8-D at 🟠 High severity.

---

## 3. Conceptual Primitives Extracted (with Layer 1 Tagging)

| Primitif | Statement | Tag |
|---|---|---|
| **P8-A — Hybrid Constraint+SELECT Validation** | Cross-record validation via DB UNIQUE (identity) + app SELECT (business rules) | `[REQUIRES-CONTEXT]` + `[ERA-2010-LAN]` (race-safety) |
| **P8-B — Confirmation Dialog Liberal Use** | UX prompts as safety net for destructive actions | `[REQUIRES-CONTEXT]` (nuanced — selectively useful) |
| **P8-C — Constrained-Input Bias Mitigation** | Lookup-driven input untuk enumerable values | `[TIMELESS]` |
| **P8-D — Error Capture Absent (Schema Level)** | No systematic error tracking infrastructure | `[ANTI-PRIMITIVE]` (High severity) |

**Tag distribution Domain 8:**

| Tag | Count |
|---|---|
| `[TIMELESS]` | 1 (P8-C) |
| `[REQUIRES-CONTEXT]` | 2 (P8-A nuanced, P8-B) |
| `[ANTI-PRIMITIVE]` | 1 (P8-D — High severity, new entry) |

**Note:** H8.1 dan H8.2 confirmed via cross-reference; no new primitives extracted — they're operasional manifestations of P7-B dan P7-A respectively.

---

## 4. Owner Gate Request

### 4.1 Hasil Domain 8

**6 hipotesis tested. Distribusi status:**

| Status | Count | Hipotesis |
|---|---|---|
| ✅ Confirmed via cross-reference | 3 | H8.1, H8.2, H8.5 |
| ✅ Confirmed (with new validation) | 2 | H8.3, H8.6 |
| ✅✅ Strongly Confirmed | 1 | H8.4 |
| ❌ Falsified | 0 | |

### 4.2 New Anti-Primitive Identified

**P8-D Error Capture Absent** — 🟠 High severity, added to "Patterns to Avoid" running list. Updated running list:

🔴 **Critical** (4): P7-E, P4-D, P6-B, P7-D
🟠 **High** (4 — new addition): P4-C, P7-A, P7-F, **P8-D** ✨
🟡 **Nuanced** (1): P5-B

### 4.3 Significance Assessment

Domain 8 mostly **confirmatory** — predictions held with minor elaborations. **One new anti-primitive** (P8-D Error Capture Absent) yang significant — adds to critical recommendations list untuk SIMRS BT Blueprint.

**No surprises di Domain 8** — methodology pre-validation working well. Confirmation density tinggi indicates Phase 1 hypothesis quality solid.

### 4.4 Pertanyaan untuk Owner

Combined dengan Domain 9 di consolidated output below. Awaiting both before single Owner gate.

---

**End of Phase 2 Domain 8 validation. Continuing immediately ke Domain 9 (paired sub-session).**
