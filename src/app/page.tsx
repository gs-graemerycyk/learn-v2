import { SearchProvider } from "@/components/search-context";
import { AppHeader } from "@/components/app-header";
import { HeroGradient } from "@/components/hero-gradient";
import { AnimatedSearch } from "@/components/animated-search";
import { TrendingChips } from "@/components/trending-chips";
import { Feed } from "@/components/feed";
import { EventsWidget } from "@/components/widgets/events-widget";
import { CoursesWidget } from "@/components/widgets/courses-widget";
import { ReelsWidget } from "@/components/widgets/reels-widget";
import { GroupsWidget } from "@/components/widgets/groups-widget";
import { FeaturedWidget } from "@/components/widgets/featured-widget";
import { AISearchModal } from "@/components/ai-search-modal";
import { CreateTopicProvider } from "@/components/create-topic-context";
import { CreateTopicModal } from "@/components/create-topic-modal";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function Home() {
  return (
    <SearchProvider>
      <CreateTopicProvider>
        <div className="min-h-screen bg-[#FDFEFF]">
          <AppHeader activeLabel="Home" />

          <main className="pt-16">
            {/* Hero */}
            <section className="relative flex min-h-[64vh] flex-col items-center justify-center px-6 pt-12 pb-16">
              <HeroGradient />

              <div className="relative z-10 flex flex-col items-center gap-9">
                <div className="flex flex-col items-center gap-4 text-center">
                  <h1 className="w-full max-w-[680px] text-[clamp(2.5rem,5vw,3.75rem)] font-semibold leading-[1.10] tracking-[-0.03em] text-foreground">
                    Your workspace, your community
                  </h1>
                  <p className="max-w-[560px] text-[17px] leading-relaxed text-black/40">
                    Ask questions, share workflows, and discover templates built
                    by teams like yours — powered by AI search.
                  </p>
                </div>

                <AnimatedSearch />
                <TrendingChips />
              </div>
            </section>

            {/* Content */}
            <section className="px-6 pb-32 pt-4">
              <div className="mx-auto flex max-w-3xl flex-col gap-14">
                <ScrollReveal><FeaturedWidget /></ScrollReveal>
                <ScrollReveal delay={60}><Feed /></ScrollReveal>
                <ScrollReveal><EventsWidget /></ScrollReveal>
                <ScrollReveal delay={60}><CoursesWidget /></ScrollReveal>
                <ScrollReveal><ReelsWidget /></ScrollReveal>
                <ScrollReveal delay={60}><GroupsWidget /></ScrollReveal>
              </div>
            </section>
          </main>
        </div>
        <AISearchModal />
        <CreateTopicModal />
      </CreateTopicProvider>
    </SearchProvider>
  );
}
