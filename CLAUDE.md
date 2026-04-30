@AGENTS.md

# Running this repo

This is a prototype of the Gainsight Community Cloud "AI Search" feature —
a query-intent router that surfaces one of four outcomes (Classic Search,
Short Answer, AI Answers / Long Answer, Support Escalation) plus an
embedded chatbot widget version. Stub data only, no real APIs, no env
vars, no secrets.

## First-time setup

```bash
git clone <repo>
cd cc-vision
git checkout learn-v2          # current working branch
npm install                     # ~10-15s, no postinstall steps
npm run dev                     # serves http://localhost:3000
```

Node 18+ required. The repo uses Next.js 16.2.2 with the App Router and
Tailwind CSS v4. No build steps are needed for development.

## How to navigate the demo

Every page renders a yellow **DEBUG** button in the bottom-right corner.
Click it to expand a list of all demo routes — this is the easiest way to
walk through the prototype:

| Route | What it shows |
| --- | --- |
| `/` | Orbit homepage with the unified header + Cmd-K search modal |
| `/learn?q=...` | AI Answers (Long Answer) — chaptered answer + chapter nav + AI Tutor + support escalation |
| `/learn?q=...&fast=1` | Same page, skips the artificial 700 ms loading skeleton |
| `/answer?q=...` | Short Answer — concise summary + classic search list |
| `/search?q=...` | Classic Search — list of cells with left filter rail |
| `/learn/cells/[id]` | Full-page cell detail (destination from `/search` and `/answer`) |
| `/builder` | Bot Builder admin canvas — phone-frame preview + Configure-Your-Bot panel |
| `/published` | Published Bot live view — what end users see, fully interactive |

The search bar in the homepage / learn header opens an AI search modal
with intent-tagged suggestions: clicking the **AI ANSWER** badge routes
to `/learn`, **SHORT ANSWER** routes to `/answer`. The intent badge is
visible on each curated suggestion.

## Key features to demo

- **AI Answers (`/learn`)** — eyebrow chip, query as title, intro
  paragraph, **For you** carousel, four chapters with mixed cell types
  (Question, Conversation, Idea, Reply, Article, Product Update, Course,
  Lesson with embedded video, Learning Experience, Event), and a closing
  block with **Ask in the community** + **Talk to support**.
- **AI Tutor** — hover any chapter paragraph and the AI Tutor pill
  appears. Click to open a chatbot side panel that explains the passage
  and offers follow-up questions.
- **Cell detail slide-out** — clicking any cell title or its arrow
  affordance opens a 520px right slide-out (desktop) or full-screen
  takeover (mobile / in-app widget).
- **Forethought Support modal** — closing block's "Talk to support"
  opens a side-panel chatbot with seed agent message, follow-up chips,
  typing indicator, and a "Powered by Forethought" footer.
- **Create Topic** — closing block's "Ask in the community" opens the
  Create Topic side-panel pre-filled with context from the user's query.
- **Loading skeleton** — `/learn` has a built-in 700 ms artificial delay
  so the chapter-skeleton + rotating status messages are observable. Add
  `?fast=1` to skip it.

## In-app widget (`/builder` and `/published`)

The same `LearnWidget` component renders in two modes:

- **Builder mode (`/builder`)** — interactive chrome is disabled.
  Cells, AI Tutor, and Talk-to-support are all preview-only. The right
  panel is a Configure-Your-Bot mockup with the new "AI Search" widget
  flagged NEW in the widget list.
- **Published mode (`/published`)** — fully interactive. Cell, tutor,
  and support modals open as full-screen takeovers within the 380×720
  widget container (the same way an in-app chatbot drawer behaves).

## Things that are stubbed

- All recommendations, chapters, cells, and replies live in
  `src/lib/learn/stub-data.ts`. Search and answer pages always return
  the same canonical answer regardless of `q` — variance is across
  routes, not queries.
- AI Tutor and Support chat replies are pre-canned strings.
- The lesson video uses the public Sintel trailer (`w3.org`) as a
  Skilljar-style stand-in. Internet required to load it.
- "Ask in the community" creates a draft via the existing
  CreateTopicModal — there's no real submit handler.

## Repo notes

- The `.claude/` folder contains the assistant's preview-tool launch
  config with paths specific to one machine. It's safe for collaborators
  to ignore — `npm run dev` works without it.
- Branch `learn-v2` contains all the work. `main` has the original
  Orbit homepage. PR `learn-v2 → main` is the diff to review.

## When extending this prototype

The four-intent routing system is enforced by route, not by component
state — see `src/components/ai-search-modal.tsx` `routeForIntent` for
how intents map to URLs. To add a new intent, define the route, give
suggestions an `intent` field, and add an entry to the debug dock.

When adding a new cell type, update:

1. `src/lib/learn/types.ts` — add to `CellType` union and `CellPayload`.
2. `src/components/learn/cells/cell-<type>.tsx` — render the cell.
3. `src/components/learn/cells/index.tsx` — add to the `CellRouter`.
4. `src/components/learn/cells/cell-shell.tsx` — add to `TYPE_META`.
5. `src/components/learn/cell-detail-panel.tsx` and
   `src/components/learn/cell-detail-page.tsx` — add a body renderer.
6. `src/lib/learn/search-data.ts` — add to `ALL_TYPES` and `TYPE_LABEL`.
