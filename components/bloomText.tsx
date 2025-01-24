'use client'

import { useAtom } from 'jotai'
import { bloomTextAtom } from '@/atoms/BloomTextAtom'

export function BloomText() {
  const [bloomText] = useAtom(bloomTextAtom)
  return (
    <div className="flex gap-x-4">
      <span>{bloomText.text}</span>
      <span>{bloomText.position}</span>
    </div>
  )
}
