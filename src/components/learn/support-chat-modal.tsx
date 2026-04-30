"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ChevronLeft, Headset, Send, Sparkles, X } from "lucide-react";
import { usePanelScope } from "./widget-context";

// Forethought-powered Support chat modal.
// One of the four query-intent outcomes (Classic Search, Short Answer, Long
// Answer, Support Escalation) — also surfaced inside the Long Answer via the
// "Talk to support" affordance in the closing block.
//
// This is a stub UI: messages are pre-canned, but the shell mirrors how a
// real Forethought conversation would appear when embedded.

type Sender = "user" | "agent" | "system";

type Message = {
  id: string;
  sender: Sender;
  body: string;
  // Optional follow-up suggestions presented as clickable chips.
  followUps?: string[];
};

const SEED_MESSAGES: Message[] = [
  {
    id: "m1",
    sender: "system",
    body: "Connected to Gainsight Support · powered by Forethought",
  },
  {
    id: "m2",
    sender: "agent",
    body:
      "Hi — I'm an AI agent on the Gainsight Support team. I can see you came from a Long Answer about the Khoros migration. What would you like a person to look at?",
    followUps: [
      "Walk through my Khoros URL structure",
      "Help estimate my migration timeline",
      "I have a question about gamification migration",
      "Connect me with my CSM",
    ],
  },
];

type SupportChatContextValue = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const SupportChatContext = createContext<SupportChatContextValue | null>(null);

export function SupportChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <SupportChatContext.Provider value={{ open, close, isOpen }}>
      {children}
      <SupportChatModal />
    </SupportChatContext.Provider>
  );
}

export function useSupportChat() {
  const ctx = useContext(SupportChatContext);
  if (!ctx) throw new Error("useSupportChat must be used inside <SupportChatProvider>");
  return ctx;
}

function SupportChatModal() {
  const { isOpen, close } = useSupportChat();
  const scope = usePanelScope();
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [draft, setDraft] = useState("");
  const [agentTyping, setAgentTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => setVisible(true));
    else setVisible(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    // Auto-scroll on new message
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, agentTyping]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(close, 220);
  };

  const submit = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: "user", body: t },
    ]);
    setDraft("");
    setAgentTyping(true);

    // Stubbed agent response
    setTimeout(() => {
      setAgentTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: "agent",
          body:
            "Thanks — I've routed this to the migration team and looped in your CSM. Someone will reply in this thread within one business day. In the meantime, want me to send the URL inventory template?",
          followUps: [
            "Yes, send the URL inventory template",
            "What's the expected response time?",
          ],
        },
      ]);
    }, 1100);
  };

  if (!isOpen) return null;

  const isContained = scope === "container";

  return (
    <div
      className={`${isContained ? "absolute" : "fixed"} inset-0 z-[130]`}
      role="dialog"
      aria-modal="true"
      aria-label="Support chat"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity"
        style={{ opacity: visible ? 1 : 0, transitionDuration: "260ms" }}
        onClick={handleClose}
      />

      <div
        data-visible={visible}
        className={[
          "absolute flex flex-col bg-[#FDFEFF] transition-transform ease-out",
          isContained
            ? "inset-0 w-full translate-y-full data-[visible=true]:translate-y-0"
            : [
                "inset-0 w-full",
                "sm:left-auto sm:right-0 sm:top-0 sm:bottom-0 sm:w-[480px] sm:shadow-[-12px_0_40px_-12px_rgba(0,0,0,0.18)]",
                "translate-y-full sm:translate-x-full sm:translate-y-0",
                "data-[visible=true]:translate-y-0 sm:data-[visible=true]:translate-x-0",
              ].join(" "),
        ].join(" ")}
        style={{ transitionDuration: "320ms" }}
      >
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-black/[0.07] px-4 py-3.5 sm:px-5">
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
            <Headset className="h-4 w-4" strokeWidth={2.25} />
          </div>
          <div className="min-w-0 flex-1 flex flex-col leading-[1.1]">
            <span className="text-[14px] font-semibold text-foreground">Gainsight Support</span>
            <span className="text-[10.5px] font-medium text-foreground/55">
              Powered by Forethought · usually replies in &lt; 1 business day
            </span>
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
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <MessageRow key={m.id} message={m} onFollowUp={submit} />
            ))}
            {agentTyping && (
              <div className="flex items-center gap-2 text-[12px] text-foreground/50">
                <Sparkles
                  className="h-3 w-3 animate-pulse"
                  style={{ color: "var(--accent-strong)" }}
                  strokeWidth={2.25}
                />
                Forethought is typing…
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
            placeholder="Type your message…"
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

        {/* Powered-by footer (compliance with Forethought brand surfacing) */}
        <div className="flex items-center justify-center gap-1 border-t border-black/[0.05] py-1.5 text-[10px] text-foreground/45">
          Powered by
          <span className="font-semibold text-foreground/60">Forethought</span>
        </div>
      </div>
    </div>
  );
}

function MessageRow({
  message,
  onFollowUp,
}: {
  message: Message;
  onFollowUp: (text: string) => void;
}) {
  if (message.sender === "system") {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-black/[0.04] px-2.5 py-0.5 text-[10.5px] text-foreground/55">
          {message.body}
        </span>
      </div>
    );
  }

  const isUser = message.sender === "user";

  return (
    <div className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-[1.5] ${
          isUser
            ? "bg-[var(--accent-strong)] text-white"
            : "bg-black/[0.04] text-foreground/85"
        }`}
      >
        {message.body}
      </div>
      {message.followUps && message.followUps.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {message.followUps.map((f) => (
            <button
              key={f}
              onClick={() => onFollowUp(f)}
              className="rounded-full border border-[var(--accent-strong)]/20 bg-white px-2.5 py-1 text-[11.5px] font-medium text-[var(--accent-strong)] transition-colors hover:bg-[var(--accent-bg)]"
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
