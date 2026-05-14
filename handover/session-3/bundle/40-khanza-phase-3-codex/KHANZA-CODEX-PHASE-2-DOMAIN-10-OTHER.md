# The Khanza Codex — Phase 2 Domain 10 Validation
## Other Findings (Catchall)

**File:** `KHANZA-CODEX-PHASE-2-DOMAIN-10-OTHER.md`
**Versi:** 1.0
**Tanggal:** 13 Mei 2026
**Phase:** 2 (Targeted Data Collection) — sub-session 8 / 8 (FINAL)
**Domain:** 10 — Other / Catchall
**Status:** Awaiting Owner gate — last domain before Phase 2 closeout
**Parent input:** `KHANZA-CODEX-PHASE-1-HYPOTHESES.md` v1.0 §4.10
**Author:** Khanza spoke session AI (Phase 2 sub-session 8)
**Validation method:** Targeted catchall validations — most H10.x substantially pre-validated; this sub-session captures remaining net-new findings

**Domain character:** Lightweight catchall — captures findings yang don't fit cleanly ke domains 1-9. Layer 1 tagging applied.

---

## 1. Hipotesis yang Di-test

| ID | Statement (singkat) |
|---|---|
| **H10.1** | Schema dalam Bahasa Indonesia (identifier language fidelity) |
| **H10.2** | Multi-tenancy via deployment isolation (no row-level tenant) |
| **H10.3** | Khanza encourage single-RS deployment |
| **H10.4** | Backup strategy admin-driven (no automated framework) |
| **H10.5** | Sub-project versioning reflects BPJS API churn |
| **H10.6** | SatuSehat integration via separate sub-project |

---

## 2. Per-Hipotesis Validation

### 2.1 H10.1 — Indonesian Schema

**Status: ✅ CONFIRMED**

- Common Indonesian column patterns: **902 instances** (`no_rkm_medis`, `kd_dokter`, `nm_pasien`, `jns_perawatan`, `tgl_periksa`, `jam_periksa`, `stts`, `biaya`, `harga`)
- Table names Indonesian: `pasien`, `dokter`, `kamar`, `obat_racikan`, `petugas`, `kasir`, etc.

**Primitive P10-A — Indonesian Domain Language Fidelity**
**Tag: `[TIMELESS]`** (for Indonesian RS context)

Pattern: Schema identifiers di domain language (Indonesian) reduce **operator cognitive translation cost** dan match operator vocabulary. "Pasien" lebih clear dari "patient" untuk petugas Indonesian RS.

**Trade-off:**
- ✅ Operator clarity — schema reads like domain
- ✅ Documentation reduction — names are self-descriptive
- ⚠️ International integration friction — FHIR/SatuSehat uses English; Khanza later added `id_*` columns dengan English (per P9-B)
- ⚠️ Internationalization blocked — schema rename costly

**Modernization untuk SIMRS BT:**
- ✅ Adopt — schema dalam Bahasa Indonesia untuk Indonesian RS context
- ⚖️ **Hybrid approach untuk FHIR/SatuSehat bridge:** view layer atau adapter pattern menyajikan English aliases untuk international protocols
- ⚠️ Avoid Khanza's anti-pattern (P9-B): keep ONE convention, don't accumulate epochs

---

### 2.2 H10.2 — Multi-Tenancy Absent

**Status: ⚠️ REFINED**

**Tenant/organization column search:**
- 1 column found: `kode_rs varchar(5) NOT NULL`
- Investigation: kolom ini bukan tenant infrastructure — adalah **regulatory metadata** (RS code untuk include di BPJS/SIRS-Online submissions; identifies the RS to external regulators)
- Tidak ada FK across tables ke kode_rs; tidak ada tenant scoping pattern

**True multi-tenancy infrastructure: ABSENT.** Khanza adalah single-tenant single-RS schema. Each install = own database = own RS data.

**Primitive P10-B — Single-Tenant Schema Design**
**Tag: `[ERA-2010-LAN]`** + `[ANTI-PRIMITIVE]` (untuk multi-RS context like SIMRS BT G5 vision)

Pattern: Schema dirancang dengan asumsi **single RS per database**. No row-level tenant scoping. Multi-RS support hanya via **deployment isolation** (separate database per RS).

**Trade-off:**
- ✅ Schema simpler — no tenant_id everywhere
- ✅ Query simpler — no tenant filter needed
- ✅ Performance — no tenant index overhead
- ❌ **Multi-RS scaling impossible** — each RS = own MySQL server = own ops burden
- ❌ **Cross-RS reporting impossible** — aggregating data across RS requires manual export+merge
- ❌ **Doesn't fit cloud SaaS model** — modern multi-tenant pattern requires schema design from start

**Why ANTI-PRIMITIVE untuk SIMRS BT:**
- G5 Karumkit vision includes potential multi-RS replicate
- Modern Supabase deployment naturally supports multi-tenant via RLS
- Retrofit ke multi-tenant after-the-fact extremely expensive

**Modernization untuk SIMRS BT:**
- ✅ Include `kode_rs` atau `kode_satker` (TNI AD: satuan kerja) sebagai FK column **across all operational tables** dari V1
- ✅ Supabase RLS rules untuk tenant isolation
- ✅ Even kalau initial deploy single-RS (Batin Tikal), schema prepared untuk multi-RS

---

### 2.3 H10.3 — Single-RS Deployment Pattern

**Status: ✅ CONFIRMED via H10.2**

Single-RS deployment pattern adalah konsekuensi langsung dari single-tenant schema (P10-B). Khanza implies single-RS adoption strategy:
- `setting/database.xml` — single hardcoded DB connection
- No multi-tenant routing infrastructure
- Each RS install = own complete Khanza stack

**No new primitive** — directly subsumed by P10-B.

---

### 2.4 H10.4 — Admin-Driven Backup/Restore

**Status: ✅ CONFIRMED**

**Restore infrastructure dalam app:**
- `src/restore/` package with **18 Java files**
- Sample: `DlgRestoreDokter`, `DlgRestoreKamar`, `DlgRestoreObat`, `DlgRestoreTarifRalan`, `DlgRestoreTarifRadiologi`, etc.

**Pattern:** Per-table manual restore dialogs. Tidak ada unified backup/restore framework. Admin RS bertanggung jawab:
- Eksternal: mysqldump untuk full DB backup (operational discipline)
- Internal: manual restore via per-table Swing dialogs untuk recovery operasional spesifik

**Primitive P10-C — Per-Table Manual Restore Dialogs**
**Tag: `[REQUIRES-CONTEXT]`** + `[ANTI-PRIMITIVE]` Nuanced

Pattern: Backup/restore adalah **operator+admin responsibility**, bukan framework. Application provides per-table restore tools tapi tidak unified backup automation atau scheduled snapshot.

**Trade-off:**
- ✅ Granular control — admin dapat restore specific table tanpa affect lainnya
- ✅ No additional infrastructure overhead
- ❌ **No automated backup** — relies on admin discipline (mysqldump cron)
- ❌ **No point-in-time recovery** native — operator must restore from external dumps
- ❌ **Manual per-table** — coordination across related tables (FK dependencies) is admin burden
- ❌ **No audit untuk restore actions** — consistent dengan P7-E

**Why ANTI-PRIMITIVE Nuanced:**
- Acceptable untuk small RS dengan dedicated admin
- Insufficient untuk modern operational expectations
- TNI AD context: data loss recovery harus systematic dan auditable

**Modernization untuk SIMRS BT:**
- ✅ Supabase point-in-time recovery (PITR) sebagai infrastructure baseline
- ✅ Automated daily backups dengan retention policy
- ✅ Audit log untuk restore operations
- ⚖️ **Optional per-table restore UI** untuk specific operational recovery (e.g., revert price master change)

---

### 2.5 H10.5 — Sub-Project Versioning shows BPJS API Churn

**Status: ✅✅ STRONGLY CONFIRMED**

**Sub-project inventory (14 total):**

```
KhanzaHMSAnjungan                  — Kiosk anjungan
KhanzaHMSAnjunganFingerPrint       — Anjungan dengan fingerprint
KhanzaHMSAutoVerify                — Auto-verification (gen 1)
KhanzaHMSAutoVerify2               — Auto-verification (gen 2 — accretion!)
KhanzaHMSResume                    — Patient resume
KhanzaHMSServiceAplicare           — BPJS Aplicare (referral)
KhanzaHMSServiceMandiri            — Bank Mandiri integration
KhanzaHMSServiceMobileJKN          — Mobile JKN (gen 1)
KhanzaHMSServiceMobileJKNERM       — Mobile JKN ERM variant (gen 2)
KhanzaHMSServiceMobileJKNFKTP      — Mobile JKN FKTP variant (gen 3)
KhanzaHMSServiceSatuSehat          — SatuSehat (Kemenkes FHIR)
... (additional sub-projects)
```

**Pattern observation:** MobileJKN integration evolved through **3 distinct generations** preserved as separate sub-projects. AutoVerify also has gen 1 + gen 2. Direct evidence:
1. External regulator API churn (BPJS) is real and frequent
2. Khanza response: **add new sub-project, don't refactor old** — consistent dengan P1-D Accretion
3. Operator dapat run multiple generations concurrent (different RS use different versions)

**No new primitive** — pattern subsumed by P1-D (Accretion) dan P9-A (Bridging Module Heterogeneity).

---

### 2.6 H10.6 — SatuSehat via Separate Sub-Project

**Status: ✅ CONFIRMED via Domain 4**

`KhanzaHMSServiceSatuSehat` exists sebagai dedicated sub-project. Already validated Domain 4 P4-B (Satellite Integration Apps). SatuSehat (Kemenkes FHIR-based national health platform) integration is HTTP client + DB-direct pattern.

**No new primitive** — directly subsumed by P4-B.

---

## 3. Conceptual Primitives Extracted

| Primitif | Statement | Tag |
|---|---|---|
| **P10-A** | Indonesian Domain Language Fidelity | `[TIMELESS]` (untuk Indonesian RS context) |
| **P10-B** | Single-Tenant Schema Design | `[ERA-2010-LAN]` + `[ANTI-PRIMITIVE]` (untuk multi-RS context) |
| **P10-C** | Per-Table Manual Restore Dialogs | `[REQUIRES-CONTEXT]` + `[ANTI-PRIMITIVE]` Nuanced |

**Tag distribution Domain 10:**

| Tag | Count |
|---|---|
| `[TIMELESS]` | 1 (P10-A) |
| `[REQUIRES-CONTEXT]` | 1 (P10-C) |
| `[ERA-2010-LAN]` | 1 (P10-B) |
| `[ANTI-PRIMITIVE]` | 2 (P10-B Critical-for-multi-RS, P10-C Nuanced) |

H10.3, H10.5, H10.6 confirmed via cross-reference — no new primitives.

---

## 4. Owner Gate Request

### 4.1 Hasil Sub-Session 8 (Domain 10 — FINAL Phase 2)

**6 hipotesis tested. Distribusi:**

| Status | Count |
|---|---|
| ✅ Confirmed | 3 (H10.1, H10.3, H10.4) |
| ✅✅ Strongly Confirmed | 1 (H10.5) |
| ✅ Confirmed via cross-reference | 1 (H10.6) |
| ⚠️ Refined | 1 (H10.2 — `kode_rs` exists as regulatory metadata, not tenant infrastructure) |
| ❌ Falsified | 0 |

### 4.2 New Anti-Primitives

- **P10-B Single-Tenant Schema Design** — 🟠 High severity (multi-RS blocker untuk G5 vision)
- **P10-C Per-Table Manual Restore Dialogs** — 🟡 Nuanced severity

Combined with Owner-approved **P8-D escalation to 🔴 Critical**, updated count:

### 4.3 Phase 2 Final Anti-Primitive Inventory

| Severity | Count | IDs |
|---|---|---|
| 🔴 **Critical** | **5** | P7-E, P4-D, P6-B, P7-D, **P8-D** (escalated per Owner direction) |
| 🟠 **High** | **5** | P4-C, P7-A, P7-F, P9-B, **P10-B** (new) |
| 🟡 **Nuanced** | **2** | P5-B, **P10-C** (new) |
| **TOTAL** | **12** | |

### 4.4 Phase 2 Complete

**ALL 10 DOMAINS VALIDATED.** Sub-session 8 closes Phase 2 data collection.

Phase 2 final stats (preview of closeout summary):
- **53 hypotheses tested** (full Phase 1 set)
- **45 primitives extracted** (42 + P10-A + P10-B + P10-C)
- **12 anti-primitives** identified
- **2 falsifications** (H6.2, H7.5)

### 4.5 Boundary Discipline Verification

| Test | Result |
|---|---|
| License-clean? | ✅ Counts, file names, schema column patterns; no code/SQL copy |
| Conceptual primitives? | ✅ P10-A, P10-B, P10-C at concept level |
| Platform-agnostic? | ✅ |
| Relevant untuk SIMRS BT? | ✅ Especially P10-B (multi-RS prep) and P10-A (Indonesian schema strategy) |

### 4.6 Next Step

Per Owner direction (sub-session 7 entry): **Dedicated Phase 2 Closeout Summary** akan di-produce setelah Domain 10 approval. Closeout akan:
- Consolidate all 45 primitives dengan final Layer 1 tagging
- Final anti-primitive registry (12 total)
- Expanded Critical Recommendations untuk Blueprint (per Owner direction §11.4 sub-session 7)
- Phase 3 entry checklist

---

**End of Phase 2 Domain 10 validation. ALL 10 DOMAINS COMPLETE. Awaiting Owner approval before producing Phase 2 Closeout Summary.**
