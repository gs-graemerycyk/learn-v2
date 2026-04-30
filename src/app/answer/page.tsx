import { AppHeader } from "@/components/app-header";
import { AISearchModal } from "@/components/ai-search-modal";
import { CreateTopicProvider } from "@/components/create-topic-context";
import { CreateTopicModal } from "@/components/create-topic-modal";
import { SearchResults } from "@/components/search/search-results";
import { SearchProvider } from "@/components/search-context";
import { getSearchResults } from "@/lib/learn/search-data";

// Short Answer — one of the four query-intent outcomes. A concise AI summary
// at the top, followed by the classic search list (cells with left filters,
// each linking out to a full-page cell detail). Used when the question has
// a tight, well-bounded answer that doesn't need the chaptered Long Answer.

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata = {
  title: "Answer | Orbit",
};

const shortAnswerSummary = (
  <p>
    <strong className="font-semibold text-foreground">Short answer:</strong>{" "}
    Most of your Khoros community migrates as-is — categories, topics,
    replies (with inline images, polls, likes), attachments, and core user
    data. Passwords and private messages don't migrate; gamification is a
    paid add-on. Plan for two sFTP exports (sandbox + production), a
    read-only window 2–3 days before final export, and SSO if you want to
    avoid the password-reset comms loop.
  </p>
);

export default async function AnswerRoute({
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
            <SearchResults
              query={q}
              results={results}
              intentSummary={shortAnswerSummary}
            />
          </main>
        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
