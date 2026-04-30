"use client";

import type { Cell } from "@/lib/learn/types";
import { InlineExpander } from "../inline-affordances";
import { CellShell } from "./cell-shell";

const ASSET_LABEL: Record<string, string> = {
  course: "Course",
  lesson: "Lesson",
  event: "Workshop",
  conversation: "Discussion",
  article: "Article",
};

export function CellLearningExperience({
  cell,
}: {
  cell: Cell<"learning-experience">;
}) {
  const { summary, assets, overallProgressPercent } = cell.payload;
  return (
    <CellShell cell={cell}>
      <p className="mb-3 text-[12.5px] leading-[1.4] text-black/70">{summary}</p>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-[10.5px] text-black/40">
          <span>Track progress</span>
          <span className="tabular-nums">{overallProgressPercent}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-foreground/70"
            style={{ width: `${overallProgressPercent}%` }}
          />
        </div>
      </div>

      <InlineExpander collapsedLabel="See all assets" expandedLabel="Hide assets">
        <ul className="flex flex-col gap-2">
          {assets.map((a, i) => (
            <li
              key={i}
              className="flex items-center gap-2.5 rounded-lg border border-black/[0.06] bg-white p-2.5"
            >
              <span className="inline-flex shrink-0 items-center rounded-full bg-black/[0.04] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-black/55">
                {ASSET_LABEL[a.type] ?? a.type}
              </span>
              <span className="flex-1 text-[12.5px] text-foreground/85">
                {a.title}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="h-1 w-12 overflow-hidden rounded-full bg-black/[0.06]">
                  <div
                    className="h-full rounded-full bg-foreground/70"
                    style={{ width: `${a.progressPercent}%` }}
                  />
                </div>
                <span className="text-[10.5px] tabular-nums text-black/40">
                  {a.progressPercent}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      </InlineExpander>
    </CellShell>
  );
}
