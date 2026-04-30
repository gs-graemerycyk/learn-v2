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
  type LucideIcon,
} from "lucide-react";
import type { Cell, CellType } from "@/lib/learn/types";
import { useCellDetail } from "../cell-detail-context";
import { useWidgetMode } from "../widget-context";

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

export function CellShell({
  cell,
  children,
}: {
  cell: Cell;
  children: React.ReactNode;
}) {
  const { open } = useCellDetail();
  const mode = useWidgetMode();
  const meta = TYPE_META[cell.type];
  const Icon = meta.icon;
  // In builder mode the widget is a static preview — clicks shouldn't open
  // anything. The "Open" affordance is also hidden so the chrome reads as
  // configurable rather than interactive.
  const interactive = mode !== "builder";

  return (
    <article
      className={`group relative rounded-xl border border-black/[0.07] bg-white p-3 transition-shadow ${
        interactive ? "hover:shadow-[0_2px_14px_-6px_rgba(0,0,0,0.08)]" : ""
      }`}
      data-cell-type={cell.type}
      aria-disabled={!interactive}
    >
      <header className="mb-1.5 flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: `color-mix(in oklch, ${meta.tone} 14%, white)`, color: meta.tone }}
        >
          <Icon className="h-2.5 w-2.5" strokeWidth={2.25} />
          {meta.label}
        </span>
        {interactive && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              open(cell);
            }}
            className="inline-flex h-5 w-5 items-center justify-center rounded-md text-black/35 opacity-0 transition-all hover:bg-black/[0.05] hover:text-black/70 group-hover:opacity-100 focus:opacity-100"
            aria-label="Open"
          >
            <ArrowUpRight className="h-3 w-3" strokeWidth={2.25} />
          </button>
        )}
      </header>

      {interactive ? (
        <button onClick={() => open(cell)} className="block w-full text-left">
          <h3 className="text-[13px] font-semibold leading-[1.25] text-foreground">
            {cell.title}
          </h3>
        </button>
      ) : (
        <h3 className="block w-full text-left text-[13px] font-semibold leading-[1.25] text-foreground">
          {cell.title}
        </h3>
      )}

      <div className="mt-1.5">{children}</div>
    </article>
  );
}
