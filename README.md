# MLBB Shop: Diamond & BP

Backend Express 5 + TypeScript + Prisma 7 + Neon, mengikuti **Modul 4 Pemrograman Web 2026**.

## Pembagian Tugas

| Orang | Bagian | File milik sendiri |
| --- | --- | --- |
| **A** | Schema, seed, middleware, `/health` (pegang dan jelaskan saat demo), **Fitur 6 Beli Hero**, **Fitur 7 Statistik** | `prisma/seed.ts`, `purchaseController.ts`, `purchase.routes.ts`, `statisticController.ts`, `statistic.routes.ts` |
| **B** | **Fitur 2 Hero**, **Fitur 3 Skin** | `heroController.ts`, `hero.routes.ts`, `skinController.ts`, `skin.routes.ts` |
| **C** | **Fitur 4 Player**, **Fitur 5 Top Up & Match** | `playerController.ts`, `player.routes.ts` |

**Aturan supaya tidak konflik:**
- **Hanya ubah file milik sendiri.** File di `src/config`, `src/utils`, `src/middlewares`, `src/index.ts`, `src/routes/index.ts`, dan `prisma/schema.prisma` adalah file kontrak bersama, jangan diubah tanpa sepakat bersama.
- Kerjakan di branch sendiri (`orang-a`, `orang-b`, `orang-c`), lalu merge ke `main`.
- Setiap controller sudah berisi **checklist TODO** sesuai urutan pemeriksaan di soal. Hapus baris `throw new HttpError(501, ...)` setelah fungsi selesai.

## Setup (semua anggota)

1. Clone repo, lalu `npm install`
2. Buat project Neon **masing-masing** untuk development (free plan cukup), salin `.env.example` menjadi `.env`, isi dua connection string
3. Taruh `heroes.json` dan `skins.json` di folder `data/`
4. Buat tabel:
   - **Orang A**: `npx prisma migrate dev --name init` lalu **commit folder `prisma/migrations`**
   - **Orang B dan C** (database dev sendiri): `npx prisma db push`, jangan commit migrasi apa pun
5. `npx prisma generate`
6. `npx tsx prisma/seed.ts`, cek di `npx prisma studio`: 133 hero, 892 skin, 3 player
7. `npm run dev`, buka `http://localhost:3000/health`

> Setelah merge final, semua anggota memakai database Neon milik A. Jalankan seed ulang sebelum demo.

## Perintah

| Tujuan | Perintah |
| --- | --- |
| Jalankan server | `npm run dev` |
| Cek tipe | `npm run typecheck` |
| Seed ulang | `npx tsx prisma/seed.ts` |
| Lihat database | `npx prisma studio` |
