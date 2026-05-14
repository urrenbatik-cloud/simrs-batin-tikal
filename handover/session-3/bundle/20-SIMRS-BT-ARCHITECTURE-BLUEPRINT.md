# SIMRS Batin Tikal — Strategic Architecture & Ecosystem Blueprint

**Status:** Phase Strategic Concepting + Phase 3 Khanza Codex integrated — Owner-approved framing; ready for downstream workstream initiation + SIMRS BT Phase 2 spoke session consumption
**Document type:** Authoritative reference blueprint untuk ekosistem RS Batin Tikal data infrastructure
**Audience:** Owner, RS leadership stakeholders (Karumkit, Sie Renbang, Panji team), future AI development sessions, SIMRS BT Phase 2 spoke session
**Owner:** dr Ferry (Successor)
**Tanggal:** 13 Mei 2026
**Versi:** 2.0 — Full integration Phase 3 Khanza Codex Closure Bundle findings (D3 IMPLICATIONS-FOR-SIMRS-BT v1.0). Adds: Three Deep Theoretical Choices (§4.7), nine Architectural Patterns (§5.6), 4-chain inversion sequencing (§9 — replaced v1.0 macro phasing with strict architectural inversion order; macro content now resides in §5.5/§6.4/§7/§10), anti-primitives risk augmentation (§11 expanded), 12 TIMELESS primitives catalog (Appendix A), Phase 3 bundle cross-reference (Appendix B).
**Supersedes:** `TRACK-S-DATA-SOVEREIGNTY-BLUEPRINT.md` v1.1 (legacy framing yang conflated SIMRS build dengan bridge layer); v1.0 of this blueprint (pre-Phase 3 integration baseline — preserved as `SIMRS-BT-BLUEPRINT-V1-FROZEN.md` rollback reference)
**Source authority for v2.0 integration:** `KHANZA-CODEX-PHASE-3-IMPLICATIONS-FOR-SIMRS-BT.md` v1.0 (Phase 3b output, Owner-approved per Phase 3 Closure Lineage L039-L041)

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Tujuan Strategis](#2-tujuan-strategis)
3. [Dasar Hukum & Regulatori](#3-dasar-hukum--regulatori)
4. [Architecture Concept — Three-Workstream Model](#4-architecture-concept--three-workstream-model)
5. [SIMRS Batin Tikal — Workstream Detail](#5-simrs-batin-tikal--workstream-detail)
6. [SIKESUMA's Complementary Role](#6-sikesumas-complementary-role)
7. [Track-S Bridge — STUB Position](#7-track-s-bridge--stub-position)
8. [Khanza Codex Integration](#8-khanza-codex-integration)
9. [Inversion Sequencing & Implementation Order](#9-inversion-sequencing--implementation-order)
10. [Phase Decisions (Carried Over)](#10-phase-decisions-carried-over)
11. [Risk Register & Mitigation](#11-risk-register--mitigation)
12. [Operational Considerations](#12-operational-considerations)
13. [Cross-Reference & Glossary](#13-cross-reference--glossary)
14. [Document Lifecycle](#14-document-lifecycle)

**Appendices (Phase 3 Khanza Codex Integration — added v2.0):**

- [Appendix A — TIMELESS Primitives Catalog](#appendix-a--timeless-primitives-catalog-phase-3-khanza-codex-adoption)
- [Appendix B — Phase 3 Khanza Codex Closure Bundle Cross-Reference](#appendix-b--phase-3-khanza-codex-closure-bundle-cross-reference)

---

## 1. Executive Summary

### 1.1 Apa yang blueprint ini cover

Blueprint ini adalah **dokumen referensi authoritative** untuk ekosistem data RS Batin Tikal — mencakup SIMRS Batin Tikal (pembangunan sistem informasi RS sendiri), SIKESUMA (aplikasi spesifik TNI AD yang sudah dalam pengembangan), Track-S Bridge (sync layer ke vendor eksisting), dan Khanza Codex (reference work untuk inform pembangunan).

Dokumen ini menggantikan pendekatan sebelumnya di `TRACK-S-DATA-SOVEREIGNTY-BLUEPRINT.md` v1.1 yang mencampur konsep "pembangunan SIMRS" dengan "jembatan ke vendor". Reframe yang lebih akurat menempatkan keduanya sebagai workstream berbeda dengan dependency dan timeline yang berbeda pula.

### 1.2 Three-workstream model

Inti reframe: ekosistem RS Batin Tikal terdiri dari **tiga workstream paralel** dengan dependency chain yang jelas:

| Workstream | Sifat | Output | Timing |
|---|---|---|---|
| **Khanza Codex** | Reference work (analisa konseptual) | Dokumen referensi 1000–2000 baris | Tahap 1 (2–4 minggu) |
| **SIMRS Batin Tikal** | Pembangunan sistem informasi RS | Operational SIMRS dengan pilot di Sie Renbang | Tahap 2 (3–5 bulan) |
| **Track-S Bridge** | Sync layer ke vendor eksisting | Mechanism sinkronisasi RS ↔ vendor | Tahap 3 (later — saat SIMRS BT sudah matang) |

Di samping itu, **SIKESUMA continued development** berjalan independen di tier-based roadmap (Tier 5a, 5b, 6, 7+), dengan **bidirectional knowledge flow** ke SIMRS Batin Tikal di Tahap 2.

### 1.3 Apa yang BUKAN scope dokumen ini

- Spesifikasi teknis detail (akan dibuat di sub-blueprint per workstream)
- Implementation code untuk SIMRS Batin Tikal (Phase 2 deliverable, bukan blueprint)
- Khanza Codex content itself (di-deliver oleh Khanza spoke session, lihat `KHANZA-SPOKE-SESSION-BRIEF.md`)
- Track-S Bridge detail (sengaja sebagai stub — lihat §7 untuk rationale)

### 1.4 Relasi terhadap dokumen sebelumnya

| Dokumen | Status |
|---|---|
| `TRACK-S-DATA-SOVEREIGNTY-BLUEPRINT.md` v1.1 | **Legacy reference** — mengandung Phase S0 decisions yang masih valid (carry-over ke §10 dokumen ini), tetapi framing arsitekturnya superseded |
| `KHANZA-SPOKE-SESSION-BRIEF.md` v1.1+ | **Active** — masih jadi mandate untuk Khanza spoke session, dengan minor cross-reference updates di v1.2 |
| SIKESUMA codebase + roadmap | **Independen** — tier-based development continues; relasi dengan SIMRS Batin Tikal di-codify dalam blueprint ini |

---

## 2. Tujuan Strategis

### 2.1 Mengapa SIMRS Batin Tikal dibangun

RS Batin Tikal sebagai institusi kesehatan TNI AD menghadapi kebutuhan **kemandirian data dan operasional** yang sudah ditetapkan oleh kerangka regulatori (lihat §3) dan kebutuhan organisasional. Pembangunan SIMRS sendiri menjawab beberapa tujuan paralel:

**Tanggung jawab institusional atas data**

Per kerangka UU PDP dan Permenkes, RS adalah *data controller* untuk rekam medis dan operasional pasien. Posisi ini tidak dapat sepenuhnya didelegasikan kepada vendor sistem. Pembangunan SIMRS sendiri adalah substansi dari memenuhi posisi tersebut.

**Kontinuitas operasional**

Layanan medis tidak boleh terganggu oleh faktor non-medis (perubahan vendor, dispute kontrak, force majeure infrastruktur vendor). SIMRS yang dimiliki RS sendiri menjamin kontinuitas pada level paling fundamental.

**Spesialisasi konteks TNI AD**

Vendor SIMRS generik tidak optimal untuk konteks TNI AD specific — POK (Penyusunan Operasional Kegiatan), BAS (Bagan Akun Standar), Permenhan reporting framework, jenjang komando, Wasrik integration. SIMRS yang dirancang khusus dapat tailoring lebih dalam.

**Audit-defensibility**

BPK, Itjenad, dan auditor lain meminta data lineage yang clean. SIMRS milik RS memberi RS posisi defensible: "ini sistem kami, dengan data lineage yang kami kontrol dan dokumentasikan."

**Fleksibilitas strategis jangka panjang**

Memiliki SIMRS primer memberi RS optionality terhadap vendor — dapat negosiasi dari posisi kuat, atau eventually exit kalau diperlukan, tanpa data lock-in.

### 2.2 Tujuan Strategis Karumkit

Sebagai pimpinan RS Batin Tikal, Karumkit menetapkan vision strategis sebagai berikut:

| ID | Tujuan | Indikator Keberhasilan |
|---|---|---|
| **G1** | Independensi operasional RS | SIMRS Batin Tikal operational; RS dapat berjalan tanpa dependency tunggal vendor |
| **G2** | Visibility lengkap untuk Karumkit dan Wasrik | Dashboard real-time untuk operasional, finansial, klinis |
| **G3** | Compliance ke jenjang komando (Mabes TNI AD) | Data flow lengkap via Panji bridge |
| **G4** | Sustainability infrastruktur | Investasi yang berkelanjutan; tidak terpengaruh perubahan vendor |
| **G5** | Posisi sebagai pelopor digitalisasi RS Militer | RS Batin Tikal menjadi model replicable untuk RS Militer lain |
| **G6** | Audit-ready posture | Data lineage clean, akses terdokumentasi, defensible untuk BPK/Itjenad |

### 2.3 Posisi dalam Ekosistem RS

```
RS Batin Tikal sebagai institusi punya beberapa sistem yang membentuk ekosistem data:

  • Vendor Terasehat — SIMRS eksisting (legacy operations)
  • SIMRS Batin Tikal — SIMRS yang akan dibangun (primary forward)
  • SIKESUMA — aplikasi spesifik TNI AD (operasional saat ini)
  • Panji — bridging ke Mabes TNI AD (operasional saat ini)
  • Khanza Codex — reference document (akan dibangun)
  • Track-S Bridge — sync layer (Tahap 3, stub now)
```

Blueprint ini melukiskan **bagaimana sistem-sistem tersebut saling terhubung** dan menjelaskan **dalam urutan mana** mereka dibangun atau dikembangkan.

---

## 3. Dasar Hukum & Regulatori

Bagian ini menyajikan dasar hukum yang mendukung posisi RS sebagai pemilik data dan pengoperasian SIMRS sendiri. Bukan opini hukum formal; Owner harus konsultasi penasihat hukum institusional untuk interpretasi definitif.

### 3.1 UU No. 27 Tahun 2022 (PDP)

UU Pelindungan Data Pribadi menetapkan kerangka klasifikasi:

- **Subjek Data:** pasien
- **Pengendali Data Pribadi (Data Controller):** RS Batin Tikal sebagai institusi
- **Prosesor Data Pribadi (Data Processor):** vendor sistem (Terasehat, atau eventually SIMRS Batin Tikal sebagai self-processed)

Implikasi:

- Tanggung jawab atas data pasien melekat pada RS, tidak dapat didelegasikan
- Hak subjek data (akses, koreksi, penghapusan) — RS yang harus memenuhi
- RS punya hak dan kewajiban memiliki kontrol penyimpanan data primary

SIMRS Batin Tikal adalah substansi operasional yang membuat posisi RS sebagai data controller tercermin di arsitektur sistem.

### 3.2 Permenkes No. 24 Tahun 2022 (Rekam Medis Elektronik)

Permenkes RME mengatur kewajiban fasilitas pelayanan kesehatan:

- Fasilitas kesehatan **wajib menyelenggarakan** rekam medis elektronik
- Rekam medis adalah **milik fasilitas pelayanan kesehatan** (isinya milik pasien)
- Fasilitas wajib **memelihara, menyimpan, dan menjamin keamanan** rekam medis
- Retention minimum sesuai peraturan turunan

SIMRS Batin Tikal adalah operasional dari kewajiban ini.

### 3.3 Permenhan No. 5 Tahun 2020

Permenhan mengatur pengelolaan beberapa aspek di lingkungan Kemhan/TNI. Untuk RS Militer, relevansinya mencakup:

- Posisi RS Militer dalam hierarki komando
- Kewajiban reporting ke Mabes dan jenjang komando
- Standar dukungan kesehatan personel TNI

Implikasi untuk SIMRS Batin Tikal:

- Posisi hierarkis memberi RS lever untuk standardisasi data flow ke pusat
- Reporting hierarchical justification untuk SIMRS yang lengkap

### 3.4 Posisi Kontraktual Vendor Saat Ini

Vendor Terasehat berada dalam perjanjian kontrak dengan RS sebagai service provider untuk SIMRS. Posisi kontraktual ini **tidak berubah** karena pembangunan SIMRS Batin Tikal:

- Vendor tetap menjalankan service per term kontrak
- SIMRS Batin Tikal dibangun sebagai sistem RS yang **independent dari vendor**
- Track-S Bridge (Tahap 3) akan menjadi sync layer yang menjaga kontinuitas operasional selama transisi

### 3.5 Audit Framework

RS berada dalam beberapa kerangka audit:

- **BPK (Badan Pemeriksa Keuangan)** — audit keuangan negara, termasuk anggaran TNI AD
- **Itjenad (Inspektorat Jenderal TNI AD)** — audit internal TNI AD
- **Wasrik internal** — pengawasan internal RS di bawah Karumkit
- **Akreditasi RS, surveyor kesehatan** — audit kualitas pelayanan

SIMRS Batin Tikal design priority: setiap data point dapat di-trace ke originating event, dengan dokumentasi access control yang clean.

### 3.6 Phase 3 Khanza Codex Integration

Selain dasar hukum di atas (§3.1-§3.5), blueprint ini sejak v2.0 mengintegrasikan **basis arsitektural otoritatif** berupa temuan Phase 3 Khanza Codex Closure Bundle. Integrasi ini bukan tambahan dasar hukum melainkan tambahan **dasar referensi arsitektural** yang menginformasikan keputusan desain SIMRS Batin Tikal.

**Apa yang diintegrasikan dari Phase 3 Khanza Codex:**

| Layer Phase 3 | Dokumen Sumber | Posisi di Blueprint v2.0 |
|---|---|---|
| **Catalog** — 46 primitif individu | `KHANZA-CODEX-PHASE-3-PATTERNS-REGISTRY.md` (D1, 904 lines) | Reference (Appendix B navigation); 12 TIMELESS subset diadopsi (Appendix A) |
| **Map** — 5 causal chains | `KHANZA-CODEX-PHASE-3-CAUSAL-CHAINS.md` (D2, 498 lines) | Sequencing rationale (§9 replaced); cross-references throughout §5.6 patterns |
| **Roadmap** — translation ke SIMRS BT actionable | `KHANZA-CODEX-PHASE-3-IMPLICATIONS-FOR-SIMRS-BT.md` (D3, 1147 lines) | **Primary integration source** — §4.7 Three Deep Choices, §5.6 Nine Patterns, §11 Anti-Primitives risk, §9 Sequencing |

**Authority basis:** Owner-approved per Phase 3 Closure Lineage Log entries L022-L028 (46 primitives baseline locked); L039-L041 (D3 production decisions). Phase 3 status: **CLOSED** per Phase 3 closure bootstrap — no further Khanza Codex internal work without explicit Owner re-engagement.

**Discipline carry-over dari Phase 3:**

- **Clean-room reverse engineering posture** — zero verbatim Java/SQL code copy throughout SIMRS BT design
- **License clean** — Khanza.Soft Media custom license respected; D3 content (Phase 3b output) freely adaptable dalam blueprint ini
- **"Khanza optimized rationally" tone** — setiap anti-primitif yang diinversi disertai konteks rasional Khanza (Khanza dioptimasi untuk konteks X; SIMRS BT konteks berbeda Y; karena itu SIMRS BT memilih Z). Khanza adalah brilliant solution untuk problem space berbeda, bukan "sistem yang salah".
- **Additive-only** — keputusan Owner pada Phase 3 locked (L022-L028); blueprint v2.0 tidak merelitigasi temuan

**Cross-reference:** Appendix B menyediakan navigation guide ke Phase 3 Closure Bundle untuk fresh AI session yang nantinya consume blueprint v2.0.

---

## 4. Architecture Concept — Three-Workstream Model

### 4.1 Khanza Codex sebagai Reference Layer

**Apa Khanza Codex:** dokumen referensi yang merangkum primitif arsitektural + theoretical framework dari SIMRS Khanza, dianalisa secara konseptual (tanpa code transfer atau license contamination).

**Posisi dalam ekosistem:** **upstream reference** untuk SIMRS Batin Tikal design. Tidak digunakan SIKESUMA secara langsung, tidak menjadi part dari operational system.

**Sumber detail:** lihat `KHANZA-SPOKE-SESSION-BRIEF.md` untuk mandate analisa Khanza spoke session, dan eventually `THE-KHANZA-CODEX.md` (output spoke session) untuk content.

### 4.2 SIMRS Batin Tikal sebagai Generic SIMRS Base

**Apa SIMRS Batin Tikal:** sistem informasi manajemen rumah sakit yang dibangun khusus untuk RS Tk IV Batin Tikal — handle operasional inti RS (registrasi, billing, akuntansi, rekam medis, dll.) dengan tech stack modern (web + cloud).

**Posisi dalam ekosistem:** **central hub** yang menerima input dari petugas RS, menjadi sumber primary data untuk konsumen (SIKESUMA, Panji, Track-S Bridge).

**Tech stack (sesuai Phase S0 decisions, lihat §10):**

- Frontend: web-based (React + TypeScript), responsive untuk desktop + tablet
- Backend: cloud Supabase (PostgreSQL + Auth + Storage)
- Build pattern: modular per-modul, audit trail backbone
- Mirror SIKESUMA's existing stack untuk konsistensi + maintenance familiarity

### 4.3 SIKESUMA sebagai TNI-Specifics Specialized Layer

**Apa SIKESUMA:** aplikasi spesifik untuk governance + analitik TNI AD context — POK, RAB, RPD, LRA, jasa medis, audit Revisi POK, BAS compliance, validation engines.

**Posisi dalam ekosistem:** **specialized peer** dengan SIMRS Batin Tikal — bukan derivative, bukan downstream-only. SIKESUMA punya domain expertise yang accumulated (TNI AD specificity) yang complement generic SIMRS Batin Tikal.

**Relasi bidirectional dengan SIMRS Batin Tikal:**

- **SIKESUMA → SIMRS Batin Tikal:** knowledge transfer — saat SIMRS BT membangun modul-modul yang overlap dengan SIKESUMA scope (mis. accounting, billing), SIKESUMA's existing schemas + validation rules + business logic mengakselerasi TNI-specific tailoring
- **SIMRS Batin Tikal → SIKESUMA:** operational data — patient records, billing transactions, operational events yang SIKESUMA consume untuk analitik POK + audit

### 4.4 Track-S Bridge sebagai Sync Stub

**Apa Track-S Bridge:** sinkronisasi mechanism antara SIMRS Batin Tikal dan vendor Terasehat (atau external system lain yang nantinya relevant). Berfungsi menjaga kontinuitas operasional + akselerasi maturity selama RS bertransisi dari ketergantungan tunggal pada vendor.

**Posisi dalam ekosistem:** **STUB di dokumen ini** — sengaja tidak di-elaborate secara mendalam karena Track-S hanya makes sense **setelah SIMRS Batin Tikal substantially operational**. Pre-mature detailing = complexity trapping (lihat §7).

**Yang sudah ditetapkan tentang Track-S:**

- Posisi: sync layer (bukan SIMRS itself)
- Approach: web automation as user proxy (per D-S0.2 prior, lihat §10)
- Credentials: per-petugas (per D-S0.3 prior)
- Vendor engagement: zero throughout pre-Track-S phases (per D-S0.5 prior)

Detail lebih lanjut **ditunda** sampai SIMRS Batin Tikal substantially operational dan Track-S Bridge phase concretely di-plan.

### 4.5 Bidirectional Knowledge Flow

```
              Khanza Codex
                   |
                   ↓ informs design
                   |
SIKESUMA   ⇄   SIMRS Batin Tikal
(TNI    spesifik       |
specifics  ←→  data    |
layer)                 ↓
                    Panji  → Pusat / Mabes
                    Track-S Bridge → Vendor Terasehat
```

**Yang penting tentang model ini:**

- SIKESUMA dan SIMRS Batin Tikal adalah **lateral peers**, bukan parent-child
- Khanza Codex inform SIMRS Batin Tikal **secara unidirectional** (reference only, no operational dependency)
- Panji dan Track-S Bridge adalah **downstream bridges** dari SIMRS Batin Tikal

### 4.6 Downstream Bridges

**Panji ↔ Pusat / Mabes TNI AD:**

- Panji mengambil data dari SIMRS Batin Tikal sebagai source-of-truth
- Forwarding ke Mabes / Pusat untuk fulfillment kewajiban reporting hierarchical
- Koordinasi Panji ↔ Sie Renbang (Angga) wajib (per E6.6 prinsip)

**Track-S Bridge ↔ Vendor Terasehat:**

- Track-S Bridge sync data dari SIMRS Batin Tikal ke vendor sebagai downstream consumer
- Mechanism: web automation (user proxy), per Phase S0 decisions
- Detail di Tahap 3 (post-SIMRS BT operational)

### 4.7 Three Deep Theoretical Choices (Architectural Compass)

Per Phase 3 Khanza Codex Causal Chains analysis (D2 §5; D3 §D), **architectural decisions dalam SIMRS — baik Khanza maupun SIMRS BT — cluster di sekitar tiga pilihan teoretis yang lebih fundamental daripada primitif individu**. Tugas SIMRS BT bukan "invert N anti-primitives one-by-one" — melainkan **memilih theoretical choices yang berbeda dari Khanza dan membiarkan pilihan tersebut propagate menjadi manifestasi operasional yang lebih baik untuk konteks SIMRS BT**.

Tiga Deep Choices ini menjadi **architectural compass** untuk setiap keputusan desain SIMRS BT — saat ambiguitas muncul ("apakah ini perlu audit?", "di mana logika ini hidup?", "apa source-of-truth-nya?"), jawaban dapat di-derive dari pilihan yang sudah locked di sini.

#### 4.7.1 Deep Choice 1 — Time Model

| Aspek | Pilihan Khanza | Pilihan SIMRS Batin Tikal |
|---|---|---|
| **Pernyataan teoretis** | Snapshot-only — time is now; history not queryable | **Queryable time dimension — time is a queryable axis** |
| **Primitif inti yang manifest** | P3-A (Snapshot-Only State Model) | Universal audit infrastructure + immutable snapshots |
| **Operational cluster** | P7-E + P4-D + P6-B + P2-C + P3-E | §5.6.1 + §5.6.2 + §5.6.3 + selective permanence (Appendix A.2) |
| **Konteks rasional Khanza** | LAN 2010-era + trained operators + paper compliance trail. Universal audit menambah 2-3× storage + write latency pada deployment LAN. BPK/Akreditasi inspectors check paper records. Operational throughput prioritized over forensic queryability. | (tidak berlaku — SIMRS BT konteks berbeda) |
| **Konteks SIMRS BT** | (tidak berlaku — Khanza konteks berbeda) | BPK + Itjenad digital audit framework tidak dapat operate tanpa schema-level forensic reconstruction. Akreditasi modern menuntut audit trail. Military medical menuntut integrity attestation untuk legal/disciplinary cases. Multi-RS coordination menuntut cross-RS audit visibility. |

**Cascade propagation untuk SIMRS BT:**

Audit columns universal → version columns viable → transactions naturally implementable → forensic queries serve BPK/Itjenad → snapshot tables untuk terminal states (encounter closure, billing finalization).

**Practical translation:** Saat SIMRS BT designer menghadapi pertanyaan **"apakah ini perlu audit?"** — jawabannya **YES BY DEFAULT**. Flip Khanza's implicit-no menjadi explicit-yes. Keputusan ini propagate: forces selective permanence (Appendix A.2 / P1-C), enables concurrency control (§5.6.2 / P4-D inversion), supports transactional discipline (§5.6.3 / P6-B inversion).

#### 4.7.2 Deep Choice 2 — Definition Locality

| Aspek | Pilihan Khanza | Pilihan SIMRS Batin Tikal |
|---|---|---|
| **Pernyataan teoretis** | Distributed implicit — definitions live where used; no central registry | **Centralized explicit — definitions in TypeScript code; central registry** |
| **Primitif inti yang manifest** | P3-B (Distributed Implicit State Machines) | TypeScript state machines + validation library + RBAC |
| **Operational cluster** | P7-A + P5-B + P5-E + P7-F + P9-B | §5.6.7 + §5.6.8 + formal package boundaries (Appendix A.8) |
| **Konteks rasional Khanza** | Java pre-Bean-Validation era; per-form duplication acceptable cost untuk module independence. Each module team owned their validation; coordination overhead minimal. Validation rules tightly tied to form UX — co-location made sense. | (tidak berlaku — SIMRS BT konteks berbeda) |
| **Konteks SIMRS BT** | (tidak berlaku — Khanza konteks berbeda) | Modern stack (Zod, Yup, equivalent) makes centralized validation ergonomic. Multi-client future (web/mobile/integration partners) requires server-side validation (cannot trust client-side only). Validation rule drift across forms = data quality erosion. |

**Cascade propagation untuk SIMRS BT:**

State machines as TypeScript code → testable + cross-module consistent → validation library has home → RBAC role abstraction implementable → naming convention enforceable via tooling.

**Practical translation:** Saat SIMRS BT designer menghadapi pertanyaan **"di mana aturan ini hidup?"** — jawabannya **single source of truth di service layer**. Keputusan ini propagate: forces service layer existence (§5.6.9 / P4-C inversion), enables centralized validation (§5.6.8 / P7-A inversion), supports RBAC (§5.6.7 / P7-F inversion).

#### 4.7.3 Deep Choice 3 — Convergence Model (POSITIVE — ADOPT VERBATIM)

| Aspek | Pilihan Khanza | Pilihan SIMRS Batin Tikal |
|---|---|---|
| **Pernyataan teoretis** | Encounter-as-convergence — encounter is reality; billing is bookkeeping | ✅ **ADOPT VERBATIM** (tanpa modifikasi teoretis) |
| **Primitif inti yang manifest** | P3-D ⭐ (HIGHEST-VALUE positive learning) | P3-D (sama) |
| **Operational cluster** | P2-A + P6-A + P6-E | Sama — adopt directly with modernization |
| **Konteks rasional (kedua sistem)** | Universal correctness untuk hospital information systems. Matches operational reality (encounter = irreducible business event). Maps ke BPJS + Kemenkes claim submission model (encounter-based billing). | Identik — SIMRS BT mengadopsi tanpa kalibrasi teoretis. |

**Cascade propagation untuk SIMRS BT:**

Encounter hub → clinical detail FK ke encounter → billing derived dari clinical events → dual-spine architecture (clinical spine + financial spine, P6-A) → TNI AD audit pathway separation (Itjenad audit clinical schema; BPK audit financial schema).

**Practical translation:** Saat SIMRS BT designer menghadapi pertanyaan **"apakah data ini authoritative atau derived?"** — jawabannya mengikuti **clinical-primacy**. Clinical record = source-of-truth (encounter, treatments, prescriptions, lab results); billing = computed view (charges derived dari clinical events, snapshotted at finalization).

**Catatan adopsi:** Ini adalah **Causal Chain 4** (positive chain) — sekaligus **highest-value learning** dari Khanza. Inilah primitif yang Khanza pioneered dengan benar untuk konteks RS Indonesia, dan SIMRS BT tidak perlu menemukan ulang.

#### 4.7.4 Three Choices Cumulative Propagation

Ketiga pilihan ini tidak independen — mereka **compound** secara struktural:

```
Time: queryable          ─┐
                          ├─→ Service layer required (audit trigger needs context)
Definitions: centralized ─┘    ├─→ Validation library viable
                               ├─→ State machines testable
                               └─→ RBAC implementable

Convergence: encounter ─→ Dual-spine ─→ Audit pathway separation
                                   └─→ Tenant boundary alignment
```

**Cascade implication:** Membuat ketiga Deep Choices well-aligned di architecture-design time **costs far less than retrofitting later**. Inilah rasional mengapa Phase 3 Codex framing memprioritaskan Deep Choices over individual primitive inversions — get the choices right, primitives follow.

**Bagaimana Deep Choices memandu §5.6 patterns:**

| §5.6 Pattern | Diturunkan dari Deep Choice | Cara propagasi |
|---|---|---|
| §5.6.1 Mandatory Audit Trail | Choice 1 (Time) | Audit columns + audit log = manifestation langsung queryable time |
| §5.6.2 Concurrency Control | Choice 1 (Time) | Version columns = optimistic locking dengan audit context untuk conflict resolution |
| §5.6.3 Transaction Discipline | Choice 1 (Time) | Atomic transactions = guarantees yang queryable time menuntut untuk reconciliation |
| §5.6.4 SQL Injection Mitigation | (orthogonal — security dimension) | Independent infrastructure pillar |
| §5.6.5 Error Tracking | (orthogonal — observability dimension) | Independent infrastructure pillar |
| §5.6.6 Multi-Tenant Schema | (orthogonal — scope dimension) | Foundational schema decision; Chain 3 head |
| §5.6.7 RBAC | Choice 2 (Definition Locality) + Choice 3 (multi-tenant scoping) | Role-permission registry = manifestation centralized definitions |
| §5.6.8 Centralized Validation | Choice 2 (Definition Locality) | Validation library = literal manifestation centralized definitions |
| §5.6.9 Service Layer Architecture | Choice 2 (Definition Locality) | Service layer = home for centralized definitions |

**Cross-reference:** §5.6 (Architectural Patterns formalization), §9 (Inversion Sequencing — implementation order), Appendix A (TIMELESS Primitives catalog).

---

## 5. SIMRS Batin Tikal — Workstream Detail

### 5.1 Scope — Bertahap, Sesuai Phase S0 Decisions

Per D-S0.1 (Phase S0 decision, lihat §10): **bertahap — admin/billing dulu di Phase 2.1, klinis di Phase 2.3+**.

**Phase 2.1 (Foundation Build) scope:**

- Authentication + authorization + audit trail backbone
- 1–2 modul prioritas — admin/billing focus
- RS Web App scaffold (frontend)
- RS Server backend (Supabase)
- Pilot deployment 1 unit (Sie Renbang per D-S0.8)

**Phase 2.2 (Coverage Expansion — admin) scope:**

- Roll-out modul admin tambahan
- Multi-unit deployment
- Integration awal dengan SIKESUMA (data flow)

**Phase 2.3+ (Klinis Expansion) scope:**

- Modul klinis (rekam medis, lab, radiologi, dll.) — informed by Khanza Codex
- Eventually full SIMRS coverage

### 5.2 Tech Stack

| Komponen | Pilihan | Rationale |
|---|---|---|
| **Frontend** | React + TypeScript + Vite | Konsisten dengan SIKESUMA stack — knowledge transfer + maintenance familiarity |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) | Cloud (per D-S0.6), low ops overhead, JSONB envelope pattern proven di SIKESUMA |
| **Authentication** | Supabase Auth (initial); kemungkinan integration ke directory RS di phase later | Standard, integrated dengan backend |
| **Hosting** | Cloud Supabase Pro untuk Phase 2.1–2.2; evaluate Indonesian cloud / self-hosted di Phase 2.3+ | Per D-S0.6 + future consideration |
| **CI/CD** | GitHub Actions (atau equivalent) | Standard |
| **Deployment** | Vercel atau equivalent (untuk frontend); Supabase managed (untuk backend) | Standard |

### 5.3 Modul Layout (Preview)

Modul yang **kemungkinan** di-cover SIMRS Batin Tikal, by phase. Detail akan diputuskan saat Phase 2.1 kickoff dengan input dari Khanza Codex + SIKESUMA team.

**Phase 2.1 priority candidates:**

- Registrasi pasien
- Antrian
- Admin billing
- Master data: dokter, ruang, layanan

**Phase 2.2 expansion candidates:**

- Akuntansi RS (linked to SIKESUMA POK)
- Inventory + apotek (basic)
- Kepegawaian + presensi
- Laporan operasional

**Phase 2.3+ klinis candidates:**

- Rekam medis rawat jalan + rawat inap
- Lab + radiologi
- IGD
- ICU
- Resume medis

Specific modul prioritas untuk Phase 2.1 kickoff TBD oleh Owner + Sie Renbang.

### 5.4 Pilot Strategy

Per D-S0.8: pilot di **Sie Renbang** dengan Angga sebagai champion.

**Pilot success criteria:**

- Petugas Sie Renbang adoption rate: 80%+ usage SIMRS Batin Tikal untuk modul yang cover
- Data integrity: zero data loss
- UX feedback: net positive
- Iterasi feedback loop: <2 minggu turnaround

### 5.5 Sub-Phases SIMRS Batin Tikal

Estimasi pembagian Phase 2 ke sub-phases:

| Sub-phase | Focus | Estimated duration | Lead |
|---|---|---|---|
| **2.1a** | Architecture & schema design | 2-3 minggu, 1-2 fresh AI sessions | Owner-supervised AI |
| **2.1b** | Backend build (Supabase + audit trail) | 4-6 minggu, multi-session | Fresh AI sessions |
| **2.1c** | Frontend build (RS Web App) | 6-8 minggu, multi-session | Fresh AI sessions |
| **2.1d** | Pilot deployment & iterasi | 2-3 minggu, Sie Renbang testing | Owner + Angga + AI session |
| **2.2** | Coverage expansion (admin) | 3-4 bulan, multi-session | Continued |
| **2.3+** | Klinis expansion | Bertahap, multi-tahun potential | Continued |

Owner approval gates di setiap sub-phase milestone.

### 5.6 Architectural Patterns (Phase 3 Codex Integration)

Bagian ini menyajikan **sembilan pola arsitektural fundamental** yang menjadi dasar implementasi SIMRS Batin Tikal Phase 2. Pola-pola ini diturunkan langsung dari Phase 3 Khanza Codex temuan (D3 §E) dan diorganisir sesuai logika **Causal Chains** (D2):

| Pattern | Cluster | Chain | Severity inversion |
|---|---|---|---|
| §5.6.1 Mandatory Audit Trail | Time/audit | Chain 2 head | 🔴 Critical |
| §5.6.2 Concurrency Control | Time/audit | Chain 2 mid | 🔴 Critical |
| §5.6.3 Transaction Discipline | Time/audit | Chain 2 end | 🔴 Critical |
| §5.6.4 SQL Injection Mitigation | Security | Orthogonal | 🔴 Critical (R9/L026) |
| §5.6.5 Error Tracking Infrastructure | Observability | Orthogonal | 🔴 Critical (Owner-escalated) |
| §5.6.6 Multi-Tenant Schema ⭐ | Tenancy/RBAC | Chain 3 head | 🟠 High (sequencing #2) |
| §5.6.7 RBAC | Tenancy/RBAC | Chain 3 mid | 🟠 High |
| §5.6.8 Centralized Validation | Layering | Chain 1 mid | 🟠 High |
| §5.6.9 Service Layer Architecture | Layering | Chain 1 head | 🟠 High |

**Hubungan dengan §4.7 Three Deep Choices:**

- §5.6.1, §5.6.2, §5.6.3 = manifestasi langsung **Deep Choice 1 (Time Model: queryable)**
- §5.6.7, §5.6.8, §5.6.9 = manifestasi langsung **Deep Choice 2 (Definition Locality: centralized)**
- §5.6.6 = enabler structural untuk Choice 3 (Convergence: encounter sebagai source-of-truth dalam scope tenant)

**Implementation status:** Pola-pola ini **memformalkan requirements**, bukan implementation. Implementasi konkret dilakukan oleh SIMRS BT Phase 2 spoke session — yang akan consume blueprint v2.0 sebagai authoritative source. Setiap pola di sini menyediakan: rasional, konteks Khanza (yang membentuk anti-primitive), konteks SIMRS BT (yang menuntut inversi), inversion pattern, dan **suggested formalization wording** yang dapat diadopsi spoke session dengan modifikasi appropriate.

**Cross-references:** §4.7 (architectural compass), §9 (inversion sequencing), §11 (anti-primitives risk register), Appendix A (TIMELESS primitives catalog), Appendix B (Phase 3 bundle navigation).

---

#### 5.6.1 Mandatory Audit Trail Pattern

**Cross-reference:** P7-E (anti-primitive — Audit Trail Absent at Schema Level, 🔴 TOP SEVERITY); Chain 2 head.

**Rationale dalam konteks SIMRS BT:**

Universal audit columns + audit log table memungkinkan BPK + Itjenad untuk melakukan forensic queries. Required untuk TNI AD digital audit framework. Inversi tunggal paling penting di Chain 2 — tanpa audit infrastructure, version columns (§5.6.2) tidak punya konteks forensik untuk conflict resolution, dan transactions (§5.6.3) tidak dapat naturally implemented di atas audit log.

**Khanza-rational context (yang membentuk anti-primitive ini):**

Khanza dioptimasi untuk konteks 2010-era LAN deployment dengan trained operators + paper compliance trail:

- Khanza schema empiris: **0 universal audit columns** (`created_at`/`updated_at`/`*_at`) across 1156 tables. Namun 17 scoped PPI compliance audit tables exist — audit-table design capability demonstrated; universal absence is design CHOICE, not capability gap (per R6 evidence)
- Universal audit akan menambah 2-3× storage + write latency pada deployment LAN
- Compliance audit di-handle via paper (BPK/Akreditasi traditional inspectors check paper records)
- Operational throughput prioritized over forensic queryability

Untuk konteks Khanza tahun 2010 dengan 1500+ RS deployment di LAN single-RS, ini adalah trade-off yang rasional.

**SIMRS BT TNI AD context (mengapa ini menjadi Critical untuk inversi):**

- BPK + Itjenad digital audit framework **tidak dapat operate** tanpa schema-level forensic reconstruction
- Modern healthcare compliance (Akreditasi standar saat ini) menuntut audit trail
- Military medical context menuntut integrity attestation untuk legal/disciplinary cases
- Multi-RS coordination menuntut cross-RS audit trail visibility (G5 Karumkit vision)

**Inversion pattern (mandatory):**

1. **Universal audit columns pada setiap operational table:**
   - `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
   - `created_by UUID NOT NULL REFERENCES users(id)`
   - `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`
   - `updated_by UUID NOT NULL REFERENCES users(id)`
   - `deleted_at TIMESTAMPTZ NULL` (soft delete per P1-C tier — lihat Appendix A.2)
   - `deleted_by UUID NULL REFERENCES users(id)`
2. **Trigger-based audit population** (sole exception terhadap DB-passive philosophy P7-B):
   - PostgreSQL `BEFORE INSERT/UPDATE` triggers populate timestamps + user dari session context
   - Session context: `current_setting('app.current_user_id')` di-set per request
3. **Audit log table untuk high-stakes operations:**
   - `audit.audit_log` table — menangkap (table_name, row_id, operation, old_values JSONB, new_values JSONB, user_id, timestamp)
   - Trigger-based population pada tables yang di-flag audit-grade
   - **Append-only**; no UPDATE or DELETE on audit log
4. **Immutable snapshot tables untuk terminal states** (P1-C audit-grade tier):
   - Saat encounter closes / billing finalizes / claim submits → snapshot ke immutable table
   - Append-only; no update path
5. **Audit query API:** service-layer functions yang exposing "what was state of X at time T" + "who changed X when" untuk auditor consumption

**Cascade benefit:** P7-E inversion adalah **Chain 2 head** — implementing audit infrastructure enables §5.6.2 (P4-D inversion: version columns become queryable conflict context) dan §5.6.3 (P6-B inversion: transactions become naturally implementable atop audit log).

**Suggested formalization wording (untuk SIMRS BT Phase 2 implementation):**

> *"Every operational table SHALL include the following audit columns: `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at` (nullable), `deleted_by` (nullable). The `audit.audit_log` table SHALL capture INSERT/UPDATE/DELETE events for audit-grade tables with old/new value JSONB snapshots. Audit log is append-only — no UPDATE or DELETE permissions. Audit population uses BEFORE INSERT/UPDATE triggers reading `current_setting('app.current_user_id')` from session context (single allowed exception to DB-passive architecture)."*

**Cross-chain implication:** Foundation Chain 2. Enables §5.6.2 (version conflict resolution requires audit context). Enables §5.6.3 (transactions become naturally testable atop audit).

**Cross-references:** §11.7 (anti-primitive P7-E risk), Appendix A.2 (P1-C Selective Permanence tier mapping), Appendix B (Phase 3 D3 §C.1 + §E.1 detailed source).

---

#### 5.6.2 Concurrency Control Pattern

**Cross-reference:** P4-D (anti-primitive — Silent Last-Write-Wins, 🔴 Critical); Chain 2 mid.

**Rationale dalam konteks SIMRS BT:**

Web client + multi-shift + multi-RS deployment menciptakan concurrent edit reality yang Khanza's LAN model dapat menghindari. Silent data loss tidak acceptable untuk medical records — silent loss of medical record edit = **unrecoverable patient safety incident**.

**Khanza-rational context (yang membentuk anti-primitive ini):**

Khanza dioptimasi untuk konteks LAN single-RS dengan trained operators di shared physical workspace:

- Empiris: **no version columns, no optimistic locking, no row-level versioning** across 1156 tables
- Operators verbally coordinate ("aku lagi edit pasien Pak Budi" — verbal handoff sufficient di physical workspace)
- Concurrent collisions rare in practice for that operating model
- Untuk LAN single-RS dengan team kecil yang co-located, verbal coordination memang efficient dan reliable

**SIMRS BT TNI AD context (mengapa ini menjadi Critical untuk inversi):**

- Multi-shift military medical: shift handover transitions menciptakan concurrent edit windows
- Multi-facility (G5 Karumkit network vision): tidak ada possibility untuk verbal coordination
- Web client: operators mungkin punya stale page state dari minutes/hours sebelumnya
- Silent loss of medical record edit = unrecoverable patient safety + audit forensics issue

**Inversion pattern:**

1. **Optimistic locking via version column** pada setiap operational table:
   - `version BIGINT NOT NULL DEFAULT 1`
   - Service layer: `UPDATE WHERE id = ? AND version = ?` — if zero rows affected, conflict detected
2. **Conflict detection UI:** saat conflict di-detect, present operator tiga options:
   - **Reload** (discard local edits, fetch latest)
   - **Override** (force write; logs conflict event with audit trail showing other operator's lost changes)
   - **Merge** (field-level merge UI untuk complex conflicts)
3. **Conflict event audit:** setiap override logged with audit trail (per §5.6.1 audit infrastructure); facilitates post-hoc forensic review
4. **Real-time presence indicators** (optional UX enhancement): show other operator yang sedang viewing/editing same record (Supabase Realtime presence)

**Implementation dependency:** Requires §5.6.1 (audit infrastructure) untuk conflict event logging.

**Suggested formalization wording:**

> *"Every operational table SHALL include a `version BIGINT NOT NULL DEFAULT 1` column. All UPDATE operations from service layer MUST include `WHERE id = $1 AND version = $2` clause; zero affected rows indicates conflict. Conflict UI SHALL present three options: Reload (discard local edits), Override (force write with audit-logged conflict event), or Merge (field-level conflict resolution for complex cases). Override events SHALL be audit-logged with full before/after snapshots for forensic review."*

**Cross-chain implication:** Depends on §5.6.1 (audit infrastructure). Pairs dengan §5.6.3 (transactions) untuk atomic version-checked operations.

**Cross-references:** §11.8 (anti-primitive P4-D risk), §5.6.1 (audit prerequisite), Appendix B (Phase 3 D3 §C.2 + §E.2 detailed source).

---

#### 5.6.3 Transaction Discipline Pattern

**Cross-reference:** P6-B (anti-primitive — Eventual Consistency via Human Reconciliation, 🔴 Critical); Chain 2 end.

**Rationale dalam konteks SIMRS BT:**

Cross-module workflows menuntut atomic guarantees. BPK audit secara spesifik mengetes billing-clinical reconciliation; manual workarounds inadequate. Cross-module operations tanpa transactional discipline menghasilkan partial-state inconsistency yang tidak dapat di-trace.

**Khanza-rational context (yang membentuk anti-primitive ini):**

Khanza dioptimasi untuk konteks paper-era hospital workflow norms + LAN low-volume transaction:

- Empiris (H6.2 evidence): **1 `setAutoCommit` + 1 `commit` + 1 `rollback` across 1627 Java files** = <0.1% transaction discipline footprint
- Paper-era hospital workflow norms: operators reconcile discrepancies as they notice them
- Operator-mediated reconciliation matches Khanza's trust-and-speed philosophy (P1-E)
- LAN deployment + low transaction volume = partial-state rare in practice
- Untuk konteks tersebut, transactional overhead lebih besar daripada partial-state risk

**SIMRS BT TNI AD context (mengapa ini menjadi Critical untuk inversi):**

- Higher transaction volume (cloud-scale, multi-RS)
- Web client + network: partial failures (network drop mid-workflow) lebih common
- Military operational audit tidak dapat tolerate silent inconsistency
- BPK audit specifically tests for billing-clinical reconciliation; manual workaround inadequate

**Inversion pattern:**

1. **Transactional discipline sebagai architectural requirement:**
   - Multi-step workflows wrapped dalam SQL transactions (SERIALIZABLE isolation untuk clinical-financial coordination)
   - Service layer functions adalah transaction units: enter dengan `BEGIN`, exit dengan `COMMIT`/`ROLLBACK`
2. **Saga pattern untuk cross-service operations:**
   - Saat transaction crosses service boundaries (mis. BPJS claim submission dengan multiple async steps), use saga pattern dengan compensating actions
   - Each step explicitly defines rollback action
3. **Idempotency keys untuk retry safety:**
   - External API calls (BPJS, payment gateway) use idempotency keys
   - Retries safe from partial-state amplification
4. **Reconciliation jobs sebagai belt-and-suspenders** (bukan primary mechanism):
   - Nightly reconciliation jobs detect residual inconsistency
   - **Alert (not silent fix)** — operator review required
   - Audit log records reconciliation events

**Implementation dependency:** Requires §5.6.1 (audit) untuk reconciliation event logging; benefits from §5.6.2 (concurrency) untuk conflict resolution.

**Suggested formalization wording:**

> *"Multi-step workflows touching multiple tables SHALL be wrapped in SQL transactions with isolation level appropriate to the operation (SERIALIZABLE for clinical-financial coordination; READ COMMITTED for read-heavy workflows). Service-layer functions are transaction units — they enter with BEGIN, exit with COMMIT or ROLLBACK; never partial commit. Cross-service workflows (e.g., external API submission with multiple async steps) use saga pattern with explicit compensating actions per step. External API calls use idempotency keys for retry safety. Nightly reconciliation jobs detect residual inconsistency and ALERT (no silent fix); operator review required."*

**Cross-chain implication:** Built atop §5.6.1 + §5.6.2. Completes Chain 2 inversion (Time/audit cluster).

**Cross-references:** §11.9 (anti-primitive P6-B risk), §5.6.1 + §5.6.2 (Chain 2 prerequisites), §5.6.9 (Service Layer hosts transaction unit boundaries), Appendix B (Phase 3 D3 §C.3 + §E.3 detailed source).

---

#### 5.6.4 SQL Injection Mitigation Pattern

**Cross-reference:** P7-D (anti-primitive — String-Concat SQL Search, 🔴 Critical R9/L026 retention); orthogonal infrastructure (independent of Chain 1/2/3).

**Rationale dalam konteks SIMRS BT:**

346 unsafe sites di Khanza mendemonstrasikan prevalence dari pattern ini; SIMRS BT cloud + external integration context = adversarial exposure. Pattern ini perlu di-block defense-in-depth: ORM mediation, parameterized queries, input sanitization, dan static analysis CI gate.

**Khanza-rational context (yang membentuk anti-primitive ini):**

Khanza dioptimasi untuk konteks trusted-operator LAN deployment dengan threat model rendah untuk SQL injection:

- Empiris (R9 — L025/L026 evidence): 1034 Java files use LIKE keyword; 937 files use parameterized `LIKE ?` (safe); namun **346 files have unsafe `LIKE '%"+var+"%'` concat patterns** (substantial real exposure)
- Predecessor cross-review initially recommended downgrade ke High; Phase 3a rigorous re-verification revealed 346 unsafe sites — more Critical-justified than either initial position indicated. Owner-approved Critical retention (L026)
- Trusted-operator LAN deployment = SQL injection threat model rendah
- Pattern present tapi tidak exercised oleh adversarial inputs di field deployment

Untuk konteks Khanza pada LAN dengan trusted internal operators, pattern ini tidak pernah diuji secara adversarial sehingga risiko empiris rendah meskipun pattern unsafe ada.

**SIMRS BT TNI AD context (mengapa ini menjadi Critical untuk inversi):**

- Cloud + external integration + multi-tenant = adversarial input vector hadir
- Web client expose search forms ke broader attack surface
- 346 unsafe sites akan translate ke substantial exploit surface kalau pattern direplikasi
- TNI AD security posture: defense-in-depth mandatory

**Inversion pattern:**

1. **Parameterized queries mandatory throughout:**
   - ORM-mediated queries (Prisma, Drizzle, equivalent) prevent class ini by default
   - Raw SQL paths: parameter binding only (`$1`, `$2`, **never concat**)
2. **Full-text search via PostgreSQL `tsvector`:**
   - Untuk complex search (medical record search across multiple fields), use `tsvector` + `tsquery`
   - Indexed full-text search; safe by construction
3. **Input sanitization layer** (validation library — §5.6.8):
   - Whitelist allowed characters per field type
   - Reject SQL metacharacters di semantic identifier fields
4. **Static analysis CI gate:**
   - ESLint rules (mis. `no-template-curly-in-string` untuk SQL contexts)
   - SQL injection static scanning (mis. Semgrep rules)
   - **Block PR merge** on detected concat patterns
5. **Penetration testing dalam CI/CD:**
   - SQL injection regression tests against search endpoints
   - OWASP ZAP / sqlmap automated scanning

**Suggested formalization wording:**

> *"Parameterized queries SHALL be mandatory throughout the codebase. ORM-mediated queries (Prisma, Drizzle, or equivalent) are the default; raw SQL paths require parameter binding only — string concatenation of variables into SQL is prohibited. Full-text search SHALL use PostgreSQL `tsvector`/`tsquery` (not LIKE concat). Input validation layer (§5.6.8) SHALL whitelist allowed characters per field type. CI/CD gate SHALL include static analysis (Semgrep rules or equivalent) blocking PR merge on detected concat patterns. Penetration testing (OWASP ZAP, sqlmap) SHALL run as automated regression in CI."*

**Cross-chain implication:** Independent dari audit/tenancy/layering chains; depends on §5.6.8 (validation) untuk input sanitization layer.

**Cross-references:** §11.10 (anti-primitive P7-D risk), §5.6.8 (validation prerequisite for input sanitization), Appendix B (Phase 3 D3 §C.4 + §E.4 detailed source; R9/L026 retention rationale).

---

#### 5.6.5 Error Tracking Infrastructure Pattern

**Cross-reference:** P8-D (anti-primitive — Error Capture Absent, 🔴 Critical Owner-escalated); orthogonal infrastructure.

**Rationale dalam konteks SIMRS BT:**

Invisible system errors = military medical operational liability. Tidak dapat retrospect on failures (silent corruption potential); tidak dapat alert proactively (system degradation goes unnoticed); multi-RS distributed errors menuntut centralized observation.

**Khanza-rational context (yang membentuk anti-primitive ini):**

Khanza dioptimasi untuk konteks operator immediate-feedback model dengan trained shared-workspace operators:

- Empiris: **0 error_log / 0 exception_log / 0 audit_log** universal tables. Application errors invisible to schema-level observation
- Operator-facing errors via Swing dialog popups; back-end errors via Java console (not persisted)
- Operator immediate-feedback model: error popup, operator retries
- Back-end errors → Java console logs on operator workstation (transient)
- Untuk trained operators dalam shared workspace, error context easily reconstructible secara verbal

Untuk konteks Khanza, error tracking via verbal reconstruction + immediate operator feedback adalah trade-off yang rasional untuk LAN single-site dengan team kecil yang co-located.

**SIMRS BT TNI AD context (mengapa ini menjadi Critical untuk inversi):**

- Invisible system errors = military medical operational liability
- Tidak dapat retrospect on failures (silent corruption potential)
- Tidak dapat alert proactively (system degradation goes unnoticed)
- Multi-RS distributed errors menuntut centralized observation

**Inversion pattern:**

1. **Centralized error tracking infrastructure:**
   - Sentry (atau equivalent: Bugsnag, Rollbar) untuk application error capture
   - Captures stack trace, user context, request context, environment
2. **Schema-level error log table:**
   - `audit.system_errors` — captures application-level error events dengan context
   - Append-only; long retention untuk audit forensics
3. **Structured logging throughout:**
   - JSON-structured logs dengan correlation IDs (per request, per workflow)
   - Log levels: DEBUG, INFO, WARN, ERROR, FATAL
   - Centralized log aggregation (Supabase log_events, atau external)
4. **Alerting untuk critical errors:**
   - Real-time alerts untuk error patterns (rate spike, new error class)
   - On-call rotation dengan paging (military operational tempo)
5. **User-friendly error UX:**
   - End-user sees friendly message + error reference ID
   - Engineer dapat look up error reference di Sentry/log aggregator
   - **No raw stack traces** ke operators

**Suggested formalization wording:**

> *"Application errors SHALL be captured to centralized error tracking infrastructure (Sentry or equivalent) including stack trace, user context, request context, and environment metadata. Schema-level `audit.system_errors` table SHALL persist error events with structured context for long-term audit retention. All log output SHALL be JSON-structured with correlation IDs traceable across request/workflow boundaries. Critical error patterns (rate spike, new error class) SHALL trigger real-time alerts to on-call rotation with paging appropriate to TNI AD operational tempo. End-user error display SHALL be user-friendly with reference ID; raw stack traces never exposed to operators."*

**Cross-chain implication:** Supports §5.6.1 (audit) by capturing application-layer failures yang audit log tidak dapat reach. Independent infrastructure dimension.

**Cross-references:** §11.11 (anti-primitive P8-D risk), §5.6.1 (complementary audit infrastructure for operational vs application errors), Appendix B (Phase 3 D3 §C.5 + §E.5 detailed source).

---

#### 5.6.6 Multi-Tenant Schema Pattern ⭐ (Sequencing Priority #2)

**Cross-reference:** P10-B (anti-primitive — Single-Tenant Schema Design, 🟠 High but **sequencing-critical**); Chain 3 head.

**Rationale dalam konteks SIMRS BT:**

Multi-tenant retrofit dari single-tenant adalah **order-of-magnitude harder** daripada multi-tenant from day one. G5 Karumkit network vision (RS Batin Tikal sebagai model replicable untuk RS Militer lain) menjadikan ini architecturally critical. Per Phase 3 §F sequencing, ini adalah **priority #2** setelah Chain 4 foundation (dual-spine) — schema decision yang harus dibuat sebelum operational data substantial.

**Khanza-rational context (yang membentuk anti-primitive ini):**

Khanza dioptimasi untuk konteks per-deployment single-RS dengan model bisnis 1500+ RS adoption:

- Empiris: **0 `rs_id` / `tenant_id` / `klinik_id` / `hospital_id` columns** across 1156 tables. Schema designed for one RS per deployment
- Khanza business model: 1500+ RS = 1500+ separate Khanza installations, each dengan database sendiri
- Per-RS customization via 52 `set_*` configuration tables (not via tenancy column)
- Untuk model deployment "one Khanza instance per RS", single-tenant schema adalah perfectly rational — tidak perlu tenancy overhead saat each install genuinely serves one tenant

Untuk konteks Khanza dengan model on-premise per-RS deployment, single-tenant schema adalah trade-off optimal: simpler schema, no RLS complexity, no cross-tenant query risk.

**SIMRS BT TNI AD context (mengapa ini menjadi sequencing-critical):**

- G5 Karumkit vision: SIMRS Batin Tikal sebagai **model replicable** untuk RS Militer TNI AD lain → multi-RS adoption melalui shared SIMRS BT cloud instance, bukan per-RS install
- Initial deployment mungkin serve 1 RS, tapi schema readiness untuk multi-RS expansion avoids order-of-magnitude harder retrofit
- TNI AD audit cross-RS visibility (BPK/Itjenad central oversight) menuntut tenancy boundary yang queryable
- Multi-tenant retrofit late = ~every operational table needs schema migration + audit trail rebuild + RLS policy backfill

**Inversion pattern:**

1. **`rs_id UUID NOT NULL REFERENCES rs(id)` pada setiap operational table:**
   - Setiap encounter, billing record, prescription, lab result, dll. menerima rs_id sejak inception
   - PostgreSQL FK constraint pada master `rs` table
2. **Reference master tables conditional `rs_id`:**
   - `master.diagnosa_icd10`, `master.obat` (globally-shared catalogs): MAY exclude `rs_id` (genuinely cross-tenant standards)
   - Tenant-customized master data (mis. internal price list, internal SOP templates): INCLUDE `rs_id`
3. **PostgreSQL Row-Level Security (RLS) policies:**
   - Setiap operational table memiliki RLS policy: `(rs_id = current_setting('app.current_rs_id')::UUID)` untuk SELECT/UPDATE/DELETE
   - Session context: `app.current_rs_id` di-set per request dari authenticated user's RS membership
4. **Cross-tenant queries via elevated role + audit:**
   - Cross-tenant query (mis. BPK central audit) menuntut elevated role
   - Setiap cross-tenant query logged dalam audit trail (§5.6.1) dengan rationale + user
5. **Schema multi-tenant-ready dari inception:**
   - Initial deployment MAY serve single RS, tapi structurally multi-tenant-ready
   - Tidak ada "phase-2 add multi-tenancy" — schema-level decision dari day 1

**Suggested formalization wording:**

> *"Every operational table SHALL include `rs_id UUID NOT NULL REFERENCES rs(id)` column. Reference master tables (master.diagnosa_icd10, master.obat globally-shared catalogs) MAY exclude `rs_id` if genuinely cross-tenant; tenant-customized master data includes `rs_id`. PostgreSQL Row-Level Security (RLS) policies SHALL enforce tenant isolation: every operational table has RLS policy `(rs_id = current_setting('app.current_rs_id')::UUID)` for SELECT/UPDATE/DELETE. Cross-tenant queries require explicit elevated role with audit logging. Initial deployment MAY serve a single RS, but schema is structurally multi-tenant-ready from inception."*

**Cross-chain implication:** Foundation Chain 3 inversion. Enables §5.6.7 (RBAC dengan tenant scoping). Schema-level decision; **expensive to retrofit**. Per §9 sequencing: priority #2 (immediately after Chain 4 foundation adoption).

**Cross-references:** §9 (sequencing — priority #2), §11.12 (anti-primitive P10-B risk), §5.6.7 (RBAC tenant scoping consumer), Appendix B (Phase 3 D3 §C.10 + §E.6 detailed source).

---

#### 5.6.7 RBAC Pattern

**Cross-reference:** P7-F (anti-primitive — Authorization-as-Boolean-Matrix, 🟠 High); Chain 3 mid.

**Rationale dalam konteks SIMRS BT:**

Khanza's 1198-column boolean matrix tidak scale ke multi-tenant; feature additions seharusnya tidak menuntut user-table schema migration. TNI AD military hierarchy maps naturally ke role abstraction (dokter umum, perawat rawat inap, admin keuangan, kepala yanmed) bukan ke per-feature boolean flags.

**Khanza-rational context (yang membentuk anti-primitive ini):**

Khanza dioptimasi untuk konteks single-RS dengan stable feature set + admin-friendly UI:

- Empiris: Authorization implemented sebagai **1198-column boolean matrix** pada `user` table — satu kolom per feature flag (`can_access_apotek_obat`, `can_view_keuangan`, dsb.)
- Boolean matrix lebih sederhana daripada RBAC untuk fixed feature set
- Admin-friendly: feature flags directly visible per user; admin checkbox UI matches schema structure
- Untuk single-RS dengan stable feature set, ini adalah sound engineering
- 1198 columns accreted over 15 years sebagai features added

Untuk konteks Khanza tahun 2010-an dengan single-RS deployment + admin yang familiar dengan checkbox-per-feature paradigm, boolean matrix adalah trade-off antara simplicity dan scalability — appropriate untuk era dan skala saat itu.

**SIMRS BT TNI AD context (mengapa ini menjadi High untuk inversi):**

- Multi-tenant menuntut role abstraction (each tenant tidak mereplikasi 1198-column user table — itu = 1198 × N_tenants kolom)
- Feature additions seharusnya tidak menuntut schema migration on user table
- TNI AD military hierarchy maps naturally ke roles, bukan feature flags
- Audit requirement: siapa punya permission apa, kapan granted, oleh siapa — menuntut role abstraction yang queryable

**Inversion pattern:**

1. **RBAC abstraction dengan 4 core tables:**
   - `auth.roles` — role definitions (mis. "dokter_umum", "perawat_rawat_inap", "admin_keuangan", "kepala_yanmed")
   - `auth.permissions` — atomic permission definitions (dot-notation, mis. `encounter.create`, `billing.finalize`, `audit.view`)
   - `auth.role_permissions` — many-to-many: roles ke permissions
   - `auth.user_roles` — many-to-many: users ke roles (dengan `rs_id` untuk multi-tenant scope)
2. **Permission check API:**
   - Service layer function: `hasPermission(userId, permission, context)` — returns boolean
   - Used di API endpoints + service functions + UI (conditional rendering)
3. **Permission grant audit:**
   - Audit log entries untuk grant/revoke operations
   - Effective-permission queries: "permission apa yang user X punya right now"
   - Historical-permission queries: "permission apa yang user X punya pada tanggal Y"
4. **Optional: scoped permissions untuk fine-grained control:**
   - Permission dapat scoped ke entity (mis. "encounter.view scoped to own-patient-only")
   - Scope evaluator di service layer

**Implementation dependency:** Requires §5.6.6 (tenant scoping) untuk `user_roles.rs_id`; requires §5.6.1 (audit) untuk grant/revoke audit logging; requires §5.6.9 (service layer) untuk permission check API hosting.

**Suggested formalization wording:**

> *"Authorization SHALL use 4-table RBAC abstraction: `auth.roles` (role definitions), `auth.permissions` (atomic permission definitions, dot-notation e.g. `encounter.create`), `auth.role_permissions` (M2M roles to permissions), `auth.user_roles` (M2M users to roles, with `rs_id` for tenant scope). Service layer SHALL expose `hasPermission(userId, permission, context)` check used at API endpoint guard + service function precondition + UI conditional rendering. Permission grant/revoke operations SHALL emit audit log entries enabling historical permission queries (`who had permission X at time T`). Scoped permissions (e.g., `encounter.view scoped to own-patient`) supported via scope evaluator at service layer."*

**Cross-chain implication:** Depends on §5.6.6 (tenant scoping). Replaces P7-F boolean matrix entirely.

**Cross-references:** §11.13 (anti-primitive P7-F risk), §5.6.6 (tenant scoping prerequisite), §5.6.1 (audit prerequisite), §5.6.9 (service layer host), Appendix B (Phase 3 D3 §C.8 + §E.7 detailed source).

---

#### 5.6.8 Centralized Validation Library Pattern

**Cross-reference:** P7-A (anti-primitive — Per-Form Inline Validation, 🟠 High); Chain 1 mid.

**Rationale dalam konteks SIMRS BT:**

Validation rule drift across forms = data quality erosion. Modern stack (Zod, Yup, equivalent) menjadikan centralized validation ergonomic. Validation harus run on server (cannot trust client-side only). Centralized validation library memungkinkan single source of truth yang reusable across UI, API endpoint, dan service layer.

**Khanza-rational context (yang membentuk anti-primitive ini):**

Khanza dioptimasi untuk konteks Java pre-Bean-Validation era dengan per-module team ownership:

- Empiris: Validation logic duplicated across Swing dialogs (~76 DlgCari + numerous DlgIsi/DlgEdit). Each form implements validation inline
- Java pre-Bean-Validation era; per-form duplication acceptable cost untuk module independence
- Each module team owned their validation; coordination overhead minimal
- Validation rules tightly tied to form UX — co-location made sense

Untuk konteks Khanza dengan Java pre-Bean-Validation toolchain dan team-per-module ownership model, per-form inline validation adalah trade-off optimal antara module autonomy dan validation rigor.

**SIMRS BT TNI AD context (mengapa ini menjadi High untuk inversi):**

- Modern stack (Zod, Yup, Bean Validation) makes centralized validation ergonomic
- Multi-client future menuntut validation on server (cannot trust client-side only)
- Validation rule drift across forms = data quality erosion
- TNI AD audit menuntut consistent data quality across modules — drift di validation = audit defect

**Inversion pattern:**

1. **Centralized validation library:**
   - Pure helper validators di shared module (mis. `@simrs-bt/validators`)
   - Per-domain validators: `patientValidators`, `prescriptionValidators`, `billingValidators`
   - TypeScript types derived dari validator schemas (Zod's `infer` pattern atau equivalent)
2. **Validation at multiple layers, single source of truth:**
   - Validator yang **SAMA** runs on UI (instant feedback) + API (defense-in-depth) + service layer (business rule enforcement)
   - DB constraints sebagai final guard
3. **Composable validators:**
   - Combine atomic validators (`required`, `isUUID`, `isNomorRekamMedis`, dsb.) menjadi form validators
   - Reuse across forms via composition
4. **Error message localization:**
   - Indonesian error messages by default
   - Field-level error attribution untuk UX

**Implementation dependency:** Requires §5.6.9 (service layer) untuk validation library hosting.

**Suggested formalization wording:**

> *"Validation rules SHALL be defined in shared `@simrs-bt/validators` module as pure functions/schemas (Zod, Yup, or equivalent). TypeScript types SHALL be derived from validator schemas (single source of truth). The SAME validator SHALL run at three layers: (1) UI (instant feedback), (2) API endpoint (defense-in-depth), (3) service layer (business rule enforcement). DB constraints serve as final guard. Validators SHALL be composable — atomic validators (isUUID, isNomorRekamMedis, isKodeICD10) combine into form validators. Error messages SHALL be Indonesian by default with field-level attribution. Reference architectural pattern: pure validator helpers in dedicated module, called from service layer."*

**Cross-chain implication:** Depends on §5.6.9 (service layer) untuk hosting. Completes Chain 1 mid-stack inversion. Supports §5.6.4 (SQL injection mitigation) via input sanitization layer.

**Cross-references:** §11.14 (anti-primitive P7-A risk), §5.6.9 (service layer prerequisite), §5.6.4 (input sanitization consumer), Appendix B (Phase 3 D3 §C.7 + §E.8 detailed source).

---

#### 5.6.9 Service Layer Architecture Pattern

**Cross-reference:** P4-C (anti-primitive — UI-as-Orchestrator / No Service Layer, 🟠 High); Chain 1 head.

**Rationale dalam konteks SIMRS BT:**

Business logic harus hidup di suatu tempat; UI adalah tempat yang salah (untestable, duplication-prone, multi-client-incompatible). Service layer adalah foundational architectural tier untuk SIMRS BT. Tanpa service layer, validation library tidak punya home (§5.6.8), RBAC permission checks tidak punya host (§5.6.7), transaction discipline tidak punya boundary unit (§5.6.3).

**Khanza-rational context (yang membentuk anti-primitive ini):**

Khanza dioptimasi untuk konteks 2010-era Java fat-client dengan LAN architecture:

- Empiris: Swing event handlers (Dialog classes) become orchestrators — receive user input, validate, build SQL, execute, handle results. No intermediate service layer
- Fat-client + LAN architecture (P4-A) precludes service layer naturally
- Module teams developed Dialog classes independently — simpler coordination model
- Untuk 2010-era Java tanpa modern service-layer ergonomics, this was sound

Untuk konteks Khanza dengan fat-client paradigm pada LAN, intermediate service layer akan menambah arsitektur tier tanpa benefit operational — Dialog-as-orchestrator adalah natural fit untuk Swing + JDBC era.

**SIMRS BT TNI AD context (mengapa ini menjadi High untuk inversi):**

- Web + API architecture creates layers by definition
- Business logic harus hidup di suatu tempat; UI is wrong place (untestable, duplication-prone)
- Multi-client future (mobile, desktop, integration partners) menuntut shared service layer
- TNI AD audit menuntut testable business logic (untuk regression test post-incident)

**Inversion pattern:**

1. **Service layer sebagai first-class architectural tier:**
   - TypeScript service classes/functions: `EncounterService`, `BillingService`, `PrescriptionService`
   - Pure business logic — **no UI dependency, no DB driver dependency**
   - Composable via dependency injection (atau function composition)
2. **UI sebagai thin orchestrator of API calls:**
   - React components call service-layer-exposed API endpoints
   - Form submission → API call → service function → DB
   - UI logic: presentation, input collection, optimistic updates
3. **API layer between UI dan service:**
   - REST, tRPC, atau GraphQL — typed contracts
   - API endpoints thin: validation (§5.6.8) + auth (§5.6.7) + service function call
4. **Service layer testability:**
   - Unit tests pada service functions (mocked DB)
   - Integration tests pada service+DB
   - No UI in test loop untuk business logic verification

**Suggested formalization wording:**

> *"Business logic SHALL live in TypeScript service layer (e.g., `EncounterService`, `BillingService`, `PrescriptionService`) — pure business logic with no UI dependency and no direct DB driver coupling. Services SHALL be composable via dependency injection or function composition. UI components SHALL be thin orchestrators of API calls: form submission → API endpoint → service function → DB. API layer (REST, tRPC, or GraphQL) sits between UI and service: thin endpoints with validation (§5.6.8) + auth (§5.6.7) + service function invocation. Service functions SHALL be transaction units (§5.6.3). Unit tests cover services with mocked DB; integration tests cover service + DB; UI tests cover presentation logic only. Multi-client future (web, mobile, integration partners) consumes same service layer via API."*

**Cross-chain implication:** Chain 1 head. Enables §5.6.8 (validation library has home), P3-B inversion (state machines as TS code), §5.6.3 (transaction unit boundaries), §5.6.7 (RBAC permission check API hosting). Modernization of P6-D + P7-B (DB-passive philosophy preserved with service layer as coordination locus — see Appendix A.11 + A.12).

**Cross-references:** §11.15 (anti-primitive P4-C risk), §5.6.3 (transaction unit dependency), §5.6.7 + §5.6.8 (consumers), Appendix A.11 + A.12 (P6-D + P7-B modernization), Appendix B (Phase 3 D3 §C.6 + §E.9 detailed source).

**Closing note untuk §5.6:**

Sembilan pola di §5.6.1-§5.6.9 membentuk **architectural foundation** SIMRS Batin Tikal Phase 2 implementation. Implementasi konkret per pola dilakukan oleh SIMRS BT Phase 2 spoke session — yang akan consume blueprint v2.0 sebagai authoritative source dan menerjemahkan formalization wordings menjadi schema migrations, service layer code, RLS policies, validation modules, dan CI/CD gates.

Urutan implementasi pola-pola ini **tidak independen** — lihat §9 (Inversion Sequencing) untuk Chain-based implementation order yang menghindari rework cycles.

---

## 6. SIKESUMA's Complementary Role

### 6.1 What SIKESUMA Brings

SIKESUMA, sebagai aplikasi yang sudah dalam pengembangan tier-based, telah accumulated nilai berikut yang **complement** SIMRS Batin Tikal:

**TNI AD-specific domain expertise:**

- **POK (Penyusunan Operasional Kegiatan)** — workflow + structure per Permenhan Renhan 7/2025
- **BAS (Bagan Akun Standar)** — KEP 211, KEP 291, KEP 331 implementations
- **Pagu + RAB + RPD + LRA** — anggaran lifecycle yang TNI AD specific
- **Jasa medis** — slip gaji Militer-specific structure
- **Revisi POK workflow** — audit trail Tier 5 yang sedang dibangun
- **BNHP detection** — biaya non-habis pakai validation
- **Audit framework alignment** — BPK + Itjenad oversight patterns

**Technical patterns yang sudah teruji:**

- Schema design dengan JSONB envelope (proven scalable + flexible)
- Validation engine architecture
- Audit trail pattern (Tier 5)
- Multi-tenant ready patterns

### 6.2 Knowledge Transfer Dimensions

Ketika SIMRS Batin Tikal Phase 2 membangun modul-modul yang overlap dengan SIKESUMA scope (terutama Phase 2.2 accounting + reporting), SIKESUMA's accumulated knowledge dapat di-transfer dalam beberapa dimensi:

| Dimensi Transfer | Yang SIKESUMA Sediakan | Bagaimana SIMRS BT Consume |
|---|---|---|
| **Schema patterns** | Existing tables + JSONB envelope structure | Reference untuk design schema modul akuntansi SIMRS BT |
| **Validation rules** | POK validators, BNHP detectors, BAS mappings | Reference + adaptation ke modul yang relevant |
| **Workflow logic** | Revisi POK state machine, jasa medis calculation | Reference untuk workflow design yang TNI-aware |
| **Audit pattern** | Tier 5 immutable audit | Reference untuk audit trail backbone SIMRS BT |
| **Domain glossary** | Existing dokumentasi REVISI-POK-PAGU-vKoreksi | Onboarding material untuk AI sessions Phase 2 |

### 6.3 SIMRS Batin Tikal Data Flow to SIKESUMA

Eventually, SIKESUMA akan consume data primary dari SIMRS Batin Tikal (instead of relying on manual input atau extract dari vendor). Pola integration:

- **API contract** internal antara SIMRS Batin Tikal dan SIKESUMA
- **Event-driven** atau **scheduled sync** — pattern TBD di Phase 2.2 design
- **Audit lineage** maintained — SIKESUMA tahu sumber data primary

### 6.4 SIKESUMA Continued Development Trajectory

SIKESUMA **tidak pause** untuk menunggu SIMRS Batin Tikal. Tier-based roadmap continues:

- **Saat ini:** Tier 5a Phase 2 (backend audit trail Revisi POK)
- **Berikutnya:** Tier 5b (UI audit trail)
- **Setelah:** Tier 6 (Template SK), Tier 7 (EWS), Tier 8 (BNHP detection), dll.

Pengembangan SIKESUMA paralel dengan SIMRS Batin Tikal Phase 2. Di waktu tertentu (mis. saat SIMRS BT mulai modul accounting), ada **moments of consultation** dimana SIMRS BT team membaca SIKESUMA codebase + schemas untuk knowledge transfer.

### 6.5 Risk Mitigation untuk Coexistence

Karena dua sistem coexist, perlu attention pada:

- **Data redundancy management** — di mana data primary disimpan (jawaban: SIMRS BT eventually; SIKESUMA reads + processes)
- **Schema drift** — kalau modul overlap, schema antara dua sistem perlu di-koordinasi
- **User confusion** — petugas RS perlu jelas tahu sistem mana untuk task mana

Detail mitigasi di sub-blueprint atau working docs Phase 2.2.

---

## 7. Track-S Bridge — STUB Position

### 7.1 Definisi

Track-S Bridge adalah **sinkronisasi mechanism** antara SIMRS Batin Tikal (primary source) dan vendor Terasehat (eksisting consumer), atau eventually system lain (mis. sub-vendor, system inter-RS).

### 7.2 Sengaja Light Scope di Blueprint Ini

Track-S Bridge **tidak di-elaborate detail** di dokumen ini. Rationale:

**Track-S only makes sense AFTER SIMRS Batin Tikal substantially operational.**

- Tanpa SIMRS Batin Tikal yang punya data primary, tidak ada apa yang di-sync
- Tanpa understanding actual operational pattern SIMRS BT, design Track-S premature
- Pre-mature detailing menciptakan **complexity trapping** — terjebak di asumsi tentang sync yang mungkin invalid saat SIMRS BT real-operational

### 7.3 Yang Sudah Ditetapkan tentang Track-S

Per Phase S0 decisions yang carry over (lihat §10), beberapa hal sudah locked:

- **Mechanism approach:** web automation as user proxy (D-S0.2)
- **Credentials:** per-petugas (D-S0.3)
- **Vendor engagement:** zero throughout pre-Track-S phases (D-S0.5)
- **TOS review:** parallel + timed (D-S0.4) — review akan dilakukan saat RS siap menghadapi posture negative vendor, biasanya di Tahap 3 onset

### 7.4 Kapan Track-S Di-Detail

Detail blueprint Track-S Bridge akan dibuat saat:

- SIMRS Batin Tikal Phase 2.2 atau 2.3 menyentuh kedalaman operasional yang substantial
- Owner judgement bahwa Track-S concretely needed (bukan teoretis)
- Coverage SIMRS BT mencapai threshold yang memerlukan vendor sync (estimasi: saat 30%+ data flow RS sudah di SIMRS BT)

Estimasi kasar: Tahap 3 mulai di **bulan 6–9** setelah SIMRS Batin Tikal Phase 2.1 kickoff.

### 7.5 Anti-Pattern yang Dihindari

❌ **Detail Track-S Bridge sekarang** — Track-S Blueprint v1.1 yang superseded mengandung detail S0-S4 yang sesungguhnya premature. Pendekatan tersebut menciptakan complexity trapping.

✅ **Stub now, detail later** — sekarang cukup placeholder + locked-in core decisions. Detail saat operational reality matang.

---

## 8. Khanza Codex Integration

### 8.1 Brief Description

Khanza Codex adalah **referensi konseptual** yang dihasilkan oleh spoke session khusus yang menganalisa SIMRS Khanza (sistem open-source SIMRS Indonesia). Output spoke session berupa dokumen `THE-KHANZA-CODEX.md` yang berisi:

- Filosofi SIMRS (worldview Khanza tentang RS)
- Primitif fundamental
- Theoretical framework
- Architecture & workflow patterns
- Modular composition + dependencies
- Universal functions & logic
- Error prevention patterns
- Workaround tricks
- Synthesis: implications untuk SIKESUMA / SIMRS Batin Tikal

### 8.2 Consumption Pattern di SIMRS Batin Tikal Build

Saat SIMRS Batin Tikal Phase 2 (build) dimulai, AI session yang men-design + men-implement modul akan **consult The Khanza Codex** untuk:

- Adopt primitif yang relevan + adapt untuk modern web stack
- Pahami pattern arsitektur yang teruji (15+ tahun, 1500+ RS)
- Anticipate edge cases yang Khanza sudah solve
- Avoid anti-patterns yang Khanza identify

**Yang BUKAN dilakukan:**

- ❌ Copy code dari Khanza ke SIMRS Batin Tikal codebase
- ❌ Copy schema verbatim
- ❌ Adopt Khanza patterns blindly tanpa evaluasi

Semua adopsi adalah **conceptual adoption + independent implementation** (clean room reverse engineering posture).

### 8.3 Cross-Reference

Lihat `KHANZA-SPOKE-SESSION-BRIEF.md` untuk:

- Mandate Khanza spoke session
- Methodology (thesis-before-data, primitives over synthesis)
- Boundaries (license/IP isolation)
- 10 domains analisa
- Output specification

---

## 9. Inversion Sequencing & Implementation Order

Section ini menjawab pertanyaan: *"Dalam Tahap 2 SIMRS BT Build, dengan urutan apa anti-primitives di-invert dan TIMELESS primitives di-adopt agar architectural decisions cascade benefit, bukan menciptakan rework cycles?"*

Per Phase 3 Codex D2 (CAUSAL-CHAINS) dan D3 §F, **implementation order matters**. Inverting an anti-primitive tanpa upstream causes leads to rework; inverting upstream causes cascades benefits ke downstream inversions.

**Scope catatan:** §9 v2.0 fokus eksklusif pada **architectural inversion sequencing** dalam Tahap 2 build. Macro-strategic phasing (kapan Tahap N start, calendar timing) di-cover di tempat lain dalam blueprint:

- **Tahap 2 SIMRS BT Build sub-phases:** §5.5 (Phase 2.1a/b/c/d + Phase 2.2 + Phase 2.3+)
- **Tahap 3 Track-S Bridge timing:** §7 (stub now, detail saat operational reality matang)
- **Parallel SIKESUMA continued:** §6.4 (tier-based independent track)
- **Phase S0 Owner-led prerequisites + carry-over decisions:** §10 (Phase Decisions Carried Over)
- **Tahap 1 Khanza Codex completion status:** ✅ DONE per Phase 3 Closure (Mei 2026) — see §3.6 + Appendix B

### 9.1 Recommended Sequence — 4 Priorities + Continuous

| Priority | Phase | What | Why |
|---|---|---|---|
| **#1** | **Foundation** | **Adopt Chain 4** (P1-B + P3-D + P6-A) — dual-spine architecture dari day one | Universal correctness; creates structural conditions untuk downstream inversions; minimal cost saat done at start |
| **#2** | **Schema** | **Invert Chain 3** (P10-B + P7-F → §5.6.6 + §5.6.7) — `rs_id` everywhere + RLS + RBAC | Schema decision; **expensive to retrofit**; G5 Karumkit network vision menuntut ini |
| **#3** | **Audit** | **Invert Chain 2 top** (P7-E → §5.6.1) lalu cascade ke P4-D (§5.6.2), P6-B (§5.6.3) | Audit infrastructure enables version columns + transactions to function meaningfully |
| **#4** | **Layers** | **Invert Chain 1 top** (P4-A web/API + P4-C service layer → §5.6.9) lalu cascade ke P7-A (§5.6.8), P3-B (state machines as TS) | Service layer enables centralized validation + testable state machines |
| **Continuous** | **All phases** | **Adopt TIMELESS primitives + P-NEW-1 hybrid** (lihat Appendix A) | Multipliers — each adopted improves multiple chains |

**Catatan struktural:**

- Priority #1 (Foundation) adopts **Chain 4** (positive chain) sebagai architectural foundation. Khanza pioneered ini dengan benar untuk konteks RS Indonesia.
- Priority #2-#4 (Schema, Audit, Layers) invert **Chain 3, Chain 2, Chain 1** (anti-primitive chains) dengan urutan yang menghormati causal dependencies.
- Continuous track berjalan paralel — TIMELESS primitives di Appendix A diadopsi where relevant throughout build.

### 9.2 Cascade Benefit Framing

**Inverting upstream cascades benefits ke downstream:**

- **Adopt Chain 4 first** (P1-B + P3-D + P6-A) → Dual-spine schema naturally supports tenant boundaries (helps #2) + audit pathway separation (helps #3) + module organization (helps #4)
- **Invert P10-B + add RLS** (#2) → `rs_id` everywhere makes RBAC tenant-aware naturally (§5.6.7 P7-F inversion easier) → multi-tenant menjadi structural reality, bukan afterthought
- **Invert P7-E first within Chain 2** (#3 step 1) → Audit infrastructure makes version columns meaningful (§5.6.2 P4-D inversion has context) → transactions menjadi naturally testable (§5.6.3 P6-B inversion implementable)
- **Invert P4-A + P4-C first within Chain 1** (#4 step 1) → Service layer creates home for validation library (§5.6.8 P7-A inversion) → state machines move to TS code (P3-B inversion) → entire Chain 1 lower stack inverts as side-effect

**Implication operasional:** Kalau SIMRS BT Phase 2 spoke session melakukan inversi sesuai urutan ini, **N inversions menghasilkan benefit > N** karena setiap upstream inversion menciptakan structural conditions untuk downstream inversion. Out-of-order inversion menciptakan rework — lihat §9.3.

### 9.3 Anti-Sequence — What NOT To Do

**Inverting in reverse order menciptakan rework cycles:**

- ❌ **Build centralized validation library before service layer exists** → validation leaks back into UI components (Khanza's anti-form P7-A re-manifest). Hasil: validation library dibangun, lalu dibongkar saat service layer dibuat.
- ❌ **Add version columns before audit infrastructure** → conflict resolution has no forensic context, operators cannot determine which version to keep. Hasil: §5.6.2 implementation incomplete dan harus dirombak setelah §5.6.1 implemented.
- ❌ **Add RBAC before `rs_id` schema decision** → role-permission grants don't scope to tenant, multi-tenant retrofit re-touches every grant. Hasil: §5.6.7 implementation harus migrate setiap `user_roles` row saat `rs_id` ditambahkan.
- ❌ **Implement encounter hub last** → other inversions reference "encounter" before its structure stabilizes. Hasil: clinical detail tables FK menjadi unstable; refactoring cycles.

**Pola umum yang dihindari:** "Just-in-time architecture" — adding architectural primitives reactively saat downstream code menuntutnya. Untuk inversion sequencing, **upstream-first** adalah aturan.

### 9.4 Owner Decision Surface

SIMRS BT Phase 2 spoke session memiliki autonomy untuk calibrate sequence berdasarkan:

| Faktor | Implikasi calibration |
|---|---|
| **Initial deployment scope** | Kalau truly single-RS for 3+ years, priority #2 (multi-tenant Chain 3) bisa dipindah ke phase 2 dalam Tahap 2 — tapi schema decision tetap dibuat day 1, RLS aktivasi yang ditunda |
| **External integration timeline** | Kalau BPJS integration di month 1, §5.6.4 SQL injection mitigation accelerated ke priority parallel-#1 |
| **Audit framework rollout** | Kalau Itjenad digital audit launches year 1, §5.6.1 audit infrastructure priority elevated ke parallel-#1 |
| **Team velocity** | Recommended sequence assumes ~3-month phases per priority; calibrate per actual capacity. Phase 2.1 (5 bulan estimasi per §5.5) mungkin cover #1 + #2 saja; #3 + #4 di Phase 2.2 |
| **Pilot Sie Renbang scope** | Modul prioritas pilot (mis. admin billing per D-S0.8) mungkin tidak menuntut full Chain 2 audit pada pilot — tapi audit infrastructure tetap di-build sebagai foundation untuk modul klinis later |

**Discipline:** **Sequencing logic (foundation → schema → audit → layers) lebih penting daripada specific phase timing.** SIMRS BT Phase 2 spoke session retain autonomy untuk adjust timing per actual constraints — yang tidak boleh adalah inversion dengan urutan yang violates causal dependencies.

**Cross-references:** §4.7 (Three Deep Choices = WHY architectural sequencing matters), §5.6 (9 architectural patterns yang di-sequence di sini), §11 (anti-primitives risk register dengan severity tiers), Appendix A (TIMELESS primitives untuk Continuous track), Appendix B (Phase 3 D3 §F detailed source + D2 CAUSAL-CHAINS verification).

---

## 10. Phase Decisions (Carried Over)

Phase S0 decisions yang awalnya ditetapkan di `TRACK-S-DATA-SOVEREIGNTY-BLUEPRINT.md` v1.1 §8 **masih valid** — di-carry-over ke blueprint ini dengan annotation aplikasi dalam framing baru.

### 10.1 D-S0.1 — Scope Bertahap

**Keputusan original:** Bertahap — admin/billing dulu, klinis kemudian
**Aplikasi dalam framing baru:** Scope **SIMRS Batin Tikal Phase 2** — Phase 2.1 (admin/billing), Phase 2.2 (admin expansion), Phase 2.3+ (klinis). Track-S Bridge inherits scope yang SIMRS BT sudah cover.

### 10.2 D-S0.2 — Feed Mechanism Opsi C (Hybrid)

**Keputusan original:** Mulai dengan web automation, evaluate transition ke API formal di Phase later
**Aplikasi dalam framing baru:** Feed mechanism adalah **Track-S Bridge approach**, bukan SIMRS Batin Tikal approach. Web automation start adalah default untuk Tahap 3 saat Track-S detail dibuat.

### 10.3 D-S0.3 — Credentials Per-Petugas

**Keputusan original:** RS Server simpan credentials petugas, login as them
**Aplikasi dalam framing baru:** Berlaku untuk Track-S Bridge phase. SIMRS Batin Tikal itself punya authentication sendiri (petugas RS login direct).

### 10.4 D-S0.4 — Vendor Contract & TOS Review

**Keputusan original:** Parallel + timed — review dilakukan saat RS siap menghadapi posture negative vendor
**Aplikasi dalam framing baru:** Tetap valid. Review timing kemungkinan saat menjelang Tahap 3 Track-S onset.

### 10.5 D-S0.5 — Posisi Vendor Engagement

**Keputusan original:** No engagement throughout pre-Track-S phases
**Aplikasi dalam framing baru:** Berlaku untuk Tahap 1 (Khanza Codex), Tahap 2 (SIMRS Batin Tikal build). Vendor engagement opsional di Tahap 3+.

### 10.6 D-S0.6 — Infrastruktur Cloud Supabase

**Keputusan original:** Cloud Supabase untuk Phase S1-S2; evaluate transition di Phase S3+
**Aplikasi dalam framing baru:** SIMRS Batin Tikal hosting = cloud Supabase untuk Phase 2.1-2.2; evaluate transition ke Indonesian cloud atau self-hosted di Phase 2.3+ kalau data sensitivity menuntut (terutama untuk modul klinis).

### 10.7 D-S0.7 — UX Design AI-Assisted

**Keputusan original:** AI-assisted design + iterasi petugas
**Aplikasi dalam framing baru:** Berlaku untuk SIMRS Batin Tikal Phase 2 build. SIKESUMA continued development uga maintain pattern yang sama.

### 10.8 D-S0.8 — Pilot Sie Renbang

**Keputusan original:** Pilot di Sie Renbang dengan Angga sebagai champion
**Aplikasi dalam framing baru:** Berlaku untuk SIMRS Batin Tikal Phase 2.1 pilot.

### 10.9 Decision Matrix Summary

| ID | Keputusan | Aplikasi pada Workstream |
|---|---|---|
| D-S0.1 | Scope bertahap admin→klinis | SIMRS Batin Tikal Phase 2.1-2.3+ |
| D-S0.2 | Hybrid feed (start web automation) | Track-S Bridge (Tahap 3) |
| D-S0.3 | Credentials per-petugas | Track-S Bridge (Tahap 3) |
| D-S0.4 | TOS review parallel + timed | Track-S Bridge prep (Tahap 3 onset) |
| D-S0.5 | No vendor engagement pre-Track-S | Tahap 1 + Tahap 2 |
| D-S0.6 | Cloud Supabase | SIMRS Batin Tikal Phase 2.1-2.2 |
| D-S0.7 | AI-assisted UX | SIMRS Batin Tikal Phase 2 + SIKESUMA continued |
| D-S0.8 | Pilot Sie Renbang | SIMRS Batin Tikal Phase 2.1 |

---

## 11. Risk Register & Mitigation

### 11.1 Strategic Risks

| ID | Risiko | Likelihood | Impact | Mitigasi |
|---|---|---|---|---|
| **R-S1** | Vendor relationship deteriorate (perception SIMRS BT sebagai threat) | Rendah | Sedang | Tidak adversarial; vendor tetap mitra selama dibutuhkan. Engagement throttled per D-S0.5 |
| **R-S2** | Stakeholder internal misalignment (Karumkit, Sie Renbang, Panji) | Sedang | Tinggi | Phase S0 includes explicit alignment meetings (pre-Tahap 2 kickoff prereq) |
| **R-S3** | Scope creep — SIMRS Batin Tikal expand ke kompleksitas yang tidak manageable | Sedang | Tinggi | Phase 2.1 scope locked sebagai admin/billing; phasing strict (per §5.5) |
| **R-S4** | Resource constraint RS Tk IV untuk multi-tahun development | Sedang | Tinggi | Fresh AI session model + Owner pacing realistik. Pause antar phase OK |
| **R-S5** | **Complexity trapping Track-S** — pre-mature detailing yang invalidate saat operational reality matang | **Tinggi** kalau tidak di-mitigate | Sedang | **Track-S sebagai stub** sampai Tahap 3 concretely di-plan (§7) |

### 11.2 Technical Risks

| ID | Risiko | Likelihood | Impact | Mitigasi |
|---|---|---|---|---|
| **R-T1** | Track-S web automation brittleness (vendor UI update) | Tinggi (saat Tahap 3) | Sedang | Monitoring + alerting; modular design; maintenance pattern |
| **R-T2** | Data integrity di SIMRS Batin Tikal | Rendah | Kritis | Audit trail immutable; backup + DR; transaction integrity |
| **R-T3** | Performance degradation | Rendah | Sedang | Capacity planning Phase 2.1; monitoring; scaling strategy |
| **R-T4** | Security breach | Rendah | Kritis | Security best practices Phase 2.1 design; pen testing Phase 2.2+ |
| **R-T5** | Schema drift SIMRS BT ↔ SIKESUMA | Sedang | Sedang | Coordinated schema reviews di moments of integration (Phase 2.2) |

### 11.3 Operational Risks

| ID | Risiko | Likelihood | Impact | Mitigasi |
|---|---|---|---|---|
| **R-O1** | Petugas RS resist adoption SIMRS Batin Tikal | Sedang | Tinggi | UX priority; iterasi feedback intensif; pilot Sie Renbang sebagai proving ground |
| **R-O2** | Dual-input burden selama transisi | Sedang | Sedang | Phase 2 + Track-S Bridge eliminate dual input eventually; selama transisi, scope pilot terbatas |
| **R-O3** | Maintenance burden tidak sustainable | Sedang | Sedang | Documentation; modular code; multi-session handover pattern |
| **R-O4** | User confusion antara SIMRS BT dan SIKESUMA | Sedang | Sedang | Clear UI demarcation, training, dokumentasi pengguna |

### 11.4 Compliance Risks

| ID | Risiko | Likelihood | Impact | Mitigasi |
|---|---|---|---|---|
| **R-C1** | UU PDP issue (hak pasien) | Rendah | Tinggi | RS sebagai data controller established; rights management di SIMRS BT |
| **R-C2** | Permenkes RME retention | Rendah | Sedang | Retention policy Phase 2.1 design; immutable audit |
| **R-C3** | TOS violation vendor Terasehat | Rendah-sedang | Sedang | TOS review (D-S0.4) sebelum Tahap 3 Track-S; behavior align dengan reasonable user |
| **R-C4** | Kontrak vendor klausul tidak compatible | Rendah | Sedang-tinggi | Kontrak review (D-S0.4); kalau blocker ditemukan, adjust approach |
| **R-C5** | License risk dari Khanza Codex | Rendah | Tinggi | Clean room reverse engineering posture; no code transfer (lihat Khanza Brief §3) |

### 11.5 Complexity Trapping Risk (Specific to Track-S Stub)

| Risk | Mitigation |
|---|---|
| **Pre-mature Track-S detailing** — design Track-S sebelum SIMRS BT operational reality clear | Track-S sebagai stub di blueprint ini (§7); detail di sub-blueprint Tahap 3 onset |
| **Assumption error** — assume sync pattern yang invalid saat SIMRS BT real | Validate dengan operational data sebelum commit ke detail |
| **Over-engineering** — design Track-S untuk skenario yang tidak terjadi | Stay minimal; tambah complexity hanya kalau terbukti diperlukan |

### 11.6 Anti-Primitive Risks (Phase 3 Khanza Codex Integration)

Bagian ini menambahkan **risiko arsitektural** yang teridentifikasi melalui Phase 3 Khanza Codex analysis — anti-primitives yang Khanza adopted secara rasional untuk konteksnya tapi menciptakan risiko serius kalau direplikasi ke konteks SIMRS BT.

Setiap entry mengikuti **format konsisten:**
- **Severity tier** (🔴 Critical / 🟠 High / 🟡 Nuanced) per Phase 3 D3 §C classification
- **Khanza pattern** yang membentuk risiko (empirical evidence)
- **Risk dimension table** (ID + Likelihood conditional + Impact + Domain)
- **Konsekuensi konkret** kalau tidak di-invert dalam SIMRS BT
- **Mitigasi** (primary pattern + sequencing + verification + retrofit cost)
- **Cross-references** ke §5.6 patterns + §9 sequencing + Appendix B detailed source

**Catatan likelihood semantics:**

Likelihood dalam tabel berikut adalah **conditional** — bukan likelihood event akan terjadi tanpa qualifikasi, melainkan likelihood **kalau pattern Khanza direplikasi atau inversi tidak di-implement**. Risk register ini di-design untuk drive inversion compliance pada Tahap 2 SIMRS BT Build. Setelah inversi sesuai §5.6 dilakukan, likelihood drop dramatically untuk most entries.

### 11.7 P7-E — Audit Trail Absent at Schema Level (🔴 Critical, Chain 2 Head)

**Khanza pattern (R6 evidence):** 0 universal audit columns (`created_at`/`updated_at`/`*_at`) across 1156 tables; 17 scoped PPI compliance audit tables exist (audit-table design capability demonstrated; universal absence is design CHOICE for 2010-era LAN paper-compliance context).

| Risk dimension | Statement |
|---|---|
| **Risk ID** | R-AP1 (P7-E inversion absence) |
| **Likelihood** | **Tinggi** kalau pattern direplikasi dari Khanza ke SIMRS BT schema |
| **Impact** | **Kritis** — TNI AD digital audit framework tidak dapat operate; forensic reconstruction impossible; integrity attestation legal cases fails |
| **Domain** | Compliance + Technical + Strategic |

**Konsekuensi konkret kalau tidak di-invert:**

- BPK + Itjenad digital audit forensic queries fail → audit defects pada penilaian
- Akreditasi modern menuntut audit trail; ketiadaan = accreditation risk
- Military medical legal/disciplinary cases tidak punya integrity attestation foundation
- Multi-RS coordination kehilangan cross-RS audit visibility
- Cascade impact: §11.8 (concurrency conflict resolution) dan §11.9 (transaction reconciliation) tidak dapat operate meaningfully

**Mitigasi:**

- **Primary:** Implement §5.6.1 Mandatory Audit Trail Pattern dari day 1 (universal audit columns + audit log table + trigger-based population)
- **Sequencing:** Per §9.1 priority #3 (Chain 2 head — audit infrastructure first within Chain 2 inversion)
- **Verification:** CI gate validates universal audit columns presence on every operational table; audit query API regression tests
- **Retrofit cost (kalau terlewat):** Order-of-magnitude higher — every operational table schema migration + audit log backfill + RLS policy adjustment

**Cross-references:** §5.6.1 (pattern), §9.1 (sequencing priority #3), Appendix B (Phase 3 D3 §C.1 + §E.1 detailed source).

### 11.8 P4-D — Silent Last-Write-Wins (🔴 Critical, Chain 2)

**Khanza pattern:** No version columns, no optimistic locking, no row-level versioning across 1156 tables. LAN single-RS + verbal operator coordination = concurrent collisions rare in practice; Khanza optimization rational for that context.

| Risk dimension | Statement |
|---|---|
| **Risk ID** | R-AP2 (P4-D inversion absence) |
| **Likelihood** | **Tinggi** dalam multi-shift + multi-RS + web client context kalau pattern direplikasi |
| **Impact** | **Kritis** — silent loss of medical record edit = **unrecoverable patient safety incident**; concurrent edit collisions across shifts amplify |
| **Domain** | Technical + Compliance (patient safety / audit) |

**Konsekuensi konkret kalau tidak di-invert:**

- Multi-shift handover concurrent edits silently overwritten → medical record corruption
- Multi-facility users (G5 vision) tidak punya verbal coordination → systemic data loss
- Web client stale state (page open hours) overwrites fresh edits oleh other operator
- Audit forensic tidak dapat reconstruct "yang terjadi sesungguhnya" karena loser version hilang silently
- BPK audit pada billing-clinical reconciliation menemukan data inconsistencies tanpa attribution

**Mitigasi:**

- **Primary:** Implement §5.6.2 Concurrency Control Pattern (version column + optimistic locking + 3-option conflict UI)
- **Sequencing:** Per §9.1 priority #3 (Chain 2 mid — depends on §5.6.1 audit infrastructure for conflict event logging)
- **Verification:** Concurrent edit integration tests; conflict UX smoke tests; audit log queries verify conflict event capture
- **Retrofit cost:** High — every UPDATE statement audit + service layer wrapper insertion + UI conflict handling refactor

**Cross-references:** §5.6.2 (pattern), §5.6.1 (audit prerequisite), §9.1 (sequencing #3 mid), Appendix B (Phase 3 D3 §C.2 + §E.2 detailed source).

### 11.9 P6-B — Eventual Consistency via Human Reconciliation (🔴 Critical, Chain 2)

**Khanza pattern (H6.2 evidence):** 1 `setAutoCommit` + 1 `commit` + 1 `rollback` across 1627 Java files = <0.1% transaction discipline footprint. Paper-era hospital workflow norms + LAN low-volume transaction context = partial-state rare; operator reconciliation manageable.

| Risk dimension | Statement |
|---|---|
| **Risk ID** | R-AP3 (P6-B inversion absence) |
| **Likelihood** | **Sedang-Tinggi** dalam cloud + web client + multi-RS context (higher volume + network partial failures) |
| **Impact** | **Kritis** — military operational audit tidak dapat tolerate silent inconsistency; BPK billing-clinical reconciliation tests fail |
| **Domain** | Technical + Compliance (audit) |

**Konsekuensi konkret kalau tidak di-invert:**

- Multi-step workflow partial completion → orphan records (clinical record exists tapi billing tidak; atau sebaliknya)
- Network drop mid-workflow leaves silent inconsistent state
- BPK audit billing-clinical reconciliation test menemukan diskrepansi tanpa root cause
- Operator manual reconciliation tidak scale ke cloud volume
- Cross-service workflows (BPJS submission) accumulate partial-state if no idempotency

**Mitigasi:**

- **Primary:** Implement §5.6.3 Transaction Discipline Pattern (atomic transactions + saga + idempotency + reconciliation jobs as belt-and-suspenders)
- **Sequencing:** Per §9.1 priority #3 (Chain 2 end — built atop §5.6.1 + §5.6.2)
- **Verification:** Transaction integration tests; saga compensation tests; idempotency replay tests; reconciliation alert thresholds
- **Retrofit cost:** Very High — service layer must exist (§5.6.9 dependency) + workflow boundary identification + saga design per workflow

**Cross-references:** §5.6.3 (pattern), §5.6.1 + §5.6.2 (Chain 2 prereqs), §5.6.9 (service layer dependency), §9.1 (sequencing #3 end), Appendix B (Phase 3 D3 §C.3 + §E.3 detailed source).

### 11.10 P7-D — String-Concat SQL Search (🔴 Critical R9/L026 Retention)

**Khanza pattern (R9 — L025/L026 evidence):** 1034 Java files use LIKE keyword; 937 use parameterized `LIKE ?` (safe); **346 files have unsafe `LIKE '%"+var+"%'` concat patterns** (substantial real exposure). Owner-approved Critical retention (L026) after Phase 3a rigorous re-verification overruled initial High downgrade proposal.

| Risk dimension | Statement |
|---|---|
| **Risk ID** | R-AP4 (P7-D inversion absence) |
| **Likelihood** | **Tinggi** dalam cloud + external integration + multi-tenant context (adversarial input vector present) |
| **Impact** | **Kritis** — SQL injection success = patient data exfiltration / corruption / tenant boundary breach; TNI AD security posture compromised |
| **Domain** | Technical + Security + Compliance |

**Konsekuensi konkret kalau tidak di-invert:**

- Web client search forms exposed ke broader attack surface (vs Khanza trusted-LAN)
- 346 unsafe sites kalau direplikasi = substantial exploit surface
- Multi-tenant breach: SQL injection bypass RLS → cross-tenant data leak
- BPJS / external integration endpoints exposed
- Audit forensic queries themselves vulnerable if pattern replicated in admin tooling

**Mitigasi:**

- **Primary:** Implement §5.6.4 SQL Injection Mitigation Pattern (parameterized queries mandatory + tsvector full-text + input sanitization + static analysis CI gate + pen testing CI)
- **Sequencing:** Orthogonal infrastructure — can implement parallel to Chain 2/3/1 inversions; ideally enforced from day 1 via tooling
- **Verification:** CI gate blocks string-concat SQL patterns (Semgrep rules); OWASP ZAP / sqlmap regression tests in CI; manual pen test pre-pilot
- **Retrofit cost:** Medium — ORM choice locks ergonomic mitigation; raw SQL audit + parameterization migration scriptable

**Cross-references:** §5.6.4 (pattern), §5.6.8 (validation library for input sanitization), §9.4 (Owner decision surface — accelerated kalau BPJS integration month 1), Appendix B (Phase 3 D3 §C.4 + §E.4 detailed source; R9/L026 retention rationale).

### 11.11 P8-D — Error Capture Absent (🔴 Critical, Owner-Escalated)

**Khanza pattern:** 0 error_log / 0 exception_log / 0 audit_log universal tables. Operator-facing errors via Swing popup dialogs; back-end errors via Java console (transient). Trained-operator shared-workspace context = verbal error reconstruction sufficient.

| Risk dimension | Statement |
|---|---|
| **Risk ID** | R-AP5 (P8-D inversion absence) |
| **Likelihood** | **Tinggi** dalam cloud + multi-RS + non-co-located operator context kalau pattern direplikasi |
| **Impact** | **Kritis** — military medical operational liability; silent corruption potential; system degradation goes unnoticed |
| **Domain** | Operational + Compliance + Strategic |

**Konsekuensi konkret kalau tidak di-invert:**

- Invisible system errors → undetected silent corruption
- Cannot retrospect on failures → root cause analysis impossible
- Cannot alert proactively → system degradation accumulates silently
- Multi-RS distributed errors tidak punya centralized observation
- Audit forensic tidak dapat reconstruct error events
- Owner-escalated severity per Phase 3 closure → tidak negotiable

**Mitigasi:**

- **Primary:** Implement §5.6.5 Error Tracking Infrastructure Pattern (Sentry-class + schema audit.system_errors + structured logging + alerting + user-friendly error UX)
- **Sequencing:** Orthogonal infrastructure — implement early in Phase 2.1 (foundation phase)
- **Verification:** Error capture smoke tests; alert routing tests; correlation ID propagation tests; SLA on error response time
- **Retrofit cost:** Medium — error tracking SDK integration retrofitable; schema audit table addition straightforward; cultural shift to "no swallowed errors" hardest part

**Cross-references:** §5.6.5 (pattern), §5.6.1 (audit infrastructure complementary), §9.4 (Owner decision — Itjenad digital audit launch year 1 elevates priority), Appendix B (Phase 3 D3 §C.5 + §E.5 detailed source).

### 11.12 P10-B — Single-Tenant Schema Design (🟠 High, Sequencing-Critical Chain 3 Head)

**Khanza pattern:** 0 `rs_id` / `tenant_id` / `klinik_id` / `hospital_id` across 1156 tables. Khanza business model = 1500+ separate per-RS installations; single-tenant schema rational untuk that deployment model.

| Risk dimension | Statement |
|---|---|
| **Risk ID** | R-AP6 (P10-B inversion absence) |
| **Likelihood** | **Sedang** initially (deployment 1 RS), tapi **Tinggi** sebagai delayed risk saat G5 multi-RS expansion |
| **Impact** | **Tinggi** retrofit cost — every operational table schema migration + RLS backfill + RBAC re-grant across tenants |
| **Domain** | Strategic + Technical (sequencing-critical per §9 priority #2) |

**Konsekuensi konkret kalau tidak di-invert:**

- G5 Karumkit network vision blocked atau deferred years saat retrofit cost menjadi clear
- Multi-tenant retrofit di middle-of-production = high risk + downtime + data migration cost
- Single-tenant Khanza-style schema dengan 1500+ install model tidak align dengan SIMRS BT cloud-shared deployment vision
- TNI AD central audit (BPK/Itjenad cross-RS) tidak punya tenant scoping queryability

**Mitigasi:**

- **Primary:** Implement §5.6.6 Multi-Tenant Schema Pattern dari day 1 (`rs_id` everywhere + RLS policies + multi-tenant-ready inception)
- **Sequencing:** Per §9.1 priority #2 (Chain 3 head — schema decision; expensive to retrofit)
- **Verification:** CI gate validates `rs_id` presence on every operational table; RLS policy compliance tests; cross-tenant query elevation tests
- **Retrofit cost:** **Very High** — schema-level decision; affects every table, every query, every RLS policy. Per §9.3 anti-sequence: this MUST be done early.

**Cross-references:** §5.6.6 (pattern, sequencing priority #2), §5.6.7 (RBAC consumer), §9.1 (sequencing #2), §9.3 (anti-sequence warning), Appendix B (Phase 3 D3 §C.10 + §E.6 detailed source).

### 11.13 P7-F — Authorization-as-Boolean-Matrix (🟠 High, Chain 3)

**Khanza pattern:** Authorization implemented sebagai 1198-column boolean matrix pada `user` table — satu kolom per feature flag. Admin-friendly UI matches schema; rational untuk single-RS stable-feature-set deployment.

| Risk dimension | Statement |
|---|---|
| **Risk ID** | R-AP7 (P7-F inversion absence) |
| **Likelihood** | **Sedang** initially, **Tinggi** as features accrete dan multi-tenant expansion materialize |
| **Impact** | **Tinggi** — feature additions require user-table schema migrations; multi-tenant replicates 1198 columns × N tenants |
| **Domain** | Technical + Operational (admin burden) |

**Konsekuensi konkret kalau tidak di-invert:**

- Feature additions menjadi schema migration overhead (per-feature column add)
- Multi-tenant replicates boolean matrix per tenant → schema bloat
- TNI AD military hierarchy tidak maps clean ke per-feature flags → role abstraction missing
- Audit "who has what permission when" tidak queryable historically
- Permission grant trail tidak audit-loggable (column update has no semantic event)

**Mitigasi:**

- **Primary:** Implement §5.6.7 RBAC Pattern (4-table abstraction: roles + permissions + role_permissions + user_roles with rs_id)
- **Sequencing:** Per §9.1 priority #2 (Chain 3 mid — depends on §5.6.6 tenant scoping + §5.6.1 audit + §5.6.9 service layer host)
- **Verification:** Permission check API unit tests; grant/revoke audit log queries; effective-permission queries; historical-permission queries
- **Retrofit cost:** High — every authorization check site refactor + UI conditional rendering migration

**Cross-references:** §5.6.7 (pattern), §5.6.6 (multi-tenant prereq), §5.6.1 (audit prereq), §5.6.9 (service layer host), §9.1 (sequencing #2 mid), Appendix B (Phase 3 D3 §C.8 + §E.7 detailed source).

### 11.14 P7-A — Per-Form Inline Validation (🟠 High, Chain 1 Mid)

**Khanza pattern:** Validation logic duplicated across Swing dialogs (~76 DlgCari + numerous DlgIsi/DlgEdit). Java pre-Bean-Validation era + per-module team autonomy = per-form duplication acceptable cost.

| Risk dimension | Statement |
|---|---|
| **Risk ID** | R-AP8 (P7-A inversion absence) |
| **Likelihood** | **Sedang** initially, **Tinggi** as forms multiply dan rule drift accumulates |
| **Impact** | **Tinggi** — validation rule drift = data quality erosion; multi-client deployment requires server-side validation anyway |
| **Domain** | Technical + Compliance (data quality / audit defect) |

**Konsekuensi konkret kalau tidak di-invert:**

- Validation rule drift across forms → same field accepts different values di different contexts
- Client-side-only validation = trust boundary breach (mobile/integration partner sends invalid data)
- Modul yang overlap (registrasi pasien di 2 modul) develops inconsistent validation
- TNI AD audit menemukan data quality defects yang root cause = inconsistent validation
- Refactor cost untuk validation library retrofit menjadi tinggi

**Mitigasi:**

- **Primary:** Implement §5.6.8 Centralized Validation Library Pattern (shared `@simrs-bt/validators` + 3-layer single source of truth: UI + API + service)
- **Sequencing:** Per §9.1 priority #4 (Chain 1 mid — depends on §5.6.9 service layer)
- **Verification:** Validator unit tests; cross-layer consistency tests (same validator runs UI + API + service); error message localization tests
- **Retrofit cost:** Medium — validators extractable as forms refactor; UI binding migration straightforward; cultural discipline (don't add per-form validators) is hardest

**Cross-references:** §5.6.8 (pattern), §5.6.9 (service layer prereq), §5.6.4 (input sanitization consumer), §9.1 (sequencing #4 mid), Appendix B (Phase 3 D3 §C.7 + §E.8 detailed source).

### 11.15 P4-C — UI-as-Orchestrator / No Service Layer (🟠 High, Chain 1 Head)

**Khanza pattern:** Swing event handlers (Dialog classes) become orchestrators — receive user input, validate, build SQL, execute, handle results. Fat-client + LAN architecture (P4-A) precludes service layer naturally; rational for 2010-era Java.

| Risk dimension | Statement |
|---|---|
| **Risk ID** | R-AP9 (P4-C inversion absence) |
| **Likelihood** | **Tinggi** kalau pattern direplikasi dalam React component layer atau API endpoint layer |
| **Impact** | **Tinggi** — business logic untestable; multi-client incompatible; cascade impact pada §11.14 validation, §11.9 transaction, §11.13 RBAC |
| **Domain** | Technical + Strategic (architecture foundation) |

**Konsekuensi konkret kalau tidak di-invert:**

- Business logic di UI components → component testing complexity + duplication
- Mobile / integration partner client cannot reuse business logic → reimplement
- Transaction boundaries unclear → §11.9 P6-B inversion handicapped
- Validation library tidak punya home → §11.14 P7-A inversion handicapped
- RBAC permission check API tidak punya host → §11.13 P7-F inversion handicapped
- Cascade impact pada entire Chain 1 lower stack

**Mitigasi:**

- **Primary:** Implement §5.6.9 Service Layer Architecture Pattern (TypeScript service classes; pure business logic; UI as thin orchestrator; API layer between)
- **Sequencing:** Per §9.1 priority #4 (Chain 1 head — **foundational**; precondition untuk §5.6.8 + §5.6.7 host + §5.6.3 transaction units)
- **Verification:** Service unit tests dengan mocked DB; integration tests service+DB; UI tests presentation only; no business logic in UI test loop
- **Retrofit cost:** **Very High** — late retrofit = extract business logic from UI ke service layer = touches every component. Per §9.3 anti-sequence: service layer MUST exist before §5.6.8 validation library and §5.6.7 RBAC implementation.

**Cross-references:** §5.6.9 (pattern, Chain 1 head), §5.6.8 + §5.6.7 + §5.6.3 (consumers/dependents), Appendix A.11 + A.12 (P6-D + P7-B modernization), §9.1 (sequencing #4 head), §9.3 (anti-sequence warning), Appendix B (Phase 3 D3 §C.6 + §E.9 detailed source).

### 11.16 Nuanced & Brief Anti-Primitives (P9-B, P5-B, P10-C)

Tiga anti-primitives dengan severity tier lebih rendah (🟠 Brief atau 🟡 Nuanced per D3 §C.9-§C.12), di-treat secara compact karena harm gradual atau workable in small-scale deployment:

| Anti-Primitive | Severity | Khanza Pattern | SIMRS BT Mitigation (Compact) | Cross-Reference |
|---|---|---|---|---|
| **P9-B** Epoch-Stratified Naming (R3 — 4 prefix epochs: `no_*`, `kd_*`, `kode_*`, `id_*`) | 🟠 Brief | 2539 + 1535 + 1120 + 263 occurrences across 4 prefix epochs accreted 15 years | **Single naming convention enforced via tooling** — recommended `kode_*` full Indonesian word style (per Appendix A.5 P10-A adoption); linter + CI gate reject deviation; onboarding cost reduced 4 conventions → 1 | Appendix A.5 (P10-A) |
| **P5-B** Naming-Convention-as-Boundary | 🟡 Nuanced | Module boundaries enforced via column/table naming conventions (`apotek_*`, `radiologi_*`), tidak via schemas/packages/DB access control | **Formal package + schema boundaries** — PostgreSQL schemas per module domain (atau per pillar per Appendix A.1); TypeScript monorepo packages dengan explicit dependencies; linter prevents cross-package imports tanpa declaration | Appendix A.8 (P5-A Conway alignment), §5.6.9 (service layer) |
| **P10-C** Per-Table Manual Restore Dialogs | 🟡 Nuanced | Restore functionality sebagai per-table `DlgRestore*` classes, admin-driven | **PostgreSQL Point-In-Time Recovery (PITR)** untuk catastrophic restore (Supabase native); **soft-delete with retention windows** (Appendix A.2 P1-C tier) untuk routine "undelete"; **audit log replay** untuk forensic state reconstruction → eliminates need for per-table restore dialogs entirely | Appendix A.2 (P1-C deletion policy), §5.6.1 (audit log replay enabler) |

**Severity rationale (Nuanced tier):** Harm gradual not acute; workable in small teams or small-scale deployments. Becomes problematic at scale (P5-B) atau insufficient untuk modern standards (P10-C). Inversi tidak sequencing-critical tapi recommended sebagai hygiene.

**Note untuk SIMRS BT spoke session:** Treatment compact di sini bukan berarti kurang penting — tapi karena (a) mitigation sederhana (tooling enforcement, framework-native features), dan (b) cross-references ke §5.6 patterns + Appendix A primitives sudah cover detailed treatment. Implementation alongside Critical/High inversion tidak menambah substantial overhead.

**Cross-references:** §5.6.9 (service layer untuk P5-B), §5.6.1 (audit untuk P10-C), Appendix A.2 + A.5 + A.8 (TIMELESS adoptions yang complement these inversions), Appendix B (Phase 3 D3 §C.9 + §C.11 + §C.12 detailed source).

---

## 12. Operational Considerations

### 12.1 Multi-Session Knowledge Transfer

Workstream-workstream di blueprint ini akan dikerjakan dalam **banyak sesi AI development**. Setiap sesi harus dapat:

- **Bootstrap** dari blueprint ini + dokumen-dokumen sesi sebelumnya
- **Verify** state proyek (git, supabase, dependencies)
- **Continue** tanpa drift dari arah strategis
- **Document** progress untuk sesi berikutnya
- **Handover** dengan handover bundle pattern (mirror SIKESUMA Tier handover bundles)

### 12.2 Backup + Disaster Recovery

SIMRS Batin Tikal sebagai sumber primer data RS tidak boleh single point of failure. Strategi backup yang di-design Phase 2.1:

- Automated daily backup ke storage terpisah
- Point-in-time recovery capability
- Geographic redundancy kalau scale + budget memungkinkan
- Backup restoration testing rutin

### 12.3 Performance & Scale Considerations

Volume data RS Tk IV manageable (estimasi puluhan ribu records per tahun per modul). Design accommodate:

- Burst load (bulan-akhir reporting, audit periods)
- Read-heavy workloads (dashboarding, analytics)
- Multi-user concurrent input (petugas dari unit berbeda)

Capacity planning detail di Phase 2.1.

### 12.4 Security Posture

SIMRS Batin Tikal handle data medis + finansial RS:

- Authentication: multi-factor untuk role administratif
- Authorization: role-based access control (RBAC)
- Encryption at rest + in transit (TLS + database encryption)
- Audit log: immutable, accessible to auditors
- Penetration testing: Phase 2.2+
- Incident response plan: Phase 2.3

### 12.5 Cost Profile Estimasi

| Komponen | Phase 2.1-2.2 | Phase 2.3+ |
|---|---|---|
| Cloud hosting (Supabase Pro) | $25/bulan | $25-200/bulan |
| Domain + SSL | $10/tahun | $10/tahun |
| Backup storage | minimal | $20-50/bulan |
| Monitoring + alerting | free tier | $20-100/bulan |
| Development effort | AI session + Owner time | Multiple parallel sessions |
| **Total ops/bulan** | **~$30** | **~$100-400** |

Biaya capital untuk transition ke Phase 2.3 (klinis + potential infrastructure shift) di-evaluate terpisah saat keputusan tersebut dibuat.

### 12.6 Vendor Relationship Hygiene

Selama Tahap 1, Tahap 2, dan awal Tahap 3 (pre-Track-S engagement), hubungan vendor Terasehat di-maintain professional:

- Tidak ada komunikasi adversarial
- Tidak ada surprise public announcement
- Kontrak existing dipenuhi sesuai term
- Vendor tetap dianggap mitra layanan untuk fungsi yang relevant

Kalau eventually engagement perlu (Tahap 3+), dilakukan via channel formal (KPA, hierarchical).

### 12.7 Multi-RS Scalability

SIMRS Batin Tikal yang sukses berpotensi menjadi model untuk RS Militer lain (G5 Karumkit vision). Forward-compat considerations:

- Schema design generic, tidak hard-coded ke RS Batin Tikal
- Configuration separable dari code
- Multi-tenant capability evaluation di Phase 2.3+
- Documentation yang dapat di-transfer

Multi-RS scalability bukan tujuan Phase 2.1-2.2, tapi keputusan design tidak boleh foreclose kemungkinan ini.

---

## 13. Cross-Reference & Glossary

### 13.1 Cross-Reference

**Dokumen aktif:**

- `KHANZA-SPOKE-SESSION-BRIEF.md` — mandate Khanza spoke session (Tahap 1)
- `THE-KHANZA-CODEX.md` — output Khanza spoke (akan dihasilkan)
- SIKESUMA repo (`docs/`, `constants/devLog.ts`, `SSOT-REFACTOR-LOG.md`) — referensi codebase + knowledge SIKESUMA
- `docs/TIER-5-DESIGN.md` — design Tier 5 audit trail (TNI-specific pattern reference)
- `docs/REVISI-POK-PAGU-vKoreksi.md` — master domain reference TNI POK

**Dokumen legacy (referensi historis):**

- `TRACK-S-DATA-SOVEREIGNTY-BLUEPRINT.md` v1.1 — superseded oleh blueprint ini; Phase S0 decisions di-carry-over

**Dokumen eksternal:**

- UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi
- Permenkes No. 24 Tahun 2022 tentang Rekam Medis Elektronik
- Permenhan No. 5 Tahun 2020
- Perdirjen Renhan Kemhan No. 7 Tahun 2025
- KEP 211, KEP 291, KEP 331 (BAS regulations)

### 13.2 Glossary

| Term | Definisi |
|---|---|
| **SIMRS Batin Tikal** | Sistem Informasi Manajemen RS spesifik untuk RS Tk IV Batin Tikal, dibangun dari fondasi dengan referensi Khanza Codex |
| **SIKESUMA** | Aplikasi spesifik untuk governance + analitik TNI AD context, sedang dalam pengembangan tier-based |
| **Khanza Codex** | Reference document yang merangkum primitif + framework dari SIMRS Khanza (open-source), hasil spoke session analisa |
| **Track-S Bridge** | Sync mechanism antara SIMRS Batin Tikal dan vendor eksternal (Terasehat), STUB di blueprint ini |
| **Bidirectional knowledge flow** | Pola dua arah antara SIKESUMA dan SIMRS Batin Tikal — knowledge transfer (SIKESUMA→SIMRS BT) + operational data (SIMRS BT→SIKESUMA) |
| **Lateral peers** | Status hubungan SIKESUMA dan SIMRS Batin Tikal — bukan parent-child, melainkan specialized peers |
| **Complexity trapping** | Anti-pattern: terjebak di detail tanpa framework untuk evaluasi, biasanya karena premature elaboration |
| **Stub** | Placeholder ringan di dokumen untuk komponen yang akan di-detail nanti |
| **Phase S0** | Phase Strategic Concepting (pre-build) yang menetapkan keputusan-keputusan strategis |
| **Tahap 1/2/3** | Sequencing tiga workstream — Khanza Codex → SIMRS Batin Tikal → Track-S Bridge |
| **Data Controller** | Per UU PDP — pihak yang menentukan tujuan + kontrol pengolahan data (= RS) |
| **Data Processor** | Per UU PDP — pihak yang mengolah data atas instruksi controller |
| **Karumkit** | Kepala Rumah Sakit, pimpinan operasional RS |
| **Sie Renbang** | Seksi Perencanaan Anggaran di RS, dipegang oleh Angga |
| **Panji** | Proyek bridging data RS ke Mabes TNI AD |
| **Wasrik** | Pengawasan dan Pemeriksaan (fungsi oversight internal) |
| **KPA** | Kuasa Pengguna Anggaran (= Kakesdam II/Sriwijaya) |
| **POK** | Penyusunan Operasional Kegiatan (anggaran perencanaan TNI AD) |
| **BAS** | Bagan Akun Standar (government accounting structure) |
| **RME** | Rekam Medis Elektronik (per Permenkes 24/2022) |

---

## 14. Document Lifecycle

### 14.1 Versioning

| Versi | Tanggal | Perubahan | Author |
|---|---|---|---|
| 1.0 | 12 Mei 2026 | Initial blueprint dengan refined three-workstream model (supersedes TRACK-S-DATA-SOVEREIGNTY-BLUEPRINT.md v1.1) | AI Assistant SIKESUMA (di-supervisi Owner) |
| 2.0 | 13 Mei 2026 | Full integration Phase 3 Khanza Codex Closure Bundle (D3 IMPLICATIONS-FOR-SIMRS-BT v1.0). Adds: §3.6 Phase 3 Codex acknowledgment, §4.7 Three Deep Theoretical Choices (Time/Locality/Convergence), §5.6 nine Architectural Patterns (audit/concurrency/transaction/SQL injection/error/multi-tenant/RBAC/validation/service layer), §9 strict replace (4-chain inversion sequencing per Phase 3 §F; v1.0 macro phasing dropped per Owner milestone direction — content preserved di §5.5/§6.4/§7/§10), §11 risk register augmentation (§11.6 intro + §11.7-§11.16 anti-primitive entries), Appendix A (12 TIMELESS primitives catalog + §A.13 Continuous Track Discipline), Appendix B (Phase 3 bundle cross-reference + lineage citations). Title change §9: "Sequencing & Timeline" → "Inversion Sequencing & Implementation Order". v1.0 baseline preserved sebagai `SIMRS-BT-BLUEPRINT-V1-FROZEN.md`. Source authority: `KHANZA-CODEX-PHASE-3-IMPLICATIONS-FOR-SIMRS-BT.md` v1.0 (Owner-approved per L039-L041). Owner-supervised: milestone gates post-CP 4 (rollback directive applied) + pre-CP 9 (mandatory review). Cross-project boundary absolute; "Khanza optimized rationally" tone preserved. | AI Assistant SIMRS BT Blueprint v2.0 spoke session (di-supervisi Owner) |

### 14.2 Update Protocol

Blueprint ini menjadi **anchor authoritative** untuk ekosistem SIMRS Batin Tikal. Update dilakukan saat:

- Keputusan strategis baru oleh Owner
- Tahap baru dimulai (Tahap 1/2/3 transitions)
- Sub-blueprint dibuat untuk workstream specific (mis. SIMRS BT Phase 2.1 detailed design)
- Stakeholder relationships berubah significantly

**Update tidak boleh mengubah:**

- Three-workstream model fundamental (§4) — kalau ini berubah, dokumen baru atau revisi major (v2.0+)
- Dasar hukum (§3) — kalau regulasi berubah, dokumen di-update reflect
- Carried-over Phase S0 decisions (§10) — decisions sudah Owner-approved, hanya bisa di-revisit dengan explicit Owner approval

### 14.3 Hand-off Pattern

Setiap fresh AI session yang memulai workstream baru atau sub-phase **wajib**:

1. Membaca blueprint ini sebagai bagian dari bootstrap (sebelum sentuh code)
2. Verifikasi state proyek terhadap claims dalam blueprint
3. Surface inkonsistensi (kalau ada) ke Owner sebelum proceed
4. Update section yang relevan setelah selesai milestone
5. Document handover bundle untuk fresh session berikutnya

Pattern handover bundle yang teruji di SIKESUMA (Tier 4c, Tier 5, Tier 5a Phase 2) akan diadopsi untuk SIMRS Batin Tikal phases.

### 14.4 Ownership

Dokumen ini dimiliki oleh Owner (dr Ferry). Modifikasi substantif memerlukan persetujuan Owner. AI session dapat propose revisi tapi tidak unilateral commit perubahan major.

---

## Appendix A — TIMELESS Primitives Catalog (Phase 3 Khanza Codex Adoption)

Appendix ini menyediakan **catalog 12 primitif TIMELESS** dari Phase 3 Khanza Codex (D3 §A) yang SIMRS Batin Tikal **adopt** sebagai foundational architectural building blocks. Primitif-primitif ini Khanza pioneered dengan benar untuk konteks RS Indonesia — SIMRS BT mengadopsi langsung (TIMELESS pure), dengan modernization (TIMELESS mixed), atau as concept (ADOPT-AS-CONCEPT).

**Classification:**

| Tag | Adoption Type | Count | Examples |
|---|---|---|---|
| `[TIMELESS]` pure | Adopt directly without modification | 5 | P1-B, P1-C, P3-D ⭐⭐, P8-C, P10-A |
| `[TIMELESS]` mixed | Adopt principle + modernize implementation | 4 | P1-A, P2-A, P5-A, P6-A ⭐ |
| `[ADOPT-AS-CONCEPT]` | Adopt philosophy + modern manifestation | 3 | P5-C, P6-D, P7-B |
| **Total** | | **12** | |

**Marker convention:**
- ⭐ = highest-value adoption candidate
- ⭐⭐ = HIGHEST-VALUE positive learning dari Khanza (P3-D Encounter-as-Convergence)

**Cross-references:** §4.7 (Three Deep Choices — D.3 ADOPTS P3-D), §5.6 (Architectural Patterns yang built atop these primitives), §9.1 priority #1 (Foundation = adopt Chain 4 = P1-B + P3-D + P6-A), Appendix B (Phase 3 D1 PATTERNS-REGISTRY untuk detailed evidence).

### A.1 P1-B — Parallel Dual-Pillar Worldview ⭐

**Tag:** `[TIMELESS]` pure
**Khanza pattern:** Filosofi premise — RS adalah parallel medical + business institution; neither subordinate. Schema reflects this dengan parallel data structures (manifested via P6-A dual-spine).

**SIMRS BT adoption guidance:**

- **Codify dual-pillar premise** sebagai Blueprint preamble: clinical dan financial pillars co-equal; neither subordinate. Frames every subsequent architectural decision.
- **Physically separate schemas** at PostgreSQL level: `clinical` schema + `financial` schema (atau alias sesuai TNI AD naming). Module boundaries enforced at DB layer.
- **RLS policies per pillar:** clinical staff read clinical detail; financial staff read financial detail; cross-pillar roles untuk unified workflows.
- **Audit pathway separation:** Itjenad clinical audit operates on clinical schema; BPK financial audit operates on financial schema.

**Cross-references:** Manifests operationally via P6-A (§A.9); §4.7.3 (Convergence Choice 3 corollary); §5.6.6 (Multi-Tenant Schema accommodates dual-pillar).

### A.2 P1-C — Selective Permanence by Entity Type ⭐

**Tag:** `[TIMELESS]` pure
**Khanza pattern:** Different entity types deserve different deletion semantics — master data soft-delete; operational data cascade-protect; transient data hard-delete acceptable.

**SIMRS BT adoption guidance:**

Codify **deletion policy matrix** sebagai Blueprint discipline:

| Tier | Entity Examples | Deletion Policy |
|---|---|---|
| **Audit-grade** | patients, doctors, encounters, billing records, medication orders | Soft delete (`deleted_at` column) + retention window + audit trail of deletion event |
| **Structural master** | poli, diagnosa_icd10, jenis_obat, master pricing | Cascade-protect via FK constraints; deletion requires explicit acknowledgment + alternate-reference availability |
| **Operational transient** | session tokens, draft form states, UI preferences, queue items processed | Hard delete acceptable; no audit trail required |

**Cross-references:** §5.6.1 (Audit Trail Pattern — `deleted_at`/`deleted_by` columns), §11.16 P10-C (audit log replay enabler).

### A.3 P3-D — Encounter-as-Convergence ⭐⭐ (HIGHEST-VALUE ADOPTION)

**Tag:** `[TIMELESS]` pure — Chain 4 core
**Khanza pattern:** Encounter (patient visit) adalah reality; billing adalah bookkeeping. Encounter sits at center; clinical activity flows from it; billing derives from clinical work, not reverse.

**SIMRS BT adoption guidance — adopt verbatim sebagai data model foundation:**

1. **Encounter table sebagai core hub.** Naming: `clinical.kunjungan` atau `clinical.encounter` (per SIMRS BT naming convention). Houses encounter event metadata (start, end, type, encounter_status, attending_physician_id, patient_id, rs_id).
2. **UUID primary key + semantic ID column.** UUID PK untuk system integrity + refactor safety. Separate `nomor_kunjungan` column untuk operator-facing semantic ID (Khanza-style human-readable: date + sequence + clinic). Solves Khanza's `no_rawat` fragility while preserving operator UX.
3. **Clinical detail tables FK to encounter.** Procedure records, prescription orders, lab results, imaging studies, nursing notes — semua reference `kunjungan.id`. Encounter adalah convergence point.
4. **Billing derived from clinical events, NOT source-of-truth.** Charges computed dari clinical detail tables via service layer; billing tables (`financial.nota_*` equivalent) carry presentation/aggregate state, not authoritative pricing decisions.

**Rationale:** Universal correctness untuk hospital information systems. Matches operational reality (encounter = irreducible business event). Maps ke BPJS + Kemenkes claim submission model (encounter-based billing).

**Cross-references:** §4.7.3 (Deep Choice 3 ADOPT VERBATIM), §A.9 (P6-A dual-spine manifestation), §9.1 priority #1 (Chain 4 Foundation).

### A.4 P8-C — Constrained-Input Bias Mitigation ⭐

**Tag:** `[TIMELESS]` pure
**Khanza pattern:** Free-text inputs minimized in favor of constrained inputs (combo boxes, lookups dari master tables). Reduces operator typo/recall errors.

**SIMRS BT adoption guidance:**

- **Master table lookups for any field with finite domain.** Doctor selection → `master.dokter`; diagnosis → `master.diagnosa_icd10`; medication → `master.obat`; poli → `master.poli`. ZERO free-text untuk semantic identifiers.
- **Typeahead/combobox UI components throughout.** React Select + Supabase typeahead query patterns; debounced server-side filter untuk large master tables.
- **FK constraints enforce lookup-only at DB layer.** UI typeahead + DB FK = defense in depth.
- **Free-text reserved untuk genuinely-narrative fields.** Chief complaint, clinical note, examination findings — free-text appropriate. ID fields, classification fields, picklists — never free-text.

**Cross-references:** §5.6.8 (Centralized Validation — validators reject invalid references; UI typeahead prevents invalid input upstream).

### A.5 P10-A — Indonesian Domain Language Fidelity ⭐

**Tag:** `[TIMELESS]` untuk Indonesian RS context (pure)
**Khanza pattern (R2 calibration):** Schema dalam Bahasa Indonesia. ~900+ instances common patterns; >10K total Indonesian-language column occurrence footprint.

**SIMRS BT adoption guidance:**

- **Primary schema in Bahasa Indonesia.** Column names: `tgl_lahir`, `nomor_rekam_medis`, `kode_dokter`, dsb. ENUM values dalam Bahasa Indonesia. Table names dalam Bahasa Indonesia.
- **Single naming convention** — avoid Khanza's 4-prefix epoch fragmentation (lihat §11.16 P9-B brief). Recommended: full Indonesian words (`kode_*` style, not abbreviated `kd_*`). Tooling-enforced via linter atau schema validation.
- **English aliases via view layer** untuk FHIR/international interop. PostgreSQL views dengan English column names map ke Indonesian-named base tables.
- **Bilingual documentation.** Schema docs, API docs, Blueprint sections accessible dalam kedua bahasa.

**Rationale:** BPJS + Kemenkes + Akreditasi mandates dan formularies use Indonesian. Schema fidelity reduces translation error in regulatory submission, billing audit, dan operator interaction. TNI AD context: Indonesian language fidelity strongly preferred (military medical operates dalam Indonesian).

**Cross-references:** §11.16 P9-B (epoch-stratified naming inversion — uses §A.5 single convention).

### A.6 P1-A — Pragmatic Configurability (Mixed TIMELESS)

**Khanza pattern:** ~52 `set_*` configuration tables enabling per-RS customization tanpa code changes; enabled 1500+ RS adoption.

**SIMRS BT adoption guidance:**

**Adopt CONCEPT** of runtime configurability — **calibrate DEPTH:**

- ✅ Per-RS configuration table (`pengaturan_rs` atau similar) holding parameters yang genuinely vary per RS deployment
- ✅ Feature toggles untuk staged rollout — boolean flags controlling beta features per RS
- ⚠️ **Calibrate depth aggressively.** Khanza's 52 config tables optimized untuk 1500+ heterogeneous RS adoption. SIMRS BT initially serves 1 RS dengan multi-RS expansion — proportional config, bukan maksimum.
- ❌ Avoid config-for-config's-sake. Per Owner direction carry-over ("too much config = rope to hang oneself"). Configuration adds operational complexity.

**Suggested:** ~10-15 configuration tables initially; expand only when genuine per-RS variation surface.

**Cross-references:** §5.6.6 (Multi-Tenant — config per `rs_id` from day one).

### A.7 P2-A — Encounter-as-Pivot (Mixed TIMELESS)

**Khanza pattern:** Single physical table (`reg_periksa`) serves as operational hub with 350 FK references — most-referenced table dalam 1156-table schema.

**SIMRS BT adoption guidance:**

Same conceptual framing as P3-D (§A.3); P2-A adalah operational manifestation.

**Modernization vs Khanza:**
- UUID PK (vs Khanza's `no_rawat` composite semantic key)
- Separate `nomor_kunjungan` column untuk operator-facing semantic ID
- `created_at` + `updated_at` + `updated_by` (Chain 2 inversion built-in)
- `rs_id` FK (Chain 3 inversion built-in)

Single architectural decision compounds — solves operator UX (semantic ID), refactor safety (UUID), audit (timestamps), dan multi-tenancy (rs_id) simultaneously.

**Cross-references:** §A.3 (P3-D framing), §A.9 (P6-A dual-spine manifestation).

### A.8 P5-A — Conway's Law Alignment (Mixed TIMELESS)

**Khanza pattern:** Module boundaries reflect organizational team boundaries (apotek/lab/radiologi/farmasi/keuangan modules align dengan RS departmental structure).

**SIMRS BT adoption guidance:**

**Adopt principle** (universal architectural wisdom) — **modernize manifestation:**

- Map SIMRS BT module structure ke TNI AD military medical organizational structure. Module boundaries reflect Karumkit departmental authority (Yanmasum, Yanmed, dsb.).
- TypeScript monorepo workspaces per domain — `@simrs-bt/clinical-encounter`, `@simrs-bt/clinical-pharmacy`, `@simrs-bt/financial-billing`, `@simrs-bt/admin-rbac`, dsb.
- Avoid Khanza's anti-form (P5-B naming-convention-as-boundary). Use formal package boundaries dengan explicit interface contracts.
- Conway-aware refactoring: saat org structure changes, refactor module boundaries.

**Cross-references:** §11.16 P5-B (naming-convention-as-boundary inversion), §5.6.9 (Service Layer hosts cross-module logic).

### A.9 P6-A — Dual-Spine Architecture ⭐ (Mixed TIMELESS — Direct Operational Manifestation)

**Tag:** `[TIMELESS]` mixed ⭐
**Khanza pattern:** Two parallel spines structure entire system — clinical spine (`reg_periksa` 350 FK) + financial spine (`rekening` 301 FK). Together ~32% dari all 2032 FKs route through these hubs.

**SIMRS BT adoption guidance — direct adoption sebagai foundation architecture decision:**

1. **Two parallel anchor tables:**
   - **Clinical spine:** `clinical.kunjungan` (encounter) — target highest-FK density dalam clinical schema
   - **Financial spine:** `financial.akun` atau `financial.rekening` (chart of accounts) — target highest-FK density dalam financial schema
2. **Each spine = convergence hub for its domain:**
   - Clinical detail tables FK ke `kunjungan.id`
   - Financial transactions FK ke `akun.id`
   - Cross-pillar bridges via explicit foreign keys (mis. `financial.tagihan.kunjungan_id`)
3. **Modernized vs Khanza:**
   - UUID PKs (refactor-safe)
   - Universal audit columns (Chain 2 inversion built-in)
   - `rs_id` FK pada both (Chain 3 inversion built-in)
   - RLS policies per spine (pillar-aware authorization)
4. **TNI AD audit pathway mapping:**
   - **Clinical spine** → Itjenad audit queries (clinical record forensics, treatment compliance)
   - **Financial spine** → BPK audit queries (revenue/expense, claim integrity, BPJS settlements)

**Rationale:** Universal correctness + maps ke TNI AD audit organizational structure. **Highest-value structural decision** dalam SIMRS BT design.

**Cross-references:** §4.7.3 (Deep Choice 3 ADOPT), §A.1 (P1-B parallel dual-pillar foundation), §A.3 (P3-D encounter-as-convergence), §5.6.1 + §5.6.6 (audit + tenant manifestation), §9.1 priority #1 (Chain 4 Foundation).

### A.10 P5-C — Lifecycle-Isolation via Process (ADOPT-AS-CONCEPT)

**Tag:** `[ADOPT-AS-CONCEPT]`
**Khanza pattern:** Separate development lifecycles isolated via 14 separate sub-projects (KhanzaHMS satellites).

**SIMRS BT adoption guidance:**

**Adopt principle** (independent release lifecycles per module) — **modernize manifestation:**

- **Monorepo + per-package versioning** sebagai primary pattern. Modules dapat release independently while sharing infrastructure.
- **Separate microservices** reserved untuk genuinely-independent lifecycles (mis. external integration adapters, batch jobs, reporting service).
- **Avoid Khanza's 14-sub-project sprawl** — balance autonomy against maintenance cost. Recommended: 5-8 top-level packages dengan clear ownership.
- **CI/CD per-package release pipelines.** Independent versioning + dependency graphs.

**Cross-references:** §A.8 (P5-A Conway alignment), §5.6.9 (Service Layer Architecture).

### A.11 P6-D — Application-Centric Coordination Logic (ADOPT-AS-CONCEPT)

**Tag:** `[ADOPT-AS-CONCEPT]`
**Khanza pattern:** Cross-module coordination logic lives in application code (Java client), bukan dalam DB triggers/procedures. DB adalah passive storage. Verified: 0 stored procedures, 0 triggers, 0 functions, 0 views.

**SIMRS BT adoption guidance:**

**Adopt philosophy** (app-layer coordination) — **modernize implementation:**

- **Service layer hosts coordination logic.** TypeScript services orchestrate multi-module workflows (mis. complete-encounter triggers billing computation + inventory update + report queue).
- **Edge Functions** untuk serverless coordination (mis. BPJS submission, document generation).
- **AUDIT TRIGGER EXCEPTION** — DB triggers acceptable untuk audit trail population (lihat §5.6.1). **Single allowed exception to DB-passive philosophy.**
- **Materialized views** untuk read-heavy aggregations (mis. daily encounter summary). Read-only views OK; business logic stays dalam app.

**Cross-references:** §A.12 (P7-B philosophy), §5.6.9 (Service Layer Architecture), §5.6.1 (audit trigger exception).

### A.12 P7-B — Application-Centric Logic, Database-Passive (ADOPT-AS-CONCEPT)

**Tag:** `[ADOPT-AS-CONCEPT]`
**Khanza pattern:** Database deliberately passive — pure storage, no business logic. Verified: 0 procedures/triggers/functions/views.

**SIMRS BT adoption guidance:**

**Adopt philosophy** — DB sebagai durable storage layer; business logic dalam app layer where it's testable, version-controllable, portable.

**Modernize via:**
- TypeScript service layer untuk business logic (testable, type-safe)
- Edge Functions untuk serverless execution (Supabase)
- App-level transactions wrapping multi-step workflows (Chain 2 inversion — §5.6.3)
- Materialized views untuk read aggregations (DB does data shaping, not logic)
- **Allowed exceptions:** Audit trail triggers (§5.6.1); referential integrity constraints (FK ON DELETE rules)

**Avoid:**
- Business logic in stored procedures (testability tax)
- Cross-table consistency via triggers (use service layer + transactions)
- Computed columns hiding business rules (use service layer + materialized views)

**Cross-references:** §A.11 (P6-D coordination), §5.6.9 (Service Layer Architecture), §5.6.1 (audit trigger exception — well-bounded).

### A.13 Continuous Track Discipline

Per §9.1 sequencing, **TIMELESS primitives adopted on Continuous track** — bukan sequential priority. Setiap primitif diadopsi where relevant throughout build phase:

- **Phase 2.1a (architecture & schema design):** Primarily ⭐ primitives (P1-B, P1-C, P3-D ⭐⭐, P6-A ⭐, P10-A) — foundational
- **Phase 2.1b (backend build):** P8-C, P2-A, P6-D, P7-B (data layer + service layer manifestation)
- **Phase 2.1c (frontend build):** P8-C (constrained-input UI), P10-A (Indonesian schema rendered in UI)
- **Phase 2.2 (coverage expansion):** P1-A (per-RS config tables), P5-A + P5-C (module boundaries as features expand)

**Tracking discipline:** SIMRS BT Phase 2 spoke session menyimpan adoption log — primitif mana sudah adopted, dalam modul mana, dengan modernization apa. Memudahkan audit kalau Khanza Codex spoke session future re-engages.

---

*End of Appendix A. 12 TIMELESS primitives catalog complete.*

---

## Appendix B — Phase 3 Khanza Codex Closure Bundle Cross-Reference

Appendix ini menyediakan **navigation guide** ke Phase 3 Khanza Codex Closure Bundle untuk fresh AI session yang consume Blueprint v2.0 dan butuh detailed source material — empirical evidence, methodology details, lineage history, atau supporting Phase 2 domain investigations.

**Bundle status:** ✅ **CLOSED** per Phase 3 Closure (Lineage Log L039-L041, Mei 2026). Tidak ada Khanza Codex internal work tanpa explicit Owner re-engagement.

**Bundle location (handover context):** Bundle Phase 3 di-include sebagai sub-directory `phase-3-codex-bundle/` dalam SIMRS BT Blueprint v2.0 handover bundle. Self-contained — no external dependencies.

**When to consult bundle:**

| Scenario | Recommended Bundle Entry Point |
|---|---|
| Understanding why specific anti-primitive Critical/High classification | D3 §C (this blueprint §11.7-§11.16) atau D2 (Causal Chains) |
| Implementation guidance untuk pattern not in §5.6 | D3 §A (TIMELESS) atau D3 §B (REQUIRES-CONTEXT calibrations) |
| Empirical evidence (file counts, FK references, occurrence patterns) | D1 PATTERNS-REGISTRY (46 primitives + R/N/H evidence references) |
| Causal logic between primitives | D2 CAUSAL-CHAINS (5 chains: Chain 1 layers, Chain 2 audit, Chain 3 tenancy, Chain 4 dual-spine, Chain 5 not-yet-active) |
| Phase 2 domain-specific deep-dive | Phase 2 domain files (10 domains: Filosofi, Fundamental, Konsep, Arsitektur, Modul, Inter-Module, Universal Functions, Error Prevention, Workaround, Other) |
| Methodology + decision history | Lineage Log + Methodology + State of Record files |

### B.1 Primary Reference Files (Most-Critical untuk Blueprint v2.0 Consumers)

| File | Lines | Purpose | Cross-Refs from Blueprint v2.0 |
|---|---|---|---|
| `KHANZA-CODEX-PHASE-3-IMPLICATIONS-FOR-SIMRS-BT.md` (D3) | 1147 | **Primary integration source** — §A adoption, §B calibration, §C inversion patterns, §D Deep Choices, §E pattern formalization wordings, §F sequencing | §3.6, §4.7, §5.6.1-§5.6.9, §9, §11.6-§11.16, Appendix A |
| `KHANZA-CODEX-PHASE-3-PATTERNS-REGISTRY.md` (D1) | 904 | 46 primitives catalog dengan R/N/H evidence references; primitif ID source | §5.6 cross-refs (P_X primitif IDs), Appendix A.1-A.12 |
| `KHANZA-CODEX-PHASE-3-CAUSAL-CHAINS.md` (D2) | 498 | 5 causal chains mapping; sequencing rationale | §4.7.4 (cumulative propagation), §9.1-§9.3 sequencing logic |

### B.2 Supporting Reference Files

**Phase 3 supporting:**
- `KHANZA-CODEX-PHASE-3-IMPLICATIONS-FOR-SIKESUMA.md` (D4) — cross-project secondary implications (SIKESUMA scope; reference only)
- `KHANZA-CODEX-PHASE-3-HANDOVER-BRIEF.md` — Phase 3 lifecycle context
- `KHANZA-CODEX-PHASE-3-PRE-FLIGHT-REPORT.md` — empirical baseline verification (628 lines)
- `KHANZA-CODEX-PHASE-3-EXECUTION-STRATEGY.md` — Phase 3 execution methodology
- `KHANZA-CODEX-PHASE-3-CLOSURE-FRESH-SESSION-BOOTSTRAP.md` — original Phase 3 closure bootstrap

**Lineage + methodology:**
- `KHANZA-CODEX-LINEAGE-AUDIT-LOG.md` v1.6 — decision history L001-L049 (locked decisions; Owner-approval trail)
- `KHANZA-CODEX-METHODOLOGY-MUTUAL-VERIFICATION.md` — methodology reference
- `README-PHASE-3-CLOSURE-BUNDLE.md` — bundle origin index (authoritative file count: 27)
- `HISTORICAL-PHASE-3B-FRESH-SESSION-BOOTSTRAP.md` — historical Phase 3b session origin
- `HISTORICAL-README-PHASE-3B-BUNDLE.md` — historical Phase 3b bundle index

**Phase 2 foundation:**
- `KHANZA-CODEX-PHASE-2-CLOSEOUT.md` (427 lines) — Phase 2 authoritative final
- `KHANZA-CODEX-PHASE-2-MID-PHASE-REFLECTION.md` — Phase 2 mid-phase findings
- `KHANZA-CODEX-PHASE-2-STATE-OF-RECORD.md` — Phase 2 deliverables manifest

**Phase 2 domain investigations (10 domains):**
- `KHANZA-CODEX-PHASE-2-DOMAIN-1-FILOSOFI.md`
- `KHANZA-CODEX-PHASE-2-DOMAIN-2-FUNDAMENTAL.md`
- `KHANZA-CODEX-PHASE-2-DOMAIN-3-KONSEP.md`
- `KHANZA-CODEX-PHASE-2-DOMAIN-4-ARSITEKTUR.md`
- `KHANZA-CODEX-PHASE-2-DOMAIN-5-MODUL.md`
- `KHANZA-CODEX-PHASE-2-DOMAIN-6-INTER-MODULE.md`
- `KHANZA-CODEX-PHASE-2-DOMAIN-7-UNIVERSAL-FUNCTIONS.md`
- `KHANZA-CODEX-PHASE-2-DOMAIN-8-ERROR-PREVENTION.md`
- `KHANZA-CODEX-PHASE-2-DOMAIN-9-WORKAROUND.md`
- `KHANZA-CODEX-PHASE-2-DOMAIN-10-OTHER.md`

**Phase 1 hipotesis (origin):**
- `KHANZA-CODEX-PHASE-1-HYPOTHESES.md` — original hypothesis catalog yang Phase 2 verified/refined

### B.3 Blueprint v2.0 Section → Phase 3 Source Mapping

| Blueprint Section | Source File + Section | Notes |
|---|---|---|
| §3.6 Phase 3 Codex Integration | D3 §0 (preamble) | Phase 3 layers framework |
| §4.7.1 Deep Choice 1 (Time Model) | D3 §D.1 + D2 Chain 2 | |
| §4.7.2 Deep Choice 2 (Definition Locality) | D3 §D.2 + D2 Chain 1 | |
| §4.7.3 Deep Choice 3 (Convergence Model) | D3 §D.3 + D2 Chain 4 | POSITIVE adopt |
| §4.7.4 Cumulative Propagation | D3 §D.4 | |
| §5.6.1 Audit Trail | D3 §E.1 (formalization) + §C.1 (Khanza-rational context) | Chain 2 head |
| §5.6.2 Concurrency Control | D3 §E.2 + §C.2 | Chain 2 mid |
| §5.6.3 Transaction Discipline | D3 §E.3 + §C.3 | Chain 2 end |
| §5.6.4 SQL Injection Mitigation | D3 §E.4 + §C.4 | R9/L026 Critical |
| §5.6.5 Error Tracking | D3 §E.5 + §C.5 | Owner-escalated |
| §5.6.6 Multi-Tenant Schema | D3 §E.6 + §C.10 | Chain 3 head, sequencing #2 |
| §5.6.7 RBAC | D3 §E.7 + §C.8 | Chain 3 mid |
| §5.6.8 Centralized Validation | D3 §E.8 + §C.7 | Chain 1 mid |
| §5.6.9 Service Layer Architecture | D3 §E.9 + §C.6 | Chain 1 head |
| §9.1-§9.4 Inversion Sequencing | D3 §F.1-§F.4 | strict replace (no v1.0 macro) |
| §11.6-§11.16 Anti-Primitive Risks | D3 §C.1-§C.12 | full Critical + High + Brief |
| Appendix A.1-A.12 TIMELESS Catalog | D3 §A.1-§A.12 | 12 primitives |
| Appendix A.13 Continuous Track | D3 §F.1 (Continuous row) + carry-over | |

### B.4 Lineage Log Citations Used in Blueprint v2.0

Selected Lineage Log entries referenced di Blueprint v2.0 (untuk audit trail integrity):

| Lineage Entry | Context |
|---|---|
| **L022-L028** | 46 primitives baseline lock; Owner approved (Phase 2 closure → Phase 3 foundation) |
| **L025** | P7-D LIKE pattern initial analysis |
| **L026** | P7-D Critical retention (Phase 3a rigorous re-verification of 346 unsafe sites; Owner-approved Critical retention overruling initial High proposal) |
| **L039** | D3 production decisions |
| **L041** | D3 completion + Phase 3b session closure |

### B.5 Discipline Notes untuk Bundle Consumption

- **Bundle is reference, not for further editing.** Phase 3 CLOSED. Modifikasi bundle files requires Owner re-engagement (new Phase 3 follow-up session, atau Phase 4 if scope expansion needed).
- **Cross-project boundary ABSOLUTE.** D4 IMPLICATIONS-FOR-SIKESUMA.md adalah cross-project document; SIMRS BT spoke session **tidak** menggunakan D4 untuk SIMRS BT design work. D4 referenced di Appendix B inventory untuk completeness only.
- **License clean.** Khanza.Soft Media custom license respected (per L022). D1-D4 content (Phase 3b output) freely adaptable dalam SIMRS BT design work — no Java/SQL verbatim from Khanza source.

---

*End of Appendix B. Phase 3 Bundle cross-reference complete.*

---

*End of blueprint. Dokumen ini akan di-update seiring kemajuan tahapan dan masuknya keputusan-keputusan strategis baru dari Owner.*
