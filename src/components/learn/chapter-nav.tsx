"use client";

import { useEffect, useState } from "react";
import type { Chapter } from "@/lib/learn/types";

// A sticky chapter list rendered alongside the answer body. Highlights the
// chapter currently in view via IntersectionObserver. Hidden on small viewports.

export function ChapterNav({ chapters }: { chapters: Chapter[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id);

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(`ch-${c.id}`))
      .filter((el): el is HTMLElement => !!el);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest to the top among intersecting ones.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id.replace(/^ch-/, "");
          setActiveId(id);
        }
      },
      {
        // Trigger when the section's top is within the upper third of the viewport
        rootMargin: "-15% 0px -65% 0px",
        threshold: 0,
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [chapters]);

  return (
    <aside className="sticky top-20 hidden w-[200px] shrink-0 flex-col gap-2 self-start lg:flex">
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[var(--accent-strong)]">
        In this answer
      </div>
      <nav className="flex flex-col gap-0.5">
        {chapters.map((c, i) => {
          const active = c.id === activeId;
          return (
            <a
              key={c.id}
              href={`#ch-${c.id}`}
              className={`group flex items-baseline gap-2 rounded-md px-2 py-1.5 text-[12px] leading-[1.3] transition-all ${
                active
                  ? "bg-[var(--accent-bg)] font-medium text-[var(--accent-strong)]"
                  : "text-foreground/55 hover:bg-black/[0.03] hover:text-foreground/80"
              }`}
            >
              <span
                className={`shrink-0 tabular-nums text-[10.5px] ${
                  active ? "text-[var(--accent-strong)]" : "text-foreground/35"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">{c.heading}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
