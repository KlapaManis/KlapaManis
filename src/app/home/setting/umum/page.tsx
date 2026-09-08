'use client'
import { useEffect, useState } from 'react'

export default function UmumPage(){
  const [form,setForm]=useState<Record<string,string>>({})
  const [saved,setSaved]=useState(false)
  const [uploading,setUploading]=useState(false)

  async function load(){ const r=await fetch('/api/settings'); const j=await r.json(); setForm(j.settings||{}) }
  useEffect(()=>{load()},[])

  async function save(e:React.FormEvent){
    e.preventDefault()
    const payload:Record<string,string>={
      'site.title': form['site.title']||'',
      'site.description': form['site.description']||'',
      'site.favicon_url': form['site.favicon_url']||'',
    }
    const r=await fetch('/api/settings',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    if(r.ok){ setSaved(true); setTimeout(()=>setSaved(false),2000) }
  }

  async function upload(file:File){
    setUploading(true)
    const fd=new FormData(); fd.append('file',file)
    const r=await fetch('/api/upload',{method:'POST',body:fd})
    const j=await r.json()
    if(j.url) setForm(f=>({...f,'site.favicon_url':j.url}))
    setUploading(false)
  }

  const get=(k:string)=>form[k]||''
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}))

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="font-semibold">Umum — Judul & Logo Tab Browser</h1>
      <p className="text-xs text-slate-500">Ini yang tampil di tab browser seperti screenshot kamu (title + favicon). Ganti di sini, simpan, lalu refresh tab.</p>
      <form onSubmit={save} className="space-y-3">
        <div className="bg-white border rounded-xl p-4 space-y-3">
          <label className="block text-xs font-medium">Judul Tab Browser (site.title)
            <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" placeholder="Contoh: Menu Book Kompro" value={get('site.title')} onChange={e=>set('site.title',e.target.value)} />
          </label>
          <label className="block text-xs font-medium">Deskripsi (site.description)
            <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" placeholder="Deskripsi singkat untuk SEO" value={get('site.description')} onChange={e=>set('site.description',e.target.value)} />
          </label>
          <label className="block text-xs font-medium">Favicon / Logo Tab (site.favicon_url)
            <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" placeholder="https://... atau /uploads/xxx.png" value={get('site.favicon_url')} onChange={e=>set('site.favicon_url',e.target.value)} />
          </label>
          <div className="flex items-center gap-3">
            <label className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg cursor-pointer">
              {uploading?'Uploading...':'Upload Logo'}
              <input type="file" accept="image/*,.ico" className="hidden" onChange={e=>{if(e.target.files?.[0])upload(e.target.files[0])}} />
            </label>
            {get('site.favicon_url') && <img src={get('site.favicon_url')} alt="favicon preview" className="w-8 h-8 object-contain border rounded bg-white p-1" />}
            {get('site.favicon_url') && <button type="button" onClick={()=>set('site.favicon_url','')} className="text-xs text-red-600 underline">Hapus</button>}
          </div>
          <p className="text-[11px] text-slate-400">Rekomendasi: PNG/ICO kotak 512x512. Setelah upload, URL terisi otomatis.</p>
        </div>
        <button className="w-full bg-teal-600 text-white rounded-lg px-4 py-2 text-sm">Simpan {saved && '✓'}</button>
      </form>
      <a href="/home" className="text-xs underline">← Kembali ke Setting</a>
    </div>
  )
}
