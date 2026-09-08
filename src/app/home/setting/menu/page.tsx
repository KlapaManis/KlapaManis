'use client'
import { useEffect, useState } from 'react'

type Row = { id:number,nama:string,deskripsi:string|null,photoUrl:string|null,kategori:string,harga:number,diskon:number,isRecommended:number,isNew:number,urutan:number,aktif:number }

export default function MenuSettingPage(){
  const [rows,setRows]=useState<Row[]>([])
  const [form,setForm]=useState<any>({nama:'',kategori:'Makanan',harga:0,diskon:0,deskripsi:'',photoUrl:'',isRecommended:false,isNew:false,aktif:1})
  const [editId,setEditId]=useState<number|null>(null)
  const [uploading,setUploading]=useState(false)

  async function load(){ const r=await fetch('/api/menu'); const j=await r.json(); setRows(j.rows||[]) }
  useEffect(()=>{load()},[])

  async function uploadFile(f:File){
    setUploading(true)
    const fd=new FormData(); fd.append('file',f)
    const r=await fetch('/api/upload',{method:'POST',body:fd})
    const j=await r.json()
    setUploading(false)
    if(j.url) setForm((s:any)=>({...s,photoUrl:j.url}))
  }

  async function submit(e:React.FormEvent){
    e.preventDefault()
    const payload={...form, harga:Number(form.harga), diskon:Number(form.diskon)}
    const url=editId?`/api/menu/${editId}`:'/api/menu'
    const method=editId?'PUT':'POST'
    const r=await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    if(!r.ok){ alert((await r.json()).error); return }
    setForm({nama:'',kategori:'Makanan',harga:0,diskon:0,deskripsi:'',photoUrl:'',isRecommended:false,isNew:false,aktif:1}); setEditId(null); load()
  }
  async function del(id:number){ if(!confirm('Hapus?'))return; await fetch(`/api/menu/${id}`,{method:'DELETE'}); load() }
  function edit(r:Row){ setEditId(r.id); setForm({nama:r.nama,kategori:r.kategori,harga:r.harga,diskon:r.diskon,deskripsi:r.deskripsi||'',photoUrl:r.photoUrl||'',isRecommended:!!r.isRecommended,isNew:!!r.isNew,aktif:r.aktif}) }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="font-semibold">Kelola Menu — harga tetap</h1>
      <form onSubmit={submit} className="bg-white border rounded-xl p-4 grid sm:grid-cols-2 gap-3">
        <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Nama" value={form.nama} onChange={e=>setForm({...form,nama:e.target.value})} required />
        <select className="border rounded-lg px-3 py-2 text-sm" value={form.kategori} onChange={e=>setForm({...form,kategori:e.target.value})}>
          <option>Makanan</option><option>Minuman</option><option>Paket</option><option>Lainnya</option>
        </select>
        <input type="number" className="border rounded-lg px-3 py-2 text-sm" placeholder="Harga (Rp)" value={form.harga} onChange={e=>setForm({...form,harga:e.target.value})} required />
        <input type="number" min={0} max={100} className="border rounded-lg px-3 py-2 text-sm" placeholder="Diskon %" value={form.diskon} onChange={e=>setForm({...form,diskon:e.target.value})} />
        <input className="border rounded-lg px-3 py-2 text-sm sm:col-span-2" placeholder="Photo URL atau upload" value={form.photoUrl} onChange={e=>setForm({...form,photoUrl:e.target.value})} />
        <div className="sm:col-span-2 flex gap-2 items-center">
          <input type="file" accept="image/*" onChange={e=>{if(e.target.files?.[0])uploadFile(e.target.files[0])}} />
          {uploading && <span className="text-xs">Uploading...</span>}
          {form.photoUrl && <img src={form.photoUrl} alt="" className="h-10 w-10 object-cover rounded" />}
        </div>
        <textarea className="border rounded-lg px-3 py-2 text-sm sm:col-span-2" placeholder="Deskripsi" value={form.deskripsi} onChange={e=>setForm({...form,deskripsi:e.target.value})} rows={2} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isRecommended} onChange={e=>setForm({...form,isRecommended:e.target.checked})} /> Rekomendasi</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isNew} onChange={e=>setForm({...form,isNew:e.target.checked})} /> Baru</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.aktif} onChange={e=>setForm({...form,aktif:e.target.checked?1:0})} /> Aktif</label>
        <div className="sm:col-span-2 flex gap-2">
          <button className="bg-teal-600 text-white rounded-lg px-4 py-2 text-sm">{editId?'Update':'Tambah'}</button>
          {editId && <button type="button" onClick={()=>{setEditId(null);setForm({nama:'',kategori:'Makanan',harga:0,diskon:0,deskripsi:'',photoUrl:'',isRecommended:false,isNew:false,aktif:1})}} className="border rounded-lg px-4 py-2 text-sm">Batal</button>}
        </div>
      </form>

      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs"><tr><th className="px-3 py-2 text-left">Nama</th><th>Kategori</th><th>Harga</th><th>Diskon</th><th>Aktif</th><th></th></tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2 flex gap-2 items-center">{r.photoUrl && <img src={r.photoUrl} className="h-8 w-8 object-cover rounded" alt="" />}<span>{r.nama}</span></td>
                <td className="px-2 text-xs">{r.kategori}</td>
                <td className="px-2">Rp {r.harga.toLocaleString('id-ID')}</td>
                <td className="px-2">{r.diskon}%</td>
                <td className="px-2">{r.aktif?'Ya':'Tidak'}</td>
                <td className="px-2 flex gap-2"><button onClick={()=>edit(r)} className="text-teal-600 text-xs">Edit</button><button onClick={()=>del(r.id)} className="text-red-600 text-xs">Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length===0 && <div className="p-6 text-center text-xs text-slate-400">Belum ada menu</div>}
      </div>
    </div>
  )
}
