'use client'

import { Content } from '@prismicio/client'
import { PrismicNextImage } from '@prismicio/next'
import { SliceComponentProps } from '@prismicio/react'
import useEmblaCarousel from 'embla-carousel-react'
import { JSX, useState, useEffect, useRef, useCallback } from 'react'
import Fade from 'embla-carousel-fade'

export type PhotographySetProps =
  SliceComponentProps<Content.PhotographySetSlice>

const PhotographySet = ({ slice }: PhotographySetProps): JSX.Element => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade()])
  const [aspectRatios, setAspectRatios] = useState<
    Array<'portrait' | 'landscape'>
  >(Array(slice.primary.images.length).fill('portrait'))
  const portraitWidthRef = useRef<number | null>(null)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, currentTarget } = event
    const { left, width } = currentTarget.getBoundingClientRect()
    const clickPosition = clientX - left

    if (clickPosition < width / 2) {
      scrollPrev()
    } else {
      scrollNext()
    }
  }

  const handleImageLoad = (index: number, img: HTMLImageElement) => {
    setAspectRatios((prevRatios: Array<'portrait' | 'landscape'>) => {
      const newRatios = [...prevRatios]
      newRatios[index] =
        img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait'
      return newRatios
    })

    // Measure the width of a portrait image or use the first image as a fallback
    if (portraitWidthRef.current === null) {
      portraitWidthRef.current = img.clientWidth
    }

    // Make the image visible after it has been loaded
    img.style.visibility = 'visible'
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
      onClick={handleClick}
    >
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {slice.primary.images.map((item, index) => (
            <div
              className="embla__slide flex items-center justify-center"
              key={`${slice.primary.title}-${index}`}
            >
              <div
                className={`relative flex items-center justify-center border ${
                  aspectRatios[index] === 'portrait'
                    ? 'aspect-[3/4] w-[800px]'
                    : 'aspect-[6/4] h-[800px]'
                }`}
              >
                <PrismicNextImage
                  field={item.image}
                  className={`object-cover w-full h-full block ${
                    aspectRatios[index] === 'landscape' ? '' : ''
                  }`}
                  style={{ visibility: 'hidden' }}
                  onLoad={(e) =>
                    handleImageLoad(index, e.target as HTMLImageElement)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PhotographySet
