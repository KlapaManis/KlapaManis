'use client'
import { useEffect, useState } from 'react'

export default function GallerySettingPage(){
  const [banners,setBanners]=useState<any[]>([])
  const [form,setForm]=useState<any>({imageUrl:''})
  const [transition,setTransition]=useState('acak')
  const [interval,setIntervalMs]=useState('3000')

  async function load(){
    const r=await fetch('/api/banner'); const j=await r.json(); setBanners(j.rows||[])
    const s=await fetch('/api/settings'); const sj=await s.json()
    setTransition(sj.settings['promo_landing.gallery_transition']||'acak')
    setIntervalMs(sj.settings['promo_landing.gallery_interval']||'3000')
  }
  useEffect(()=>{load()},[])

  async function addBanner(e:React.FormEvent){
    e.preventDefault()
    if(!form.imageUrl) return
    await fetch('/api/banner',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({imageUrl:form.imageUrl, urutan:banners.length})})
    setForm({imageUrl:''}); load()
  }
  async function saveSettings(){
    await fetch('/api/settings',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      'promo_landing.gallery_transition': transition,
      'promo_landing.gallery_interval': interval,
    })})
    alert('Tersimpan — refresh /promo untuk lihat perubahan arah')
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="font-semibold">Gallery Slider — Setting</h1>
      <p className="text-xs text-slate-500">Hero tetap, gallery bisa slideshow dari atas/bawah/kiri/kanan/acak. Default 3 gambar sudah terpasang.</p>

      <div className="bg-white border rounded-xl p-4 grid gap-3">
        <label className="text-sm font-medium">Arah transisi</label>
        <select className="border rounded-lg px-3 py-2 text-sm" value={transition} onChange={e=>setTransition(e.target.value)}>
          <option value="acak">Acak (random kiri/kanan/atas/bawah)</option>
          <option value="kiri">Kiri → Kanan</option>
          <option value="kanan">Kanan → Kiri</option>
          <option value="atas">Atas → Bawah</option>
          <option value="bawah">Bawah → Atas</option>
          <option value="kiri-kanan">Acak Kiri/Kanan</option>
          <option value="atas-bawah">Acak Atas/Bawah</option>
        </select>
        <label className="text-sm font-medium">Interval (ms)</label>
        <select className="border rounded-lg px-3 py-2 text-sm" value={interval} onChange={e=>setIntervalMs(e.target.value)}>
          <option value="2000">2 detik</option>
          <option value="3000">3 detik</option>
          <option value="5000">5 detik</option>
          <option value="7000">7 detik</option>
        </select>
        <button onClick={saveSettings} className="bg-teal-600 text-white rounded-lg px-4 py-2 text-sm w-fit">Simpan Setting</button>
      </div>

      <form onSubmit={addBanner} className="bg-white border rounded-xl p-4 flex gap-2">
        <input className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="Image URL (https://...)" value={form.imageUrl} onChange={e=>setForm({imageUrl:e.target.value})} />
        <button className="bg-teal-600 text-white rounded-lg px-4 py-2 text-sm">Tambah</button>
      </form>
      <div className="bg-white border rounded-xl overflow-hidden">
        {banners.map((b:any)=>(
          <div key={b.id} className="flex gap-3 p-3 border-t first:border-0 items-center">
            <img src={b.imageUrl} className="h-12 w-20 object-cover rounded" alt="" />
            <div className="flex-1 text-xs truncate">{b.imageUrl}</div>
            <button onClick={async()=>{await fetch(`/api/banner/${b.id}`,{method:'DELETE'}); load()}} className="text-xs text-red-600">Hapus</button>
          </div>
        ))}
        {banners.length===0 && <div className="p-6 text-center text-xs text-slate-400">Belum ada foto</div>}
      </div>
      <a href="/promo" className="text-xs underline">← Lihat /promo</a>
    </div>
  )
}
