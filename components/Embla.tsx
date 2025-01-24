'use client'

import Fade from 'embla-carousel-fade'
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect } from 'react'
import { useState } from 'react'

export function Embla({ children }: { children: React.ReactNode }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade()])
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

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

  return (
    <div ref={emblaRef} className="embla">
      <div className="embla__container">{children}</div>
    </div>
  )
}
