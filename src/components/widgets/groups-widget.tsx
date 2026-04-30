"use client";

import { ArrowRight, Users, Zap, Palette, Rocket, Plug } from "lucide-react";

const groups = [
  {
    id: 1,
    name: "Power Users",
    members: "12.4k",
    description: "Advanced tips, formulas & automations for Orbit veterans",
    icon: Zap,
  },
  {
    id: 2,
    name: "Template Creators",
    members: "8.2k",
    description: "Share and discover community-built workspace templates",
    icon: Palette,
  },
  {
    id: 3,
    name: "Startups on Orbit",
    members: "5.7k",
    description: "Workflows and playbooks for fast-moving teams",
    icon: Rocket,
  },
  {
    id: 4,
    name: "API & Integrations",
    members: "3.9k",
    description: "Build custom integrations and extend Orbit",
    icon: Plug,
  },
];

export function GroupsWidget() {
  return (
    <section aria-labelledby="groups-heading">
      <div className="flex items-center justify-between mb-6">
        <h2 id="groups-heading" className="text-[24px] font-semibold tracking-tight text-foreground">
          Groups
        </h2>
        <button className="flex items-center gap-1 text-[14px] font-medium text-black/50 transition-colors hover:text-black/70">
          All groups <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {groups.map((group) => (
          <article
            key={group.id}
            className="group cursor-pointer rounded-[20px] border border-black/[0.06] bg-white p-6 transition-all duration-200 hover:border-black/[0.10] hover:shadow-[0_2px_24px_-8px_rgba(0,0,0,0.08)]"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/[0.04] mb-5"
              aria-hidden="true"
            >
              <group.icon className="h-[18px] w-[18px] text-black/45" strokeWidth={1.75} />
            </div>
            <h3 className="text-[20px] font-semibold text-foreground leading-snug tracking-[-0.01em] truncate">
              {group.name}
            </h3>
            <p className="text-[16px] text-black/50 mt-2 leading-relaxed line-clamp-2">
              {group.description}
            </p>
            <div className="flex items-center justify-between mt-5 pt-5 border-t border-black/[0.04]">
              <div className="flex items-center gap-1.5 text-[14px] text-black/50">
                <Users className="h-3.5 w-3.5 shrink-0 text-black/45" strokeWidth={1.75} aria-hidden="true" />
                {group.members} members
              </div>
              <button className="rounded-full bg-foreground px-5 py-2 text-[14px] font-medium text-background transition-opacity hover:opacity-80">
                Join
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
