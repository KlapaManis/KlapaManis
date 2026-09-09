export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { menuPhoto } from '@/db/schema'
import { eq, asc, sql } from 'drizzle-orm'
import { requireAuth } from '@/lib/requireAuth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }){
  const db=getDb()
  const rows=await db.select().from(menuPhoto).where(eq(menuPhoto.menuId, Number(params.id))).orderBy(asc(menuPhoto.urutan))
  return NextResponse.json({ rows })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }){
  const auth=await requireAuth()
  if(!auth) return NextResponse.json({error:'Unauthorized'},{status:401})
  const { imageUrl } = await req.json()
  if(!imageUrl) return NextResponse.json({error:'imageUrl wajib'},{status:400})
  const db=getDb()
  const maxRow = await db.select({ maxUrutan: sql<number>`coalesce(max(${menuPhoto.urutan}),0)` }).from(menuPhoto).where(eq(menuPhoto.menuId, Number(params.id)))
  const nextUrutan = (maxRow[0]?.maxUrutan ?? 0) + 1
  const [row]=await db.insert(menuPhoto).values({ menuId: Number(params.id), imageUrl: String(imageUrl), urutan: nextUrutan }).returning()
  return NextResponse.json({ row })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }){
  const auth=await requireAuth()
  if(!auth) return NextResponse.json({error:'Unauthorized'},{status:401})
  const { photoId } = await req.json()
  if(!photoId) return NextResponse.json({error:'photoId wajib'},{status:400})
  const db=getDb()
  await db.delete(menuPhoto).where(eq(menuPhoto.id, Number(photoId)))
  return NextResponse.json({ ok: true })
}
