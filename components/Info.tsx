'use client'

import { showAboutAtom } from '@/atoms/about'
import { Text } from '@/components/Text'
import { useAtom } from 'jotai'
import { textAtom } from '@/atoms/textAtom'
import { motion } from 'framer-motion'

export function Info() {
  const [, setShowAbout] = useAtom(showAboutAtom)
  const [bloomText] = useAtom(textAtom)

  return (
    <div className="fixed w-full h-full z-50 inset-0 pointer-events-none p-2 hidden laptop:flex">
      <div className="w-1/2 h-full flex flex-col justify-center items-start">
        <Text />
      </div>
      <div className="w-1/2 h-full flex flex-col justify-center items-end">
        <motion.div
          key="text"
          initial={{ opacity: 0 }}
          animate={{ opacity: bloomText.isLoaded ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="flex gap-x-4"
        >
          <div>Daniel Reed</div>
          <a
            className=" pointer-events-auto cursor-pointer hover:text-black/50"
            onClick={() => setShowAbout(true)}
          >
            About
          </a>
        </motion.div>
      </div>
    </div>
  )
}
