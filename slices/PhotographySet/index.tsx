import { Embla } from '@/components/Embla'
import { Content, ImageFieldImage } from '@prismicio/client'
import { PrismicNextImage } from '@prismicio/next'
import { SliceComponentProps } from '@prismicio/react'
import { JSX } from 'react'

export type PhotographySetProps =
  SliceComponentProps<Content.PhotographySetSlice>

const PhotographySet = ({ slice }: PhotographySetProps): JSX.Element => {
  function getAspectRatio(image: ImageFieldImage) {
    return image.dimensions?.width && image.dimensions?.height
      ? image.dimensions.width > image.dimensions.height
        ? 'landscape'
        : 'portrait'
      : 'portrait'
  }

  return (
    <>
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        data-section-name={slice.primary.title}
        className="user-select-none pointer-events-none p-2 w-screen h-[90vh] relative border-2"
      >
        <Embla>
          {slice.primary.images.map((item, index) => (
            <div
              className="flex items-center justify-center h-full w-full absolute inset-0"
              key={`${slice.primary.title}-${index}`}
            >
              <div
                className={`${
                  getAspectRatio(item.image) === 'portrait'
                    ? `relative aspect-[3/4] w-full h-full`
                    : 'relative aspect-[6/4] w-auto h-full max-h-[60vh]'
                }`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1/2 cursor-w-resize z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-1/2 cursor-e-resize z-10" />
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
        </Embla>
      </section>
    </>
  )
}

export default PhotographySet
