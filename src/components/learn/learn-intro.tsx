"use client";

import { Sparkles } from "lucide-react";

export function LearnIntro({ query, intro }: { query: string; intro: string }) {
  return (
    <header className="flex flex-col gap-2.5">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--accent-bg)] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[var(--accent-strong)]">
        <Sparkles className="h-2.5 w-2.5" strokeWidth={2.25} />
        AI Answers
      </span>
      <h1 className="max-w-[44ch] text-[clamp(1.4rem,2.4vw,1.85rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground">
        {query}
      </h1>
      <p className="max-w-[64ch] text-[13.5px] leading-[1.45] text-black/65">
        {intro}
      </p>
    </header>
  );
}
