"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { Recommendation } from "@/lib/learn/types";
import { RecommendationCard } from "./recommendation-card";

// "For you" recommendations render as a horizontal carousel — visually
// different from the long-form chaptered content below so the cards read
// as personalised picks rather than part of the answer body. Cards are
// fixed-width and snap-aligned; arrow buttons appear when there's more to
// scroll on either side.

export function RecommendationGrid({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setCanScrollLeft(track.scrollLeft > 4);
      setCanScrollRight(
        track.scrollLeft < track.scrollWidth - track.clientWidth - 4
      );
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [recommendations.length]);

  const scroll = (delta: number) => {
    trackRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="rec-heading" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-[var(--accent-strong)]" strokeWidth={2.25} />
          <h2
            id="rec-heading"
            className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[var(--accent-strong)]"
          >
            For you
          </h2>
        </div>
        <div className="hidden gap-1 sm:flex">
          <button
            onClick={() => scroll(-280)}
            disabled={!canScrollLeft}
            aria-label="Scroll recommendations left"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-black/[0.08] bg-white text-black/55 transition-all disabled:opacity-30 disabled:cursor-default hover:border-black/[0.15] hover:text-foreground"
          >
            <ChevronLeft className="h-3 w-3" strokeWidth={2.25} />
          </button>
          <button
            onClick={() => scroll(280)}
            disabled={!canScrollRight}
            aria-label="Scroll recommendations right"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-black/[0.08] bg-white text-black/55 transition-all disabled:opacity-30 disabled:cursor-default hover:border-black/[0.15] hover:text-foreground"
          >
            <ChevronRight className="h-3 w-3" strokeWidth={2.25} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="scrollbar-hide flex max-w-full snap-x snap-mandatory gap-2.5 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", minWidth: 0 }}
      >
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="w-[240px] shrink-0 snap-start sm:w-[260px] [&>button]:h-full [&>button]:w-full"
          >
            <RecommendationCard rec={rec} />
          </div>
        ))}
      </div>
    </section>
  );
}
