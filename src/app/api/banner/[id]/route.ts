export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { promoBanner } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/requireAuth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const b = await req.json()
  const db = getDb()
  const [row] = await db.update(promoBanner).set({
    imageUrl: b.imageUrl !== undefined ? String(b.imageUrl) : undefined,
    title: b.title !== undefined ? (b.title ? String(b.title) : null) : undefined,
    subtitle: b.subtitle !== undefined ? (b.subtitle ? String(b.subtitle) : null) : undefined,
    linkUrl: b.linkUrl !== undefined ? (b.linkUrl ? String(b.linkUrl) : null) : undefined,
    urutan: b.urutan !== undefined ? Number(b.urutan) : undefined,
    aktif: b.aktif !== undefined ? (Number(b.aktif) ? 1 : 0) : undefined,
  } as any).where(eq(promoBanner.id, Number(params.id))).returning()
  return NextResponse.json({ row })
}
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  await db.delete(promoBanner).where(eq(promoBanner.id, Number(params.id)))
  return NextResponse.json({ ok: true })
}
