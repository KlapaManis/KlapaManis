'use client'
import { useEffect, useState } from 'react'

function hexToRgba(hex:string, a:number){ const h=hex.replace('#',''); const r=parseInt(h.length===3?h[0]+h[0]:h.slice(0,2),16); const g=parseInt(h.length===3?h[1]+h[1]:h.slice(2,4),16); const b=parseInt(h.length===3?h[2]+h[2]:h.slice(4,6),16); return `rgba(${r},${g},${b},${a})` }
function shadowColor(s:string){ const m=s.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,6}/); return m? (m[0].startsWith('#')?m[0]: rgbToHex(m[0])) : '#000000' }
function rgbToHex(rgb:string){ const m=rgb.match(/\d+/g); if(!m) return '#000000'; const [r,g,b]=m.map(Number); return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('') }
function ColorField({ label, value, onChange }: { label: string, value: string, onChange: (v:string)=>void }){
  const v = value || '#ffffff'
  const isHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)
  return (
    <label className="flex items-center gap-2 border border-[#EEE8D8] rounded-xl p-2 bg-white">
      <span className="w-36 text-xs text-[#1E3124] shrink-0">{label}</span>
      <input type="color" value={isHex ? v : '#ffffff'} onChange={e=>onChange(e.target.value)} className="w-10 h-8 rounded border border-slate-300 shrink-0" />
      <input type="text" value={value||''} onChange={e=>onChange(e.target.value)} placeholder="#RRGGBB atau rgba(...)" className="flex-1 border rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-teal-600" />
    </label>
  )
}

export default function TampilanPage(){
  const [form,setForm]=useState<Record<string,string>>({})
  const [saved,setSaved]=useState(false)
  async function load(){ const r=await fetch('/api/settings'); const j=await r.json(); setForm(j.settings||{}) }
  useEffect(()=>{load()},[])
  async function save(e:React.FormEvent){
    e.preventDefault()
    const r=await fetch('/api/settings',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    if(r.ok){ setSaved(true); setTimeout(()=>setSaved(false),2000) }
  }
  async function upload(f:File){
    const fd=new FormData(); fd.append('file',f)
    const r=await fetch('/api/upload',{method:'POST',body:fd}); const j=await r.json(); if(j.url) setForm({...form,'promo_landing.hero_image':j.url})
  }
  const get = (k:string, def='') => form[k] || def
  const set = (k:string,v:string) => setForm({...form,[k]:v})

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="font-semibold">Tampilan — mirip pos/promo referensi</h1>
      <p className="text-xs text-slate-500">Pilih warna via picker atau ketik RGB/Hex/rgba. Kosong = default.</p>
      <form onSubmit={save} className="space-y-3">
        <div className="bg-white border rounded-xl p-3 space-y-2">
          <div className="text-xs font-semibold">Hero</div>
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Judul Hero" value={get('promo_landing.hero_title')} onChange={e=>set('promo_landing.hero_title',e.target.value)} />
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Subtitle Hero" value={get('promo_landing.hero_subtitle')} onChange={e=>set('promo_landing.hero_subtitle',e.target.value)} />
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Hero Image URL" value={get('promo_landing.hero_image')} onChange={e=>set('promo_landing.hero_image',e.target.value)} />
          <input type="file" accept="image/*" onChange={e=>{if(e.target.files?.[0])upload(e.target.files[0])}} />
          {get('promo_landing.hero_image') && <img src={get('promo_landing.hero_image')} className="h-32 object-cover rounded-lg" alt="" />}
        </div>

        <div className="bg-white border rounded-xl p-3 space-y-2">
          <div className="text-xs font-semibold">Background & Card</div>
          <ColorField label="Background page" value={get('promo_landing.bg_color')} onChange={v=>set('promo_landing.bg_color',v)} />
          <ColorField label="Warna card menu" value={get('promo_landing.menu_card_bg')} onChange={v=>set('promo_landing.menu_card_bg',v)} />
          <ColorField label="Border card" value={get('promo_landing.cardBorderColor')||get('promo_landing.menu_card_shadow')} onChange={v=>set('promo_landing.cardBorderColor',v)} />
          <label className="flex items-center gap-2 text-xs"><span className="w-36 shrink-0">Overlay pekat</span><input type="range" min="0.1" max="0.85" step="0.05" value={get('promo_landing.menu_card_overlay')||'0.45'} onChange={e=>set('promo_landing.menu_card_overlay',e.target.value)} className="flex-1" /><span>{get('promo_landing.menu_card_overlay')||'0.45'}</span></label>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={get('promo_landing.menu_card_show')!=='0'} onChange={e=>set('promo_landing.menu_card_show',e.target.checked?'1':'0')} /> Tampilkan card judul</label>
        </div>

        <div className="bg-white border rounded-xl p-3 space-y-2">
          <div className="text-xs font-semibold">Warna Header & Harga</div>
          <ColorField label="Header Promo" value={get('promo_landing.promoHeaderBg')} onChange={v=>set('promo_landing.promoHeaderBg',v)} />
          <ColorField label="Header Menu" value={get('promo_landing.menuHeaderBg')} onChange={v=>set('promo_landing.menuHeaderBg',v)} />
          <ColorField label="Badge diskon" value={get('promo_landing.promoDiscountBg')} onChange={v=>set('promo_landing.promoDiscountBg',v)} />
          <ColorField label="Harga menu" value={get('promo_landing.menuPriceColor')} onChange={v=>set('promo_landing.menuPriceColor',v)} />
          <ColorField label="Garis pemisah" value={get('promo_landing.dividerColor')} onChange={v=>set('promo_landing.dividerColor',v)} />
        </div>

        <div className="bg-white border rounded-xl p-3 space-y-2">
          <div className="text-xs font-semibold">Font Card</div>
          <ColorField label="Nama promo" value={get('promo_landing.promoCardTextColor')} onChange={v=>set('promo_landing.promoCardTextColor',v)} />
          <ColorField label="Deskripsi promo" value={get('promo_landing.promoCardDescriptionColor')} onChange={v=>set('promo_landing.promoCardDescriptionColor',v)} />
          <ColorField label="Harga promo" value={get('promo_landing.promoCardPriceColor')} onChange={v=>set('promo_landing.promoCardPriceColor',v)} />
          <ColorField label="Nama menu" value={get('promo_landing.menuCardTextColor')} onChange={v=>set('promo_landing.menuCardTextColor',v)} />
          <ColorField label="Deskripsi menu" value={get('promo_landing.menuDescColor')} onChange={v=>set('promo_landing.menuDescColor',v)} />
          <ColorField label="Caption menu" value={get('promo_landing.menuCaptionColor')} onChange={v=>set('promo_landing.menuCaptionColor',v)} />
        </div>

        <div className="bg-white border rounded-xl p-3 space-y-2">
          <div className="text-xs font-semibold">Shadow</div>
          <ColorField label="Shadow card" value={get('promo_landing.menu_card_shadow_color')||'#000000'} onChange={v=>{ set('promo_landing.menu_card_shadow_color',v); const c=v; set('promo_landing.menu_card_shadow',`0 20px 40px ${hexToRgba(c,0.35)},0 8px 16px ${hexToRgba(c,0.25)}` ) }} />
          <label className="text-xs">Shadow card (CSS) <input className="w-full border rounded-lg px-3 py-1.5 text-xs" value={get('promo_landing.menu_card_shadow')} onChange={e=>set('promo_landing.menu_card_shadow',e.target.value)} placeholder="0 20px 40px rgba(0,0,0,0.35)" /></label>
          <ColorField label="Shadow judul" value={shadowColor(get('promo_landing.title_shadow'))} onChange={v=>set('promo_landing.title_shadow',`0 3px 12px ${hexToRgba(v,0.9)}`)} />
          <label className="text-xs">Shadow judul (CSS) <input className="w-full border rounded-lg px-3 py-1.5 text-xs" value={get('promo_landing.title_shadow')} onChange={e=>set('promo_landing.title_shadow',e.target.value)} /></label>
          <ColorField label="Shadow deskripsi" value={shadowColor(get('promo_landing.desc_shadow'))} onChange={v=>set('promo_landing.desc_shadow',`0 2px 8px ${hexToRgba(v,0.8)}`)} />
          <label className="text-xs">Shadow deskripsi (CSS) <input className="w-full border rounded-lg px-3 py-1.5 text-xs" value={get('promo_landing.desc_shadow')} onChange={e=>set('promo_landing.desc_shadow',e.target.value)} /></label>
        </div>

        <div className="bg-white border rounded-xl p-3 space-y-2">
          <div className="text-xs font-semibold">Tombol Kategori</div>
          <ColorField label="Aktif bg" value={get('promo_landing.categoryActiveBg')} onChange={v=>set('promo_landing.categoryActiveBg',v)} />
          <ColorField label="Aktif text" value={get('promo_landing.categoryActiveText')} onChange={v=>set('promo_landing.categoryActiveText',v)} />
          <ColorField label="Nonaktif bg" value={get('promo_landing.categoryInactiveBg')} onChange={v=>set('promo_landing.categoryInactiveBg',v)} />
          <ColorField label="Nonaktif text" value={get('promo_landing.categoryInactiveText')} onChange={v=>set('promo_landing.categoryInactiveText',v)} />
          <ColorField label="Nonaktif border" value={get('promo_landing.categoryInactiveBorder')} onChange={v=>set('promo_landing.categoryInactiveBorder',v)} />
        </div>

        <div className="bg-white border rounded-xl p-3 space-y-2">
          <div className="text-xs font-semibold">Gallery Slider</div>
          <label className="text-xs flex gap-2 items-center">Arah <select value={get('promo_landing.gallery_transition')||'acak'} onChange={e=>set('promo_landing.gallery_transition',e.target.value)} className="border rounded-lg px-2 py-1"><option value="acak">Acak</option><option value="kiri">Kiri</option><option value="kanan">Kanan</option><option value="atas">Atas</option><option value="bawah">Bawah</option><option value="kiri-kanan">Kiri-Kanan</option><option value="atas-bawah">Atas-Bawah</option></select></label>
          <label className="text-xs flex gap-2 items-center">Interval <select value={get('promo_landing.gallery_interval')||'3000'} onChange={e=>set('promo_landing.gallery_interval',e.target.value)} className="border rounded-lg px-2 py-1"><option value="2000">2s</option><option value="3000">3s</option><option value="5000">5s</option></select></label>
        </div>

        <button className="w-full bg-teal-600 text-white rounded-lg px-4 py-2 text-sm">Simpan {saved && '✓'}</button>
      </form>
      <a href="/promo" className="text-xs underline">Lihat landing →</a>
    </div>
  )
}
