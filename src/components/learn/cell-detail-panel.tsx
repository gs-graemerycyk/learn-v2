"use client";

import { useEffect, useState } from "react";
import { X, Check, ChevronLeft, ExternalLink } from "lucide-react";
import type { Cell } from "@/lib/learn/types";
import { useCellDetail } from "./cell-detail-context";
import { Avatar, RsvpToggle, UpvoteButton } from "./inline-affordances";
import { usePanelScope } from "./widget-context";

// Cell detail layer.
//
// Desktop (≥sm): right-anchored slide-out, 520px wide, slides in from right.
// Mobile (<sm): full-screen layer that covers the Learn page entirely,
//   slides up from the bottom. The X / back chevron returns the user to
//   the Learn page so they never lose context.
//
// In-app widget mode (PanelScope="container"): the panel is absolute-
// positioned within the widget container and ALWAYS uses the mobile
// pattern — full-screen takeover with a back chevron — regardless of
// viewport size. This matches how an in-app chatbot drawer behaves.

export function CellDetailPanel() {
  const { openCell, close } = useCellDetail();
  const scope = usePanelScope();
  const [visible, setVisible] = useState(false);

  // Slide-in animation: mount → next frame → translate to 0
  useEffect(() => {
    if (openCell) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [openCell]);

  // Esc to close
  useEffect(() => {
    if (!openCell) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openCell]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(close, 280);
  };

  if (!openCell) return null;

  // Container scope (in-app widget): always full-takeover within the widget
  // box, slides up from the bottom, back chevron in the header.
  // Viewport scope (default): right slide-out on desktop (≥sm), full-screen
  // slide-up on mobile.
  const isContained = scope === "container";

  return (
    <div
      className={`${isContained ? "absolute" : "fixed"} inset-0 z-[120]`}
      role="dialog"
      aria-modal="true"
      aria-label={openCell.title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity"
        style={{ opacity: visible ? 1 : 0, transitionDuration: "280ms" }}
        onClick={handleClose}
      />

      <div
        data-visible={visible}
        className={[
          "absolute flex flex-col bg-[#FDFEFF] transition-transform ease-out",
          isContained
            ? // In-app widget: always full-takeover, slide up from bottom
              "inset-0 w-full translate-y-full data-[visible=true]:translate-y-0"
            : // Default: mobile slide-up, desktop right slide-out 520px
              [
                "inset-0 w-full",
                "sm:left-auto sm:right-0 sm:top-0 sm:bottom-0 sm:w-[520px] sm:shadow-[-12px_0_40px_-12px_rgba(0,0,0,0.18)]",
                "translate-y-full sm:translate-x-full sm:translate-y-0",
                "data-[visible=true]:translate-y-0 sm:data-[visible=true]:translate-x-0",
              ].join(" "),
        ].join(" ")}
        style={{ transitionDuration: "320ms" }}
      >
        {/* Header — back chevron when contained or on mobile, X otherwise */}
        <div className="flex items-start gap-2 border-b border-black/[0.06] px-4 py-3.5 sm:px-5 sm:py-4">
          <button
            onClick={handleClose}
            aria-label="Back"
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-black/55 transition-colors hover:bg-black/[0.05] ${
              isContained ? "" : "sm:hidden"
            }`}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <div className="mb-1 text-[10.5px] font-medium uppercase tracking-wide text-black/45">
              {labelFor(openCell)}
            </div>
            <h2 className="text-[17px] font-semibold leading-tight text-foreground sm:text-[19px]">
              {openCell.title}
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className={`h-8 w-8 shrink-0 items-center justify-center rounded-lg text-black/55 transition-colors hover:bg-black/[0.05] ${
              isContained ? "hidden" : "hidden sm:inline-flex"
            }`}
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          <CellDetailBody cell={openCell} />
        </div>
      </div>
    </div>
  );
}

function labelFor(c: Cell): string {
  return ({
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
  } as const)[c.type];
}

function CellDetailBody({ cell }: { cell: Cell }) {
  switch (cell.type) {
    case "question": {
      const p = (cell as Cell<"question">).payload;
      return (
        <div className="flex flex-col gap-4">
          {p.sourceUrl && <SourceLink url={p.sourceUrl} />}
          <p className="text-[14px] leading-relaxed text-foreground/85">{p.excerpt}</p>
          <UpvoteButton initialCount={p.upvotes} />
          <h3 className="mt-2 text-[12px] font-semibold uppercase tracking-wide text-black/45">
            All replies ({p.fullThread.length})
          </h3>
          <div className="flex flex-col gap-3">
            {p.fullThread.map((r, i) => (
              <ReplyRow key={i} reply={r} />
            ))}
          </div>
        </div>
      );
    }
    case "conversation": {
      const p = (cell as Cell<"conversation">).payload;
      return (
        <div className="flex flex-col gap-3">
          <p className="text-[14px] leading-relaxed text-foreground/85">{p.excerpt}</p>
          {p.fullThread.map((r, i) => (
            <ReplyRow key={i} reply={r} />
          ))}
        </div>
      );
    }
    case "idea": {
      const p = (cell as Cell<"idea">).payload;
      return (
        <div className="flex flex-col gap-4">
          <p className="text-[14px] leading-relaxed text-foreground/85">{p.description}</p>
          <UpvoteButton initialCount={p.upvotes} />
          <h3 className="mt-2 text-[12px] font-semibold uppercase tracking-wide text-black/45">
            Comments
          </h3>
          {p.topComments.map((r, i) => (
            <ReplyRow key={i} reply={r} />
          ))}
        </div>
      );
    }
    case "reply": {
      const p = (cell as Cell<"reply">).payload;
      return (
        <div className="flex flex-col gap-4">
          <blockquote className="border-l-2 border-black/15 pl-3">
            <div className="mb-1 flex items-center gap-1.5">
              <Avatar
                name={p.parentAuthor.name}
                color={p.parentAuthor.avatarColor}
                size={16}
              />
              <span className="text-[12px] font-medium text-black/60">
                {p.parentAuthor.name}
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-black/55">{p.parentExcerpt}</p>
          </blockquote>
          <div className="rounded-xl bg-black/[0.025] p-3.5">
            <div className="mb-2 flex items-center gap-2">
              <Avatar
                name={p.quotedAuthor.name}
                color={p.quotedAuthor.avatarColor}
                size={22}
              />
              <span className="text-[13px] font-medium text-foreground">
                {p.quotedAuthor.name}
              </span>
              <span className="text-[11.5px] text-black/45">{p.quotedAuthor.role}</span>
            </div>
            <p className="text-[14px] leading-relaxed text-foreground/85">
              {p.quotedBody}
            </p>
          </div>
          <UpvoteButton initialCount={p.upvotes} />
        </div>
      );
    }
    case "article": {
      const p = (cell as Cell<"article">).payload;
      return (
        <div className="flex flex-col gap-4">
          {p.sourceUrl && <SourceLink url={p.sourceUrl} label={p.articleKind ?? "Source"} />}
          <div className="flex items-center gap-2">
            <Avatar name={p.author.name} color={p.author.avatarColor} size={22} />
            <span className="text-[13px] font-medium text-foreground/85">
              {p.author.name}
            </span>
            <span className="text-[11.5px] text-black/40">{p.readMinutes} min read</span>
          </div>
          <p className="text-[15px] font-medium leading-relaxed text-foreground/90">
            {p.lede}
          </p>
          <div className="flex flex-col gap-3">
            {p.body.map((para, i) => (
              <p key={i} className="text-[14px] leading-relaxed text-foreground/80">
                {para}
              </p>
            ))}
          </div>
        </div>
      );
    }
    case "product-update": {
      const p = (cell as Cell<"product-update">).payload;
      return (
        <div className="flex flex-col gap-4">
          <p className="text-[11.5px] text-black/45">Released {p.releasedOn}</p>
          <p className="text-[14px] leading-relaxed text-foreground/85">{p.summary}</p>
          <h3 className="text-[12px] font-semibold uppercase tracking-wide text-black/45">
            Full changelog
          </h3>
          <ul className="flex flex-col gap-2">
            {p.fullChangelog.map((c, i) => (
              <li
                key={i}
                className="flex gap-2 text-[13.5px] leading-relaxed text-foreground/80"
              >
                <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-black/40" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    case "course": {
      const p = (cell as Cell<"course">).payload;
      return (
        <div className="flex flex-col gap-4">
          {p.videoUrl && (
            <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-black">
              <video
                src={p.videoUrl}
                poster={p.videoPoster}
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full"
              />
            </div>
          )}
          <p className="text-[14px] leading-relaxed text-foreground/85">{p.summary}</p>
          <h3 className="text-[12px] font-semibold uppercase tracking-wide text-[var(--accent-strong)]">
            Course outline
          </h3>
          <ol className="flex flex-col gap-2">
            {p.outline.map((o, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-lg border border-black/[0.06] bg-white p-3"
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-[11.5px] font-semibold text-black/60 tabular-nums">
                  {i + 1}
                </span>
                <span className="flex-1 text-[13.5px] text-foreground/85">
                  {o.title}
                </span>
                <span className="text-[11px] text-black/40">{o.minutes} min</span>
              </li>
            ))}
          </ol>
        </div>
      );
    }
    case "lesson": {
      const p = (cell as Cell<"lesson">).payload;
      return (
        <div className="flex flex-col gap-4">
          {p.videoUrl && (
            <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-black">
              <video
                src={p.videoUrl}
                poster={p.videoPoster}
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full"
              />
            </div>
          )}
          <p className="text-[11.5px] text-black/45">
            From <span className="font-medium text-black/65">{p.courseTitle}</span>
          </p>
          <div className="flex flex-col gap-3">
            {p.body.map((para, i) => (
              <p key={i} className="text-[14px] leading-relaxed text-foreground/85">
                {para}
              </p>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-black/[0.025] p-3 text-[12px] text-black/60">
            <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.25} />
            Marked as read · resumes at lesson 2.4
          </div>
        </div>
      );
    }
    case "learning-experience": {
      const p = (cell as Cell<"learning-experience">).payload;
      return (
        <div className="flex flex-col gap-4">
          <p className="text-[14px] leading-relaxed text-foreground/85">{p.summary}</p>
          <h3 className="text-[12px] font-semibold uppercase tracking-wide text-black/45">
            Track contents
          </h3>
          <ul className="flex flex-col gap-2">
            {p.assets.map((a, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-lg border border-black/[0.06] bg-white p-3"
              >
                <span className="text-[13.5px] flex-1 text-foreground/85">{a.title}</span>
                <span className="text-[11px] tabular-nums text-black/45">
                  {a.progressPercent}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    case "event": {
      const p = (cell as Cell<"event">).payload;
      return (
        <div className="flex flex-col gap-4">
          <p className="text-[14px] leading-relaxed text-foreground/85">{p.summary}</p>
          <div className="flex flex-col gap-1.5 rounded-xl bg-black/[0.025] p-3.5 text-[13.5px]">
            <div>{p.startsAt}</div>
            <div>{p.location}</div>
            <div className="text-foreground/70">Speakers: {p.speakerNames.join(", ")}</div>
          </div>
          <RsvpToggle initialCount={p.rsvpCount} />
        </div>
      );
    }
  }
}

function SourceLink({ url, label = "Source" }: { url: string; label?: string }) {
  let host = url;
  try {
    host = new URL(url).host.replace(/^www\./, "");
  } catch {
    // leave as-is
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--accent-bg)] px-2.5 py-1 text-[11.5px] font-medium text-[var(--accent-strong)] hover:bg-[var(--accent-soft)]"
    >
      <ExternalLink className="h-3 w-3" strokeWidth={2.25} />
      {label} · {host}
    </a>
  );
}

function ReplyRow({
  reply,
}: {
  reply: import("@/lib/learn/types").ReplyPayload;
}) {
  return (
    <div className="rounded-xl border border-black/[0.06] bg-white p-3.5">
      <div className="mb-1.5 flex items-center gap-2">
        <Avatar name={reply.author.name} color={reply.author.avatarColor} size={22} />
        <span className="text-[13px] font-medium text-foreground">
          {reply.author.name}
        </span>
        <span className="text-[11.5px] text-black/45">{reply.author.role}</span>
        <span className="ml-auto text-[10.5px] text-black/40">{reply.postedAt}</span>
        {reply.acceptedAnswer && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
            <Check className="h-2.5 w-2.5" strokeWidth={2.5} /> Best answer
          </span>
        )}
      </div>
      <p className="text-[13.5px] leading-relaxed text-foreground/85">{reply.body}</p>
      <div className="mt-2.5">
        <UpvoteButton initialCount={reply.upvotes} />
      </div>
    </div>
  );
}
