"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { useCreateTopic } from "./create-topic-context";

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const { openNew } = useCreateTopic();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-50 flex h-16 items-center justify-end transition-all duration-500 ease-out",
        "left-[220px] px-6",
        scrolled
          ? "bg-[#FDFEFF]/85 backdrop-blur-2xl border-b border-black/[0.04]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      {/* Right — Notifications + Create topic */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.08] bg-white text-black/40 transition-all duration-150 hover:border-black/[0.12] hover:text-black/60 hover:shadow-[0_1px_6px_-2px_rgba(0,0,0,0.06)]"
        >
          <Bell className="h-[16px] w-[16px]" strokeWidth={1.75} />
        </button>
        <button
          onClick={openNew}
          className="h-9 rounded-xl bg-foreground px-5 text-[14px] font-medium text-background transition-opacity hover:opacity-80"
        >
          Create topic
        </button>
      </div>
    </header>
  );
}
