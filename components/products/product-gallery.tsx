"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

interface ProductMedia {
  storage_path: string
  alt_text: string
  media_type: string
  sort_order: number
  is_primary: boolean
}

interface ProductGalleryProps {
  media: ProductMedia[]
  title: string
}

export function ProductGallery({ media, title }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const sortedMedia = media?.sort((a, b) => a.sort_order - b.sort_order) || []
  const currentMedia = sortedMedia[currentIndex] || {
    storage_path: "/placeholder.svg?height=600&width=600",
    alt_text: title,
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedMedia.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + sortedMedia.length) % sortedMedia.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="relative aspect-square overflow-hidden group">
        <Image
          src={currentMedia.storage_path || "/placeholder.svg"}
          alt={currentMedia.alt_text}
          fill
          className={`object-cover transition-transform duration-300 ${isZoomed ? "scale-150" : "group-hover:scale-105"}`}
          priority
        />

        {/* Navigation Arrows */}
        {sortedMedia.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Zoom Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        {/* Image Counter */}
        {sortedMedia.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
            {currentIndex + 1} / {sortedMedia.length}
          </div>
        )}
      </Card>

      {/* Thumbnail Strip */}
      {sortedMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sortedMedia.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex ? "border-primary" : "border-transparent hover:border-primary/50"
              }`}
            >
              <Image src={item.storage_path || "/placeholder.svg"} alt={item.alt_text} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
