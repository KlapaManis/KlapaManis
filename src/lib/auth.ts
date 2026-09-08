import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-ganti-di-prod-min-32-char')
const COOKIE_NAME = 'promo_session'

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10)
}
export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash)
}

export async function createSession(payload: { userId: number; email: string; role: string }) {
  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
  return token
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as { userId: number; email: string; role: string }
  } catch {
    return null
  }
}

export { COOKIE_NAME }
