"use client";

import { CalendarDays, MapPin, Users } from "lucide-react";
import type { Cell } from "@/lib/learn/types";
import { RsvpToggle } from "../inline-affordances";
import { CellShell } from "./cell-shell";

export function CellEvent({ cell }: { cell: Cell<"event"> }) {
  const { summary, startsAt, location, rsvpCount, speakerNames } = cell.payload;
  return (
    <CellShell cell={cell}>
      <p className="mb-3 text-[12.5px] leading-[1.4] text-black/70">{summary}</p>

      <div className="mb-3 flex flex-col gap-1.5 rounded-xl bg-black/[0.025] p-3">
        <div className="flex items-center gap-2 text-[12.5px] text-foreground/80">
          <CalendarDays className="h-3.5 w-3.5 text-black/45" strokeWidth={2.25} />
          {startsAt}
        </div>
        <div className="flex items-center gap-2 text-[12.5px] text-foreground/80">
          <MapPin className="h-3.5 w-3.5 text-black/45" strokeWidth={2.25} />
          {location}
        </div>
        <div className="flex items-center gap-2 text-[12.5px] text-foreground/80">
          <Users className="h-3.5 w-3.5 text-black/45" strokeWidth={2.25} />
          {speakerNames.join(", ")}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <RsvpToggle initialCount={rsvpCount} />
        <span className="ml-auto text-[11px] text-black/40">
          {rsvpCount} going
        </span>
      </div>
    </CellShell>
  );
}
