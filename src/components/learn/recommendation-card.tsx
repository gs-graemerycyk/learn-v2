"use client";

import { Sparkles, ArrowUpRight } from "lucide-react";
import type { Cell, Recommendation } from "@/lib/learn/types";
import { useCellDetail } from "./cell-detail-context";

const TYPE_LABEL: Record<string, string> = {
  question: "Question",
  conversation: "Conversation",
  idea: "Idea",
  reply: "Reply",
  article: "Article",
  "product-update": "Product Update",
  course: "Course",
  lesson: "Lesson",
  "learning-experience": "Learning Experience",
  event: "Event",
};

const TYPE_TONE: Record<string, string> = {
  question: "var(--cell-question)",
  conversation: "var(--cell-conversation)",
  idea: "var(--cell-idea)",
  reply: "var(--cell-reply)",
  article: "var(--cell-article)",
  "product-update": "var(--cell-product-update)",
  course: "var(--cell-course)",
  lesson: "var(--cell-lesson)",
  "learning-experience": "var(--cell-learning-experience)",
  event: "var(--cell-event)",
};

export function RecommendationCard({ rec }: { rec: Recommendation }) {
  const { open } = useCellDetail();
  const typeLabel = TYPE_LABEL[rec.cell.type] ?? rec.cell.type;
  const tone = TYPE_TONE[rec.cell.type] ?? "var(--accent-strong)";

  // A short, type-aware preview line drawn from the cell payload.
  const previewLine = previewFor(rec);

  return (
    <button
      onClick={() => open(rec.cell)}
      className="group flex h-full flex-col gap-2 rounded-xl border border-black/[0.07] bg-white p-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-black/[0.12] hover:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)]"
    >
      {/* Reasoning strip — *why this user, why now* */}
      <div className="flex items-start gap-1.5 text-[11px] leading-[1.35] text-[var(--accent-strong)]">
        <Sparkles
          className="mt-0.5 h-2.5 w-2.5 shrink-0"
          strokeWidth={2.25}
        />
        <span className="font-semibold">{rec.reasoning}</span>
      </div>

      <div className="h-px" style={{ backgroundColor: `color-mix(in oklch, ${tone} 22%, white)` }} />

      <span
        className="inline-flex w-fit items-center rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide"
        style={{ backgroundColor: `color-mix(in oklch, ${tone} 14%, white)`, color: tone }}
      >
        {typeLabel}
      </span>

      <h4 className="text-[13px] font-semibold leading-[1.25] text-foreground">
        {rec.cell.title}
      </h4>

      <p className="line-clamp-3 text-[12px] leading-[1.4] text-black/55">{previewLine}</p>

      <div className="mt-auto flex items-center gap-1 text-[11px] font-medium text-foreground/55 transition-colors group-hover:text-foreground">
        {ctaFor(rec.cell.type)}
        <ArrowUpRight
          className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5"
          strokeWidth={2.25}
        />
      </div>
    </button>
  );
}

function ctaFor(type: Recommendation["cell"]["type"]): string {
  switch (type) {
    case "lesson":
    case "course":
      return "Continue";
    case "article":
    case "product-update":
      return "Read";
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
    default:
      return "Read";
  }
}

function previewFor(rec: Recommendation): string {
  const c = rec.cell;
  switch (c.type) {
    case "question":
      return (c as Cell<"question">).payload.excerpt;
    case "conversation":
      return (c as Cell<"conversation">).payload.excerpt;
    case "idea":
      return (c as Cell<"idea">).payload.description;
    case "article":
      return (c as Cell<"article">).payload.lede;
    case "product-update":
      return (c as Cell<"product-update">).payload.summary;
    case "course":
      return (c as Cell<"course">).payload.summary;
    case "lesson":
      return (c as Cell<"lesson">).payload.snippet;
    case "learning-experience":
      return (c as Cell<"learning-experience">).payload.summary;
    case "event":
      return (c as Cell<"event">).payload.summary;
    case "reply":
      return (c as Cell<"reply">).payload.quotedBody;
  }
}
