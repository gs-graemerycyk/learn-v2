"use client";

import { Calendar, MapPin, ArrowRight, Users } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Orbit Config 2026",
    description:
      "The annual conference for teams building with Orbit. Keynotes, workshops, and community sessions.",
    date: "Apr 24, 2026",
    time: "10:00 AM PT",
    location: "San Francisco + Online",
    image: "/assets/yue-ma-Dw46btG90Xg-unsplash.jpg",
    attendees: 1240,
    live: true,
  },
  {
    id: 2,
    title: "Database Masterclass",
    description:
      "Deep dive into relational databases, rollups, and advanced formulas with the Orbit team.",
    date: "Apr 18, 2026",
    time: "2:00 PM PT",
    location: "Online",
    image: "/assets/yue-ma-Nwpyc1dks4g-unsplash.jpg",
    attendees: 386,
    live: false,
  },
];

export function EventsWidget() {
  return (
    <section aria-labelledby="events-heading">
      <div className="flex items-center justify-between mb-6">
        <h2 id="events-heading" className="text-[24px] font-semibold tracking-tight text-foreground">
          Upcoming Events
        </h2>
        <button className="flex items-center gap-1 text-[14px] font-medium text-black/50 transition-colors hover:text-black/70">
          View all <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {events.map((event) => (
          <article
            key={event.id}
            className="group cursor-pointer rounded-[20px] border border-black/[0.06] bg-white overflow-hidden transition-all duration-200 hover:border-black/[0.10] hover:shadow-[0_2px_24px_-8px_rgba(0,0,0,0.08)]"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={event.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              {event.live && (
                <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 backdrop-blur-sm px-3 py-1 text-[12px] font-semibold text-emerald-900">
                  <span
                    className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"
                    aria-hidden="true"
                  />
                  Livestream
                </span>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-[20px] font-semibold text-foreground leading-snug tracking-[-0.01em] truncate">
                {event.title}
              </h3>
              <p className="mt-2.5 text-[16px] text-black/50 leading-relaxed line-clamp-2">
                {event.description}
              </p>
              <div className="mt-5 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[14px] text-black/50">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-black/45" strokeWidth={1.75} aria-hidden="true" />
                  {event.date} · {event.time}
                </div>
                <div className="flex items-center gap-1.5 text-[14px] text-black/50">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-black/45" strokeWidth={1.75} aria-hidden="true" />
                  {event.location}
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between pt-5 border-t border-black/[0.04]">
                <div className="flex items-center gap-1.5 text-[14px] text-black/50">
                  <Users className="h-3.5 w-3.5 shrink-0 text-black/45" strokeWidth={1.75} aria-hidden="true" />
                  {event.attendees > 999
                    ? `${(event.attendees / 1000).toFixed(1).replace(/\.0$/, "")}k`
                    : event.attendees}{" "}
                  attending
                </div>
                <button className="rounded-full bg-foreground px-5 py-2 text-[14px] font-medium text-background transition-opacity hover:opacity-80">
                  Register
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
