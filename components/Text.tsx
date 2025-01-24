'use client'

import { useAtom } from 'jotai'
import { textAtom } from '@/atoms/textAtom'

export function Text() {
  const [bloomText] = useAtom(textAtom)
  return (
    <div className="flex gap-x-4">
      <span>{bloomText.text}</span>
      <span>{bloomText.position}</span>
    </div>
  )
}
