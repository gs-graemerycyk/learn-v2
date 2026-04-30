"use client";

import { Sparkles } from "lucide-react";
import { useSearch } from "./search-context";

export function NavSearch() {
  const { heroSearchVisible, openModal } = useSearch();

  return (
    <div
      className="pointer-events-none fixed top-0 left-[220px] right-0 z-[51] flex h-16 items-center justify-center transition-all duration-500 ease-out"
      style={{
        opacity: heroSearchVisible ? 0 : 1,
        visibility: heroSearchVisible ? "hidden" : "visible",
      }}
    >
      <div
        className="w-full max-w-[420px] transition-all duration-500 ease-out"
        style={{
          transform: heroSearchVisible ? "scale(0.92)" : "scale(1)",
          pointerEvents: heroSearchVisible ? "none" : "auto",
        }}
      >
        <button
          type="button"
          onClick={openModal}
          className="group relative flex w-full items-center rounded-xl bg-white border border-black/[0.08] shadow-[0_1px_8px_-2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-black/[0.12] hover:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] text-left cursor-text"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-black/30 transition-colors group-hover:text-black/50" />
          </div>
          <span className="h-9 flex-1 flex items-center pr-4 text-[13.5px] text-black/30">
            Search or ask anything...
          </span>
        </button>
      </div>
    </div>
  );
}
