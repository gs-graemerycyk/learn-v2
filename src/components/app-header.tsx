"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearch } from "./search-context";
import { useCreateTopic } from "./create-topic-context";

// Shared top header — Zendesk Community chrome.
// activeLabel kept for API compat (unused in this layout).
export function AppHeader({ activeLabel: _activeLabel }: { activeLabel?: string }) {
  const { openModal } = useSearch();
  const { openNew } = useCreateTopic();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 8);
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-[60px] items-center gap-0 bg-white transition-shadow duration-200",
        scrolled
          ? "shadow-[0_1px_0_0_rgba(0,0,0,0.10)]"
          : "border-b border-gray-200"
      )}
    >
      <div className="flex w-full items-center px-5 md:px-7">
        {/* Wordmark */}
        <a href="/" className="flex shrink-0 items-baseline gap-[3px] mr-7">
          <span className="text-[17px] font-bold leading-none tracking-tight text-gray-900">
            zendesk
          </span>
          <span className="text-[17px] font-normal leading-none text-gray-900">
            community
          </span>
        </a>

        {/* Primary nav */}
        <nav className="hidden items-center lg:flex">
          {[
            "Connect and engage",
            "Zendesk updates",
            "Other resources",
          ].map((label) => (
            <button
              key={label}
              className="flex items-center gap-[3px] rounded-md px-3 py-2 text-[13.5px] text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              {label}
              <ChevronDown className="mt-[1px] h-[13px] w-[13px] shrink-0 text-gray-500" strokeWidth={2.2} />
            </button>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Search — opens AI search modal */}
          <button
            onClick={openModal}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={2} />
          </button>

          {/* Create a post */}
          <button
            onClick={openNew}
            className="hidden items-center gap-1.5 rounded-full bg-[#c8e44a] px-4 py-[7px] text-[13.5px] font-semibold text-gray-900 transition-opacity hover:opacity-85 md:flex"
          >
            <Plus className="h-[14px] w-[14px]" strokeWidth={2.5} />
            Create a post
          </button>

          {/* Login */}
          <button className="flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-[7px] text-[13.5px] font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <User className="h-[14px] w-[14px]" strokeWidth={1.85} />
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
