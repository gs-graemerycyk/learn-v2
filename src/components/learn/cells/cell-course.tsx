"use client";

import { Clock, ListOrdered } from "lucide-react";
import type { Cell } from "@/lib/learn/types";
import { InlineExpander } from "../inline-affordances";
import { CellShell } from "./cell-shell";

export function CellCourse({ cell }: { cell: Cell<"course"> }) {
  const {
    summary,
    lessonCount,
    estimatedMinutes,
    firstLessonTitle,
    firstLessonBody,
    outline,
  } = cell.payload;

  return (
    <CellShell cell={cell}>
      <div className="mb-2 flex flex-wrap items-center gap-3 text-[11px] text-black/45">
        <span className="inline-flex items-center gap-1">
          <ListOrdered className="h-3 w-3" strokeWidth={2.25} />
          {lessonCount} lessons
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" strokeWidth={2.25} />
          {estimatedMinutes} min
        </span>
      </div>
      <p className="mb-3 text-[12.5px] leading-[1.4] text-black/70">{summary}</p>

      <InlineExpander
        collapsedLabel="Start course — preview Lesson 1"
        expandedLabel="Hide preview"
      >
        <div className="rounded-xl bg-black/[0.025] p-3">
          <div className="mb-1.5 text-[11.5px] font-medium uppercase tracking-wide text-black/45">
            Lesson 1
          </div>
          <h4 className="mb-2 text-[13px] font-semibold text-foreground">
            {firstLessonTitle}
          </h4>
          <div className="flex flex-col gap-2">
            {firstLessonBody.map((p, i) => (
              <p key={i} className="text-[13px] leading-[1.4] text-foreground/80">
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <div className="mb-1.5 text-[11.5px] font-medium uppercase tracking-wide text-black/45">
            Course outline
          </div>
          <ol className="flex flex-col gap-1">
            {outline.map((o, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-[12.5px] text-foreground/75"
              >
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-[10.5px] font-medium text-black/55 tabular-nums">
                  {i + 1}
                </span>
                <span className="flex-1">{o.title}</span>
                <span className="text-[10.5px] text-black/35">{o.minutes} min</span>
              </li>
            ))}
          </ol>
        </div>
      </InlineExpander>
    </CellShell>
  );
}
