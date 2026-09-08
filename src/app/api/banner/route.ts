export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { promoBanner } from '@/db/schema'
import { asc } from 'drizzle-orm'
import { requireAuth } from '@/lib/requireAuth'

export async function GET() {
  const db = getDb()
  const rows = await db.select().from(promoBanner).orderBy(asc(promoBanner.urutan))
  return NextResponse.json({ rows })
}
export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const b = await req.json()
  if (!b.imageUrl) return NextResponse.json({ error: 'imageUrl wajib' }, { status: 400 })
  const db = getDb()
  const [row] = await db.insert(promoBanner).values({
    imageUrl: String(b.imageUrl),
    title: b.title ? String(b.title) : null,
    subtitle: b.subtitle ? String(b.subtitle) : null,
    linkUrl: b.linkUrl ? String(b.linkUrl) : null,
    urutan: Number(b.urutan) || 0,
    aktif: b.aktif === 0 ? 0 : 1,
  }).returning()
  return NextResponse.json({ row })
}
