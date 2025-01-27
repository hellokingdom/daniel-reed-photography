'use client'

import { ImageFieldImage } from '@prismicio/client'
import { PrismicNextImage } from '@prismicio/next'
import { JSX, useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import { textAtom } from '@/atoms/textAtom'
import { useAtom } from 'jotai/react'
import { motion, AnimatePresence } from 'framer-motion'

interface CarouselSetProps {
  images: {
    image: ImageFieldImage
  }[]
  title: string
  blurHashes?: (string | undefined)[]
}

const CarouselSet = ({ images, title }: CarouselSetProps): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [, setText] = useAtom(textAtom)

  const measuringContainerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const [containerHeight, setContainerHeight] = useState<number | null>(null)

  const ref = useRef<HTMLDivElement | null>(null)

  const inView = useInView(ref, {
    amount: 0.5,
  })

  const nextIndex = (currentIndex + 1) % images.length
  const prevIndex = (currentIndex - 1 + images.length) % images.length

  useEffect(() => {
    if (inView) {
      setText({
        text: title,
        position: `${currentIndex + 1}/${images.length}`,
      })
    }
  }, [inView, currentIndex, images.length, setText, title])

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

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
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
        data-total-slides={images.length}
        data-current-slide={currentIndex + 1}
        className="user-select-none"
        style={{
          height: containerHeight ?? undefined,
        }}
      >
        {/* Hidden prefetch images */}
        <div className="hidden">
          <PrismicNextImage field={images[prevIndex].image} fallbackAlt="" />
          <PrismicNextImage field={images[nextIndex].image} fallbackAlt="" />
        </div>

        <div className="relative overflow-hidden h-full w-full">
          <AnimatePresence mode="sync">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              data-slide
              className="flex items-center justify-center basis-full absolute inset-0"
            >
              <div
                className={`relative flex items-center justify-center ${
                  getAspectRatio(images[currentIndex].image) === 'portrait'
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
                      onClick={handlePrev}
                    />
                    <div
                      className="absolute right-0 top-0 bottom-0 w-1/2 cursor-e-resize z-10 opacity-0 hover:opacity-100 transition-opacity"
                      onClick={handleNext}
                    />
                  </>
                )}
                {containerWidth && (
                  <PrismicNextImage
                    field={images[currentIndex].image}
                    fallbackAlt=""
                    priority
                    className="object-contain w-full h-full relative block"
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}

export default CarouselSet
