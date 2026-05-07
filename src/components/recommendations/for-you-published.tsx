"use client";

import { ForYouWidget } from "./for-you-widget";
import { mockRecommendations } from "./mock-data";

// Published "For you" widget — pairs with /for-you-builder. Frames the
// ForYouWidget on a neutral host background so it reads as the live
// in-app drawer end users would tap into. Cards are fully interactive
// and link out to their target URLs (stub routes for now).

export function ForYouPublished() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(ellipse_at_top,_rgba(110,60,255,0.12),_transparent_55%),_#F4F5F8] flex flex-col items-center justify-start gap-4 px-4 py-10 sm:py-14">
      <div className="text-center">
        <span className="inline-block rounded-full bg-white px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[var(--accent-strong)] shadow-[0_1px_4px_-1px_rgba(0,0,0,0.06)]">
          Published bot · live experience
        </span>
        <h1 className="mt-3 text-[18px] font-semibold text-foreground/85">
          The For You widget as end users see it
        </h1>
        <p className="mx-auto mt-1 max-w-[42ch] text-[12.5px] text-foreground/55">
          Swipe or tap the arrows to move through recommendations. Tapping a
          card navigates to the full content page.
        </p>
      </div>

      <div
        className="relative flex flex-col overflow-hidden rounded-[28px] border border-black/[0.08] bg-white shadow-[0_24px_60px_-16px_rgba(0,0,0,0.22)]"
        style={{ width: 380, height: 720 }}
      >
        <ForYouWidget items={mockRecommendations} mode="published" />
      </div>
    </div>
  );
}
