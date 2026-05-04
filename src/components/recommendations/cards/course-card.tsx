"use client";

import Link from "next/link";
import { Clock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseItem } from "../types";

const COURSE_TYPE_LABEL: Record<CourseItem["contentType"], string> = {
  course: "Course",
  lesson: "Lesson",
  learning_path: "Learning path",
};

interface CourseCardProps {
  item: CourseItem;
  position: number;
  onClickItem: (item: CourseItem, position: number) => void;
}

export function CourseCard({ item, position, onClickItem }: CourseCardProps) {
  const isResumption = item.itemClass === "resumption";
  const progress = isResumption ? item.progressPercent ?? 0 : 0;
  const subtitle = isResumption
    ? `${progress}% complete${
        item.estimatedTimeRemaining ? ` · ${item.estimatedTimeRemaining} left` : ""
      }`
    : item.estimatedTimeRemaining ?? COURSE_TYPE_LABEL[item.contentType];

  return (
    <Link
      href={item.url}
      onClick={() => onClickItem(item, position)}
      className={cn(
        "group flex aspect-[4/5] w-full flex-col overflow-hidden rounded-xl border border-black/[0.08] bg-white",
        "transition-all hover:-translate-y-0.5 hover:border-black/[0.18] hover:shadow-[0_8px_28px_-12px_rgba(0,0,0,0.18)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F2BBE] focus-visible:ring-offset-2"
      )}
    >
      {/* Thumbnail — fills top ~50% */}
      <div className="relative h-[50%] w-full shrink-0 overflow-hidden bg-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.thumbnailUrl}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* Top-left: type pill */}
        <span className="absolute left-2.5 top-2.5 inline-flex items-center rounded-full bg-white/95 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-black/70 shadow-sm">
          {COURSE_TYPE_LABEL[item.contentType]}
        </span>

        {/* Top-right: Continue pill on resumptions */}
        {isResumption && (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-[#3F2BBE] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-white shadow-sm">
            <Play className="h-2.5 w-2.5" strokeWidth={2.5} fill="currentColor" />
            Continue
          </span>
        )}

        {/* Progress bar overlay on bottom edge */}
        {isResumption && (
          <div
            className="absolute inset-x-0 bottom-0 h-1 bg-black/15"
            aria-label={`${progress} percent complete`}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-[#3F2BBE]"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="line-clamp-2 text-[14px] font-semibold leading-[1.3] text-foreground">
          {item.title}
        </h3>
        <div className="mt-auto flex items-center gap-1.5 text-[11.5px] text-black/50">
          <Clock className="h-3 w-3" strokeWidth={2} />
          <span>{subtitle}</span>
        </div>
      </div>
    </Link>
  );
}
