# The Khanza Codex — Phase 2 Domain 2 Validation
## Fundamental (Building Blocks)

**File:** `KHANZA-CODEX-PHASE-2-DOMAIN-2-FUNDAMENTAL.md`
**Versi:** 1.0
**Tanggal:** 13 Mei 2026
**Phase:** 2 (Targeted Data Collection) — sub-session 1 / 10
**Domain:** 2 — Fundamental (Building Blocks)
**Status:** Awaiting Owner gate (§7.5 Phase 1 bundle)
**Parent input:** `KHANZA-CODEX-PHASE-1-HYPOTHESES.md` v1.0 §4.2
**Author:** Khanza spoke session AI (Phase 2 fresh session)
**Validation method:** Structural analysis of `sik.sql` + `src/` folder layout. No verbatim code/schema copy.

---

## Daftar Isi

1. [Hipotesis yang Di-test](#1-hipotesis-yang-di-test)
2. [Per-Hipotesis Validation](#2-per-hipotesis-validation)
   - [H2.1 — Trinity Entity Primer](#21-h21--trinity-entity-primer-pasien--registrasi--transaksi)
   - [H2.2 — Semi-Natural Keys](#22-h22--semi-natural-keys-vs-surrogate-uuid)
   - [H2.3 — Date+Time Separate](#23-h23--datetime-pasangan-terpisah)
   - [H2.4 — Ralan/Ranap Parallel Hierarchies](#24-h24--ralan-vs-ranap-parallel-hierarchies)
   - [H2.5 — Single Identity Anchor](#25-h25--single-no_rkm_medis-as-authoritative-identity)
3. [Cross-Hipotesis Observations](#3-cross-hipotesis-observations)
4. [Conceptual Primitives Extracted](#4-conceptual-primitives-extracted)
5. [Owner Gate Request](#5-owner-gate-request)

---

## 1. Hipotesis yang Di-test

Per §4.2 Phase 1 bundle, lima hipotesis Domain 2:

| ID | Statement (singkat) | Original prediction |
|---|---|---|
| **H2.1** | Trinity: pasien + registrasi + transaksi sebagai primary entities | Composite key (no_rkm_medis, no_rawat) di banyak modul |
| **H2.2** | Semi-natural keys (kode bermakna) sebagai PK | PK = VARCHAR meaningful, bukan AUTO_INCREMENT/UUID |
| **H2.3** | Tanggal + jam terpisah, bukan single TIMESTAMP | Kolom `tgl_*` (DATE) dan `jam_*` (TIME) terpisah |
| **H2.4** | Ralan & Ranap sebagai jalur paralel terpisah | Tabel dengan suffix `_ralan` dan `_ranap` |
| **H2.5** | Single no_rkm_medis sebagai authoritative identity | Tidak ada MPI / identity reconciliation layer |

**Source area validated:** `sik.sql` (~1156 CREATE TABLE statements), `src/` folder structure.
**Method:** structural greps + pattern counts. Tidak ada konten verbatim di-extract ke output.

---

## 2. Per-Hipotesis Validation

### 2.1 H2.1 — Trinity Entity Primer (pasien + registrasi + transaksi)

#### Status: **REFINED** ⚠️

#### Evidence Summary

Validation menunjukkan **trinity framing tidak akurat sebagai equal-weighted triple**. Data structural:

| Pattern | Observable Count | Implikasi |
|---|---|---|
| Tabel yang punya FK `REFERENCES reg_periksa` | **350** | reg_periksa adalah **dominant central pivot** |
| Tabel yang punya FK `REFERENCES pasien` | **37** | pasien jauh lebih lemah sebagai join anchor |
| Tabel dengan kolom `no_rawat` (referensi encounter) | **418** | konfirmasi encounter-centric design |
| Tabel dengan kolom `no_rkm_medis` (referensi pasien) | **47** | confirms patient is "looked up", not "joined to" |
| Total tabel di sik.sql | 1156 | Skala referensi |

Ratio FK references **reg_periksa : pasien = ~9.5 : 1**. Pattern ini bukan trinity dengan tiga sama-sentral — ini adalah **encounter-centric hierarchy** dimana:
- `pasien` adalah **master lookup** (one-time identity establishment)
- `reg_periksa` adalah **operational pivot** (anchor untuk hampir semua aktivitas klinis + finansial)
- "Transaksi" bukan satu entity — adalah **collection of detail tables** (apotek, lab, radiologi, kamar, tindakan) yang **semua** menggantung di reg_periksa

#### Refined Statement (Hipotesis baru H2.1')

> **H2.1' — Khanza memodelkan reality klinis sebagai encounter-centric, bukan trinity-equal.** Primitif utama adalah **pasangan (pasien, encounter)** dimana **encounter (reg_periksa) adalah dominant join anchor** untuk semua aktivitas klinis + finansial. Pasien adalah master lookup (one-time identity); encounter adalah operational center; detail tables (resep, lab, radiologi, kamar, tindakan, billing) adalah leaves yang semua menggantung di encounter.

#### Conceptual Abstraction (Platform-Agnostic)

**Primitive:** **Encounter-as-Pivot Architecture**

Pattern yang dapat di-rephrase ke stack apa pun:
- Identity entity (patient) di-anchor secara longgar
- Operational entity (encounter/visit/episode) di-anchor secara kuat
- Semua aktivitas downstream FK ke operational entity, **bukan** ke identity entity
- Konsekuensi: query "semua aktivitas pasien X" require 2-step (pasien → encounters → details), bukan single hop

Trade-off yang dipilih Khanza:
- ✅ Query encounter-scoped (paling sering operasional) jadi single-table-with-joins-via-encounter
- ❌ Query patient-lifetime (longitudinal, lifetime perspective) jadi multi-step

---

### 2.2 H2.2 — Semi-Natural Keys vs Surrogate UUID

#### Status: **CONFIRMED** ✅

#### Evidence Summary

Sampling 7 master tables menunjukkan **pattern konsisten** semi-natural string keys:

| Master Table | Primary Key | Type & Format | Note |
|---|---|---|---|
| `pasien` | `no_rkm_medis` | VARCHAR(15) | Nomor RM bermakna |
| `dokter` | `kd_dokter` | VARCHAR(20) | Kode dokter bermakna |
| `poliklinik` | `kd_poli` | CHAR(5) | Kode poli fixed-length |
| `kamar` | `kd_kamar` | VARCHAR(15) | Kode kamar bermakna |
| `bangsal` | `kd_bangsal` | CHAR(5) | Kode bangsal fixed |
| `databarang` (obat) | `kode_brng` | VARCHAR(15) | Kode barang/obat bermakna |
| `penyakit` (ICD) | `kd_penyakit` | VARCHAR(15) | Kode penyakit |
| `petugas` | `nip` | (NIP itself adalah natural) | Identitas natural |

**Counter-evidence:** AUTO_INCREMENT muncul hanya **70 kali** di seluruh `sik.sql` (~6% dari 1156 tables). Penggunaan AUTO_INCREMENT terbatas pada tabel-tabel detail/log/transient.

**Pattern adalah dominan.** Untuk master data, Khanza secara konsisten pakai semi-natural meaningful codes; AUTO_INCREMENT hanya untuk detail rows dimana surrogate sederhana sudah cukup.

#### Conceptual Abstraction

**Primitive:** **Identifier-as-Domain-Value**

Pattern: master entity identifier adalah **bagian dari domain language**, bukan hanya technical surrogate.

Konsekuensi konseptual:
- ✅ Identifier dapat dibaca manusia, di-print di surat, di-eja telepon
- ✅ Identifier carries information (mis. kd_bangsal yang prefix dengan kode RS satellite)
- ❌ Renaming/restructuring identifier scheme expensive (referensi lateral banyak)
- ❌ Cross-system identity reconciliation lebih sulit (kalau dua RS punya `kd_dokter` "DR001" untuk dokter berbeda)

Trade-off yang dipilih Khanza: human-readability + domain-richness atas system-level uniformity.

---

### 2.3 H2.3 — Date/Time Pasangan Terpisah

#### Status: **REFINED** ⚠️

#### Evidence Summary

Hipotesis original "tanggal dan jam terpisah, bukan single TIMESTAMP" — kenyataannya **dua pattern coexist**:

| Pattern | Observable Count | Use Case |
|---|---|---|
| Kolom `tgl_*` typed DATE | **244** | Operational/clinical dates (tgl_periksa, tgl_perawatan, tgl_registrasi) |
| Kolom `jam_*` typed TIME | **84** | Operational/clinical times (jam_rawat, jam_keluar) |
| Kolom typed TIMESTAMP / DATETIME | **289** | System-tracked timestamps (likely audit, created_at-like) |

Insight penting: **separate tgl_+jam_ pattern bahkan menjadi bagian dari composite PK** di beberapa tabel — observable di pola seperti `PRIMARY KEY (no_rawat, kd_jenis_prw, no_bayar, tgl_perawatan, jam_rawat)`. Ini menunjukkan **petugas dan sistem treat tgl + jam sebagai komponen logical terpisah**, bukan sebagai derivative dari satu timestamp.

#### Refined Statement (H2.3')

> **H2.3' — Khanza membedakan secara konseptual antara "human-clock time" (tgl + jam terpisah, untuk klinis-operasional) dan "system timestamp" (single DATETIME/TIMESTAMP, untuk audit/tracking).** Kedua pattern coexist by design — tgl_+jam_ untuk kapan event klinis terjadi (yang petugas input manual), TIMESTAMP untuk kapan record system di-create/update (yang database track otomatis).

#### Conceptual Abstraction

**Primitive:** **Bifurcated Temporal Model**

Konsep dasar: ada dua **jenis waktu** yang berbeda secara semantic:

| Jenis | Properti | Source | Penggunaan |
|---|---|---|---|
| **Clinical/Operational Time** | Tanggal + jam terpisah, petugas pick manual | Human input | "Kapan dokter periksa pasien" — sering granularitas menit |
| **System Time** | Single timestamp dengan timezone | DB auto-generated | "Kapan record ini di-update" — granularitas microsecond |

Pemisahan ini mereflect bahwa:
- Clinical event time **boleh dibatalkan + dicatat ulang** (mis. petugas salah jam) — independen dari saat record di-create
- System time adalah **immutable witness** untuk audit lineage

Trade-off:
- ✅ Audit trail yang jelas (system time captures "kapan kita tahu") vs operational reality (tgl_+jam_ captures "kapan event")
- ❌ Schema lebih banyak kolom; potential drift kalau coba reconcile tgl_+jam_ dengan TIMESTAMP

---

### 2.4 H2.4 — Ralan vs Ranap Parallel Hierarchies

#### Status: **REFINED** ⚠️

#### Evidence Summary

Hipotesis original implikasi "split universal" — kenyataannya **selective hybrid**:

| Pattern | Observable Count | Notes |
|---|---|---|
| Tabel dengan suffix `_ralan` | **14** | E.g., catatan_keperawatan_ralan, penilaian_awal_keperawatan_ralan, pemeriksaan_ginekologi_ralan |
| Tabel dengan suffix `_ranap` | **20** | E.g., catatan_keperawatan_ranap, dpjp_ranap, data_klasifikasi_pasien_ranap |
| **Paired base names** (same concept di kedua sisi) | **12** | E.g., (pemeriksaan_ralan, pemeriksaan_ranap), (catatan_keperawatan_ralan, catatan_keperawatan_ranap) |
| Total tables di sik.sql | 1156 | Berarti split pattern affects ~3% of tables |

**Unified tables (tidak di-split)** untuk modul-modul dimana workflow sama:
- Lab: `periksa_lab`, `hasil_lab`, `detail_periksa_lab` (unified)
- Radiologi: `periksa_radiologi`, `hasil_radiologi`, `gambar_radiologi` (unified)
- Apotek: `resep_obat`, `detail_pemberian_obat`, `resep_luar_obat` (unified)

**Discriminator:** `reg_periksa.status_lanjut` adalah `ENUM('Ralan','Ranap')` — kolom ini di encounter table yang membedakan, dan unified detail tables join ke reg_periksa untuk discriminate.

#### Refined Statement (H2.4')

> **H2.4' — Khanza menerapkan pattern selective hybrid untuk ralan/ranap.** Tabel detail di-split hanya ketika **workflow konkret berbeda** (mis. nursing observation di rawat inap vs rawat jalan punya field-field berbeda). Untuk modul dimana logic identik (lab, radiologi, apotek), tabel unified dan discriminate via FK ke `reg_periksa.status_lanjut`. **Split keputusan adalah workflow-driven, bukan pattern-driven** — keep complexity hanya kalau perlu.

#### Conceptual Abstraction

**Primitive:** **Pragmatic Schema Polymorphism**

Pattern yang relevan: kapan di-split tabel berdasarkan dimension (di sini: visit type), kapan di-unify?

**Rule of thumb yang Khanza tampak pakai:**
- **Split** kalau dua variants punya **field-field berbeda** atau **workflow yang punya invariant berbeda**
- **Unify** kalau dua variants share **same shape + same workflow**, dengan discriminator column untuk filter

Trade-off:
- ✅ Split: schema lebih clean per-variant, easier untuk add variant-specific field
- ❌ Split: query "all activities" jadi UNION antar variants
- ✅ Unify: single query untuk roll-up, mudah aggregate
- ❌ Unify: shape harus accommodate semua variants, potential null-fields jadi banyak

---

### 2.5 H2.5 — Single no_rkm_medis as Authoritative Identity

#### Status: **CONFIRMED** ✅

#### Evidence Summary

Validasi terhadap tabel `pasien` dan pencarian schema-wide:

**Struktur pasien:**
- PK tunggal: `no_rkm_medis` VARCHAR(15)
- External identifiers tersimpan sebagai **attributes biasa**: `no_ktp` VARCHAR(20), `no_peserta` VARCHAR(25) untuk BPJS
- Demographic + family/PJ (penanggung jawab) fields di tabel yang sama (denormalized)

**Pencarian infrastruktur identity reconciliation (semua negatif):**
- `master_patient_index` / `mpi_*` → **tidak ada**
- `patient_match` / `patient_merge` / `duplicate_pat*` → **tidak ada**
- `identity_link` / `reconciliation_*` → **tidak ada**
- SatuSehat IHS table at schema level → **tidak ada** (IHS logic ada di sub-project `KhanzaHMSServiceSatuSehat`, bukan main schema)

**Tabel `emergency_index` yang muncul dalam pencarian** tampak adalah info kontak darurat, bukan patient identity index (perlu verifikasi Phase 2 lanjutan kalau Owner request).

#### Conceptual Abstraction

**Primitive:** **Single-Source-of-Truth Identity, Externalized Reconciliation**

Pattern: dalam **satu RS installation**, ada **satu** authoritative patient ID (no_rkm_medis). Reconciliation dengan identitas eksternal (KTP, BPJS, NIK, IHS) ditangani **di luar core schema** — sebagai bridging service projects yang punya schema/database terpisah, atau via app-layer lookup.

Konsekuensi konseptual:
- ✅ Core schema simple — no PK complexity, no graph
- ✅ Performance: PK lookup adalah O(1) hash-index
- ❌ **Tidak ada infrastruktur untuk multi-RS patient continuity** — kalau pasien dari RS A datang ke RS B, tidak ada native concept of "same person" cross-installation
- ❌ **No protection terhadap accidental duplicate** di RS yang sama — relying pada UI-level search-before-create pattern (yang akan di-test di Domain 8)

Implikasi untuk SIMRS Batin Tikal: **kalau scalability ke multi-RS** menjadi goal (G5 Karumkit per Blueprint), identity reconciliation **harus** di-design dari awal, **tidak** dapat di-retrofit later seperti yang Khanza alami sekarang.

---

## 3. Cross-Hipotesis Observations

Observasi yang **emerged** dari validasi gabungan 5 hipotesis:

### 3.1 Encounter-Centric Architecture sebagai Meta-Pattern

H2.1 refinement (encounter > trinity) adalah finding paling significant. Implikasi cross-domain:

- **Domain 6 (Inter-Module)** preview: hipotesis H6.1 ("reg_periksa adalah central pivot") sudah strongly indicated. 350 FK references adalah signal kuat.
- **Domain 3 (Konsep)** preview: encounter-centric architecture berkaitan erat dengan H3.2 (status_lanjut state transition di registrasi) — encounter bukan hanya pivot, tapi juga state machine carrier.

### 3.2 Composite PK dengan Temporal Coordinates

Pattern observed dari H2.3 + H2.1:

Banyak tabel detail (terutama tindakan/perawatan) punya composite PK yang menyertakan **(no_rawat, tgl_*, jam_*)** atau variant. Ini bukan accident — ini menunjukkan **Khanza treat each (encounter, datetime) sebagai unit-of-event-identity**, bahkan tanpa eksplisit event sourcing.

Konsep yang muncul: **Temporal-Anchored Event Identity** — pattern dimana event identity di-construct dari (entity, time) composite, bukan dari sequence number atau UUID. Trade-off:
- ✅ Natural: setiap event di "tagged" oleh kapan dan untuk siapa
- ❌ Kalau dua event terjadi pada tgl+jam yang sama untuk encounter yang sama, collision possible (mitigasi via additional discriminator columns seperti `kd_jenis_prw`, `no_bayar`)

### 3.3 Pragmatic Schema Choices Over Architectural Purity

Pattern lintas H2.2 + H2.3 + H2.4:

Khanza secara konsisten **memilih pragmatic over pure**:
- H2.2: meaningful PK (pragmatic for human) over surrogate UUID (pure for system)
- H2.3: dual time model (pragmatic for audit + clinical) over single timestamp (pure normalization)
- H2.4: selective ralan/ranap split (pragmatic per workflow) over universal pattern

Cross-observation ini **mendukung Meta-Hypothesis M1** (Sustainable Accretion Architecture) yang akan di-validate di Phase 3. Khanza tidak menerapkan satu paradigm dogmatis; tetap responsive terhadap kebutuhan domain.

---

## 4. Conceptual Primitives Extracted (untuk Phase 3 Synthesis)

Dari 5 hipotesis Domain 2, **4 primitif utama** muncul yang akan menjadi material untuk final Codex synthesis:

| Primitif | Statement (1 kalimat) | Validity Status |
|---|---|---|
| **P2-A — Encounter-as-Pivot Architecture** | Sistem klinis dapat dirancang dengan encounter (visit) sebagai dominant join anchor, dengan patient identity sebagai master lookup yang loosely-coupled | Confirmed (H2.1 refined) |
| **P2-B — Identifier-as-Domain-Value** | Master entity identifiers dapat dirancang sebagai bagian dari domain language (human-readable, information-bearing), bukan sebagai technical surrogate | Confirmed (H2.2) |
| **P2-C — Bifurcated Temporal Model** | Sistem dapat membedakan secara konseptual antara "human-clock time" (manual input, operational) dan "system time" (auto, audit) — keduanya coexist by design | Confirmed (H2.3 refined) |
| **P2-D — Pragmatic Schema Polymorphism** | Schema split-vs-unify dapat (dan sebaiknya) workflow-driven, bukan pattern-driven — split hanya kalau invariants benar-benar berbeda | Confirmed (H2.4 refined) |

H2.5 (single identity anchor) bukan primitif baru — itu **konsekuensi** dari P2-A (encounter-as-pivot membuat patient identity relatively un-stressed) dan **gap** yang Khanza terima (no multi-RS continuity).

---

## 5. Owner Gate Request

### 5.1 Hasil Sub-Session

**5 hipotesis tested. Distribusi status:**

| Status | Count | Hipotesis |
|---|---|---|
| ✅ Confirmed | 2 | H2.2, H2.5 |
| ⚠️ Refined | 3 | H2.1, H2.3, H2.4 |
| ❌ Falsified | 0 | (tidak ada) |

**Refined statements** untuk H2.1', H2.3', H2.4' sudah di-document di §2 — akan jadi material untuk Codex final.

### 5.2 Boundary Discipline Verification (Brief §4.4)

| Test | Result | Notes |
|---|---|---|
| Findings adalah konsep, bukan code? | ✅ | Semua di §4 sebagai primitif platform-agnostic |
| Platform-agnostic? | ✅ | P2-A through P2-D dapat di-implement di stack apapun |
| Abstract enough (jawab "kenapa")? | ✅ | Setiap primitif punya rationale + trade-off |
| License-clean (no verbatim copy)? | ✅ | Tidak ada CREATE TABLE block di-paste; column names dideskripsikan dalam prosa; counts adalah observasi numerik |
| Relevan untuk SIKESUMA / SIMRS BT? | ✅ | Semua primitif punya implikasi langsung untuk SIMRS BT Phase 2 design (terutama P2-A untuk core architecture, P2-C untuk audit trail design) |

### 5.3 Cross-Project Discipline Check

- ✅ Tidak ada touch terhadap SIKESUMA artifacts
- ✅ Tidak ada cross-reference unilateral ke SIKESUMA pattern di output ini (kontras dengan SIKESUMA akan di-articulate di Phase 3 via N-notes, bukan di domain validation)
- ✅ Owner adalah single source of coordination — output ini untuk Owner review, bukan untuk SIKESUMA AI session

### 5.4 Pertanyaan untuk Owner

1. **Approval status** untuk hasil Domain 2 ini? Confirmed / Refined statements OK untuk carry forward ke Phase 3?

2. **Next domain** — saran saya per §7.2 Phase 1 bundle: **Domain 5 (Modul)** sebagai priority 2 (quick win, sebagian sudah observable dari folder structure). Alternatif: Domain 6 (Inter-Module Dependencies) yang natural continuation karena H2.1 refinement sudah preview H6.1.

3. **Scope per sub-session** — Apakah Owner prefer **satu domain per sub-session** (per pattern saya ikuti sekarang) atau **dua domain ringan per sub-session** kalau workload memungkinkan?

4. **Refinement procedure** — H2.1', H2.3', H2.4' sebagai refined statements: apakah ingin Owner **eksplisit approve** masing-masing, atau cukup approve domain sebagai keseluruhan?

### 5.5 Yang Saya BELUM Sentuh dan Sengaja Defer

- **Source code Java sampling** — Domain 2 fully validatable dari schema (sik.sql). Sampling Java code akan diperlukan untuk Domain 4 (architecture) dan Domain 7 (universal functions). Tidak Phase 2 sub-session 1 work.
- **emergency_index table** — muncul dalam pencarian, kemungkinan emergency contact bukan patient identity. Owner dapat request follow-up clarification kalau relevant.
- **Multi-RS scenario** — H2.5 confirms gap, tapi belum elaborate apa Khanza tampak punya partial workaround (mis. via SatuSehat sub-project). Itu Domain 9 (Workaround) territory.

---

**End of Phase 2 Domain 2 validation. Awaiting Owner gate before proceeding to next domain.**
