"use client";

import { Check, ExternalLink } from "lucide-react";
import type { Cell, ReplyPayload } from "@/lib/learn/types";
import { Avatar, RsvpToggle, UpvoteButton } from "./inline-affordances";

// Page-level cell detail — same content shape as the slide-out panel body,
// just laid out as a centered page column instead of a side panel. Used by
// the /learn/cells/[id] route which is the destination for cell links from
// Classic Search and Short Answer pages.

export function CellDetailPage({ cell }: { cell: Cell }) {
  return (
    <article className="flex flex-col gap-5">
      <header className="flex flex-col gap-2.5">
        <span
          className="inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: `color-mix(in oklch, ${toneFor(cell.type)} 14%, white)`, color: toneFor(cell.type) }}
        >
          {labelFor(cell.type)}
        </span>
        <h1 className="text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.18] tracking-[-0.02em] text-foreground">
          {cell.title}
        </h1>
      </header>

      <CellDetailBody cell={cell} />
    </article>
  );
}

function labelFor(type: Cell["type"]): string {
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
  } as const)[type];
}

function toneFor(type: Cell["type"]): string {
  return ({
    question: "var(--cell-question)",
    conversation: "var(--cell-conversation)",
    idea: "var(--cell-idea)",
    reply: "var(--cell-reply)",
    article: "var(--cell-article)",
    "product-update": "var(--cell-product-update)",
    course: "var(--cell-course)",
    lesson: "var(--cell-lesson)",
    "learning-experience": "var(--cell-learning-experience)",
    event: "var(--cell-event)",
  } as const)[type];
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

function ReplyRow({ reply }: { reply: ReplyPayload }) {
  return (
    <div className="rounded-xl border border-black/[0.06] bg-white p-3.5">
      <div className="mb-1.5 flex items-center gap-2">
        <Avatar name={reply.author.name} color={reply.author.avatarColor} size={22} />
        <span className="text-[13px] font-medium text-foreground">{reply.author.name}</span>
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

function CellDetailBody({ cell }: { cell: Cell }) {
  switch (cell.type) {
    case "question": {
      const p = (cell as Cell<"question">).payload;
      return (
        <div className="flex flex-col gap-4">
          {p.sourceUrl && <SourceLink url={p.sourceUrl} />}
          <p className="text-[15px] leading-relaxed text-foreground/85">{p.excerpt}</p>
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
          <p className="text-[15px] leading-relaxed text-foreground/85">{p.excerpt}</p>
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
          <p className="text-[15px] leading-relaxed text-foreground/85">{p.description}</p>
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
              <Avatar name={p.parentAuthor.name} color={p.parentAuthor.avatarColor} size={16} />
              <span className="text-[12px] font-medium text-black/60">{p.parentAuthor.name}</span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-black/55">{p.parentExcerpt}</p>
          </blockquote>
          <div className="rounded-xl bg-black/[0.025] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Avatar name={p.quotedAuthor.name} color={p.quotedAuthor.avatarColor} size={22} />
              <span className="text-[13px] font-medium text-foreground">{p.quotedAuthor.name}</span>
              <span className="text-[11.5px] text-black/45">{p.quotedAuthor.role}</span>
            </div>
            <p className="text-[14.5px] leading-relaxed text-foreground/85">{p.quotedBody}</p>
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
            <span className="text-[13px] font-medium text-foreground/85">{p.author.name}</span>
            <span className="text-[11.5px] text-black/40">{p.readMinutes} min read</span>
          </div>
          <p className="text-[16px] font-medium leading-relaxed text-foreground/90">{p.lede}</p>
          <div className="flex flex-col gap-3">
            {p.body.map((para, i) => (
              <p key={i} className="text-[14.5px] leading-relaxed text-foreground/80">
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
          <p className="text-[15px] leading-relaxed text-foreground/85">{p.summary}</p>
          <h3 className="text-[12px] font-semibold uppercase tracking-wide text-black/45">
            Full changelog
          </h3>
          <ul className="flex flex-col gap-2">
            {p.fullChangelog.map((c, i) => (
              <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-foreground/80">
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
          <p className="text-[15px] leading-relaxed text-foreground/85">{p.summary}</p>
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
                <span className="flex-1 text-[14px] text-foreground/85">{o.title}</span>
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
              <p key={i} className="text-[14.5px] leading-relaxed text-foreground/85">
                {para}
              </p>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-black/[0.025] p-3 text-[12px] text-black/60">
            <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.25} />
            Marked as read · resumes at the next lesson
          </div>
        </div>
      );
    }
    case "learning-experience": {
      const p = (cell as Cell<"learning-experience">).payload;
      return (
        <div className="flex flex-col gap-4">
          <p className="text-[15px] leading-relaxed text-foreground/85">{p.summary}</p>
          <h3 className="text-[12px] font-semibold uppercase tracking-wide text-black/45">
            Track contents
          </h3>
          <ul className="flex flex-col gap-2">
            {p.assets.map((a, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-lg border border-black/[0.06] bg-white p-3"
              >
                <span className="text-[14px] flex-1 text-foreground/85">{a.title}</span>
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
          <p className="text-[15px] leading-relaxed text-foreground/85">{p.summary}</p>
          <div className="flex flex-col gap-1.5 rounded-xl bg-black/[0.025] p-4 text-[14px]">
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
