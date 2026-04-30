import { AppHeader } from "@/components/app-header";
import { AISearchModal } from "@/components/ai-search-modal";
import { CreateTopicProvider } from "@/components/create-topic-context";
import { CreateTopicModal } from "@/components/create-topic-modal";
import { AiAnswerHero, type AnswerBullet } from "@/components/learn/ai-answer-hero";
import { SearchResults } from "@/components/search/search-results";
import { SearchProvider } from "@/components/search-context";
import { getSearchResults } from "@/lib/learn/search-data";

// AI Answers (compact variant) — mirrors the production AI Answers card
// that ships on communities.gainsight.com today: bordered hero with a
// bulleted summary on the left, source cards on the right (3 visible by
// default, "Show all" expands up to 10), and a "Continue reading"
// affordance that expands the full answer body. Below the hero, the
// classic search results list with its left filter rail.

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata = {
  title: "AI Answers | Orbit",
};

const answerBullets: AnswerBullet[] = [
  {
    text:
      "Gainsight can migrate most community content from Khoros, including categories, topics/threads/replies, rich content (emoticons, inline images, quotes, @mentions, tables, polls, likes), attachments (convertible where needed), and user data (username, first/last name, user id, avatar, followers, roles).",
    citation: "Gainsight Community Migration FAQ",
  },
  {
    text:
      "Items that cannot be migrated: user passwords and private messages; user settings often cannot be migrated due to platform differences.",
    citation: "Gainsight Community Migration FAQ",
  },
  {
    text:
      "Points/badges/ranks (gamification) can be migrated as an add-on but many teams choose to redesign the badge program from scratch on the new platform.",
    citation: "Gainsight Community Migration FAQ",
  },
  {
    text:
      "The recommended path is two sFTP exports — sandbox for UAT, production for cutover — with at least two sandbox import cycles so your team can validate before the live switch.",
    citation: "Gainsight Community Migration FAQ",
  },
  {
    text:
      "Plan a 2–3 day read-only window on the existing Khoros community before the final export so no in-flight content is lost during cutover.",
    citation: "Gainsight Community Migration FAQ",
  },
  {
    text:
      "Authentication: SSO is the cleanest cutover path — users sign in via the SSO button without resets. On default auth, passwords cannot transit; plan three rounds of comms for the password-reset moment.",
    citation: "Has anyone migrated to Gainsight Community product?",
  },
  {
    text:
      "URL redirects: document your Khoros URL structures (patterns like /t/.../ for topics and /c/.../ for categories) early. Redirect mapping is usually the longest single task in the migration.",
    citation: "Gainsight Community Migration FAQ",
  },
  {
    text:
      "Timeline: known vendors with clean exports run 6–8 weeks; new vendors or complex structures (custom roles, deeply nested categories) routinely run 12+ weeks.",
    citation: "Gainsight Community Migration FAQ",
  },
];

export default async function AiAnswerRoute({
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
  // Sources for the hero are drawn from the same canonical cell set used
  // by the results list below — gives the user a consistent set of items
  // to navigate between the hero card and the full search list.
  const sources = results.map((r) => r.cell);

  return (
    <SearchProvider>
      <CreateTopicProvider>
        <div className="min-h-screen bg-[#FDFEFF]">
          <AppHeader />
          <main className="pt-16">
            <div className="mx-auto w-full max-w-[1080px] px-4 pt-7 sm:px-5 md:px-7 md:pt-9">
              <h1 className="mb-5 text-[clamp(1.4rem,2.4vw,1.85rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground">
                {q}
              </h1>
              <AiAnswerHero query={q} bullets={answerBullets} sources={sources} />
            </div>
            <div className="mt-2">
              {/* Reuse the existing classic-search list below the hero —
                  passes through with its left filter rail and result rows.
                  hideHeader skips the duplicate query/eyebrow since the
                  page already shows them above the hero. */}
              <SearchResults
                query={q}
                results={results}
                hideHeader
                resultsHeading={
                  <h2 className="text-[18px] font-semibold leading-[1.25] text-foreground">
                    Search results for: <span className="text-foreground/65 font-medium">{q}</span>
                  </h2>
                }
              />
            </div>
          </main>
        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
