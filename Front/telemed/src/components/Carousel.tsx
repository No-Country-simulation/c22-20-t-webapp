"use client";

import Image from "next/image";
import React, { useRef } from "react";

interface CarouselItem {
  id: number;
  imageUrl?: string;
  alt?: string;
}

export default function ObrasCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const items: CarouselItem[] = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
  }));

  //   const items = [
  //     { id: 1, imageUrl: "/images/pikachi.jpg", alt: "Obra social 1" },
  //     { id: 2, imageUrl: "/images/pikachi.jpg", alt: "Obra social 2" },
  //     { id: 3, imageUrl: "/images/pikachi.jpg", alt: "Obra social 2" },
  //     { id: 4, imageUrl: "/images/pikachi.jpg", alt: "Obra social 2" },
  //     { id: 5, imageUrl: "/images/pikachi.jpg", alt: "Obra social 2" },
  //     { id: 6, imageUrl: "/images/pikachi.jpg", alt: "Obra social 2" },
  //     { id: 7, imageUrl: "/images/pikachi.jpg", alt: "Obra social 2" },
  //     { id: 8, imageUrl: "/images/pikachi.jpg", alt: "Obra social 2" },
  //   ]

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-gray-100 to-gray-200 py-8">
      
      <div className="relative max-w-7xl mx-auto px-4">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
          aria-label="Desplazar a la izquierda"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide flex gap-4 px-8 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-none snap-center w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center shadow-md"
            >
              {item.imageUrl ? (
                <Image
                  width={10}
                  height={10}
                  src={item.imageUrl}
                  alt={item.alt || `Obra social ${item.id}`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                "" // aqui va info
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
          aria-label="Desplazar a la derecha"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
