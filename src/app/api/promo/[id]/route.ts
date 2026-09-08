export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { promo, promoItem } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/requireAuth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb()
  const [row] = await db.select().from(promo).where(eq(promo.id, Number(params.id)))
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const items = await db.select().from(promoItem).where(eq(promoItem.promoId, Number(params.id)))
  return NextResponse.json({ row, menuIds: items.map(i => i.menuId) })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const b = await req.json()
  const db = getDb()
  const [row] = await db.update(promo).set({
    nama: b.nama !== undefined ? String(b.nama) : undefined,
    deskripsi: b.deskripsi !== undefined ? (b.deskripsi ? String(b.deskripsi) : null) : undefined,
    bannerImage: b.bannerImage !== undefined ? (b.bannerImage ? String(b.bannerImage) : null) : undefined,
    tipeDiskon: b.tipeDiskon,
    nilaiDiskon: b.nilaiDiskon !== undefined ? Number(b.nilaiDiskon) : undefined,
    mulai: b.mulai !== undefined ? (b.mulai || null) : undefined,
    selesai: b.selesai !== undefined ? (b.selesai || null) : undefined,
    aktif: b.aktif !== undefined ? (Number(b.aktif) ? 1 : 0) : undefined,
  } as any).where(eq(promo.id, Number(params.id))).returning()
  if (Array.isArray(b.menuIds)) {
    await db.delete(promoItem).where(eq(promoItem.promoId, Number(params.id)))
    if (b.menuIds.length) await db.insert(promoItem).values(b.menuIds.map((mid: number, idx: number) => ({ promoId: Number(params.id), menuId: Number(mid), urutan: idx })))
  }
  return NextResponse.json({ row })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  await db.delete(promo).where(eq(promo.id, Number(params.id)))
  return NextResponse.json({ ok: true })
}
