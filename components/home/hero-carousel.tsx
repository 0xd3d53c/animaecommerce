"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface CarouselSlide {
  src: string
  alt: string
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
}

interface HeroCarouselProps {
  slides: CarouselSlide[]
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  return (
    <Carousel
      className="w-full"
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            {/* START: MODIFIED SECTION */}
            <div className="relative h-[60vh] w-full md:h-[70vh]">
            {/* END: MODIFIED SECTION */}
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
                <div className="container mx-auto px-4">
                  {/* START: MODIFIED SECTION */}
                  <h1 className="text-3xl font-bold md:text-6xl">{slide.title}</h1>
                  <p className="mx-auto mt-4 max-w-2xl text-base md:text-xl">
                  {/* END: MODIFIED SECTION */}
                    {slide.subtitle}
                  </p>
                  <Button size="lg" asChild className="mt-8">
                    <Link href={slide.ctaLink}>
                      {slide.ctaText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
    </Carousel>
  )
}