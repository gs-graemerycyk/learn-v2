"use client";

import { Maximize2, Search, Sparkles, X } from "lucide-react";
import type { LearnAnswer } from "@/lib/learn/types";
import { CellDetailProvider } from "./cell-detail-context";
import { CellDetailPanel } from "./cell-detail-panel";
import { ChapterBlock } from "./chapter";
import { LearnClosing } from "./learn-closing";
import { RecommendationGrid } from "./recommendation-grid";
import { SupportChatProvider } from "./support-chat-modal";
import { TutorPanel, TutorPanelProvider } from "./tutor-panel";
import {
  PanelScopeProvider,
  WidgetModeProvider,
  type WidgetMode,
} from "./widget-context";
import { CreateTopicProvider } from "../create-topic-context";
import { CreateTopicModal } from "../create-topic-modal";

// Compact "AI Search" widget version of the Learn page — designed to live
// inside the Gainsight Community Cloud chatbot builder as a configurable
// widget alongside Search / Task List / Level Up / See What's New / Explore
// More.
//
// In published mode the widget is a live, in-app experience: cell taps,
// AI Tutor, and support escalation all open as full-screen takeovers
// *within* the widget container (PanelScope="container").
// In builder mode the widget is a static preview inside the bot-builder
// canvas — interactive elements are disabled via WidgetMode="builder".

export function LearnWidget({
  answer,
  mode = "published",
}: {
  answer: LearnAnswer;
  mode?: WidgetMode;
}) {
  return (
    <WidgetModeProvider mode={mode}>
      <PanelScopeProvider scope="container">
        <CreateTopicProvider>
        <SupportChatProvider>
          <TutorPanelProvider>
            <CellDetailProvider>
              <div className="relative flex h-full w-full flex-col overflow-hidden bg-white">
                {/* Top bar — matches the Gainsight CC bot drawer chrome */}
                <header className="flex items-center justify-between px-3 pt-3 pb-1">
                  <button
                    aria-label="Expand"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-[#E1006C] transition-colors hover:bg-[#E1006C]/[0.08]"
                  >
                    <Maximize2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                  </button>
                  <button
                    aria-label="Close"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-[#E1006C] transition-colors hover:bg-[#E1006C]/[0.08]"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2.25} />
                  </button>
                </header>

                {/* Greeting + search bar (chatbot drawer pattern) */}
                <div className="shrink-0 px-4 pb-3 pt-1">
                  <h2 className="text-[15.5px] font-medium leading-[1.25] text-foreground">
                    Hi Sarah! 👋
                  </h2>
                  <h3 className="mt-0.5 text-[20px] font-bold leading-[1.2] text-foreground">
                    Need help with something?
                  </h3>

                  <div className="mt-3.5 flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-2 shadow-[0_1px_4px_-1px_rgba(0,0,0,0.04)]">
                    <Search className="h-3.5 w-3.5 text-foreground/40" strokeWidth={2.25} />
                    <span className="flex-1 truncate text-[12.5px] text-black/35">
                      Ask anything about Gainsight CC…
                    </span>
                  </div>
                </div>

                {/* Scrollable widget body — same layout as /learn:
                    eyebrow chip → query (h1) → intro → "For you" carousel
                    → divider → numbered chapters → closing. */}
                <div className="flex-1 min-w-0 overflow-y-auto px-4 pb-4">
                  <header className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--accent-bg)] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[var(--accent-strong)]">
                        <Sparkles className="h-2.5 w-2.5" strokeWidth={2.25} />
                        AI Answers
                      </span>
                      {mode === "builder" && (
                        <span className="text-[9.5px] font-medium text-foreground/45">
                          Widget
                        </span>
                      )}
                    </div>

                    <h1 className="text-[16px] font-semibold leading-[1.2] tracking-[-0.01em] text-foreground">
                      {answer.query}
                    </h1>
                    <p className="text-[12.5px] leading-[1.45] text-foreground/65">
                      {answer.intro}
                    </p>
                  </header>

                  {/* For you — horizontal carousel */}
                  <div className="mt-4">
                    <RecommendationGrid recommendations={answer.recommendations} />
                  </div>

                  {/* Divider before the chaptered body */}
                  <div className="mt-3 h-px bg-black/[0.06]" />

                  {/* Chapters */}
                  <section className="mt-4 flex flex-col gap-4">
                    {answer.chapters.map((ch, i) => (
                      <ChapterBlock key={ch.id} chapter={ch} index={i} />
                    ))}
                  </section>

                  {/* Closing */}
                  <div className="mt-4">
                    <LearnClosing closing={answer.closing} query={answer.query} />
                  </div>
                </div>

                {/* Overlays — scoped to the widget container so they cover only
                    the widget drawer, mirroring the in-app chatbot experience.
                    CreateTopicModal lives inside the widget tree so the
                    "Ask in the community" flow opens within the widget too. */}
                <CellDetailPanel />
                <TutorPanel />
                <CreateTopicModal />
              </div>
            </CellDetailProvider>
          </TutorPanelProvider>
        </SupportChatProvider>
        </CreateTopicProvider>
      </PanelScopeProvider>
    </WidgetModeProvider>
  );
}
