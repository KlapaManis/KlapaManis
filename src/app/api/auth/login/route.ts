export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { verifyPassword, createSession, COOKIE_NAME } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'Email & password wajib' }, { status: 400 })
  const db = getDb()
  const [u] = await db.select().from(users).where(eq(users.email, String(email).toLowerCase()))
  if (!u) return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 401 })
  const ok = await verifyPassword(String(password), u.passwordHash)
  if (!ok) return NextResponse.json({ error: 'Password salah' }, { status: 401 })
  const token = await createSession({ userId: u.id, email: u.email, role: u.role })
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60*60*24*7 })
  return res
}
