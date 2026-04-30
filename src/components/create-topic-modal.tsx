"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  X,
  ChevronLeft,
  Sparkles,
  Calendar,
  Upload,
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
} from "lucide-react";
import { useCreateTopic } from "./create-topic-context";
import { useSearch } from "./search-context";
import { usePanelScope } from "./learn/widget-context";

/* ── Content types ── */

const contentTypes = [
  { id: "questions", label: "Questions" },
  { id: "discussions", label: "Discussions" },
  { id: "ideas", label: "Ideas" },
  { id: "product-update", label: "Product Update" },
  { id: "bugs", label: "Bugs" },
];

const categories = [
  "Getting started",
  "Databases",
  "Automations",
  "Templates",
  "API & Integrations",
  "Feature requests",
  "General",
];

/* ── Demo content generator ── */

function generateDemoContent(aiQuery: string | null): { title: string; body: string } {
  if (aiQuery) {
    const templates: Record<string, { title: string; body: string }> = {
      "Slack vs. email automations": {
        title: "Choosing between Slack and email for our team automations",
        body: "After researching the community discussions on Slack vs. email automations, I wanted to share our team's experience and get your input.\n\nWe're currently using email notifications for all automated workflows, but several community members have reported 50–70% faster response times after switching to Slack triggers.\n\nOur specific use case:\n• 15-person product team\n• ~40 automated workflows per week\n• Mix of internal updates and external notifications\n\nHas anyone made this transition with a similar team size? What were the biggest challenges during migration?",
      },
      "Public roadmaps — yes or no?": {
        title: "Should we make our product roadmap public? Weighing the pros and cons",
        body: "Based on the community conversation about public roadmaps, I'm considering making ours visible to customers. The community seems split — transparency builds trust, but it can also set expectations we can't always meet.\n\nWe're a B2B SaaS with ~200 customers. Some questions:\n\n1. For those with public roadmaps — how do you handle scope changes without frustrating users?\n2. Has anyone tried the \"themes only\" approach (no specific dates)?\n3. Does Orbit's roadmap template support a separate public/private view?\n\nWould love to hear from anyone who's navigated this decision.",
      },
    };
    if (templates[aiQuery]) return templates[aiQuery];
    return {
      title: `Follow-up: ${aiQuery}`,
      body: `After exploring this topic through Orbit AI, I'd love to hear the community's perspective.\n\nThe AI search pointed me toward some great resources, but I have a few specific questions that would benefit from real-world experience:\n\n1. What approach has worked best for your team?\n2. Are there any common pitfalls I should watch out for?\n3. Any recommended templates or workflows to get started?\n\nThanks in advance for your insights!`,
    };
  }
  return {
    title: "How we reduced onboarding time by 60% with Orbit templates",
    body: "Our team recently revamped our entire onboarding workflow using linked databases and automation triggers. Here's what we learned:\n\n1. Template-first approach — we created a master onboarding template with 12 linked tasks across 3 databases.\n\n2. Smart automations — new hire added → tasks auto-assigned to relevant team leads with Slack notifications.\n\n3. Progress rollups — managers see real-time completion rates per hire without asking for updates.\n\nThe result: onboarding went from 2 weeks of back-and-forth to a 5-day self-guided process.\n\nHappy to share our template if anyone's interested!",
  };
}

/* ── Main component ── */

export function CreateTopicModal() {
  const { isOpen, mode, aiQuery, crossFade, close } = useCreateTopic();
  const { openModalWithQuery } = useSearch();
  const scope = usePanelScope();
  const isContained = scope === "container";

  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedType, setSelectedType] = useState("questions");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [saved, setSaved] = useState(false);

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Pre-fill content when opening with a query (from search or AI answer)
  useEffect(() => {
    if (isOpen && (mode === "from-search" || mode === "from-answer") && aiQuery) {
      const demo = generateDemoContent(aiQuery);
      setTitle(demo.title);
      setBody(demo.body);
    }
  }, [isOpen, mode, aiQuery]);

  // Open animation — staggered for cross-fade
  useEffect(() => {
    if (isOpen) {
      if (crossFade) {
        // Cross-fade from search: slight delay so search content is fading out
        const t = setTimeout(() => setIsVisible(true), 60);
        return () => clearTimeout(t);
      }
      // Two-step open:
      //   1) double-rAF so the panel renders ONCE in its off-screen state
      //      and the browser paints, then we flip data-visible=true on the
      //      next frame — the CSS transition has a real "from" frame to
      //      animate from.
      //   2) defer the focus call until after the slide-in completes, so
      //      forcing layout on the textarea doesn't interrupt the animation.
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setIsVisible(true));
      });
      const focusTimer = setTimeout(() => {
        if (mode !== "from-search") {
          titleRef.current?.focus({ preventScroll: true });
        }
      }, 360);
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
        clearTimeout(focusTimer);
      };
    } else {
      setIsVisible(false);
    }
  }, [isOpen, crossFade, mode]);

  // Auto-save simulation
  useEffect(() => {
    if (!title && !body) { setSaved(false); return; }
    setSaved(false);
    const t = setTimeout(() => setSaved(true), 1500);
    return () => clearTimeout(t);
  }, [title, body]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [isOpen]);

  const resetState = useCallback(() => {
    setTitle("");
    setBody("");
    setSelectedType("questions");
    setSelectedCategory("");
    setTags([]);
    setTagInput("");
    setSaved(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      close();
      resetState();
    }, 280);
  }, [close, resetState]);

  const handleBack = useCallback(() => {
    // Cross-fade back: fade out create topic → open search with query
    const q = aiQuery;
    setIsVisible(false);
    setTimeout(() => {
      close();
      resetState();
      if (q) {
        setTimeout(() => openModalWithQuery(q), 60);
      }
    }, 200);
  }, [close, resetState, aiQuery, openModalWithQuery]);

  const handleTryDemo = useCallback(() => {
    const demo = generateDemoContent(mode === "from-search" ? aiQuery : null);
    setTitle(demo.title);
    setBody(demo.body);
    requestAnimationFrame(() => {
      if (titleRef.current) {
        titleRef.current.style.height = "auto";
        titleRef.current.style.height = titleRef.current.scrollHeight + "px";
      }
      if (bodyRef.current) {
        bodyRef.current.style.height = "auto";
        bodyRef.current.style.height = bodyRef.current.scrollHeight + "px";
      }
    });
  }, [mode, aiQuery]);

  const handleAddTag = useCallback(() => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags((prev) => [...prev, tag]);
      setTagInput("");
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const autoResize = (el: HTMLTextAreaElement, maxH?: number) => {
    el.style.height = "auto";
    el.style.height = (maxH ? Math.min(el.scrollHeight, maxH) : el.scrollHeight) + "px";
  };

  if (!isOpen) return null;

  return (
    <div
      className={`${isContained ? "absolute" : "fixed"} inset-0 z-[110]`}
      role="dialog"
      aria-modal="true"
      aria-label="Create new topic"
    >
      {/* Backdrop — instant if cross-fading from search (backdrop already visible) */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        style={{
          opacity: crossFade ? 1 : isVisible ? 1 : 0,
          transition: crossFade ? "none" : "opacity 280ms ease",
        }}
        onClick={handleClose}
      />

      {/* Slide-out panel — desktop: right anchored 540px; mobile/in-app:
          full-screen takeover sliding up from the bottom. Same pattern as
          cell detail / AI Tutor / Support. Transform driven via inline
          style so the open/close direction is deterministic per scope. */}
      <div
        className={[
          "absolute flex flex-col bg-white transition-transform ease-out",
          isContained
            ? "inset-0 w-full"
            : [
                "inset-0 w-full",
                "sm:left-auto sm:right-0 sm:top-0 sm:bottom-0 sm:w-[540px] sm:shadow-[-12px_0_40px_-12px_rgba(0,0,0,0.18)]",
              ].join(" "),
        ].join(" ")}
        style={{
          transitionDuration: "320ms",
          // Off-screen: contained slides up from the bottom; viewport scope
          // slides up on mobile and in from the right on desktop. We use a
          // matchMedia check so the right-slide kicks in at >= sm.
          transform: isVisible
            ? "translate(0, 0)"
            : isContained
              ? "translate(0, 100%)"
              : typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches
                ? "translate(100%, 0)"
                : "translate(0, 100%)",
        }}
      >
        {/* ─── Header ─── */}
        <div className="shrink-0 flex items-center gap-2 border-b border-black/[0.06] px-4 py-3 sm:px-5 sm:py-4">
          {mode === "from-search" ? (
            <button
              onClick={handleBack}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-black/55 transition-colors hover:bg-black/[0.05]"
              aria-label="Back to search"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-black/55 transition-colors hover:bg-black/[0.05] sm:hidden"
              aria-label="Back"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
          <h1 className="flex-1 text-[16px] font-semibold text-foreground tracking-[-0.01em] sm:text-[17px]">
            Create new topic
          </h1>
          {mode !== "from-search" && (
            <button
              onClick={handleClose}
              className={`h-8 w-8 shrink-0 items-center justify-center rounded-lg text-black/55 transition-colors hover:bg-black/[0.05] ${
                isContained ? "hidden" : "hidden sm:inline-flex"
              }`}
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* ─── Body — single column, scrollable ─── */}
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
          <div className="flex flex-1 min-h-0 flex-col">
            <div className="flex-1 flex flex-col overflow-y-auto px-4 pt-4 pb-3 min-h-0 sm:px-5">
              {/* Title */}
              <textarea
                ref={titleRef}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  autoResize(e.target);
                }}
                rows={1}
                className="w-full shrink-0 resize-none bg-transparent text-[20px] font-semibold text-foreground tracking-[-0.015em] leading-[1.4] outline-none placeholder:text-black/20 placeholder:font-normal overflow-hidden"
                placeholder="Topic title..."
              />

              {/* Subtle short divider */}
              <div className="my-2.5 shrink-0">
                <div className="h-px bg-black/[0.035] w-[50%]" />
              </div>

              {/* Body — generous min-height so the editor feels roomy */}
              <textarea
                ref={bodyRef}
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  autoResize(e.target);
                }}
                rows={5}
                className="w-full resize-none bg-transparent text-[15px] text-foreground/80 leading-[1.65] outline-none placeholder:text-black/20"
                placeholder="Share your thoughts..."
                style={{ minHeight: 140 }}
              />

              {/* Try demo + draft status */}
              <div className="mt-3 mb-5 flex items-center justify-between">
                <button
                  onClick={handleTryDemo}
                  className="flex items-center gap-1.5 rounded-md border border-black/[0.08] px-2.5 py-1.5 text-[12.5px] font-medium text-black/55 transition-all hover:border-black/[0.14] hover:text-black/75 hover:bg-black/[0.02]"
                >
                  <Sparkles className="h-3 w-3" strokeWidth={1.75} />
                  Try demo content
                </button>

                {(title || body) && (
                  <span className="flex items-center gap-1.5 text-[11.5px] transition-opacity duration-300">
                    {saved ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" strokeWidth={2.5} />
                        <span className="text-emerald-700/70 font-medium">Draft saved</span>
                      </>
                    ) : (
                      <span className="text-black/25">Saving...</span>
                    )}
                  </span>
                )}
              </div>

              {/* Settings — stacked below the editor (was a 310px sidebar
                  in the centered modal; merged inline for the slide-out) */}
              <div className="mb-2 h-px bg-black/[0.06]" />

              <div className="flex flex-col gap-6 pt-1">

              {/* Category */}
              <div>
                <label className="text-[13px] font-medium text-black/50 mb-2.5 block">
                  Category
                </label>
                <div ref={categoryRef} className="relative">
                  <button
                    onClick={() => setCategoryOpen(!categoryOpen)}
                    className="flex w-full items-center justify-between rounded-[10px] border border-black/[0.08] bg-white px-3.5 py-2.5 text-[14px] transition-all hover:border-black/[0.14]"
                  >
                    <span className={selectedCategory ? "text-foreground" : "text-black/30"}>
                      {selectedCategory || "Select a category"}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-black/30" strokeWidth={1.75} />
                  </button>
                  {categoryOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 rounded-[12px] border border-black/[0.08] bg-white shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] py-1.5 z-10">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setCategoryOpen(false);
                          }}
                          className="flex w-full items-center px-3.5 py-2 text-[14px] text-foreground/80 hover:bg-black/[0.03] transition-colors"
                        >
                          {cat}
                          {selectedCategory === cat && (
                            <Check className="h-3.5 w-3.5 text-foreground ml-auto" strokeWidth={2} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Content type */}
              <div>
                <label className="text-[13px] font-medium text-black/50 mb-2.5 block">
                  Content type
                </label>
                <div className="flex flex-wrap gap-2">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`rounded-[8px] border px-3 py-1.5 text-[13px] font-medium transition-all ${
                        selectedType === type.id
                          ? "border-foreground bg-foreground text-background"
                          : "border-black/[0.08] text-black/50 hover:border-black/[0.14] hover:text-black/65"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Public tags */}
              <div>
                <button
                  onClick={() => setTagsOpen(!tagsOpen)}
                  className="flex w-full items-center justify-between mb-2.5"
                >
                  <span className="text-[13px] font-medium text-black/50">
                    Public tags
                    <span className="ml-1.5 text-black/25">{tags.length}</span>
                  </span>
                  {tagsOpen ? (
                    <ChevronUp className="h-3.5 w-3.5 text-black/30" strokeWidth={1.75} />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-black/30" strokeWidth={1.75} />
                  )}
                </button>
                {tagsOpen && (
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="flex-1 rounded-[10px] border border-black/[0.08] bg-white px-3.5 py-2 text-[14px] outline-none placeholder:text-black/25 transition-all focus:border-black/[0.14]"
                        placeholder="Add a tag..."
                      />
                      <button
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-foreground text-background transition-all hover:opacity-80 disabled:opacity-[0.12] disabled:cursor-default"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full bg-black/[0.04] px-2.5 py-1 text-[13px] font-medium text-black/50"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-0.5 text-black/25 hover:text-black/50 transition-colors"
                            >
                              <X className="h-3 w-3" strokeWidth={2} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cover image */}
              <div>
                <label className="text-[13px] font-medium text-black/50 mb-2.5 block">
                  Cover image
                  <span className="font-normal text-black/25 ml-1">(optional)</span>
                </label>
                <div className="flex flex-col items-center justify-center rounded-[12px] border-2 border-dashed border-black/[0.08] bg-white px-4 py-8 transition-all hover:border-black/[0.14] hover:bg-black/[0.01] cursor-pointer">
                  <Upload className="h-5 w-5 text-black/20 mb-2.5" strokeWidth={1.75} />
                  <span className="text-[13px] text-black/35 text-center">
                    Drop an image or click to upload
                  </span>
                  <span className="text-[12px] text-black/20 mt-1">
                    Recommended: 1200×630px
                  </span>
                </div>
              </div>

              </div>
              {/* /settings wrapper */}
            </div>
            {/* /scroll area */}
          </div>
          {/* /column wrapper */}
        </div>
        {/* /body wrapper */}

        {/* ─── Footer — equal padding all sides ─── */}
        <div className="shrink-0 border-t border-black/[0.06] bg-white">
          <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
            <button
              onClick={handleClose}
              className="text-[13.5px] font-medium text-black/45 transition-all hover:text-black/65"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-md border border-black/[0.08] px-2.5 py-1.5 text-[12.5px] font-medium text-black/55 transition-all hover:border-black/[0.14] hover:text-black/75 hover:bg-black/[0.02]">
                <Calendar className="h-3 w-3" strokeWidth={1.75} />
                Schedule
              </button>
              <button
                disabled={!title.trim()}
                className="rounded-md bg-foreground px-4 py-1.5 text-[13px] font-medium text-background transition-all hover:opacity-85 disabled:opacity-[0.15] disabled:cursor-default"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
