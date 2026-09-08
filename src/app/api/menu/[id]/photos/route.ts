export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { menuPhoto } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
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
  const [row]=await db.insert(menuPhoto).values({ menuId: Number(params.id), imageUrl: String(imageUrl), urutan: 0 }).returning()
  return NextResponse.json({ row })
}
