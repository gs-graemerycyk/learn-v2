"use client";

import {
  ChevronDown,
  Code,
  Globe,
  GripVertical,
  Info,
  LayoutGrid,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { ForYouWidget } from "./for-you-widget";
import { mockRecommendations } from "./mock-data";

// Bot-builder mockup for the "For you" recommendation widget.
//
// Mirrors the AI Search bot-builder canvas (/builder): phone-frame
// preview on the left, Configure-Your-Bot panel on the right. The
// "For you" widget shows up as the new flagged entry in the widget
// list, with a callout describing what it surfaces.

type Widget = {
  id: string;
  label: string;
  status?: "new" | "active";
};

const ACTIVE_WIDGETS: Widget[] = [
  { id: "for-you", label: "For You", status: "new" },
  { id: "ai-search", label: "AI Search", status: "active" },
  { id: "task-list", label: "Task List", status: "active" },
  { id: "level-up", label: "Level Up", status: "active" },
  { id: "whats-new", label: "See What's New", status: "active" },
  { id: "explore-more", label: "Explore More", status: "active" },
];

export function ForYouBuilder() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#F4F5F8] lg:flex-row">
      <div className="flex flex-1 flex-col items-center justify-start overflow-hidden p-4 sm:p-6 lg:p-8">
        <BuilderHeader />

        <div className="mt-4 grid h-full w-full place-items-center sm:mt-6">
          <PhoneFrame>
            <ForYouWidget items={mockRecommendations} mode="builder" />
          </PhoneFrame>
        </div>

        <div className="mt-4 flex shrink-0 items-center gap-2 text-[10.5px] text-foreground/55 sm:mt-5 sm:text-[11px]">
          <Info className="h-3 w-3" strokeWidth={2.25} />
          <span className="hidden sm:inline">
            Drag widgets in the right panel to reorder · Click any widget to configure it
          </span>
          <span className="sm:hidden">
            Scroll down to configure widgets
          </span>
        </div>
      </div>

      <ConfigPanel />
    </div>
  );
}

function BuilderHeader() {
  return (
    <div className="flex w-full max-w-[640px] items-center justify-between gap-3 text-[11px] text-foreground/65 sm:text-[11.5px]">
      <div className="flex min-w-0 items-center gap-1 truncate sm:gap-1.5">
        <span className="hidden font-medium text-foreground/55 sm:inline">Bots</span>
        <span className="hidden text-foreground/30 sm:inline">/</span>
        <span className="hidden font-medium text-foreground/55 sm:inline">KCBot</span>
        <span className="hidden text-foreground/30 sm:inline">/</span>
        <span className="truncate font-semibold text-foreground">Onboarding flow</span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button className="rounded-md border border-black/[0.08] bg-white px-2 py-1 font-medium text-foreground/70 hover:border-black/[0.15] sm:px-2.5">
          Preview
        </button>
        <button className="rounded-md bg-foreground px-2 py-1 font-medium text-background hover:opacity-85 sm:px-2.5">
          Publish
        </button>
      </div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  // Same responsive sizing rules as the published view's frame: scale
  // down with the viewport while keeping the 380 × 720 ceiling so the
  // builder still reads as a phone preview on a desktop window.
  return (
    <div
      className="relative flex w-full max-w-[380px] flex-col overflow-hidden rounded-[20px] border border-black/[0.07] bg-white shadow-[0_24px_60px_-16px_rgba(0,0,0,0.18)] sm:rounded-[28px]"
      style={{ height: "min(720px, calc(100dvh - 14rem))" }}
    >
      {children}
    </div>
  );
}

function ConfigPanel() {
  // On mobile the canvas stacks: phone preview on top, config panel
  // below (full-width, separated by a top border instead of a left
  // border). On lg+ it returns to the original side-by-side layout.
  return (
    <aside className="flex w-full shrink-0 flex-col border-t border-black/[0.08] bg-white lg:w-[360px] lg:border-l lg:border-t-0">
      <div className="flex items-center border-b border-black/[0.07] px-3 py-2">
        <TabIcon active>
          <LayoutGrid className="h-4 w-4" strokeWidth={2} />
        </TabIcon>
        <TabIcon>
          <Sparkles className="h-4 w-4" strokeWidth={2} />
        </TabIcon>
        <TabIcon>
          <Globe className="h-4 w-4" strokeWidth={2} />
        </TabIcon>
        <TabIcon>
          <Code className="h-4 w-4" strokeWidth={2} />
        </TabIcon>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mb-1 flex items-center gap-1.5">
          <h3 className="text-[14px] font-semibold text-foreground">
            Configure Your Bot
          </h3>
        </div>
        <p className="mb-5 text-[11.5px] leading-[1.5] text-foreground/55">
          Add relevant widgets to display personalised content to users. The
          For You widget pulls resumptions and recommendations from the DCH
          recommendations engine.
        </p>

        <Field
          label="Greeting"
          info
          value="Hi Sarah! 👋"
          help="Only 35 characters will be rendered"
        />
        <Field
          label="Subtext"
          value="Pick up where you left off"
          className="mt-3"
        />

        <div className="mt-5">
          <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.07em] text-foreground/55">
            Widgets in this bot
          </h4>
          <ul className="flex flex-col gap-1">
            {ACTIVE_WIDGETS.map((w) => (
              <WidgetRow key={w.id} widget={w} />
            ))}
          </ul>

          <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[var(--accent-strong)]/40 bg-[var(--accent-bg)] py-2 text-[12.5px] font-semibold text-[var(--accent-strong)] hover:bg-[var(--accent-soft)]">
            Add Widget
            <ChevronDown className="h-3 w-3" strokeWidth={2.25} />
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-[var(--accent-strong)]/30 bg-[var(--accent-bg)] p-3.5">
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[var(--accent-strong)]">
            <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
            New widget
          </div>
          <h5 className="mt-1.5 text-[13.5px] font-semibold text-foreground">
            For You — personalised entry point
          </h5>
          <p className="mt-1 text-[11.5px] leading-[1.5] text-foreground/65">
            Pinned resumptions from in-progress courses and lessons, followed
            by ranked recommendations across community questions, articles,
            ideas, events, and product updates.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {["Resumptions", "Courses", "Articles", "Questions", "Events"].map(
              (i) => (
                <span
                  key={i}
                  className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-[var(--accent-strong)]"
                >
                  {i}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </aside>
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
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-[var(--accent-bg)] text-[var(--accent-strong)]"
          : "text-foreground/45 hover:bg-black/[0.04]"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  info,
  help,
  className = "",
}: {
  label: string;
  value: string;
  info?: boolean;
  help?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="flex items-center gap-1 text-[11.5px] font-medium text-foreground/65">
        {label}
        {info && <Info className="h-2.5 w-2.5 text-foreground/35" strokeWidth={2.25} />}
      </label>
      <input
        readOnly
        value={value}
        className="rounded-md border border-black/[0.1] bg-white px-2.5 py-1.5 text-[12.5px] text-foreground/85 outline-none focus:border-[var(--accent-strong)]/40"
      />
      {help && <p className="text-[10.5px] text-foreground/40">{help}</p>}
    </div>
  );
}

function WidgetRow({ widget }: { widget: Widget }) {
  const isNew = widget.status === "new";
  return (
    <li
      className={`flex items-center gap-2 rounded-lg border px-2 py-2 ${
        isNew
          ? "border-[var(--accent-strong)]/30 bg-[var(--accent-bg)]"
          : "border-transparent bg-black/[0.025] hover:bg-black/[0.04]"
      }`}
    >
      <GripVertical
        className="h-3.5 w-3.5 shrink-0 text-foreground/35"
        strokeWidth={2}
      />
      <span
        className={`flex-1 text-[12.5px] font-medium ${
          isNew ? "text-[var(--accent-strong)]" : "text-foreground/85"
        }`}
      >
        {widget.label}
      </span>
      {isNew && (
        <span className="rounded-full bg-[var(--accent-strong)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
          New
        </span>
      )}
      <button
        aria-label="More"
        className="flex h-6 w-6 items-center justify-center rounded text-foreground/45 hover:bg-black/[0.05]"
      >
        <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </li>
  );
}
