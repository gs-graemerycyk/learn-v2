"use client";

// PX in-app hub builder demo for the recommendations widget.
//
// Per the PRD update: "PX in-app hub. Existing community widget gains
// a toggle in the widget builder view: current mode or algorithmic
// feed. Count options extended from 3/5 to 3/5/7."
//
// Canvas (left)  — dotted builder grid with the widget preview
//                  centred. Renders community posts in "current mode"
//                  and recommendation cards in "algorithmic feed" mode.
// Config (right) — PX-style panel with a left-edge tab strip and an
//                  accordion: Card Type (expanded by default) +
//                  Community Categories & Product Areas (collapsed).
//                  Card Type contains the new source toggle and the
//                  3/5/7 count radio.

import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Languages,
  LayoutGrid,
  MoreHorizontal,
  Lightbulb,
  MessageSquare,
  Sparkles,
  ThumbsUp,
  Wand2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockRecommendations } from "./mock-data";
import type { RecommendationItem } from "./types";

type Source = "current" | "algorithmic";
type Count = 3 | 5 | 7;

interface WidgetConfig {
  title: string;
  subtitle: string;
  source: Source;
  count: Count;
}

const CURRENT_MODE_POSTS = [
  { title: "Idea after update", body: "Idea after update", votes: 1, replies: 2 },
  {
    title: "this might be good to have",
    body: "this might be good to have",
    votes: 1,
    replies: 0,
  },
  { title: "some idea for test", body: "some idea for test", votes: 1, replies: 0 },
  {
    title: "Bulk export for segments",
    body: "Would help with quarterly reporting cycles.",
    votes: 8,
    replies: 3,
  },
  {
    title: "Webhook for stage changes",
    body: "Trigger downstream automations when a stage flips.",
    votes: 14,
    replies: 5,
  },
  {
    title: "Custom branding tokens",
    body: "Let admins inject brand tokens into shared views.",
    votes: 4,
    replies: 1,
  },
  {
    title: "Saved filter presets",
    body: "Persist filters per dashboard, not per session.",
    votes: 22,
    replies: 7,
  },
];

export function ForYouBuilder() {
  const [config, setConfig] = useState<WidgetConfig>({
    title: "Community Posts",
    subtitle: "",
    source: "current",
    count: 3,
  });

  const update = <K extends keyof WidgetConfig>(key: K, value: WidgetConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-white">
      {/* ── Canvas (dotted grid + widget preview) ── */}
      <div className="relative flex flex-1 items-center justify-center overflow-y-auto bg-[radial-gradient(circle,_rgba(15,23,42,0.08)_1px,_transparent_1px)] [background-size:14px_14px] p-8">
        <WidgetPreview config={config} />
      </div>

      {/* ── Right config rail with tab strip ── */}
      <aside className="flex w-[460px] shrink-0 border-l border-black/[0.08] bg-[#F7F8FB]">
        <TabStrip />
        <div className="flex flex-1 flex-col overflow-hidden">
          <PanelHeader />
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <Accordion title="Card Type" defaultOpen>
              <CardTypeFields config={config} update={update} />
            </Accordion>
            <Accordion title="Community Categories & Product Areas">
              <p className="text-[12.5px] text-foreground/55">
                Pick which categories and product areas this widget surfaces.
                Out of scope for this demo.
              </p>
            </Accordion>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ── Tab strip on left edge of the rail ─────────────────────────── */

function TabStrip() {
  return (
    <div className="flex w-12 shrink-0 flex-col items-center border-r border-black/[0.07] bg-white py-3">
      <TabIcon active>
        <LayoutGrid className="h-4 w-4" strokeWidth={2} />
      </TabIcon>
      <TabIcon>
        <Wand2 className="h-4 w-4" strokeWidth={2} />
      </TabIcon>
      <TabIcon>
        <Languages className="h-4 w-4" strokeWidth={2} />
      </TabIcon>
    </div>
  );
}

function TabIcon({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "mb-1.5 grid h-9 w-9 place-items-center rounded-md transition-colors",
        active
          ? "bg-[#E6F0FE] text-[#0E73E6]"
          : "text-foreground/45 hover:bg-black/[0.04]"
      )}
    >
      {children}
    </button>
  );
}

/* ── Panel header (← Community ⋯) ───────────────────────────────── */

function PanelHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-black/[0.07] bg-white px-3">
      <button
        type="button"
        aria-label="Back"
        className="grid h-7 w-7 place-items-center rounded text-foreground/65 hover:bg-black/[0.04]"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.25} />
      </button>
      <h2 className="mx-auto text-[14px] font-semibold text-foreground">
        Community
      </h2>
      <button
        type="button"
        aria-label="More"
        className="grid h-7 w-7 place-items-center rounded text-foreground/65 hover:bg-black/[0.04]"
      >
        <MoreHorizontal className="h-4 w-4" strokeWidth={2} />
      </button>
    </header>
  );
}

/* ── Accordion ──────────────────────────────────────────────────── */

function Accordion({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <section className="mb-3 overflow-hidden rounded-md border border-black/[0.07] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-[14px] font-semibold text-foreground hover:bg-black/[0.02]"
      >
        {title}
        {open ? (
          <ChevronUp className="h-4 w-4 text-foreground/55" strokeWidth={2.25} />
        ) : (
          <ChevronDown className="h-4 w-4 text-foreground/55" strokeWidth={2.25} />
        )}
      </button>
      {open && (
        <div className="border-t border-black/[0.06] px-4 py-4">{children}</div>
      )}
    </section>
  );
}

/* ── Card Type fields ───────────────────────────────────────────── */

function CardTypeFields({
  config,
  update,
}: {
  config: WidgetConfig;
  update: <K extends keyof WidgetConfig>(key: K, value: WidgetConfig[K]) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Title">
        <input
          type="text"
          value={config.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-[13.5px] outline-none focus:border-[#0E73E6] focus:ring-1 focus:ring-[#0E73E6]/30"
        />
      </Field>
      <Field label="Subtitle">
        <input
          type="text"
          value={config.subtitle}
          placeholder="Enter Subtitle"
          onChange={(e) => update("subtitle", e.target.value)}
          className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-[13.5px] outline-none placeholder:text-foreground/35 focus:border-[#0E73E6] focus:ring-1 focus:ring-[#0E73E6]/30"
        />
      </Field>

      {/* ── Source toggle (NEW per PRD) ── */}
      <div className="rounded-md border border-[#0E73E6]/30 bg-[#EAF2FB] p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wide text-[#0E73E6]">
          <Sparkles className="h-3 w-3" strokeWidth={2.5} />
          New · feed source
        </div>
        <p className="mb-3 text-[11.5px] leading-[1.45] text-foreground/65">
          Drive this widget from the existing community feed or from the new
          DCH recommendations engine.
        </p>
        <SegmentedToggle
          value={config.source}
          onChange={(v) => update("source", v)}
          options={[
            { value: "current", label: "Current mode" },
            { value: "algorithmic", label: "Algorithmic feed" },
          ]}
        />
      </div>

      {/* ── Count radios (3/5/7 per PRD) ── */}
      <Field
        label={
          config.source === "current"
            ? "Number of Latest Posts"
            : "Number of Recommended Items"
        }
      >
        <div className="flex items-center gap-5 pt-1">
          {[3, 5, 7].map((n) => {
            const checked = config.count === n;
            return (
              <label
                key={n}
                className="flex cursor-pointer items-center gap-2 text-[13.5px] text-foreground/85"
              >
                <span
                  className={cn(
                    "grid h-4 w-4 place-items-center rounded-full border-2",
                    checked
                      ? "border-[#0E73E6]"
                      : "border-black/30"
                  )}
                  aria-hidden
                >
                  {checked && (
                    <span className="h-2 w-2 rounded-full bg-[#0E73E6]" />
                  )}
                </span>
                <input
                  type="radio"
                  name="count"
                  value={n}
                  checked={checked}
                  onChange={() => update("count", n as Count)}
                  className="sr-only"
                />
                {n} {config.source === "current" ? "Posts" : "Items"}
              </label>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-[13.5px] font-medium text-foreground/85">
        {label}
      </label>
      {children}
    </div>
  );
}

function SegmentedToggle<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex rounded-md border border-black/15 bg-white p-0.5">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 rounded px-2 py-1.5 text-[12.5px] font-semibold transition-colors",
              active
                ? "bg-[#0E73E6] text-white shadow-sm"
                : "text-foreground/65 hover:bg-black/[0.04]"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Widget preview on the canvas ──────────────────────────────── */

function WidgetPreview({ config }: { config: WidgetConfig }) {
  return (
    <div className="relative w-full max-w-[420px]">
      <div className="absolute -left-3 -top-3 grid h-7 w-7 place-items-center rounded-md bg-emerald-500 text-white shadow-md">
        <LayoutGrid className="h-3.5 w-3.5" strokeWidth={2.5} />
      </div>
      <button
        type="button"
        aria-label="Close preview"
        className="absolute -right-3 -top-3 grid h-7 w-7 place-items-center rounded-full bg-white text-foreground/55 shadow-md hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2.25} />
      </button>

      <div className="overflow-hidden rounded-2xl bg-[#1A2B5F] p-5 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.35)]">
        {config.source === "current" ? (
          <CurrentModeBody config={config} />
        ) : (
          <AlgorithmicModeBody config={config} />
        )}
      </div>

      {/* Floating bottom close affordance, matching the screenshot */}
      <div className="-mt-6 flex justify-center">
        <button
          type="button"
          aria-label="Close widget"
          className="grid h-12 w-12 place-items-center rounded-full bg-[#1A2B5F] text-white shadow-lg ring-4 ring-white"
        >
          <X className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}

function CurrentModeBody({ config }: { config: WidgetConfig }) {
  const posts = CURRENT_MODE_POSTS.slice(0, config.count);
  return (
    <>
      <article className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="text-[16px] font-bold text-foreground">
          Submit Feedback
        </h3>
        <p className="mt-1 text-[12.5px] text-foreground/55">
          Share concerns, ideas, requests and more
        </p>
      </article>

      <div className="mt-5 flex items-center justify-between">
        <h4 className="text-[15px] font-bold text-white">
          {config.title || "Community Posts"}
        </h4>
        <button className="text-[12.5px] font-semibold text-emerald-300 hover:text-emerald-200">
          View All
        </button>
      </div>
      {config.subtitle && (
        <p className="mt-0.5 text-[12px] text-white/65">{config.subtitle}</p>
      )}

      <ul className="mt-3 flex flex-col gap-3">
        {posts.map((p) => (
          <li
            key={p.title}
            className="rounded-lg bg-white p-3 shadow-sm"
          >
            <h5 className="text-[13.5px] font-bold text-foreground">
              {p.title}
            </h5>
            <p className="mt-0.5 text-[12px] text-foreground/65">{p.body}</p>
            <div className="mt-3 flex items-center justify-between text-[11.5px] text-foreground/55">
              <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide text-foreground/45">
                <Lightbulb className="h-3 w-3" strokeWidth={2.25} />
                Idea
              </span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" strokeWidth={2} />
                  {p.votes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" strokeWidth={2} />
                  {p.replies}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function AlgorithmicModeBody({ config }: { config: WidgetConfig }) {
  const items = mockRecommendations.slice(0, config.count);
  return (
    <>
      <article className="rounded-lg bg-gradient-to-br from-violet-50 to-indigo-50 p-4 shadow-sm">
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wide text-[#0E73E6]">
          <Sparkles className="h-3 w-3" strokeWidth={2.5} />
          For you
        </div>
        <h3 className="mt-1 text-[16px] font-bold text-foreground">
          Picked up where you left off
        </h3>
        <p className="mt-1 text-[12.5px] text-foreground/55">
          Ranked by the DCH recommendations engine — courses, articles, and
          conversations chosen for you.
        </p>
      </article>

      <div className="mt-5 flex items-center justify-between">
        <h4 className="text-[15px] font-bold text-white">
          {config.title || "Community Posts"}
        </h4>
        <button className="text-[12.5px] font-semibold text-emerald-300 hover:text-emerald-200">
          View All
        </button>
      </div>
      {config.subtitle && (
        <p className="mt-0.5 text-[12px] text-white/65">{config.subtitle}</p>
      )}

      <ul className="mt-3 flex flex-col gap-3">
        {items.map((it) => (
          <li key={it.id} className="rounded-lg bg-white p-3 shadow-sm">
            <h5 className="text-[13.5px] font-bold text-foreground">
              {it.title}
            </h5>
            <p className="mt-0.5 line-clamp-2 text-[12px] text-foreground/65">
              {recoSubline(it)}
            </p>
            <div className="mt-3 flex items-center justify-between text-[11.5px] text-foreground/55">
              <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide text-[#0E73E6]">
                <Sparkles className="h-3 w-3" strokeWidth={2.25} />
                {recoTypeLabel(it.contentType)}
              </span>
              {"voteCount" in it ? (
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" strokeWidth={2} />
                    {it.voteCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" strokeWidth={2} />
                    {it.replyCount}
                  </span>
                </span>
              ) : "estimatedTimeRemaining" in it && it.estimatedTimeRemaining ? (
                <span className="text-foreground/45">
                  {it.estimatedTimeRemaining} left
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function recoTypeLabel(type: RecommendationItem["contentType"]): string {
  switch (type) {
    case "course":
      return "Course";
    case "lesson":
      return "Lesson";
    case "learning_path":
      return "Path";
    case "question":
      return "Question";
    case "article":
      return "Article";
    case "idea":
      return "Idea";
    case "conversation":
      return "Thread";
    case "event":
      return "Event";
    case "product_update":
      return "Update";
  }
}

function recoSubline(it: RecommendationItem): string {
  if ("snippet" in it) return it.snippet;
  if ("description" in it) return it.description;
  if ("estimatedTimeRemaining" in it && it.estimatedTimeRemaining)
    return `Academy · ${it.estimatedTimeRemaining} remaining`;
  return "";
}
