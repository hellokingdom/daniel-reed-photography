'use client'

import { useAtom } from 'jotai'
import { textAtom } from '@/atoms/textAtom'
import { motion } from 'framer-motion'

export function Text() {
  const [bloomText] = useAtom(textAtom)

  return (
    <motion.div
      key="text"
      initial={{ opacity: 0 }}
      animate={{ opacity: bloomText.isLoaded ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex gap-x-4"
    >
      <span>{bloomText.text}</span>
      <span>{bloomText.position}</span>
    </motion.div>
  )
}
