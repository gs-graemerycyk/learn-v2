"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronLeft, GraduationCap, Send, Sparkles, X } from "lucide-react";
import { usePanelScope } from "./widget-context";

// AI Tutor side panel — a chatbot interface that explains a term, sentence,
// or product reference in more detail and offers follow-up questions.
//
// Triggered from the in-body "Explain this?" / "AI Tutor" button. Opens in
// the same right-anchored side panel pattern as cell detail (520px on
// desktop, full-screen on mobile), so the engagement stays in place.

type Sender = "tutor" | "user";

type TutorMessage = {
  id: string;
  sender: Sender;
  body: string;
  followUps?: string[];
};

type TutorContext = {
  // The text the user wanted explained — surfaced at the top of the panel.
  topic: string;
  // The seed explanation — what the tutor says first when the panel opens.
  seedExplanation: string;
  // Initial follow-up suggestions.
  followUps: string[];
};

type TutorPanelContextValue = {
  open: (ctx: TutorContext) => void;
  close: () => void;
  context: TutorContext | null;
};

const TutorPanelContext = createContext<TutorPanelContextValue | null>(null);

export function TutorPanelProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<TutorContext | null>(null);
  const open = useCallback((ctx: TutorContext) => setContext(ctx), []);
  const close = useCallback(() => setContext(null), []);

  return (
    <TutorPanelContext.Provider value={{ open, close, context }}>
      {children}
    </TutorPanelContext.Provider>
  );
}

export function useTutorPanel() {
  const ctx = useContext(TutorPanelContext);
  if (!ctx) throw new Error("useTutorPanel must be used inside <TutorPanelProvider>");
  return ctx;
}

export function TutorPanel() {
  const { context, close } = useTutorPanel();
  const scope = usePanelScope();
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [tutorTyping, setTutorTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset & seed when context changes
  useEffect(() => {
    if (context) {
      setMessages([
        {
          id: "seed",
          sender: "tutor",
          body: context.seedExplanation,
          followUps: context.followUps,
        },
      ]);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [context]);

  useEffect(() => {
    if (!context) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [context]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, tutorTyping]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(close, 280);
  };

  const submit = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: "user", body: t },
    ]);
    setDraft("");
    setTutorTyping(true);

    // Stubbed tutor response with contextual follow-ups
    setTimeout(() => {
      setTutorTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `t-${Date.now()}`,
          sender: "tutor",
          body: stubReply(t),
          followUps: stubFollowUps(t),
        },
      ]);
    }, 900);
  };

  if (!context) return null;

  const isContained = scope === "container";

  return (
    <div
      className={`${isContained ? "absolute" : "fixed"} inset-0 z-[125]`}
      role="dialog"
      aria-modal="true"
      aria-label="AI Tutor"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity"
        style={{ opacity: visible ? 1 : 0, transitionDuration: "260ms" }}
        onClick={handleClose}
      />

      {/* Panel — right slide-out on desktop, full-screen takeover when contained */}
      <div
        data-visible={visible}
        className={[
          "absolute flex flex-col bg-[#FDFEFF] transition-transform ease-out",
          isContained
            ? "inset-0 w-full translate-y-full data-[visible=true]:translate-y-0"
            : [
                "inset-0 w-full",
                "sm:left-auto sm:right-0 sm:top-0 sm:bottom-0 sm:w-[520px] sm:shadow-[-12px_0_40px_-12px_rgba(0,0,0,0.18)]",
                "translate-y-full sm:translate-x-full sm:translate-y-0",
                "data-[visible=true]:translate-y-0 sm:data-[visible=true]:translate-x-0",
              ].join(" "),
        ].join(" ")}
        style={{ transitionDuration: "320ms" }}
      >
        {/* Header */}
        <header className="flex items-start gap-2 border-b border-black/[0.06] px-4 py-3.5 sm:px-5 sm:py-4">
          <button
            onClick={handleClose}
            aria-label="Back"
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-black/55 transition-colors hover:bg-black/[0.05] ${
              isContained ? "" : "sm:hidden"
            }`}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <div
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:inline-flex"
            style={{ backgroundColor: "var(--accent-bg)", color: "var(--accent-strong)" }}
          >
            <GraduationCap className="h-4 w-4" strokeWidth={2.25} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[var(--accent-strong)]">
              AI Tutor
            </div>
            <h2 className="truncate text-[15px] font-semibold leading-tight text-foreground sm:text-[16px]">
              Explaining: <span className="font-medium text-foreground/75">{context.topic}</span>
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
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col gap-3.5">
            {messages.map((m) => (
              <TutorMessageRow key={m.id} message={m} onFollowUp={submit} />
            ))}
            {tutorTyping && (
              <div className="flex items-center gap-2 text-[12px] text-foreground/50">
                <Sparkles
                  className="h-3 w-3 animate-pulse"
                  style={{ color: "var(--accent-strong)" }}
                  strokeWidth={2.25}
                />
                Tutor is thinking…
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(draft);
          }}
          className="flex items-center gap-2 border-t border-black/[0.07] px-3 py-2.5"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask a follow-up question…"
            className="flex-1 bg-transparent px-2 text-[13.5px] text-foreground outline-none placeholder:text-black/35"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent-strong)] text-white transition-opacity disabled:opacity-30"
          >
            <Send className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </form>
      </div>
    </div>
  );
}

function TutorMessageRow({
  message,
  onFollowUp,
}: {
  message: TutorMessage;
  onFollowUp: (text: string) => void;
}) {
  const isUser = message.sender === "user";
  return (
    <div className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-[1.55] ${
          isUser
            ? "bg-[var(--accent-strong)] text-white"
            : "bg-black/[0.04] text-foreground/90"
        }`}
      >
        {message.body}
      </div>
      {message.followUps && message.followUps.length > 0 && !isUser && (
        <div className="flex flex-wrap gap-1.5">
          {message.followUps.map((f) => (
            <button
              key={f}
              onClick={() => onFollowUp(f)}
              className="rounded-full border border-[var(--accent-strong)]/25 bg-white px-2.5 py-1 text-[11.5px] font-medium text-[var(--accent-strong)] transition-colors hover:bg-[var(--accent-bg)]"
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Stubbed tutor logic — production would call an LLM with the page and topic
// as context. The replies below are general enough to feel coherent across
// the demo's questions.

function stubReply(_question: string): string {
  return (
    "Good question. The short version: this is one of those decisions where the right answer depends on the shape of your community more than on the platform itself. Here's a way to think about it — and a worked example from a team in your tier."
  );
}

function stubFollowUps(_question: string): string[] {
  return [
    "Show me a worked example",
    "What would change if our team is smaller?",
    "How does this affect the migration timeline?",
  ];
}
