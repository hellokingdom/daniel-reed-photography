'use client'

import { Content } from '@prismicio/client'
import { PrismicNextImage } from '@prismicio/next'
import { SliceComponentProps } from '@prismicio/react'
import useEmblaCarousel from 'embla-carousel-react'
import { JSX, useState, useEffect, useRef } from 'react'
import Fade from 'embla-carousel-fade'
import { useInView } from 'framer-motion'
import { bloomTextAtom } from '@/atoms/bloomTextAtom'
import { useAtom } from 'jotai/react'

export type PhotographySetProps =
  SliceComponentProps<Content.PhotographySetSlice>

const PhotographySet = ({ slice }: PhotographySetProps): JSX.Element => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade()])

  const [, setBloomText] = useAtom(bloomTextAtom)

  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [aspectRatios, setAspectRatios] = useState<
    Array<'portrait' | 'landscape'>
  >(Array(slice.primary.images.length).fill('portrait'))
  const portraitWidthRef = useRef<number | null>(null)
  const measuringContainerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const [cursorClass, setCursorClass] = useState('cursor-e-resize')

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
      setBloomText(`${slice.primary.title} [ ${current}/${count} ]`)
    }
  }, [inView, current, count, setBloomText, slice.primary.title])

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, currentTarget } = event
    const { left, width } = currentTarget.getBoundingClientRect()
    const clickPosition = clientX - left

    if (clickPosition < width / 2) {
      emblaApi?.scrollPrev()
    } else {
      emblaApi?.scrollNext()
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
    setTimeout(() => {
      img.style.visibility = 'visible'
    }, 1)
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

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, currentTarget } = event
    const { left, width } = currentTarget.getBoundingClientRect()
    const hoverPosition = clientX - left

    if (hoverPosition < width / 2) {
      setCursorClass('cursor-w-resize')
    } else {
      setCursorClass('cursor-e-resize')
    }
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
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        className={`${cursorClass} user-select-none`}
      >
        <div className="embla pointer-events-none" ref={emblaRef}>
          <div className="embla__container">
            {slice.primary.images.map((item, index) => (
              <div
                className="embla__slide flex items-center justify-center"
                key={`${slice.primary.title}-${index}`}
              >
                <div
                  className={`relative flex items-center justify-center ${
                    aspectRatios[index] === 'portrait'
                      ? `aspect-[3/4]`
                      : 'aspect-[6/4] max-w-[100%]'
                  }`}
                  style={{
                    width:
                      aspectRatios[index] === 'portrait'
                        ? (containerWidth ?? 'auto')
                        : 'auto',
                    height:
                      aspectRatios[index] === 'landscape'
                        ? (containerWidth ?? 'auto')
                        : 'auto',
                  }}
                >
                  <PrismicNextImage
                    field={item.image}
                    fallbackAlt=""
                    className={`object-contain w-full h-full block ${
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
    </>
  )
}

export default PhotographySet
