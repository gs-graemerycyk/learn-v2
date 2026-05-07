"use client";

// In-app widget version of the "For you" carousel.
//
// Renders inside a 380 × 720 widget container (matching the LearnWidget
// frame used by /published and /builder). The carousel is sized for the
// narrow column: one card visible with a peek of the next, hard scroll
// snap, and a header that mimics the in-app chatbot drawer.
//
// Props let the host route control interactivity:
//   • `mode="published"` — full taps/links work, scrollbar hidden
//   • `mode="builder"`   — preview only; clicks are no-ops

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecommendationItem } from "./types";
import { CourseCard } from "./cards/course-card";
import { CommunityCard } from "./cards/community-card";
import { EventCard } from "./cards/event-card";

type WidgetMode = "published" | "builder";

interface ForYouWidgetProps {
  items: RecommendationItem[];
  mode?: WidgetMode;
}

// Stubbed analytics — same signature as the homepage card router.
function trackEvent(event: string, payload: Record<string, unknown>) {
  // eslint-disable-next-line no-console
  console.log("[track]", event, payload);
}

export function ForYouWidget({ items, mode = "published" }: ForYouWidgetProps) {
  const interactive = mode === "published";
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActive = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    // gap matches `gap-2 sm:gap-3` — fall back to the larger value, which
    // is fine for snap detection (a few px off won't change the index).
    const cardWidth = card.offsetWidth + 12;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.max(0, Math.min(items.length - 1, idx)));
  }, [items.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateActive, { passive: true });
    return () => el.removeEventListener("scroll", updateActive);
  }, [updateActive]);

  const scrollByCard = useCallback((direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const cardWidth = card ? card.offsetWidth + 12 : el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  }, []);

  const handleCardClick = (item: RecommendationItem, position: number) => {
    trackEvent("recommendation_click", {
      itemId: item.id,
      itemClass: item.itemClass,
      contentType: item.contentType,
      position,
      surface: "widget",
    });
  };

  if (!items.length) return null;

  return (
    <div className="flex h-full flex-col bg-[#FDFEFF]">
      {/* ── Drawer header ── */}
      <header className="shrink-0 border-b border-black/[0.07] bg-white px-3 pb-2.5 pt-3 sm:px-4 sm:pb-3 sm:pt-4">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--accent-strong)] sm:text-[10.5px]">
          <Sparkles className="h-3 w-3" strokeWidth={2.5} />
          For you
        </div>
        <h2 className="mt-1 text-[13.5px] font-semibold leading-[1.25] text-foreground sm:mt-1.5 sm:text-[15px]">
          Hi Sarah, pick up where you left off
        </h2>
        <p className="mt-0.5 text-[11px] leading-[1.4] text-foreground/55 sm:mt-1 sm:text-[11.5px] sm:leading-[1.45]">
          A mix of lessons, articles and conversations chosen for you.
        </p>
      </header>

      {/* ── Rail ── */}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollerRef}
          className={cn(
            "flex h-full gap-2 overflow-x-auto px-3 py-3 sm:gap-3 sm:px-4 sm:py-4",
            "snap-x snap-mandatory",
            // Hide scrollbar inside the widget frame for a clean look.
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            !interactive && "pointer-events-none"
          )}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              // Container-relative card width: ~78% of the rail leaves a
              // visible peek of the next card regardless of the widget
              // frame size. Capped at 280px so larger embeds don't blow
              // up the card.
              className="shrink-0 snap-start w-[78%] max-w-[280px]"
            >
              <CardForItem
                item={item}
                position={i}
                onClick={interactive ? handleCardClick : noopClick}
              />
            </div>
          ))}
        </div>

        {/* Inline arrow controls (hidden in builder preview) */}
        {interactive && (
          <>
            <button
              type="button"
              onClick={() => scrollByCard("left")}
              aria-label="Previous recommendation"
              className={cn(
                "absolute left-1.5 top-1/2 z-10 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white shadow-md transition-opacity sm:left-2 sm:h-8 sm:w-8",
                activeIndex === 0 ? "pointer-events-none opacity-0" : "opacity-100"
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5 text-black/65 sm:h-4 sm:w-4" strokeWidth={2.25} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard("right")}
              aria-label="Next recommendation"
              className={cn(
                "absolute right-1.5 top-1/2 z-10 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white shadow-md transition-opacity sm:right-2 sm:h-8 sm:w-8",
                activeIndex >= items.length - 1
                  ? "pointer-events-none opacity-0"
                  : "opacity-100"
              )}
            >
              <ChevronRight className="h-3.5 w-3.5 text-black/65 sm:h-4 sm:w-4" strokeWidth={2.25} />
            </button>
          </>
        )}
      </div>

      {/* ── Pagination dots + footer ── */}
      <footer className="shrink-0 border-t border-black/[0.07] bg-white px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-center gap-1 sm:gap-1.5">
          {items.map((it, i) => (
            <span
              key={it.id}
              aria-hidden
              className={cn(
                "h-1 rounded-full transition-all duration-200 sm:h-1.5",
                i === activeIndex
                  ? "w-3.5 bg-[var(--accent-strong)] sm:w-4"
                  : "w-1 bg-black/15 sm:w-1.5"
              )}
            />
          ))}
        </div>
        <p className="mt-1.5 text-center text-[10px] text-foreground/45 sm:mt-2 sm:text-[10.5px]">
          Showing {activeIndex + 1} of {items.length} · powered by AI Search
        </p>
      </footer>
    </div>
  );
}

function noopClick() {
  /* preview mode — clicks suppressed by the wrapper too */
}

interface CardProps {
  item: RecommendationItem;
  position: number;
  onClick: (item: RecommendationItem, position: number) => void;
}

// Local item-type router. We can't reuse the homepage's
// `RecommendationCard` because it owns its own analytics call; here we
// route into the same card components with the widget-scoped tracker.
function CardForItem({ item, position, onClick }: CardProps) {
  switch (item.contentType) {
    case "course":
    case "lesson":
    case "learning_path":
      return (
        <CourseCard
          item={item}
          position={position}
          onClickItem={(it, pos) => onClick(it, pos)}
        />
      );
    case "question":
    case "article":
    case "idea":
    case "conversation":
      return (
        <CommunityCard
          item={item}
          position={position}
          onClickItem={(it, pos) => onClick(it, pos)}
        />
      );
    case "event":
    case "product_update":
      return (
        <EventCard
          item={item}
          position={position}
          onClickItem={(it, pos) => onClick(it, pos)}
        />
      );
  }
}
