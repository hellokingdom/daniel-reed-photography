import { Metadata } from 'next'
import { SliceZone } from '@prismicio/react'

import { createClient } from '@/prismicio'
import { components } from '@/slices'

export default async function Page() {
  const client = createClient()
  const page = await client.getSingle('home')

  return (
    <>
      <div className="p-2 laptop:p-4 flex flex-col laptop:gap-y-8 gap-y-4">
        <SliceZone slices={page.data.slices} components={components} />
      </div>
      <div className="fixed w-full h-full flex z-50 inset-0 pointer-events-none p-8">
        <div className="w-1/2 h-full flex flex-col justify-center items-start">
          <div>Bloom [ 1/12 ]</div>
        </div>
        <div className="w-1/2 h-full flex flex-col justify-center items-end">
          <div className="">danielreed.photography</div>
        </div>
      </div>
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
