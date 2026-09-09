import { getBanners, getLandingSettings } from '@/lib/promoRepo'
import PromoHome40 from '@/components/PromoHome40'
import PageTransition from '@/components/PageTransition'
export const dynamic = 'force-dynamic'

export default async function PromoPage() {
  const [banners, settings] = await Promise.all([
    getBanners().catch(() => []),
    getLandingSettings().catch(() => ({} as Record<string, string>)),
  ])

  const heroImage = settings['promo_landing.hero_image'] || ''
  const heroTitle = settings['promo_landing.hero_title'] || ''
  const heroSubtitle = settings['promo_landing.hero_subtitle'] || ''
  const bgColor = settings['promo_landing.bg_color'] || '#FAF7F2'

  return (
    <PageTransition>
    <div className="flex flex-col h-[100svh] w-full overflow-hidden" style={{backgroundColor: bgColor}}>
      {/* Hero paten - 3D shadow */}
      <section className="relative h-[42svh] shrink-0 w-full overflow-hidden bg-stone-900 rounded-b-[24px]" style={{boxShadow: '0 12px 32px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.3)'}}>
        {heroImage && <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />}
        {(heroTitle || heroSubtitle) && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />}
        <div className="relative z-10 h-full max-w-6xl mx-auto px-4 pb-6 flex flex-col justify-end text-white">
          {heroTitle && <h1 className="font-serif text-2xl sm:text-4xl font-semibold leading-tight">{heroTitle}</h1>}
          {heroSubtitle && <p className="text-xs sm:text-sm text-white/80 italic mt-1">{heroSubtitle}</p>}
        </div>
      </section>

      {/* Gallery + Menu paten full */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <PromoHome40 banners={banners} galleryTransition={settings['promo_landing.gallery_transition']||'acak'} galleryInterval={settings['promo_landing.gallery_interval']||'3000'} bgColor={bgColor} />
      </div>
    </div>
    </PageTransition>
  )
}
