# Local Dev Setup — `vercel dev`

**Untuk:** Owner dr Ferry
**Tujuan:** Mempercepat debug cycle dari ~10 menit/iterasi (push → tunggu Vercel deploy → test) menjadi ~30 detik/iterasi (save → reload localhost).

**Konteks:** Selama Session 1, ada 5 bug runtime (SSL, hostname pooler, `SET LOCAL` parameterization, `export type` re-export, dll) yang tidak ketangkap `npx next build` lokal tapi gagal di Vercel production. Tanpa local prod-parity, setiap fix butuh push + tunggu deploy. `vercel dev` menjalankan environment yang persis sama dengan production di mesin lokal — bug yang sama akan muncul lebih cepat.

---

## Prasyarat

- Node.js 22+ (sudah ada — sama versi yang Vercel pakai)
- Akses ke akun Vercel yang sama dengan project `simrs-batin-tikal`
- Repo sudah di-clone di mesin lokal

## Langkah Setup (sekali saja, ~5 menit)

### 1. Install Vercel CLI global

```bash
npm i -g vercel
vercel --version
# Expected: 32.x.x or newer
```

### 2. Login ke Vercel

```bash
vercel login
# Pilih GitHub. Browser akan terbuka untuk auth. Setelah selesai, kembali ke terminal.
```

Verifikasi:
```bash
vercel whoami
# Expected: urrenbatik-cloud (atau username Vercel Owner)
```

### 3. Link folder lokal ke project Vercel

```bash
cd ~/path/to/simrs-bt   # ganti dengan path repo Owner
vercel link
```

Akan muncul prompt:
- "Set up X?" → **Y**
- "Which scope?" → pilih akun urrenbatik-cloud's team
- "Link to existing project?" → **Y**
- "What's the name?" → ketik `simrs-batin-tikal`

Setelah selesai, akan ada folder `.vercel/` baru (sudah di-`.gitignore`, aman).

### 4. Pull environment variables dari Vercel

```bash
vercel env pull .env.local
# Akan menulis 4 env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL) ke .env.local
```

⚠️ **Jangan commit `.env.local`** — sudah di `.gitignore` (entry `.env*`).

Verifikasi:
```bash
cat .env.local | grep -E "^[A-Z_]+=" | wc -l
# Expected: 4 lines
```

### 5. Jalankan local dev

```bash
vercel dev
```

Output:
```
> Ready! Available at http://localhost:3000
```

Buka `http://localhost:3000` di browser. Aplikasi akan jalan **persis seperti production** — Server Actions, middleware, env vars, Supabase connection, semuanya match.

## Alur Iterasi Setelah Setup

```
Edit kode → Save → vercel dev auto-rebuild (~5-10 detik) → reload localhost → uji
                                                                ↓
                                              Kalau OK → commit + push (deploy ke Vercel)
                                              Kalau gagal → lihat terminal error → fix → ulangi
```

vs. tanpa `vercel dev`:
```
Edit kode → Save → commit → push → tunggu Vercel deploy (~2-3 menit) → test → kalau gagal ulang
```

## Troubleshooting

### `vercel dev` minta login walau sudah `vercel login`

Coba: `vercel logout && vercel login` lalu re-link.

### `vercel env pull` keluar empty / hanya 1-2 vars

Cek di Vercel Dashboard → Settings → Environment Variables. Pastikan semua 4 vars ada di scope "Production" + "Preview" + "Development".

Kalau hanya production, set juga ke Development scope, lalu pull lagi.

### `vercel dev` error: "DATABASE_URL not set"

Lihat output `cat .env.local`. Kalau kosong, ulangi step 4.

### Build berhasil tapi `/login` 500 error

Ini biasanya middleware atau route module error. Lihat **output terminal `vercel dev`** — error stack akan muncul di sana langsung, tidak perlu Vercel Logs UI. Inilah kelebihan utama `vercel dev` vs production debugging.

### Conflict port 3000 (Next.js project lain aktif)

```bash
vercel dev --listen 3001
# Lalu buka http://localhost:3001
```

## Catatan Keamanan

- `.env.local` berisi `SUPABASE_SERVICE_ROLE_KEY` + `DATABASE_URL` (kredential admin-level).
- File ini **HANYA di mesin lokal**, tidak boleh share, tidak akan ter-push (gitignored).
- Kalau laptop hilang/dipinjam: rotate via Supabase Dashboard → Settings → Database → Reset DB Password + Project Settings → API → Regenerate service_role key.

## Untuk AI Session Berikutnya

Setelah Owner setup `vercel dev` lokal, AI session bisa request:
- "Bisa Owner jalankan lokal lalu kirim error stack kalau ada?" → 30 detik feedback loop
- Mengurangi kebutuhan AI baca Vercel function logs (P4 di Session 1 EXIT) untuk bug runtime ringan.

Tapi P4 (Vercel API token akses logs) tetap berguna untuk:
- Bug yang hanya muncul di production env (rare)
- Audit historis (Owner sudah deploy, AI investigasi belakangan)

---

*Disiapkan Session 2 — 14 Mei 2026.*
