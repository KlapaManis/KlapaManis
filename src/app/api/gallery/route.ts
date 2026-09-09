export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { gallery } from '@/db/schema'
import { eq, asc, sql } from 'drizzle-orm'
import { requireAuth } from '@/lib/requireAuth'

export async function GET(){
  const db=getDb()
  const rows=await db.select().from(gallery).where(eq(gallery.aktif, 1)).orderBy(asc(gallery.urutan))
  return NextResponse.json({ rows })
}

export async function POST(req: NextRequest){
  const auth=await requireAuth()
  if(!auth) return NextResponse.json({error:'Unauthorized'},{status:401})
  const { imageUrl, title, deskripsi, urutan } = await req.json()
  if(!imageUrl) return NextResponse.json({error:'imageUrl wajib'},{status:400})
  const db=getDb()
  let nextUrutan = Number(urutan) || 0
  if(nextUrutan <= 0){
    const maxRow = await db.select({ maxUrutan: sql<number>`coalesce(max(${gallery.urutan}),0)` }).from(gallery)
    nextUrutan = (maxRow[0]?.maxUrutan ?? 0) + 1
  }
  const [row]=await db.insert(gallery).values({ imageUrl, title: title||null, deskripsi: deskripsi||null, urutan: nextUrutan }).returning()
  return NextResponse.json({ row })
}
