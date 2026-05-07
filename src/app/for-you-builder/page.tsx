import { AppHeader } from "@/components/app-header";
import { AISearchModal } from "@/components/ai-search-modal";
import { CreateTopicProvider } from "@/components/create-topic-context";
import { CreateTopicModal } from "@/components/create-topic-modal";
import { ForYouBuilder } from "@/components/recommendations/for-you-builder";
import { SearchProvider } from "@/components/search-context";

// For You bot-builder demo route — admin canvas with phone-frame
// preview of the For You widget plus a Configure-Your-Bot panel.
// Mirrors /builder, but for the recommendations widget rather than
// AI Search.

export const metadata = {
  title: "Bot Builder · For You Widget | Orbit",
};

export default function ForYouBuilderRoute() {
  return (
    <SearchProvider>
      <CreateTopicProvider>
        <div className="min-h-screen bg-[#FDFEFF]">
          <AppHeader />
          <main className="pt-16">
            <ForYouBuilder />
          </main>
        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
