'use client'

import { ImageFieldImage } from '@prismicio/client'
import { PrismicNextImage } from '@prismicio/next'
import { JSX, useState, useEffect, useRef, useCallback } from 'react'
import { useInView } from 'framer-motion'
import { textAtom } from '@/atoms/textAtom'
import { useAtom } from 'jotai/react'
import useEmblaCarousel from 'embla-carousel-react'
import Fade from 'embla-carousel-fade'

interface CarouselSetProps {
  images: {
    image: ImageFieldImage
  }[]
  title: string
  blurHashes?: (string | undefined)[]
}

const CarouselSet = ({ images, title }: CarouselSetProps): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState<Record<number, boolean>>({})
  const [, setText] = useAtom(textAtom)

  const measuringContainerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const [containerHeight, setContainerHeight] = useState<number | null>(null)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchStartTime, setTouchStartTime] = useState(0)

  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { amount: 0.5 })

  const options = {
    loop: true,
    dragFree: false,
  }

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Fade()])

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }, [emblaApi])

  // Add these handlers for touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchStartTime(Date.now())
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX
      const touchEndTime = Date.now()

      // Calculate duration and distance
      const duration = touchEndTime - touchStartTime
      const distance = Math.abs(touchEndX - touchStartX)

      // If it's a quick tap with minimal movement (not a swipe)
      if (duration < 250 && distance < 10) {
        const width = window.innerWidth
        const tapPosition = touchEndX

        // Determine if tap was on left or right side
        if (tapPosition < width / 2) {
          scrollPrev()
        } else {
          scrollNext()
        }
      }
      // If it's a swipe, Embla will handle it naturally
    },
    [scrollNext, scrollPrev, touchStartTime, touchStartX]
  )

  useEffect(() => {
    if (inView && emblaApi) {
      const currentIndex = emblaApi.selectedScrollSnap()
      setText({
        text: title,
        position: `${currentIndex + 1}/${images.length}`,
        isLoaded: isLoaded[currentIndex] || false,
      })
    }
  }, [inView, emblaApi, images.length, setText, title, isLoaded])

  useEffect(() => {
    const updateContainerWidth = () => {
      if (measuringContainerRef.current) {
        setContainerWidth(measuringContainerRef.current.clientWidth)
      }
    }

    const updateContainerHeight = () => {
      if (measuringContainerRef.current) {
        setContainerHeight(measuringContainerRef.current.clientHeight)
      }
    }

    window.addEventListener('resize', updateContainerWidth)
    window.addEventListener('resize', updateContainerHeight)
    updateContainerWidth()
    updateContainerHeight()

    return () => {
      window.removeEventListener('resize', updateContainerWidth)
      window.removeEventListener('resize', updateContainerHeight)
    }
  }, [])

  function getAspectRatio(image: ImageFieldImage) {
    return image.dimensions?.width && image.dimensions?.height
      ? image.dimensions.width > image.dimensions.height
        ? 'landscape'
        : 'portrait'
      : 'portrait'
  }

  const handleImageLoad = (index: number) => {
    setIsLoaded((prev) => ({ ...prev, [index]: true }))
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
        className="user-select-none relative"
        style={{
          height: containerHeight ?? undefined,
        }}
      >
        <div
          className="embla overflow-hidden h-full w-full relative"
          ref={emblaRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="embla__container h-full">
            {images.map(({ image }, index) => (
              <div
                key={index}
                className="embla__slide flex items-center justify-center h-full"
              >
                <div
                  className={`${
                    getAspectRatio(image) === 'portrait'
                      ? `aspect-[3/4]`
                      : 'aspect-[6/4] max-w-[100%]'
                  }`}
                  style={{
                    width:
                      getAspectRatio(image) === 'portrait'
                        ? (containerWidth ?? undefined)
                        : (containerHeight ?? undefined),
                  }}
                >
                  <PrismicNextImage
                    field={image}
                    fallbackAlt=""
                    className="object-contain w-full h-full relative block"
                    onLoad={() => handleImageLoad(index)}
                    sizes="100vw"
                    loading="eager"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {images.length > 1 && (
          <>
            <button
              className="absolute left-0 top-0 bottom-0 w-1/2 cursor-w-resize z-50 opacity-0 hover:opacity-100 transition-opacity hidden laptop:block"
              onClick={scrollPrev}
              aria-label="Previous slide"
            />
            <button
              className="absolute right-0 top-0 bottom-0 w-1/2 cursor-e-resize z-50 opacity-0 hover:opacity-100 transition-opacity hidden laptop:block"
              onClick={scrollNext}
              aria-label="Next slide"
            />
          </>
        )}
      </section>
    </>
  )
}

export default CarouselSet
