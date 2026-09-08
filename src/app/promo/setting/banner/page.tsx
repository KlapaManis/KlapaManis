'use client'
import { useEffect, useState } from 'react'
type Row={id:number,imageUrl:string,title:string|null,subtitle:string|null,linkUrl:string|null,urutan:number,aktif:number}
export default function BannerPage(){
  const [rows,setRows]=useState<Row[]>([])
  const [form,setForm]=useState<any>({imageUrl:'',title:'',subtitle:'',linkUrl:'',urutan:0,aktif:1})
  const [editId,setEditId]=useState<number|null>(null)
  async function load(){ const r=await fetch('/api/banner'); const j=await r.json(); setRows(j.rows||[]) }
  useEffect(()=>{load()},[])
  async function submit(e:React.FormEvent){ e.preventDefault(); const url=editId?`/api/banner/${editId}`:'/api/banner'; const m=editId?'PUT':'POST'; const r=await fetch(url,{method:m,headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); if(!r.ok) return alert((await r.json()).error); setForm({imageUrl:'',title:'',subtitle:'',linkUrl:'',urutan:0,aktif:1}); setEditId(null); load() }
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="font-semibold">Kelola Banner</h1>
      <form onSubmit={submit} className="bg-white border rounded-xl p-4 grid gap-3">
        <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Image URL (atau /uploads/...)" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} required />
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Subtitle" value={form.subtitle} onChange={e=>setForm({...form,subtitle:e.target.value})} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Link URL (opsional)" value={form.linkUrl} onChange={e=>setForm({...form,linkUrl:e.target.value})} />
          <input type="number" className="border rounded-lg px-3 py-2 text-sm" placeholder="Urutan" value={form.urutan} onChange={e=>setForm({...form,urutan:e.target.value})} />
        </div>
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={!!form.aktif} onChange={e=>setForm({...form,aktif:e.target.checked?1:0})} /> Aktif</label>
        <div className="flex gap-2"><button className="bg-teal-600 text-white rounded-lg px-4 py-2 text-sm">{editId?'Update':'Tambah'}</button>{editId && <button type="button" onClick={()=>{setEditId(null);setForm({imageUrl:'',title:'',subtitle:'',linkUrl:'',urutan:0,aktif:1})}} className="border rounded-lg px-4 py-2 text-sm">Batal</button>}</div>
      </form>
      <div className="bg-white border rounded-xl overflow-hidden">
        {rows.map(r=>(
          <div key={r.id} className="flex gap-3 p-3 border-t first:border-0 items-center">
            <img src={r.imageUrl} className="h-12 w-20 object-cover rounded" alt="" />
            <div className="flex-1 text-sm"><div className="font-medium">{r.title||'-'}</div><div className="text-xs text-slate-500">{r.subtitle||''}</div></div>
            <button onClick={()=>{setEditId(r.id);setForm({imageUrl:r.imageUrl,title:r.title||'',subtitle:r.subtitle||'',linkUrl:r.linkUrl||'',urutan:r.urutan,aktif:r.aktif})}} className="text-xs text-teal-600">Edit</button>
            <button onClick={async()=>{if(confirm('Hapus?')){await fetch(`/api/banner/${r.id}`,{method:'DELETE'});load()}}} className="text-xs text-red-600">Hapus</button>
          </div>
        ))}
        {rows.length===0 && <div className="p-6 text-center text-xs text-slate-400">Belum ada banner</div>}
      </div>
    </div>
  )
}
