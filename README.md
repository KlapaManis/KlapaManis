# promo-v2 — Next.js + Postgres (Neon + Vercel)

Rute dasar (sesuai request):
- `/promo` → FE landing (public, tombol cek)
- `/promo/setting` → Admin (login required, bukan PIN)

Harga menu **satu field tetap** `menu.harga` (integer), set di awal.

## Setup lokal
```bash
npm install
cp .env.example .env.local  # isi DATABASE_URL neon/local
npx drizzle-kit push        # push schema ke DB
curl -X POST http://localhost:3000/api/seed  # buat admin@promo.local / admin123
npm run dev
```

## Deploy Neon + Vercel
1. Buat project di Neon → copy `DATABASE_URL` (with `?sslmode=require`)
2. Vercel → Import `promo-v2` → set Env: `DATABASE_URL`, `AUTH_SECRET` (random 32+), `NEXT_PUBLIC_APP_URL=https://<vercel-domain>`
3. Deploy → `https://<domain>/api/seed` POST sekali (set `ALLOW_SEED=1` sementara) → hapus env setelahnya
4. Login `admin@promo.local` / `admin123` → ganti password via DB atau buat user baru

## Schema
`src/db/schema.ts:1` — users, promo_banner, promo, promo_item, menu(harga tetap), menu_photo, settings
