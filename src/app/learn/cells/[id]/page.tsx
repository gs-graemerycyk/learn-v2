import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AISearchModal } from "@/components/ai-search-modal";
import { CreateTopicProvider } from "@/components/create-topic-context";
import { CreateTopicModal } from "@/components/create-topic-modal";
import { BackButton } from "@/components/learn/back-button";
import { CellDetailPage } from "@/components/learn/cell-detail-page";
import { SearchProvider } from "@/components/search-context";
import { getCellById } from "@/lib/learn/stub-data";

// Full-page cell detail — the destination for cell links from the Classic
// Search and Short Answer pages. Inside the AI Answer (Long Answer), cells
// open in a slide-out modal instead; this route is the alternative
// engagement target for search-style flows.

type RouteParams = Promise<{ id: string }>;

export const metadata = {
  title: "Detail | Orbit",
};

export default async function CellDetailRoute({
  params,
}: {
  params: RouteParams;
}) {
  const { id } = await params;
  const cell = getCellById(id);
  if (!cell) notFound();

  return (
    <SearchProvider>
      <CreateTopicProvider>
        <div className="min-h-screen bg-[#FDFEFF]">
          <AppHeader />
          <main className="pt-16">
            <div className="mx-auto w-full max-w-[820px] px-4 pb-20 pt-7 sm:px-5 md:px-7 md:pt-9">
              <BackButton />
              <CellDetailPage cell={cell} />
            </div>
          </main>
        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
