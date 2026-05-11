# Project context — features and rationale

A working reference for what this prototype demos and *why* each piece
exists. `CLAUDE.md` covers setup and route mechanics; this doc explains
the design intent behind each surface so a reviewer can understand the
narrative the demo is telling.

The big picture: this is a vehicle for showing Gainsight Community
Cloud stakeholders how a single search query can route to four very
different outcomes ("intent routing"), how the resulting AI answer can
live as either a full page or an in-app chatbot widget, and how a
related personalisation surface ("For you") plugs into the same
patterns. Everything is stubbed — no real APIs, no env vars.

---

## 1. The four-intent search system

**Surfaces:** `/learn`, `/answer`, `/ai-answer`, `/search`,
`/forethought`. Entry point is the Cmd-K modal mounted on every page.

| Intent          | Route          | What it shows                                            |
| --------------- | -------------- | -------------------------------------------------------- |
| `long`          | `/learn`       | Chaptered AI answer with AI Tutor + support escalation    |
| `short`         | `/answer`      | Concise summary + classic search list                     |
| `ai-answer`     | `/ai-answer`   | Compact AI Answer with longer multi-paragraph body        |
| `classic`       | `/search`      | List of cells with left-rail filters                      |
| `support`       | `/forethought` | Forethought Community Agent escalation demo               |

**Why this exists.** Stakeholders kept asking "is this just an AI
chatbot?" The answer is no — the search system *picks the right
surface*, and the pick is the product. Forcing each intent onto its
own route (rather than toggling component state) makes that decision
visible: the URL changes, the page changes, the support path changes.

**Implementation note.** Routing lives in
`src/components/ai-search-modal.tsx → routeForIntent`. Suggestions in
the modal carry an `intent` field which renders as a pill badge on
the suggestion row, so a reviewer can predict the destination before
they click. The Support pill reads **Community Agent** (rebranded
from the original "Support" — the term the design system uses).

**Why Forethought lives at its own route.** Support escalation in
production would surface as a modal *inside* an AI answer. For the
exec demo we needed a dedicated stage to switch scenarios and
compare "current AI Answers" vs the new "Forethought Community
Agent" side-by-side. The closing block on `/learn` opens the same
agent as a side-panel chatbot for the inline case.

## 2. Long Answer (`/learn`)

A chaptered AI answer with all the moving parts a real "deep" search
result needs. The page is the demo's main event.

**Features and why:**

- **Eyebrow chip + query as title** — anchors the user in the
  question they asked. Removes ambiguity about what the page is
  answering.
- **Intro paragraph** — sets up the chapter list, mirrors a human
  CSM voice rather than a chatbot's terse summary.
- **For you carousel inside the answer** — surfaces personalised
  cells before the chaptered content begins. Demonstrates that AI
  answers and recommendations live in the same flow, not separate
  screens.
- **Four chapters with mixed cell types** (Question, Conversation,
  Idea, Reply, Article, Product Update, Course, Lesson with embedded
  video, Learning Experience, Event) — shows that *every* CC content
  type can be sourced as evidence, not just KB articles. The video
  cell is the one most likely to surprise reviewers.
- **AI Tutor pill** — hovering a paragraph reveals an explainer
  affordance. Solves "I don't understand this passage" without
  forcing the user to leave the answer and chat with a bot. The pill
  opens a side panel with passage-specific follow-ups.
- **Cell detail slide-out** (520 px desktop, full-screen mobile /
  widget) — clicking a cell title opens its full content without a
  navigation away. Keeps the answer in context.
- **Closing block — "Ask in the community" + "Talk to support"** —
  the two next-step affordances when the AI answer doesn't fully
  land. Ask routes to the Create Topic modal pre-filled with
  context; Talk to support opens the Forethought side-panel
  chatbot. These are the documented escape hatches.
- **700 ms loading skeleton** — observable on purpose so reviewers
  can see the chapter shimmer + rotating status messages. `?fast=1`
  skips it during repeat demos.

## 3. Short Answer (`/answer`) and AI Answer compact (`/ai-answer`)

Two flavours of "we have a confident, short response."

- **`/answer`** — single-paragraph summary + the classic search list
  below it. The lightest treatment, used when the question has a
  clean factual answer (e.g. "what email format do migration
  exports need?"). Search list under the summary lets the user
  verify or dig deeper.
- **`/ai-answer`** — same compact layout but with AI Answers
  branding and a longer multi-paragraph body. Bridges the gap
  between Short Answer and the full chaptered Long Answer for
  questions that need more nuance than a sentence but less than four
  chapters.

**Why two compact variants.** It became obvious in early demos that
"short" was carrying too much — both "one sentence" and "three
paragraphs" were getting routed to the same page. Splitting them
lets the demo show genuine length variance.

## 4. Classic Search (`/search`)

The control variable in the four-intent demo: a familiar list-with-
filters experience. Cells link to full-page cell detail
(`/learn/cells/[id]`) rather than opening the slide-out, because in
the classic context the user came expecting a list-to-detail
navigation, not a hover-preview.

## 5. In-app widget (`/builder` and `/published`)

The same `LearnWidget` component renders in two modes, demonstrating
that the AI Search experience can ship as a chatbot widget *and* a
full-page surface from one codebase.

- **Builder mode (`/builder`)** — admin canvas. Phone-frame preview
  on the left with all interactive chrome disabled (cell taps, AI
  Tutor, support — all preview-only). Configure-Your-Bot panel on
  the right, mimicking the existing chatbot/KCBot builder, with
  **AI Search** flagged **NEW** in the widget list. This is the
  story to the admin user: "drop this widget in next to your
  existing Task List, Level Up, etc."
- **Published mode (`/published`)** — what end users see. Same
  component, fully interactive, modals open as full-screen takeovers
  within the 380 × 720 widget container. This is the story to the
  end user: "tap, swipe, escalate to support — all without leaving
  the drawer."

**Why pair these routes.** Stakeholders want to see the admin and
end-user views back-to-back. The split routes mean a reviewer can
deep-link straight to either without toggling. The `mode` prop on
`LearnWidget` is the single switch; everything else is identical.

## 6. Forethought Community Agent (`/forethought`)

Three pre-canned scenarios (Okta SSO resolved by agent, multi-step
API workflow, graceful refund escalation) × two modes (current AI
Answers, Forethought Community Agent). Deep-linkable via
`?scenario=&mode=` so the debug dock can jump straight into a
specific demo state.

**Why it's a separate page rather than a modal.** Exec demos need to
toggle scenarios live. A standalone route with controls at the top
of the page lets the demo runner switch without opening another
window.

## 7. EmailMonkey scaffold pages (`/community-hub`, `/academy`)

Two static placeholder pages built from the EmailMonkey reference
screenshots (fictitious email marketing brand).

- **`/community-hub`** — Community Hub homepage: login banner,
  hero search, **Featured topics** (1 large + 4 small), **Top
  groups** grid.
- **`/academy`** — Academy homepage: purple hero with mascot, hero
  search, **Master EmailMonkey with Guided Learning** courses row,
  **Hot with Admins** curated content row.

**Why these exist.** They're scaffolds for the For You
recommendations carousel — a realistic-looking host page that lets a
reviewer see the carousel in context rather than floating on a blank
page. The static fixtures (featured topics, top groups, course
cards) are placeholders only; the real value is the slot the For You
carousel drops into.

## 8. For You recommendations carousel

The newest workstream — preparing the frontend for the DCH (Digital
Customer Hub) recommendations engine. Two surfaces:

### 8a. Homepage version (`/community-hub`, `/academy`)

Lives at `src/components/recommendations/recommendations-carousel.tsx`.

- **"For you" section heading**, sentence case, with a sub-line
  ("Picked up where you left off, plus fresh picks from the
  community and academy").
- **10 mock items**: 2 resumptions pinned to the front (course at
  60 %, lesson at 25 %) + 8 recommendations (learning path,
  articles, questions, idea, event, product update).
- **Three card types**, sharing outer dimensions for visual
  cohesion:
    - **CourseCard** — thumbnail-led, type pill top-left, accent
      **Continue** pill + bottom-edge progress bar on resumptions.
    - **CommunityCard** — text-driven, type pill (toned per type),
      category caps, 2-line title, 3-line snippet, avatar + author
      / view + reply footer.
    - **EventCard** — events show formatted date, product updates
      show a `vX.Y` mono pill, both 3-line description.
- **Native CSS scroll-snap** — no carousel library. Card width
  scales with breakpoint: `w-[85%] sm:w-[45%] md:w-[32%] lg:w-[24%]
  xl:w-[19%]`. Hidden scrollbar on `lg+`, visible affordance on
  touch/small.
- **Arrow buttons** on `lg+` viewports, fade in/out based on scroll
  position.
- **Arrow-key navigation** when focus is inside the rail.
- **Accessibility**: `aria-labelledby` heading, focusable card links,
  visible focus rings, `aria-label="N percent complete"` on progress
  bars, `aria-label="N views"` on view counts.
- **Tracking stub**: every card click logs `recommendation_click`
  with `itemId`, `itemClass`, `contentType`, `position`. Hooked at
  the card-router level so it's a single swap-in point when real
  analytics arrives.

**What's stubbed.** Data source (mock fixtures) and tracking
(console.log). Both swap-in points are documented in a header
comment in the carousel file. Layout, scroll-snap, arrow nav, empty
state, and a11y are real and final.

### 8b. In-app widget version (`/for-you-builder`, `/for-you-published`)

Mirrors the AI Search widget pattern: same widget, two surfaces.

- **`ForYouWidget`** at `src/components/recommendations/for-you-widget.tsx`
  is the component end users would actually see inside a chatbot
  drawer. Drawer header ("Hi Sarah, pick up where you left off"),
  scroll-snap carousel with one card visible + peek of the next,
  inline ◀/▶ arrows, pagination dots and "Showing N of M" footer.
- **`/for-you-builder`** — phone-frame preview on the left, the same
  Configure-Your-Bot panel as `/builder` but with **For You**
  flagged **NEW** at the top of the widget list and a callout
  describing what it surfaces (Resumptions, Courses, Articles,
  Questions, Events).
- **`/for-you-published`** — neutral host background + phone frame,
  fully interactive carousel.

**Why a widget version exists.** The recommendation engine isn't
just for homepages — Community Cloud customers want it embedded in
their chatbot drawer too. Pairing builder + published mirrors the AI
Search treatment so the two features tell the same story to admins.

**Mobile responsiveness.** Both widget routes are fully responsive:
the phone frame collapses to `w-full max-w-[380px]` with
`height: min(720px, calc(100dvh - 12rem))` on small viewports so it
no longer overflows. Cards inside use `w-[78%] max-w-[280px]` so
peek of the next card is preserved at any frame size. Builder canvas
stacks vertically below `lg` (config panel sits under the phone
preview instead of beside it).

## 9. AI Search modal (Cmd-K)

Mounted on every page. Curated suggestions on open, filtered dynamic
suggestions while typing, intent badges on suggestions so the
destination is predictable.

**Intent badges** (`AI ANSWER`, `SHORT ANSWER`, `AI ANSWER (COMPACT)`,
`CLASSIC SEARCH`, `COMMUNITY AGENT`) are the most-clicked element
during demos — reviewers like that the system is showing its work
rather than hiding the routing decision.

## 10. Debug dock

Yellow `DEBUG` button bottom-right on every page. Click expands a
list of every demo route with a one-line description. **The single
most important navigation aid in the prototype** — reviewers don't
type URLs, they use the dock.

Also contains a Forethought quick-jumper for the exec demo (scenario
+ mode selectors that deep-link directly into `/forethought`).

## 11. Stubbed everywhere

- All recommendations, chapters, cells, and replies live in
  `src/lib/learn/stub-data.ts`. Search and answer pages always
  return the same canonical answer regardless of `q` — variance is
  *across routes*, not queries. This is intentional so the demo
  feels stable.
- AI Tutor and Support chat replies are pre-canned strings.
- Lesson video uses the public Sintel trailer (w3.org).
- "Ask in the community" creates a draft via the existing
  `CreateTopicModal` — no real submit handler.
- For You uses `src/components/recommendations/mock-data.ts` (10
  themed items). Replace this import with a fetch when the DCH API
  lands; types are already aligned.

---

## File map for extending

When adding a new cell type, update:

1. `src/lib/learn/types.ts` — add to `CellType` union and `CellPayload`.
2. `src/components/learn/cells/cell-<type>.tsx` — render the cell.
3. `src/components/learn/cells/index.tsx` — add to the `CellRouter`.
4. `src/components/learn/cells/cell-shell.tsx` — add to `TYPE_META`.
5. `src/components/learn/cell-detail-panel.tsx` and
   `src/components/learn/cell-detail-page.tsx` — add a body renderer.
6. `src/lib/learn/search-data.ts` — add to `ALL_TYPES` and
   `TYPE_LABEL`.

When adding a new intent, define the route, give curated suggestions
an `intent` field, and add a `case` to `routeForIntent` in
`src/components/ai-search-modal.tsx`. Add an entry to the debug
dock.

When adding a new For You card type:

1. `src/components/recommendations/types.ts` — add to `ContentType`
   union and (if new shape) extend `RecommendationItem`.
2. `src/components/recommendations/cards/<type>-card.tsx` — render it.
3. `src/components/recommendations/recommendation-card.tsx` and
   `src/components/recommendations/for-you-widget.tsx` (CardForItem
   router) — add a `case` for the new contentType.
4. `src/components/recommendations/mock-data.ts` — add a fixture.
