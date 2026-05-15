# Forethought Community Agent — POC PRD

**Status:** Draft · **Owner:** TBD · **Last updated:** 2026-05-13

## Summary

Replace the existing AI Answers surface on the community search page with
a Forethought-powered agent that can hold a real multi-turn conversation
— answering, asking clarifying questions, citing its sources, and
escalating to a ticket when it can't resolve.

The POC is a **single converged experience**, not a set of distinct
journeys. Any query can land in any combination of behaviours depending
on what the conversation actually needs.

## Goal

Demonstrate, in a clickable build behind a feature flag, that one
chat-style answer surface can hold the same ground as today's AI
Answers *and* go further — disambiguating ambiguous queries, taking
follow-ups, and handing off cleanly to support when the answer isn't
in reach.

Success criteria for the POC:

- An exec can drive the demo end-to-end from a single query without
  visibly switching modes or surfaces.
- Each capability (answer, clarify, follow-up, escalate) demonstrably
  fires when the conversation calls for it.
- Source attribution and reasoning are visible on every agent reply
  that's drawn from community / KB / academy content.

## In-scope capabilities

All six live inside a single Forethought-rendered answer card on the
community search page. None of them is a separate route, mode, or
toggle.

1. **AI Answers-equivalent direct response.** When the agent has high
   confidence, it answers in paragraphs with inline source attribution,
   matching the surface area users already get from AI Answers today.
2. **Clarification step.** When the query is ambiguous or doesn't
   cleanly resolve to a single intent, the agent asks a short
   multiple-choice question instead of guessing. The user picks; the
   agent then answers focused-ly.

   *Build note:* Forethought routes by intent classification, not by a
   score we can threshold against. Disambiguation is almost certainly
   **not a Forethought configuration** — it's a custom layer in front
   of (or alongside) intent routing that:
   - detects ambiguity from the agent's response signals (fallback
     intent, low top-intent confidence delta, multi-intent return — to
     be confirmed with their team),
   - generates or selects the clarifying choices,
   - feeds the user's pick back into the agent as a more specific
     query so the right intent fires on the next turn.

   This is the **most significant net-new build** in the POC scope.
   Sizing and ownership need to be settled before commit.
3. **"How I got here" breadcrumbs.** Expandable reasoning panel on
   every agent turn — sources used, confidence, source counts, time
   taken.

   *Build note:* source citations and a confidence score are typically
   returned by RAG agents and likely covered by Forethought's
   response. The **displayed prose** ("Searched 4,219 community posts,
   ranked by accepted-answer count …") is client-composed from
   API metadata plus templates — it's not a single field we request.
   Anything that requires per-corpus search counts or step-by-step
   prose direct from the API needs verification.
4. **Suggested follow-up questions.** After every answer, 2–3
   one-click follow-up pills sized to what most users ask next. Clicking
   one advances the conversation as if the user had typed it.
5. **Free-text chat follow-up input.** A composer sits with the
   follow-up pills. The user can type any question and the agent
   responds in-thread, keeping the conversation context (sources
   already pulled, clarifications already given, etc.).
6. **Graceful escalation to a ticket.** When the agent can't resolve
   confidently — or when the user explicitly asks for a human — the
   agent offers a `Connect you with our team` CTA that opens a ticket
   with the full conversation attached. No "start over and re-explain"
   required.

## Core principle: paths converge

The four scenarios in the existing mockup (`/forethought?scenario=…`)
were built as **isolated demos** of each behaviour. The POC is the
opposite: a **single experience** where these behaviours combine
fluidly.

Example journey the POC should support end-to-end:

> 1. User searches *"how do I set up SSO with Okta?"*
> 2. Agent gives a confident direct answer with sources (capability 1).
> 3. User clicks the suggested follow-up *"What if a user belongs to
>    multiple Okta groups?"* (capability 4).
> 4. Agent answers, but the question is ambiguous (group precedence?
>    role mapping? sync timing?) so it asks a clarifying multi-choice
>    follow-up (capability 2).
> 5. User picks an option; agent answers, showing the reasoning trace
>    (capability 3).
> 6. User types a free-form follow-up: *"this didn't work for us,
>    we're still seeing 401s"* (capability 5).
> 7. Agent acknowledges that it can't resolve from public sources and
>    offers the `Connect you with our team` CTA. User clicks; a ticket
>    opens with the full thread attached (capability 6).

A different query could go straight from step 1 to step 7. Another
could stay in steps 1–4 forever. The point is that the surface is
*one thing* that adapts.

## Out of scope for the POC

- Tenant-level configuration (which scopes, which content sources,
  which escalation routing rules).
- Real ticket creation — the POC stops at the CTA click + a mocked
  confirmation.
- Multi-language support — English only.
- Authenticated personalisation (e.g. "I've fetched your tenant's
  audit log") — the POC uses publicly available content only.
- Replacement of the classic search list — it stays under the agent
  card unchanged.
- Cross-product (Skilljar / PX) recommendations inside the agent
  thread — this PRD covers community search only.

## Platform dependencies (to confirm with Forethought)

These shape POC scope and effort. Settle before kickoff, not during.

- **Ambiguity signal.** Forethought is intent-based — there is no
  confidence score to threshold against. What signal in the API
  response (fallback intent, top-intent confidence delta, multi-intent
  return, no-intent-matched) should the clarification layer key off?
- **Disambiguation: native vs. custom.** Does Forethought support
  pre-configured intent hierarchies that present a multi-choice
  follow-up natively, or is this 100% custom on our side? Affects
  capability #2's build size by an order of magnitude.
- **API surface for "How I got here".** What fields come back per
  reply? Specifically: sources, confidence, corpus counts. The
  client composes the displayed prose; we need the inputs.
- **Multi-turn context retention.** Does Forethought maintain
  conversation state server-side, or do we pass the running thread on
  each call? Affects free-text follow-up (#5).
- **Escalation handoff payload.** What does Forethought hand to the
  ticket system on `Connect with our team`? Conversation transcript
  only, or transcript + sources used + intent path?

## Open questions

- **Reasoning trace defaults.** Expanded vs. collapsed by default?
  Current mockup uses collapsed.
- **"How I got here" minimum viable shape.** If Forethought only
  returns sources + confidence (no corpus counts, no step-level
  reasoning data), what do we ship? Options: a stripped-down panel
  with just sources and confidence; hold the feature until richer
  fields are available; pad the panel with client-derived metadata
  (timing, source-kind breakdown) so it still reads as "show your
  work" even with less raw data. Pick a fallback before commit so we
  don't get stuck mid-build.
- **Follow-up input behaviour after escalation.** Locked, soft-locked
  with a "ticket open" notice, or available but routed to the ticket
  thread?
- **Helpful-vote scope.** Per-turn (every agent reply) or per-thread
  (one vote at the end)?

## Reference

Existing isolated-scenario mockup lives at
`/forethought?scenario={sso|api|refund|clarify}&mode=forethought` in
this repo. Treat it as the **vocabulary** of capabilities; the POC
build composes them into one converged surface.
