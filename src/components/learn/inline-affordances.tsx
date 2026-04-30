"use client";

import { useState } from "react";
import { ArrowUp, MessageSquarePlus, ChevronDown, Check } from "lucide-react";

// Small, low-chrome affordances shared by many cell types. These do not
// persist anywhere — state lives in component state for the prototype.

export function UpvoteButton({ initialCount }: { initialCount: number }) {
  const [voted, setVoted] = useState(false);
  const count = voted ? initialCount + 1 : initialCount;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setVoted((v) => !v);
      }}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors ${
        voted
          ? "bg-foreground/[0.08] text-foreground"
          : "bg-black/[0.03] text-black/60 hover:bg-black/[0.06]"
      }`}
      aria-pressed={voted}
      aria-label={voted ? "Remove upvote" : "Upvote"}
    >
      <ArrowUp className="h-3 w-3" strokeWidth={2.25} />
      <span className="tabular-nums">{count}</span>
    </button>
  );
}

export function ReplyAffordance({ placeholder }: { placeholder: string }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  if (!open) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.03] px-2.5 py-1 text-[12px] font-medium text-black/60 transition-colors hover:bg-black/[0.06]"
      >
        <MessageSquarePlus className="h-3 w-3" strokeWidth={2.25} />
        Reply
      </button>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="mt-2 flex w-full flex-col gap-2 rounded-xl border border-black/[0.08] bg-white p-2"
    >
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
        rows={2}
        autoFocus
        className="w-full resize-none bg-transparent text-[13px] leading-snug text-foreground outline-none placeholder:text-black/30"
      />
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => {
            setOpen(false);
            setDraft("");
          }}
          className="rounded-md px-2 py-1 text-[12px] text-black/50 hover:text-black/80"
        >
          Cancel
        </button>
        <button
          disabled={!draft.trim()}
          onClick={() => {
            // Posting collapses the composer back to the Reply button so
            // the user can post another reply without the "queued" state.
            setOpen(false);
            setDraft("");
          }}
          className="rounded-md bg-foreground px-2.5 py-1 text-[12px] font-medium text-background transition-opacity disabled:opacity-30"
        >
          Reply
        </button>
      </div>
    </div>
  );
}

export function CommentAffordance({ placeholder }: { placeholder: string }) {
  // Same shape as reply but labelled differently — keeps idea/comment vs question/reply
  // distinct in a way users recognise.
  return <ReplyAffordance placeholder={placeholder} />;
}

export function InlineExpander({
  collapsedLabel,
  expandedLabel,
  children,
}: {
  collapsedLabel: string;
  expandedLabel?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded-full bg-black/[0.03] px-2.5 py-1 text-[12px] font-medium text-black/60 transition-colors hover:bg-black/[0.06]"
      >
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2.25}
        />
        {open ? expandedLabel ?? "Show less" : collapsedLabel}
      </button>
      {open && <div className="mt-2.5">{children}</div>}
    </div>
  );
}

export function RsvpToggle({ initialCount }: { initialCount: number }) {
  const [rsvpd, setRsvpd] = useState(false);
  const count = rsvpd ? initialCount + 1 : initialCount;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setRsvpd((r) => !r);
      }}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
        rsvpd
          ? "bg-foreground text-background"
          : "bg-foreground/[0.08] text-foreground hover:bg-foreground/[0.12]"
      }`}
    >
      {rsvpd ? <Check className="h-3 w-3" strokeWidth={2.25} /> : null}
      {rsvpd ? "Going" : "RSVP"}
      <span className="tabular-nums opacity-70">{count}</span>
    </button>
  );
}

export function Avatar({
  name,
  color,
  size = 24,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className="inline-flex shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-foreground/70"
      style={{ width: size, height: size, backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
