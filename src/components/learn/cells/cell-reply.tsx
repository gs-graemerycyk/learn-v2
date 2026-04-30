"use client";

import type { Cell } from "@/lib/learn/types";
import { Avatar, UpvoteButton } from "../inline-affordances";
import { CellShell } from "./cell-shell";

export function CellReply({ cell }: { cell: Cell<"reply"> }) {
  const { parentExcerpt, parentAuthor, quotedAuthor, quotedBody, upvotes } =
    cell.payload;
  return (
    <CellShell cell={cell}>
      <blockquote className="mb-2.5 border-l-2 border-black/15 pl-3">
        <div className="mb-1 flex items-center gap-1.5">
          <Avatar name={parentAuthor.name} color={parentAuthor.avatarColor} size={16} />
          <span className="text-[11.5px] font-medium text-black/55">
            {parentAuthor.name}
          </span>
        </div>
        <p className="text-[12.5px] leading-[1.4] text-black/55">{parentExcerpt}</p>
      </blockquote>

      <div className="rounded-xl bg-black/[0.025] p-3">
        <div className="mb-1.5 flex items-center gap-2">
          <Avatar name={quotedAuthor.name} color={quotedAuthor.avatarColor} size={20} />
          <span className="text-[12px] font-medium text-foreground">
            {quotedAuthor.name}
          </span>
          <span className="text-[11px] text-black/40">{quotedAuthor.role}</span>
        </div>
        <p className="text-[13px] leading-[1.4] text-foreground/85">{quotedBody}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <UpvoteButton initialCount={upvotes} />
      </div>
    </CellShell>
  );
}
