import { getBlurHash } from '@/utils/getBlurHash'
import { PrismicBlurImage } from './PrismicBlurImage'
import { ImageFieldImage } from '@prismicio/client'
import { PrismicNextImage } from '@prismicio/next'
import { useEffect, useState } from 'react'

export function PrismicBlurImageWrapper({
  field,
  ...imageProps
}: {
  field: ImageFieldImage
} & React.ComponentProps<typeof PrismicNextImage>) {
  const [hash, setHash] = useState<string>('')

  useEffect(() => {
    const fetchHash = async () => {
      try {
        const result = await getBlurHash(field.url || '')
        setHash(result || '')
      } catch (error) {
        console.error('Error fetching blur hash:', error)
      }
    }

    fetchHash()
  }, [field.url])

  return <PrismicBlurImage field={field} blurHash={hash} {...imageProps} />
}
