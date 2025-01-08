'use client'

import { Content } from '@prismicio/client'
import { PrismicNextImage } from '@prismicio/next'
import { SliceComponentProps } from '@prismicio/react'
import useEmblaCarousel from 'embla-carousel-react'
import { JSX, useState, useEffect, useRef } from 'react'

export type PhotographySetProps =
  SliceComponentProps<Content.PhotographySetSlice>

const PhotographySet = ({ slice }: PhotographySetProps): JSX.Element => {
  const [emblaRef] = useEmblaCarousel({ loop: false })
  const [aspectRatios, setAspectRatios] = useState<
    Array<'portrait' | 'landscape'>
  >(Array(slice.primary.images.length).fill('portrait'))
  const portraitWidthRef = useRef<number | null>(null)

  const handleImageLoad = (index: number, img: HTMLImageElement) => {
    setAspectRatios((prevRatios: Array<'portrait' | 'landscape'>) => {
      const newRatios = [...prevRatios]
      newRatios[index] =
        img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait'
      return newRatios
    })

    // Measure the width of a portrait image
    if (
      aspectRatios[index] === 'portrait' &&
      portraitWidthRef.current === null
    ) {
      portraitWidthRef.current = img.clientWidth
    }
  }

  useEffect(() => {
    // Update landscape images' max height when portrait width is known
    if (portraitWidthRef.current !== null) {
      const landscapeImages = document.querySelectorAll('.landscape-image')
      landscapeImages.forEach((image) => {
        ;(image as HTMLImageElement).style.maxHeight =
          `${portraitWidthRef.current}px`
      })
    }
  }, [aspectRatios])

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full h-[90vh] relative"
    >
      <div className="embla absolute inset-0" ref={emblaRef}>
        <div className="embla__container h-full">
          {slice.primary.images.map((item, index) => (
            <div
              className="flex items-center justify-center h-full w-full embla__slide"
              key={index}
            >
              <div className="relative h-full aspect-square max-w-full max-h-full flex items-center justify-center">
                <div
                  className={`relative border h-full ${
                    aspectRatios[index] === 'portrait'
                      ? 'border-blue-500 aspect-[3/4]'
                      : 'border-pink-500 aspect-[6/4] flex items-center justify-center'
                  }`}
                >
                  <PrismicNextImage
                    field={item.image}
                    className={`object-contain w-full h-full ${
                      aspectRatios[index] === 'landscape'
                        ? 'landscape-image rotate-0 flex items-center justify-center'
                        : ''
                    }`}
                    onLoad={(e) =>
                      handleImageLoad(index, e.target as HTMLImageElement)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PhotographySet
