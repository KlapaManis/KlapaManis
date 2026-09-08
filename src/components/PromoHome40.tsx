'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CategoryNav from './CategoryNav'

type Banner = { id:number,imageUrl:string,title:string|null }

const DIRS = ['left','right','top','bottom'] as const
type Dir = typeof DIRS[number]

function pickDir(setting: string, prev?: Dir): Dir {
  if(setting==='kiri') return 'left'
  if(setting==='kanan') return 'right'
  if(setting==='atas') return 'top'
  if(setting==='bawah') return 'bottom'
  if(setting==='kiri-kanan') return Math.random()<0.5?'left':'right'
  if(setting==='atas-bawah') return Math.random()<0.5?'top':'bottom'
  // acak
  let d: Dir
  do { d = DIRS[Math.floor(Math.random()*DIRS.length)] } while(prev && DIRS.length>1 && d===prev)
  return d
}

export default function PromoHome40({ banners, galleryTransition='acak', galleryInterval='3000' }: { groups?: any, banners: Banner[], galleryTransition?: string, galleryInterval?: string }){
  const router = useRouter()
  const [idx,setIdx]=useState(0)
  const [dir,setDir]=useState<Dir>('left')
  const [tab,setTab]=useState<''|'makanan'|'minuman'|'paket'>('')
  const interval = Math.max(1000, Number(galleryInterval)||3000)

  const go = (next: number, forcedDir?: Dir) => {
    const d = forcedDir || pickDir(galleryTransition, dir)
    setDir(d)
    setIdx(next)
  }

  useEffect(()=>{
    if(banners.length<=1) return
    const t=setInterval(()=> go((idx+1)%banners.length), interval)
    return ()=>clearInterval(t)
  },[banners.length, idx, interval, galleryTransition])

  const enterClass: Record<Dir,string> = {
    left: 'translate-x-full',
    right: '-translate-x-full',
    top: 'translate-y-full',
    bottom: '-translate-y-full',
  }

  return (
    <div className="w-full">
      {/* Gallery slider - 45% ikut scroll */}
      <div className="px-3 sm:px-4 pt-3 pb-2">
        <div className="h-[38dvh] rounded-2xl overflow-hidden bg-stone-100 border border-[#EEE8D8] relative">
          {banners.length>0 ? (
            <div className="w-full h-full relative overflow-hidden">
              {banners.map((b,i)=>(
                <img
                  key={b.id}
                  src={b.imageUrl}
                  alt={b.title||'Gallery'}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out ${i===idx ? 'translate-x-0 translate-y-0' : i < idx ? '-translate-x-full' : enterClass[dir]}`}
                  style={{ zIndex: i===idx ? 1 : 0 }}
                />
              ))}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {banners.map((_,i)=>(
                  <button key={i} onClick={()=>go(i)} className={`h-1.5 rounded-full transition-all ${i===idx?'w-5 bg-white':'w-1.5 bg-white/60'}`} />
                ))}
              </div>
              {banners.length>1 && (
                <>
                  <button onClick={()=>go((idx-1+banners.length)%banners.length, galleryTransition==='acak'? pickDir('acak') : undefined)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-7 h-7 grid place-items-center z-10">‹</button>
                  <button onClick={()=>go((idx+1)%banners.length, galleryTransition==='acak'? pickDir('acak') : undefined)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-7 h-7 grid place-items-center z-10">›</button>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-full grid place-items-center text-stone-400 text-sm p-4 text-center">Gallery slider — tambah beberapa foto di /home/setting/gallery</div>
          )}
        </div>
      </div>

      {/* Menu bawah - tidak kepotong */}
      <div className="bg-[#FAF7F2] flex items-center justify-center px-2 pt-2 pb-4">
        <CategoryNav active={tab} onSelect={(v)=>{ setTab(v.toLowerCase() as any); router.push(`/home/kategori/${v.toLowerCase()}`) }} />
      </div>
    </div>
  )
}
