"use client";

// Community Cloud (CC) page builder demo.
//
// Recreates the screenshots provided by product (CC admin's page
// builder with the Recommendations widget selected). The key change
// vs production is the new "Source" toggle inside the CONTENT
// section of the widget config panel:
//
//   • Manual topics — the existing behaviour, where the admin
//     hand-picks 3/5/7 topics that render as category tiles
//   • Algorithmic feed — the new behaviour from the PRD, where the
//     widget consumes the DCH recommendations engine. Count
//     (3/5/7) and layout (list / cards / carousel) are admin-tunable.
//
// Per the PRD: "Existing Recommendations widget either edited or
// replaced to consume the algorithmic feed. 3/5/7 count options.
// UI supports list (existing format) or cards / carousel."
//
// All state is local — no router, no persistence. Closing the X in
// the panel just collapses it back to the canvas without saving.

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  X,
  Eye,
  EyeOff,
  Sparkles,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockRecommendations } from "@/components/recommendations/mock-data";

type Source = "manual" | "algorithmic";
type Layout = "list" | "cards" | "carousel";
type Count = 3 | 5 | 7;
type Visibility = "public" | "private";
type BackgroundMode = "none" | "solid" | "gradient";

interface RecsConfig {
  title: string;
  subtitle: string;
  source: Source;
  topics: string[];
  count: Count;
  layout: Layout;
  background: BackgroundMode;
  titleColor: string;
  subtitleColor: string;
  enableTopMargin: boolean;
  enableTopBottomPadding: boolean;
  visibility: Visibility;
}

const DEFAULT_TOPICS = [
  "Customer Success",
  "Product Experience",
  "Customer Communities",
  "CE & Skilljar by Gainsight",
  "Staircase AI by Gainsight",
];

const TOPIC_INITIALS: Record<string, string> = {
  "Customer Success": "CS",
  "Product Experience": "PX",
  "Customer Communities": "CC",
  "CE & Skilljar by Gainsight": "CS",
  "Staircase AI by Gainsight": "SA",
};

export function CCPageBuilder() {
  const [panelOpen, setPanelOpen] = useState(true);
  const [config, setConfig] = useState<RecsConfig>({
    title: "Recommendations",
    subtitle: "",
    source: "manual",
    topics: DEFAULT_TOPICS,
    count: 5,
    layout: "cards",
    background: "none",
    titleColor: "Heading color",
    subtitleColor: "Heading color",
    enableTopMargin: true,
    enableTopBottomPadding: false,
    visibility: "public",
  });

  const update = <K extends keyof RecsConfig>(key: K, value: RecsConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="relative flex h-[calc(100vh-4rem)] overflow-hidden bg-[#F5F6F8]">
      {/* ── Canvas ── */}
      <div
        className={cn(
          "flex flex-1 flex-col overflow-y-auto transition-all duration-200",
          panelOpen ? "mr-[420px]" : "mr-0"
        )}
      >
        <CommunityHero />
        <CommunityMetrics />

        <div className="mx-auto w-full max-w-[1180px] px-6 py-4">
          <div className="grid place-items-center pb-3">
            <EyeOff
              className="h-4 w-4 text-foreground/35"
              strokeWidth={2}
              aria-label="Visibility preview toggle"
            />
          </div>

          {/* Selection band */}
          <div className="rounded-md border border-dashed border-[#B7BBC2] bg-white/40 px-4 py-3 text-[12px] text-foreground/55">
            {config.title}
          </div>

          {/* The widget the admin is editing — dashed selection outline */}
          <div className="mt-3 rounded-md border border-dashed border-[#B7BBC2] p-4">
            <RecommendationsWidget config={config} />
          </div>

          {/* Decorative content below to give the page builder context */}
          <SpotlightBlock />
        </div>
      </div>

      {/* ── Right rail config panel ── */}
      {panelOpen && (
        <aside className="absolute right-0 top-0 z-30 flex h-full w-[420px] flex-col border-l border-black/[0.08] bg-white">
          <PanelHeader onClose={() => setPanelOpen(false)} />
          <div className="flex-1 overflow-y-auto">
            <ContentSection config={config} update={update} />
            <StyleSection config={config} update={update} />
            <VisibilitySection config={config} update={update} />
          </div>
          <PanelFooter onDone={() => setPanelOpen(false)} />
        </aside>
      )}
    </div>
  );
}

/* ── Canvas pieces ──────────────────────────────────────────────── */

function CommunityHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0B2447] via-[#19376D] to-[#0B2447] px-6 py-12 text-white">
      <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border-[10px] border-white/5" />
      <div className="absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border-[10px] border-white/5" />
      <div className="relative mx-auto flex max-w-[860px] flex-col items-center gap-5">
        <h1 className="text-center text-[clamp(28px,4vw,40px)] font-bold tracking-tight">
          Welcome to the Gainsight Community
        </h1>
        <div className="flex w-full max-w-[680px] items-center gap-3 rounded-md bg-white px-4 py-3 text-[14px] text-foreground/45 shadow-sm">
          <Search className="h-4 w-4 text-foreground/35" strokeWidth={2} />
          <span className="flex-1">
            Search for answers, best practices and more
          </span>
          <span className="text-[11px] font-medium text-foreground/40">⌘ K</span>
        </div>
      </div>
    </section>
  );
}

function CommunityMetrics() {
  return (
    <div className="border-b border-black/[0.06] bg-white">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-6 py-4 text-[13px]">
        <div className="flex items-center gap-5 text-foreground/65">
          <span>
            <strong className="text-foreground">21,865</strong> Topics
          </span>
          <span>
            <strong className="text-foreground">74,865</strong> Replies
          </span>
          <span>
            <strong className="text-foreground">15,602</strong> Members
          </span>
        </div>
        <div className="flex items-center gap-2 text-foreground/65">
          <span>Recently online</span>
          <div className="flex -space-x-1.5">
            {[
              "bg-emerald-200",
              "bg-rose-200",
              "bg-sky-200",
              "bg-pink-200",
              "bg-indigo-200",
            ].map((c) => (
              <span
                key={c}
                className={`grid h-6 w-6 place-items-center rounded-full border-2 border-white ${c} text-[10px] font-semibold text-foreground/65`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpotlightBlock() {
  return (
    <div className="mt-6 rounded-md border border-dashed border-[#B7BBC2] bg-[#EFF1F4] p-5">
      <h3 className="text-[18px] font-bold text-[#0B6BCB]">Spotlight</h3>
      <article className="mt-3 rounded-md border border-black/10 bg-white p-4">
        <h4 className="text-[15px] font-semibold text-foreground">
          📣 New in Gainsight University: Two New Ways to Level Up Your CS Skills
        </h4>
        <p className="mt-1 text-[13px] text-foreground/65">
          We&rsquo;re excited to share two new additions to Gainsight University,
          a brand-new course and a new learning path, both available now. 🎓 New
          Course: Gainsi…
        </p>
        <div className="mt-3 flex items-center justify-between text-[11.5px] text-foreground/55">
          <div className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-rose-200 text-[9px]">
              🧑
            </span>
            6 days ago
          </div>
          <div className="flex items-center gap-3">
            <span>👁 158</span>
            <span>💬 0</span>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ── The widget itself (renders based on config) ─────────────────── */

function RecommendationsWidget({ config }: { config: RecsConfig }) {
  return (
    <section
      className={cn(
        config.background === "gradient" &&
          "rounded-lg bg-gradient-to-br from-sky-50 to-violet-50 p-4",
        config.background === "solid" && "rounded-lg bg-[#F5F7FA] p-4",
        config.enableTopBottomPadding && "py-6"
      )}
    >
      <header className="mb-3">
        <h2 className="text-[18px] font-bold text-foreground">{config.title}</h2>
        {config.subtitle && (
          <p className="mt-0.5 text-[13px] text-foreground/55">{config.subtitle}</p>
        )}
        {config.source === "algorithmic" && (
          <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#0B6BCB]/10 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-[#0B6BCB]">
            <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
            Algorithmic feed
          </div>
        )}
      </header>

      {config.source === "manual" ? (
        <ManualTopicTiles topics={config.topics.slice(0, config.count)} />
      ) : (
        <AlgorithmicFeed count={config.count} layout={config.layout} />
      )}
    </section>
  );
}

function ManualTopicTiles({ topics }: { topics: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {topics.map((t) => (
        <article
          key={t}
          className="flex flex-col items-center gap-3 rounded-md border border-black/[0.08] bg-white p-6 shadow-sm"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[#1F76FF] text-[15px] font-bold text-white">
            {TOPIC_INITIALS[t] ?? t.slice(0, 2).toUpperCase()}
          </span>
          <h4 className="text-center text-[14px] font-semibold leading-[1.25] text-foreground">
            {t}
          </h4>
        </article>
      ))}
    </div>
  );
}

function AlgorithmicFeed({ count, layout }: { count: Count; layout: Layout }) {
  const items = mockRecommendations.slice(0, count);

  if (layout === "list") {
    return (
      <ul className="divide-y divide-black/[0.06] overflow-hidden rounded-md border border-black/[0.08] bg-white">
        {items.map((it) => (
          <li key={it.id} className="flex items-start gap-3 px-4 py-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#EEF2FF] text-[11px] font-semibold uppercase text-[#0B6BCB]">
              {contentTypeShort(it.contentType)}
            </span>
            <div className="flex min-w-0 flex-col">
              <h4 className="truncate text-[13.5px] font-semibold text-foreground">
                {it.title}
              </h4>
              <span className="truncate text-[11.5px] text-foreground/55">
                {feedSubline(it)}
              </span>
            </div>
            <span className="ml-auto shrink-0 text-[11px] uppercase tracking-wide text-foreground/45">
              {feedTypeLabel(it.contentType)}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (layout === "carousel") {
    return (
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((it) => (
          <div
            key={it.id}
            className="w-[260px] shrink-0 snap-start rounded-md border border-black/[0.08] bg-white p-3 shadow-sm"
          >
            <FeedCardInner item={it} />
          </div>
        ))}
      </div>
    );
  }

  // cards
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((it) => (
        <article
          key={it.id}
          className="flex flex-col gap-2 rounded-md border border-black/[0.08] bg-white p-3 shadow-sm"
        >
          <FeedCardInner item={it} />
        </article>
      ))}
    </div>
  );
}

function FeedCardInner({
  item,
}: {
  item: (typeof mockRecommendations)[number];
}) {
  return (
    <>
      <span className="inline-flex w-fit items-center rounded-full bg-[#0B6BCB]/10 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-[#0B6BCB]">
        {feedTypeLabel(item.contentType)}
      </span>
      <h4 className="line-clamp-2 text-[13px] font-semibold leading-[1.3] text-foreground">
        {item.title}
      </h4>
      <p className="line-clamp-2 text-[11.5px] text-foreground/55">
        {feedSubline(item)}
      </p>
    </>
  );
}

function feedTypeLabel(type: string): string {
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
    default:
      return type;
  }
}

function contentTypeShort(type: string): string {
  return feedTypeLabel(type).slice(0, 2).toUpperCase();
}

function feedSubline(item: (typeof mockRecommendations)[number]): string {
  if ("authorName" in item) return `${item.category} · ${item.authorName}`;
  if ("date" in item && item.date) return `Event · ${item.date}`;
  if ("version" in item && item.version) return `Release · ${item.version}`;
  if ("estimatedTimeRemaining" in item && item.estimatedTimeRemaining)
    return `Academy · ${item.estimatedTimeRemaining}`;
  return "";
}

/* ── Right rail ─────────────────────────────────────────────────── */

function PanelHeader({ onClose }: { onClose: () => void }) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-black/[0.07] bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="rounded bg-foreground px-1.5 py-0.5 font-mono text-[10px] font-bold text-background">
          EN-US
        </span>
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-foreground">
          Recommendations
        </h2>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close panel"
        className="grid h-7 w-7 place-items-center rounded text-foreground/55 hover:bg-black/[0.05]"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>
    </header>
  );
}

function PanelFooter({ onDone }: { onDone: () => void }) {
  return (
    <footer className="flex shrink-0 justify-end border-t border-black/[0.07] bg-white px-4 py-3">
      <button
        type="button"
        onClick={onDone}
        className="rounded-md bg-[#0B6BCB] px-5 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-[#0859A8]"
      >
        Done
      </button>
    </footer>
  );
}

/* ── Accordion ──────────────────────────────────────────────────── */

function Section({
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
    <section className="border-b border-black/[0.07]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wide text-foreground/75 hover:bg-black/[0.02]"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        )}
        {title}
      </button>
      {open && <div className="px-4 pb-5">{children}</div>}
    </section>
  );
}

/* ── CONTENT section (the meaningful change) ─────────────────────── */

function ContentSection({
  config,
  update,
}: {
  config: RecsConfig;
  update: <K extends keyof RecsConfig>(key: K, value: RecsConfig[K]) => void;
}) {
  return (
    <Section title="Content" defaultOpen>
      <Field label="Title">
        <input
          type="text"
          value={config.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-md border border-black/15 bg-white px-3 py-1.5 text-[13.5px] outline-none focus:border-[#0B6BCB] focus:ring-1 focus:ring-[#0B6BCB]/30"
        />
      </Field>
      <Field label="Subtitle">
        <input
          type="text"
          value={config.subtitle}
          placeholder="Widget subtitle"
          onChange={(e) => update("subtitle", e.target.value)}
          className="w-full rounded-md border border-black/15 bg-white px-3 py-1.5 text-[13.5px] outline-none placeholder:text-foreground/35 focus:border-[#0B6BCB] focus:ring-1 focus:ring-[#0B6BCB]/30"
        />
      </Field>

      {/* ── Source toggle (NEW) ── */}
      <div className="mt-4 rounded-md border border-[#0B6BCB]/30 bg-[#EAF2FB] p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wide text-[#0B6BCB]">
          <Sparkles className="h-3 w-3" strokeWidth={2.5} />
          New · recommendation source
        </div>
        <p className="mb-3 text-[11.5px] leading-[1.45] text-foreground/65">
          Drive this widget from manually curated topics (existing behaviour)
          or from the new DCH recommendations engine. Toggle off any time to
          revert.
        </p>
        <SegmentedToggle
          value={config.source}
          onChange={(v) => update("source", v)}
          options={[
            { value: "manual", label: "Manual topics" },
            { value: "algorithmic", label: "Algorithmic feed" },
          ]}
        />
      </div>

      {config.source === "manual" ? (
        <Field label="Topics" className="mt-4">
          <div className="rounded-md border border-black/15 bg-white">
            <div className="flex items-center gap-2 px-3 py-2 text-[12.5px] text-foreground/45">
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Search for topics or enter a topic URL
            </div>
            <ul className="divide-y divide-black/[0.05] border-t border-black/10">
              {config.topics.map((t) => (
                <li
                  key={t}
                  className="flex items-center justify-between px-3 py-2 text-[12.5px] text-foreground/75"
                >
                  <span className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1F76FF] text-[9px] font-bold text-white">
                      {TOPIC_INITIALS[t] ?? t.slice(0, 2).toUpperCase()}
                    </span>
                    {t}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "topics",
                        config.topics.filter((x) => x !== t)
                      )
                    }
                    aria-label={`Remove ${t}`}
                    className="text-foreground/45 hover:text-foreground"
                  >
                    <X className="h-3 w-3" strokeWidth={2.25} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Field>
      ) : (
        <>
          <Field label="Count" className="mt-4" help="Number of items shown in the feed.">
            <SegmentedToggle
              value={String(config.count) as "3" | "5" | "7"}
              onChange={(v) => update("count", Number(v) as Count)}
              options={[
                { value: "3", label: "3" },
                { value: "5", label: "5" },
                { value: "7", label: "7" },
              ]}
            />
          </Field>

          <Field
            label="Layout"
            className="mt-4"
            help="List preserves the existing widget format. Cards and Carousel are new layouts that pair well with the algorithmic feed."
          >
            <SegmentedToggle
              value={config.layout}
              onChange={(v) => update("layout", v)}
              options={[
                { value: "list", label: "List" },
                { value: "cards", label: "Cards" },
                { value: "carousel", label: "Carousel" },
              ]}
            />
          </Field>
        </>
      )}
    </Section>
  );
}

/* ── STYLE section ─────────────────────────────────────────────── */

function StyleSection({
  config,
  update,
}: {
  config: RecsConfig;
  update: <K extends keyof RecsConfig>(key: K, value: RecsConfig[K]) => void;
}) {
  return (
    <Section title="Style">
      <Field label="Background Mode">
        <select
          value={config.background}
          onChange={(e) =>
            update("background", e.target.value as BackgroundMode)
          }
          className="w-full rounded-md border border-black/15 bg-white px-3 py-1.5 text-[13.5px] outline-none focus:border-[#0B6BCB]"
        >
          <option value="none">None</option>
          <option value="solid">Solid</option>
          <option value="gradient">Gradient</option>
        </select>
      </Field>

      <Field label="Title Color">
        <select
          value={config.titleColor}
          onChange={(e) => update("titleColor", e.target.value)}
          className="w-full rounded-md border border-black/15 bg-white px-3 py-1.5 text-[13.5px] outline-none focus:border-[#0B6BCB]"
        >
          <option>Heading color</option>
          <option>Body color</option>
          <option>Accent color</option>
        </select>
      </Field>

      <Field label="Subtitle Color">
        <select
          value={config.subtitleColor}
          onChange={(e) => update("subtitleColor", e.target.value)}
          className="w-full rounded-md border border-black/15 bg-white px-3 py-1.5 text-[13.5px] outline-none focus:border-[#0B6BCB]"
        >
          <option>Heading color</option>
          <option>Body color</option>
          <option>Muted color</option>
        </select>
      </Field>

      <label className="mt-3 flex cursor-pointer items-start gap-2 text-[13px]">
        <input
          type="checkbox"
          checked={config.enableTopMargin}
          onChange={(e) => update("enableTopMargin", e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#0B6BCB]"
        />
        <span>
          <strong className="font-medium text-foreground/85">
            Enable top margin
          </strong>{" "}
          <span className="text-foreground/55">
            (Add spacing between this widget and the widget on top)
          </span>
        </span>
      </label>

      <label className="mt-3 flex cursor-pointer items-start gap-2 text-[13px]">
        <input
          type="checkbox"
          checked={config.enableTopBottomPadding}
          onChange={(e) => update("enableTopBottomPadding", e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#0B6BCB]"
        />
        <span>
          <strong className="font-medium text-foreground/85">
            Enable top and bottom padding
          </strong>{" "}
          <span className="text-foreground/55">
            (Add spacing on top and bottom of this widget&apos;s content)
          </span>
        </span>
      </label>
    </Section>
  );
}

/* ── VISIBILITY section ─────────────────────────────────────────── */

function VisibilitySection({
  config,
  update,
}: {
  config: RecsConfig;
  update: <K extends keyof RecsConfig>(key: K, value: RecsConfig[K]) => void;
}) {
  return (
    <Section title="Visibility">
      <p className="mb-2 text-[11.5px] font-semibold text-foreground/65">
        Widget Visibility
      </p>
      <div className="flex flex-col gap-2 text-[13px]">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="visibility"
            checked={config.visibility === "public"}
            onChange={() => update("visibility", "public")}
            className="h-4 w-4 accent-[#0B6BCB]"
          />
          <span>
            <strong className="font-medium text-foreground/85">Public</strong>{" "}
            <span className="text-foreground/55">(visible to everyone)</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="visibility"
            checked={config.visibility === "private"}
            onChange={() => update("visibility", "private")}
            className="h-4 w-4 accent-[#0B6BCB]"
          />
          <span>
            <strong className="font-medium text-foreground/85">Private</strong>{" "}
            <span className="text-foreground/55">
              (visible to selected segments)
            </span>
          </span>
        </label>
      </div>
    </Section>
  );
}

/* ── Tiny form primitives ───────────────────────────────────────── */

function Field({
  label,
  children,
  className,
  help,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  help?: string;
}) {
  return (
    <div className={cn("mt-3", className)}>
      <label className="mb-1 block text-[12px] font-semibold text-foreground/75">
        {label}
      </label>
      {children}
      {help && (
        <p className="mt-1 text-[11px] leading-[1.4] text-foreground/45">
          {help}
        </p>
      )}
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
              "flex-1 rounded px-2 py-1 text-[12.5px] font-medium transition-colors",
              active
                ? "bg-[#0B6BCB] text-white shadow-sm"
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
