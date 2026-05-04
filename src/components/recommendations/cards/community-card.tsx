"use client";

import Link from "next/link";
import { Eye, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityItem } from "../types";

const COMMUNITY_TYPE_LABEL: Record<CommunityItem["contentType"], string> = {
  question: "Question",
  article: "Article",
  idea: "Idea",
  conversation: "Conversation",
};

const COMMUNITY_TYPE_TONE: Record<CommunityItem["contentType"], string> = {
  question: "bg-amber-100 text-amber-700",
  article: "bg-sky-100 text-sky-700",
  idea: "bg-violet-100 text-violet-700",
  conversation: "bg-emerald-100 text-emerald-700",
};

interface CommunityCardProps {
  item: CommunityItem;
  position: number;
  onClickItem: (item: CommunityItem, position: number) => void;
}

export function CommunityCard({ item, position, onClickItem }: CommunityCardProps) {
  const initials = item.authorName
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link
      href={item.url}
      onClick={() => onClickItem(item, position)}
      className={cn(
        "group flex aspect-[4/5] w-full flex-col overflow-hidden rounded-xl border border-black/[0.08] bg-white p-4",
        "transition-all hover:-translate-y-0.5 hover:border-black/[0.18] hover:shadow-[0_8px_28px_-12px_rgba(0,0,0,0.18)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F2BBE] focus-visible:ring-offset-2"
      )}
    >
      {/* Top: type pill */}
      <span
        className={cn(
          "inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide",
          COMMUNITY_TYPE_TONE[item.contentType]
        )}
      >
        {COMMUNITY_TYPE_LABEL[item.contentType]}
      </span>

      {/* Category */}
      <div className="mt-2.5 text-[10.5px] font-semibold uppercase tracking-wide text-black/45">
        {item.category}
      </div>

      {/* Title */}
      <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-[1.3] text-foreground">
        {item.title}
      </h3>

      {/* Snippet */}
      <p className="mt-2 line-clamp-3 text-[12.5px] leading-[1.5] text-black/55">
        {item.snippet}
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-3">
        <div className="flex items-center gap-2 min-w-0">
          {item.authorAvatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.authorAvatarUrl}
              alt=""
              className="h-6 w-6 shrink-0 rounded-full bg-black/5 object-cover"
            />
          ) : (
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-black/[0.06] text-[10px] font-semibold text-black/55">
              {initials}
            </span>
          )}
          <span className="truncate text-[11.5px] font-medium text-black/65">
            {item.authorName}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2.5 text-[11px] text-black/45">
          {typeof item.viewCount === "number" && (
            <span
              className="flex items-center gap-1"
              aria-label={`${item.viewCount} views`}
            >
              <Eye className="h-3 w-3" strokeWidth={2} />
              <span>{formatCount(item.viewCount)}</span>
            </span>
          )}
          <span
            className="flex items-center gap-1"
            aria-label={`${item.replyCount} replies`}
          >
            <MessageSquare className="h-3 w-3" strokeWidth={2} />
            <span>{formatCount(item.replyCount)}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}
