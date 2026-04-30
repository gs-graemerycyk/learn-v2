import { AppHeader } from "@/components/app-header";
import { AISearchModal } from "@/components/ai-search-modal";
import { CreateTopicProvider } from "@/components/create-topic-context";
import { CreateTopicModal } from "@/components/create-topic-modal";
import { LearnPage } from "@/components/learn/learn-page";
import { SearchProvider } from "@/components/search-context";
import { getStubAnswer } from "@/lib/learn/stub-data";

// Server component: reads ?q= from searchParams.
// In Next 15+ searchParams is a Promise — await before accessing keys.

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata = {
  title: "Learn | Orbit",
  description:
    "AI-curated, personalized answers across the Orbit community and Academy.",
};

export default async function Learn({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "Best practices for welcome email sequences";

  // Prototype-only: simulate the prep time of an AI Answer so the loading
  // skeleton is observable. The default is ~700ms; pass ?fast=1 to skip.
  if (sp.fast !== "1") {
    await new Promise((r) => setTimeout(r, 700));
  }

  const answer = getStubAnswer(q);

  return (
    <SearchProvider>
      <CreateTopicProvider>
        <div className="min-h-screen bg-[#FDFEFF]">
          <AppHeader />
          <main className="pt-16">
            <LearnPage answer={answer} />
          </main>
        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
