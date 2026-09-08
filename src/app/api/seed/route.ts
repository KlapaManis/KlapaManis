export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getDb } from '@/db'
import { users } from '@/db/schema'
import { hashPassword } from '@/lib/auth'

export async function POST() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== '1') {
    return NextResponse.json({ error: 'Seed disabled in production' }, { status: 403 })
  }
  const db = getDb()
  const email = 'admin@promo.local'
  const existing = await db.select().from(users).then(r => r.find(u => u.email === email))
  if (existing) return NextResponse.json({ ok: true, message: 'Admin sudah ada', email, password: 'admin123' })
  const hash = await hashPassword('admin123')
  await db.insert(users).values({ email, passwordHash: hash, name: 'Admin', role: 'admin' })
  return NextResponse.json({ ok: true, email, password: 'admin123' })
}
