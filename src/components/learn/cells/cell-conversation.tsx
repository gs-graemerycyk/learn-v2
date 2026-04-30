"use client";

import type { Cell } from "@/lib/learn/types";
import { Avatar, ReplyAffordance, UpvoteButton } from "../inline-affordances";
import { CellShell } from "./cell-shell";

export function CellConversation({ cell }: { cell: Cell<"conversation"> }) {
  const { excerpt, participantCount, lastMessages } = cell.payload;
  return (
    <CellShell cell={cell}>
      <p className="text-[12.5px] leading-[1.4] text-black/65">{excerpt}</p>

      <div className="mt-3 flex flex-col gap-2">
        {lastMessages.map((m, i) => (
          <div
            key={i}
            className="rounded-xl border border-black/[0.06] bg-white p-2.5"
          >
            <div className="mb-1 flex items-center gap-2">
              <Avatar name={m.author.name} color={m.author.avatarColor} size={18} />
              <span className="text-[12px] font-medium text-foreground">
                {m.author.name}
              </span>
              <span className="ml-auto text-[10.5px] text-black/40">
                {m.postedAt}
              </span>
            </div>
            <p className="text-[12.5px] leading-[1.4] text-foreground/80">{m.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <UpvoteButton initialCount={lastMessages[0]?.upvotes ?? 0} />
        <ReplyAffordance placeholder="Join the conversation…" />
        <span className="ml-auto text-[11px] text-black/40">
          {participantCount} in thread
        </span>
      </div>
    </CellShell>
  );
}
