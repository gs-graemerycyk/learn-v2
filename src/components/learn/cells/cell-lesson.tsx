"use client";

import { Clock, Play } from "lucide-react";
import type { Cell } from "@/lib/learn/types";
import { InlineExpander } from "../inline-affordances";
import { CellShell } from "./cell-shell";

export function CellLesson({ cell }: { cell: Cell<"lesson"> }) {
  const {
    snippet,
    body,
    progressPercent,
    durationMinutes,
    courseTitle,
    videoUrl,
    videoPoster,
  } = cell.payload;
  const isVideo = !!videoUrl;

  return (
    <CellShell cell={cell}>
      <div className="mb-2 flex items-center gap-2 text-[11px] text-black/45">
        {isVideo && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide"
            style={{
              backgroundColor: "color-mix(in oklch, var(--cell-lesson) 14%, white)",
              color: "var(--cell-lesson)",
            }}
          >
            <Play className="h-2.5 w-2.5 fill-current" strokeWidth={0} />
            Video lesson
          </span>
        )}
        <span className="font-medium text-black/55">{courseTitle}</span>
        <span>·</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" strokeWidth={2.25} />
          {durationMinutes} min
        </span>
      </div>

      {isVideo && (
        <div className="mb-3 overflow-hidden rounded-lg border border-black/[0.07] bg-black">
          <video
            src={videoUrl}
            poster={videoPoster}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-[10.5px] text-black/40">
          <span>Your progress</span>
          <span className="tabular-nums">{progressPercent}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: "var(--cell-lesson)",
            }}
          />
        </div>
      </div>

      <p className="mb-3 text-[12.5px] leading-[1.4] text-foreground/85">{snippet}</p>

      {/* For text lessons keep the inline expander; for video lessons the
          body sits as supplementary notes under the video */}
      {isVideo ? (
        body.length > 1 && (
          <InlineExpander collapsedLabel="Lesson notes" expandedLabel="Hide notes">
            <div className="flex flex-col gap-2.5 border-l-2 border-foreground/15 pl-3">
              {body.slice(1).map((p, i) => (
                <p key={i} className="text-[13px] leading-[1.4] text-foreground/80">
                  {p}
                </p>
              ))}
            </div>
          </InlineExpander>
        )
      ) : (
        <InlineExpander collapsedLabel="Continue lesson" expandedLabel="Pause lesson">
          <div className="flex flex-col gap-2.5 border-l-2 border-foreground/15 pl-3">
            {body.slice(1).map((p, i) => (
              <p key={i} className="text-[13px] leading-[1.4] text-foreground/80">
                {p}
              </p>
            ))}
          </div>
        </InlineExpander>
      )}
    </CellShell>
  );
}
