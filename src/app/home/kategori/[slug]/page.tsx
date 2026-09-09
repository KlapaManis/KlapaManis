import { getLandingSettings } from '@/lib/promoRepo'
import { getDb } from '@/db'
import { menu, menuPhoto } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import KategoriClient from '@/components/KategoriClient'
import PageTransition from '@/components/PageTransition'
export const dynamic = 'force-dynamic'

const LABEL: Record<string,string> = { makanan:'Makanan', minuman:'Minuman', paket:'Paket' }

export default async function KategoriPage({ params }: { params: { slug: string } }){
  const slug = params.slug.toLowerCase()
  const kategori = LABEL[slug] || slug
  const settings = await getLandingSettings().catch(()=> ({} as Record<string,string>))
  const heroImage = settings['promo_landing.hero_image'] || ''
  const heroTitle = settings['promo_landing.hero_title'] || ''
  const heroSubtitle = settings['promo_landing.hero_subtitle'] || ''

  const cardShow = settings['promo_landing.menu_card_show'] !== '0'
  const overlay = Number(settings['promo_landing.menu_card_overlay']||0.45)
  const bgColor = settings['promo_landing.bg_color'] || '#FAF7F2'
  const rawCardBg = settings['promo_landing.menu_card_bg'] || '#FFFFFF'
  const hexToRgba = (hex:string, a:number)=>{ const h=hex.replace('#',''); const r=parseInt(h.length===3?h[0]+h[0]:h.slice(0,2),16); const g=parseInt(h.length===3?h[1]+h[1]:h.slice(2,4),16); const b=parseInt(h.length===3?h[2]+h[2]:h.slice(4,6),16); return `rgba(${r},${g},${b},${a})` }
  const cardBg = rawCardBg.startsWith('#') ? hexToRgba(rawCardBg, overlay) : rawCardBg.includes('rgba') ? rawCardBg.replace(/rgba\(([^,]+,[^,]+,[^,]+,)[^)]+\)/, `rgba($1${overlay})`) : rawCardBg
  const cardShadow = settings['promo_landing.menu_card_shadow'] || '0 20px 40px rgba(0,0,0,0.35),0 8px 16px rgba(30,49,36,0.25)'
  const titleShadow = settings['promo_landing.title_shadow'] || '0 3px 12px rgba(0,0,0,0.9)'
  const descShadow = settings['promo_landing.desc_shadow'] || '0 2px 8px rgba(0,0,0,0.8)'
  const isWhiteCard = rawCardBg.toLowerCase().includes('255,255,255') || rawCardBg.toLowerCase() === '#ffffff' || rawCardBg.toLowerCase() === '#fff' || rawCardBg.toLowerCase() === 'white'
  const namaColor = settings['promo_landing.menuCardTextColor'] || (isWhiteCard ? '#1E3124' : '#ffffff')
  const descColor = settings['promo_landing.menuDescColor'] || (isWhiteCard ? 'rgba(30,49,36,0.7)' : 'rgba(255,255,255,0.9)')
  const db = getDb()
  const items = await db.select().from(menu).where(eq(menu.kategori, kategori)).orderBy(asc(menu.urutan)).catch(()=>[])

  const itemsWithPhotos = await Promise.all(items.map(async (it) => {
    const photos = await db.select().from(menuPhoto).where(eq(menuPhoto.menuId, it.id)).orderBy(asc(menuPhoto.urutan)).catch(()=>[])
    return { ...it, photos: photos.map(p => p.imageUrl) }
  }))

  return (
    <PageTransition>
    <div className="w-full" style={{backgroundColor: bgColor}}>
      <section className="relative h-[42svh] w-full overflow-hidden bg-stone-900 rounded-b-[24px]" style={{boxShadow: '0 12px 32px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.3)'}}>
        {heroImage && <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="relative z-10 h-full max-w-6xl mx-auto px-4 pb-6 flex flex-col justify-end text-white">
          {heroTitle && <h1 className="font-serif text-2xl sm:text-4xl font-semibold leading-tight">{heroTitle}</h1>}
          {heroSubtitle && <p className="text-xs sm:text-sm text-white/80 italic mt-1">{heroSubtitle}</p>}
        </div>
      </section>

      <div className="w-full">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 space-y-3">
          {itemsWithPhotos.length===0 ? (
            <div className="rounded-2xl border border-[#EEE8D8] bg-white p-6 text-center text-[#9A8B7A] text-sm">Belum ada {kategori.toLowerCase()}</div>
          ) : (
            <KategoriClient items={itemsWithPhotos as any} cardBg={cardBg} cardShadow={cardShadow} titleShadow={titleShadow} descShadow={descShadow} isWhiteCard={isWhiteCard} namaColor={namaColor} descColor={descColor} cardShow={cardShow} />
          )}
        </div>
      </div>
    </div>
    </PageTransition>
  )
}
