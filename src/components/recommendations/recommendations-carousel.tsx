"use client";

// "For you" recommendations carousel.
//
// What's stubbed today:
//   • Data source — `mock-data.ts` provides 10 hardcoded items. The
//     real DCH (Digital Customer Hub) recommendations API will return
//     the same `RecommendationItem[]` shape; swap the import in the
//     consumer (or pass `items` down from a server component fetch).
//   • Tracking — `trackEvent` in `recommendation-card.tsx` logs to the
//     console. Wire it to the real analytics client when integrating.
//
// Everything else (layout, scroll-snap, arrow nav, empty state, a11y)
// is real and final.

import { useCallback, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecommendationsCarouselProps } from "./types";
import { RecommendationCard } from "./recommendation-card";

export function RecommendationsCarousel({ items }: RecommendationsCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, items.length]);

  const scrollByCard = useCallback((direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    // Approximate one card width including the 16 px gap.
    const firstChild = el.firstElementChild as HTMLElement | null;
    const cardWidth = firstChild ? firstChild.offsetWidth + 16 : el.clientWidth * 0.6;
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByCard("right");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByCard("left");
      }
    },
    [scrollByCard]
  );

  if (!items.length) return null;

  return (
    <section
      aria-labelledby="for-you-heading"
      className="relative w-full"
    >
      {/* Heading */}
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2
            id="for-you-heading"
            className="text-[20px] font-semibold tracking-tight text-foreground"
          >
            For you
          </h2>
          <p className="mt-0.5 text-[12.5px] text-black/45">
            Picked up where you left off, plus fresh picks from the community
            and academy.
          </p>
        </div>
      </div>

      {/* Rail wrapper — keeps arrow buttons positioned over the rail */}
      <div className="relative">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scrollByCard("left")}
          aria-label="Scroll recommendations left"
          aria-hidden={!canScrollLeft}
          tabIndex={canScrollLeft ? 0 : -1}
          className={cn(
            "absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition-opacity",
            "h-9 w-9 lg:flex",
            canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <ChevronLeft className="h-4 w-4 text-black/65" strokeWidth={2.25} />
        </button>

        {/* Scroll rail */}
        <div
          ref={scrollerRef}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="For you recommendations"
          className={cn(
            "flex gap-4 overflow-x-auto scroll-smooth pb-2",
            "snap-x snap-mandatory",
            // Hide scrollbar on desktop, allow it on touch / small screens.
            "[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/15",
            "lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden",
            "focus-visible:outline-none"
          )}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              className="shrink-0 snap-start w-[85%] sm:w-[45%] md:w-[32%] lg:w-[24%] xl:w-[19%]"
            >
              <RecommendationCard item={item} position={i} />
            </div>
          ))}
          {/* Trailing spacer so the last card has breathing room when
              the rail is at its end. */}
          <div className="shrink-0 w-px" aria-hidden />
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scrollByCard("right")}
          aria-label="Scroll recommendations right"
          aria-hidden={!canScrollRight}
          tabIndex={canScrollRight ? 0 : -1}
          className={cn(
            "absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition-opacity",
            "h-9 w-9 lg:flex",
            canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <ChevronRight className="h-4 w-4 text-black/65" strokeWidth={2.25} />
        </button>
      </div>
    </section>
  );
}
