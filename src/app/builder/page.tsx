import { AppHeader } from "@/components/app-header";
import { AISearchModal } from "@/components/ai-search-modal";
import { CreateTopicProvider } from "@/components/create-topic-context";
import { CreateTopicModal } from "@/components/create-topic-modal";
import { BotBuilder } from "@/components/builder/bot-builder";
import { SearchProvider } from "@/components/search-context";
import { getStubAnswer } from "@/lib/learn/stub-data";

// Bot-builder demo route — frames the AI Search widget inside a phone-shaped
// preview alongside a Configure-Your-Bot panel that mirrors the Gainsight
// Community Cloud chatbot/KCBot builder. Used to demonstrate that the
// Learn experience can be added as a widget to existing chatbot deployments.

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata = {
  title: "Bot Builder · AI Search Widget | Orbit",
};

export default async function BuilderRoute({
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
            <BotBuilder answer={answer} />
          </main>
        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
