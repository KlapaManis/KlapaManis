export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getDb } from '@/db'
import { menu, promo, promoItem, promoBanner, settings } from '@/db/schema'
import { requireAuth } from '@/lib/requireAuth'

export async function POST() {
  const auth = await requireAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized - login dulu' }, { status: 401 })
  const db = getDb()

  // cek apakah sudah ada data
  const existing = await db.select().from(menu)
  if (existing.length > 0) return NextResponse.json({ ok: false, message: 'Data sudah ada, hapus dulu jika ingin re-seed' })

  const makanan = [
    { nama: 'Nasi Klapa Manis', deskripsi: 'Nasi gurih kelapa + ayam bakar madu', harga: 35000, kategori: 'Makanan', photoUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600', isRecommended: 1 },
    { nama: 'Sate Lilit Bali', deskripsi: 'Sate lilit ikan tenggiri rempah', harga: 28000, kategori: 'Makanan', photoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600' },
    { nama: 'Gurame Bakar Cobek', deskripsi: 'Gurame bakar sambal cobek pedas', harga: 65000, kategori: 'Makanan', photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600' },
    { nama: 'Nasi Campur Klapa', deskripsi: 'Nasi campur komplit lauk 4 macam', harga: 32000, kategori: 'Makanan', photoUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600' },
    { nama: 'Sop Buntut', deskripsi: 'Sop buntut kuah bening rempah', harga: 45000, kategori: 'Makanan', photoUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600' },
  ]
  const minuman = [
    { nama: 'Es Kelapa Muda', deskripsi: 'Kelapa muda gula aren', harga: 15000, kategori: 'Minuman', photoUrl: 'https://images.unsplash.com/photo-1481671703460-040cb8a2d909?w=600' },
    { nama: 'Wedang Jahe', deskripsi: 'Jahe merah + sereh hangat', harga: 12000, kategori: 'Minuman', photoUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600' },
    { nama: 'Es Teh Klapa', deskripsi: 'Teh manis kelapa muda', harga: 10000, kategori: 'Minuman', photoUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600' },
    { nama: 'Kopi Tubruk', deskripsi: 'Kopi tubruk robusta', harga: 14000, kategori: 'Minuman', photoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600' },
  ]
  const paket = [
    { nama: 'Paket Keluarga A', deskripsi: 'Untuk 4 orang: nasi + 2 ayam bakar + 2 ikan bakar + sayur', harga: 125000, kategori: 'Paket', photoUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', isRecommended: 1 },
    { nama: 'Paket Hemat Duo', deskripsi: 'Untuk 2 orang: nasi + ayam + es teh 2', harga: 55000, kategori: 'Paket', photoUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600' },
    { nama: 'Paket Nasi Kotak', deskripsi: 'Minimal 20 box, ayam + sambal + lalap', harga: 25000, kategori: 'Paket', photoUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600' },
  ]

  const allMenus = [...makanan, ...minuman, ...paket]
  const insertedMenus: any[] = []
  for (let i = 0; i < allMenus.length; i++) {
    const m = allMenus[i]
    const [row] = await db.insert(menu).values({
      nama: m.nama, deskripsi: m.deskripsi, harga: m.harga, kategori: m.kategori, photoUrl: m.photoUrl,
      diskon: 0, isRecommended: (m as any).isRecommended ? 1 : 0, isNew: 0, urutan: i, aktif: 1,
    }).returning()
    insertedMenus.push(row)
  }

  // promo 20% untuk 3 menu
  const [p] = await db.insert(promo).values({
    nama: 'Promo Akhir Pekan 20%', deskripsi: 'Diskon 20% khusus weekend', tipeDiskon: 'persen', nilaiDiskon: 20, aktif: 1,
  }).returning()
  const promoMenuIds = insertedMenus.slice(0, 3).map(m => m.id)
  for (let i = 0; i < promoMenuIds.length; i++) {
    await db.insert(promoItem).values({ promoId: p.id, menuId: promoMenuIds[i], urutan: i })
  }

  // banner
  await db.insert(promoBanner).values({
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200', title: 'Promo Klapa Manis', subtitle: 'Diskon hingga 20%', urutan: 0, aktif: 1,
  })

  // hero setting
  await db.insert(settings).values({ key: 'promo_landing.hero_title', value: 'Klapa Manis', group: 'promo_landing' }).onConflictDoUpdate({ target: settings.key, set: { value: 'Klapa Manis' } })
  await db.insert(settings).values({ key: 'promo_landing.hero_subtitle', value: 'Tradisi Rasa, Kehangatan Bersama', group: 'promo_landing' }).onConflictDoUpdate({ target: settings.key, set: { value: 'Tradisi Rasa, Kehangatan Bersama' } })
  await db.insert(settings).values({ key: 'promo_landing.hero_image', value: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600', group: 'promo_landing' }).onConflictDoUpdate({ target: settings.key, set: { value: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600' } })

  return NextResponse.json({ ok: true, menus: insertedMenus.length, promo: p.nama })
}

export async function DELETE() {
  const auth = await requireAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  await db.delete(promoItem)
  await db.delete(promo)
  await db.delete(menu)
  await db.delete(promoBanner)
  return NextResponse.json({ ok: true })
}
