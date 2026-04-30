"use client";

import type { Chapter } from "@/lib/learn/types";
import { CellRouter } from "./cells";
import { ExplainableParagraph } from "./explainable-paragraph";

export function ChapterBlock({
  chapter,
  index,
}: {
  chapter: Chapter;
  index: number;
}) {
  // Interleave cells between text segments. With N segments and M cells we
  // distribute cells roughly evenly; remaining cells go after the last segment.
  const segments = chapter.segments;
  const cells = chapter.cells;
  const cellsPerGap = Math.ceil(cells.length / Math.max(segments.length, 1));

  return (
    <section
      id={`ch-${chapter.id}`}
      aria-labelledby={`ch-heading-${chapter.id}`}
      className="flex flex-col gap-3 scroll-mt-20"
    >
      <div className="flex items-baseline gap-2.5">
        <span className="text-[11px] font-semibold tabular-nums text-[var(--accent-strong)]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2
          id={`ch-heading-${chapter.id}`}
          className="text-[16px] font-semibold tracking-[-0.01em] text-foreground"
        >
          {chapter.heading}
        </h2>
      </div>

      {segments.map((seg, i) => {
        const sliceStart = i * cellsPerGap;
        const sliceEnd =
          i === segments.length - 1 ? cells.length : sliceStart + cellsPerGap;
        const segmentCells = cells.slice(sliceStart, sliceEnd);

        return (
          <div key={i} className="flex flex-col gap-2.5">
            {seg.explain ? (
              <ExplainableParagraph explain={seg.explain}>
                {seg.text}
              </ExplainableParagraph>
            ) : (
              <p className="max-w-[68ch] text-[13.5px] leading-[1.45] text-foreground/80">
                {seg.text}
              </p>
            )}
            {segmentCells.length > 0 && (
              <div className="flex flex-col gap-2">
                {segmentCells.map((c) => (
                  <CellRouter key={c.id} cell={c} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
