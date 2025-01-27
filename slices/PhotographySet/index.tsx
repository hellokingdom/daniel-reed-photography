import { Content } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import { JSX } from 'react'
import CarouselSet from '@/components/CarouselSet'

export type PhotographySetProps =
  SliceComponentProps<Content.PhotographySetSlice>

const PhotographySet = async ({
  slice,
}: PhotographySetProps): Promise<JSX.Element> => {
  return (
    <CarouselSet
      images={slice.primary.images}
      title={slice.primary.title ?? ''}
    />
  )
}

export default PhotographySet
