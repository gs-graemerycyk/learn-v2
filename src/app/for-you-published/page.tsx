import { AppHeader } from "@/components/app-header";
import { AISearchModal } from "@/components/ai-search-modal";
import { CreateTopicProvider } from "@/components/create-topic-context";
import { CreateTopicModal } from "@/components/create-topic-modal";
import { ForYouPublished } from "@/components/recommendations/for-you-published";
import { SearchProvider } from "@/components/search-context";

// For You published-bot demo route — pairs with /for-you-builder.
// Shows the recommendations widget as a live in-app drawer that end
// users would tap into. Mirrors /published, but for the For You
// widget rather than AI Search.

export const metadata = {
  title: "Published Bot · For You Widget | Orbit",
};

export default function ForYouPublishedRoute() {
  return (
    <SearchProvider>
      <CreateTopicProvider>
        <div className="min-h-screen bg-[#FDFEFF]">
          <AppHeader />
          <main className="pt-16">
            <ForYouPublished />
          </main>
        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
