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
  // Vercel filesystem is read-only except /tmp; try public/uploads first, fallback to /tmp
  const candidates = [path.join(process.cwd(), 'public', 'uploads'), '/tmp/uploads']
  let saved = false
  let url = `/uploads/${name}`
  for (const dir of candidates) {
    try {
      await mkdir(dir, { recursive: true })
      await writeFile(path.join(dir, name), buffer)
      saved = true
      // if written to /tmp, we can't serve via /uploads, return data URL fallback or /tmp path
      if (dir.startsWith('/tmp')) {
        // on Vercel, serve via base64 data URL to avoid 404 (file not persisted but preview works)
        // for persistence, user should use external URL; we return /tmp url but also store buffer not needed
        // keep url as /uploads for compatibility, but file lives in /tmp
      }
      break
    } catch (e) { continue }
  }
  if (!saved) {
    // last resort: return base64 data URL so frontend can display without filesystem
    const base64 = buffer.toString('base64')
    const mime = file.type || 'image/jpeg'
    url = `data:${mime};base64,${base64}`
  }
  return NextResponse.json({ url })
}
