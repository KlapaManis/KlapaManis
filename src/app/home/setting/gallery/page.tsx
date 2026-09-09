'use client'
import { useEffect, useState } from 'react'

type GalleryRow = { id:number, imageUrl:string, title:string|null, deskripsi:string|null, urutan:number, aktif:number }

export default function GallerySettingPage(){
  const [rows,setRows]=useState<GalleryRow[]>([])
  const [form,setForm]=useState<any>({imageUrl:'',title:'',deskripsi:'',urutan:0})
  const [editId,setEditId]=useState<number|null>(null)
  const [uploading,setUploading]=useState(false)

  async function load(){ const r=await fetch('/api/gallery'); const j=await r.json(); setRows(j.rows||[]) }
  useEffect(()=>{load()},[])

  async function uploadFile(f:File){
    setUploading(true)
    const fd=new FormData(); fd.append('file',f)
    const r=await fetch('/api/upload',{method:'POST',body:fd})
    const j=await r.json()
    setUploading(false)
    if(j.url) setForm((s:any)=>({...s,imageUrl:j.url}))
  }

  async function submit(e:React.FormEvent){
    e.preventDefault()
    if(editId){
      await fetch(`/api/gallery/${editId}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    }else{
      await fetch('/api/gallery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    }
    setForm({imageUrl:'',title:'',deskripsi:'',urutan:0}); setEditId(null); load()
  }

  async function del(id:number){ if(!confirm('Hapus?'))return; await fetch(`/api/gallery/${id}`,{method:'DELETE'}); load() }
  function edit(r:GalleryRow){ setEditId(r.id); setForm({imageUrl:r.imageUrl,title:r.title||'',deskripsi:r.deskripsi||'',urutan:r.urutan??0}) }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="font-semibold">Kelola Gallery</h1>
      <form onSubmit={submit} className="bg-white border rounded-xl p-4 grid sm:grid-cols-2 gap-3">
        <input className="border rounded-lg px-3 py-2 text-sm sm:col-span-2" placeholder="Photo URL atau upload" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} />
        <div className="sm:col-span-2 flex gap-2 items-center">
          <input type="file" accept="image/*" onChange={e=>{if(e.target.files?.[0])uploadFile(e.target.files[0])}} />
          {uploading && <span className="text-xs">Uploading...</span>}
          {form.imageUrl && <img src={form.imageUrl} alt="" className="h-10 w-10 object-cover rounded" />}
        </div>
        <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Judul (opsional)" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Deskripsi (opsional)" value={form.deskripsi} onChange={e=>setForm({...form,deskripsi:e.target.value})} />
        <input type="number" className="border rounded-lg px-3 py-2 text-sm" placeholder="Urutan tampil" value={form.urutan} onChange={e=>setForm({...form,urutan:Number(e.target.value)})} />
        <div className="sm:col-span-2 flex gap-2">
          <button className="bg-teal-600 text-white rounded-lg px-4 py-2 text-sm">{editId?'Update':'Tambah'}</button>
          {editId && <button type="button" onClick={()=>{setEditId(null);setForm({imageUrl:'',title:'',deskripsi:'',urutan:0})}} className="border rounded-lg px-4 py-2 text-sm">Batal</button>}
        </div>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {rows.map(r=>(
          <div key={r.id} className="relative group bg-white border rounded-xl overflow-hidden">
            <img src={r.imageUrl} alt={r.title||''} className="w-full aspect-[3/4] object-cover" />
            <div className="absolute top-2 left-2 bg-black/60 text-white text-[11px] font-bold rounded-full px-2 py-0.5">#{r.urutan}</div>
            {r.title && <div className="px-2 py-1 text-xs font-semibold truncate">{r.title}</div>}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={()=>edit(r)} className="bg-blue-500 text-white rounded-full w-6 h-6 grid place-items-center text-xs">E</button>
              <button onClick={()=>del(r.id)} className="bg-red-500 text-white rounded-full w-6 h-6 grid place-items-center text-xs">D</button>
            </div>
          </div>
        ))}
      </div>
      {rows.length===0 && <div className="bg-white border rounded-xl p-6 text-center text-xs text-slate-400">Belum ada foto gallery</div>}
    </div>
  )
}
