'use client'
import { AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PromoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <div key={pathname} className="min-h-screen">{children}</div>
    </AnimatePresence>
  )
}
