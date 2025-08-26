"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="relative">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
        setApi={setApi}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[60vh] w-full md:h-[70vh]">
                <Image src={slide.src} alt={slide.alt} fill className="object-cover" priority={index === 0} />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
                  <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold md:text-6xl">{slide.title}</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-base md:text-xl">{slide.subtitle}</p>
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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-50",
              current === index ? "w-4 bg-white" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  )
}