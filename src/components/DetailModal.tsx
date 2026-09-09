'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
type Data = { title:string, image:string|null, images?:string[], desc?:string|null, price?:string|null }
export default function DetailModal({ data, onClose }: { data: Data|null, onClose: ()=>void }){
  const [imgIdx, setImgIdx] = useState(0)
  const allImages = data ? [data.image, ...(data.images||[])].filter(Boolean) as string[] : []
  const currentImg = allImages[imgIdx] || data?.image

  useEffect(()=>{ setImgIdx(0) }, [data?.title])

  return (
    <AnimatePresence>
      {data && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
          <div className="absolute inset-0 bg-black/70" />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
            className="relative z-10 bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden max-w-md w-full shadow-2xl mx-2 mb-0 sm:mb-0"
            onClick={e=>e.stopPropagation()}
          >
            <div className="relative">
              {currentImg ? <img src={currentImg} alt={data.title} className="w-full h-64 object-cover" /> : <div className="h-32 bg-stone-100 grid place-items-center text-stone-400">No image</div>}

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
            <div className="p-4">
              <div className="font-bold text-[#1E3124] text-lg">{data.title}</div>
              {data.desc && <div className="text-sm text-[#6b5d4d] mt-1">{data.desc}</div>}
              {data.price && <div className="text-sm font-semibold text-[#1E3124] mt-2">{data.price}</div>}
            </div>
            <button onClick={onClose} className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 grid place-items-center">×</button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
