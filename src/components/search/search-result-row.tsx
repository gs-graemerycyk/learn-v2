"use client";

import {
  HelpCircle,
  MessagesSquare,
  Lightbulb,
  CornerDownRight,
  FileText,
  Megaphone,
  GraduationCap,
  PlayCircle,
  Layers,
  CalendarDays,
  ArrowUpRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Cell, CellType } from "@/lib/learn/types";
import type { SearchResult } from "@/lib/learn/search-data";
import { cellHref } from "@/lib/learn/search-data";

const TYPE_META: Record<CellType, { label: string; icon: LucideIcon; tone: string }> = {
  question: { label: "Question", icon: HelpCircle, tone: "var(--cell-question)" },
  conversation: { label: "Conversation", icon: MessagesSquare, tone: "var(--cell-conversation)" },
  idea: { label: "Idea", icon: Lightbulb, tone: "var(--cell-idea)" },
  reply: { label: "Reply", icon: CornerDownRight, tone: "var(--cell-reply)" },
  article: { label: "Article", icon: FileText, tone: "var(--cell-article)" },
  "product-update": { label: "Product Update", icon: Megaphone, tone: "var(--cell-product-update)" },
  course: { label: "Course", icon: GraduationCap, tone: "var(--cell-course)" },
  lesson: { label: "Lesson", icon: PlayCircle, tone: "var(--cell-lesson)" },
  "learning-experience": { label: "Learning Experience", icon: Layers, tone: "var(--cell-learning-experience)" },
  event: { label: "Event", icon: CalendarDays, tone: "var(--cell-event)" },
};

// Per-type CTA text, mirroring the AI-Answer recommendation card vocabulary.
function ctaFor(type: CellType): string {
  switch (type) {
    case "lesson":
    case "course":
      return "Open course";
    case "article":
    case "product-update":
      return "Read article";
    case "event":
      return "View event";
    case "idea":
      return "Open idea";
    case "question":
    case "conversation":
    case "reply":
      return "Open thread";
    case "learning-experience":
      return "Open track";
  }
}

// Mirrors RecommendationCard.previewFor — different cell types surface
// different lead lines.
function previewFor(cell: Cell): string {
  switch (cell.type) {
    case "question":
      return (cell as Cell<"question">).payload.excerpt;
    case "conversation":
      return (cell as Cell<"conversation">).payload.excerpt;
    case "idea":
      return (cell as Cell<"idea">).payload.description;
    case "article":
      return (cell as Cell<"article">).payload.lede;
    case "product-update":
      return (cell as Cell<"product-update">).payload.summary;
    case "course":
      return (cell as Cell<"course">).payload.summary;
    case "lesson":
      return (cell as Cell<"lesson">).payload.snippet;
    case "learning-experience":
      return (cell as Cell<"learning-experience">).payload.summary;
    case "event":
      return (cell as Cell<"event">).payload.summary;
    case "reply":
      return (cell as Cell<"reply">).payload.quotedBody;
  }
}

export function SearchResultRow({ result }: { result: SearchResult }) {
  const { cell, matchReason } = result;
  const meta = TYPE_META[cell.type];
  const Icon = meta.icon;

  return (
    <a
      href={cellHref(cell.id)}
      className="group flex flex-col gap-2 rounded-xl border border-black/[0.07] bg-white p-3.5 transition-all hover:border-black/[0.12] hover:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)]"
    >
      <header className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: `color-mix(in oklch, ${meta.tone} 14%, white)`, color: meta.tone }}
        >
          <Icon className="h-2.5 w-2.5" strokeWidth={2.25} />
          {meta.label}
        </span>
        <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-foreground/55">
          <Sparkles className="h-2.5 w-2.5 text-foreground/45" strokeWidth={2.25} />
          {matchReason}
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-[11.5px] font-medium text-foreground/55 opacity-0 transition-opacity group-hover:opacity-100">
          {ctaFor(cell.type)}
          <ArrowUpRight className="h-3 w-3" strokeWidth={2.25} />
        </span>
      </header>

      <h3 className="text-[15px] font-semibold leading-snug text-foreground">
        {cell.title}
      </h3>

      <p className="line-clamp-2 max-w-[80ch] text-[13px] leading-[1.45] text-foreground/65">
        {previewFor(cell)}
      </p>
    </a>
  );
}
