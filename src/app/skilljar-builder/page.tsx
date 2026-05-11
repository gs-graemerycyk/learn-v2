import { AppHeader } from "@/components/app-header";
import { AISearchModal } from "@/components/ai-search-modal";
import { CreateTopicProvider } from "@/components/create-topic-context";
import { CreateTopicModal } from "@/components/create-topic-modal";
import { SearchProvider } from "@/components/search-context";
import { CatalogPageBuilder } from "@/components/skilljar/catalog-page-builder";

// Skilljar Catalog Page Builder demo — exec demo route showing the
// new "For You Feed" block landing in the Personalized content blocks
// section of Skilljar's catalog page builder UI, alongside the
// existing In-Progress Courses block.

export const metadata = {
  title: "Skilljar Catalog Page Builder · For You Feed | Orbit",
};

export default function SkilljarBuilderRoute() {
  return (
    <SearchProvider>
      <CreateTopicProvider>
        <div className="min-h-screen bg-[#FDFEFF]">
          <AppHeader />
          <main className="pt-16">
            <CatalogPageBuilder />
          </main>
        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
