'use client'
import { useState } from 'react'
import CategoryNav from './CategoryNav'

type Menu = { id:number,nama:string,deskripsi:string|null,photoUrl:string|null,kategori:string,harga:number,diskon:number|null,isRecommended:number|null,isNew:number|null }
type Promo = { id:number,nama:string,deskripsi:string|null,tipeDiskon:string,nilaiDiskon:number, items: (Menu & {promoHarga:number|null})[] }
type Banner = { id:number,imageUrl:string,title:string|null }

export default function PromoGallery({ groups, promos, banners }: { groups: {kategori:string,items:Menu[]}[], promos: Promo[], banners: Banner[] }){
  const [tab,setTab]=useState<'promo'|'makanan'|'minuman'|'paket'>('promo')
  const all = groups.flatMap(g=>g.items)
  const makanan = all.filter(x=>x.kategori==='Makanan')
  const minuman = all.filter(x=>x.kategori==='Minuman')
  const paket = all.filter(x=>x.kategori==='Paket')

  return (
    <div className="space-y-4 pb-24">
      {/* banner carousel kecil */}
      {banners.length>0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-none" style={{scrollbarWidth:'none'}}>
          {banners.map(b=> <img key={b.id} src={b.imageUrl} alt={b.title||'banner'} className="h-36 rounded-xl object-cover shrink-0 snap-start" />)}
        </div>
      )}

      {tab==='promo' && (
        <section>
          <h2 className="font-serif text-[16px] font-semibold text-[#1E3124] mb-3">Promo Spesial</h2>
          {promos.length===0 ? <div className="rounded-2xl border border-[#EEE8D8] bg-white p-4 text-center text-[#9A8B7A] text-sm">Belum ada promo</div> :
            <div className="grid sm:grid-cols-2 gap-3">
              {promos.map(p=>(
                <div key={p.id} className="bg-white rounded-2xl border border-[#EEE8D8] p-3">
                  <div className="font-medium text-[#1E3124] text-sm">{p.nama} <span className="text-xs bg-[#1E3124] text-white px-1.5 py-0.5 rounded ml-1">{p.tipeDiskon==='persen'?`-${p.nilaiDiskon}%`:`-Rp ${p.nilaiDiskon}`}</span></div>
                  <div className="text-xs text-[#9A8B7A]">{p.deskripsi}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {p.items.map(it=>(
                      <div key={it.id} className="border border-[#EEE8D8] rounded-xl overflow-hidden bg-[#FAF7F2]">
                        {it.photoUrl && <img src={it.photoUrl} className="h-24 w-full object-cover" alt={it.nama} />}
                        <div className="p-2">
                          <div className="text-xs font-medium truncate text-[#1E3124]">{it.nama}</div>
                          <div className="text-[11px] line-through text-stone-400">Rp {it.harga.toLocaleString('id-ID')}</div>
                          <div className="text-xs font-semibold text-red-600">Rp {it.promoHarga?.toLocaleString('id-ID')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          }
        </section>
      )}

      {tab==='makanan' && <GalleryGrid title="Makanan" items={makanan} />}
      {tab==='minuman' && <GalleryGrid title="Minuman" items={minuman} />}
      {tab==='paket' && <GalleryGrid title="Paket" items={paket} />}

      {/* kategori di bawah sendiri urutannya: promo > makanan > minuman > paket */}
      <div className="pt-4 mt-4 border-t border-[#EEE8D8]">
        <CategoryNav active={tab} onSelect={(v)=>setTab(v.toLowerCase() as any)} />
      </div>
    </div>
  )
}

function GalleryGrid({title,items}:{title:string,items:any[]}){
  if(items.length===0) return <div className="rounded-2xl border border-[#EEE8D8] bg-white p-4 text-center text-[#9A8B7A] text-sm">Belum ada {title.toLowerCase()}</div>
  return (
    <section>
      <h2 className="font-serif text-[16px] font-semibold text-[#1E3124] mb-3">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((it:any)=>{
          const hasDiskon=(it.diskon||0)>0
          const disc= hasDiskon? Math.round(it.harga*(1-it.diskon/100)):null
          return (
            <div key={it.id} className="bg-white rounded-2xl border border-[#EEE8D8] overflow-hidden">
              <div className="h-32 bg-stone-100 overflow-hidden">
                {it.photoUrl ? <img src={it.photoUrl} alt={it.nama} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-stone-300 text-xs">No image</div>}
              </div>
              <div className="p-3">
                <div className="text-sm font-medium leading-tight truncate text-[#1E3124]">{it.nama}</div>
                <div className="text-[11px] text-[#9A8B7A] line-clamp-2 h-8">{it.deskripsi||''}</div>
                <div className="mt-1">
                  {hasDiskon ? <><span className="text-xs line-through text-stone-400">Rp {it.harga.toLocaleString('id-ID')}</span><span className="text-sm font-semibold text-red-600 ml-1">Rp {disc!.toLocaleString('id-ID')}</span></>:<span className="text-sm font-semibold text-[#1E3124]">Rp {it.harga.toLocaleString('id-ID')}</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
