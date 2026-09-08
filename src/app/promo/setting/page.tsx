'use client'
import Link from 'next/link'

const cards = [
  { href: '/promo/setting/gallery', title: 'Gallery', desc: 'Slider foto + arah (acak/atas/bawah/kiri/kanan)' },
  { href: '/promo/setting/banner', title: 'Banner', desc: 'Slide header landing' },
  { href: '/promo/setting/promo', title: 'Promo', desc: 'Kampanye diskon' },
  { href: '/promo/setting/menu', title: 'Menu', desc: 'Kelola menu + harga tetap + foto' },
  { href: '/promo/setting/tampilan', title: 'Tampilan', desc: 'Hero & warna' },
]

export default function SettingIndex() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Setting Promo & Media</h1>
          <p className="text-xs text-slate-500">Kelola dari /promo/setting (login required)</p>
        </div>
        <Link href="/promo" className="text-xs underline">← Lihat Landing</Link>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {cards.map(c => (
          <Link key={c.href} href={c.href} className="bg-white border rounded-xl p-4 hover:border-teal-600 block">
            <div className="font-medium">{c.title}</div>
            <div className="text-xs text-slate-500">{c.desc}</div>
          </Link>
        ))}
      </div>
      <form action="/api/auth/logout" method="post">
        <button className="text-xs text-red-600 underline">Logout</button>
      </form>
    </div>
  )
}
