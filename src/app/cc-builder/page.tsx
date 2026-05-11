import { AppHeader } from "@/components/app-header";
import { AISearchModal } from "@/components/ai-search-modal";
import { CreateTopicProvider } from "@/components/create-topic-context";
import { CreateTopicModal } from "@/components/create-topic-modal";
import { SearchProvider } from "@/components/search-context";
import { CCPageBuilder } from "@/components/cc/cc-page-builder";

// Community Cloud Page Builder demo — recreates the CC admin's page
// builder with the Recommendations widget selected. Demonstrates the
// new "Source" toggle that switches the widget between the existing
// manually-curated topic list and the new algorithmic feed.

export const metadata = {
  title: "CC Page Builder · Recommendations Widget | Orbit",
};

export default function CCBuilderRoute() {
  return (
    <SearchProvider>
      <CreateTopicProvider>
        <div className="min-h-screen bg-[#FDFEFF]">
          <AppHeader />
          <main className="pt-16">
            <CCPageBuilder />
          </main>
        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
