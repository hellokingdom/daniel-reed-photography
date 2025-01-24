'use client'

import { showAboutAtom } from '@/atoms/about'
import { BloomText } from '@/components/BloomText'
import { useAtom } from 'jotai'

export function Info() {
  const [, setShowAbout] = useAtom(showAboutAtom)
  return (
    <div className="fixed w-full h-full z-50 inset-0 pointer-events-none p-2 hidden laptop:flex">
      <div className="w-1/2 h-full flex flex-col justify-center items-start">
        <BloomText />
      </div>
      <div className="w-1/2 h-full flex flex-col justify-center items-end">
        <div className="flex gap-x-4">
          <div>Daniel Reed</div>
          <a
            className=" pointer-events-auto cursor-pointer text-black/50"
            onClick={() => setShowAbout(true)}
          >
            About
          </a>
        </div>
      </div>
    </div>
  )
}
