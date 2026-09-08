import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

let _client: ReturnType<typeof postgres> | null = null
let _db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (_db) return _db
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL belum di-set')
  _client = postgres(url, { max: 1, prepare: false })
  _db = drizzle(_client, { schema })
  return _db
}

export async function rawAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = getDb() as any
  // fallback via postgres client
  const client = postgres(process.env.DATABASE_URL!, { prepare: false })
  const rows = await client.unsafe(sql, params as any)
  await client.end()
  return rows as unknown as T[]
}
