"use client";

import { ForYouWidget } from "./for-you-widget";
import { mockRecommendations } from "./mock-data";

// Published "For you" widget — pairs with /for-you-builder. Frames the
// ForYouWidget on a neutral host background so it reads as the live
// in-app drawer end users would tap into. Cards are fully interactive
// and link out to their target URLs (stub routes for now).

export function ForYouPublished() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(ellipse_at_top,_rgba(110,60,255,0.12),_transparent_55%),_#F4F5F8] flex flex-col items-center justify-start gap-3 px-3 py-6 sm:gap-4 sm:px-4 sm:py-10 lg:py-14">
      <div className="text-center">
        <span className="inline-block rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.07em] text-[var(--accent-strong)] shadow-[0_1px_4px_-1px_rgba(0,0,0,0.06)] sm:px-3 sm:py-1 sm:text-[10.5px]">
          Published bot · live experience
        </span>
        <h1 className="mt-2 text-[15px] font-semibold text-foreground/85 sm:mt-3 sm:text-[18px]">
          The For You widget as end users see it
        </h1>
        <p className="mx-auto mt-1 max-w-[42ch] text-[11.5px] text-foreground/55 sm:text-[12.5px]">
          Swipe or tap the arrows to move through recommendations. Tapping a
          card navigates to the full content page.
        </p>
      </div>

      {/*
        Frame is responsive:
          • Width  — fills the viewport up to the 380 px design spec
          • Height — fills the available viewport minus header/copy/padding,
            capped at 720 px so wide desktop windows don't stretch it
        100dvh is preferred over 100vh on mobile so the chrome (URL bar) is
        accounted for.
      */}
      <div
        className="relative flex w-full max-w-[380px] flex-col overflow-hidden rounded-[20px] border border-black/[0.08] bg-white shadow-[0_24px_60px_-16px_rgba(0,0,0,0.22)] sm:rounded-[28px]"
        style={{ height: "min(720px, calc(100dvh - 12rem))" }}
      >
        <ForYouWidget items={mockRecommendations} mode="published" />
      </div>
    </div>
  );
}
