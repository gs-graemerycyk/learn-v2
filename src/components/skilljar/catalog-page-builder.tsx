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
import { Palette, Settings, X, GraduationCap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type BlockKind =
  | "html"
  | "hero"
  | "catalog-tiles"
  | "announcement"
  | "in-progress-courses"
  | "for-you-feed";

interface PlacedBlock {
  id: string;
  kind: BlockKind;
  sectionHeader: string;
  // For You + In-Progress specific knobs (we only configure these two)
  includeProfileLink?: boolean;
  includeResumptions?: boolean;
  showReasoning?: boolean;
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

  const openAddContent = () => setDrawer({ kind: "add-content" });
  const closeDrawer = () => setDrawer({ kind: "closed" });
  const openConfig = (block: BlockKind) => setDrawer({ kind: "config", block });

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
          {placed.length === 0 ? (
            <EmptyCanvas onAdd={openAddContent} />
          ) : (
            <PlacedCanvas blocks={placed} onAdd={openAddContent} />
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
            {drawer.kind === "config" && drawer.block === "for-you-feed" && (
              <ForYouFeedConfigDrawer onClose={closeDrawer} onAdd={handleAdd} />
            )}
            {drawer.kind === "config" &&
              drawer.block !== "in-progress-courses" &&
              drawer.block !== "for-you-feed" && (
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
  onAdd,
}: {
  blocks: PlacedBlock[];
  onAdd: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      {blocks.map((b) => (
        <PlacedBlockCard key={b.id} block={b} />
      ))}
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

function PlacedBlockCard({ block }: { block: PlacedBlock }) {
  const meta = BLOCK_META[block.kind];
  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#F7F8FA] px-3 py-2 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-foreground/55">
        {meta.icon}
        {meta.label}
        {block.kind === "for-you-feed" && (
          <span className="rounded-full bg-[#0B6BCB] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
            New
          </span>
        )}
      </div>
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
    </div>
  );
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
            label="For You Feed"
            badge="NEW"
            preview={<ForYouPreview />}
            onClick={() => onPick("for-you-feed")}
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

function ForYouPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 rounded bg-white p-2">
      <span className="flex items-center gap-1">
        <Sparkles className="h-2 w-2 text-[#0B6BCB]" strokeWidth={2.5} />
        <span className="h-1 w-10 rounded bg-[#0B6BCB]/70" />
      </span>
      <div className="grid grid-cols-3 gap-1">
        <span className="h-5 rounded bg-gradient-to-br from-violet-200 to-indigo-200" />
        <span className="h-5 rounded bg-gradient-to-br from-amber-100 to-rose-200" />
        <span className="h-5 rounded bg-gradient-to-br from-emerald-100 to-sky-200" />
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

function ForYouFeedConfigDrawer({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (b: PlacedBlock) => void;
}) {
  const [header, setHeader] = useState("For you");
  const [description, setDescription] = useState(
    "Picked up where you left off, plus fresh picks from the community and academy."
  );
  const [includeResumptions, setIncludeResumptions] = useState(true);
  const [showReasoning, setShowReasoning] = useState(false);
  const [maxTiles, setMaxTiles] = useState(8);
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left");

  return (
    <>
      <DrawerHeader
        title="Add For You Feed"
        subtitle="A personalised carousel of recommendations across courses, articles, questions, ideas, events, and product updates. Resumptions pin to the front."
        onClose={onClose}
      />
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mb-4 flex items-center gap-2 rounded-md border border-[#0B6BCB]/30 bg-[#EAF2FB] px-3 py-2 text-[12px] text-[#0B6BCB]">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
          <span>
            <strong>NEW.</strong> Powered by the DCH recommendations engine.
            Content is ranked per student.
          </span>
        </div>

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
          checked={includeResumptions}
          onChange={setIncludeResumptions}
          label="Pin in-progress content to the front"
          help="Surfaces the student's most recent in-progress course or lesson before recommendations. Disable if you already render an In-Progress Courses block above."
        />
        <Checkbox
          checked={showReasoning}
          onChange={setShowReasoning}
          label="Show personalised reasoning chips"
          help='Adds a small "Because you completed X" caption to each card. Recommended for new students; turn off once they’re familiar with the surface.'
        />

        <NumberField
          label="Maximum number of catalog tiles"
          value={maxTiles}
          onChange={setMaxTiles}
          help="If the student has no recommendations yet, this content block will be hidden."
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
            kind: "for-you-feed",
            sectionHeader: header || "For you",
            includeResumptions,
            showReasoning,
            maxTiles,
            alignment,
          })
        }
      />
    </>
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
  "for-you-feed": {
    label: "For You Feed",
    icon: <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />,
  },
};

function cryptoId() {
  return Math.random().toString(36).slice(2, 10);
}
