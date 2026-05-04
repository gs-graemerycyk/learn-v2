import Link from "next/link";
import { SearchProvider } from "@/components/search-context";
import { AISearchModal } from "@/components/ai-search-modal";
import { CreateTopicProvider } from "@/components/create-topic-context";
import { CreateTopicModal } from "@/components/create-topic-modal";
import { RecommendationsCarousel } from "@/components/recommendations/recommendations-carousel";
import { mockRecommendations } from "@/components/recommendations/mock-data";

// EmailMonkey-style Community Hub homepage scaffold.
//
// Static placeholder — built to mirror the structure of the reference
// screenshot so recommendation widgets can later be slotted in. Only
// layout, nav, and section stubs are wired up; cards are static fixtures.

export const metadata = {
  title: "Community Hub · EmailMonkey",
};

const NAV = [
  { label: "Community", href: "#" },
  { label: "Knowledge Base", href: "#" },
  { label: "Ideas", href: "#" },
  { label: "Product Updates", href: "#" },
  { label: "Events", href: "#" },
  { label: "Groups", href: "#" },
  { label: "Member Directory", href: "#" },
];

const FEATURED_LARGE = {
  badge: "🏆",
  title: "Customer Spotlight: How One Boutique Bakery Baked Up 5x More Orders with EmailMonkey 🥐",
  excerpt:
    "Featured Member: Sweet Harmony BakeshopOwner: Lena Alvarez 📌 The ChallengeSweet Harmony Bakeshop, a small but mighty bakery in Portland, OR, had built…",
  ago: "8 months ago",
  views: 83,
  replies: 0,
  imageBg: "from-amber-200 via-orange-200 to-rose-200",
};

const FEATURED_SMALL = [
  {
    title: "The Community This Week: Global Community Admins unite",
    body: "",
    ago: "1 year ago",
    views: 34,
    replies: 0,
    swatch: "from-violet-200 to-violet-300",
  },
  {
    title: "How do we manage Subscriber lists?",
    body: "Need help on managing Subscriber",
    ago: "1 year ago",
    views: 23,
    replies: 0,
    swatch: "from-rose-200 to-pink-200",
  },
  {
    title: "Avoiding Spam Filters",
    body: "",
    ago: "1 year ago",
    views: 19,
    replies: 0,
    swatch: "from-emerald-200 to-teal-200",
  },
  {
    title: "Ensuring High Deliverability",
    body: "Ensuring High Deliverability with Primate PostmasterEnsuring Hig…",
    ago: "1 year ago",
    views: 15,
    replies: 0,
    swatch: "from-sky-200 to-indigo-200",
  },
];

const TOP_GROUPS = [
  { name: "Amsterdam", swatch: "from-violet-500 to-violet-700" },
  { name: "Advanced Analytics Certificate Learning Path", swatch: "from-rose-200 to-orange-200" },
  { name: "Community Champions", swatch: "from-amber-200 to-yellow-300" },
  { name: "Deliverability Pros", swatch: "from-emerald-200 to-lime-200" },
  { name: "Beta Testers", swatch: "from-sky-200 to-cyan-200" },
];

export default function CommunityHubPage() {
  return (
    <SearchProvider>
      <CreateTopicProvider>
        <div className="min-h-screen bg-[#F6F7FB] text-[#1B1F3A]">
          {/* ── Top nav ── */}
          <header className="sticky top-0 z-40 border-b border-black/5 bg-white">
            <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-6 px-6">
              <Link href="/community-hub" className="flex items-center gap-2 font-semibold">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] text-white">
                  ✉
                </span>
                EmailMonkey
              </Link>
              <nav className="hidden items-center gap-5 text-[13px] text-black/70 md:flex">
                {NAV.map((n) => (
                  <a key={n.label} href={n.href} className="hover:text-black">
                    {n.label}
                    {(n.label === "Community" || n.label === "Knowledge Base") && (
                      <span className="ml-1 text-black/40">⌄</span>
                    )}
                  </a>
                ))}
              </nav>
              <div className="ml-auto flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-100 text-[12px]">
                  ✦
                </span>
                <button className="rounded-full bg-[#3F2BBE] px-4 py-1.5 text-[12px] font-semibold text-white">
                  + CREATE TOPIC
                </button>
                <button className="rounded-full bg-[#3F2BBE] px-4 py-1.5 text-[12px] font-semibold text-white">
                  👤 LOGIN
                </button>
              </div>
            </div>
          </header>

          {/* ── Login banner ── */}
          <div className="border-b border-black/5 bg-[#EEF0F8]">
            <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-3 px-6 py-5 text-center text-[13px] text-black/70">
              <p>
                Welcome to the EmailMonkey Community.{" "}
                <strong>Log in or create an account</strong> to engage in
                discussions, access resources, and connect with other members.
              </p>
              <div className="flex gap-2">
                <button className="rounded-md bg-[#3F2BBE] px-4 py-1.5 text-[12px] font-semibold text-white">
                  Log In
                </button>
                <button className="rounded-md border border-black/15 bg-white px-4 py-1.5 text-[12px] font-semibold text-black/70">
                  Create Account
                </button>
              </div>
            </div>
          </div>

          {/* ── Hero ── */}
          <section className="border-b border-black/5 bg-white">
            <div className="mx-auto max-w-[1180px] px-6 py-16 text-center">
              <h1 className="text-[34px] font-semibold tracking-tight">
                Welcome to the EmailMonkey Hub
              </h1>
              <p className="mt-2 text-[14px] text-black/55">
                Ask questions, get answers and engage with your peers
              </p>
              <div className="mx-auto mt-6 flex max-w-[420px] items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm">
                <span className="text-black/40">🔍</span>
                <span className="text-[14px] text-black/40">
                  Unlock greatness in every search…
                </span>
                <span className="ml-auto text-[11px] text-black/40">⌘ K</span>
              </div>
            </div>
          </section>

          {/* ── For you (recommendations) ── */}
          <section className="mx-auto max-w-[1180px] px-6 pt-12">
            <RecommendationsCarousel items={mockRecommendations} />
          </section>

          {/* ── Featured topics ── */}
          <section className="mx-auto max-w-[1180px] px-6 py-12">
            <h2 className="mb-4 text-[14px] font-semibold text-[#3F2BBE]">
              Featured topics
            </h2>

            <div
              className={`mb-4 flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm md:flex-row`}
            >
              <div
                className={`h-44 w-full bg-gradient-to-br ${FEATURED_LARGE.imageBg} md:h-auto md:w-[320px]`}
              />
              <div className="flex flex-col gap-2 p-5">
                <h3 className="text-[16px] font-semibold leading-snug">
                  {FEATURED_LARGE.badge} {FEATURED_LARGE.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-black/60">
                  {FEATURED_LARGE.excerpt}
                </p>
                <div className="mt-2 flex items-center justify-between text-[12px] text-black/50">
                  <span className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-rose-200 text-[10px]">
                      🐵
                    </span>
                    {FEATURED_LARGE.ago}
                  </span>
                  <span className="flex items-center gap-3">
                    <span>👁 {FEATURED_LARGE.views}</span>
                    <span>💬 {FEATURED_LARGE.replies}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURED_SMALL.map((c) => (
                <article
                  key={c.title}
                  className="flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm"
                >
                  <div className={`h-32 w-full bg-gradient-to-br ${c.swatch}`} />
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="text-[13.5px] font-semibold leading-snug">
                      {c.title}
                    </h3>
                    {c.body && (
                      <p className="text-[12.5px] text-black/60">{c.body}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between text-[11.5px] text-black/50">
                      <span className="flex items-center gap-1.5">
                        <span className="h-4 w-4 rounded-full bg-rose-200" />
                        {c.ago}
                      </span>
                      <span className="flex items-center gap-2">
                        <span>👁 {c.views}</span>
                        <span>💬 {c.replies}</span>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── Top groups ── */}
          <section className="mx-auto max-w-[1180px] px-6 pb-20">
            <h2 className="mb-4 text-[14px] font-semibold text-[#3F2BBE]">
              Top groups
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TOP_GROUPS.slice(0, 6).map((g) => (
                <article
                  key={g.name}
                  className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm"
                >
                  <div
                    className={`grid h-44 place-items-center bg-gradient-to-br ${g.swatch}`}
                  >
                    <div className="grid h-24 w-24 place-items-center rounded-full border-2 border-dashed border-white/70 text-3xl">
                      🌐
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-4">
                    <h3 className="text-[14px] font-semibold">{g.name}</h3>
                    <button className="rounded-md bg-[#3F2BBE] px-3 py-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-white">
                      Join Group
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
