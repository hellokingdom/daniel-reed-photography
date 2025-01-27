'use client'

import { showAboutAtom } from '@/atoms/about'
import { useAtom } from 'jotai'

export function Header() {
  const [showAbout, setShowAbout] = useAtom(showAboutAtom)
  return (
    <header className="flex justify-between items-center px-2 pt-6 laptop:hidden z-[60] relative">
      <div>Daniel Reed</div>
      <a
        onClick={(e) => {
          e.stopPropagation()
          setShowAbout(!showAbout)
        }}
        className="cursor-pointer hover:text-black/50"
      >
        About
      </a>
    </header>
  )
}
