export const dynamic = 'force-dynamic'
import { getDb } from '@/db'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    const db = getDb() as any
    // keep Neon warm
    await db.execute(sql`SELECT 1`)
  } catch {}
  return Response.json({ ok: true, at: new Date().toISOString() })
}
