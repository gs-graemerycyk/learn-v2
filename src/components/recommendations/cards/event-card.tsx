"use client";

import Link from "next/link";
import { Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventItem } from "../types";

const EVENT_TYPE_LABEL: Record<EventItem["contentType"], string> = {
  event: "Event",
  product_update: "Product update",
};

interface EventCardProps {
  item: EventItem;
  position: number;
  onClickItem: (item: EventItem, position: number) => void;
}

export function EventCard({ item, position, onClickItem }: EventCardProps) {
  const isProductUpdate = item.contentType === "product_update";

  return (
    <Link
      href={item.url}
      onClick={() => onClickItem(item, position)}
      className={cn(
        "group flex aspect-[4/5] w-full flex-col overflow-hidden rounded-xl border border-black/[0.08] p-4",
        isProductUpdate
          ? "bg-gradient-to-br from-violet-50 via-white to-indigo-50"
          : "bg-gradient-to-br from-rose-50 via-white to-amber-50",
        "transition-all hover:-translate-y-0.5 hover:border-black/[0.18] hover:shadow-[0_8px_28px_-12px_rgba(0,0,0,0.18)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F2BBE] focus-visible:ring-offset-2"
      )}
    >
      {/* Top: type pill */}
      <span
        className={cn(
          "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide",
          isProductUpdate
            ? "bg-violet-100 text-violet-700"
            : "bg-rose-100 text-rose-700"
        )}
      >
        {isProductUpdate ? (
          <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
        ) : (
          <Calendar className="h-2.5 w-2.5" strokeWidth={2.5} />
        )}
        {EVENT_TYPE_LABEL[item.contentType]}
      </span>

      {/* Date or version */}
      {!isProductUpdate && item.date && (
        <div className="mt-3 text-[20px] font-semibold leading-[1.1] tracking-tight text-foreground">
          {formatDate(item.date)}
        </div>
      )}
      {isProductUpdate && item.version && (
        <span className="mt-3 inline-flex w-fit items-center rounded-md bg-foreground px-2 py-0.5 font-mono text-[11px] font-semibold tracking-tight text-background">
          {item.version}
        </span>
      )}

      {/* Title */}
      <h3 className="mt-2 line-clamp-2 text-[15px] font-semibold leading-[1.3] text-foreground">
        {item.title}
      </h3>

      {/* Description */}
      <p className="mt-2 line-clamp-3 text-[12.5px] leading-[1.5] text-black/55">
        {item.description}
      </p>

      {/* Footer affordance */}
      <div className="mt-auto pt-3 text-[11.5px] font-semibold text-[#3F2BBE]">
        {isProductUpdate ? "Read release notes →" : "View details →"}
      </div>
    </Link>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
