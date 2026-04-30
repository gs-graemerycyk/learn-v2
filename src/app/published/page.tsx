import { AppHeader } from "@/components/app-header";
import { AISearchModal } from "@/components/ai-search-modal";
import { CreateTopicProvider } from "@/components/create-topic-context";
import { CreateTopicModal } from "@/components/create-topic-modal";
import { PublishedBot } from "@/components/learn/published-bot";
import { SearchProvider } from "@/components/search-context";
import { getStubAnswer } from "@/lib/learn/stub-data";

// Published-bot demo route — pairs with /builder. Where /builder shows the
// admin canvas + config panel with a static preview, /published shows the
// same widget as a live in-app chatbot drawer that end users would tap into.

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata = {
  title: "Published Bot · AI Search Widget | Orbit",
};

export default async function PublishedRoute({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q =
    typeof sp.q === "string"
      ? sp.q
      : "How do I migrate from Khoros to Gainsight Community?";

  const answer = getStubAnswer(q);

  return (
    <SearchProvider>
      <CreateTopicProvider>
        <div className="min-h-screen bg-[#FDFEFF]">
          <AppHeader />
          <main className="pt-16">
            <PublishedBot answer={answer} />
          </main>
        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
