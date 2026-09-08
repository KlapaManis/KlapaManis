export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/auth'

export async function POST() {
  const res = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'), 303)
  res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return res
}
export async function GET() {
  const res = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return res
}
