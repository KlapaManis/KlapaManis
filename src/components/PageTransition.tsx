'use client'
import { motion } from 'framer-motion'
export default function PageTransition({ children }: { children: React.ReactNode }){
  return (
    <motion.div
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
    >
      {children}
    </motion.div>
  )
}
