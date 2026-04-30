"use client";

import { useMemo, useState } from "react";
import type { CellType } from "@/lib/learn/types";
import type { SearchResult } from "@/lib/learn/search-data";
import { ALL_TYPES } from "@/lib/learn/search-data";
import { SearchFilters } from "./search-filters";
import { SearchResultRow } from "./search-result-row";

export function SearchResults({
  query,
  results,
  intentLabel,
  intentSummary,
  hideHeader = false,
  resultsHeading,
}: {
  query: string;
  results: SearchResult[];
  intentLabel?: string;
  intentSummary?: React.ReactNode;
  /** When true, the eyebrow/title/summary block is omitted — useful when a
   *  custom hero (eg the AI Answers card) already shows the query above. */
  hideHeader?: boolean;
  /** Optional heading rendered above the filter rail + list when the
   *  default header is hidden. */
  resultsHeading?: React.ReactNode;
}) {
  const [selected, setSelected] = useState<Set<CellType>>(new Set());

  const counts = useMemo(() => {
    const c = Object.fromEntries(ALL_TYPES.map((t) => [t, 0])) as Record<CellType, number>;
    for (const r of results) c[r.cell.type] += 1;
    return c;
  }, [results]);

  const filtered = useMemo(() => {
    if (selected.size === 0) return results;
    return results.filter((r) => selected.has(r.cell.type));
  }, [results, selected]);

  const toggle = (t: CellType) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });

  return (
    <div
      className={`mx-auto flex w-full max-w-[1080px] flex-col gap-6 px-4 pb-20 sm:px-5 md:px-7 ${
        hideHeader ? "pt-4" : "pt-7 md:pt-9"
      }`}
    >
      {!hideHeader && (
        <header className="flex flex-col gap-2">
          {intentLabel && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--accent-bg)] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[var(--accent-strong)]">
              {intentLabel}
            </span>
          )}
          <h1 className="max-w-[44ch] text-[clamp(1.4rem,2.4vw,1.85rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground">
            {query}
          </h1>
          {intentSummary && (
            <div className="w-full rounded-2xl border border-[var(--accent-soft)] bg-[var(--accent-bg)] p-5 text-[14px] leading-[1.6] text-foreground/85">
              {intentSummary}
            </div>
          )}
        </header>
      )}

      {resultsHeading}

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <SearchFilters
          selected={selected}
          onToggle={toggle}
          onClear={() => setSelected(new Set())}
          counts={counts}
        />

        <section className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-foreground/55">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
              {selected.size > 0 && ` · filtered to ${selected.size} type${selected.size === 1 ? "" : "s"}`}
            </span>
            <span className="text-[12px] text-foreground/40">Most relevant first</span>
          </div>

          <ul className="flex flex-col gap-2.5">
            {filtered.map((r) => (
              <li key={r.id}>
                <SearchResultRow result={r} />
              </li>
            ))}
          </ul>

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-black/[0.12] p-8 text-center text-[13px] text-foreground/55">
              No results match the selected filters.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
