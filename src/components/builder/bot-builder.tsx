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
  X,
} from "lucide-react";
import type { LearnAnswer } from "@/lib/learn/types";
import { LearnWidget } from "../learn/learn-widget";

// Bot-builder mockup — frames the LearnWidget inside a phone-shaped preview
// next to a "Configure Your Bot" panel that mimics the Gainsight Community
// Cloud chatbot/KCBot builder. The Learn feature is presented as a new
// "AI Search" widget that can be added to the bot's content groups
// alongside the existing Search / Task List / Level Up / See What's New /
// Explore More widgets.

type Widget = {
  id: string;
  label: string;
  status?: "new" | "active" | "available";
};

const ACTIVE_WIDGETS: Widget[] = [
  { id: "ai-search", label: "AI Search", status: "new" },
  { id: "search", label: "Search", status: "active" },
  { id: "task-list", label: "Task List", status: "active" },
  { id: "level-up", label: "Level Up", status: "active" },
  { id: "whats-new", label: "See What's New", status: "active" },
  { id: "explore-more", label: "Explore More", status: "active" },
];

export function BotBuilder({ answer }: { answer: LearnAnswer }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F4F5F8]">
      {/* Builder canvas — phone-shaped preview centered */}
      <div className="flex flex-1 flex-col items-center justify-start overflow-hidden p-8">
        <BuilderHeader />

        <div className="mt-6 grid h-full w-full place-items-center">
          <PhoneFrame>
            <LearnWidget answer={answer} mode="builder" />
          </PhoneFrame>
        </div>

        <div className="mt-5 flex shrink-0 items-center gap-2 text-[11px] text-foreground/55">
          <Info className="h-3 w-3" strokeWidth={2.25} />
          Drag widgets in the right panel to reorder · Click any widget to configure it
        </div>
      </div>

      {/* Right config panel — Configure Your Bot */}
      <ConfigPanel />
    </div>
  );
}

function BuilderHeader() {
  return (
    <div className="flex w-full max-w-[640px] items-center justify-between text-[11.5px] text-foreground/65">
      <div className="flex items-center gap-1.5">
        <span className="font-medium text-foreground/55">Bots</span>
        <span className="text-foreground/30">/</span>
        <span className="font-medium text-foreground/55">KCBot</span>
        <span className="text-foreground/30">/</span>
        <span className="font-semibold text-foreground">Onboarding flow</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-md border border-black/[0.08] bg-white px-2.5 py-1 text-[11.5px] font-medium text-foreground/70 hover:border-black/[0.15]">
          Preview
        </button>
        <button className="rounded-md bg-foreground px-2.5 py-1 text-[11.5px] font-medium text-background hover:opacity-85">
          Publish
        </button>
      </div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-[28px] border border-black/[0.07] bg-white shadow-[0_24px_60px_-16px_rgba(0,0,0,0.18)]"
      style={{ width: 380, height: 720 }}
    >
      {children}
    </div>
  );
}

function ConfigPanel() {
  return (
    <aside className="flex w-[360px] shrink-0 flex-col border-l border-black/[0.08] bg-white">
      {/* Tabs (mirrors screenshot) */}
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
          Add relevant widgets to the bot to display content to users. You can
          have multiple instances of Content Group.
        </p>

        {/* Greeting + Subtext (matches Configure Your Bot UI) */}
        <Field
          label="Greeting"
          info
          value="Hi Sarah! 👋"
          help="Only 35 characters will be rendered"
        />
        <Field
          label="Subtext"
          value="Need help with something?"
          className="mt-3"
        />

        {/* Widget list */}
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

        {/* New widget callout */}
        <div className="mt-5 rounded-xl border border-[var(--accent-strong)]/30 bg-[var(--accent-bg)] p-3.5">
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[var(--accent-strong)]">
            <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
            New widget
          </div>
          <h5 className="mt-1.5 text-[13.5px] font-semibold text-foreground">
            AI Search — advanced answer surface
          </h5>
          <p className="mt-1 text-[11.5px] leading-[1.5] text-foreground/65">
            Replaces the basic Search widget with intent routing across
            Classic Search, Short Answer, AI Answers (long), and Support
            Escalation. Surfaces source citations, an AI Tutor for follow-up
            questions, and a Forethought-powered escalation path.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {["Classic Search", "Short Answer", "AI Answers", "Support"].map(
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
