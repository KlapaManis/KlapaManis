import { getDb } from '@/db'
import { menu, promo, promoItem, promoBanner, menuPhoto, settings } from '@/db/schema'
import { eq, asc, and, sql } from 'drizzle-orm'

function hitungPromo(harga: number | null, tipe: string, nilai: number) {
  if (harga == null) return null
  let p = tipe === 'persen' ? harga * (1 - nilai / 100) : harga - nilai
  if (p < 0) p = 0
  return Math.round(p)
}

// banners
export async function getBanners() {
  const db = getDb()
  return db.select().from(promoBanner).where(eq(promoBanner.aktif, 1)).orderBy(asc(promoBanner.urutan))
}

// menus grouped by kategori
export async function getMenuGrouped() {
  const db = getDb()
  const rows = await db.select().from(menu).where(eq(menu.aktif, 1)).orderBy(asc(menu.urutan))
  const groups: Record<string, typeof rows> = {}
  for (const r of rows) {
    const k = r.kategori || 'Lainnya'
    if (!groups[k]) groups[k] = []
    groups[k].push(r)
  }
  return Object.entries(groups).map(([kategori, items]) => ({ kategori, items }))
}

export async function getAllMenus() {
  const db = getDb()
  return db.select().from(menu).orderBy(asc(menu.urutan))
}

export async function getPromosWithItems() {
  const db = getDb()
  const promos = await db.select().from(promo).where(and(
    eq(promo.aktif, 1),
    sql`(${promo.mulai} IS NULL OR ${promo.mulai} <= CURRENT_DATE)`,
    sql`(${promo.selesai} IS NULL OR ${promo.selesai} >= CURRENT_DATE)`,
  )).orderBy(asc(promo.id))
  if (promos.length === 0) return []
  const items = await db.select({
    promoId: promoItem.promoId,
    menu: menu,
  }).from(promoItem).innerJoin(menu, eq(promoItem.menuId, menu.id)).orderBy(asc(promoItem.urutan))

  const byPromo: Record<number, typeof menu.$inferSelect[]> = {}
  for (const row of items) {
    if (!byPromo[row.promoId]) byPromo[row.promoId] = []
    byPromo[row.promoId].push(row.menu)
  }
  return promos.map(p => ({
    ...p,
    items: (byPromo[p.id] || []).map(m => ({
      ...m,
      promoHarga: hitungPromo(m.harga, p.tipeDiskon, Number(p.nilaiDiskon) || 0),
    })),
  })).filter(p => p.items.length > 0)
}

export async function getLandingSettings() {
  const db = getDb()
  const rows = await db.select().from(settings).where(eq(settings.group, 'promo_landing'))
  const map: Record<string, string> = {}
  for (const r of rows) if (r.key && r.value) map[r.key] = r.value
  return map
}
