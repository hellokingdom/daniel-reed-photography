'use client'

import { useAtom } from 'jotai'
import { BloomTextAtom } from '@/atoms/BloomTextAtom'

export function BloomText() {
  const [bloomText] = useAtom(BloomTextAtom)
  return (
    <div className="flex gap-x-4">
      <span>{bloomText.text}</span>
      <span>{bloomText.position}</span>
    </div>
  )
}
