import { Content } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import { About } from '@/components/About'
import { JSX } from 'react'

/**
 * Props for `About`.
 */
export type AboutProps = SliceComponentProps<Content.AboutSlice>

/**
 * Component for "About" Slices.
 */
const AboutSlice = ({ slice }: AboutProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <About copy={slice.primary.copy} image={slice.primary.image} />
    </section>
  )
}

export default AboutSlice
