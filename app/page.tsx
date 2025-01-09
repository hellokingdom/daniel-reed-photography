import { Metadata } from 'next'
import { SliceZone } from '@prismicio/react'

import { createClient } from '@/prismicio'
import { components } from '@/slices'
import { BloomText } from '@/components/bloomText'

export default async function Page() {
  const client = createClient()
  const page = await client.getSingle('home')

  return (
    <>
      <header className="flex justify-between items-center px-2 pt-6 laptop:hidden">
        <div>about</div>
        <div>danielreed.photography</div>
      </header>
      <div className="p-2 laptop:p-2 flex flex-col laptop:gap-y-2 gap-y-2">
        <SliceZone slices={page.data.slices} components={components} />
      </div>
      <div className="fixed w-full h-full z-50 inset-0 pointer-events-none p-2 hidden laptop:flex">
        <div className="w-1/2 h-full flex flex-col justify-center items-start">
          <BloomText />
        </div>
        <div className="w-1/2 h-full flex flex-col justify-center items-end">
          <a className=" pointer-events-auto cursor-pointer">
            danielreed.photography
          </a>
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
