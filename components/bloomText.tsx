'use client'

import { useAtom } from 'jotai'
import { bloomTextAtom } from '@/atoms/bloomTextAtom'

export function BloomText() {
  const [bloomText] = useAtom(bloomTextAtom)
  return (
    <div className="flex gap-x-4">
      <span>{bloomText.text}</span>
      <span>{bloomText.position}</span>
    </div>
  )
}
