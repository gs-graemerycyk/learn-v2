"use client";

import { ArrowRight, Headset } from "lucide-react";
import { useCreateTopic } from "../create-topic-context";
import { useSupportChat } from "./support-chat-modal";
import { useWidgetMode } from "./widget-context";

// The closing block sits at the end of the AI Answer. It carries the
// CSM-voice sign-off and two next-step affordances:
//   1. Ask in the community — the primary social path forward
//   2. Talk to support — the support-escalation outcome of the search-intent
//      system, surfaced inside the AI Answer for moments where the answer
//      didn't fully land. Opens the Forethought-powered chat modal.

export function LearnClosing({
  closing,
  query,
}: {
  closing: string;
  query?: string;
}) {
  const { open: openSupport } = useSupportChat();
  const { openFromAnswer } = useCreateTopic();
  const mode = useWidgetMode();
  const interactive = mode !== "builder";

  const handleAsk = () => {
    // openFromAnswer pre-fills the topic with context from the user's
    // query and dismisses cleanly on close — no return-to-search flow,
    // since the user came from an AI Answer rather than the search modal.
    openFromAnswer(query ?? "");
  };

  return (
    <footer className="flex flex-col gap-3 rounded-2xl border border-[var(--accent-soft)] bg-[var(--accent-bg)] p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--accent-strong)]">
        Need more help?
      </div>
      <p className="max-w-[60ch] text-[14px] leading-[1.55] text-foreground/80">
        {closing}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <button
          disabled={!interactive}
          onClick={interactive ? handleAsk : undefined}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-strong)] px-3 py-1.5 text-[12.5px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:hover:opacity-60"
        >
          Ask in the community
          <ArrowRight className="h-3 w-3" strokeWidth={2.25} />
        </button>
        <button
          disabled={!interactive}
          onClick={interactive ? openSupport : undefined}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-strong)]/25 bg-white px-3 py-1.5 text-[12.5px] font-medium text-[var(--accent-strong)] transition-colors hover:bg-white/70 disabled:opacity-60 disabled:hover:bg-white"
        >
          <Headset className="h-3 w-3" strokeWidth={2.25} />
          Talk to support
        </button>
      </div>
    </footer>
  );
}
