export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { promo, promoItem } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/requireAuth'

export async function GET() {
  const db = getDb()
  const rows = await db.select().from(promo).orderBy(asc(promo.id))
  // include items count
  return NextResponse.json({ rows })
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const b = await req.json()
  if (!b.nama) return NextResponse.json({ error: 'nama wajib' }, { status: 400 })
  const db = getDb()
  const [row] = await db.insert(promo).values({
    nama: String(b.nama),
    deskripsi: b.deskripsi ? String(b.deskripsi) : null,
    bannerImage: b.bannerImage ? String(b.bannerImage) : null,
    tipeDiskon: b.tipeDiskon || 'persen',
    nilaiDiskon: Number(b.nilaiDiskon) || 0,
    mulai: b.mulai || null,
    selesai: b.selesai || null,
    aktif: b.aktif === 0 ? 0 : 1,
  }).returning()
  // optional menuIds
  if (Array.isArray(b.menuIds) && b.menuIds.length) {
    await db.insert(promoItem).values(b.menuIds.map((mid: number, idx: number) => ({ promoId: row.id, menuId: Number(mid), urutan: idx })))
  }
  return NextResponse.json({ row })
}
