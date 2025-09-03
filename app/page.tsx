import { Metadata } from 'next'
import { SliceZone } from '@prismicio/react'

import { createClient } from '@/prismicio'
import { components } from '@/slices'
import { Info } from '@/components/Info'
import { Header } from '@/components/Header'

export default async function Page() {
  const client = createClient()
  const page = await client.getSingle('home')

  return (
    <>
      <Header />
      <div className="p-2 laptop:p-2 flex flex-col laptop:gap-y-2 gap-y-2 overflow-hidden">
        <SliceZone slices={page.data.slices} components={components} />
      </div>
      <Info />
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient()
  const page = await client.getSingle('home')

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  }
}
