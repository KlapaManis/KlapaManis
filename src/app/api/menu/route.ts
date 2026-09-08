export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { menu } from '@/db/schema'
import { asc } from 'drizzle-orm'
import { requireAuth } from '@/lib/requireAuth'

export async function GET() {
  const db = getDb()
  const rows = await db.select().from(menu).orderBy(asc(menu.urutan), asc(menu.id))
  return NextResponse.json({ rows })
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const b = await req.json()
  if (!b.nama) return NextResponse.json({ error: 'nama wajib' }, { status: 400 })
  const db = getDb()
  const [row] = await db.insert(menu).values({
    nama: String(b.nama),
    deskripsi: b.deskripsi ? String(b.deskripsi) : null,
    photoUrl: b.photoUrl ? String(b.photoUrl) : null,
    videoUrl: b.videoUrl ? String(b.videoUrl) : null,
    kategori: b.kategori ? String(b.kategori) : 'Lainnya',
    harga: Number(b.harga) || 0,
    diskon: Math.max(0, Math.min(100, Number(b.diskon) || 0)),
    isRecommended: b.isRecommended ? 1 : 0,
    isNew: b.isNew ? 1 : 0,
    urutan: Number(b.urutan) || 0,
    aktif: b.aktif === 0 ? 0 : 1,
  }).returning()
  return NextResponse.json({ row })
}
