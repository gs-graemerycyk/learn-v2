"use client";

import { useState } from "react";
import { ChevronDown, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import type { Cell } from "@/lib/learn/types";
import { cellHref } from "@/lib/learn/search-data";

// Hero card for /ai-answer — matches the production AI Answers card on
// communities.gainsight.com: light-blue bordered container, "AI Answers"
// eyebrow with sparkle, "Summary — <query>" title, bulleted body that
// truncates with a "Continue reading" affordance, and a sources column on
// the right with "Show all" expanding from 3 to up to 10 entries.

export type AnswerBullet = {
  text: string;
  // Source label rendered in brackets at the end of the bullet, mirroring
  // how Gainsight cites source material inline.
  citation?: string;
};

export function AiAnswerHero({
  query,
  bullets,
  sources,
}: {
  query: string;
  bullets: AnswerBullet[];
  sources: Cell[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [showAllSources, setShowAllSources] = useState(false);

  const visibleSources = showAllSources ? sources.slice(0, 10) : sources.slice(0, 3);
  const hasMoreSources = sources.length > 3;
  const totalShown = visibleSources.length;

  return (
    <section className="rounded-2xl border border-[#1B5BA8]/20 bg-[#F4F8FB] p-5 sm:p-6">
      {/* Eyebrow */}
      <div className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.07em] text-[#1B5BA8]">
        <Sparkles className="h-3 w-3" strokeWidth={2.25} />
        AI Answers
      </div>

      <h2 className="mt-3 text-[22px] font-semibold leading-[1.25] tracking-[-0.01em] text-foreground sm:text-[24px]">
        Summary — {query.replace(/\?$/, "").toLowerCase()}
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Body */}
        <div className="relative">
          <div
            className={`flex flex-col gap-2.5 overflow-hidden transition-[max-height] duration-300 ${
              expanded ? "max-h-[2000px]" : "max-h-[230px]"
            }`}
          >
            <ul className="flex flex-col gap-2.5">
              {bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-[14.5px] leading-[1.55] text-foreground/85"
                >
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-foreground/55" />
                  <span>
                    {b.text}
                    {b.citation && (
                      <span className="ml-1.5 text-foreground/50">[{b.citation}]</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fade + Continue reading — only visible when collapsed */}
          {!expanded && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F4F8FB] via-[#F4F8FB]/85 to-transparent" />
          )}
        </div>

        {/* Sources column */}
        <aside className="flex flex-col gap-2 self-start">
          {visibleSources.map((cell) => (
            <SourceCard key={cell.id} cell={cell} />
          ))}

          {hasMoreSources && (
            <button
              onClick={() => setShowAllSources((s) => !s)}
              className="mt-1 inline-flex items-center justify-center gap-1 rounded-md py-1.5 text-[12.5px] font-semibold text-[#1B5BA8] hover:bg-[#1B5BA8]/[0.06]"
            >
              {showAllSources
                ? `Show fewer · ${totalShown} of ${Math.min(sources.length, 10)}`
                : `Show all sources · ${Math.min(sources.length, 10)}`}
              <ChevronDown
                className={`h-3 w-3 transition-transform ${
                  showAllSources ? "rotate-180" : ""
                }`}
                strokeWidth={2.25}
              />
            </button>
          )}
        </aside>
      </div>

      {/* Continue reading footer — full-width, sticks below both columns */}
      {!expanded && (
        <div className="mt-4">
          <button
            onClick={() => setExpanded(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-black/[0.08] bg-white py-2.5 text-[13px] font-semibold text-foreground/80 transition-all hover:border-black/[0.15] hover:bg-white/90"
          >
            Continue reading
            <ChevronDown className="h-3 w-3" strokeWidth={2.25} />
          </button>
        </div>
      )}
      {expanded && (
        <div className="mt-4 flex flex-col gap-3">
          {/* Helpful / unhelpful — only meaningful once the user has read
              the expanded answer, so we show it in the expanded state. */}
          <HelpfulFeedback />
          <button
            onClick={() => setExpanded(false)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-black/[0.08] bg-white py-2.5 text-[13px] font-semibold text-foreground/65 transition-all hover:border-black/[0.15] hover:text-foreground/85"
          >
            Show less
            <ChevronDown className="h-3 w-3 rotate-180" strokeWidth={2.25} />
          </button>
        </div>
      )}
    </section>
  );
}

function HelpfulFeedback() {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  return (
    <div className="flex items-center gap-3 border-t border-black/[0.08] pt-3 text-[13px] text-foreground/65">
      <span className="font-medium">
        {vote === null
          ? "Is this helpful?"
          : vote === "up"
            ? "Thanks — glad this helped."
            : "Thanks for the feedback — we'll keep refining."}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setVote((v) => (v === "up" ? null : "up"))}
          aria-pressed={vote === "up"}
          aria-label="Helpful"
          className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
            vote === "up"
              ? "bg-emerald-500/15 text-emerald-700"
              : "text-foreground/55 hover:bg-black/[0.04] hover:text-foreground/85"
          }`}
        >
          <ThumbsUp className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        <button
          onClick={() => setVote((v) => (v === "down" ? null : "down"))}
          aria-pressed={vote === "down"}
          aria-label="Not helpful"
          className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
            vote === "down"
              ? "bg-rose-500/15 text-rose-700"
              : "text-foreground/55 hover:bg-black/[0.04] hover:text-foreground/85"
          }`}
        >
          <ThumbsDown className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function SourceCard({ cell }: { cell: Cell }) {
  // Lift a short description out of each cell type's payload.
  const excerpt = previewFor(cell);
  return (
    <a
      href={cellHref(cell.id)}
      className="block rounded-xl border border-black/[0.06] bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-black/[0.12] hover:shadow-[0_2px_14px_-6px_rgba(0,0,0,0.08)]"
    >
      <h4 className="text-[13.5px] font-semibold leading-[1.3] text-foreground line-clamp-2">
        {cell.title}
      </h4>
      <p className="mt-1 line-clamp-2 text-[12px] leading-[1.4] text-foreground/55">
        {excerpt}
      </p>
    </a>
  );
}

function previewFor(cell: Cell): string {
  switch (cell.type) {
    case "question":
      return (cell as Cell<"question">).payload.excerpt;
    case "conversation":
      return (cell as Cell<"conversation">).payload.excerpt;
    case "idea":
      return (cell as Cell<"idea">).payload.description;
    case "article":
      return (cell as Cell<"article">).payload.lede;
    case "product-update":
      return (cell as Cell<"product-update">).payload.summary;
    case "course":
      return (cell as Cell<"course">).payload.summary;
    case "lesson":
      return (cell as Cell<"lesson">).payload.snippet;
    case "learning-experience":
      return (cell as Cell<"learning-experience">).payload.summary;
    case "event":
      return (cell as Cell<"event">).payload.summary;
    case "reply":
      return (cell as Cell<"reply">).payload.quotedBody;
  }
}
