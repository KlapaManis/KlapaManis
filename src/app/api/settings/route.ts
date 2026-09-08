export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { settings } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/requireAuth'

export async function GET() {
  const db = getDb()
  const rows = await db.select().from(settings)
  const map: Record<string, string> = {}
  for (const r of rows) if (r.key) map[r.key] = r.value || ''
  return NextResponse.json({ settings: map })
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json() as Record<string, string>
  const db = getDb()
  for (const [k, v] of Object.entries(body)) {
    await db.insert(settings).values({ key: k, value: String(v || ''), group: 'promo_landing' })
      .onConflictDoUpdate({ target: settings.key, set: { value: String(v || ''), group: 'promo_landing' } })
  }
  return NextResponse.json({ ok: true })
}
