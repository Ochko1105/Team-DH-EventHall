"use client";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HallCarouselProps {
  images: string[];
}

export default function HallCarousel({ images }: HallCarouselProps) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });

  return (
    <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative min-w-full h-48 sm:h-56 md:h-64"
            >
              <Image
                src={img}
                alt={`Hall image ${index}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={() => embla?.scrollPrev()}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => embla?.scrollNext()}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
