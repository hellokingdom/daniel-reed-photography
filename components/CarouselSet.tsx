'use client'

import { ImageFieldImage } from '@prismicio/client'
import { PrismicNextImage } from '@prismicio/next'
import useEmblaCarousel from 'embla-carousel-react'
import { JSX, useState, useEffect, useRef } from 'react'
import Fade from 'embla-carousel-fade'
import { useInView } from 'framer-motion'
import { textAtom } from '@/atoms/textAtom'
import { useAtom } from 'jotai/react'

interface CarouselSetProps {
  images: {
    image: ImageFieldImage
  }[]
  title: string
}

const CarouselSet = ({ images, title }: CarouselSetProps): JSX.Element => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade()])
  const [, setText] = useAtom(textAtom)
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
      setText({
        text: title,
        position: `${current}/${count}`,
      })
    }
  }, [inView, current, count, setText, title])

  useEffect(() => {
    const updateContainerWidth = () => {
      if (measuringContainerRef.current) {
        setContainerWidth(measuringContainerRef.current.clientWidth)
      }
    }

    window.addEventListener('resize', updateContainerWidth)
    updateContainerWidth()

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
        data-total-slides={count}
        data-current-slide={current}
        className="user-select-none"
      >
        <div className="embla relative" ref={emblaRef}>
          <div className="embla__container">
            {images.map((item, index) => (
              <div
                className="embla__slide flex items-center justify-center relative"
                key={`${title}-${index}`}
              >
                <div
                  className={`relative flex items-center justify-center ${
                    getAspectRatio(item.image) === 'portrait'
                      ? `aspect-[3/4]`
                      : 'aspect-[6/4] max-w-[100%]'
                  }`}
                  style={{
                    width: containerWidth ?? undefined,
                  }}
                >
                  {images.length > 1 && (
                    <>
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1/2 cursor-w-resize z-10 opacity-0 hover:opacity-100 transition-opacity"
                        onClick={() => emblaApi?.scrollPrev()}
                      />
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1/2 cursor-e-resize z-10 opacity-0 hover:opacity-100 transition-opacity"
                        onClick={() => emblaApi?.scrollNext()}
                      />
                    </>
                  )}
                  <div className="w-full h-full block">
                    <PrismicNextImage
                      field={item.image}
                      fallbackAlt=""
                      className="object-contain w-full h-full relative block opacity-0 transition-opacity duration-500"
                      onLoad={(e) => {
                        ;(e.target as HTMLImageElement).classList.remove(
                          'opacity-0'
                        )
                        ;(e.target as HTMLImageElement).classList.add(
                          'opacity-100'
                        )
                      }}
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

export default CarouselSet
