"use client";

import { Clock } from "lucide-react";
import type { Cell } from "@/lib/learn/types";
import { Avatar, InlineExpander } from "../inline-affordances";
import { CellShell } from "./cell-shell";

export function CellArticle({ cell }: { cell: Cell<"article"> }) {
  const { lede, body, readMinutes, author, articleKind } = cell.payload;
  return (
    <CellShell cell={cell}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {articleKind && articleKind !== "Article" && (
          <span className="inline-flex items-center rounded-full bg-[var(--accent-bg)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent-strong)]">
            {articleKind}
          </span>
        )}
        <Avatar name={author.name} color={author.avatarColor} size={18} />
        <span className="text-[11.5px] font-medium text-black/60">
          {author.name}
        </span>
        <span className="text-[10.5px] text-black/35">·</span>
        <span className="inline-flex items-center gap-1 text-[10.5px] text-black/40">
          <Clock className="h-2.5 w-2.5" strokeWidth={2.25} /> {readMinutes} min read
        </span>
      </div>

      <p className="mb-3 text-[12.5px] leading-[1.4] text-black/70">{lede}</p>

      <InlineExpander
        collapsedLabel="Continue reading"
        expandedLabel="Show less"
      >
        <div className="flex flex-col gap-2.5 border-l-2 border-black/[0.08] pl-3">
          {body.map((para, i) => (
            <p key={i} className="text-[13px] leading-[1.4] text-foreground/80">
              {para}
            </p>
          ))}
        </div>
      </InlineExpander>
    </CellShell>
  );
}
