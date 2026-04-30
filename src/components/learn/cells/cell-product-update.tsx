"use client";

import { Sparkles } from "lucide-react";
import type { Cell } from "@/lib/learn/types";
import { InlineExpander } from "../inline-affordances";
import { CellShell } from "./cell-shell";

export function CellProductUpdate({ cell }: { cell: Cell<"product-update"> }) {
  const { summary, keyChanges, fullChangelog, releasedOn } = cell.payload;
  return (
    <CellShell cell={cell}>
      <div className="mb-2 flex items-center gap-2 text-[11px] text-black/45">
        <Sparkles className="h-3 w-3" strokeWidth={2.25} />
        Released {releasedOn}
      </div>
      <p className="mb-3 text-[12.5px] leading-[1.4] text-black/70">{summary}</p>

      <ul className="mb-3 flex flex-col gap-1.5">
        {keyChanges.map((c, i) => (
          <li
            key={i}
            className="flex gap-2 text-[13px] leading-[1.4] text-foreground/80"
          >
            <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-black/40" />
            <span>{c}</span>
          </li>
        ))}
      </ul>

      <InlineExpander collapsedLabel="See full changelog" expandedLabel="Hide changelog">
        <ul className="flex flex-col gap-1.5 border-l-2 border-black/[0.08] pl-3">
          {fullChangelog.map((c, i) => (
            <li
              key={i}
              className="flex gap-2 text-[12.5px] leading-[1.4] text-foreground/75"
            >
              <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-black/30" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </InlineExpander>
    </CellShell>
  );
}
