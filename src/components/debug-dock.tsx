"use client";

import { useState } from "react";
import { Bug, ExternalLink, X } from "lucide-react";

// A deliberately ugly debug panel. Floats bottom-right on every page so
// reviewers can jump between the four query-intent surfaces and the
// in-app widget demo without typing URLs.

const ROUTES: { label: string; href: string; note: string }[] = [
  {
    label: "Home",
    href: "/",
    note: "Orbit homepage with the unified header + AISearchModal",
  },
  {
    label: "Community Hub (scaffold)",
    href: "/community-hub",
    note: "EmailMonkey-style Community homepage — placeholder for recommendation widgets",
  },
  {
    label: "Academy (scaffold)",
    href: "/academy",
    note: "EmailMonkey-style Academy homepage — placeholder for recommendation widgets",
  },
  {
    label: "AI Answers (long)",
    href: "/learn?q=How+do+I+migrate+from+Khoros+to+Gainsight+Community",
    note: "Chaptered AI answer + chapter nav + AI Tutor + support escalation",
  },
  {
    label: "AI Answers · skip loading",
    href: "/learn?q=How+do+I+migrate+from+Khoros+to+Gainsight+Community&fast=1",
    note: "Same page, skips the 700 ms loading skeleton",
  },
  {
    label: "Short Answer",
    href: "/answer?q=What+email+format+do+migration+exports+need",
    note: "Concise summary + classic search list",
  },
  {
    label: "AI Answers (compact)",
    href: "/ai-answer?q=How+do+I+migrate+from+Khoros+to+Gainsight+Community",
    note: "Short-answer layout with AI Answers branding + a longer multi-paragraph answer",
  },
  {
    label: "Classic Search",
    href: "/search?q=Khoros+migration",
    note: "List of cells with left filters; cells link to full-page detail",
  },
  {
    label: "Cell detail (full page)",
    href: "/learn/cells/a-migration-faq",
    note: "Destination for cell links from /search and /answer",
  },
  {
    label: "Bot Builder · admin view",
    href: "/builder",
    note: "Static preview of the AI Search widget + Configure Your Bot panel (no taps)",
  },
  {
    label: "Published Bot · live view",
    href: "/published",
    note: "What end users see — fully interactive, modals open within the widget",
  },
  {
    label: "For You · bot builder",
    href: "/for-you-builder",
    note: "Phone-frame preview of the For You widget + Configure Your Bot panel (no taps)",
  },
  {
    label: "For You · published",
    href: "/for-you-published",
    note: "Live in-app drawer of the For You widget — fully interactive carousel",
  },
  {
    label: "Skilljar Catalog Page Builder",
    href: "/skilljar-builder",
    note: "Skilljar admin UI demo — For You Feed block in Personalized content blocks",
  },
  {
    label: "CC Page Builder · Recommendations",
    href: "/cc-builder",
    note: "CC admin UI demo — toggle the Recommendations widget between manual topics and the algorithmic feed (3/5/7, list/cards/carousel)",
  },
];

// Forethought demo deep links — the exec demo lives at /forethought and
// is also reachable via this dock with each scenario + mode preselected.

type Scenario = "sso" | "api" | "refund" | "clarify";
type Mode = "current" | "forethought";

const SCENARIO_LABELS: Record<Scenario, string> = {
  sso: "Resolved by agent — Okta SSO",
  api: "Multi-step workflow — API broken",
  refund: "Graceful escalation — refund",
  clarify: "Asks for clarification — ambiguous integration",
};

const MODE_LABELS: Record<Mode, string> = {
  current: "Current AI Answers",
  forethought: "Forethought Community Agent",
};

function forethoughtHref(scenario: Scenario, mode: Mode) {
  return `/forethought?scenario=${scenario}&mode=${mode}`;
}

// Pick deep-links for the clarify scenario — each lands directly on the
// focused resolution turn so the demo can jump to the "end result".
type ClarifyPick = "auth" | "rate-limits" | "webhooks" | "api-version";

const CLARIFY_PICK_LABELS: Record<ClarifyPick, string> = {
  auth: "Authentication / SSO",
  "rate-limits": "Rate limits or quotas",
  webhooks: "Webhook delivery",
  "api-version": "API version compatibility",
};

function clarifyPickHref(pick: ClarifyPick) {
  return `/forethought?scenario=clarify&mode=forethought&pick=${pick}`;
}

export function DebugDock() {
  const [open, setOpen] = useState(false);
  const [scenario, setScenario] = useState<Scenario>("sso");

  return (
    <div className="fixed bottom-4 right-4 z-[200] font-mono">
      {open && (
        <div className="mb-2 w-[320px] overflow-hidden rounded-lg border-2 border-dashed border-amber-500 bg-amber-50 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)]">
          <div className="flex items-center justify-between bg-amber-500 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black">
            <span className="flex items-center gap-1.5">
              <Bug className="h-3 w-3" strokeWidth={2.5} />
              Debug · jump to demo route
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close debug dock"
              className="rounded p-0.5 hover:bg-black/15"
            >
              <X className="h-3 w-3" strokeWidth={2.5} />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {/* Forethought-specific quick-jumper — pinned at the top so
                it's instantly accessible during the exec demo. */}
            <ForethoughtSection scenario={scenario} setScenario={setScenario} />

            <ul className="border-t border-dashed border-amber-500/60 py-1">
              {ROUTES.map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    className="flex flex-col gap-0.5 px-3 py-2 transition-colors hover:bg-amber-100"
                  >
                    <span className="flex items-center gap-1.5 text-[12px] font-bold text-black">
                      {r.label}
                      <ExternalLink className="h-2.5 w-2.5 text-black/55" strokeWidth={2.5} />
                    </span>
                    <span className="text-[10px] text-black/65">{r.note}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-dashed border-amber-500/60 bg-amber-100 px-3 py-1.5 text-[9.5px] text-black/65">
            Not shipped — for design review only
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md border-2 border-dashed border-amber-500 bg-amber-300 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)] transition-transform hover:scale-105"
      >
        <Bug className="h-3 w-3" strokeWidth={2.5} />
        DEBUG
      </button>
    </div>
  );
}

function ForethoughtSection({
  scenario,
  setScenario,
}: {
  scenario: Scenario;
  setScenario: (s: Scenario) => void;
}) {
  return (
    <section className="bg-amber-100/50 px-3 py-3">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black">
          DEMO
        </span>
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-black">
          Forethought Community Agent
        </span>
      </div>

      <label className="mb-2 flex flex-col gap-1">
        <span className="text-[9.5px] font-bold uppercase tracking-wider text-black/65">
          Scenario
        </span>
        <select
          value={scenario}
          onChange={(e) => setScenario(e.target.value as Scenario)}
          className="rounded border border-amber-500/60 bg-white px-2 py-1 text-[11px] font-medium text-black outline-none"
        >
          {(Object.keys(SCENARIO_LABELS) as Scenario[]).map((s) => (
            <option key={s} value={s}>
              {SCENARIO_LABELS[s]}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-1">
        {(Object.keys(MODE_LABELS) as Mode[]).map((mode) => (
          <a
            key={mode}
            href={forethoughtHref(scenario, mode)}
            className="flex items-center justify-between rounded border border-amber-500/40 bg-white px-2.5 py-1.5 text-[11px] font-bold text-black transition-colors hover:bg-amber-200"
          >
            <span>{MODE_LABELS[mode]}</span>
            <ExternalLink className="h-2.5 w-2.5 text-black/55" strokeWidth={2.5} />
          </a>
        ))}
      </div>

      {/* Clarify-only — jump straight to a specific resolution turn */}
      {scenario === "clarify" && (
        <div className="mt-3 flex flex-col gap-1">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-black/65">
            Clarification picks
          </span>
          {(Object.keys(CLARIFY_PICK_LABELS) as ClarifyPick[]).map((pick) => (
            <a
              key={pick}
              href={clarifyPickHref(pick)}
              className="flex items-center justify-between rounded border border-amber-500/40 bg-white px-2.5 py-1.5 text-[10.5px] font-bold text-black transition-colors hover:bg-amber-200"
            >
              <span>↳ {CLARIFY_PICK_LABELS[pick]}</span>
              <ExternalLink
                className="h-2.5 w-2.5 text-black/55"
                strokeWidth={2.5}
              />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
