"use client";

// Skilljar Catalog Page Builder demo.
//
// Recreates the screenshots provided by product (Skilljar's catalog
// page builder admin) so we can pitch the "For You Feed" as a new
// personalised content block alongside "In-Progress Courses".
//
// Flow:
//   1. Empty canvas with an "Add Content to Page" CTA
//   2. CTA opens the Add Content drawer (right side)
//   3. Drawer lists general blocks + a "Personalized content blocks"
//      section containing In-Progress Courses *and* the new For You
//      Feed tile (flagged NEW)
//   4. Clicking either personalised tile opens a configuration drawer
//      with the block's settings; "Add to Page" commits it to a list
//      of placed blocks shown above the canvas preview
//
// Everything is local state — no router, no persistence. Closing the
// "X" in the top-right resets to the empty canvas.

import { useState } from "react";
import {
  Palette,
  Settings,
  X,
  GraduationCap,
  Sparkles,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockRecommendations } from "@/components/recommendations/mock-data";
import type { RecommendationItem } from "@/components/recommendations/types";

type BlockKind =
  | "html"
  | "hero"
  | "catalog-tiles"
  | "announcement"
  | "in-progress-courses"
  | "recommended-content";

type ContentScope = "courses" | "cross-product";

interface PlacedBlock {
  id: string;
  kind: BlockKind;
  sectionHeader: string;
  // Configurable knobs across the personalised blocks. Each drawer only
  // surfaces the subset that applies to its block kind.
  includeProfileLink?: boolean;
  excludeCompleted?: boolean;
  contentScope?: ContentScope;
  maxTiles?: number;
  alignment?: "left" | "center" | "right";
}

type DrawerState =
  | { kind: "closed" }
  | { kind: "add-content" }
  | { kind: "config"; block: BlockKind };

export function CatalogPageBuilder() {
  const [drawer, setDrawer] = useState<DrawerState>({ kind: "closed" });
  const [placed, setPlaced] = useState<PlacedBlock[]>([]);
  // In-progress preview block — populated when the admin is in a config
  // drawer for a personalised block. The canvas mirrors this so the
  // admin can see their changes live (mirrors the CC builder pattern).
  const [previewBlock, setPreviewBlock] = useState<PlacedBlock | null>(null);

  const openAddContent = () => setDrawer({ kind: "add-content" });
  const closeDrawer = () => {
    setDrawer({ kind: "closed" });
    setPreviewBlock(null);
  };
  const openConfig = (block: BlockKind) => {
    // Seed defaults so the canvas preview renders from first paint.
    if (block === "recommended-content") {
      setPreviewBlock({
        id: "preview",
        kind: "recommended-content",
        sectionHeader: "Recommendations",
        contentScope: "courses",
        excludeCompleted: true,
        maxTiles: 5,
        alignment: "center",
      });
    }
    setDrawer({ kind: "config", block });
  };

  const handleAdd = (block: PlacedBlock) => {
    setPlaced((prev) => [...prev, block]);
    closeDrawer();
  };

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col overflow-hidden bg-[#EEF1F5]">
      {/* ── Top chrome ── */}
      <TopNav />

      {/* ── Page header strip ── */}
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-black/[0.05] bg-[#F7F8FA] px-4 text-[12px] text-foreground/60">
        <span className="grid h-6 w-6 place-items-center rounded border border-black/10 bg-white">
          <ImageIconStub />
        </span>
        Page Header
        <span className="text-foreground/30">?</span>
      </div>

      {/* ── Canvas ── */}
      <div className="flex flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[760px] flex-col items-center px-6 py-12">
          {placed.length === 0 && !previewBlock ? (
            <EmptyCanvas onAdd={openAddContent} />
          ) : (
            <PlacedCanvas
              blocks={placed}
              previewBlock={previewBlock}
              onAdd={openAddContent}
            />
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Drawer + scrim ── */}
      {drawer.kind !== "closed" && (
        <>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close drawer"
            className="absolute inset-0 z-30 bg-black/40"
          />
          <aside className="absolute right-0 top-0 z-40 flex h-full w-full max-w-[460px] flex-col bg-white shadow-[-12px_0_40px_-12px_rgba(0,0,0,0.18)]">
            {drawer.kind === "add-content" && (
              <AddContentDrawer
                onClose={closeDrawer}
                onPick={openConfig}
              />
            )}
            {drawer.kind === "config" && drawer.block === "in-progress-courses" && (
              <InProgressConfigDrawer onClose={closeDrawer} onAdd={handleAdd} />
            )}
            {drawer.kind === "config" &&
              drawer.block === "recommended-content" &&
              previewBlock && (
                <RecommendedContentConfigDrawer
                  block={previewBlock}
                  onChange={setPreviewBlock}
                  onClose={closeDrawer}
                  onAdd={handleAdd}
                />
              )}
            {drawer.kind === "config" &&
              drawer.block !== "in-progress-courses" &&
              drawer.block !== "recommended-content" && (
                <GenericConfigDrawer
                  blockKind={drawer.block}
                  onClose={closeDrawer}
                  onAdd={handleAdd}
                />
              )}
          </aside>
        </>
      )}
    </div>
  );
}

/* ── Top chrome ─────────────────────────────────────────────────── */

function TopNav() {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 bg-[#10182B] px-3 text-white">
      <button
        type="button"
        aria-label="Theme"
        className="grid h-8 w-8 place-items-center rounded text-white/80 hover:bg-white/10"
      >
        <Palette className="h-4 w-4" strokeWidth={2} />
      </button>
      <button
        type="button"
        aria-label="Settings"
        className="grid h-8 w-8 place-items-center rounded text-white/80 hover:bg-white/10"
      >
        <Settings className="h-4 w-4" strokeWidth={2} />
      </button>
      <div className="mx-auto flex h-8 w-full max-w-[480px] items-center rounded bg-white px-3 text-[12.5px] text-black/55">
        <span className="text-black/85">fwefew</span>
      </div>
      <button
        type="button"
        className="rounded bg-[#1F2A44] px-3 py-1 text-[11.5px] font-semibold text-white/55"
        disabled
      >
        Save
      </button>
      <button
        type="button"
        aria-label="Close builder"
        className="grid h-8 w-8 place-items-center rounded text-white/75 hover:bg-white/10"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>
    </header>
  );
}

function ImageIconStub() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-black/45"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

/* ── Empty canvas (default landing) ─────────────────────────────── */

function EmptyCanvas({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex w-full flex-col items-start gap-5 rounded bg-white px-2 py-2 text-foreground">
      <h1 className="text-[24px] font-semibold tracking-tight">
        Introducing Catalog Page Builder!
      </h1>
      <hr className="w-full border-black/10" />
      <p className="text-[13.5px] text-foreground/75">
        Welcome to the Catalog Page Builder. A simpler, visual way to create
        new catalog pages.
      </p>
      <p className="text-[13.5px] text-foreground/75">
        <a
          href="#"
          className="font-semibold text-[#0B6BCB] underline underline-offset-2"
          onClick={(e) => e.preventDefault()}
        >
          Learn more about building catalog pages here.
        </a>{" "}
        Please send any feedback to{" "}
        <a
          href="#"
          className="font-semibold text-[#0B6BCB] underline underline-offset-2"
          onClick={(e) => e.preventDefault()}
        >
          product@skilljar.com
        </a>
        .
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mx-auto mt-2 rounded-md bg-[#0B6BCB] px-4 py-2 text-[13.5px] font-semibold text-white shadow-sm hover:bg-[#0859A8]"
      >
        Add Content to Page
      </button>

      {/* Wireframe preview of what a page looks like once populated */}
      <PageWireframePreview />
    </div>
  );
}

function PageWireframePreview() {
  return (
    <div className="mx-auto mt-4 w-full max-w-[640px] overflow-hidden rounded-md border border-black/10 bg-[#F5F7FA]">
      <div className="flex h-7 items-center gap-1 border-b border-black/10 bg-white px-2">
        <span className="h-2 w-2 rounded-full bg-black/15" />
        <span className="ml-auto flex gap-1">
          <span className="h-1 w-1 rounded-full bg-black/30" />
          <span className="h-1 w-1 rounded-full bg-black/30" />
          <span className="h-1 w-1 rounded-full bg-black/30" />
        </span>
      </div>
      <div className="flex gap-4 p-4">
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-2 w-3/4 rounded bg-black/10" />
          <div className="h-1.5 w-2/3 rounded bg-black/10" />
          <div className="h-1.5 w-1/2 rounded bg-black/10" />
        </div>
        <div className="h-16 w-44 rounded bg-[#B7CDEB]" />
      </div>
      <div className="grid grid-cols-4 gap-3 px-4 pb-4">
        {["bg-blue-100", "bg-emerald-100", "bg-stone-100", "bg-violet-100"].map(
          (c, i) => (
            <div
              key={i}
              className={`h-16 rounded border border-black/10 ${c}`}
            />
          )
        )}
      </div>
    </div>
  );
}

/* ── Placed canvas (after blocks are added) ─────────────────────── */

function PlacedCanvas({
  blocks,
  previewBlock,
  onAdd,
}: {
  blocks: PlacedBlock[];
  previewBlock: PlacedBlock | null;
  onAdd: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      {blocks.map((b) => (
        <PlacedBlockCard key={b.id} block={b} />
      ))}
      {/* Live preview while the admin is configuring a new block */}
      {previewBlock && (
        <PlacedBlockCard block={previewBlock} isPreview />
      )}
      <button
        type="button"
        onClick={onAdd}
        className="self-center rounded-md bg-[#0B6BCB] px-4 py-2 text-[13.5px] font-semibold text-white shadow-sm hover:bg-[#0859A8]"
      >
        Add Content to Page
      </button>
    </div>
  );
}

function PlacedBlockCard({
  block,
  isPreview,
}: {
  block: PlacedBlock;
  isPreview?: boolean;
}) {
  const meta = BLOCK_META[block.kind];
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-white",
        isPreview
          ? "border-[#0B6BCB] ring-2 ring-[#0B6BCB]/15"
          : "border-black/10"
      )}
    >
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#F7F8FA] px-3 py-2 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-foreground/55">
        {meta.icon}
        {meta.label}
        {block.kind === "recommended-content" && (
          <span className="rounded-full bg-[#0B6BCB] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
            New
          </span>
        )}
        {block.kind === "recommended-content" && block.contentScope && (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
              block.contentScope === "cross-product"
                ? "bg-amber-100 text-amber-800"
                : "bg-[#EAF2FB] text-[#0B6BCB]"
            )}
          >
            {block.contentScope === "cross-product"
              ? "Cross-product"
              : "Courses only"}
          </span>
        )}
        {isPreview && (
          <span className="ml-auto rounded-full bg-[#0B6BCB]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#0B6BCB]">
            Live preview
          </span>
        )}
      </div>

      {block.kind === "recommended-content" ? (
        <RecommendedContentLivePreview block={block} />
      ) : (
        <div className="p-4">
          {block.sectionHeader && (
            <h2 className="mb-2 text-[18px] font-semibold text-foreground">
              {block.sectionHeader}
            </h2>
          )}
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: block.maxTiles ?? 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded border border-black/10 bg-[#F5F7FA]"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Live preview body for the Recommended Content block ─────────── */

function RecommendedContentLivePreview({ block }: { block: PlacedBlock }) {
  const items = pickRecommendations(
    block.contentScope ?? "courses",
    block.maxTiles ?? 5
  );

  const alignmentClass =
    block.alignment === "left"
      ? "text-left"
      : block.alignment === "right"
        ? "text-right"
        : "text-center";

  return (
    <div className={cn("px-5 py-4", alignmentClass)}>
      <h2 className="text-[20px] font-bold text-foreground">
        {block.sectionHeader || "Recommendations"}
      </h2>
      <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#0B6BCB]/10 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-[#0B6BCB]">
        <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
        Algorithmic feed
      </div>

      <ul className="mt-4 flex flex-col gap-2 text-left">
        {items.map((it) => (
          <li
            key={it.id}
            className="flex items-start gap-3 rounded-md border border-black/[0.07] bg-white px-3 py-2.5"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#EEF2FF] text-[10px] font-bold uppercase text-[#0B6BCB]">
              {recoTypeShort(it.contentType)}
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="text-[10.5px] font-bold uppercase tracking-wide text-foreground/55">
                {recoTypeLabel(it.contentType)}
              </span>
              <h4 className="truncate text-[13.5px] font-semibold text-foreground">
                {it.title}
              </h4>
              <span className="truncate text-[11.5px] text-foreground/55">
                {recoSubline(it)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Recommendation helpers ─────────────────────────────────────── */

function pickRecommendations(
  scope: ContentScope,
  count: number
): RecommendationItem[] {
  const courseTypes = new Set(["course", "lesson", "learning_path"]);
  const pool =
    scope === "courses"
      ? mockRecommendations.filter((r) => courseTypes.has(r.contentType))
      : mockRecommendations;
  return pool.slice(0, count);
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

function recoTypeShort(type: RecommendationItem["contentType"]): string {
  return recoTypeLabel(type).slice(0, 2).toUpperCase();
}

function recoSubline(item: RecommendationItem): string {
  if ("category" in item && "authorName" in item)
    return `${item.category} · ${item.authorName}`;
  if ("date" in item && item.date) return `Event · ${item.date}`;
  if ("version" in item && item.version) return `Release · ${item.version}`;
  if ("estimatedTimeRemaining" in item && item.estimatedTimeRemaining)
    return `Academy · ${item.estimatedTimeRemaining}`;
  return "";
}

/* ── Add Content drawer ─────────────────────────────────────────── */

function AddContentDrawer({
  onClose,
  onPick,
}: {
  onClose: () => void;
  onPick: (kind: BlockKind) => void;
}) {
  return (
    <>
      <DrawerHeader title="Add Content" subtitle="Add content blocks to build out your page" onClose={onClose} />
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="grid grid-cols-3 gap-3">
          <BlockTile
            label="HTML/Text Block"
            preview={<HtmlPreview />}
            onClick={() => onPick("html")}
          />
          <BlockTile
            label="Hero Image"
            preview={<HeroPreview />}
            onClick={() => onPick("hero")}
          />
          <BlockTile
            label="Catalog Tiles"
            preview={<TilesPreview />}
            onClick={() => onPick("catalog-tiles")}
          />
          <BlockTile
            label="Announcement Bar"
            preview={<AnnouncementPreview />}
            onClick={() => onPick("announcement")}
          />
        </div>

        <h3 className="mb-1 mt-8 text-[18px] font-semibold text-foreground">
          Personalized content blocks
        </h3>
        <p className="mb-4 text-[12.5px] text-foreground/55">
          Only visible to users who are signed in. Includes content specific to
          the user and their learning history.
        </p>

        <div className="grid grid-cols-3 gap-3">
          <BlockTile
            label="In-Progress Courses"
            preview={<TilesPreview />}
            onClick={() => onPick("in-progress-courses")}
          />
          <BlockTile
            label="Recommended Content"
            badge="NEW"
            preview={<RecommendedContentPreview />}
            onClick={() => onPick("recommended-content")}
          />
        </div>
      </div>
    </>
  );
}

/* ── Block tiles (preview thumbnails) ───────────────────────────── */

function BlockTile({
  label,
  preview,
  onClick,
  badge,
}: {
  label: string;
  preview: React.ReactNode;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col items-center gap-2 rounded-lg border border-black/10 bg-white p-3 text-center transition-all hover:border-[#0B6BCB] hover:shadow-md"
    >
      {badge && (
        <span className="absolute -top-1.5 right-1.5 rounded-full bg-[#0B6BCB] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
          {badge}
        </span>
      )}
      <div className="grid h-[88px] w-full place-items-center rounded border border-black/10 bg-[#F7F8FA] p-2">
        {preview}
      </div>
      <span className="text-[12.5px] font-medium text-foreground/85">
        {label}
      </span>
    </button>
  );
}

function HtmlPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-1 rounded bg-white p-2">
      <span className="grid h-3 w-12 place-items-center rounded bg-[#DCE7F7] font-mono text-[7px] font-bold text-[#0B6BCB]">
        T &lt;/&gt;
      </span>
      <span className="h-1 w-3/4 rounded bg-black/15" />
      <span className="h-1 w-2/3 rounded bg-black/15" />
      <span className="h-1 w-1/2 rounded bg-black/15" />
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-1 rounded bg-[#DCE7F7] p-2">
      <span className="h-1 w-1/2 rounded bg-white/80" />
      <span className="ml-auto h-3 w-6 rounded bg-white" />
      <span className="h-1 w-1/3 rounded bg-white/80" />
    </div>
  );
}

function TilesPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 rounded bg-white p-2">
      <span className="h-1 w-1/2 rounded bg-black/15" />
      <div className="grid grid-cols-3 gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-5 rounded bg-[#DCE7F7]" />
        ))}
      </div>
    </div>
  );
}

function AnnouncementPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-1 rounded bg-white p-2">
      <span className="h-2 w-full rounded bg-[#DCE7F7]" />
      <span className="mt-auto h-1 w-3/4 rounded bg-black/10" />
    </div>
  );
}

function RecommendedContentPreview() {
  // Mixed sources — alternating swatches hint that tiles can be courses
  // *or* community content (questions, articles, ideas, etc).
  return (
    <div className="flex h-full w-full flex-col gap-1.5 rounded bg-white p-2">
      <span className="flex items-center gap-1">
        <Compass className="h-2 w-2 text-[#0B6BCB]" strokeWidth={2.5} />
        <span className="h-1 w-10 rounded bg-[#0B6BCB]/70" />
      </span>
      <div className="grid grid-cols-3 gap-1">
        <span className="h-5 rounded bg-gradient-to-br from-sky-100 to-indigo-200" />
        <span className="h-5 rounded bg-gradient-to-br from-amber-100 to-rose-200" />
        <span className="h-5 rounded bg-gradient-to-br from-emerald-100 to-teal-200" />
      </div>
    </div>
  );
}

/* ── Config drawers ─────────────────────────────────────────────── */

function DrawerHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
}) {
  return (
    <header className="shrink-0 border-b border-black/[0.07] bg-white px-6 py-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-[13px] text-foreground/55">{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-7 w-7 place-items-center rounded text-foreground/55 hover:bg-black/[0.05]"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}

function DrawerFooter({
  onCancel,
  onAdd,
  addLabel = "Add to Page",
}: {
  onCancel: () => void;
  onAdd: () => void;
  addLabel?: string;
}) {
  return (
    <footer className="flex shrink-0 items-center justify-between border-t border-black/[0.07] bg-white px-6 py-4">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md border border-black/15 bg-white px-4 py-1.5 text-[13px] font-medium text-foreground/75 hover:bg-black/[0.03]"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onAdd}
        className="rounded-md bg-[#0B6BCB] px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-[#0859A8]"
      >
        {addLabel}
      </button>
    </footer>
  );
}

function InProgressConfigDrawer({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (b: PlacedBlock) => void;
}) {
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");
  const [includeProfileLink, setIncludeProfileLink] = useState(true);
  const [maxTiles, setMaxTiles] = useState(4);
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("center");

  return (
    <>
      <DrawerHeader
        title="Add In-Progress Courses"
        subtitle="Displays catalog tiles for the student's in-progress courses, listing those with the most recent activity first."
        onClose={onClose}
      />
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <SectionHeading>Content</SectionHeading>

        <TextField
          label="Section header (optional)"
          value={header}
          onChange={setHeader}
          maxLength={100}
          help="Any text you enter here will be visible on your page as an h2."
        />
        <TextAreaField
          label="Section description (optional)"
          value={description}
          onChange={setDescription}
          maxLength={500}
          help="Any text you enter here will be visible on your page as a p."
        />

        <Checkbox
          checked={includeProfileLink}
          onChange={setIncludeProfileLink}
          label="Include link to student profile"
          help="Shown above the list of catalog tiles. The student profile includes the full list of their registrations."
        />

        <NumberField
          label="Maximum number of catalog tiles"
          value={maxTiles}
          onChange={setMaxTiles}
          help="If the student has no in-progress courses, this content block will be hidden."
        />

        <SectionHeading className="mt-6">Layout</SectionHeading>
        <Radios
          legend="Text and catalog tile alignment"
          help="Does not apply to text within the tiles."
          value={alignment}
          onChange={setAlignment}
          options={[
            { value: "left", label: "Align left" },
            { value: "center", label: "Align center" },
            { value: "right", label: "Align right" },
          ]}
        />
      </div>
      <DrawerFooter
        onCancel={onClose}
        onAdd={() =>
          onAdd({
            id: cryptoId(),
            kind: "in-progress-courses",
            sectionHeader: header || "In-Progress Courses",
            includeProfileLink,
            maxTiles,
            alignment,
          })
        }
      />
    </>
  );
}

function RecommendedContentConfigDrawer({
  block,
  onChange,
  onClose,
  onAdd,
}: {
  block: PlacedBlock;
  onChange: (next: PlacedBlock) => void;
  onClose: () => void;
  onAdd: (b: PlacedBlock) => void;
}) {
  // Controlled component. State lives in the parent so the canvas can
  // mirror every keystroke / toggle as a live preview.
  //
  // Single recommendations block per the updated SJ spec. A toggle at
  // the top of the drawer picks between courses-only (the default,
  // available to every academy) and the cross-product mix (courses +
  // community + eventually PX content, gated to cross-product
  // customers only).
  const [description, setDescription] = useState(
    "Content chosen for this student based on their learning history and role."
  );

  const contentScope = block.contentScope ?? "courses";
  const isCrossProduct = contentScope === "cross-product";
  const header = block.sectionHeader;
  const excludeCompleted = block.excludeCompleted ?? true;
  const maxTiles = (block.maxTiles ?? 5) as 3 | 5 | 7;
  const alignment = block.alignment ?? "center";

  const setContentScope = (v: ContentScope) =>
    onChange({
      ...block,
      contentScope: v,
      // The completed-courses toggle doesn't apply to cross-product mode,
      // so clear it when flipping to keep the payload clean.
      excludeCompleted: v === "cross-product" ? undefined : (block.excludeCompleted ?? true),
    });
  const setHeader = (v: string) => onChange({ ...block, sectionHeader: v });
  const setExcludeCompleted = (v: boolean) =>
    onChange({ ...block, excludeCompleted: v });
  const setMaxTiles = (v: 3 | 5 | 7) => onChange({ ...block, maxTiles: v });
  const setAlignment = (v: "left" | "center" | "right") =>
    onChange({ ...block, alignment: v });

  return (
    <>
      <DrawerHeader
        title="Add Recommended Content"
        subtitle="Catalog tiles ranked for this student by the recommendations engine. Toggle the content scope to include community content alongside courses."
        onClose={onClose}
      />
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mb-4 flex items-center gap-2 rounded-md border border-[#0B6BCB]/30 bg-[#EAF2FB] px-3 py-2 text-[12px] text-[#0B6BCB]">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
          <span>
            <strong>NEW.</strong> Powered by the DCH recommendations engine.
          </span>
        </div>

        <SectionHeading>Content scope</SectionHeading>
        <p className="mb-3 text-[12px] leading-[1.5] text-foreground/55">
          Pick what the engine is allowed to surface in this block. You can
          change this any time without dropping the block.
        </p>
        <ContentScopeToggle value={contentScope} onChange={setContentScope} />

        {isCrossProduct && (
          <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
            <Compass className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
            <span>
              <strong>Cross-product customers only.</strong> Requires both
              Skilljar Academy and Customer Community. Will eventually
              include Gainsight PX content. Tiles are mixed by default —
              there is no per-source toggle.
            </span>
          </div>
        )}

        <SectionHeading className="mt-6">Content</SectionHeading>
        <TextField
          label="Section header (optional)"
          value={header}
          onChange={setHeader}
          maxLength={100}
          help="Any text you enter here will be visible on your page as an h2."
        />
        <TextAreaField
          label="Section description (optional)"
          value={description}
          onChange={setDescription}
          maxLength={500}
          help="Any text you enter here will be visible on your page as a p."
        />

        {!isCrossProduct && (
          <Checkbox
            checked={excludeCompleted}
            onChange={setExcludeCompleted}
            label="Exclude courses the student has completed"
            help="Keeps the rail focused on net-new learning. Disable if you want completed courses to resurface for retraining or refresher prompts."
          />
        )}

        <div className="mb-4">
          <label className="mb-1 block text-[13px] font-medium text-foreground/85">
            Number of catalog tiles to show
          </label>
          <CountSegmented
            value={maxTiles}
            onChange={setMaxTiles}
            options={[3, 5, 7]}
          />
          <p className="mt-1 text-[11.5px] text-foreground/45">
            {isCrossProduct
              ? "If the student has no cross-product recommendations yet, this content block will be hidden."
              : "If the student has no recommended courses yet, this content block will be hidden."}
          </p>
        </div>

        <SectionHeading className="mt-6">Layout</SectionHeading>
        <Radios
          legend="Text and catalog tile alignment"
          help="Does not apply to text within the tiles."
          value={alignment}
          onChange={setAlignment}
          options={[
            { value: "left", label: "Align left" },
            { value: "center", label: "Align center" },
            { value: "right", label: "Align right" },
          ]}
        />
      </div>
      <DrawerFooter
        onCancel={onClose}
        onAdd={() =>
          onAdd({
            ...block,
            id: cryptoId(),
            sectionHeader: header || "Recommended for you",
          })
        }
      />
    </>
  );
}

/* Segmented control for fixed-set count picks (3/5/7). Matches the
   visual language of the CC page builder's count toggle so the same
   choice reads consistently across both surfaces. */
function CountSegmented<T extends number>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: T[];
}) {
  return (
    <div className="flex rounded-md border border-black/15 bg-white p-0.5">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={active}
            className={cn(
              "flex-1 rounded px-2 py-1.5 text-[13px] font-semibold tabular-nums transition-colors",
              active
                ? "bg-[#0B6BCB] text-white shadow-sm"
                : "text-foreground/65 hover:bg-black/[0.04]"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* Segmented control for the courses-only ↔ cross-product toggle.
   Lives inline rather than reusing the radios primitive so the
   selected state can be more visually emphatic (this is the headline
   change in the drawer). */
function ContentScopeToggle({
  value,
  onChange,
}: {
  value: ContentScope;
  onChange: (v: ContentScope) => void;
}) {
  const options: { value: ContentScope; label: string; help: string }[] = [
    {
      value: "courses",
      label: "Courses only",
      help: "Skilljar courses ranked for this student.",
    },
    {
      value: "cross-product",
      label: "Cross-product content",
      help: "Courses + community (and eventually PX) — cross-product customers only.",
    },
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-md border px-3 py-2 text-left transition-colors",
              active
                ? "border-[#0B6BCB] bg-[#EAF2FB] text-[#0B6BCB] shadow-sm"
                : "border-black/15 bg-white text-foreground/75 hover:border-black/30"
            )}
          >
            <span className="flex w-full items-center justify-between text-[13px] font-semibold">
              {opt.label}
              <span
                className={cn(
                  "grid h-4 w-4 place-items-center rounded-full border-2",
                  active
                    ? "border-[#0B6BCB] bg-[#0B6BCB]"
                    : "border-black/25 bg-white"
                )}
                aria-hidden
              >
                {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
            </span>
            <span
              className={cn(
                "text-[11.5px] leading-[1.4]",
                active ? "text-[#0B6BCB]/80" : "text-foreground/55"
              )}
            >
              {opt.help}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function GenericConfigDrawer({
  blockKind,
  onClose,
  onAdd,
}: {
  blockKind: BlockKind;
  onClose: () => void;
  onAdd: (b: PlacedBlock) => void;
}) {
  const meta = BLOCK_META[blockKind];
  return (
    <>
      <DrawerHeader title={`Add ${meta.label}`} onClose={onClose} />
      <div className="flex-1 overflow-y-auto px-6 py-5 text-[13px] text-foreground/55">
        Configuration for <strong>{meta.label}</strong> is out of scope for
        this demo — the focus is the new <em>For You Feed</em> block. Click{" "}
        <strong>Add to Page</strong> to drop a placeholder block onto the
        canvas.
      </div>
      <DrawerFooter
        onCancel={onClose}
        onAdd={() =>
          onAdd({
            id: cryptoId(),
            kind: blockKind,
            sectionHeader: meta.label,
            maxTiles: 4,
            alignment: "center",
          })
        }
      />
    </>
  );
}

/* ── Form primitives ────────────────────────────────────────────── */

function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "mb-3 text-[18px] font-semibold tracking-tight text-foreground",
        className
      )}
    >
      {children}
    </h3>
  );
}

function TextField({
  label,
  value,
  onChange,
  maxLength,
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  help?: string;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-[13px] font-medium text-foreground/85">
        {label}
      </label>
      <input
        type="text"
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-[13.5px] outline-none focus:border-[#0B6BCB] focus:ring-1 focus:ring-[#0B6BCB]/30"
      />
      <div className="mt-1 flex items-start justify-between text-[11.5px] text-foreground/45">
        <span>{help}</span>
        {maxLength && (
          <span className="shrink-0 tabular-nums">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  maxLength,
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  help?: string;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-[13px] font-medium text-foreground/85">
        {label}
      </label>
      <textarea
        rows={3}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-md border border-black/15 bg-white px-3 py-2 text-[13.5px] outline-none focus:border-[#0B6BCB] focus:ring-1 focus:ring-[#0B6BCB]/30"
      />
      <div className="mt-1 flex items-start justify-between text-[11.5px] text-foreground/45">
        <span>{help}</span>
        {maxLength && (
          <span className="shrink-0 tabular-nums">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  help?: string;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-[13px] font-medium text-foreground/85">
        {label}
      </label>
      <input
        type="number"
        min={1}
        max={24}
        value={value}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
        className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-[13.5px] outline-none focus:border-[#0B6BCB] focus:ring-1 focus:ring-[#0B6BCB]/30"
      />
      {help && (
        <p className="mt-1 text-[11.5px] text-foreground/45">{help}</p>
      )}
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  help,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  help?: string;
}) {
  return (
    <label className="mb-4 flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#0B6BCB]"
      />
      <div className="flex flex-col">
        <span className="text-[13px] font-medium text-foreground/85">
          {label}
        </span>
        {help && (
          <span className="text-[11.5px] text-foreground/45">{help}</span>
        )}
      </div>
    </label>
  );
}

function Radios<T extends string>({
  legend,
  help,
  value,
  onChange,
  options,
}: {
  legend: string;
  help?: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <fieldset className="mb-4">
      <legend className="mb-1 text-[13px] font-medium text-foreground/85">
        {legend}
      </legend>
      {help && (
        <p className="mb-2 text-[11.5px] text-foreground/45">{help}</p>
      )}
      <div className="flex flex-col gap-1.5">
        {options.map((opt) => (
          <label key={opt.value} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name={legend}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="h-4 w-4 accent-[#0B6BCB]"
            />
            <span className="text-[13px] text-foreground/85">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* ── Footer ─────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="flex h-9 shrink-0 items-center justify-center gap-2 border-t border-black/[0.05] bg-[#EEF1F5] text-[11.5px] text-foreground/55">
      <span>© 2026</span>
      {["Support", "Terms", "Privacy", "Status", "Cookies"].map((l) => (
        <span key={l} className="flex items-center gap-2">
          <span className="text-foreground/25">|</span>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground/75">
            {l}
          </a>
        </span>
      ))}
    </footer>
  );
}

/* ── Block metadata + utilities ─────────────────────────────────── */

const BLOCK_META: Record<BlockKind, { label: string; icon: React.ReactNode }> = {
  html: { label: "HTML/Text Block", icon: <span className="font-mono text-[10px]">&lt;/&gt;</span> },
  hero: { label: "Hero Image", icon: <ImageIconStub /> },
  "catalog-tiles": {
    label: "Catalog Tiles",
    icon: <GraduationCap className="h-3.5 w-3.5" strokeWidth={2} />,
  },
  announcement: { label: "Announcement Bar", icon: <span>📢</span> },
  "in-progress-courses": {
    label: "In-Progress Courses",
    icon: <GraduationCap className="h-3.5 w-3.5" strokeWidth={2} />,
  },
  "recommended-content": {
    label: "Recommended Content",
    icon: <Compass className="h-3.5 w-3.5" strokeWidth={2} />,
  },
};

function cryptoId() {
  return Math.random().toString(36).slice(2, 10);
}
