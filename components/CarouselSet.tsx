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
  const [isLoaded, setIsLoaded] = useState<Record<number, boolean>>({})
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
        isLoaded: isLoaded[currentIndex] || false,
      })
    }
  }, [inView, currentIndex, images.length, setText, title, isLoaded])

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
    if (isLoaded[nextIndex]) {
      setCurrentIndex(nextIndex)
    }
  }

  const handlePrev = () => {
    if (isLoaded[prevIndex]) {
      setCurrentIndex(prevIndex)
    }
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
        data-total-slides={images.length}
        data-current-slide={currentIndex + 1}
        className="user-select-none relative"
        style={{
          height: containerHeight ?? undefined,
        }}
      >
        <div className="relative overflow-hidden h-full w-full">
          {containerWidth && (
            <div className="absolute inset-0">
              {/* Base layer - current image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`${
                    getAspectRatio(images[currentIndex].image) === 'portrait'
                      ? `aspect-[3/4]`
                      : 'aspect-[6/4] max-w-[100%]'
                  }`}
                  style={{
                    width:
                      getAspectRatio(images[currentIndex].image) === 'portrait'
                        ? (containerWidth ?? undefined)
                        : (containerHeight ?? undefined),
                  }}
                >
                  <PrismicNextImage
                    field={images[currentIndex].image}
                    fallbackAlt=""
                    className="object-contain w-full h-full relative block"
                    onLoad={() => handleImageLoad(currentIndex)}
                    sizes="100vw"
                  />
                  <PrismicNextImage
                    field={images[nextIndex].image}
                    fallbackAlt=""
                    className="w-0 h-0"
                    onLoad={() => handleImageLoad(nextIndex)}
                    sizes="100vw"
                  />
                </div>
              </div>

              {/* Overlay layer - animating images */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'backInOut' }}
                  className="absolute inset-0 flex items-center justify-center bg-white"
                >
                  <div
                    className={`${
                      getAspectRatio(images[currentIndex].image) === 'portrait'
                        ? `aspect-[3/4]`
                        : 'aspect-[6/4] max-w-[100%]'
                    }`}
                    style={{
                      width:
                        getAspectRatio(images[currentIndex].image) ===
                        'portrait'
                          ? (containerWidth ?? undefined)
                          : (containerHeight ?? undefined),
                    }}
                  >
                    <PrismicNextImage
                      field={images[currentIndex].image}
                      fallbackAlt=""
                      className="object-contain w-full h-full relative block"
                      sizes="100vw"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Loading indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
                <motion.div
                  className="w-2 h-2 rounded-full bg-black"
                  animate={{
                    scale: !isLoaded[nextIndex] ? [1, 1.5, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: !isLoaded[nextIndex] ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                />
              </div>

              {images.length > 1 && (
                <>
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1/2 ${
                      isLoaded[prevIndex]
                        ? 'cursor-w-resize'
                        : 'cursor-w-resize'
                    } z-50 opacity-0 hover:opacity-100 transition-opacity`}
                    onClick={handlePrev}
                  />
                  <div
                    className={`absolute right-0 top-0 bottom-0 w-1/2 ${
                      isLoaded[nextIndex]
                        ? 'cursor-e-resize'
                        : 'cursor-e-resize'
                    } z-50 opacity-0 hover:opacity-100 transition-opacity`}
                    onClick={handleNext}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default CarouselSet
