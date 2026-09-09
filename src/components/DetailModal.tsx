'use client'
import { useState, useEffect } from 'react'
type Data = { title:string, image:string|null, images?:string[], desc?:string|null, price?:string|null }
export default function DetailModal({ data, onClose, imageOnly=false }: { data: Data|null, onClose: ()=>void, imageOnly?: boolean }){
  const [imgIdx, setImgIdx] = useState(0)
  const allImages = data ? [data.image, ...(data.images||[])].filter(Boolean) as string[] : []
  const currentImg = allImages[imgIdx] || data?.image

  useEffect(()=>{ setImgIdx(0) }, [data?.title])
  useEffect(()=>{
    const handler = (e:KeyboardEvent)=>{ if(e.key==='Escape') onClose() }
    if(data) document.addEventListener('keydown', handler)
    return ()=> document.removeEventListener('keydown', handler)
  }, [data, onClose])

  if(!data) return null

  return (
    <div className="fixed inset-0 z-50" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div className="absolute inset-0 bg-black/70" onClick={onClose} style={{animation:'fadeIn 0.3s ease'}} />
      <div className={imageOnly ? "relative z-10 rounded-2xl overflow-hidden max-w-[94vw] sm:max-w-2xl w-full shadow-2xl bg-black" : "relative z-10 bg-white rounded-2xl overflow-hidden max-w-[90vw] w-full shadow-2xl"} style={{animation:'slideUp 0.4s ease'}}>
        <div className="relative">
          {currentImg ? <img src={currentImg} alt={data.title} className={imageOnly ? "w-full h-[75vh] object-cover" : "w-full h-64 object-cover"} /> : <div className="h-32 bg-stone-100 grid place-items-center text-stone-400">No image</div>}

          {allImages.length > 1 && (
            <>
              {imgIdx > 0 && <button onClick={()=>setImgIdx(i=>i-1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 grid place-items-center z-10">‹</button>}
              {imgIdx < allImages.length-1 && <button onClick={()=>setImgIdx(i=>i+1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 grid place-items-center z-10">›</button>}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {allImages.map((_,i)=><button key={i} onClick={()=>setImgIdx(i)} className={`h-1.5 rounded-full transition-all ${i===imgIdx?'w-5 bg-white':'w-1.5 bg-white/60'}`} />)}
              </div>
            </>
          )}
        </div>
        {!imageOnly && (
        <div className="p-4">
          <div className="font-bold text-[#1E3124] text-lg">{data.title}</div>
          {data.desc && <div className="text-sm text-[#6b5d4d] mt-1">{data.desc}</div>}
          {data.price && <div className="text-sm font-semibold text-[#1E3124] mt-2">{data.price}</div>}
        </div>
        )}
        <button onClick={onClose} className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 grid place-items-center text-lg leading-none">×</button>
      </div>
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}
