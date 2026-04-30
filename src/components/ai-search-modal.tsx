"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  ArrowUp,
  Sparkles,
  Database,
  LayoutGrid,
  Zap,
  Globe,
  Shield,
  GitBranch,
  BookOpen,
  Code,
  Headset,
  MessageSquareText,
} from "lucide-react";
import { useSearch } from "./search-context";

/* ── Query suggestions — curated, brand-relevant, with unique icons ── */

type QueryIntent = "long" | "short" | "classic" | "support" | "ai-answer";

interface QuerySuggestion {
  text: string;
  icon: typeof Zap;
  // Each suggestion can be flagged with the intent the search system would
  // route it to — useful for demoing the four query-intent outcomes from
  // a single entry point. Unset suggestions default to "long" (AI Answers).
  intent?: QueryIntent;
}

const curatedSuggestions: QuerySuggestion[] = [
  { text: "How do I migrate from Khoros to Gainsight Community?", icon: GitBranch, intent: "long" },
  { text: "What email format do migration exports need?", icon: Database, intent: "short" },
  { text: "Why is my Khoros migration export failing?", icon: MessageSquareText, intent: "ai-answer" },
  { text: "I need a refund — can someone from support help?", icon: Headset, intent: "support" },
  { text: "Setting up OAuth 2.0 webhooks", icon: Code },
  { text: "Automation workflows for recurring tasks", icon: Zap },
  { text: "Building a public product roadmap", icon: Globe },
  { text: "Linked databases with rollups explained", icon: Database },
  { text: "How to embed Orbit pages externally", icon: BookOpen },
  { text: "Team permissions and access control", icon: Shield },
];

interface DynamicSuggestion {
  text: string;
  icon: typeof Zap;
}

const dynamicSuggestions: DynamicSuggestion[] = [
  { text: "How to create a linked database view", icon: Database },
  { text: "How to set up Slack notifications", icon: Zap },
  { text: "How to build a company wiki in Orbit", icon: BookOpen },
  { text: "How to import data from spreadsheets", icon: Database },
  { text: "Best templates for sprint planning", icon: LayoutGrid },
  { text: "Best templates for OKR tracking", icon: LayoutGrid },
  { text: "Best way to organize a knowledge base", icon: BookOpen },
  { text: "Building custom dashboards with formulas", icon: Database },
  { text: "Building automation chains with conditions", icon: Zap },
  { text: "Setting up cross-database relations", icon: Database },
  { text: "Setting up team onboarding workflows", icon: Zap },
  { text: "Automation recipes for project management", icon: Zap },
  { text: "Automation triggers for status changes", icon: Zap },
  { text: "Migrate from Monday.com to Orbit", icon: GitBranch },
  { text: "Migrate from Asana to Orbit", icon: GitBranch },
  { text: "Public vs private roadmaps — what works", icon: Globe },
  { text: "Webhook integration with GitHub", icon: Code },
  { text: "OAuth 2.0 setup guide for enterprise", icon: Shield },
  { text: "Rollup formulas for sprint velocity", icon: Database },
  { text: "Template gallery — community favorites", icon: LayoutGrid },
  { text: "API rate limits and batch operations", icon: Code },
  { text: "Permissions model for large organizations", icon: Shield },
  { text: "Content calendar template setup", icon: LayoutGrid },
  { text: "Embedding Orbit widgets in external sites", icon: Globe },
];

/* ── Filter suggestions based on query ── */

function getFilteredSuggestions(query: string): DynamicSuggestion[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);

  return dynamicSuggestions
    .filter((s) => {
      const text = s.text.toLowerCase();
      return words.every((word) => text.includes(word));
    })
    .slice(0, 6);
}

/* ── Highlight matching text ── */

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const regex = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        words.some((w) => part.toLowerCase() === w) ? (
          <span key={i} className="text-foreground font-semibold">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/* ── Intent badge — shows where a suggestion will route ── */

const INTENT_LABEL: Record<QueryIntent, string> = {
  long: "AI Answer",
  short: "Short answer",
  "ai-answer": "AI Answer (compact)",
  classic: "Classic search",
  support: "Community Agent",
};

function IntentBadge({ intent }: { intent: QueryIntent }) {
  return (
    <span
      className="shrink-0 rounded-full bg-[var(--accent-bg)] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--accent-strong)]"
      title={`This query routes to ${INTENT_LABEL[intent]}`}
    >
      {INTENT_LABEL[intent]}
    </span>
  );
}

/* ── Modal ── */

export function AISearchModal() {
  const { isModalOpen, closeModal, pendingQuery, clearPendingQuery } = useSearch();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const isTyping = query.trim().length > 0;
  const filteredSuggestions = getFilteredSuggestions(query);
  const showDynamic = isTyping && filteredSuggestions.length > 0;

  useEffect(() => {
    if (isModalOpen) {
      setIsVisible(true);
      if (pendingQuery) {
        setQuery(pendingQuery);
        clearPendingQuery();
      }
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setIsVisible(false);
    }
  }, [isModalOpen, pendingQuery, clearPendingQuery]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isModalOpen) {
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [isModalOpen]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isModalOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      closeModal();
      setQuery("");
      setSelectedIndex(-1);
    }, 250);
  }, [closeModal]);

  // Map a query intent to its destination route. The default — and what the
  // user gets for any free-typed query — is the AI Answers (long) page.
  // Support routes to the Forethought demo; "ai-answer" routes to the
  // compact AI Answers layout.
  const routeForIntent = (intent?: QueryIntent): string => {
    switch (intent) {
      case "short":
        return "/answer";
      case "ai-answer":
        return "/ai-answer";
      case "classic":
        return "/search";
      case "support":
        return "/forethought";
      case "long":
      default:
        return "/learn";
    }
  };

  const handleSubmit = useCallback(
    (submittedQuery?: string, intent?: QueryIntent) => {
      const q = (submittedQuery || query).trim();
      if (!q) return;
      const route = routeForIntent(intent);
      // The Forethought page reads ?scenario=&mode= rather than ?q=, so
      // route there with a sensible default scenario instead of the query.
      const url =
        intent === "support"
          ? `${route}?scenario=refund&mode=forethought`
          : `${route}?q=${encodeURIComponent(q)}`;
      router.push(url);
      handleClose();
    },
    [query, handleClose, router]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string, intent?: QueryIntent) => {
      setQuery(suggestion);
      handleSubmit(suggestion, intent);
    },
    [handleSubmit]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const items = showDynamic ? filteredSuggestions : curatedSuggestions;
      const maxIndex = items.length - 1;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex <= maxIndex) {
          const item = items[selectedIndex];
          // Curated suggestions can carry an intent; dynamic ones don't.
          const intent =
            "intent" in item ? (item as QuerySuggestion).intent : undefined;
          handleSuggestionClick(item.text, intent);
        } else {
          handleSubmit();
        }
      }
    },
    [showDynamic, filteredSuggestions, selectedIndex, handleSuggestionClick, handleSubmit]
  );

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Modal — large, spacious, fixed height */}
      <div
        className="relative flex flex-col w-full max-w-[880px] rounded-[28px] bg-[#FDFEFF] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out overflow-hidden"
        style={{
          height: "min(82vh, 720px)",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
        }}
      >
        {/* ─── Input area ─── */}
        <div className="shrink-0 bg-white">
          <div className="px-8 pt-7 pb-5">
            <div className="flex items-start gap-3.5">
              <div className="mt-1 shrink-0">
                <Sparkles className="h-[20px] w-[20px] text-black/20" strokeWidth={1.75} />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-[20px] text-foreground font-medium outline-none placeholder:text-black/25 placeholder:font-normal leading-[1.5]"
                placeholder="Ask anything about Orbit..."
              />
              <button
                onClick={() => handleSubmit()}
                disabled={!query.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-all duration-150 hover:opacity-80 disabled:opacity-[0.08] disabled:cursor-default"
              >
                <ArrowUp className="h-[16px] w-[16px]" strokeWidth={2} />
              </button>
            </div>
          </div>
          <div className="h-px bg-black/[0.06]" />
        </div>

        {/* ─── Suggestions area — scrollable, fills remaining space ─── */}
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {!isTyping ? (
            /* ── Default state: curated suggestions ── */
            <div className="pt-6 pb-8">
              <h2 className="text-[15px] font-medium text-black/30 mb-2 px-8">
                Popular right now
              </h2>
              <div className="flex flex-col">
                {curatedSuggestions.map((suggestion, i) => {
                  const Icon = suggestion.icon;
                  return (
                    <button
                      key={suggestion.text}
                      onClick={() => handleSuggestionClick(suggestion.text, suggestion.intent)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      onMouseLeave={() => setSelectedIndex(-1)}
                      className={`group w-full flex items-center gap-4 px-5 py-4 text-left transition-all duration-150 ${
                        selectedIndex === i
                          ? "bg-black/[0.03]"
                          : ""
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 transition-colors duration-150 ${
                          selectedIndex === i
                            ? "bg-black/[0.06]"
                            : "bg-black/[0.03]"
                        }`}
                      >
                        <Icon
                          className={`h-[17px] w-[17px] transition-colors duration-150 ${
                            selectedIndex === i ? "text-black/50" : "text-black/25"
                          }`}
                          strokeWidth={1.75}
                        />
                      </div>
                      <span
                        className={`flex-1 text-[17px] leading-snug transition-colors duration-150 ${
                          selectedIndex === i
                            ? "text-foreground"
                            : "text-black/50"
                        }`}
                      >
                        {suggestion.text}
                      </span>
                      {suggestion.intent && (
                        <IntentBadge intent={suggestion.intent} />
                      )}
                      <ArrowRight
                        className={`h-4 w-4 shrink-0 transition-all duration-150 ${
                          selectedIndex === i
                            ? "opacity-100 translate-x-0 text-black/25"
                            : "opacity-0 -translate-x-2"
                        }`}
                        strokeWidth={1.75}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : showDynamic ? (
            /* ── Typing state: filtered suggestions ── */
            <div className="pt-6 pb-8">
              <h2 className="text-[15px] font-medium text-black/30 mb-2 px-8">
                Suggestions
              </h2>
              <div className="flex flex-col">
                {filteredSuggestions.map((suggestion, i) => {
                  const Icon = suggestion.icon;
                  return (
                    <button
                      key={suggestion.text}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      onMouseLeave={() => setSelectedIndex(-1)}
                      className={`group w-full flex items-center gap-4 px-4 py-4 -mx-4 rounded-2xl text-left transition-all duration-150 ${
                        selectedIndex === i
                          ? "bg-black/[0.03]"
                          : ""
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 transition-colors duration-150 ${
                          selectedIndex === i
                            ? "bg-black/[0.06]"
                            : "bg-black/[0.03]"
                        }`}
                      >
                        <Icon
                          className={`h-[17px] w-[17px] transition-colors duration-150 ${
                            selectedIndex === i ? "text-black/50" : "text-black/25"
                          }`}
                          strokeWidth={1.75}
                        />
                      </div>
                      <span
                        className={`flex-1 text-[17px] leading-snug transition-colors duration-150 ${
                          selectedIndex === i
                            ? "text-foreground"
                            : "text-black/50"
                        }`}
                      >
                        <HighlightedText text={suggestion.text} query={query} />
                      </span>
                      <ArrowRight
                        className={`h-4 w-4 shrink-0 transition-all duration-150 ${
                          selectedIndex === i
                            ? "opacity-100 translate-x-0 text-black/25"
                            : "opacity-0 -translate-x-2"
                        }`}
                        strokeWidth={1.75}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── Typing but no matches — spacious empty state ── */
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
              <Sparkles className="h-6 w-6 text-black/10" strokeWidth={1.5} />
              <p className="text-[15px] text-black/30">
                Press <span className="font-medium text-black/45">Enter</span> to search for &ldquo;{query.trim()}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
