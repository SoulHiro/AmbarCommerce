'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { parseAsString, useQueryState } from 'nuqs'
import { useRef, useState } from 'react'

const ZOOM_FACTOR = 2.8
const LENS_SIZE = 180

interface GalleryImage {
  color: string
  imageUrl: string
}

interface ProductGalleryProps {
  images: GalleryImage[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [cor, setCor] = useQueryState('cor', parseAsString)

  const activeImage = images.find(i => i.color === cor) ?? images[0]

  const [showZoom, setShowZoom] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)

  // Direct DOM manipulation on every mousemove to avoid React re-renders causing jank
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const lens = lensRef.current
    const container = containerRef.current
    if (!lens || !container) return

    const rect = container.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))

    // Clamp lens so it never overflows the container edge
    const lensX = Math.max(0, Math.min(x - LENS_SIZE / 2, rect.width - LENS_SIZE))
    const lensY = Math.max(0, Math.min(y - LENS_SIZE / 2, rect.height - LENS_SIZE))

    // Background represents the full image scaled by ZOOM_FACTOR
    const bgW = rect.width * ZOOM_FACTOR
    const bgH = rect.height * ZOOM_FACTOR

    // Offset so the zoomed point under the cursor appears at the center of the lens
    const bgX = -(x * ZOOM_FACTOR - LENS_SIZE / 2)
    const bgY = -(y * ZOOM_FACTOR - LENS_SIZE / 2)

    lens.style.left = `${lensX}px`
    lens.style.top = `${lensY}px`
    lens.style.backgroundImage = `url(${activeImage.imageUrl})`
    lens.style.backgroundSize = `${bgW}px ${bgH}px`
    lens.style.backgroundPosition = `${bgX}px ${bgY}px`
  }

  const selectColor = (color: string) => {
    setCor(color, { scroll: false, shallow: false })
  }

  return (
    <div className="flex gap-3 lg:gap-4">
      {/* Thumbnail strip — vertical left, hidden when only one image */}
      {images.length > 1 && (
        <div className="flex w-14 shrink-0 flex-col gap-2 lg:w-[72px]">
          {images.map((img) => (
            <button
              key={img.color}
              onClick={() => selectColor(img.color)}
              aria-label={`Ver em ${img.color}`}
              className={cn(
                'relative aspect-[3/4] w-full overflow-hidden bg-muted transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground',
                activeImage.color === img.color
                  ? 'ring-1 ring-foreground ring-offset-1'
                  : 'opacity-50 hover:opacity-90',
              )}
            >
              <Image
                src={img.imageUrl}
                alt={img.color}
                fill
                className="object-cover object-center"
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image with zoom lens */}
      <div className="relative min-w-0 flex-1">
        <div
          ref={containerRef}
          className="bg-muted relative aspect-[3/4] w-full cursor-crosshair overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
        >
          <Image
            src={activeImage.imageUrl}
            alt={productName}
            fill
            priority
            quality={90}
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />

          {/* Zoom lens — position and background updated directly via ref */}
          <div
            ref={lensRef}
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute z-10 border border-white/25 shadow-2xl backdrop-blur-[1px] transition-opacity duration-100',
              showZoom ? 'opacity-100' : 'opacity-0',
            )}
            style={{
              width: LENS_SIZE,
              height: LENS_SIZE,
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>
      </div>
    </div>
  )
}
