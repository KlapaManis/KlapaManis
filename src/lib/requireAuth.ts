import { cookies } from 'next/headers'
import { verifySession, COOKIE_NAME } from './auth'

export async function requireAuth() {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) return null
  return verifySession(token)
}
