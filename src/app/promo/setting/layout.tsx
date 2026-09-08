import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySession, COOKIE_NAME } from '@/lib/auth'

export default async function SettingLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) redirect('/login?next=/promo/setting')
  const payload = await verifySession(token)
  if (!payload) redirect('/login?next=/promo/setting')
  return <div className="min-h-screen bg-slate-50">{children}</div>
}
