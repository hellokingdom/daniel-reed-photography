'use client'

import { Content, ImageFieldImage } from '@prismicio/client'
import { PrismicNextImage } from '@prismicio/next'
import { SliceComponentProps } from '@prismicio/react'
import useEmblaCarousel from 'embla-carousel-react'
import { JSX, useState, useEffect, useRef } from 'react'
import Fade from 'embla-carousel-fade'
import { useInView } from 'framer-motion'
import { BloomTextAtom } from '@/atoms/BloomTextAtom'
import { useAtom } from 'jotai/react'

export type PhotographySetProps =
  SliceComponentProps<Content.PhotographySetSlice>

const PhotographySet = ({ slice }: PhotographySetProps): JSX.Element => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade()])

  const [, setBloomText] = useAtom(BloomTextAtom)

  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const measuringContainerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)

  const ref = useRef<HTMLDivElement | null>(null)

  const inView = useInView(ref, {
    amount: 0.5,
  })

  useEffect(() => {
    if (!emblaApi) {
      return
    }

    setCount(emblaApi.scrollSnapList().length)
    setCurrent(emblaApi.selectedScrollSnap() + 1)

    emblaApi.on('select', () => {
      setCurrent(emblaApi.selectedScrollSnap() + 1)
    })
  }, [emblaApi])

  useEffect(() => {
    if (inView) {
      setBloomText({
        text: `${slice.primary.title}`,
        position: `${current}/${count}`,
      })
    }
  }, [inView, current, count, setBloomText, slice.primary.title])

  useEffect(() => {
    const updateContainerWidth = () => {
      if (measuringContainerRef.current) {
        setContainerWidth(measuringContainerRef.current.clientWidth)
      }
    }

    window.addEventListener('resize', updateContainerWidth)

    // Initial call to set the width
    updateContainerWidth()

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', updateContainerWidth)
    }
  }, [])

  function getAspectRatio(image: ImageFieldImage) {
    return image.dimensions?.width && image.dimensions?.height
      ? image.dimensions.width > image.dimensions.height
        ? 'landscape'
        : 'portrait'
      : 'portrait'
  }

  return (
    <>
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-2">
        <div
          ref={measuringContainerRef}
          className="aspect-[3/4] w-full laptop:w-auto laptop:h-[95%] desktop:h-[90%] user-select-none"
        ></div>
      </div>
      <section
        ref={ref}
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        data-section-name={slice.primary.title}
        data-total-slides={count}
        data-current-slide={current}
        className="user-select-none"
      >
        <div className="embla relative" ref={emblaRef}>
          <div className="embla__container">
            {slice.primary.images.map((item, index) => (
              <div
                className="embla__slide flex items-center justify-center relative"
                key={`${slice.primary.title}-${index}`}
              >
                <div
                  className={`relative flex items-center justify-center ${
                    getAspectRatio(item.image) === 'portrait'
                      ? `aspect-[3/4]`
                      : 'aspect-[6/4] max-w-[100%]'
                  }`}
                  style={{
                    width:
                      getAspectRatio(item.image) === 'portrait'
                        ? (containerWidth ?? 'auto')
                        : 'auto',
                    height:
                      getAspectRatio(item.image) === 'landscape'
                        ? (containerWidth ?? 'auto')
                        : 'auto',
                  }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1/2 cursor-w-resize z-10"
                    onClick={() => emblaApi?.scrollPrev()}
                  />
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1/2 cursor-e-resize z-10"
                    onClick={() => emblaApi?.scrollNext()}
                  />
                  <div className="w-full h-full block">
                    <PrismicNextImage
                      field={item.image}
                      fallbackAlt=""
                      className="object-contain w-full h-full relative block"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default PhotographySet
