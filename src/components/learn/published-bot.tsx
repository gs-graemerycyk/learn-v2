"use client";

import type { LearnAnswer } from "@/lib/learn/types";
import { LearnWidget } from "./learn-widget";

// Published-bot view — frames the AI Search widget on a neutral host
// background so it reads as the live in-app chatbot drawer (not the
// bot-builder admin canvas). Cell taps, AI Tutor, and Support all open
// as full-screen takeovers within the widget container, with a back
// chevron returning the user to the AI Answer.

export function PublishedBot({ answer }: { answer: LearnAnswer }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(ellipse_at_top,_rgba(110,60,255,0.12),_transparent_55%),_#F4F5F8] flex flex-col items-center justify-start gap-4 px-4 py-10 sm:py-14">
      <div className="text-center">
        <span className="inline-block rounded-full bg-white px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[var(--accent-strong)] shadow-[0_1px_4px_-1px_rgba(0,0,0,0.06)]">
          Published bot · live experience
        </span>
        <h1 className="mt-3 text-[18px] font-semibold text-foreground/85">
          This is what end users see when they open the chatbot
        </h1>
        <p className="mx-auto mt-1 max-w-[42ch] text-[12.5px] text-foreground/55">
          Tap any cell or paragraph to see the full-screen takeover within
          the widget. The X / back chevron returns to the AI Answer.
        </p>
      </div>

      <div
        className="relative flex flex-col overflow-hidden rounded-[28px] border border-black/[0.08] bg-white shadow-[0_24px_60px_-16px_rgba(0,0,0,0.22)]"
        style={{ width: 380, height: 720 }}
      >
        <LearnWidget answer={answer} mode="published" />
      </div>
    </div>
  );
}
