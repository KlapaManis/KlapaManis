export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { gallery } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/requireAuth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }){
  const auth=await requireAuth()
  if(!auth) return NextResponse.json({error:'Unauthorized'},{status:401})
  const body = await req.json()
  const db=getDb()
  const [row]=await db.update(gallery).set({ imageUrl: body.imageUrl, title: body.title||null, deskripsi: body.deskripsi||null, urutan: body.urutan??0 }).where(eq(gallery.id, Number(params.id))).returning()
  return NextResponse.json({ row })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }){
  const auth=await requireAuth()
  if(!auth) return NextResponse.json({error:'Unauthorized'},{status:401})
  const db=getDb()
  await db.delete(gallery).where(eq(gallery.id, Number(params.id)))
  return NextResponse.json({ ok: true })
}
