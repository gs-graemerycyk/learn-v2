"use client";

import type { LearnAnswer } from "@/lib/learn/types";
import { CellDetailProvider } from "./cell-detail-context";
import { CellDetailPanel } from "./cell-detail-panel";
import { ChapterBlock } from "./chapter";
import { ChapterNav } from "./chapter-nav";
import { LearnClosing } from "./learn-closing";
import { LearnIntro } from "./learn-intro";
import { RecommendationGrid } from "./recommendation-grid";
import { SupportChatProvider } from "./support-chat-modal";
import { TutorPanelProvider, TutorPanel } from "./tutor-panel";

export function LearnPage({ answer }: { answer: LearnAnswer }) {
  return (
    <SupportChatProvider>
      <TutorPanelProvider>
        <CellDetailProvider>
          <div className="bg-[#FDFEFF]">
            <div className="mx-auto flex w-full max-w-[1080px] gap-8 px-4 pb-20 pt-7 sm:px-5 md:px-7 md:pt-9">
              <ChapterNav chapters={answer.chapters} />

              <main className="flex min-w-0 flex-1 flex-col gap-6">
                <LearnIntro query={answer.query} intro={answer.intro} />

                <RecommendationGrid recommendations={answer.recommendations} />

                <div className="h-px bg-black/[0.06]" />

                <div className="flex flex-col gap-6">
                  {answer.chapters.map((ch, i) => (
                    <ChapterBlock key={ch.id} chapter={ch} index={i} />
                  ))}
                </div>

                <LearnClosing closing={answer.closing} query={answer.query} />
              </main>
            </div>
          </div>

          <CellDetailPanel />
          <TutorPanel />
        </CellDetailProvider>
      </TutorPanelProvider>
    </SupportChatProvider>
  );
}
