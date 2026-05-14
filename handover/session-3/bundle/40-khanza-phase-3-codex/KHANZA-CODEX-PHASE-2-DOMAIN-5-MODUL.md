# The Khanza Codex — Phase 2 Domain 5 Validation
## Modul (Modular Composition)

**File:** `KHANZA-CODEX-PHASE-2-DOMAIN-5-MODUL.md`
**Versi:** 1.0
**Tanggal:** 13 Mei 2026
**Phase:** 2 (Targeted Data Collection) — sub-session 2 / 10 (paired dengan Domain 6)
**Domain:** 5 — Modul
**Status:** Awaiting Owner gate (§7.5 Phase 1 bundle)
**Parent input:** `KHANZA-CODEX-PHASE-1-HYPOTHESES.md` v1.0 §4.5
**Author:** Khanza spoke session AI (Phase 2 sub-session 2)
**Validation method:** Folder structure analysis (`src/`, root sub-projects) + import dependency counting + cross-package SQL access patterns. No verbatim code copy.

---

## Daftar Isi

1. [Hipotesis yang Di-test](#1-hipotesis-yang-di-test)
2. [Per-Hipotesis Validation](#2-per-hipotesis-validation)
3. [Cross-Hipotesis Observations](#3-cross-hipotesis-observations)
4. [Conceptual Primitives Extracted](#4-conceptual-primitives-extracted)
5. [Owner Gate Request](#5-owner-gate-request)

---

## 1. Hipotesis yang Di-test

| ID | Statement (singkat) | Original prediction |
|---|---|---|
| **H5.1** | Pemisahan modul follow struktur organisasi RS Indonesia, bukan technical layer | Packages = poli, apotek, kasir, akuntansi, kepegawaian (organizational) |
| **H5.2** | Billing & akuntansi dipisah tegas dengan ownership berbeda | Dua paket berbeda, one-way dependency |
| **H5.3** | Bridging eksternal dipisah karena lifecycle berbeda | Code physically separated, versioning independen |
| **H5.4** | Modul vertikal niche tolerate per-modul independence | Standalone, opsional, dapat di-disable |
| **H5.5** | Tidak ada enforced module boundary | Shared DB access, no module-private schemas, no interface contracts |

**Source area:** `src/` (30 packages, ~2000+ Java files), root-level sub-projects (46 folders, 23 dengan independent build.xml).
**Method:** structural enumeration, dependency import counting, cross-package query analysis.

---

## 2. Per-Hipotesis Validation

### 2.1 H5.1 — Module Separation Follows Organizational Units

#### Status: **CONFIRMED** ✅

#### Evidence Summary

`src/` berisi 30 packages. Klasifikasi by intent:

**Organizational (RS operational units) — 14 packages:**

| Package | Domain RS | File count (Java) |
|---|---|---|
| `rekammedis/` | Rekam Medis | 239 |
| `keuangan/` | Bagian Keuangan (Kasir + Akuntansi + Jurnal) | 167 |
| `kepegawaian/` | HRD / Personalia | 73 |
| `inventory/` | Logistik / Gudang | 118 |
| `inventaris/` | Asset Management | 35 |
| `ipsrs/` | Instalasi Pemeliharaan Sarana RS | 44 |
| `dapur/` | Dapur / Gizi | 36 |
| `surat/` | Persuratan | 43 |
| `toko/` | Toko / Koperasi RS | 35 |
| `parkir/` | Parkir | — |
| `perpustakaan/` | Perpustakaan | 16 |
| `tranfusidarah/` | Bank Darah | — |
| `permintaan/` | Permintaan Barang | 17 |
| `ziscsr/` | ZIS / CSR (Zakat, Infaq, Sedekah / CSR) | — |

**Integration / Technical (cross-cutting) — 8 packages:**

| Package | Fungsi |
|---|---|
| `bridging/` | External integration (BPJS, SatuSehat, lab analyzers, dll.) — 261 files |
| `laporan/` | Reporting (JasperReports) — 108 files |
| `grafikanalisa/` | Analytics / charts — 148 files |
| `informasi/` | Information displays |
| `fungsi/` | Utility functions — 46 files |
| `setting/` | Configuration — 33 files |
| `restore/` | DB restore utilities — 18 files |
| `widget/` | UI components — 35 files |

**UI / Presentation — 6 packages** (48x48 icons, picture, sms*, viabarcode).

**Core — 1 package:** `simrskhanza/` (main app entry — 72 files).

**Klasifikasi result:** **0 packages follow technical layer** (mis. `controllers/`, `services/`, `repositories/`, `dao/`). Semua packages adalah **organizational** (mirror RS bagian) atau **cross-cutting concerns** (bridging/reporting/widget). Pattern sangat clear.

**Counter-test:** kalau Khanza pakai layered architecture, kita harapkan melihat package seperti `service/`, `controller/`, `dao/`, `model/` — tidak ditemukan. Bahkan `fungsi/` (utility) hanya berisi helpers, bukan a service layer.

#### Conceptual Abstraction

**Primitive P5-A — Organizational Codebase Topology**

Pattern: source code di-organize **mirror struktur organisasi domain** (RS bagian: poli, kasir, gudang, dapur), **bukan** mirror technical layers (presentation, business, data).

Konsekuensi konseptual:
- ✅ **Discoverability** untuk domain people — kalau bicara dengan staf RS yang bekerja di "dapur", code mereka ada di `src/dapur/`
- ✅ **Conway's Law alignment** — code structure matches communication structure dalam RS
- ❌ **Technical concerns tersebar** — UI, business logic, dan SQL queries semua dalam satu package per modul
- ❌ **Lebih sulit refactor secara horizontal** — kalau pattern presentation berubah, harus touch banyak packages

---

### 2.2 H5.2 — Billing & Akuntansi Dipisah Tegas

#### Status: **REFINED** ⚠️

#### Evidence Summary

Hipotesis original menyatakan billing dan akuntansi dipisah sebagai "dua modul dengan ownership berbeda" dengan "one-way dependency". Kenyataan:

**Struktur `src/keuangan/`:**
- **333 files (Java + .form)** dalam **flat directory** — tidak ada sub-directory billing/ vs akuntansi/
- Billing files (prefix `DlgBiling*`): DlgBilingParsialRalan, DlgBilingRalan, DlgBilingRanap, dll.
- Akuntansi files (prefix `DlgAkun*`, `DlgJurnal*`): DlgAkunBayar, DlgAkunPenagihanPiutang, DlgJurnal, DlgJurnalHarian, dll.
- Mixed dalam SAME PACKAGE, dipisahkan hanya oleh **naming convention** di filename

**Implikasi:** billing dan akuntansi **TIDAK terpisah secara physical/package**. Mereka share:
- Same package = same import scope
- Same classpath = no dependency direction control
- Same compilation unit = always built together

Yang **terpisah** adalah **conceptual workflow**:
- Billing menghasilkan transaksi operasional (kasir, kwitansi)
- Akuntansi memproses jurnal (debit-kredit, buku besar)

Tapi pemisahan ini hanya di **naming convention** (DlgBiling vs DlgAkun vs DlgJurnal), bukan di package structure.

#### Refined Statement (H5.2')

> **H5.2' — Khanza memisahkan billing dan akuntansi secara konseptual (different workflow + different output) tapi PHYSICALLY share single package `keuangan/`.** Tidak ada package-level boundary; pemisahan hanya via naming convention di filename. Konsekuensi: tidak ada dependency direction control — billing files dapat import akuntansi class dan vice versa tanpa friction.

#### Conceptual Abstraction

**Anti-primitive P5-B — Naming-Convention-as-Boundary**

Pattern yang Khanza tampak adopt: **logical separation via naming convention**, **bukan** physical separation via package/module structure.

**Trade-off:**
- ✅ Cheap to create — tidak perlu refactor package structure
- ✅ Flexible — kalau "billing" tabrakan dengan "akuntansi" di workflow tertentu, easy untuk share code
- ❌ **Tidak enforceable** — compiler tidak help kalau coder cross-reference yang seharusnya tidak
- ❌ Knowledge transfer dependent on convention awareness
- ❌ Over time, convention drift — file baru mungkin tidak follow pattern

**Implikasi untuk SIMRS BT:** kalau audit independence antara billing dan akuntansi penting (yang relevant untuk BPK/Itjenad audit), **physical separation** lebih defensible daripada naming convention.

---

### 2.3 H5.3 — Bridging Dipisah karena Lifecycle Berbeda

#### Status: **STRONGLY CONFIRMED** ✅✅

#### Evidence Summary

Validasi menemukan **dual-layer separation** untuk bridging:

**Layer 1 — Internal package `src/bridging/`:**
- **486 files** — substantial package dalam main app
- Berisi bridging logic yang masih bundled dengan main app (compile-time dependency)

**Layer 2 — Independent sub-projects (23 dengan build.xml mandiri):**

| Sub-project | Domain | Independent build? |
|---|---|---|
| `KhanzaHMSServiceAplicare/` | BPJS Aplicare (kamar) | ✅ Own build.xml |
| `KhanzaHMSServiceMobileJKN/` | Mobile JKN antrian | ✅ Own build.xml |
| `KhanzaHMSServiceMobileJKNERM/` | Mobile JKN extension | ✅ |
| `KhanzaHMSServiceMobileJKNFKTP/` | Mobile JKN FKTP | ✅ |
| `KhanzaHMSServicePCare/` | BPJS PCare | ✅ Own build.xml |
| `KhanzaHMSServiceSatuSehat/` | Kemenkes SatuSehat (FHIR) | ✅ Own src/, build, setting |
| `KhanzaHMSServiceSIRSYankes/` | SIRS Online Kemenkes | ✅ |
| `KhanzaHMSServiceSPDGT/` | SPGDT emergency | ✅ |
| `KhanzaHMSServiceMandiri/` | Bank Mandiri | ✅ |
| `api-bpjsfktl/`, `api-bpjsfktp/` | API BPJS variants | ✅ |
| `api-bridgingradiologi/` | PACS bridging | ✅ |
| `bankjateng/`, `bankpapua/`, `bjb/` | Regional banks | ✅ |

**Kunci finding:** setiap sub-project punya **own `setting/database.ini`** — mereka berjalan sebagai **independent runtime processes**, dengan koneksi DB sendiri (bisa pointing ke sik database yang sama atau staging DB terpisah).

**Implikasi lifecycle:** ketika BPJS, SatuSehat, atau lab analyzer API berubah:
- Update **hanya** sub-project terkait
- **Tidak perlu** recompile / redeploy main Khanza app
- Sub-project versioning independen

**Pattern naming layered historis** observable: `KhanzaHMSServiceMobileJKN`, `KhanzaHMSServiceMobileJKNERM`, `KhanzaHMSServiceMobileJKNFKTP` — tiga versi Mobile JKN yang co-exist. Khanza tidak buang versi lama saat regulator BPJS rilis variant baru; semua versions coexist sebagai isolated sub-projects.

#### Conceptual Abstraction

**Primitive P5-C — Lifecycle-Isolation via Process Boundary**

Pattern: komponen dengan **lifecycle berbeda** (high-frequency change vs stable) di-isolate via **OS process boundary** (separate runtime), bukan hanya via package/module boundary.

**Mekanisme:**
- Compile-time isolation: separate `build.xml`, separate `src/`, separate JAR output
- Runtime isolation: separate process, own `database.ini`, own classpath
- Deployment isolation: dapat update + deploy independent dari main app

**Trade-off:**
- ✅ **Update agility** — high-volatility code dapat update tanpa risk ke core
- ✅ **Versioning freedom** — multiple versions coexist (Mobile JKN v1, v2, v3 paralel)
- ✅ **Failure isolation** — kalau bridging crash, main app tetap operational
- ❌ **Operational complexity** — bukan satu process, banyak processes yang harus running + monitored
- ❌ **No type sharing** — domain types harus serialized/deserialized antar processes (typically via DB rows + SQL)

**Implikasi untuk SIMRS BT:** modern web stack equivalent adalah **microservices** atau **separate Supabase edge functions per integrator**. Pattern of process-boundary-for-lifecycle-isolation tetap berlaku.

---

### 2.4 H5.4 — Vertical Niche Modules Tolerate Independence

#### Status: **REFINED** ⚠️

#### Evidence Summary

Hipotesis original implikasi independence dichotomy (independent vs coupled). Kenyataan adalah **spektrum**:

**Cross-package imports dari niche modules ke rekammedis/keuangan (proxy untuk core coupling):**

| Niche Module | Imports from rekammedis/keuangan | Independence Tier |
|---|---|---|
| `parkir/` | **0** | 🟢 Fully independent |
| `perpustakaan/` | **0** | 🟢 Fully independent |
| `tranfusidarah/` | **2** | 🟡 Mostly independent (touches patient context) |
| `dapur/` | **11** | 🟠 Partially coupled (meal orders tied to encounter) |
| `ipsrs/` | **13** | 🟠 Partially coupled (work orders tied to ruangan, sometimes encounter) |

**Insight:** independence Khanza adalah **workflow-driven**, bukan dogmatic:
- **Truly independent** (parkir, perpustakaan): activities tidak require knowledge of pasien atau encounter
- **Patient-touching** (tranfusidarah): perlu patient context untuk match darah ke pasien, tapi tidak fully embedded di clinical workflow
- **Encounter-touching** (dapur, ipsrs): order makanan untuk ranap pasien, perbaikan AC di ruangan tempat pasien dirawat — natural touch encounter context

#### Refined Statement (H5.4')

> **H5.4' — Khanza tolerate per-modul independence dalam SPEKTRUM, bukan binary.** Modul vertikal yang activity-nya **tidak menyentuh patient/encounter context** (parkir, perpustakaan) adalah truly independent. Modul yang activity-nya **natural touch encounter** (dapur, ipsrs) accept partial coupling karena workflow benar-benar memerlukan context tersebut. Tidak ada attempt untuk make all modules independent — yang ada adalah **workflow-realistic coupling level**.

#### Conceptual Abstraction

**Primitive P5-D — Workflow-Realistic Coupling Spectrum**

Pattern: module independence di-treat sebagai **spectrum**, dengan coupling level **proporsional dengan workflow integration kebutuhan**. Tidak ada attempt force semua modules ke same independence level.

**Implikasi untuk SIMRS BT:** kalau membangun modul niche (mis. parkir, kantin, dapur), realistis evaluate **apakah benar-benar perlu touch encounter context** — kalau ya, coupling acceptable; kalau tidak, push untuk full independence.

---

### 2.5 H5.5 — No Enforced Module Boundary

#### Status: **STRONGLY CONFIRMED** ✅✅

#### Evidence Summary

**Bukti kuat tidak ada enforced boundary:**

1. **Zero Java interfaces** di `src/`:
   - Grep `^public interface\|^interface ` di seluruh `src/` → **0 hits**
   - Pattern: no contracts antar packages, no abstraction
   - Konsekuensi: cross-package coupling adalah **direct class-level**, tidak ada API surface yang dapat di-version

2. **Shared table access dari banyak packages:**

| Table | Distinct packages yang query | Implikasi |
|---|---|---|
| `dokter` | **14 packages** | Master data yang universally accessed |
| `reg_periksa` | **13 packages** | Encounter pivot — query from anywhere |
| `pasien` | **11 packages** | Patient master — same |
| `petugas` | **11 packages** | User/employee master |
| `databarang` | **8 packages** | Inventory items |

Tidak ada package yang punya **private schema** atau **module-internal tables**. Semua tables shared, accessible by SELECT dari any package.

3. **No interface contract → no dependency direction control:**
   - Tidak ada `import` rules
   - Tidak ada module loader / OSGi-style isolation
   - Java compile tidak akan reject `import keuangan.DlgBilingRalan` dari `inventory/...`

#### Conceptual Abstraction

**Primitive P5-E — Convention-Over-Enforcement Module Discipline**

Pattern: **module boundary** dalam Khanza adalah **konvensi sosial + organizational**, bukan **technical enforcement**.

Mekanisme actual yang Khanza pakai untuk "boundary":
- ✅ Package naming reflect organization (P5-A)
- ✅ Documentation + tribal knowledge tentang siapa-owns-apa
- ❌ Compiler tidak help — no interfaces, no module system
- ❌ Code review burden — humans must catch cross-boundary violations

**Trade-off:**
- ✅ **Cheap to evolve** — boundary dapat shift kalau workflow berubah, tanpa refactor heavy
- ✅ **Low friction** — programmer dapat go cross-package untuk solve emergent need
- ❌ **Over time, boundary erosion** — partial coupling accumulates
- ❌ **Audit difficulty** — tidak dapat answer "yang touch tabel X siapa saja?" tanpa grep-based investigation

**Implikasi untuk SIMRS BT:** TypeScript + monorepo dengan **module boundary enforcement** (mis. ESLint rules untuk forbid certain imports, atau Nx-style enforced project boundaries) menawarkan **engineering discipline yang Khanza miss**. Worth investing early.

---

## 3. Cross-Hipotesis Observations

### 3.1 Three-Layer Module Hierarchy

Pattern lintas H5.1 + H5.3 + H5.4:

Khanza punya **3 layer module organization** yang berbeda dalam compile-time + runtime properties:

```
LAYER 1 — Core Khanza (main JAR, single process)
├── Organizational packages (rekammedis, keuangan, kepegawaian, etc.)
├── Cross-cutting packages (bridging, laporan, grafikanalisa, fungsi)
└── UI/widget packages (widget, smsui, etc.)

LAYER 2 — Vertical niche (boleh standalone, share DB)
├── parkir, perpustakaan (truly independent — could be separate apps)
└── (Tetap bagian dari main JAR untuk simplicity)

LAYER 3 — Integration sub-projects (separate JARs, separate processes)
├── KhanzaHMS Service* (BPJS, SatuSehat, lab variants)
├── api-bpjs* (API wrappers)
└── bank* (bank integrations)
```

Layer 1+2 share **process boundary** dan **classpath**. Layer 3 punya **own process** dan **own classpath**.

**Distinction yang penting:** Layer 1+2 = **internal module** (no enforcement); Layer 3 = **service module** (process-level isolation). Pattern Khanza adalah: ketika lifecycle gap besar, push ke Layer 3.

### 3.2 Selective Discipline

Pattern lintas H5.2 + H5.5:

Khanza menerapkan **selective discipline** untuk module structure:

| Concern | Discipline Khanza | Comment |
|---|---|---|
| Code organization | Strict by domain (P5-A) | Naming sangat konsisten |
| Logical workflow separation | Convention only (P5-B) | E.g. billing vs akuntansi di same package |
| Lifecycle isolation | Strict via process (P5-C) | Sub-project boundary enforced |
| Module-internal contracts | None (P5-E) | No interfaces, shared DB |
| Workflow coupling | Realistic spectrum (P5-D) | Accept what's natural |

Pattern: **enforcement intensity proporsional dengan cost of misuse**:
- Misuse lifecycle (mis. tightly couple BPJS to core) = expensive ⟶ strict enforcement
- Misuse code organization (mis. put doctor logic in dapur) = visible ⟶ convention works
- Misuse logical workflow (mis. billing import akuntansi) = subtle ⟶ no enforcement, accept drift

### 3.3 Conway's Law in Action

Code structure (`src/dapur/`, `src/ipsrs/`, `src/perpustakaan/`) mirror **RS organizational chart**. Ini bukan accident — Khanza tampak dibangun **bottom-up** dengan setiap modul muncul dari kebutuhan bagian RS spesifik. Conway's Law: "*organizations design systems that mirror their communication structure*."

Implikasi: **codebase Khanza dapat di-read sebagai map organisasi RS**. Untuk SIMRS BT, pertanyaan: apakah ingin **mirror RS Batin Tikal organization** (akhirnya Conway's Law akan hit anyway), atau **paksa technical architecture** dan accept friction?

---

## 4. Conceptual Primitives Extracted

| Primitif | Statement | Validity |
|---|---|---|
| **P5-A — Organizational Codebase Topology** | Source code dapat di-organize mirror domain organizational structure (operational units), bukan technical layers | Confirmed (H5.1) |
| **P5-B — Naming-Convention-as-Boundary** *(anti-primitive)* | Logical separation via naming convention bekerja tapi tidak enforceable; trade-off cheap vs auditable | Confirmed (H5.2 refined) |
| **P5-C — Lifecycle-Isolation via Process Boundary** | Komponen dengan lifecycle berbeda di-isolate via OS process boundary (separate runtime), bukan hanya module boundary | Confirmed (H5.3) |
| **P5-D — Workflow-Realistic Coupling Spectrum** | Module independence adalah spectrum, dengan coupling level proporsional dengan workflow integration kebutuhan | Confirmed (H5.4 refined) |
| **P5-E — Convention-Over-Enforcement Module Discipline** | Internal module boundary di-enforce via convention + social discipline, bukan via technical mechanism | Confirmed (H5.5) |

---

## 5. Owner Gate Request

### 5.1 Hasil Sub-Session (Domain 5 portion)

**5 hipotesis tested. Distribusi status:**

| Status | Count | Hipotesis |
|---|---|---|
| ✅ Confirmed | 1 | H5.1 |
| ✅✅ Strongly Confirmed | 2 | H5.3, H5.5 |
| ⚠️ Refined | 2 | H5.2 (physical share package), H5.4 (spectrum not binary) |
| ❌ Falsified | 0 | (none) |

### 5.2 Boundary Discipline Verification

| Test | Result | Notes |
|---|---|---|
| Findings adalah konsep? | ✅ | P5-A through P5-E |
| Platform-agnostic? | ✅ | Semua applicable ke TypeScript monorepo, microservices, dll. |
| Abstract enough? | ✅ | Trade-offs articulated explicit |
| License-clean? | ✅ | No code copy; file/folder names + Java syntax keywords (interface, import) sebagai metadata reference |
| Relevan untuk SIMRS BT? | ✅ | P5-C dan P5-E langsung impact arsitektur SIMRS BT (microservices boundary + TypeScript module enforcement) |

### 5.3 Catatan untuk Owner

- **H5.2 refinement** punya implikasi audit-defensibility untuk SIMRS BT yang Itjenad/BPK readable. Owner mungkin ingin reflect ini di final Codex synthesis (Phase 3+).
- **P5-C (lifecycle isolation)** adalah primitif yang **paling actionable** untuk SIMRS BT phase 2 design — pattern bridging service architecture langsung adopt-able conceptually.
- **No falsifications** di Domain 5 — semua hipotesis hold, beberapa needed refinement untuk lebih akurat.

---

**End of Phase 2 Domain 5 validation. Continuing to Domain 6 in same sub-session per Owner pairing direction.**
