"use client";

import { useEffect, useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import { useSearch } from "./search-context";

const placeholders = [
  "How do I create a linked database view?",
  "Best templates for product roadmaps",
  "Setting up automations for recurring tasks",
  "How to build a custom dashboard?",
  "What's new in the latest Orbit release?",
  "Embedding Orbit pages in external tools",
];

export function AnimatedSearch() {
  const { heroSearchVisible, openModal } = useSearch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const target = placeholders[currentIndex];

    if (isTyping) {
      if (displayText.length < target.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(target.slice(0, displayText.length + 1));
        }, 35 + Math.random() * 25);
      } else {
        timeoutRef.current = setTimeout(() => setIsTyping(false), 2200);
      }
    } else {
      if (displayText.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 18);
      } else {
        setCurrentIndex((prev) => (prev + 1) % placeholders.length);
        setIsTyping(true);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayText, isTyping, currentIndex]);

  return (
    <div
      className="group relative w-full max-w-[580px] transition-all duration-500 ease-out"
      style={{
        opacity: heroSearchVisible ? 1 : 0,
        transform: heroSearchVisible ? "translateY(0) scale(1)" : "translateY(-20px) scale(0.95)",
        pointerEvents: heroSearchVisible ? "auto" : "none",
      }}
    >
      <button
        type="button"
        onClick={openModal}
        className="relative flex w-full items-center rounded-2xl bg-white border border-black/[0.08] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.10)] hover:border-black/[0.12] text-left cursor-text"
      >
        <div className="flex h-[56px] w-14 shrink-0 items-center justify-center">
          <Sparkles
            className="h-[17px] w-[17px] text-black/25 transition-colors duration-300 group-hover:text-black/40"
          />
        </div>
        <div className="h-[56px] flex-1 flex items-center pr-6 text-[15px] text-black/40">
          {displayText}
          <span className="ml-px inline-block h-[17px] w-[1.5px] translate-y-[1px] animate-pulse bg-black/20" />
        </div>
      </button>
    </div>
  );
}
