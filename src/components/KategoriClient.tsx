'use client'
import { useState } from 'react'
import DetailModal from './DetailModal'
type Item = { id:number, nama:string, deskripsi:string|null, photoUrl:string|null, videoUrl?:string|null, harga:number, diskon:number|null, kategori:string, photos?:string[] }

export default function KategoriClient({ items, cardBg, cardShadow, titleShadow, descShadow, isWhiteCard, namaColor, descColor, cardShow=true }: {
  items: Item[], cardBg:string, cardShadow:string, titleShadow:string, descShadow:string, isWhiteCard:boolean, namaColor?:string, descColor?:string, cardShow?:boolean
}){
  const [detail,setDetail]=useState<{title:string,image:string|null,images?:string[],desc?:string|null,price?:string|null}|null>(null)
  return (
    <>
      <div className="space-y-3">
        {items.map(it=>{
          const hasDiskon=(it.diskon||0)>0
          const disc=hasDiskon?Math.round(it.harga*(1-it.diskon!/100)):null
          const showHarga = Number(it.harga) !== 0
          const price = showHarga ? (hasDiskon ? `Rp ${disc!.toLocaleString('id-ID')} (dari Rp ${it.harga.toLocaleString('id-ID')})` : `Rp ${it.harga.toLocaleString('id-ID')}`) : null
          return <ItemCard key={it.id} it={it} price={price} cardBg={cardBg} cardShadow={cardShadow} titleShadow={titleShadow} descShadow={descShadow} isWhiteCard={isWhiteCard} namaColor={namaColor} descColor={descColor} cardShow={cardShow} onDetail={()=>setDetail({title:it.nama, image:it.photoUrl, images:it.photos, desc:it.deskripsi, price})} />
        })}
      </div>
      <DetailModal data={detail} onClose={()=>setDetail(null)} />
    </>
  )
}

function ItemCard({ it, price, cardBg, cardShadow, titleShadow, descShadow, isWhiteCard, namaColor, descColor, cardShow, onDetail }: {
  it: Item, price: string|null, cardBg: string, cardShadow: string, titleShadow: string, descShadow: string, isWhiteCard: boolean, namaColor?: string, descColor?: string, cardShow: boolean, onDetail: ()=>void
}){
  const allImages = [it.photoUrl, ...(it.photos||[])].filter(Boolean) as string[]
  const [imgIdx, setImgIdx] = useState(0)
  const currentImg = allImages[imgIdx] || it.photoUrl

  return (
    <div onClick={onDetail} className="relative h-[350px] rounded-2xl overflow-hidden bg-stone-900 cursor-pointer" style={{boxShadow: '0 10px 30px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'}}>
      {currentImg ? <img src={currentImg} alt={it.nama} className="absolute inset-0 w-full h-full object-cover" /> : <div className="absolute inset-0 grid place-items-center bg-stone-100 text-stone-400 text-sm">No image</div>}
      {it.videoUrl && <video src={it.videoUrl} className="absolute inset-0 w-full h-full object-cover" muted loop playsInline />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {allImages.length > 1 && (
        <div className="absolute inset-0 flex" onClick={e=>e.stopPropagation()}>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
            {imgIdx > 0 && <button onClick={()=>setImgIdx(i=>i-1)} className="bg-black/40 text-white rounded-full w-7 h-7 grid place-items-center text-xs">‹</button>}
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
            {imgIdx < allImages.length-1 && <button onClick={()=>setImgIdx(i=>i+1)} className="bg-black/40 text-white rounded-full w-7 h-7 grid place-items-center text-xs">›</button>}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {allImages.map((_,i)=><button key={i} onClick={(e)=>{e.stopPropagation(); setImgIdx(i)}} className={`h-1.5 rounded-full transition-all ${i===imgIdx?'w-5 bg-white':'w-1.5 bg-white/60'}`} />)}
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4">
        {cardShow ? (
          <div className="inline-block backdrop-blur-md rounded-xl px-3 py-2 border" style={{backgroundColor: cardBg, borderColor: isWhiteCard ? 'rgba(232,224,200,0.8)' : 'rgba(255,255,255,0.2)'}}>
            <div className="text-[22px] font-extrabold leading-tight tracking-tight" style={{color: namaColor || (isWhiteCard ? '#1E3124' : '#ffffff'), textShadow: isWhiteCard ? 'none' : titleShadow}}>{it.nama}</div>
            {it.deskripsi && <div className="text-[13px] line-clamp-2 mt-1 leading-snug" style={{color: descColor || (isWhiteCard ? 'rgba(30,49,36,0.7)' : 'rgba(255,255,255,0.9)'), textShadow: isWhiteCard ? 'none' : descShadow}}>{it.deskripsi}</div>}
          </div>
        ) : (
          <>
            <div className="text-[22px] font-extrabold leading-tight tracking-tight" style={{color: namaColor || (isWhiteCard ? '#1E3124' : '#ffffff'), textShadow: isWhiteCard ? 'none' : titleShadow}}>{it.nama}</div>
            {it.deskripsi && <div className="text-[13px] line-clamp-2 mt-1 leading-snug" style={{color: descColor || (isWhiteCard ? 'rgba(30,49,36,0.7)' : 'rgba(255,255,255,0.9)'), textShadow: isWhiteCard ? 'none' : descShadow}}>{it.deskripsi}</div>}
          </>
        )}
        {Number(it.harga) !== 0 && <div className="mt-2 text-[15px] font-extrabold text-white" style={{textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>{price}</div>}
      </div>
    </div>
  )
}
