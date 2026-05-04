import Link from "next/link";
import { SearchProvider } from "@/components/search-context";
import { AISearchModal } from "@/components/ai-search-modal";
import { CreateTopicProvider } from "@/components/create-topic-context";
import { CreateTopicModal } from "@/components/create-topic-modal";
import { RecommendationsCarousel } from "@/components/recommendations/recommendations-carousel";
import { mockRecommendations } from "@/components/recommendations/mock-data";

// EmailMonkey-style Academy homepage scaffold.
//
// Mirrors the reference screenshot: purple hero with mascot, search bar,
// "Master EmailMonkey with Guided Learning" courses row, then a "Hot
// with Admins" curated content row. Static placeholders for the
// recommendation engine to replace.

export const metadata = {
  title: "Academy · EmailMonkey",
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

const GUIDED = [
  { title: "Get Started", swatch: "from-amber-100 to-yellow-200" },
  { title: "Self-Serve Enablement", swatch: "from-rose-100 to-pink-200" },
  { title: "Customize Templates", swatch: "from-sky-100 to-indigo-200" },
];

const ADMIN = [
  { title: "The Launchpad: Setting Up Your Team", swatch: "from-indigo-100 to-blue-200" },
  { title: "Mission Control: Defining User Powers", swatch: "from-amber-100 to-yellow-200" },
  { title: "ConnectingYour Stack", swatch: "from-rose-100 to-orange-200" },
  { title: "Marketing Megaphone", swatch: "from-pink-100 to-fuchsia-200" },
  { title: "Customer Care Playbook", swatch: "from-emerald-100 to-teal-200" },
  { title: "Analytics & Insights", swatch: "from-cyan-100 to-sky-200" },
];

export default function AcademyPage() {
  return (
    <SearchProvider>
      <CreateTopicProvider>
        <div className="min-h-screen bg-white text-[#1B1F3A]">
          {/* ── Top nav ── */}
          <header className="sticky top-0 z-40 border-b border-black/5 bg-white">
            <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-6 px-6">
              <Link href="/academy" className="flex items-center gap-2 font-semibold">
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
              <div className="ml-auto">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-200 text-[12px]">
                  ✦
                </span>
              </div>
            </div>
          </header>

          {/* ── Purple hero with mascot ── */}
          <section className="relative overflow-hidden bg-gradient-to-r from-[#5B2BD9] via-[#7B2CD8] to-[#A237D8]">
            <div className="absolute inset-0">
              <div className="absolute -right-16 top-0 h-[120%] w-[60%] rounded-full bg-[#1B0A52]/40 blur-2xl" />
              <div className="absolute -bottom-12 right-12 h-32 w-32 rounded-full border-[6px] border-white/40" />
            </div>
            <div className="relative mx-auto flex max-w-[1180px] flex-col items-center gap-6 px-6 py-16">
              <div className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-sky-300 to-cyan-400 text-5xl shadow-lg">
                🐒
              </div>
            </div>
          </section>

          {/* ── Hero copy + search ── */}
          <section className="border-b border-black/5 bg-white">
            <div className="mx-auto max-w-[1180px] px-6 py-12 text-center">
              <h1 className="text-[32px] font-semibold tracking-tight">
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
          <section className="mx-auto max-w-[1180px] px-6 py-12">
            <RecommendationsCarousel items={mockRecommendations} />
          </section>

          {/* ── Master with Guided Learning ── */}
          <section className="bg-[#F4F5F9]">
            <div className="mx-auto max-w-[1180px] px-6 py-14 text-center">
              <h2 className="text-[20px] font-bold uppercase tracking-[0.04em] text-[#3F2BBE]">
                Master EmailMonkey with Guided Learning
              </h2>
              <p className="mx-auto mt-2 max-w-[640px] text-[13.5px] text-black/55">
                Explore step-by-step Swimlane courses tailored to help you
                build campaigns, manage lists, and unlock the full power of
                EmailMonkey.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {GUIDED.map((c) => (
                  <article
                    key={c.title}
                    className={`flex h-40 flex-col items-center justify-end rounded-2xl bg-gradient-to-br ${c.swatch} p-5 shadow-sm`}
                  >
                    <div className="mb-auto mt-4 text-3xl">🐒</div>
                    <h3 className="text-[14px] font-semibold">{c.title}</h3>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ── Hot with Admins ── */}
          <section>
            <div className="mx-auto max-w-[1180px] px-6 py-14 text-center">
              <h2 className="text-[20px] font-bold uppercase tracking-[0.04em] text-[#3F2BBE]">
                Hot with Admins
              </h2>
              <p className="mx-auto mt-2 max-w-[640px] text-[13.5px] text-black/55">
                Check out curated content built to help you along in your
                admin journey.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {ADMIN.map((c) => (
                  <article
                    key={c.title}
                    className={`flex h-40 flex-col items-center justify-end rounded-2xl bg-gradient-to-br ${c.swatch} p-5 shadow-sm`}
                  >
                    <div className="mb-auto mt-4 text-3xl">🐒</div>
                    <h3 className="text-[14px] font-semibold">{c.title}</h3>
                  </article>
                ))}
              </div>
            </div>
          </section>

        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
