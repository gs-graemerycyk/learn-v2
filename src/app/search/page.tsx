import { AppHeader } from "@/components/app-header";
import { AISearchModal } from "@/components/ai-search-modal";
import { CreateTopicProvider } from "@/components/create-topic-context";
import { CreateTopicModal } from "@/components/create-topic-modal";
import { SearchResults } from "@/components/search/search-results";
import { SearchProvider } from "@/components/search-context";
import { getSearchResults } from "@/lib/learn/search-data";

// Classic Search — one of the four query-intent outcomes. List of cells with
// left filters; clicking a cell opens its full-page detail at /learn/cells/[id]
// (rather than the slide-out modal used inside the AI Answer / Long Answer).

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata = {
  title: "Search | Orbit",
};

export default async function SearchRoute({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q =
    typeof sp.q === "string"
      ? sp.q
      : "How do I migrate from Khoros to Gainsight Community?";

  const results = getSearchResults(q);

  return (
    <SearchProvider>
      <CreateTopicProvider>
        <div className="min-h-screen bg-[#FDFEFF]">
          <AppHeader />
          <main className="pt-16">
            <SearchResults query={q} results={results} intentLabel="Classic search" />
          </main>
        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
