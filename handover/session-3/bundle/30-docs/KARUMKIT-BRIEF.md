# SIMRS Batin Tikal v2.0 — Brief untuk Karumkit

**Status:** Proof-of-Concept Demo-Ready · Phase 2.1 MVP
**URL:** https://simrs-batin-tikal.vercel.app
**Disusun:** dr Ferry · 14 Mei 2026

---

## Apa Ini?

**Sistem Informasi Manajemen Rumah Sakit (SIMRS)** dibangun internal RS Tk.IV 02.07.03 Batin Tikal sebagai bukti kemampuan TNI AD membangun teknologi medis berbasis cloud — tanpa ketergantungan vendor eksternal.

Modul yang sudah jalan: **Registrasi Pasien + Hub Kunjungan (Encounter)** dengan audit trail lengkap setiap perubahan data.

## Tiga Pembeda Utama

### 1. Akuntabilitas Audit Itjenad / BPK

Setiap perubahan data tercatat permanen: **siapa** yang mengubah, **kapan**, dan **field apa yang berubah**.

Tidak hanya timestamp seperti SIMRS umumnya — termasuk identitas user yang melakukan perubahan, versi data, dan diff sebelum/sesudah. Audit log **append-only** (tidak bisa di-edit atau dihapus, dijamin di level database).

Kapan berguna: pemeriksaan periodik Itjenad RS, audit BPK keuangan, sengketa rekam medis, dispute klaim BPJS.

### 2. Web Modern — Tanpa Install di Tiap Komputer

Akses dari browser apa saja: laptop staf, tablet ruang perawat, smartphone direksi. Tidak ada lagi "komputer khusus SIMRS yang harus di-update manual".

Server berjalan di cloud (Supabase + Vercel) — uptime 99%+ dijamin oleh penyedia infrastruktur global.

### 3. Multi-RS Ready — Schema Disiapkan Lintas-Rumkit

Arsitektur data sudah include kolom `rs_id` di setiap tabel operasional. Aktivasi Row-Level Security cukup **satu pernyataan SQL** kalau Karumkit/Kakesdam memutuskan extend ke RS lain di lingkungan Kesdam II/Sriwijaya.

Implikasi: kalau model ini dianggap berhasil di Batin Tikal, replikasi ke RS Tk.IV lain butuh waktu hari, bukan bulan.

## Yang Sudah Bisa Didemonstrasikan Hari Ini

| Kapabilitas | Status |
|---|---|
| Registrasi pasien (Nomor RM, NIK 16-digit, demografi lengkap) | ✅ Live |
| Edit pasien + audit trail per perubahan | ✅ Live |
| Buat kunjungan (Rawat Jalan / Inap / IGD / Observasi) | ✅ Live |
| Tutup kunjungan dengan state machine guard | ✅ Live |
| Daftar kunjungan lintas-pasien dengan filter status | ✅ Live |
| Universal audit log viewer (lintas tabel) | ✅ Live |
| Authentication user (email + password) | ✅ Live |

## Yang Direncanakan (Phase 2.2 dan Setelahnya)

| Modul | Estimasi |
|---|---|
| Modul Laboratorium (terhubung ke kunjungan) | 1-2 bulan |
| Modul Resep + Farmasi | 1-2 bulan |
| Modul Billing + Integrasi BPJS | 2-3 bulan |
| Offline mode (sync saat online) | 2-3 bulan |
| Print rekam medis + laporan operasional | 1 bulan |

Catatan: estimasi paralel — bisa diprioritaskan sesuai arahan Karumkit.

## Risiko vs SIMRS Vendor

| Aspek | SIMRS BT v2.0 (internal) | SIMRS Vendor |
|---|---|---|
| Biaya lisensi | Tidak ada | Puluhan juta sekali + maintenance tahunan |
| Roadmap | Kita yang tentukan | Tergantung vendor |
| Audit attribution | Lengkap by-design | Umumnya hanya timestamp |
| Akses multi-device | Browser saja | Install per komputer |
| Vendor lock-in | Tidak ada (open source di GitHub) | Tinggi |
| Risiko vendor tutup | Tidak ada | Real (data jadi orphan) |
| Customization | Bebas | Per kebutuhan, sering ekstra biaya |
| Maturity | MVP, perlu Phase 2.2+ | Battle-tested (positif) |

**Kesimpulan jujur:** vendor SIMRS lebih mature untuk produksi besar hari ini. Tapi kalau roadmap multi-tahun, kepemilikan teknologi internal jauh lebih menguntungkan untuk skala TNI AD.

## Biaya Operasional Saat Ini

- Cloud hosting (Supabase + Vercel free tier): **Rp 0/bulan** untuk traffic RS Tk.IV
- Estimasi scaling ke 10 RS aktif: **~Rp 500.000 – 1.500.000/bulan total** (bukan per RS)
- Tidak ada biaya lisensi software / per-user

## Permintaan Karumkit

1. **Izin lanjut development** Phase 2.2 (lab + resep + billing) — estimasi 4-6 bulan
2. **Acknowledgment** sebagai project resmi unit RS Batin Tikal — untuk akses formal ke data master operasional (nama dokter aktif, daftar tindakan, dll)
3. **Pertimbangan demo** ke Kakesdam II/Sriwijaya kalau Karumkit yakin dengan arah — sebagai pilot multi-RS Kesdam

## Yang Tidak Diminta

- Anggaran investasi besar (cloud hosting masih gratis untuk skala saat ini)
- Pengurangan kerja staf existing (Khanza/SIMRS lama tetap jalan paralel sampai migrasi feature parity)
- Komitmen vendor lock-in TNI AD

## Kontak Tindak Lanjut

**dr Ferry** · RS Tk.IV 02.07.03 Batin Tikal · Pangkal Pinang
*Demo live dapat dilakukan kapan saja Karumkit/Sie Renbang Angga punya 15 menit.*

---

*Dokumen ini dibuat sebagai handout pendamping demo. Detail teknis dan roadmap tersedia di repository: [github.com/urrenbatik-cloud/simrs-batin-tikal](https://github.com/urrenbatik-cloud/simrs-batin-tikal)*
