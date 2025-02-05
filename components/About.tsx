'use client'

import { useAtom } from 'jotai'
import { showAboutAtom } from '../atoms/about' // You'll need to create this file
import { motion, AnimatePresence } from 'framer-motion' // For animation
import Image from 'next/image'
import img from '@/assets/daniel-reed.jpg'

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
          className="fixed w-full h-full z-50 inset-0 p-2 bg-black flex justify-between cursor-pointer"
          onClick={() => setShowAbout(false)}
        >
          <div
            data-column="left"
            className="tablet:flex-1 h-full flex flex-col justify-center items-start pr-4 w-10/12 tablet:w-auto"
          >
            <div className="tablet:text-nowrap laptop:text-wrap">
              Designer & Photographer, MCR.{' '}
              <a
                href="mailto:hello@danielreed.photography"
                className="hover:underline relative z-[60] hover:text-black/50"
                onClick={(e) => e.stopPropagation()}
              >
                hello@danielreed.photography
              </a>
              ,{' '}
              <a
                href="https://www.instagram.com/danielreed.photography"
                className="relative z-[60] hover:text-black/50"
                onClick={(e) => e.stopPropagation()}
              >
                Instagram
              </a>
              .
            </div>
          </div>
          <div
            data-column="middle"
            className="h-full laptop:flex flex-col justify-center items-end hidden"
          >
            <div className="bg-blue-500 aspect-[394/524] desktop:w-[394px] laptop:w-[326px] hidden laptop:block relative">
              <Image src={img} fill alt="Daniel Reed" placeholder="blur" />
            </div>
          </div>
          <div
            data-column="right"
            className="flex-1 h-full tablet:flex flex-col justify-center items-end pl-4 hidden"
          >
            <div className="flex gap-x-4">
              <div>Daniel Reed</div>
              <a className="pointer-events-auto cursor-pointer hover:text-black/50">
                About
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
