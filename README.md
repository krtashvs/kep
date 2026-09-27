# KETUM ALERT — Rizz Academy

Website tribute single-page untuk **Bang Kep**, Ketum channel `#💸・daget` di server Rizz Academy.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide · dark mode only · mobile first.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
npm run typecheck
```

Set `NEXT_PUBLIC_SITE_URL` saat deploy supaya URL gambar Open Graph benar (di Vercel otomatis memakai `VERCEL_URL`).

## Alur scene

| # | Scene | Isi |
|---|-------|-----|
| 0 | Opening | Rizz Academy → Channel Daget → Status: Active → alarm KEP ALERT fullscreen → **MASUK** |
| 1 | Hero | Avatar, kartu profil (kep / kep488 / Ketum / trait), counter 69 & 20 |
| 2 | Laporan Kejadian | Dashboard monitoring, timeline INFO → ALERT yang muncul saat di-scroll |
| 3 | QR Panic Mode | `KEP IS TYPING...` → `jejerin` → hujan QR dummy (canvas) + spam chat |
| 4 | Atlet Simulator | Pilih A–D, hasil acak: offline / dilihat / +1 Aura / rare ending 5% |
| 5 | Hall of Respect | MASTER · SOPHOMORE · NICEGANG + tiga kutipan |
| 6 | Ending | WWWW… memenuhi layar lalu menghilang |

## Struktur

```
src/
  app/                    layout, page, globals.css (token warna dari avatar), icon
  components/
    opening/              OpeningSequence
    scenes/               satu file per scene
    eggs/                 overlay easter egg (vault, alert, toast, drawer, dll.)
    providers/            ExperienceProvider (opening), EasterEggProvider (achievement, aura, vault)
    ui/                   komponen reusable (KepAvatar, TiltCard, CountUp, QrRainCanvas, ...)
  hooks/                  useKeySequences, useRapidTaps, useBodyLock
  lib/                    content.ts (semua copy), achievements.ts, assets.ts, storage.ts
public/assets/            avatar, GIF KEP ALERT, poster, aset rahasia
```

Semua teks ada di `src/lib/content.ts`, jadi copy bisa diubah tanpa menyentuh komponen.
Progres achievement dan aura disimpan di `localStorage` (aman jika storage diblokir).

## Easter egg

Spoiler — jangan dibuka kalau mau cari sendiri.

<details>
<summary>Daftar lengkap</summary>

1. Klik avatar di Hero → `cek`
2. Klik avatar 5× cepat → `jejerin`
3. Klik avatar 10× cepat → KEP ALERT diputar ulang
4. Ketik `cek` → Bang Kep membalas
5. Ketik `jejerin` → hujan QR seluruh halaman (atau tap kata "jejerin" di QR Panic)
6. Ketik `www` → W
7. Ketik `alert` → KEP ALERT
8. Konami code (↑↑↓↓←→←→BA) → Aura Farmer (+10 aura)
9. Klik angka **69** → `nice.`
10. Tap header `#💸・daget` 3× → pesan rahasia channel
11. Pindah tab → judul tab jadi `🚨 KEP ALERT`, kembali → `cek`
12. Diam 45 detik → Bang Kep "membaca" pesanmu
13. Coba keempat pilihan simulator → Atlet Serba Bisa
14. Kumpulkan 5 aura → Aura Maxxing
15. Titik samar setelah ending → Sampai Akhir
16. Buka console browser
17. Ikon trofi muncul di header setelah achievement pertama, berisi daftar yang sudah ditemukan

**Brankas rahasia (QRIS):** muncul hanya lewat *rare ending* Atlet Simulator — peluang 5% di setiap pilihan, atau dijamin jika memilih **D. Tampil** tiga kali berturut-turut. Setelah terbuka, bisa dibuka lagi dari daftar achievement.

**Tanda tangan:** watermark super tipis di pojok kiri bawah; klik untuk memunculkannya selama 1 detik.

</details>
