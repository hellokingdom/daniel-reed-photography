'use client'

import { useAtom } from 'jotai'
import { bloomTextAtom } from '@/atoms/bloomTextAtom'

export function BloomText() {
  const [bloomText] = useAtom(bloomTextAtom)
  return <div>{bloomText}</div>
}
