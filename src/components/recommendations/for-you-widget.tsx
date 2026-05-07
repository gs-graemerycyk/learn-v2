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
    const cardWidth = card.offsetWidth + 12; // gap matches `gap-3`
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
      <header className="shrink-0 border-b border-black/[0.07] bg-white px-4 pb-3 pt-4">
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[var(--accent-strong)]">
          <Sparkles className="h-3 w-3" strokeWidth={2.5} />
          For you
        </div>
        <h2 className="mt-1.5 text-[15px] font-semibold leading-[1.25] text-foreground">
          Hi Sarah, pick up where you left off
        </h2>
        <p className="mt-1 text-[11.5px] leading-[1.45] text-foreground/55">
          A mix of lessons, articles and conversations chosen for you.
        </p>
      </header>

      {/* ── Rail ── */}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollerRef}
          className={cn(
            "flex h-full gap-3 overflow-x-auto px-4 py-4",
            "snap-x snap-mandatory",
            // Hide scrollbar inside the widget frame for a clean look.
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            !interactive && "pointer-events-none"
          )}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              className="shrink-0 snap-start"
              // 280px ≈ comfortable card width inside the 380px widget,
              // leaving ~12px peek of the next card on the right.
              style={{ width: 280 }}
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
                "absolute left-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white shadow-md transition-opacity",
                activeIndex === 0 ? "pointer-events-none opacity-0" : "opacity-100"
              )}
            >
              <ChevronLeft className="h-4 w-4 text-black/65" strokeWidth={2.25} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard("right")}
              aria-label="Next recommendation"
              className={cn(
                "absolute right-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white shadow-md transition-opacity",
                activeIndex >= items.length - 1
                  ? "pointer-events-none opacity-0"
                  : "opacity-100"
              )}
            >
              <ChevronRight className="h-4 w-4 text-black/65" strokeWidth={2.25} />
            </button>
          </>
        )}
      </div>

      {/* ── Pagination dots + footer ── */}
      <footer className="shrink-0 border-t border-black/[0.07] bg-white px-4 py-3">
        <div className="flex items-center justify-center gap-1.5">
          {items.map((it, i) => (
            <span
              key={it.id}
              aria-hidden
              className={cn(
                "h-1.5 rounded-full transition-all duration-200",
                i === activeIndex
                  ? "w-4 bg-[var(--accent-strong)]"
                  : "w-1.5 bg-black/15"
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-center text-[10.5px] text-foreground/45">
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
