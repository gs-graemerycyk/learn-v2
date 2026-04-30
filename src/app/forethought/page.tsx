import { AppHeader } from "@/components/app-header";
import { AISearchModal } from "@/components/ai-search-modal";
import { CreateTopicProvider } from "@/components/create-topic-context";
import { CreateTopicModal } from "@/components/create-topic-modal";
import { ForethoughtDemo } from "@/components/forethought/forethought-demo";
import { SearchProvider } from "@/components/search-context";

// Forethought Community Agent — exec demo route.
//
// Everything is static — three pre-canned scenarios, no API, no live
// search. Switch scenarios and toggle between the current AI Answers
// surface and the Forethought Community Agent block via the controls
// at the top of the page.
//
// Optional ?scenario=sso|api|refund and ?mode=current|forethought query
// params let the debug dock deep-link into a specific demo state.

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type Scenario = "sso" | "api" | "refund";
type Mode = "current" | "forethought";

const SCENARIOS: ReadonlyArray<Scenario> = ["sso", "api", "refund"];
const MODES: ReadonlyArray<Mode> = ["current", "forethought"];

export const metadata = {
  title: "Forethought Community Agent · Demo | Orbit",
};

export default async function ForethoughtPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const rawScenario = typeof sp.scenario === "string" ? sp.scenario : null;
  const rawMode = typeof sp.mode === "string" ? sp.mode : null;
  const initialScenario =
    rawScenario && (SCENARIOS as ReadonlyArray<string>).includes(rawScenario)
      ? (rawScenario as Scenario)
      : "sso";
  const initialMode =
    rawMode && (MODES as ReadonlyArray<string>).includes(rawMode)
      ? (rawMode as Mode)
      : "forethought";

  return (
    <SearchProvider>
      <CreateTopicProvider>
        <div className="min-h-screen bg-[#FDFEFF]">
          <AppHeader />
          <main className="pt-16">
            <ForethoughtDemo
              initialScenario={initialScenario}
              initialMode={initialMode}
            />
          </main>
        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
