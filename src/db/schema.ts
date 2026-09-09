import { pgTable, text, integer, doublePrecision, date, timestamp, index, serial, varchar, boolean } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// === Auth users untuk /promo/setting ===
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  role: text('role').default('admin').notNull(), // admin | editor
  createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
})

// === Promo landing ===
export const promoBanner = pgTable('promo_banner', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  title: text('title'),
  subtitle: text('subtitle'),
  linkUrl: text('link_url'),
  urutan: integer('urutan').default(0),
  aktif: integer('aktif').default(1),
  createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => [index('idx_promo_banner_aktif').on(t.aktif)])

export const promo = pgTable('promo', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  deskripsi: text('deskripsi'),
  bannerImage: text('banner_image'),
  tipeDiskon: text('tipe_diskon').notNull().default('persen'),
  nilaiDiskon: doublePrecision('nilai_diskon').default(0),
  mulai: date('mulai', { mode: 'string' }),
  selesai: date('selesai', { mode: 'string' }),
  aktif: integer('aktif').default(1),
  createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => [index('idx_promo_aktif').on(t.aktif)])

// === Menu utama - harga set di awal (satu field harga) ===
export const menu = pgTable('menu', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  deskripsi: text('deskripsi'),
  photoUrl: text('photo_url'),
  videoUrl: text('video_url'),
  kategori: text('kategori').notNull().default('Lainnya'), // makanan | minuman | paket | lainnya (bebas)
  harga: integer('harga').notNull().default(0), // SATU HARGA TETAP
  diskon: integer('diskon').default(0), // 0-100 persen
  isRecommended: integer('is_recommended').default(0),
  isNew: integer('is_new').default(0),
  urutan: integer('urutan').default(0),
  aktif: integer('aktif').default(1),
  createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => [
  index('idx_menu_aktif').on(t.aktif),
  index('idx_menu_kategori').on(t.kategori),
])

export const menuPhoto = pgTable('menu_photo', {
  id: serial('id').primaryKey(),
  menuId: integer('menu_id').notNull().references(() => menu.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  urutan: integer('urutan').default(0),
}, (t) => [index('idx_menu_photo_menu').on(t.menuId)])

export const promoItem = pgTable('promo_item', {
  id: serial('id').primaryKey(),
  promoId: integer('promo_id').notNull().references(() => promo.id, { onDelete: 'cascade' }),
  menuId: integer('menu_id').notNull().references(() => menu.id, { onDelete: 'cascade' }),
  urutan: integer('urutan').default(0),
}, (t) => [
  index('idx_promo_item_promo').on(t.promoId),
  index('idx_promo_item_menu').on(t.menuId),
])

// === Settings landing appearance (key-value) ===
export const settings = pgTable('settings', {
  key: text('setting_key').primaryKey(),
  value: text('setting_value'),
  group: text('setting_group'),
})

// === Gallery photos ===
export const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  title: text('title'),
  deskripsi: text('deskripsi'),
  urutan: integer('urutan').default(0),
  aktif: integer('aktif').default(1),
  createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => [index('idx_gallery_aktif').on(t.aktif)])
