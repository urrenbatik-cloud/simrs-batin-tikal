# Demo Script — SIMRS Batin Tikal MVP

**Untuk:** dr Ferry sebagai demo presenter
**Audiens:** Karumkit RS Batin Tikal / Sie Renbang Angga / staf medis-administratif
**URL Demo:** https://simrs-batin-tikal.vercel.app

**Tujuan demo:** Tunjukkan tiga pilar value SIMRS BT v2.0:
1. **Audit attribution** (siapa-apa-kapan) — siap untuk pemeriksaan Itjenad / BPK
2. **Encounter-as-Convergence** — satu titik konvergensi semua data kunjungan (P3-D)
3. **Modern web UX** — buka di browser device manapun, tidak perlu install

---

## Persiapan Pre-Demo (5 menit sebelum stakeholder datang)

1. Buka https://simrs-batin-tikal.vercel.app di laptop / tablet yang akan dipakai demo
2. Login dengan akun dr Ferry → land di `/patients`
3. **Jangan** create patient/encounter dulu — biarkan kosong/minimal supaya audit trail demo terlihat "lahir dari awal"
4. Kalau sudah ada data dari smoke test (RM-2026-00002 Tn Dummy B2) — biarkan, akan ditunjukkan sebagai contoh historis
5. Buka tab kedua (cadangan) — Supabase Dashboard atau /audit page — kalau perlu tunjukkan "raw data" view
6. Cek koneksi internet stabil (Vercel cold start ~3 detik kalau lama tidak diakses)

## Versi Pendek (5 menit) — Untuk Karumkit / Sie Renbang Angga

### Pembukaan (30 detik)
> "Pak, ini SIMRS BT versi 2.0 yang sedang saya bangun internal sebagai proof-of-concept. Sudah live di internet, bisa Pak buka di handphone sendiri sekarang juga — alamatnya `simrs-batin-tikal.vercel.app`. Saya tunjukkan tiga hal yang membedakan ini dari SIMRS vendor."

### Pillar 1: Audit Attribution (1.5 menit)

1. Klik **Pasien Baru** → isi data lengkap (NIK pakai 16 digit angka acak, jenis kelamin, tempat-tanggal lahir)
2. Sebelum Simpan, sebut: "Setiap field yang saya isi sekarang akan dicatat — kapan, oleh siapa."
3. Klik **Simpan** → halaman detail pasien terbuka
4. Scroll ke bawah → **Audit Trail** card → tunjuk row pertama
> "Lihat di sini: tepat detik ini, atas nama saya, operasi INSERT, semua field tercatat. Permanent — tidak bisa diedit, tidak bisa dihapus."
5. Klik **Edit** → ubah nama lengkap → Simpan
6. Kembali ke detail → tunjuk row kedua di audit trail
> "Sekarang ada baris baru. UPDATE, atas nama saya, dan ditampilkan field apa yang berubah. Versi data jadi 2 — kalau dua user edit bersamaan, sistem akan menolak yang kedua sebelum data corrupt. Ini standard yang Itjenad atau BPK butuhkan kalau audit RS."

### Pillar 2: Encounter-as-Convergence (1.5 menit)

1. Klik **Kunjungan Baru** → pilih Rawat Jalan → isi keluhan → Simpan
2. Tunjuk **Nomor Kunjungan** yang otomatis tergenerate
> "Format: tanggal-nomor urut hari ini-jenis kunjungan. `20260514-00001-RJ`. Setiap RS punya counter sendiri. Tahun depan, pertama kali kunjungan rawat jalan tanggal 14 Mei, otomatis `00001`. Tidak ada konflik nomor antar RS kalau nanti deploy multi-RS."
3. Tunjuk status badge "Terbuka" → klik action menu → **Tutup Kunjungan**
> "Status berubah Selesai. Closed-at dan closed-by tercatat. State machine — kunjungan yang sudah Selesai tidak bisa di-edit lagi."
4. Klik nav **Kunjungan** → tunjuk daftar lintas-pasien
> "Ini view per-encounter — bisa filter status, lihat kunjungan hari ini di seluruh RS. Encounter ini akan jadi titik penyatuan untuk modul lab, resep, billing nanti. Satu kunjungan = satu konvergensi semua data klinis."

### Pillar 3: Modern Web UX + Multi-RS Ready (1 menit)

1. Klik nav **Audit Log** → tunjuk filter Tabel + Operasi + click-through ke pasien
> "Semua perubahan di sistem, lintas tabel, lintas pasien, queryable. Filter pakai tabel, operasi, atau jenis. Click row → loncat ke pasien terkait. Ini yang vendor SIMRS umumnya hanya simpan timestamp — tidak siapa yang ubah."
2. Tutup demo:
> "Pak, semua ini build internal — kami bisa kontrol roadmap, tambah modul sesuai prioritas. Multi-RS sudah disiapkan di schema — kalau Kakesdam mau Batin Tikal jadi pilot, satu statement SQL aktifkan RS lain. Pertanyaan?"

### Total: ~5 menit. Pertanyaan/diskusi setelahnya tidak dihitung.

---

## Versi Lebih Panjang (15 menit) — Untuk audience teknis atau diskusi mendalam

Ikuti versi pendek 1-3, lalu tambah:

### Tambahan Pillar 1: Optimistic Locking + Soft Delete (3 menit)

- Tunjukkan **Versi Data** counter
- Demo soft-delete pasien → tunjuk masih ada di DB (deleted_at populated, tidak ditampilkan di list)
- Cerita: "Soft delete = data tetap ada untuk audit, hanya hilang dari UI normal user. Restore = clear `deleted_at`. Itjenad bisa minta lihat 'pasien yang pernah ada tapi sudah dihapus' — datanya tetap ada."

### Tambahan Pillar 2: Health Endpoints (3 menit) — kalau audiens punya background teknis

- Buka `/api/health` di tab → tunjuk JSON response
- Cerita: "Endpoint health check terisolasi — bisa pakai untuk smoke test deploy, monitoring uptime, debug tanpa harus baca log Vercel. Kalau ada bug di production, kita bisa probe service layer langsung dari URL."

### Tambahan Pillar 3: Arsitektur (3 menit)

Kalau audiens technical-curious:
- Buka README di GitHub → tunjuk schema diagram (mental, bukan visual): RS → Users → Patient → Encounter
- "Encounter adalah pivot. Modul masa depan (lab, resep, billing) akan FK ke encounter, bukan ke pasien langsung. Implikasinya: satu pasien dengan tiga kunjungan = tiga konteks billing independen, tidak akan tercampur."
- Tunjuk Audit Log: "ini infrastructure-level — append-only, tidak ada UPDATE/DELETE policy di trigger DB. Kalau ada SQL injection sekalipun pun, audit log tidak bisa dimodifikasi."

### Q&A Anticipated Questions

**Q: "Apa bedanya dengan Khanza atau SIMRS vendor lain?"**
A: "Khanza dibangun di Java desktop (Swing) tahun ~2005-an. UI-nya zaman lama, butuh install di setiap komputer, audit hanya timestamp tanpa attribution lengkap. SIMRS BT v2 = web-based modern (akses HP/tablet/laptop sama saja), audit lengkap siapa-kapan-apa, dan kita yang ngontrol roadmap — bukan vendor."

**Q: "Kalau internet mati, gimana?"**
A: "Phase 2.1 ini cloud-first. Phase 2.2 sudah ada di roadmap: offline-first dengan sync ke cloud saat online. Untuk kondisi RS Tk.IV yang internetnya kadang turun, ini critical — tapi MVP dulu, baru offline."

**Q: "Berapa biaya servernya?"**
A: "Sekarang masih di tier gratis Supabase + Vercel. Untuk RS Tk.IV traffic, bahkan tier gratis cukup beberapa bulan. Kalau scaling ke multi-RS atau traffic naik, biaya cloud bertingkat — estimasi awal Rp 200-500 ribu/bulan per RS untuk skala saat ini. Compare dengan biaya lisensi SIMRS vendor: bisa puluhan juta sekali bayar plus maintenance."

**Q: "Bagaimana keamanan data pasien?"**
A: "Schema sudah include Row-Level Security policy untuk multi-RS. Saat ini single-RS jadi disabled, tapi satu statement SQL aktifkan. Authentication via Supabase Auth (industry-standard JWT). Service role key tidak pernah masuk client — hanya server-side. Audit trail append-only — kalau ada breach, kita tahu siapa yang akses apa."

**Q: "Kapan bisa dipakai produksi?"**
A: "MVP sekarang sudah demoable. Untuk produksi sungguhan butuh: (1) modul billing dasar, (2) integrasi BPJS, (3) offline mode, (4) test coverage lebih lengkap. Estimasi 3-6 bulan tergantung prioritas Karumkit."

**Q: "Kalau dr Ferry pindah/tidak ada lagi?"**
A: "Code di GitHub, terdokumentasi penuh — siapapun developer atau AI session bisa pickup dari `CHECKPOINT-LOG.md`. Schema bahasa Indonesia, business logic terpisah dari UI (service layer pattern), test coverage 61 unit + smoke tests. Bukan single-point-of-failure."

## Catatan untuk dr Ferry

- **Jangan over-promise.** MVP = Patient + Encounter. Lab/resep/billing belum ada. Sebut sebagai "roadmap Phase 2.2+".
- **Highlight TNI AD audit angle.** Itjenad audit periodic — kalau SIMRS audit-grade, kerjaan staf jauh lebih ringan.
- **Tekankan internal capability.** Kita yang build = kita yang kontrol harga, prioritas, exit-strategy. Vendor lock-in adalah resiko nyata.
- **Berani bilang "tidak tahu".** Kalau Karumkit tanya hal teknis di luar scope, OK bilang "Akan saya tindaklanjuti di session implementasi berikutnya."

---

*Disiapkan Session 2 — 14 Mei 2026. Revisi bebas saat practice run.*
