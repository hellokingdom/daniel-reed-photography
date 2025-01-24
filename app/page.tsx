import { Metadata } from 'next'
import { SliceZone } from '@prismicio/react'

import { createClient } from '@/prismicio'
import { components } from '@/slices'
import { BloomText } from '@/components/bloomText'

function Info() {
  return (
    <div className="fixed w-full h-full z-50 inset-0 pointer-events-none p-2 hidden laptop:flex">
      <div className="w-1/2 h-full flex flex-col justify-center items-start">
        <BloomText />
      </div>
      <div className="w-1/2 h-full flex flex-col justify-center items-end">
        <div className="flex gap-x-4">
          <div>Daniel Reed</div>
          <a className=" pointer-events-auto cursor-pointer text-black/50">
            About
          </a>
        </div>
      </div>
    </div>
  )
}

function About() {
  return (
    <div className="fixed w-full h-full z-50 inset-0 pointer-events-none p-2 bg-white hidden">
      <div className="w-1/2 h-full flex flex-col justify-center items-start">
        <div className="text-sm">
          Designer & Photographer, MCR.{' '}
          <a href="mailto:hello@danielreed.photography">
            hello@danielreed.photography
          </a>
          ,{' '}
          <a href="https://www.instagram.com/danielreed.photography">
            Instagram
          </a>
          .
        </div>
      </div>
      <div className="flex-1 h-full flex flex-col justify-center items-end">
        <div className="bg-blue-500 aspect-[394/524] w-[394px]"></div>
      </div>
      <div className="w-1/2 h-full flex flex-col justify-center items-end">
        <div className="flex gap-x-4">
          <div>Daniel Reed</div>
          <a className=" pointer-events-auto cursor-pointer text-black/50">
            About
          </a>
        </div>
      </div>
    </div>
  )
}

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
      <Info />
      <About />
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
