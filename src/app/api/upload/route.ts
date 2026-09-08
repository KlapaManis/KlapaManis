export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/requireAuth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'file wajib' }, { status: 400 })
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = path.extname(file.name) || '.jpg'
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const dir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, name), buffer)
  return NextResponse.json({ url: `/uploads/${name}` })
}
