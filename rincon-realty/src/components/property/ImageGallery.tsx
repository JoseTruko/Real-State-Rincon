'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PropertyImage } from '@/types'
import { cn } from '@/lib/utils/cn'

interface ImageGalleryProps {
  images: PropertyImage[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const next = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  if (!images.length) return null

  const active = images[activeIndex]

  return (
    <>
      {/* Main image */}
      <div
        className="relative aspect-[16/9] w-full overflow-hidden rounded-xl cursor-zoom-in bg-neutral-100"
        onClick={() => openLightbox(activeIndex)}
      >
        <Image
          src={active.url}
          alt={active.alt_text || title}
          fill
          sizes="(max-width: 768px) 100vw, 65vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 mt-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200',
                i === activeIndex
                  ? 'border-primary'
                  : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <Image
                src={img.url}
                alt={img.alt_text || `${title} ${i + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-neutral-300 transition-colors"
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 text-white hover:text-neutral-300 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="h-10 w-10" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 text-white hover:text-neutral-300 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="h-10 w-10" />
              </button>
            </>
          )}

          <div
            className="relative max-h-[90vh] max-w-[90vw] aspect-[16/9] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.url}
              alt={active.alt_text || title}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          <p className="absolute bottom-4 text-white/60 text-sm">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  )
}
