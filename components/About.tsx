'use client'

import { useAtom } from 'jotai'
import { showAboutAtom } from '../atoms/about' // You'll need to create this file
import { motion, AnimatePresence } from 'framer-motion' // For animation

export function About() {
  const [showAbout, setShowAbout] = useAtom(showAboutAtom)

  return (
    <AnimatePresence>
      {showAbout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed w-full h-full z-50 inset-0 p-2 bg-white flex cursor-pointer"
        >
          <div className="w-1/2 h-full flex flex-col justify-center items-start">
            <div className="text-sm">
              Designer & Photographer, MCR.{' '}
              <a
                href="mailto:hello@danielreed.photography"
                className="hover:underline relative z-[60]"
              >
                hello@danielreed.photography
              </a>
              ,{' '}
              <a
                href="https://www.instagram.com/danielreed.photography"
                className="hover:underline relative z-[60]"
              >
                Instagram
              </a>
              .
            </div>
          </div>
          <div className="flex-1 h-full flex flex-col justify-center items-end">
            <div className="bg-blue-500 aspect-[394/524] w-[394px]"></div>
          </div>
          <div className="w-1/2 h-full flex flex-col justify-center items-end">
            <div className="flex gap-x-4">
              <div>Daniel Reed</div>
              <a className=" pointer-events-auto cursor-pointer text-black/50">
                About
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
