'use client'
import { useEffect, useState } from 'react'
type Promo={id:number,nama:string,deskripsi:string|null,tipeDiskon:string,nilaiDiskon:number,mulai:string|null,selesai:string|null,aktif:number}
type Menu={id:number,nama:string,harga:number}

export default function PromoPage(){
  const [rows,setRows]=useState<Promo[]>([])
  const [menus,setMenus]=useState<Menu[]>([])
  const [form,setForm]=useState<any>({nama:'',deskripsi:'',tipeDiskon:'persen',nilaiDiskon:0,mulai:'',selesai:'',aktif:1,menuIds:[]})
  const [editId,setEditId]=useState<number|null>(null)

  async function load(){ const r=await fetch('/api/home'); const j=await r.json(); setRows(j.rows||[]); const m=await fetch('/api/menu'); const mj=await m.json(); setMenus((mj.rows||[]).map((x:any)=>({id:x.id,nama:x.nama,harga:x.harga}))) }
  useEffect(()=>{load()},[])

  async function submit(e:React.FormEvent){
    e.preventDefault()
    const url=editId?`/api/home/${editId}`:'/api/home'
    const method=editId?'PUT':'POST'
    const r=await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,nilaiDiskon:Number(form.nilaiDiskon)})})
    if(!r.ok) return alert((await r.json()).error)
    setForm({nama:'',deskripsi:'',tipeDiskon:'persen',nilaiDiskon:0,mulai:'',selesai:'',aktif:1,menuIds:[]}); setEditId(null); load()
  }
  async function edit(id:number){
    const r=await fetch(`/api/home/${id}`); const j=await r.json();
    setEditId(id); setForm({nama:j.row.nama,deskripsi:j.row.deskripsi||'',tipeDiskon:j.row.tipeDiskon,nilaiDiskon:j.row.nilaiDiskon,mulai:j.row.mulai||'',selesai:j.row.selesai||'',aktif:j.row.aktif,menuIds:j.menuIds||[]})
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="font-semibold">Kelola Promo</h1>
      <form onSubmit={submit} className="bg-white border rounded-xl p-4 grid gap-3">
        <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Nama promo" value={form.nama} onChange={e=>setForm({...form,nama:e.target.value})} required />
        <textarea className="border rounded-lg px-3 py-2 text-sm" placeholder="Deskripsi" value={form.deskripsi} onChange={e=>setForm({...form,deskripsi:e.target.value})} rows={2} />
        <div className="grid sm:grid-cols-3 gap-3">
          <select className="border rounded-lg px-3 py-2 text-sm" value={form.tipeDiskon} onChange={e=>setForm({...form,tipeDiskon:e.target.value})}>
            <option value="persen">Persen %</option><option value="nominal">Nominal Rp</option>
          </select>
          <input type="number" className="border rounded-lg px-3 py-2 text-sm" placeholder="Nilai diskon" value={form.nilaiDiskon} onChange={e=>setForm({...form,nilaiDiskon:e.target.value})} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.aktif} onChange={e=>setForm({...form,aktif:e.target.checked?1:0})} /> Aktif</label>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input type="date" className="border rounded-lg px-3 py-2 text-sm" value={form.mulai} onChange={e=>setForm({...form,mulai:e.target.value})} />
          <input type="date" className="border rounded-lg px-3 py-2 text-sm" value={form.selesai} onChange={e=>setForm({...form,selesai:e.target.value})} />
        </div>
        <div>
          <div className="text-xs font-medium mb-1">Pilih menu untuk promo ini</div>
          <div className="border rounded-lg p-2 max-h-40 overflow-auto grid gap-1">
            {menus.map(m=>(
              <label key={m.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.menuIds.includes(m.id)} onChange={e=>{
                  setForm({...form,menuIds: e.target.checked ? [...form.menuIds,m.id] : form.menuIds.filter((x:number)=>x!==m.id)})
                }} />
                {m.nama} — Rp {m.harga.toLocaleString('id-ID')}
              </label>
            ))}
            {menus.length===0 && <span className="text-xs text-slate-400">Belum ada menu, buat dulu di Menu</span>}
          </div>
        </div>
        <div className="flex gap-2"><button className="bg-teal-600 text-white rounded-lg px-4 py-2 text-sm">{editId?'Update':'Tambah'}</button>{editId && <button type="button" onClick={()=>{setEditId(null);setForm({nama:'',deskripsi:'',tipeDiskon:'persen',nilaiDiskon:0,mulai:'',selesai:'',aktif:1,menuIds:[]})}} className="border rounded-lg px-4 py-2 text-sm">Batal</button>}</div>
      </form>

      <div className="bg-white border rounded-xl overflow-hidden">
        {rows.map(r=>(
          <div key={r.id} className="p-3 border-t first:border-0 flex justify-between items-center">
            <div><div className="font-medium text-sm">{r.nama}</div><div className="text-xs text-slate-500">{r.tipeDiskon} {r.nilaiDiskon} • {r.aktif?'Aktif':'Nonaktif'}</div></div>
            <div className="flex gap-2"><button onClick={()=>edit(r.id)} className="text-xs text-teal-600">Edit</button><button onClick={async()=>{if(confirm('Hapus?')){await fetch(`/api/home/${r.id}`,{method:'DELETE'});load()}}} className="text-xs text-red-600">Hapus</button></div>
          </div>
        ))}
        {rows.length===0 && <div className="p-6 text-center text-xs text-slate-400">Belum ada promo</div>}
      </div>
    </div>
  )
}
