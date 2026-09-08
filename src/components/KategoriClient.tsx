'use client'
import { useState } from 'react'
import DetailModal from './DetailModal'
type Item = { id:number, nama:string, deskripsi:string|null, photoUrl:string|null, videoUrl?:string|null, harga:number, diskon:number|null, kategori:string }

export default function KategoriClient({ items, cardBg, cardShadow, titleShadow, descShadow, isWhiteCard, namaColor, descColor }: {
  items: Item[], cardBg:string, cardShadow:string, titleShadow:string, descShadow:string, isWhiteCard:boolean, namaColor?:string, descColor?:string
}){
  const [detail,setDetail]=useState<{title:string,image:string|null,desc:string|null,price:string|null}|null>(null)
  return (
    <>
      <div className="space-y-3">
        {items.map(it=>{
          const hasDiskon=(it.diskon||0)>0
          const disc=hasDiskon?Math.round(it.harga*(1-it.diskon!/100)):null
          const showHarga = Number(it.harga) !== 0
          const price = showHarga ? (hasDiskon ? `Rp ${disc!.toLocaleString('id-ID')} (dari Rp ${it.harga.toLocaleString('id-ID')})` : `Rp ${it.harga.toLocaleString('id-ID')}`) : null
          return (
            <div key={it.id} onClick={()=>setDetail({title: it.nama, image: it.photoUrl, desc: it.deskripsi, price})} className="relative h-[45dvh] rounded-2xl overflow-hidden border-2 border-white bg-stone-900 cursor-pointer" style={{boxShadow: cardShadow}}>
              {it.photoUrl ? <img src={it.photoUrl} alt={it.nama} className="absolute inset-0 w-full h-full object-cover brightness-[1.05] contrast-[1.08] saturate-[1.1]" /> : <div className="absolute inset-0 grid place-items-center bg-stone-100 text-stone-400 text-sm">No image</div>}
              {it.videoUrl && <video src={it.videoUrl} className="absolute inset-0 w-full h-full object-cover" muted loop playsInline />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="inline-block backdrop-blur-md rounded-xl px-3 py-2 border" style={{backgroundColor: cardBg, borderColor: isWhiteCard ? 'rgba(232,224,200,0.8)' : 'rgba(255,255,255,0.2)'}}>
                  <div className="text-[22px] font-extrabold leading-tight tracking-tight" style={{color: namaColor || (isWhiteCard ? '#1E3124' : '#ffffff'), textShadow: isWhiteCard ? 'none' : titleShadow}}>{it.nama}</div>
                  {it.deskripsi && <div className="text-[13px] line-clamp-2 mt-1 leading-snug" style={{color: descColor || (isWhiteCard ? 'rgba(30,49,36,0.7)' : 'rgba(255,255,255,0.9)'), textShadow: isWhiteCard ? 'none' : descShadow}}>{it.deskripsi}</div>}
                </div>
                {showHarga && <div className="mt-2 text-[15px] font-extrabold text-white" style={{textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>{price}</div>}
              </div>
            </div>
          )
        })}
      </div>
      <DetailModal data={detail} onClose={()=>setDetail(null)} />
    </>
  )
}
