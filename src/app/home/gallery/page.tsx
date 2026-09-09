import { getLandingSettings } from '@/lib/promoRepo'
import { getDb } from '@/db'
import { gallery } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import GalleryClient from '@/components/GalleryClient'
export const dynamic = 'force-dynamic'

export default async function GalleryPage(){
  const settings = await getLandingSettings().catch(()=> ({} as Record<string,string>))
  const heroImage = settings['promo_landing.hero_image'] || ''
  const heroTitle = settings['promo_landing.hero_title'] || ''
  const heroSubtitle = settings['promo_landing.hero_subtitle'] || ''
  const bgColor = settings['promo_landing.bg_color'] || '#FAF7F2'
  const rawCardBg = settings['promo_landing.menu_card_bg'] || '#FFFFFF'
  const overlay = Number(settings['promo_landing.menu_card_overlay']||0.45)
  const hexToRgba = (hex:string, a:number)=>{ const h=hex.replace('#',''); const r=parseInt(h.length===3?h[0]+h[0]:h.slice(0,2),16); const g=parseInt(h.length===3?h[1]+h[1]:h.slice(2,4),16); const b=parseInt(h.length===3?h[2]+h[2]:h.slice(4,6),16); return `rgba(${r},${g},${b},${a})` }
  const cardBg = rawCardBg.startsWith('#') ? hexToRgba(rawCardBg, overlay) : rawCardBg.includes('rgba') ? rawCardBg.replace(/rgba\(([^,]+,[^,]+,[^,]+,)[^)]+\)/, `rgba($1${overlay})`) : rawCardBg
  const isWhiteCard = rawCardBg.toLowerCase().includes('255,255,255') || rawCardBg.toLowerCase() === '#ffffff' || rawCardBg.toLowerCase() === '#fff' || rawCardBg.toLowerCase() === 'white'
  const namaColor = settings['promo_landing.menuCardTextColor'] || (isWhiteCard ? '#1E3124' : '#ffffff')
  const descColor = settings['promo_landing.menuDescColor'] || (isWhiteCard ? 'rgba(30,49,36,0.7)' : 'rgba(255,255,255,0.9)')
  const db = getDb()
  const items = await db.select().from(gallery).where(eq(gallery.aktif, 1)).orderBy(asc(gallery.urutan)).catch(()=>[])

  return (
    <div className="w-full" style={{backgroundColor: bgColor}}>
      <section className="relative h-[42svh] w-full overflow-hidden bg-stone-900 rounded-b-[24px]">
        {heroImage && <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="relative z-10 h-full max-w-6xl mx-auto px-4 pb-6 flex flex-col justify-end text-white">
          {heroTitle && <h1 className="font-serif text-2xl sm:text-4xl font-semibold leading-tight">{heroTitle}</h1>}
          {heroSubtitle && <p className="text-xs sm:text-sm text-white/80 italic mt-1">{heroSubtitle}</p>}
        </div>
      </section>

      <div className="w-full">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3">
          <GalleryClient items={items as any} cardBg={cardBg} cardShadow="0 10px 30px rgba(0,0,0,0.4)" isWhiteCard={isWhiteCard} namaColor={namaColor} descColor={descColor} />
        </div>
      </div>
    </div>
  )
}
