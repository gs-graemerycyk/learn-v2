"use client";

import { Check } from "lucide-react";
import type { Cell } from "@/lib/learn/types";
import { Avatar, ReplyAffordance, UpvoteButton } from "../inline-affordances";
import { CellShell } from "./cell-shell";

export function CellQuestion({ cell }: { cell: Cell<"question"> }) {
  const { excerpt, upvotes, replyCount, topReply } = cell.payload;
  return (
    <CellShell cell={cell}>
      <p className="text-[12.5px] leading-[1.4] text-black/65">{excerpt}</p>

      <div className="mt-3 rounded-xl bg-black/[0.025] p-3">
        <div className="mb-1.5 flex items-center gap-2">
          <Avatar name={topReply.author.name} color={topReply.author.avatarColor} size={20} />
          <span className="text-[12px] font-medium text-foreground">
            {topReply.author.name}
          </span>
          <span className="text-[11px] text-black/40">{topReply.author.role}</span>
          {topReply.acceptedAnswer && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
              <Check className="h-2.5 w-2.5" strokeWidth={2.5} /> Best answer
            </span>
          )}
        </div>
        <p className="text-[13px] leading-[1.4] text-foreground/85">{topReply.body}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <UpvoteButton initialCount={upvotes} />
        <ReplyAffordance placeholder="Add a reply…" />
        <span className="ml-auto text-[11px] text-black/40">
          {replyCount} replies
        </span>
      </div>
    </CellShell>
  );
}
