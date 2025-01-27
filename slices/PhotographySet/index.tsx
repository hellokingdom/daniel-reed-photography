import { Content } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import { JSX } from 'react'
import CarouselSet from '@/components/CarouselSet'
import { blurHashToDataURL } from '@/utils/blurHashToData'

export type PhotographySetProps =
  SliceComponentProps<Content.PhotographySetSlice>

async function getBlurHash(url: string | null | undefined) {
  if (!url) return undefined
  try {
    const res = await fetch(`${url}&fm=blurhash`, {
      next: { revalidate: false },
    })
    const hash = await res.text()
    return hash
  } catch (error) {
    console.error('An error occurred while fetching the image hash:', error)
    return undefined
  }
}

const PhotographySet = async ({
  slice,
}: PhotographySetProps): Promise<JSX.Element> => {
  const blurHashes = await Promise.all(
    slice.primary.images.map(async (item) => {
      const hash = await getBlurHash(item.image.url)
      return hash ? blurHashToDataURL(hash) : undefined
    })
  )

  return (
    <CarouselSet
      images={slice.primary.images}
      title={slice.primary.title ?? ''}
      blurHashes={blurHashes}
    />
  )
}

export default PhotographySet
