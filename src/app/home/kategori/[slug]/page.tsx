import { getLandingSettings } from '@/lib/promoRepo'
import { getDb } from '@/db'
import { menu } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

const LABEL: Record<string,string> = { makanan:'Makanan', minuman:'Minuman', paket:'Paket' }

export default async function KategoriPage({ params }: { params: { slug: string } }){
  const slug = params.slug.toLowerCase()
  const kategori = LABEL[slug] || slug
  const settings = await getLandingSettings().catch(()=> ({} as Record<string,string>))
  const heroImage = settings['promo_landing.hero_image'] || ''
  const heroTitle = settings['promo_landing.hero_title'] || 'Klapa Manis'
  const heroSubtitle = settings['promo_landing.hero_subtitle'] || 'Tradisi Rasa, Kehangatan Bersama'

  const cardShow = settings['promo_landing.menu_card_show'] !== '0'
  const overlay = Number(settings['promo_landing.menu_card_overlay']||0.45)
  const bgColor = settings['promo_landing.bg_color'] || '#FAF7F2'
  const rawCardBg = settings['promo_landing.menu_card_bg'] || '#FFFFFF'
  // jika Warna card menu adalah hex, gabungkan dengan overlay pekat agar slider berfungsi
  const hexToRgba = (hex:string, a:number)=>{ const h=hex.replace('#',''); const r=parseInt(h.length===3?h[0]+h[0]:h.slice(0,2),16); const g=parseInt(h.length===3?h[1]+h[1]:h.slice(2,4),16); const b=parseInt(h.length===3?h[2]+h[2]:h.slice(4,6),16); return `rgba(${r},${g},${b},${a})` }
  const cardBg = rawCardBg.startsWith('#') ? hexToRgba(rawCardBg, overlay) : rawCardBg.includes('rgba') ? rawCardBg.replace(/rgba\(([^,]+,[^,]+,[^,]+,)[^)]+\)/, `rgba($1${overlay})`) : rawCardBg
  const cardShadow = settings['promo_landing.menu_card_shadow'] || '0 20px 40px rgba(0,0,0,0.35),0 8px 16px rgba(30,49,36,0.25)'
  const titleShadow = settings['promo_landing.title_shadow'] || '0 3px 12px rgba(0,0,0,0.9)'
  const descShadow = settings['promo_landing.desc_shadow'] || '0 2px 8px rgba(0,0,0,0.8)'
  const isWhiteCard = rawCardBg.toLowerCase().includes('255,255,255') || rawCardBg.toLowerCase() === '#ffffff' || rawCardBg.toLowerCase() === '#fff' || rawCardBg.toLowerCase() === 'white'
  const db = getDb()
  const items = await db.select().from(menu).where(eq(menu.kategori, kategori)).orderBy(asc(menu.urutan)).catch(()=>[])

  return (
    <div className="min-h-screen w-full" style={{backgroundColor: bgColor}}>
      {/* Hero 45% ikut scroll - tanpa tombol back UI, pakai back bawaan HP */}
      <section className="relative h-[45dvh] w-full overflow-hidden bg-stone-900 rounded-b-[24px]">
        {heroImage && <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="relative z-10 h-full max-w-6xl mx-auto px-4 pb-6 flex flex-col justify-end text-white">
          <h1 className="font-serif text-2xl sm:text-4xl font-semibold leading-tight">{heroTitle}</h1>
          <p className="text-xs sm:text-sm text-white/80 italic mt-1">{heroSubtitle}</p>
        </div>
      </section>

      {/* List 1 menu 1 baris, tiap baris 45% layar, ikut scroll bersama hero */}
      <div className="w-full">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 space-y-3">
          {items.length===0 ? (
            <div className="rounded-2xl border border-[#EEE8D8] bg-white p-6 text-center text-[#9A8B7A] text-sm">Belum ada {kategori.toLowerCase()}</div>
          ) : (
            items.map(it=>{
              const hasDiskon=(it.diskon||0)>0
              const disc=hasDiskon?Math.round(it.harga*(1-it.diskon!/100)):null
              const showHarga = Number(it.harga) !== 0
              return (
                <div key={it.id} className="relative h-[45dvh] rounded-2xl overflow-hidden border-2 border-white bg-stone-900 [transform:perspective(1000px)_rotateX(2deg)_translateZ(0)] hover:[transform:perspective(1000px)_rotateX(0deg)_translateZ(12px)] transition-all duration-500" style={{boxShadow: cardShadow}}>
                  {it.photoUrl ? <img src={it.photoUrl} alt={it.nama} className="absolute inset-0 w-full h-full object-cover brightness-[1.05] contrast-[1.08] saturate-[1.1]" /> : <div className="absolute inset-0 grid place-items-center bg-stone-100 text-stone-400 text-sm">No image</div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.2)] pointer-events-none" />
                  {/* overlay deskripsi - card kotak bisa toggle, teks tetap tampil */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className={cardShow ? "inline-block backdrop-blur-md rounded-xl px-3 py-2 border shadow-[0_8px_20px_rgba(0,0,0,0.2),0_2px_8px_rgba(0,0,0,0.15)]" : "inline-block px-1 py-1"} style={cardShow ? {backgroundColor: cardBg, borderColor: isWhiteCard ? 'rgba(232,224,200,0.8)' : 'rgba(255,255,255,0.2)'} : undefined}>
                      <div className="text-[22px] font-extrabold leading-tight tracking-tight" style={{color: isWhiteCard && cardShow ? '#1E3124' : '#ffffff', textShadow: isWhiteCard && cardShow ? 'none' : titleShadow}}>{it.nama}</div>
                      {it.deskripsi && <div className="text-[13px] line-clamp-2 mt-1 leading-snug" style={{color: isWhiteCard && cardShow ? 'rgba(30,49,36,0.7)' : 'rgba(255,255,255,0.9)', textShadow: isWhiteCard && cardShow ? 'none' : descShadow}}>{it.deskripsi}</div>}
                    </div>
                    {showHarga && (
                      <div className="mt-2 flex items-center gap-2">
                        {hasDiskon ? (
                          <>
                            <span className="text-xs line-through text-white/60 [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]">Rp {it.harga.toLocaleString('id-ID')}</span>
                            <span className="text-[15px] font-extrabold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">Rp {disc!.toLocaleString('id-ID')}</span>
                            <span className="text-[11px] bg-red-600 text-white px-2 py-0.5 rounded-full shadow-[0_2px_6px_rgba(220,38,38,0.5)]">-{it.diskon}%</span>
                          </>
                        ) : (
                          <span className="text-[15px] font-extrabold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">Rp {it.harga.toLocaleString('id-ID')}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}

        </div>
      </div>
    </div>
  )
}
