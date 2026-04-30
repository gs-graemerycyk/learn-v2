"use client";

import { ArrowRight } from "lucide-react";

const featured = [
  {
    id: 1,
    title: "Orbit API v2 — webhooks and OAuth 2.0",
    excerpt:
      "Real-time webhooks, batch operations, and secure OAuth flows for enterprise integrations.",
    category: "Developer",
    date: "Apr 2, 2026",
    image: "/assets/pawel-czerwinski-9qfTn6zW7bQ-unsplash.jpg",
  },
  {
    id: 2,
    title: "50+ new workspace templates",
    excerpt:
      "Curated setups from Linear, Figma, and Vercel — one-click duplicate.",
    category: "Templates",
    date: "Mar 28, 2026",
    image: "/assets/pawel-czerwinski-H-GYzI1q8UU-unsplash.jpg",
  },
];

export function FeaturedWidget() {
  return (
    <section aria-labelledby="featured-heading">
      <div className="flex items-center justify-between mb-6">
        <h2 id="featured-heading" className="text-[24px] font-semibold tracking-tight text-foreground">
          Orbit Insights
        </h2>
        <button className="flex items-center gap-1 text-[14px] font-medium text-black/50 transition-colors hover:text-black/70">
          All updates <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {featured.map((post) => (
          <article
            key={post.id}
            className="group cursor-pointer rounded-[20px] border border-black/[0.06] bg-white overflow-hidden transition-all duration-200 hover:border-black/[0.10] hover:shadow-[0_2px_24px_-8px_rgba(0,0,0,0.08)]"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={post.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-6">
              <span className="text-[14px] text-black/50 mb-3 block">{post.date}</span>
              <h3 className="text-[20px] font-semibold text-foreground leading-snug tracking-[-0.01em] truncate">
                {post.title}
              </h3>
              <p className="mt-2.5 text-[16px] text-black/50 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-1.5">
                <span className="rounded-full bg-black/[0.04] px-2.5 py-0.5 text-[14px] font-medium text-black/45">
                  {post.category}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
