export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { menu } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/requireAuth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const b = await req.json()
  const db = getDb()
  const [row] = await db.update(menu).set({
    nama: b.nama !== undefined ? String(b.nama) : undefined,
    deskripsi: b.deskripsi !== undefined ? (b.deskripsi ? String(b.deskripsi) : null) : undefined,
    photoUrl: b.photoUrl !== undefined ? (b.photoUrl ? String(b.photoUrl) : null) : undefined,
    videoUrl: b.videoUrl !== undefined ? (b.videoUrl ? String(b.videoUrl) : null) : undefined,
    kategori: b.kategori !== undefined ? String(b.kategori) : undefined,
    harga: b.harga !== undefined ? Number(b.harga) : undefined,
    diskon: b.diskon !== undefined ? Math.max(0, Math.min(100, Number(b.diskon) || 0)) : undefined,
    isRecommended: b.isRecommended !== undefined ? (b.isRecommended ? 1 : 0) : undefined,
    isNew: b.isNew !== undefined ? (b.isNew ? 1 : 0) : undefined,
    urutan: b.urutan !== undefined ? Number(b.urutan) : undefined,
    aktif: b.aktif !== undefined ? (Number(b.aktif) ? 1 : 0) : undefined,
  } as any).where(eq(menu.id, Number(params.id))).returning()
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ row })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  await db.delete(menu).where(eq(menu.id, Number(params.id)))
  return NextResponse.json({ ok: true })
}
