import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `PhotographySet`.
 */
export type PhotographySetProps =
  SliceComponentProps<Content.PhotographySetSlice>;

/**
 * Component for "PhotographySet" Slices.
 */
const PhotographySet = ({ slice }: PhotographySetProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for photography_set (variation: {slice.variation})
      Slices
    </section>
  );
};

export default PhotographySet;
