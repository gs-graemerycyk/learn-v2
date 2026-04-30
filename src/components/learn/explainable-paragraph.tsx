"use client";

import { GraduationCap } from "lucide-react";
import { useTutorPanel } from "./tutor-panel";
import { useWidgetMode } from "./widget-context";

// Wraps a body paragraph and shows an "AI Tutor / Explain this?" affordance
// on hover. Clicking opens the AI Tutor side panel where the user can have
// a deeper chatbot-style conversation about the concept, with follow-up
// questions surfaced as chips.
//
// The `explain` prop is the seed explanation the tutor opens with, drawn
// from the personalization service. Production would also pass document
// context so the tutor can ground follow-ups in the surrounding answer.

export function ExplainableParagraph({
  children,
  explain,
  topic,
  followUps,
  className = "",
}: {
  children: React.ReactNode;
  explain: string;
  topic?: string;
  followUps?: string[];
  className?: string;
}) {
  const { open } = useTutorPanel();
  const mode = useWidgetMode();
  const interactive = mode !== "builder";

  // Derive a short topic label if none was provided — first ~10 words of the paragraph.
  const inferredTopic =
    topic ??
    (typeof children === "string"
      ? deriveTopic(children)
      : "this passage");

  const defaultFollowUps = followUps ?? [
    "Walk me through this with an example",
    "How does this apply to my account?",
    "What would change if we did the opposite?",
  ];

  const handleAskTutor = () => {
    open({
      topic: inferredTopic,
      seedExplanation: explain,
      followUps: defaultFollowUps,
    });
  };

  return (
    <div className={`group relative ${className}`}>
      <p className="max-w-[68ch] text-[13.5px] leading-[1.45] text-foreground/80">
        {children}
      </p>

      {interactive && (
        <button
          onClick={handleAskTutor}
          aria-label="Open AI Tutor to explain this passage"
          className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[var(--accent-bg)] px-2 py-0.5 text-[11px] font-medium text-[var(--accent-strong)] opacity-0 transition-all hover:bg-[var(--accent-soft)] group-hover:opacity-100 focus:opacity-100"
        >
          <GraduationCap className="h-2.5 w-2.5" strokeWidth={2.25} />
          AI Tutor — explain this?
        </button>
      )}
    </div>
  );
}

function deriveTopic(text: string): string {
  const words = text.trim().split(/\s+/).slice(0, 9);
  return words.join(" ") + (text.split(/\s+/).length > 9 ? "…" : "");
}
