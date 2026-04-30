"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Client-side back button for the full-page cell detail. Falls back to a
// safe href if there's no history (e.g. opened in a new tab).

export function BackButton({ fallbackHref = "/search" }: { fallbackHref?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
      className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-foreground/55 transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.25} />
      Back to results
    </button>
  );
}
