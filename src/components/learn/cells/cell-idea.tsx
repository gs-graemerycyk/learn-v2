"use client";

import type { Cell } from "@/lib/learn/types";
import { CommentAffordance, UpvoteButton } from "../inline-affordances";
import { CellShell } from "./cell-shell";

const STATUS_TONE: Record<string, string> = {
  open: "bg-black/[0.05] text-black/55",
  "under-review": "bg-amber-500/10 text-amber-700",
  planned: "bg-sky-500/10 text-sky-700",
  shipped: "bg-emerald-500/10 text-emerald-700",
};

export function CellIdea({ cell }: { cell: Cell<"idea"> }) {
  const { description, upvotes, commentCount, status } = cell.payload;
  return (
    <CellShell cell={cell}>
      <div className="mb-2">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide ${STATUS_TONE[status]}`}
        >
          {status.replace("-", " ")}
        </span>
      </div>
      <p className="text-[12.5px] leading-[1.4] text-black/65">{description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <UpvoteButton initialCount={upvotes} />
        <CommentAffordance placeholder="Add a comment…" />
        <span className="ml-auto text-[11px] text-black/40">
          {commentCount} comments
        </span>
      </div>
    </CellShell>
  );
}
