'use client'
import { motion, AnimatePresence } from 'framer-motion'
type Data = { title:string, image:string|null, desc?:string|null, price?:string|null }
export default function DetailModal({ data, onClose }: { data: Data|null, onClose: ()=>void }){
  return (
    <AnimatePresence>
      {data && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ y: 20, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }} className="relative bg-white rounded-2xl overflow-hidden max-w-md w-full shadow-2xl">
            {data.image ? <img src={data.image} alt={data.title} className="w-full h-64 object-cover" /> : <div className="h-32 bg-stone-100 grid place-items-center text-stone-400">No image</div>}
            <div className="p-4">
              <div className="font-bold text-[#1E3124] text-lg">{data.title}</div>
              {data.desc && <div className="text-sm text-[#6b5d4d] mt-1">{data.desc}</div>}
              {data.price && <div className="text-sm font-semibold text-[#1E3124] mt-2">{data.price}</div>}
            </div>
            <button onClick={onClose} className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 grid place-items-center">×</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
