/* eslint-disable @next/next/no-img-element */
import { PrismicNextImage } from '@prismicio/next'
import { blurHashToDataURL } from '@/utils/blurHashToData'
import { ImageFieldImage } from '@prismicio/client'

export function PrismicBlurImage({
  blurHash,
}: {
  field: ImageFieldImage
  blurHash: string
} & React.ComponentProps<typeof PrismicNextImage>) {
  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden">
      <BlurHashImg hash={blurHash} />
    </div>
  )
}

function BlurHashImg({ hash }: { hash: string }) {
  const base64 = blurHashToDataURL(hash)
  return (
    base64 && (
      <div className="absolute inset-0">
        <img
          src={base64}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            border: 0,
          }}
        />
        <div className="absolute inset-0 backdrop-blur-2xl"></div>
      </div>
    )
  )
}
