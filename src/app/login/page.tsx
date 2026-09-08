'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function LoginInner() {
  const sp = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(''); setLoading(true)
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) setErr(data.error || 'Gagal login')
    else router.push(sp.get('next') || '/promo/setting')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={submit} className="bg-white border rounded-2xl p-6 w-full max-w-sm space-y-3">
        <h1 className="font-semibold text-center">Login Setting Promo</h1>
        <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        {err && <div className="text-xs text-red-600 text-center">{err}</div>}
        <button disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-2 text-sm">{loading ? '...' : 'Masuk'}</button>
        <div className="text-[11px] text-slate-400 text-center">Default seed: admin@promo.local / admin123</div>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginInner /></Suspense>
}
