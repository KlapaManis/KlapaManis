import { getBanners, getLandingSettings } from '@/lib/promoRepo'
import PromoHome40 from '@/components/PromoHome40'
export const dynamic = 'force-dynamic'

export default async function PromoPage() {
  const [banners, settings] = await Promise.all([
    getBanners().catch(() => []),
    getLandingSettings().catch(() => ({} as Record<string, string>)),
  ])

  const heroImage = settings['promo_landing.hero_image'] || ''
  const heroTitle = settings['promo_landing.hero_title'] || 'Klapa Manis'
  const heroSubtitle = settings['promo_landing.hero_subtitle'] || 'Tradisi Rasa, Kehangatan Bersama'

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2]">
      {/* 45% Hero - rounder bawah, ikut scroll */}
      <section className="relative h-[45dvh] w-full overflow-hidden bg-stone-900 rounded-b-[24px]">
        {heroImage && <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="relative z-10 h-full max-w-6xl mx-auto px-4 pb-6 flex flex-col justify-end text-white">
          <h1 className="font-serif text-2xl sm:text-4xl font-semibold leading-tight">{heroTitle}</h1>
          <p className="text-xs sm:text-sm text-white/80 italic mt-1">{heroSubtitle}</p>
        </div>
      </section>

      {/* 45% Gallery + 10% Menu - ikut scroll */}
      <div className="w-full">
        <PromoHome40 banners={banners} galleryTransition={settings['promo_landing.gallery_transition']||'acak'} galleryInterval={settings['promo_landing.gallery_interval']||'3000'} />
      </div>
    </div>
  )
}
