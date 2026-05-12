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
// Optional ?scenario=sso|api|refund|clarify, ?mode=current|forethought,
// and ?pick=auth|rate-limits|webhooks|api-version (clarify only) query
// params let the debug dock deep-link into a specific demo state.

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type Scenario = "sso" | "api" | "refund" | "clarify";
type Mode = "current" | "forethought";
type ClarifyPick = "auth" | "rate-limits" | "webhooks" | "api-version";

const SCENARIOS: ReadonlyArray<Scenario> = ["sso", "api", "refund", "clarify"];
const CLARIFY_PICKS: ReadonlyArray<ClarifyPick> = [
  "auth",
  "rate-limits",
  "webhooks",
  "api-version",
];
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
  const rawPick = typeof sp.pick === "string" ? sp.pick : null;
  const initialScenario =
    rawScenario && (SCENARIOS as ReadonlyArray<string>).includes(rawScenario)
      ? (rawScenario as Scenario)
      : "sso";
  const initialMode =
    rawMode && (MODES as ReadonlyArray<string>).includes(rawMode)
      ? (rawMode as Mode)
      : "forethought";
  // Pick only applies to the clarify scenario — ignored elsewhere.
  const initialPick =
    initialScenario === "clarify" &&
    rawPick &&
    (CLARIFY_PICKS as ReadonlyArray<string>).includes(rawPick)
      ? (rawPick as ClarifyPick)
      : null;

  return (
    <SearchProvider>
      <CreateTopicProvider>
        <div className="min-h-screen bg-[#FDFEFF]">
          <AppHeader />
          <main className="pt-16">
            <ForethoughtDemo
              initialScenario={initialScenario}
              initialMode={initialMode}
              initialPick={initialPick}
            />
          </main>
        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
