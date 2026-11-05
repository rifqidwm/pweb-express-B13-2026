# MLBB Shop: Diamond & BP

Backend Express MLBB Shop untuk **Penugasan Modul 4 Pemrograman Web 2026**, kelompok **B13**.

## Anggota Kelompok

| Nama | Bagian |
| --- | --- |
| **Helen Audya Yuniarini** | Schema Prisma, seed, middleware (logger, error handler, not found), endpoint `/health`, **Fitur 6 Beli Hero**, **Fitur 7 Statistik** |
| **Muhammad Sabilil Haq** | **Fitur 2 Hero**, **Fitur 3 Skin** |
| **Rifqi Dwi Muslim** | **Fitur 4 Player**, **Fitur 5 Top Up & Match**, script konversi dataset CSV ke JSON |

## Tech Stack

- Express 5 + TypeScript
- Prisma ORM 7
- PostgreSQL di Neon dengan `@prisma/adapter-neon`

## Struktur Folder

```
├── data/                 # dataset hero dan skin (CSV asli + hasil konversi JSON)
├── prisma/
│   ├── migrations/       # migrasi database
│   ├── schema.prisma     # 4 tabel dan 4 enum
│   └── seed.ts           # isi ulang database dari data/*.json
├── scripts/
│   └── csv-to-json.ts    # konversi data/*.csv menjadi data/*.json
├── src/
│   ├── config/           # koneksi Prisma + Neon
│   ├── controllers/      # logika setiap fitur
│   ├── middlewares/      # logger, errorHandler, notFound
│   ├── routes/           # daftar endpoint
│   ├── utils/            # HttpError, parseId, sendSuccess
│   └── index.ts          # entry point server
└── prisma.config.ts
```

## Cara Menjalankan

1. Install dependensi:
   ```bash
   npm install
   ```
2. Buat project di Neon, lalu buat file `.env` di root project:
   ```env
   DATABASE_URL="connection string pooled (host mengandung -pooler)"
   DATABASE_URL_UNPOOLED="connection string direct (tanpa -pooler)"
   PORT=3000
   ```
   **File `.env` tidak di-commit ke GitHub.**
3. Buat tabel dan generate Prisma Client:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
4. Isi database (133 hero, 892 skin, 3 player):
   ```bash
   npx tsx prisma/seed.ts
   ```
5. Jalankan server:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000/health` untuk memastikan server dan database terhubung.

### Catatan Dataset

Dataset dari asisten tersedia dalam format CSV, sedangkan seed membaca JSON sesuai soal. File JSON sudah disertakan di `data/`, tapi bisa dibuat ulang dengan:
```bash
npx tsx scripts/csv-to-json.ts
```

## Daftar Endpoint

| Fitur | Metode | Endpoint |
| --- | --- | --- |
| Health check | GET | `/health` |
| Hero | GET | `/api/heroes?page=&limit=&search=&role=` |
| Hero | GET | `/api/heroes/:hero_id` |
| Hero | POST | `/api/heroes` |
| Skin | GET | `/api/skins?page=&limit=&heroId=&rarity=` |
| Skin | GET | `/api/skins/:skin_id` |
| Player | POST | `/api/players` |
| Player | GET | `/api/players/:player_id` |
| Player | PATCH | `/api/players/:player_id` |
| Player | DELETE | `/api/players/:player_id` |
| Top Up | POST | `/api/players/:player_id/topup` |
| Match | POST | `/api/players/:player_id/matches` |
| Beli Hero | POST | `/api/players/:player_id/heroes` |
| Statistik | GET | `/api/statistics` |

## Pengujian

Jalankan `npx tsx prisma/seed.ts` sebelum pengujian, lalu import koleksi Postman dari soal dan jalankan **testcase 01 sampai 28 secara berurutan**, karena setiap testcase bergantung pada hasil testcase sebelumnya.

## Perintah Lain

| Tujuan | Perintah |
| --- | --- |
| Cek tipe TypeScript | `npm run typecheck` |
| Lihat isi database | `npx prisma studio` |