"use client";

import { Play, Heart, ArrowRight } from "lucide-react";

const reels = [
  {
    id: 1,
    title: "My morning planning routine in Orbit",
    creator: "Ali Abdaal",
    views: "124K",
    thumbnail: "/assets/pawel-czerwinski-Slf8QxaFIWw-unsplash.jpg",
    duration: "0:47",
  },
  {
    id: 2,
    title: "How I manage 3 businesses with one workspace",
    creator: "Sara Dietschy",
    views: "89K",
    thumbnail: "/assets/pawel-czerwinski-xwp0_eLoZp0-unsplash.jpg",
    duration: "1:12",
  },
  {
    id: 3,
    title: "Database trick that changed everything",
    creator: "Thomas Frank",
    views: "201K",
    thumbnail: "/assets/milad-fakurian-GJKx5lhwU3M-unsplash.jpg",
    duration: "0:34",
  },
  {
    id: 4,
    title: "Building a content calendar in 5 min",
    creator: "Marie Poulin",
    views: "67K",
    thumbnail: "/assets/yue-ma-pk7V1eW6VI8-unsplash.jpg",
    duration: "0:58",
  },
];

export function ReelsWidget() {
  return (
    <section aria-labelledby="reels-heading">
      <div className="flex items-center justify-between mb-6">
        <h2 id="reels-heading" className="text-[24px] font-semibold tracking-tight text-foreground">
          Reels
        </h2>
        <button className="flex items-center gap-1 text-[13px] font-medium text-black/50 transition-colors hover:text-black/70">
          Explore <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {reels.map((reel) => (
          <article
            key={reel.id}
            className="group relative cursor-pointer rounded-[20px] overflow-hidden"
          >
            <div className="relative aspect-[9/14] overflow-hidden rounded-[20px]">
              <img
                src={reel.thumbnail}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" aria-hidden="true" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm">
                  <Play
                    className="h-5 w-5 fill-current text-foreground ml-0.5"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Duration */}
              <span className="absolute top-3 right-3 rounded-md bg-black/50 backdrop-blur-sm px-2 py-0.5 text-[12px] font-medium text-white/90">
                {reel.duration}
              </span>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-[13px] font-medium text-white leading-snug line-clamp-2">
                  {reel.title}
                </p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-[12px] text-white/80">{reel.creator}</span>
                  <div className="flex items-center gap-1 text-[12px] text-white/70">
                    <Heart className="h-3 w-3" aria-hidden="true" />
                    {reel.views}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
