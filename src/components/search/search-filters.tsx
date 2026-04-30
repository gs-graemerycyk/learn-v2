"use client";

import type { CellType } from "@/lib/learn/types";
import { ALL_TYPES, TYPE_LABEL } from "@/lib/learn/search-data";

// Left-rail filters for the Classic Search and Short Answer routes.
// Filtering is purely client-side — driven by the parent's selectedTypes set.

export function SearchFilters({
  selected,
  onToggle,
  onClear,
  counts,
}: {
  selected: Set<CellType>;
  onToggle: (t: CellType) => void;
  onClear: () => void;
  counts: Record<CellType, number>;
}) {
  const totalSelected = selected.size;

  return (
    <aside className="flex w-full flex-col gap-4 lg:w-[220px] lg:shrink-0">
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-foreground/55">
            Type
          </h3>
          {totalSelected > 0 && (
            <button
              onClick={onClear}
              className="text-[11px] font-medium text-[var(--accent-strong)] hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <ul className="flex flex-col gap-0.5">
          {ALL_TYPES.map((t) => {
            const isOn = selected.has(t);
            const count = counts[t] ?? 0;
            const disabled = count === 0;
            return (
              <li key={t}>
                <button
                  onClick={() => onToggle(t)}
                  disabled={disabled}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[12.5px] transition-colors ${
                    isOn
                      ? "bg-[var(--accent-bg)] font-medium text-[var(--accent-strong)]"
                      : "text-foreground/65 hover:bg-black/[0.03] hover:text-foreground/85"
                  } ${disabled ? "opacity-40 cursor-not-allowed hover:bg-transparent" : ""}`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border ${
                        isOn
                          ? "border-[var(--accent-strong)] bg-[var(--accent-strong)]"
                          : "border-black/15 bg-white"
                      }`}
                    >
                      {isOn && (
                        <svg viewBox="0 0 12 12" className="h-2 w-2 text-white">
                          <path
                            d="M2 6.5l2.5 2.5L10 3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    {TYPE_LABEL[t]}
                  </span>
                  <span className="text-[11px] tabular-nums text-foreground/40">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-2 border-t border-black/[0.06] pt-4">
        <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-foreground/55">
          Date
        </h3>
        <ul className="flex flex-col gap-0.5">
          {["Anytime", "Past week", "Past month", "Past year"].map((d, i) => (
            <li key={d}>
              <button
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[12.5px] transition-colors ${
                  i === 0
                    ? "bg-black/[0.04] font-medium text-foreground"
                    : "text-foreground/55 hover:bg-black/[0.03]"
                }`}
              >
                {d}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2 border-t border-black/[0.06] pt-4">
        <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-foreground/55">
          Source
        </h3>
        <ul className="flex flex-col gap-0.5">
          {["All sources", "Community", "Knowledge Base", "Skilljar Academy"].map((s, i) => (
            <li key={s}>
              <button
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[12.5px] transition-colors ${
                  i === 0
                    ? "bg-black/[0.04] font-medium text-foreground"
                    : "text-foreground/55 hover:bg-black/[0.03]"
                }`}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
