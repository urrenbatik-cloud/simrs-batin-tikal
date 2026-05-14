# The Khanza Codex — Phase 1 Hypothesis Bundle
## Self-Contained Continuation Document for SIMRS Spoke Session Multi-Phase Work

**File:** `KHANZA-CODEX-PHASE-1-HYPOTHESES.md`
**Versi:** 1.0
**Tanggal:** 13 Mei 2026
**Phase:** 1 (Hypothesis Formation) — output sub-session 1
**Status:** Owner-approved (dr Ferry, 13 Mei 2026)
**Output type:** Self-contained handoff bundle untuk Phase 2 fresh AI session
**Parent mandate:** `KHANZA-SPOKE-SESSION-BRIEF.md` v1.2 §8.1 (Phase 1 deliverable)
**Authoritative grandparent:** `SIMRS-BATIN-TIKAL-ARCHITECTURE-BLUEPRINT.md` v1.0
**Author:** Khanza spoke session AI (Owner-supervised, sub-session 1)
**Eventual deliverable:** `THE-KHANZA-CODEX.md` (Phase 5 output, not this file)

---

## Daftar Isi

0. [Preamble — Apa File Ini, Untuk Siapa, Kapan Dipakai](#0-preamble)
1. [Lineage Chain — Dokumen Upstream + Reading Order](#1-lineage-chain)
2. [Posture Statement — Identitas, Boundaries, Cross-Project Discipline](#2-posture-statement)
3. [Methodology Recap — Untuk Phase 2 Fresh Session](#3-methodology-recap)
4. [Hypothesis Sets — 10 Domain Analisa](#4-hypothesis-sets)
5. [Cross-Domain Meta-Hypotheses (M1-M4)](#5-cross-domain-meta-hypotheses)
6. [Cross-Project Awareness Notes (N1-N5) — Phase 3 Use Only](#6-cross-project-awareness-notes)
7. [Phase 2 Handoff Guidance](#7-phase-2-handoff-guidance)
8. [Boundary Discipline Verification](#8-boundary-discipline-verification)
9. [Document Lifecycle & Authority](#9-document-lifecycle--authority)

---

## 0. Preamble

### 0.1 Apa File Ini

Dokumen ini adalah **output Phase 1 (Hypothesis Formation)** dari Khanza spoke session — sebuah multi-phase analytical project yang menghasilkan **The Khanza Codex** sebagai reference compendium untuk SIMRS Batin Tikal development.

File ini berisi:
- **50+ hipotesis testable** tentang SIMRS Khanza, dikelompokkan ke 10 analytical domains
- **4 cross-domain meta-hipotesis** yang memotong lintas-domain
- **5 cross-project awareness notes** untuk Phase 3 synthesis use
- **Konteks lengkap** yang dibutuhkan fresh AI session untuk continue Phase 2 tanpa drift

### 0.2 Untuk Siapa File Ini

| Audience | Bagaimana Pakai |
|---|---|
| **Fresh AI session yang continue Phase 2** | Reading order: §0 → §1 → §2 → §7 → §4 → kerja per domain |
| **Owner (dr Ferry)** sebagai reviewer + decision-maker | Review hipotesis, approve/reject/refine per domain |
| **Future Phase 3-5 sessions** | Reference saat synthesis stage — terutama §5 (M-themes) dan §6 (N-notes) |
| **Future SIMRS Batin Tikal Phase 2 build sessions** | Tidak direct — mereka akan consume Phase 5 output (final Codex), bukan file ini |
| **Audit / Traceability** | Document lineage Phase 1 work, untuk reproducibility methodology |

### 0.3 Kapan File Ini Berlaku

- **Dibuat:** 13 Mei 2026, post sub-session 1 Phase 1 selesai
- **Berlaku:** sampai Phase 2 fresh AI session selesai → output Phase 2 (per-domain validation) menjadi reference baru
- **Tidak otomatis kadaluarsa:** file ini tetap relevan sebagai historical record kalau Phase 2 menemukan hipotesis yang awalnya falsified ternyata valid setelah re-test, dst.

### 0.4 Apa File Ini BUKAN

- **Bukan The Khanza Codex** — Codex adalah Phase 5 deliverable, post-validation + synthesis
- **Bukan analisa Khanza** — Phase 1 forms hipotesis, Phase 2 melakukan validation actual
- **Bukan tutorial** Khanza apa pun
- **Bukan rekomendasi adopsi** Khanza, pattern Khanza, atau apa pun ke SIMRS Batin Tikal
- **Bukan dokumen yang dapat diedit oleh non-Owner** — perubahan substantif butuh Owner sign-off

---

## 1. Lineage Chain

### 1.1 Full Document Chain

Untuk **historical documentation** dan **prevent drift**, berikut adalah dokumen upstream yang membentuk konteks penuh file ini. Fresh AI session yang continue Phase 2 **wajib aware** mereka exist, tapi tidak wajib baca semua kalau §2 + §3 + §7 file ini sudah cukup self-contained.

| Order | Document | Versi | Lokasi (RS Batin Tikal ekosistem) | Role di Lineage Saya |
|---|---|---|---|---|
| **1** | `SIMRS-BATIN-TIKAL-ARCHITECTURE-BLUEPRINT.md` | v1.0, 12 Mei 2026 | Project SIMRS BT (akan dibangun) | **Anchor authoritative** — three-workstream model, Khanza Codex = Tahap 1 |
| **2** | `KHANZA-SPOKE-SESSION-BRIEF.md` | v1.2, 12 Mei 2026 | Project SIMRS BT / Khanza spoke | **Direct mandate** — methodology + 10 domains + output spec untuk file ini |
| **3** | `SIKESUMA-INTRODUCTION-FOR-SIMRS-SPOKE.md` | v1.0, 13 Mei 2026 | Project SIKESUMA `docs/` | **Cross-project context** — SIKESUMA as lateral peer (read-only) |
| **4** | `OWNER-POLICY-FOR-AI-SESSIONS.md` (Addendum v1.5) | 13 Mei 2026 | Project SIKESUMA root | **Cross-project governance** — §S addendum, no-cross-touch policy |
| **5** | `glossary.md` (SIKESUMA) | 11 Mei 2026 update | Project SIKESUMA `docs/` | **Domain glossary** — TNI AD specifics, awareness only |
| **6** | `SIMRS-SPOKE-READ-ACCESS.md` | v1.0, 13 Mei 2026 | Project SIKESUMA `docs/` | **Access companion** — read-only credentials (not used Phase 1) |
| **7** | **This file** `KHANZA-CODEX-PHASE-1-HYPOTHESES.md` | v1.0, 13 Mei 2026 | Output Khanza spoke session | **Phase 1 output** untuk Phase 2 handoff |

### 1.2 Reading Order untuk Fresh AI Session

**Minimum essential** (15 menit reading):
1. §0 – §3 file ini (this preamble + lineage + posture + methodology)
2. §7 file ini (Phase 2 handoff guidance)
3. `KHANZA-SPOKE-SESSION-BRIEF.md` §1, §3, §4 (mandate scope + boundaries + methodology — kalau detail lebih dibutuhkan)

**Recommended additional** (kalau context dibutuhkan):
4. `SIMRS-BATIN-TIKAL-ARCHITECTURE-BLUEPRINT.md` §4 (three-workstream model)
5. `OWNER-POLICY-FOR-AI-SESSIONS.md` §S Addendum v1.5 (cross-project boundary policy)
6. `SIKESUMA-INTRODUCTION-FOR-SIMRS-SPOKE.md` §"Read-Only Boundary" + §1 (SIKESUMA intro + boundary)

**Not needed for Phase 2 execution:**
- SIKESUMA tier-detail docs (`TIER-5-DESIGN.md`, `SSOT-REFACTOR-LOG.md`, `HANDOVER.md`)
- SIKESUMA code (`types.ts`, validator implementations, dll.)
- Glossary BAS detail beyond awareness level

### 1.3 Inter-Document Relationships

```
SIMRS-BATIN-TIKAL-ARCHITECTURE-BLUEPRINT.md (anchor)
            │
            ├──► defines: three-workstream model (Khanza Codex, SIMRS BT build, Track-S Bridge)
            ├──► defines: SIKESUMA as lateral peer
            │
            ▼
KHANZA-SPOKE-SESSION-BRIEF.md (mandate)
            │
            ├──► defines: 10 domains, methodology, output spec
            ├──► defines: license boundary, anti-patterns, working cadence
            │
            ▼
KHANZA-CODEX-PHASE-1-HYPOTHESES.md (this file)
            │
            ├──► Phase 1 output: hipotesis
            ├──► Phase 2 input: testable predictions for source validation
            │
            ▼
(Phase 2 outputs — per-domain validation results)
            │
            ▼
(Phase 3 synthesis — generalization to primitives)
            │
            ▼
THE-KHANZA-CODEX.md (Phase 5 final deliverable)
            │
            ├──► Phase 2 consumer: SIMRS Batin Tikal build sessions
            ├──► Phase 2 secondary consumer: SIKESUMA continued development
            │
            ▼
SIMRS Batin Tikal codebase (independent implementation, no code transfer from Khanza)
```

```
KHANZA-CODEX-PHASE-1-HYPOTHESES.md (this file)
            ↕ (read-only awareness, no cross-touch)
SIKESUMA-INTRODUCTION-FOR-SIMRS-SPOKE.md + OWNER-POLICY §S Addendum v1.5
            │
            ├──► defines: SIMRS spoke MAY read SIKESUMA, MAY NOT modify
            ├──► defines: Owner = single source of cross-project coordination
            │
            ▼
SIKESUMA codebase + database (saya TIDAK pernah touch)
```

---

## 2. Posture Statement

**Bagian ini wajib dipegang verbatim oleh fresh AI session yang continue Phase 2.**

### 2.1 Identitas Spoke Session

> **Saya adalah Khanza spoke session — sebuah instance dari kategori "SIMRS spoke session" yang juga mencakup future SIMRS Batin Tikal Phase 2 build sessions.**
>
> Saya **bukan** SIKESUMA AI session. Saya **bukan** SIMRS Batin Tikal build session. Saya juga **bukan** general assistant — saya operate dalam mandate spesifik yang ditetapkan di `KHANZA-SPOKE-SESSION-BRIEF.md` v1.2.

### 2.2 Primary Mandate

> Menghasilkan **"The Khanza Codex: Architectural Primitives and Theoretical Framework for SIKESUMA"** — referensi konseptual abstrak dari SIMRS Khanza yang dapat menginformasikan design SIMRS Batin Tikal (**primary consumer**) dan SIKESUMA continued development (**secondary consumer**), dengan **clean separation** terhadap implementation detail dan IP yang melekat pada SIMRS Khanza.

### 2.3 License & IP Discipline

SIMRS Khanza dilisensikan dengan **Aladdin Free Public License** yang melekat ke code dan derivative works. Posture saya:

| ❌ TIDAK Saya Lakukan | ✅ Yang Saya Lakukan |
|---|---|
| Copy-paste code Java/SQL/dll. dari Khanza ke Codex | Ekstraksi **konsep** abstrak yang tidak ter-copyright |
| Reproduce schema `sik.sql` verbatim atau via ER diagram | Description pola schema design tanpa detail spesifik |
| Quotes verbatim dari dokumentasi Khanza atau wiki | Paraphrase konsep dengan rephrasing penuh |
| Screenshot UI Khanza atau verbatim diagram | Diagram konseptual independen yang diturunkan |
| Tutorial install/build/deploy Khanza | Tidak relevan dengan mandate |
| Endorsement atau kritik subjektif terhadap Khanza | Posture neutral analytical |

**Clean room reverse engineering posture** (Brief §3.4): saya Tim A (analisa konseptual independen). SIMRS Batin Tikal build session = Tim B (implements from concept, no code transfer dari saya).

### 2.4 Cross-Project Boundary — VERBATIM dari Addendum v1.5 §S

> **Per Owner Policy Addendum v1.5 §S (13 Mei 2026), saya operate di bawah cross-project lateral peer model:**

#### 2.4.1 Lateral Peer Status

SIKESUMA dan SIMRS Batin Tikal adalah **lateral peers, bukan parent-child**. Tidak ada hierarchical dependency atau code reuse di waktu yang sama. Coexistence aman karena:

- Setiap project punya AI session dedicated (focus prevent drift)
- Single source of cross-project coordination: **Owner (dr Ferry)**
- Read-only consumption antar project diperbolehkan, write tidak

#### 2.4.2 Saya (Khanza Spoke) sebagai SIMRS Spoke — Read-Only ke SIKESUMA

**MAY (diperbolehkan):**
- Clone repo SIKESUMA (public, `urrenbatik-cloud/SIKESUMAv3.1`)
- Run schema introspection queries di Supabase SIKESUMA (anon JWT read-only by RLS)
- Browse live app `sikesumav31.vercel.app`
- Baca docs SIKESUMA untuk awareness konteks lateral peer
- Adopt pattern (di level konseptual) sebagai input untuk articulate kontras di Codex

**MAY NOT (diharamkan):**
- Push commit ke SIKESUMA repo
- Buka PR ke SIKESUMA
- Modify schema/data di Supabase SIKESUMA
- Trigger Vercel deployment SIKESUMA
- Edit SIKESUMA docs (`docs/`, `SSOT-REFACTOR-LOG.md`, `HANDOVER.md`, dll.)

#### 2.4.3 No AI-to-AI Cross-Touch

Kalau saya menemukan suggestion/issue terkait SIKESUMA, jalur eskalasi adalah:

```
Saya (Khanza spoke) ─► Owner (dr Ferry) ─► SIKESUMA AI session (sesi terpisah, async)
```

**TIDAK ADA** direct cross-touch antara saya dengan SIKESUMA AI session. **TIDAK ADA** unilateral adoption pattern SIKESUMA ke Codex tanpa Owner brief eksplisit.

#### 2.4.4 Status untuk Phase 2

**Saya tidak akan clone repo SIKESUMA, query database SIKESUMA, atau browse app SIKESUMA selama Phase 2.** Phase 2 saya adalah **analisa Khanza source only**. SIKESUMA awareness tetap di level konseptual (sesuai introduction doc yang Owner sediakan).

Kalau Phase 3 (Synthesis) saya butuh deeper SIKESUMA context untuk articulate cross-project contrasts (N1-N5 di §6), saya escalate ke Owner di-time, **tidak self-serve**.

### 2.5 Single Source of Coordination

> **Owner (dr Ferry) adalah single source of coordination untuk segala hal yang melampaui pure Khanza source analysis.**

Saya escalate ke Owner kalau:
- Menemukan ambiguity dalam mandate atau scope
- Hipotesis di-test ternyata membutuhkan domain knowledge yang belum saya punya (mis. detail BAS, detail TNI AD workflow)
- Findings yang punya implikasi cross-project (mis. recommend SIKESUMA refactor)
- Hal apa pun yang membutuhkan judgment beyond methodological discipline

### 2.6 Anti-Drift Discipline

Untuk **prevent drift dan bias pada multi-spoke session continuation**, saya pegang:

| Anti-Pattern | Counter |
|---|---|
| **Scope creep** ke SIKESUMA work | Stop di boundary, escalate ke Owner |
| **Stack-locked thinking** (Java/MySQL specific) | Abstract ke platform-agnostic concept |
| **Endorsement bias** (pro/anti Khanza) | Neutral analytical posture |
| **Confirmation bias** (cherry-pick evidence) | Honest hypothesis testing, accept falsified as finding |
| **Cargo cult** ("Khanza pakai X → SIMRS BT pakai X") | Pahami "kenapa", evaluate apply ke SIMRS BT, baru decide |

---

## 3. Methodology Recap

Detail full di `KHANZA-SPOKE-SESSION-BRIEF.md` §2, §4. Berikut ringkasan untuk fresh AI session yang continue Phase 2:

### 3.1 Thesis Before Data

**Sequence:** form hipotesis → cek terhadap source → result: confirmed / refined / falsified.

**Bedakan:**
- ❌ Data-fitting: "Mari kita lihat Khanza, lalu kita simpulkan polanya" → finds pattern yang kita ingin temukan
- ✅ Thesis-first: "Hipotesis: Khanza memisahkan A dari B. Mari kita cek." → testable, falsifiable

Hipotesis yang **falsified adalah finding valuable**, bukan kegagalan. Document mengapa hipotesis tidak sesuai + alternative pattern yang Khanza pakai.

### 3.2 Primitives over Synthesis

**Cari konsep-dasar** (bagaimana Khanza memodelkan "pasien" sebagai entitas), **bukan fitur-jadi** (Khanza punya modul billing).

**Test per finding:**
- Apakah konsep ini dapat di-implement di stack apapun (Java, TypeScript, Python, dll.)?
- Apakah konsep ini berlaku untuk domain SIMRS umum, bukan hanya Khanza?
- Apakah konsep ini menjawab "kenapa?" lebih dari "bagaimana?"

Kalau "tidak" untuk salah satu, finding terlalu rendah di tangga abstraksi. Re-abstract atau drop.

### 3.3 Boundary Discipline Check (per Brief §4.4)

Setiap hipotesis + setiap finding di Phase 2 harus pass 5 tests:

| Test | Pass criteria |
|---|---|
| **Konsep atau code?** | Harus konsep, bukan implementation detail |
| **Platform-agnostic?** | Harus dapat di-implement di stack apapun |
| **Abstract enough?** | Harus jawab "kenapa" lebih dari "bagaimana" |
| **License-clean?** | Tidak ada verbatim copy dari Khanza source |
| **Relevan untuk SIKESUMA / SIMRS BT?** | Harus ada potential aplikasi |

Yang gagal di-reject atau di-refine.

### 3.4 Anti-Patterns (per Brief §7)

Hindari:

1. **Cargo Cult** — "Khanza pakai X → SIKESUMA harus pakai X"
2. **Implementation-bias** — mistake trigger MySQL untuk konsep
3. **Stack-locked thinking** — Java-isme yang tidak portable
4. **License contamination** — "copy schema lalu rename"
5. **Tautology** — restating tanpa distil prinsip
6. **Data fitting** — confirmation bias dengan cherry-pick evidence
7. **Exhaustive documentation** — dokumentasi semua 30k+ file di repo
8. **Endorsement bias** — pro/anti Khanza statement

---

## 4. Hypothesis Sets

### Format

Setiap hipotesis ber-format:

> **H<domain>.<no>** — *statement*
> **Kalau valid → expect:** observable yang akan dicari di Phase 2
> **Kalau falsified → expect:** observable alternatif
> **Source area Phase 2:** pointer ke folder/file untuk validation

**Catatan untuk Phase 2 executor:** semua hipotesis berikut sudah pass boundary discipline check §3.3. Saat validation, kalau finding ternyata sub-implementation-detail, abstract ke level konsep terlebih dahulu sebelum di-document.

---

### 4.1 Domain 1 — Filosofi (Philosophy)

**Pertanyaan inti:** Apa filosofi pengembangan yang Khanza tampak menganut?

> **H1.1** — Khanza memprioritaskan **flexibility untuk heterogeneous RS** (1500+ RS dengan praktik berbeda) di atas opinionated workflow.
> **Kalau valid →** banyak setting/konfigurasi runtime (toggle on/off fitur), modul-modul yang bisa dimatikan, schema permissive dengan many nullable columns
> **Kalau falsified →** workflow keras yang force satu cara kerja, schema strict dengan banyak required fields
> **Source area:** `setting/database.xml`, tabel `set_*` di sik.sql, struktur modul `src/setting/`

> **H1.2** — Khanza memandang RS sebagai **pusat operasi finansial yang menyertakan klinis**, bukan pusat klinis yang menyertakan finansial.
> **Kalau valid →** modul billing/keuangan terbentuk lebih dulu/lebih dalam dari rekam medis; entity pasien terkait kuat ke transaksi billing; flow registration langsung memicu billing
> **Kalau falsified →** rekam medis sebagai backbone, billing sebagai derived view; flow dimulai dari clinical event
> **Source area:** entry point `src/simrskhanza/`, struktur antar `src/rekammedis/` vs `src/keuangan/`, dependency direction di `reg_periksa` related tables

> **H1.3** — Khanza menganut **"no-data-loss as default"** — soft delete dominan, hard delete jarang.
> **Kalau valid →** kolom `status` atau `aktif` (Y/N) di banyak tabel, tidak ada `ON DELETE CASCADE` agresif
> **Kalau falsified →** banyak DELETE statement, tidak ada flag-based deletion
> **Source area:** schema convention di sik.sql (column naming pattern), DML pattern di service classes

> **H1.4** — Khanza menganut **"field extension over redesign"** — kebutuhan baru dipenuhi dengan menambah kolom di tabel existing, bukan dengan refactor.
> **Kalau valid →** tabel-tabel utama (mis. pasien, reg_periksa) memiliki banyak kolom (50+), beberapa kolom tampak appended untuk fitur lebih baru, ada kolom dengan naming pattern yang inkonsisten antar group
> **Kalau falsified →** schema normalized dengan tabel-tabel kecil yang fokus
> **Source area:** column count + naming pattern tabel-tabel besar di sik.sql

> **H1.5** — Khanza memprioritaskan **speed-of-input** atas **accuracy-of-input** untuk frontline operasional (poli, kasir, apotek).
> **Kalau valid →** form dengan banyak default value, fewer required fields, lookup combo box dominan, validation lenient di UI
> **Kalau falsified →** strict validation, banyak required fields, multi-step confirmation
> **Source area:** form classes di `src/rekammedis/` dan `src/keuangan/`

---

### 4.2 Domain 2 — Fundamental (Building Blocks)

**Pertanyaan inti:** Apa building block paling dasar?

> **H2.1** — Entity primer Khanza adalah **trinity: pasien (master) + registrasi (encounter unit) + transaksi (financial event)** — tiga primitif yang saling lock.
> **Kalau valid →** banyak modul ber-referensi ke kombinasi (no_rkm_medis, no_rawat) sebagai composite key
> **Kalau falsified →** entity primer berbeda (mis. episode perawatan, atau dokumen rekam medis)
> **Source area:** FK structure di sik.sql, terutama tabel transaksi yang point ke pasien/registrasi

> **H2.2** — Khanza menggunakan **semi-natural key** (kode bermakna, mis. nomor RM, kode dokter) sebagai primary key, bukan surrogate UUID.
> **Kalau valid →** PK berupa VARCHAR dengan format meaningful (no_rkm_medis = "000001", kd_dokter = "DR001")
> **Kalau falsified →** PK berupa AUTO_INCREMENT atau UUID
> **Source area:** schema DDL di sik.sql (CREATE TABLE statements)

> **H2.3** — Khanza memodelkan **waktu sebagai pasangan (tanggal, jam) terpisah**, bukan single TIMESTAMP, mereflect bagaimana petugas RS pikir tentang waktu.
> **Kalau valid →** kolom `tgl_*` (DATE) dan `jam_*` (TIME) terpisah di banyak transaksi
> **Kalau falsified →** satu kolom DATETIME/TIMESTAMP per event
> **Source area:** schema sik.sql untuk pattern kolom waktu

> **H2.4** — Khanza membedakan **rawat jalan** dan **rawat inap** sebagai jalur transaksi terpisah (parallel hierarchies), bukan polymorphic encounter.
> **Kalau valid →** tabel-tabel paralel dengan suffix `_ralan` dan `_ranap` (mis. resep_obat_ralan vs resep_obat_ranap)
> **Kalau falsified →** single encounter table dengan tipe attribute
> **Source area:** count + naming pattern tabel-tabel di sik.sql

> **H2.5** — Identitas pasien (pasien matching) adalah **single no_rkm_medis** sebagai authoritative — Khanza tidak punya konsep "global patient identifier" multi-RS atau identity reconciliation.
> **Kalau valid →** no_rkm_medis sebagai single PK pasien, tidak ada tabel identity_link atau master_patient_index
> **Kalau falsified →** ada layer reconciliation untuk same person across visits/RS
> **Source area:** tabel `pasien` di sik.sql + modul registrasi

---

### 4.3 Domain 3 — Konsep & Theoretical Framework

**Pertanyaan inti:** Apa kerangka teoretis arsitektur Khanza?

> **H3.1** — Khanza pakai **CRUD-with-snapshot-state** model untuk transaksi, bukan event sourcing atau immutable log.
> **Kalau valid →** tabel-tabel dengan UPDATE pattern, kolom `status_lanjut` sebagai state, tidak ada event_log atau audit_log table
> **Kalau falsified →** ada event stream table sebagai source of truth, snapshot derived
> **Source area:** UPDATE patterns di service classes, search untuk "event" naming di sik.sql

> **H3.2** — Alur pelayanan dimodelkan sebagai **status-transition di registrasi** (`reg_periksa.status_lanjut` mengubah dari "Ralan" → "Ranap" → "Pulang" dst.), state machine implicit.
> **Kalau valid →** enum/varchar values di kolom status, no formal state transition table
> **Kalau falsified →** ada workflow/state_definition table dengan transition rules eksplisit
> **Source area:** `reg_periksa` schema + UPDATE statements di workflow code

> **H3.3** — Master data vs operational data dipisah dengan **konvensi naming** (prefix "set_" atau "master_"), bukan dengan schema/database separation.
> **Kalau valid →** semua di database tunggal (`sik`), naming convention menjadi differentiator
> **Kalau falsified →** schema terpisah (`master.dokter` vs `operasional.reg_periksa`) atau database terpisah
> **Source area:** prefix analysis tabel di sik.sql

> **H3.4** — Khanza pakai **transaction-centric convergence model** — semua aktivitas klinis akhirnya konvergen ke billing sebagai "common rail".
> **Kalau valid →** banyak modul (apotek, lab, radiologi, tindakan) punya tabel detail yang punya FK ke registrasi+billing, billing menjadi central reconciliation point
> **Kalau falsified →** modul-modul punya billing terpisah yang baru di-reconcile di akuntansi level
> **Source area:** detail_* tables dan billing aggregation logic

> **H3.5** — Audit trail Khanza adalah **passive (timestamp + last_user columns)** bukan **active (immutable event log)** — implikasi: replay/reconstruction history terbatas.
> **Kalau valid →** kolom `created_at`/`updated_at`/`updated_by` di tabel, tidak ada history table per entity
> **Kalau falsified →** ada history/audit table dengan full event capture
> **Source area:** column patterns + presence of audit_* atau history_* tables

---

### 4.4 Domain 4 — Arsitektur & Workflow

**Pertanyaan inti:** Bagaimana komponen tersusun secara arsitektural + workflow end-to-end?

> **H4.1** — Khanza adalah **two-tier architecture** — fat client (presentation + business logic) konek **direct ke RDBMS**, no middle tier.
> **Kalau valid →** koneksi DB di-config di `database.ini` digunakan langsung dari client app, tidak ada API server/service layer
> **Kalau falsified →** ada server tier sebagai middleware
> **Source area:** struktur project (tidak ada folder backend/server di project root, sudah dilihat sub-session 1), `setting/database.ini` (DB credentials di client)

> **H4.2** — **Integrasi eksternal** (BPJS, SatuSehat, lab analyzers, bank) dipisah sebagai **service applications terpisah** yang **juga DB-direct**, bukan via shared API layer.
> **Kalau valid →** project-project `KhanzaHMSService*`, `api-bpjsfktl/`, `api-bridgingradiologi/` adalah Java apps independen yang baca/tulis ke sik database
> **Kalau falsified →** ada API gateway / service mesh sebagai intermediary
> **Source area:** struktur sub-project (sudah dilihat sub-session 1) + cara service ini konek

> **H4.3** — Business logic dominan **di presentation layer** (form handlers + dialog classes), bukan di service classes terpisah atau stored procedures.
> **Kalau valid →** Java form classes (`*.java` di src/) berisi logic CRUD + validation + calculation inline
> **Kalau falsified →** ada layer terpisah service/dao yang isolated dari UI
> **Source area:** sampling beberapa form classes di `src/rekammedis/`, `src/keuangan/`

> **H4.4** — Concurrency di-handle dengan **optimistic + last-write-wins**, bukan pessimistic locking eksplisit.
> **Kalau valid →** tidak ada eksplisit `SELECT FOR UPDATE`, atau version column untuk optimistic locking
> **Kalau falsified →** ada locking convention sistematis
> **Source area:** SQL queries di service classes, transaction patterns

> **H4.5** — **Workflow handoff antar modul** (mis. registrasi → poli → apotek) terjadi via **shared database state + UI navigation**, bukan via event/message bus.
> **Kalau valid →** tidak ada queue/event broker, semua "handoff" adalah update status di tabel registrasi yang query oleh modul tujuan
> **Kalau falsified →** ada messaging layer atau event-driven pattern
> **Source area:** flow registrasi → modul-modul, dependency analysis

---

### 4.5 Domain 5 — Modul (Modular Composition)

**Pertanyaan inti:** Modul-modul + rasional pemisahannya?

> **H5.1** — Pemisahan modul Khanza follow **struktur organisasi RS Indonesia** (poli, apotek, kasir, akuntansi, kepegawaian), bukan technical concerns (presentation/logic/data).
> **Kalau valid →** struktur paket `src/` (rekammedis/, keuangan/, kepegawaian/, inventory/, dapur/, ipsrs/) reflect organizational units bukan technical layers
> **Kalau falsified →** struktur layered (controllers/services/repositories)
> **Source area:** struktur `src/` (sudah dilihat sub-session 1, tampak organizational)

> **H5.2** — **Billing** dan **akuntansi** dipisah **tegas** sebagai dua modul dengan ownership berbeda — billing menghasilkan transaksi operasional, akuntansi memproses jurnal/buku besar.
> **Kalau valid →** dua paket berbeda dengan dependency satu arah (akuntansi membaca billing, billing tidak tahu akuntansi)
> **Kalau falsified →** modul gabungan atau mutual dependency
> **Source area:** `src/keuangan/` internal organization

> **H5.3** — **Bridging eksternal** (`src/bridging/` + sub-project services) dipisah dari modul fungsional karena **lifecycle berbeda** — API BPJS/SatuSehat berubah lebih sering dari domain workflow.
> **Kalau valid →** bridging code physically separated, versioning independen, perubahan di bridging tidak require recompile main app
> **Kalau falsified →** bridging integrated dalam modul fungsional masing-masing
> **Source area:** `src/bridging/` + struktur sub-project (sudah dilihat sub-session 1 parsially)

> **H5.4** — **Modul vertikal niche** (dapur, ipsrs, parkir, perpustakaan, tranfusidarah) menunjukkan Khanza tolerate **per-modul independence** — modul-modul ini tidak heavily depend pada core workflow.
> **Kalau valid →** modul-modul ini standalone, opsional, dapat di-disable
> **Kalau falsified →** modul-modul ini deeply coupled ke registrasi/billing
> **Source area:** dependency analysis paket-paket ini

> **H5.5** — Tidak ada **enforced module boundary** — semua modul share single database, coupling implicit via FK relations + shared queries. "Modul" lebih bersifat **organizational/code-package** daripada **architectural unit**.
> **Kalau valid →** semua modul akses tabel apa saja, no module-private schemas, no interface contracts
> **Kalau falsified →** ada module API atau bounded context discipline
> **Source area:** cross-package query patterns

---

### 4.6 Domain 6 — Kaitan antar Modul (Inter-Module Dependencies)

**Pertanyaan inti:** Bagaimana interaksi antar modul + pattern dependency?

> **H6.1** — Tabel `reg_periksa` (atau equivalent) adalah **central pivot** — modul-modul lain depend padanya sebagai context anchor.
> **Kalau valid →** mayoritas tabel detail di modul lain (resep, periksa_lab, periksa_radiologi, kamar_inap) punya FK ke reg_periksa
> **Kalau falsified →** ada multiple parallel pivots tanpa shared anchor
> **Source area:** FK reference count ke `reg_periksa` di sik.sql

> **H6.2** — **Cross-module transaction** (mis. apotek sell → kurangi stok → buat tagihan → catat jurnal) di-handle via **shared MySQL transaction** (semua dalam satu DB), bukan saga/2PC.
> **Kalau valid →** patterns BEGIN/COMMIT block di service classes, no compensating action logic
> **Kalau falsified →** ada saga orchestration atau eventual consistency pattern
> **Source area:** transaction boundary di Java service code

> **H6.3** — **Data sharing antar modul** terjadi via **direct table access** (any module reads any table), bukan via API/service contract.
> **Kalau valid →** banyak SELECT cross-module dari berbagai paket; tidak ada module-private DAO
> **Kalau falsified →** ada interface contract / module API
> **Source area:** SQL query patterns lintas-paket

> **H6.4** — **Konsistensi lintas modul** primarily di-enforce via **MySQL foreign key + trigger**, bukan di application logic.
> **Kalau valid →** banyak FK constraint di sik.sql; presence of TRIGGER definitions
> **Kalau falsified →** FK minimal, konsistensi di Java service classes
> **Source area:** FK + TRIGGER count di sik.sql

> **H6.5** — Modul **billing** (kasir + tagihan) menjadi **convergence point** — apotek, lab, radiologi, tindakan, kamar inap semua "merge" tagihannya di sini.
> **Kalau valid →** tabel billing (mis. `nota_jalan`, `nota_inap`) punya FK dari banyak detail_* tables
> **Kalau falsified →** setiap modul punya billing terpisah yang baru di-roll-up di akuntansi
> **Source area:** struktur billing + roll-up logic

---

### 4.7 Domain 7 — Universal Functions & Logic

**Pertanyaan inti:** Fungsi/logika yang dapat di-abstraksi platform-agnostic?

> **H7.1** — **Validation** terjadi di **multi-level inkonsisten** — UI form level (mostly), business logic level (sparingly), database level (FK + NOT NULL). Tidak ada single source of validation rules.
> **Kalau valid →** validation code duplicated antara form classes, no central validator
> **Kalau falsified →** ada validation library / rule engine
> **Source area:** sampling beberapa form classes untuk validation pattern

> **H7.2** — **Calculation** (billing total, gaji, stok adjustment) ada di **Java service classes** sebagai imperative code, bukan di stored procedure atau declarative rule.
> **Kalau valid →** semua kalkulasi numerik di Java, MySQL pakai sebagai storage
> **Kalau falsified →** kalkulasi kompleks di stored procedure
> **Source area:** count stored procedure di sik.sql + sampling Java service

> **H7.3** — **Reporting** pakai **JasperReports template + SQL queries**, bukan OLAP/cube/data warehouse. Implikasi: scalability bergantung query performance.
> **Kalau valid →** banyak file `.jasper` atau `.jrxml` di `report/`, queries inline di Java code yang call JasperReports
> **Kalau falsified →** ada warehouse/cube layer
> **Source area:** folder `report/` (sudah dilihat sub-session 1 di top-level)

> **H7.4** — **Search & filter** menggunakan **LIKE pattern + indexed column**, bukan full-text search / search engine.
> **Kalau valid →** SQL queries dengan `LIKE '%keyword%'` pattern dominan, no Lucene/Elasticsearch references
> **Kalau falsified →** ada search infrastructure terpisah
> **Source area:** search-related Java classes, index definitions di sik.sql

> **H7.5** — **Audit trail** adalah **column-based per entity** (`created_at`, `updated_at`, `updated_by`), **bukan event-based per action**. History reconstruction is **point-in-time** dari last update, tidak step-by-step.
> **Kalau valid →** kolom user/timestamp di tabel utama, no separate audit/history table
> **Kalau falsified →** ada audit_log table dengan event capture
> **Source area:** column patterns di sik.sql, presence of audit tables

> **H7.6** — **Authorization** adalah **role-based** dengan granularity di level menu/form (bukan field/row level).
> **Kalau valid →** tabel `petugas` + `hak_akses` dengan reference ke menu code, no row-level security
> **Kalau falsified →** ada row-level atau field-level security
> **Source area:** authorization-related tabel + Java check patterns

---

### 4.8 Domain 8 — Pencegahan Error & Bias

**Pertanyaan inti:** Pattern pencegahan error input + mitigation bias?

> **H8.1** — Duplicate pasien dicegah via **manual search-before-create UI workflow** (petugas wajib search dulu), **bukan automatic deduplication** (mis. fuzzy match nama+tgl lahir).
> **Kalau valid →** form registrasi punya step search → kalau tidak ketemu → create, tidak ada matching algorithm
> **Kalau falsified →** ada deduplication logic / fuzzy matching
> **Source area:** form registrasi pasien

> **H8.2** — **Data integrity** primarily di-enforce via **MySQL constraints** (FK, UNIQUE, NOT NULL, CHECK), bukan di application logic.
> **Kalau valid →** banyak constraint di sik.sql, application code asumsikan DB akan reject invalid
> **Kalau falsified →** constraint minimal, integrity di Java
> **Source area:** constraint analysis sik.sql

> **H8.3** — Khanza **tidak punya systematic bias mitigation** (mis. fraud detection di billing, audit-trail check, anomaly detection). Trust model: trust petugas + audit downstream.
> **Kalau valid →** no anomaly detection module, no fraud heuristics
> **Kalau falsified →** ada layer validation untuk suspicious pattern
> **Source area:** modul billing + audit search

> **H8.4** — **Lookup-driven input** (combo box untuk dokter, poli, obat, ICD) sebagai primary error prevention — reduce typo via pre-populated options.
> **Kalau valid →** form fields dominan combo box dari master table, sparse free text
> **Kalau falsified →** banyak free text input
> **Source area:** form field patterns

> **H8.5** — **Defensive coding** tidak konsisten — beberapa form punya extensive validation (registrasi pasien), lainnya minimal (form-form lebih baru) — tipikal organic evolution selama 15+ tahun.
> **Kalau valid →** validation code coverage varies across form, no centralized framework
> **Kalau falsified →** consistent validation framework
> **Source area:** sampling cross-modul form classes

> **H8.6** — Khanza menggunakan **soft delete + status flag** sebagai error recovery (bukan undo) — petugas yang salah input dapat re-mark as inactive daripada hard delete.
> **Kalau valid →** kolom `status='-'` atau equivalent di banyak tabel
> **Kalau falsified →** hard delete dominan
> **Source area:** schema pattern + DELETE pattern di Java code

---

### 4.9 Domain 9 — Workaround Tricks

**Pertanyaan inti:** Workaround Khanza untuk masalah khas SIMRS Indonesia?

> **H9.1** — **BPJS bridging volatility** (API change frequent) di-mitigate via **isolation ke service projects terpisah** sehingga update API tidak require recompile core app — versioning independen.
> **Kalau valid →** project `KhanzaHMSService*` adalah JAR terpisah, deployable independen dari main app
> **Kalau falsified →** bridging code di main JAR
> **Source area:** struktur sub-project + build config

> **H9.2** — **Lab analyzer integration** (variety alat dengan format proprietary) di-handle via **separate bridging databases/schemas** sebagai **staging buffer** — Khanza tidak coba unify, tapi accept plurality.
> **Kalau valid →** `sik_bridging_lab.sql` sebagai schema staging terpisah, multiple lab integrations (Sysmex, Fuji, ELIMS, VANSLab, SLIMS) co-exist
> **Kalau falsified →** single unified lab interface
> **Source area:** `sik_bridging_lab.sql` + `setting/database.xml` config bagian lab (sudah dilihat sub-session 1: HOSTSYSMEX, HOSTFUJI, HOSTELIMS, dst. semua co-exist)

> **H9.3** — **Network instability** (typical Indonesian RS dengan WAN/intermittent connection) di-mitigate via **local-first operation** — client app cache config lokal, dapat operasi degraded saat DB unreachable.
> **Kalau valid →** `setting/database.ini` lokal, settings cached client-side, ada retry/timeout pattern
> **Kalau falsified →** strict online-only operation
> **Source area:** koneksi DB handling di Java + setting file pattern

> **H9.4** — **Regulatory change** (Kemenkes/BPJS reporting format berubah) di-accommodate via **JasperReports template** yang user/admin dapat modify tanpa code change — externalized format.
> **Kalau valid →** `.jrxml` files di-load runtime dari folder `report/`, dapat edit dengan iReport/JasperStudio
> **Kalau falsified →** report format hardcoded di Java
> **Source area:** folder `report/` + report loading logic

> **H9.5** — **Multi-tenancy bukan goal Khanza** — satu installation = satu RS. Workaround untuk skenario lintas-RS adalah **deploy terpisah per RS**, tidak ada shared infrastructure.
> **Kalau valid →** no tenant_id column, no schema-per-tenant, configuration assumes single RS
> **Kalau falsified →** ada tenant isolation pattern
> **Source area:** schema-wide check untuk tenant/org column

> **H9.6** — **Manual reconciliation** (mis. saat data dari analyzer lab tidak match dengan order) ditangani via **dedicated form untuk human review**, bukan automated matching dengan confidence score.
> **Kalau valid →** ada form-form khusus "verifikasi", "konfirmasi", "validasi" untuk human-in-the-loop reconciliation
> **Kalau falsified →** auto-matching dominan
> **Source area:** Verify/Reconcile form classes

---

### 4.10 Domain 10 — Hal-hal Lain (Additional Observations)

**Pertanyaan inti:** Hal-hal yang muncul ad-hoc tapi relevant?

> **H10.1** — Khanza pakai **bahasa Indonesia untuk schema identifier** (`no_rkm_medis`, `kd_dokter`, `tgl_periksa`) — domain language sebagai schema language, bukan English abstraction.
> **Kalau valid →** mayoritas table/column names dalam Indonesia/abbreviation Indonesia
> **Kalau falsified →** schema dalam English
> **Source area:** sik.sql identifier patterns

> **H10.2** — Regulatory change risk di-contain via **modular service architecture** — setiap regulator (BPJS, Kemenkes SatuSehat, SIRS, SISRUTE, SPDGT) punya service project terpisah.
> **Kalau valid →** `KhanzaHMSServiceSatuSehat`, `KhanzaHMSServiceSIRSYankes`, dll. semua terpisah (sudah dilihat sub-session 1)
> **Kalau falsified →** semua regulator integration di satu modul
> **Source area:** sub-project struktur (already observed)

> **H10.3** — **Gap: tidak ada formal API layer** untuk third-party integration di luar predefined (BPJS, SatuSehat). RS yang ingin integrate dengan vendor baru harus DB-direct atau bikin service Java baru.
> **Kalau valid →** no REST API, no GraphQL, no OpenAPI spec
> **Kalau falsified →** ada API endpoint terbuka
> **Source area:** search for REST/Spring/Jersey/API patterns

> **H10.4** — **Gap: tidak ada event-driven architecture** — sistem reactive via SQL polling + UI refresh, tidak ada pub-sub atau webhooks.
> **Kalau valid →** UI refresh button + scheduled query dominan, no message broker
> **Kalau falsified →** ada Kafka/RabbitMQ/webhook pattern
> **Source area:** Java messaging/queue references

> **H10.5** — Khanza adalah **codebase yang accreted organically over 15+ years** — terlihat dari struktur sub-project yang grow incrementally per regulatori shift (Aplicare, MobileJKN, MobileJKNERM, MobileJKNFKTP — empat variant Mobile JKN yang co-exist sebagai layering historis).
> **Kalau valid →** sub-project naming pattern menunjukkan layered accumulation
> **Kalau falsified →** struktur clean dengan single canonical service per regulator
> **Source area:** sub-project list (already observed)

> **H10.6** — Khanza tidak punya **inter-RS data exchange** sebagai konsep (mis. patient transfer dengan record portability) — workflow ini di-defer ke regulator (Kemenkes SatuSehat).
> **Kalau valid →** no patient transfer table dengan source/destination RS structure
> **Kalau falsified →** ada inter-RS pattern
> **Source area:** referral/rujukan tables di sik.sql

---

## 5. Cross-Domain Meta-Hypotheses

Hipotesis yang **memotong lintas domain** dan menjadi tema-tema sentral untuk di-track sepanjang Phase 2. Mereka **tidak di-test sendiri** — melainkan **emergent** dari konfirmasi/refinement hipotesis di multiple domain.

> **M1 — Sustainable Accretion Architecture**
> Khanza adalah example of "**sustainable accretion architecture**" — system yang dirancang **bisa tumbuh dengan menambah fitur tanpa redesign**, dengan trade-off coherence vs longevity yang heavily favor longevity. Implikasi untuk SIMRS Batin Tikal: keputusan early tentang extension pattern punya 15+ year consequences. Validate via konfirmasi H1.4 (field extension) + H10.5 (organic accretion) + H5.5 (no enforced module boundary).

> **M2 — Trust the Operator, Audit Downstream**
> Filosofi default Khanza adalah "**trust the operator, audit downstream**" — minimal preventive control di input, akumulasi data di backend, audit/correction sebagai retrofit. Ini reflect realita RS dengan staff turnover tinggi dan workload tinggi. SIKESUMA dengan posture audit-first (TNI AD context) **kemungkinan punya different default** dan harus eksplisit. Validate via H1.5 (speed > accuracy) + H7.5 (passive audit) + H8.3 (no bias mitigation).

> **M3 — Plurality Acceptance as Design Discipline**
> "**Plurality acceptance**" sebagai design discipline — multiple lab analyzers, multiple BPJS API versions, multiple bank integrations co-exist tanpa attempt unification. Ini insight untuk SIMRS Batin Tikal: jangan paksa unification kalau realita di RS adalah plurality. Validate via H9.2 (lab plurality) + H10.5 (BPJS versioning) + H4.2 (separate bridging services).

> **M4 — Core Stable vs Regulatory Volatile (Different Lifecycles)**
> Khanza membedakan "**core workflow yang stable**" dari "**regulatory/integration yang volatile**" dan memberi keduanya **lifecycle berbeda**. Ini pattern penting untuk SIMRS Batin Tikal: design boundary yang serupa antara core SIMRS dan bridging/regulatori. Validate via H5.3 (bridging separation) + H9.1 (BPJS isolation) + H10.2 (regulator modular).

---

## 6. Cross-Project Awareness Notes

### ⚠️ Tag: PHASE 3 USE ONLY — NOT FOR PHASE 2 TESTING

N1-N5 berikut **bukan hipotesis testable terhadap source Khanza**. Mereka adalah **observasi komparatif** antara Khanza patterns (yang akan saya validate di Phase 2) dengan SIKESUMA patterns (yang sudah ada di parallel project). Mereka relevan untuk **Phase 3 Synthesis** saat menulis "Implications for SIKESUMA / SIMRS BT" section di final Codex.

**Phase 2 executor: SKIP §6 entirely. Lanjut ke §7 untuk handoff guidance.**

---

> **N1 — Transactional Volume vs Governance Ceremony Spectrum**
> Khanza dirancang untuk **high-frequency low-ceremony per transaction** (ribuan registrasi/hari, billing line per detik). SIKESUMA dirancang untuk **low-frequency high-ceremony per Revisi POK** (mungkin selusin per tahun, masing-masing dengan 12-validator gate + LHR APIP + audit snapshot).
> SIMRS Batin Tikal akan punya modul-modul di **kedua sisi spektrum**. Implication: **per-modul axis selection**. Modul registrasi pasien butuh Khanza-style; modul approval expense butuh SIKESUMA-style.

> **N2 — Audit Trail: Passive (Column) vs Active (Event/Snapshot)**
> Hipotesis H3.5 + H7.5 saya predict Khanza pakai **column-based passive audit** (timestamp + last_user). SIKESUMA Tier 5a sudah mature dengan **snapshot-based active audit** (immutable R7c, defense at DB + app layer).
> SIMRS BT punya pilihan. Implication: choice tergantung **audit defensibility requirement per modul** — Itjenad/BPK-grade untuk financial/approval modul, operational-grade untuk routine workflow.

> **N3 — Plurality Acceptance vs Single Source of Truth**
> Hipotesis H9.2 + M3 saya predict Khanza accept **plurality** (multiple lab analyzers, multiple BPJS API versions co-exist). SIKESUMA design mengejar **SSOT discipline** (single canonical state, validation gate).
> SIMRS BT akan hadapi dilemma ini. Implication: **per-domain decision**, mungkin plurality OK untuk integrasi eksternal tapi SSOT wajib untuk core data (per UU PDP, Permenkes RME).

> **N4 — Validation: Embedded UI vs Pure Function + Composition**
> Hipotesis H7.1 saya predict Khanza punya validation **embedded di UI form** (multi-level inkonsisten). SIKESUMA pattern adalah **pure function validator + dashboard composition** (12 validators testable, UI-agnostic, server-side runnable).
> SIMRS BT inherit pilihan ini. Implication: pattern choice impacts **test-ability**, **maintainability**, dan **server-side validation capability** untuk future. SIKESUMA-style strongly recommended kalau audit-defensibility prioritas.

> **N5 — Locale: Domain Language vs English Abstraction**
> Hipotesis H10.1 saya predict Khanza pakai **bahasa Indonesia untuk schema identifier** (`no_rkm_medis`, `kd_dokter`). SIKESUMA tampak punya **mixed convention** (`usulan_revisi`, `lhr_apip_global` Indonesia; `ValidationResult`, `useReducer` English).
> SIMRS BT inherit dari kedua tradisi. Implication: **codify naming convention sejak awal Phase 2.1** untuk prevent drift. Recommend: Indonesia untuk domain-bearing identifiers (table, column, type), English untuk technical abstraction (interface name, type util).

---

## 7. Phase 2 Handoff Guidance

**Bagian ini adalah panduan eksekusi untuk fresh AI session yang melanjutkan Phase 2.**

### 7.1 Apa Phase 2 Lakukan

Per Brief §8.2 + §4.1:

1. **Per domain**, fresh session test hipotesis terhadap source Khanza
2. Output per hipotesis: **confirmed / refined / falsified** dengan **evidence pointer** ke source area (folder/file, BUKAN copy content)
3. **Owner review per domain** sebelum lanjut ke domain berikut

### 7.2 Suggested Execution Order

Per Owner direction (12 Mei 2026, konteks-3): **default §5.1 → §5.10 OK, re-prioritize on the fly**.

Saya rekomendasi prioritisasi berikut **kalau Phase 2 ingin maximize signal-to-effort ratio** (Owner judgment akhir):

| Order | Domain | Rationale | Estimated effort |
|---|---|---|---|
| 1 | **Domain 2 (Fundamental)** | Foundation — block semua domain lain | Sub-session menengah |
| 2 | **Domain 5 (Modul)** | Quick win — sebagian sudah observable dari struktur folder | Sub-session ringan |
| 3 | **Domain 6 (Inter-Module)** | Pasangan natural dengan Domain 5 | Sub-session menengah |
| 4 | **Domain 4 (Arsitektur)** | Substantive — butuh sampling source | Sub-session menengah |
| 5 | **Domain 7 (Universal Functions)** | Sama — sampling code | Sub-session menengah |
| 6 | **Domain 3 (Konsep)** | Synthesis-heavy — perlu data dari domain lain | Sub-session menengah-berat |
| 7 | **Domain 1 (Filosofi)** | Synthesis-heavy — emergent dari domain lain | Sub-session menengah |
| 8 | **Domain 8 (Error Prevention)** | Targeted — saat context mature | Sub-session ringan-menengah |
| 9 | **Domain 9 (Workaround)** | Targeted — saat context mature | Sub-session ringan-menengah |
| 10 | **Domain 10 (Other)** | Catchall — at the end | Sub-session ringan |

**Alternative:** Owner dapat front-load **Domain 1 + Domain 2 + Domain 8** sebagai trio prioritas (filosofi + fundamental + error prevention) kalau ada strategic reason.

### 7.3 Source Area Reference (High-Level)

Repo sudah di-clone (per sub-session 1). Path dalam sandbox: `/home/claude/SIMRS-Khanza/` (kalau fresh session start clean, re-clone via `git clone --depth 1 https://github.com/mas-elkhanza/SIMRS-Khanza.git`).

| Source Type | Lokasi | Pakai Untuk |
|---|---|---|
| Java source main app | `src/` (paket per modul: rekammedis/, keuangan/, bridging/, dll.) | Validation hipotesis H1-H10 yang touch business logic |
| Database schema | `sik.sql` (~11.6 MB) | Schema-related hipotesis (H2.*, H3.3, H6.*, H7.5, H7.6) |
| Bridging staging schema | `sik_bridging_lab.sql`, `sik_bridging_radiologi.sql` | Bridging hipotesis (H9.2) |
| Sub-projects | Root folder pattern `KhanzaHMSService*`, `Khanza*`, `api-*`, dll. | Architecture + bridging hipotesis (H4.2, H5.3, H9.1, H10.2) |
| Configuration | `setting/database.ini`, `setting/database.xml` | Config-related hipotesis (sudah saya cek sub-session 1) |
| Reports | `report/` folder | Reporting hipotesis (H7.3, H9.4) |
| Build config | `build.xml`, `nbproject/` | Architecture hipotesis (H4.*) |

### 7.4 Output Format per Phase 2 Sub-Session

Setiap Phase 2 sub-session menghasilkan **per-domain validation document** dengan format:

```
KHANZA-CODEX-PHASE-2-DOMAIN-<N>-<NAME>.md
├── §1 Hipotesis tested (list dari §4.<N> file ini)
├── §2 Per-hipotesis validation:
│   ├── H<N>.<no> — STATUS (confirmed/refined/falsified)
│   ├── Evidence summary (source area + finding deskriptif, no verbatim)
│   ├── Refined statement (kalau status = refined)
│   ├── Alternative pattern (kalau status = falsified)
│   └── Conceptual abstraction (primitive yang di-extract)
├── §3 Cross-hipotesis observations (emergent pattern)
└── §4 Owner gate request — siap untuk Phase 2 next domain atau Phase 3
```

### 7.5 Owner Gate per Domain

Per Brief §4.1 Step 5 + §8.2:

- Setelah selesai 1 domain, Phase 2 session **submit ke Owner** untuk review
- Owner approve → lanjut domain berikutnya
- Owner request refinement → Phase 2 session iterate
- Owner flag concern → escalate untuk discussion

**Tidak boleh** Phase 2 session run-ahead semua 10 domain tanpa Owner gate.

### 7.6 When to Escalate (Bukan Lanjut Sendiri)

Phase 2 session **escalate ke Owner** kalau:

- Menemukan finding yang melampaui boundary discipline (e.g. license-edge case)
- Hipotesis ternyata mensyaratkan domain knowledge yang belum di-provide (mis. detail TNI AD workflow untuk articulate kontras)
- Cross-project implication muncul yang require Owner judgment
- Substantial reframing dari hipotesis original
- Hal apa pun yang feel ambiguous

### 7.7 What Phase 2 Session JANGAN Lakukan

- ❌ Edit file ini (`KHANZA-CODEX-PHASE-1-HYPOTHESES.md`) — historical record, immutable except per Owner
- ❌ Touch SIKESUMA artifacts (per §2.4 di file ini)
- ❌ Adopt SIKESUMA pattern unilateral ke Codex tanpa Owner brief
- ❌ Skip §6 hypothesis (N1-N5) — itu Phase 3 only
- ❌ Copy-paste code Khanza ke output document
- ❌ Browse public forums/discussions Khanza untuk "extra info" — stay di source repo

---

## 8. Boundary Discipline Verification

Per Brief §4.4. Final check Phase 1 output:

| Test | Result | Notes |
|---|---|---|
| Setiap hipotesis adalah **konsep** (bukan code)? | ✅ Ya | Semua statement adalah pattern/choice, bukan specific code structure |
| **Platform-agnostic**? | ✅ Ya | Tidak ada hipotesis yang Java/MySQL/Swing-locked di level konsep |
| **Abstract enough** (jawab "kenapa")? | ✅ Mayoritas | Beberapa H#.# masih agak deskriptif; akan di-abstract lebih dalam saat refinement Phase 2 |
| **License-clean** (no verbatim copy)? | ✅ Ya | Tidak ada copy dari source Khanza. References hanya ke filenames/folder yang publicly observable dari repo listing |
| **Relevan untuk SIKESUMA / SIMRS BT**? | ✅ Ya | Setiap hipotesis menginform design decision yang SIMRS BT akan hadapi di Phase 2 build |

**Boundary anti-patterns yang dihindari:**

| Anti-Pattern (per Brief §7) | Check |
|---|---|
| Cargo cult | ✅ Tidak ada "Khanza pakai X → SIMRS BT pakai X" statement |
| Implementation-bias | ✅ Hipotesis tidak conflate konsep dengan implementasi |
| Stack-locked thinking | ✅ Tidak ada hipotesis Java-specific |
| License contamination | ✅ Tidak ada verbatim |
| Tautology | ✅ Setiap hipotesis punya falsifiable alternative |
| Data fitting | ✅ Hipotesis form dari prior reasoning, bukan dari pre-determined conclusion |
| Exhaustive documentation | ✅ ~55 hipotesis, bukan exhaustive — fokus pada signal |
| Endorsement bias | ✅ Posture neutral analytical maintained |

---

## 9. Document Lifecycle & Authority

### 9.1 Versioning

| Versi | Tanggal | Perubahan | Author |
|---|---|---|---|
| 1.0 | 13 Mei 2026 | Initial Phase 1 output. Self-contained bundle for fresh AI session continuation. Owner-approved (post-discussion 3 keputusan: proceed-default, N1-N5 tag Phase 3, verbatim cross-project boundary) | Khanza spoke session AI (sub-session 1), Owner-supervised |

### 9.2 Update Protocol

File ini adalah **historical Phase 1 record** — secara default **immutable** untuk preserve methodology lineage.

Update hanya dilakukan dalam kondisi:
- **Owner-directed clarification** — Owner request rewording untuk reduce ambiguity, dengan paired version bump
- **Major methodology refinement** — kalau Phase 2 ternyata membongkar issue dengan methodology (rare); di-document dengan addendum, bukan rewrite
- **Lineage chain update** — kalau ada upstream doc baru yang relevant di-add ke §1.1

**Yang TIDAK boleh update:**
- Hipotesis content (H, M, N) — kalau hipotesis perlu refinement, itu Phase 2 output's job, bukan revision file ini
- Posture statement §2 — anchor for consistency, perubahan butuh new addendum di upstream doc
- Boundary discipline §3, §8 — methodology lock

### 9.3 Authority Hierarchy

Per OWNER-POLICY pattern yang berlaku di SIKESUMA dan diadopsi cross-project:

1. **Owner (dr Ferry)** — real-time session message, final decision-maker untuk segala hal
2. **Authoritative upstream documents** (Blueprint v1.0 + Brief v1.2) — frame yang harus dipatuhi
3. **File ini** — guidance untuk Phase 2+ execution, tapi tidak override Owner real-time
4. **Phase 2-5 output documents** — turunan dari ini, tidak supersede

### 9.4 Ownership

- **Owner:** dr Ferry (Successor RS Tk.IV 02.07.03 Batin Tikal)
- **Custodian:** Khanza spoke session (sub-session aktif)
- **Read access:** Owner + future Phase 2-5 sessions + future SIMRS BT build sessions (eventual consumers of final Codex)
- **Edit access:** Owner only (per §9.2 update protocol)

### 9.5 Cross-Reference

| Document | Relationship |
|---|---|
| `SIMRS-BATIN-TIKAL-ARCHITECTURE-BLUEPRINT.md` v1.0 | **Parent authoritative blueprint** — defines three-workstream model |
| `KHANZA-SPOKE-SESSION-BRIEF.md` v1.2 | **Direct mandate** — methodology + 10 domains + output spec; file ini fulfills §8.1 deliverable |
| `OWNER-POLICY-FOR-AI-SESSIONS.md` Addendum v1.5 §S | **Cross-project boundary policy** — verbatim quoted di §2.4 file ini |
| `SIKESUMA-INTRODUCTION-FOR-SIMRS-SPOKE.md` v1.0 | **Cross-project context** — SIKESUMA awareness, lateral peer (read-only) |
| `glossary.md` (SIKESUMA) | **Domain glossary** — TNI AD specifics RS Batin Tikal; awareness only |
| `SIMRS-SPOKE-READ-ACCESS.md` v1.0 | **Access companion** — read-only credentials pattern (tidak dipakai di Phase 1) |
| (Future) `KHANZA-CODEX-PHASE-2-DOMAIN-<N>-<NAME>.md` | **Phase 2 outputs** — per-domain validation results, consume hipotesis dari file ini |
| (Future) `THE-KHANZA-CODEX.md` | **Final deliverable** Phase 5 — synthesis dari Phase 2-4, distributed ke SIMRS BT build sessions |

### 9.6 Closing Statement

> File ini adalah Phase 1 output yang membentuk **fondasi methodological** untuk Khanza spoke session keseluruhan. Tujuan utamanya **menjaga konsistensi** dan **mencegah drift/bias** sepanjang multi-session work yang akan menghasilkan The Khanza Codex.
>
> Fresh AI session yang melanjutkan Phase 2 atau later phases harus pegang §2 (Posture Statement) dan §3 (Methodology Recap) sebagai **anchor**, dengan §4 (Hypothesis Sets) sebagai **content to validate**, dan §7 (Phase 2 Handoff Guidance) sebagai **executable plan**.
>
> Cross-project discipline yang ter-codify di §2.4 (verbatim dari §S Addendum v1.5) adalah **non-negotiable** — SIMRS spoke session pegang lateral peer status terhadap SIKESUMA, dengan Owner sebagai single source of coordination.

---

*End of Phase 1 bundle. Owner-approved 13 Mei 2026. Ready for Phase 2 fresh session pickup.*
