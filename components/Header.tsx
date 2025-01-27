'use client'

import { showAboutAtom } from '@/atoms/about'
import { useAtom } from 'jotai'

export function Header() {
  const [showAbout, setShowAbout] = useAtom(showAboutAtom)
  return (
    <header className="flex justify-between items-center px-2 pt-6 laptop:hidden z-[60] relative">
      <a
        onClick={(e) => {
          e.stopPropagation()
          setShowAbout(!showAbout)
        }}
        className="hover:underline cursor-pointer"
      >
        about
      </a>
      <div>danielreed.photography</div>
    </header>
  )
}
