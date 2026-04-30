"use client";

import { LayoutGrid, Zap } from "lucide-react";
import { useSearch } from "./search-context";

const topics = [
  { label: "Slack vs. email automations", icon: Zap },
  { label: "Public roadmaps — yes or no?", icon: LayoutGrid },
];

export function TrendingChips() {
  const { openModalWithQuery } = useSearch();

  return (
    <div className="flex items-center gap-2.5">
      {topics.map((topic) => (
        <button
          key={topic.label}
          onClick={() => openModalWithQuery(topic.label)}
          className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/80 px-4 py-2 text-[13px] font-medium text-black/55 transition-all duration-200 hover:border-black/[0.12] hover:text-black/70 hover:shadow-sm"
        >
          <topic.icon className="h-3.5 w-3.5" />
          {topic.label}
        </button>
      ))}
    </div>
  );
}
