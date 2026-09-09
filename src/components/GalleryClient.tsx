'use client'
import { useState } from 'react'
import DetailModal from './DetailModal'
type GalleryItem = { id:number, imageUrl:string, title:string|null, deskripsi:string|null, urutan:number }

export default function GalleryClient({ items, cardBg, cardShadow, isWhiteCard, namaColor, descColor }: {
  items: GalleryItem[], cardBg:string, cardShadow:string, isWhiteCard:boolean, namaColor?:string, descColor?:string
}){
  const [detail,setDetail]=useState<{title:string,image:string|null,desc?:string|null}|null>(null)

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {items.map(it=>(
          <div key={it.id} onClick={()=>setDetail({title:it.title||'Gallery', image:it.imageUrl, desc:it.deskripsi})} className="relative rounded-2xl overflow-hidden bg-stone-900 cursor-pointer aspect-[3/4]" style={{boxShadow: '0 14px 36px rgba(0,0,0,0.45), 0 6px 14px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.12)'}}>
            <img src={it.imageUrl} alt={it.title||''} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            {it.title && (
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="inline-block backdrop-blur-md rounded-xl px-2 py-1.5 border" style={{backgroundColor: cardBg, borderColor: isWhiteCard ? 'rgba(232,224,200,0.8)' : 'rgba(255,255,255,0.2)'}}>
                  <div className="text-[14px] font-extrabold leading-tight" style={{color: namaColor || (isWhiteCard ? '#1E3124' : '#ffffff')}}>{it.title}</div>
                  {it.deskripsi && <div className="text-[11px] line-clamp-2 mt-0.5 leading-snug" style={{color: descColor || (isWhiteCard ? 'rgba(30,49,36,0.7)' : 'rgba(255,255,255,0.9)')}}>{it.deskripsi}</div>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {items.length===0 && <div className="rounded-2xl border border-[#EEE8D8] bg-white p-6 text-center text-[#9A8B7A] text-sm">Belum ada foto gallery</div>}
      <DetailModal data={detail} onClose={()=>setDetail(null)} />
    </>
  )
}
