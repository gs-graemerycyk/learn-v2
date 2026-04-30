"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

// Loading state shown while the AI Answer is being prepared. Next.js renders
// this automatically on /learn route transitions before the server component
// resolves. Designed to feel quick and intentional — not a spinner, but a
// preview of the structure that's about to arrive.

const STAGES = [
  "Reading your question…",
  "Pulling community threads, KB articles, and courses…",
  "Drafting chapters and weaving sources…",
  "Picking what's relevant for you right now…",
];

export default function LoadingLearn() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFEFF] pt-16">
      <div className="mx-auto flex w-full max-w-[1080px] gap-8 px-4 pb-20 pt-7 sm:px-5 md:px-7 md:pt-9">
        {/* Sticky chapter nav skeleton */}
        <aside className="sticky top-20 hidden w-[200px] shrink-0 flex-col gap-2 self-start lg:flex">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[var(--accent-strong)]">
            In this answer
          </div>
          <div className="flex flex-col gap-1.5">
            {[60, 80, 50, 70].map((w, i) => (
              <div
                key={i}
                className="h-3 animate-pulse rounded-md bg-black/[0.05]"
                style={{ width: `${w}%`, animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        </aside>

        {/* Main column skeleton */}
        <main className="flex min-w-0 flex-1 flex-col gap-6">
          {/* Eyebrow + status */}
          <header className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--accent-bg)] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[var(--accent-strong)]">
              <Sparkles className="h-2.5 w-2.5 animate-pulse" strokeWidth={2.25} />
              AI Answers
            </span>

            {/* Title shimmer */}
            <div className="flex flex-col gap-2">
              <div className="h-7 w-[80%] animate-pulse rounded-lg bg-black/[0.06]" />
              <div className="h-7 w-[55%] animate-pulse rounded-lg bg-black/[0.06]" />
            </div>

            {/* Stage status — rotating message */}
            <div
              key={stage}
              className="mt-1 flex items-center gap-2 text-[12.5px] text-foreground/55"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-strong)] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-strong)]" />
              </span>
              <span className="animate-fade-in">{STAGES[stage]}</span>
            </div>

            {/* Intro shimmer */}
            <div className="flex flex-col gap-2">
              {[100, 95, 88, 75].map((w, i) => (
                <div
                  key={i}
                  className="h-3.5 animate-pulse rounded-md bg-black/[0.04]"
                  style={{ width: `${w}%`, animationDelay: `${i * 60}ms` }}
                />
              ))}
            </div>
          </header>

          {/* Recommendations skeleton */}
          <section className="flex flex-col gap-2">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[var(--accent-strong)]">
              Recommended for you
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-xl border border-black/[0.07] bg-white p-2.5"
                >
                  <div className="h-3 w-[80%] animate-pulse rounded-md bg-[var(--accent-bg)]" />
                  <div className="h-px bg-black/[0.06]" />
                  <div className="h-3 w-[40%] animate-pulse rounded-full bg-black/[0.04]" />
                  <div className="h-3.5 w-[90%] animate-pulse rounded-md bg-black/[0.05]" />
                  <div className="h-3 w-[100%] animate-pulse rounded-md bg-black/[0.03]" />
                  <div className="h-3 w-[70%] animate-pulse rounded-md bg-black/[0.03]" />
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-black/[0.06]" />

          {/* Chapter skeletons */}
          <div className="flex flex-col gap-6">
            {[0, 1].map((i) => (
              <section key={i} className="flex flex-col gap-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-[11px] font-semibold tabular-nums text-[var(--accent-strong)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="h-4 w-[50%] animate-pulse rounded-md bg-black/[0.06]" />
                </div>
                <div className="flex flex-col gap-2">
                  {[100, 95, 90, 70].map((w, j) => (
                    <div
                      key={j}
                      className="h-3 animate-pulse rounded-md bg-black/[0.04]"
                      style={{ width: `${w}%`, animationDelay: `${j * 60}ms` }}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-24 animate-pulse rounded-xl border border-black/[0.07] bg-white" />
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
