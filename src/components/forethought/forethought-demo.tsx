"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  ExternalLink,
  FileText,
  GraduationCap,
  Headset,
  Lightbulb,
  MessagesSquare,
  Search,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Workflow,
  Zap,
} from "lucide-react";

// Forethought Community Agent — exec demo surface.
//
// One-file static demo. No backend, no API, no real search. Every
// scenario's data is hardcoded below. Designed to run reliably in a
// browser screenshare for a Zendesk × Gainsight conversation.
//
// Two cross-cutting controls at the top:
//   1) Mode toggle: current AI Answers ⇄ Forethought Community Agent
//   2) Scenario dropdown: SSO (resolved), API (multi-step), Refund (escalation)
//
// On any change, a 400ms "Thinking…" state replaces the answer block to
// feel like the agent is actually working.

// Forethought brand accent — restrained, only on the agent surface.
const FT_TEAL = "#0E7C7B";
const FT_TEAL_DARK = "#0F4C5C";
const FT_TEAL_TINT = "#E8F4F4";
const FT_TEAL_BORDER = "#9FCFCE";

// ─────────────────────────────────────────────────────────────────────────────
// Scenario data
// ─────────────────────────────────────────────────────────────────────────────

type SourceKind = "community" | "kb" | "course";

type Source = {
  title: string;
  kind: SourceKind;
  // Tiny meta line under the title in the source chip.
  meta?: string;
};

type DiagnosticStep = {
  label: string;
  status: "checked" | "found";
};

type AgentResponse = {
  paragraphs: string[];
  // Multi-step flow: when present, renders a numbered diagnostic list.
  diagnosticSteps?: DiagnosticStep[];
  resolution?: string;
  resolutionLink?: { label: string };
  sources: Source[];
  followUps: string[];
  helpfulCount: number;
  // Escalation flow: when true, hides sources/follow-ups and shows the
  // big "Connect you with our team" affordance.
  isEscalation?: boolean;
  escalationCopy?: string;
  // Clarification flow: when true, the agent shows a multiple-choice
  // disambiguation block instead of answering. Sources, follow-ups and
  // the helpful counter are hidden — they appear on the next turn once
  // the user picks an option.
  isClarification?: boolean;
  clarifyEyebrow?: string;
  clarifyOptions?: ClarifyOption[];
};

// Picks for the clarify scenario. Stable ids so URLs can deep-link
// straight to a specific resolution turn (?pick=auth, etc).
type ClarifyPickId = "auth" | "rate-limits" | "webhooks" | "api-version";

type ClarifyOption = {
  id: ClarifyPickId;
  label: string;
};

type ResolutionTurn = {
  agent: AgentResponse;
  reasoning: ReasoningTrace;
};

type ReasoningTrace = {
  posts: number;
  articles: number;
  courses: number;
  sourcesUsed: number;
  steps: string[];
  durationMs: number;
};

type BasicAnswer = {
  // What today's plain-LLM AI Answers card would synthesise. Mirrors the
  // /ai-answer hero shape: bulleted body with inline citations + a
  // sources column; the comparison toggle uses this as the "before" state.
  bullets: { text: string; citation?: string }[];
  // Sources surfaced in the right column (3 visible by default, "Show all"
  // expands to up to 10 — matches the production AI Answers card).
  sources: Source[];
};

type ScenarioId = "sso" | "api" | "refund" | "clarify";

type Scenario = {
  id: ScenarioId;
  label: string;
  query: string;
  agent: AgentResponse;
  reasoning: ReasoningTrace;
  basic: BasicAnswer;
  // Community results rendered below the answer block.
  communityResults: { title: string; kind: SourceKind; excerpt: string; meta: string }[];
  // Clarify scenario: focused answers shown once the user picks an
  // option from the agent's multi-choice question. Each pick id maps
  // to its own agent response + reasoning trace.
  clarifyResolutions?: Record<ClarifyPickId, ResolutionTurn>;
};

const SCENARIOS: Record<ScenarioId, Scenario> = {
  sso: {
    id: "sso",
    label: "Resolved by agent — Okta SSO setup",
    query: "How do I set up SSO with Okta in our community?",
    agent: {
      paragraphs: [
        "Setting up Okta SSO with Gainsight Community is a one-time admin configuration that takes most teams 30–45 minutes. You'll create a SAML application in Okta, exchange metadata with Gainsight, then map your Okta groups to community roles.",
        "The most important step most teams miss: enable just-in-time (JIT) user provisioning during the SAML setup. Without it, your existing Okta users will fail their first sign-in attempt because no community account exists yet to map them to.",
        "Once configured, your existing community users are matched by email on next sign-in. New users provision automatically — no separate invitation flow.",
      ],
      sources: [
        {
          title: "Configuring SAML SSO with Okta — step-by-step",
          kind: "kb",
          meta: "KB article · 8 min read",
        },
        {
          title: "JIT provisioning gotchas — what we learned",
          kind: "community",
          meta: "Accepted answer · 31 upvotes",
        },
        {
          title: "Migrating role mappings from Okta groups",
          kind: "community",
          meta: "12 replies · last week",
        },
        {
          title: "Authentication & access control fundamentals",
          kind: "course",
          meta: "Skilljar · 4 lessons",
        },
      ],
      followUps: [
        "How do I migrate existing user passwords?",
        "Can I require MFA at the Okta layer?",
        "What if a user belongs to multiple Okta groups?",
      ],
      helpfulCount: 1247,
    },
    reasoning: {
      posts: 4219,
      articles: 87,
      courses: 12,
      sourcesUsed: 6,
      durationMs: 1420,
      steps: [
        "Searched 4,219 community posts, 87 KB articles, 12 courses",
        "Filtered to SSO-related discussions from the last 18 months",
        "Ranked by accepted-answer count, recency, and admin-team upvotes",
        "Drafted answer from the top 6 sources, prioritising the official KB",
        "Cross-checked against current Gainsight authentication documentation",
      ],
    },
    basic: {
      bullets: [
        {
          text:
            "Setting up Okta SSO involves creating a SAML application in your Okta admin panel and exchanging metadata (entity ID, ACS URL, IdP signing certificate) with Gainsight Community.",
          citation: "Configuring SAML SSO with Okta",
        },
        {
          text:
            "Map your Okta groups to community roles during the SAML setup so users land with the right permissions on first sign-in.",
          citation: "Configuring SAML SSO with Okta",
        },
        {
          text:
            "Enable just-in-time (JIT) user provisioning to auto-create community accounts for Okta users who don't yet exist on the platform.",
          citation: "JIT provisioning gotchas — what we learned",
        },
        {
          text:
            "Existing community users are matched by email when SSO is enabled — no separate invitation flow is required after the cutover.",
          citation: "Configuring SAML SSO with Okta",
        },
        {
          text:
            "Most teams complete the configuration in 30–45 minutes once Okta side and Gainsight side have admin access available simultaneously.",
          citation: "Authentication & access control fundamentals",
        },
        {
          text:
            "MFA enforcement should typically live in Okta rather than the community surface — community login then inherits the Okta-level requirements.",
          citation: "Authentication & access control fundamentals",
        },
      ],
      sources: [
        {
          title: "Configuring SAML SSO with Okta — step-by-step",
          kind: "kb",
          meta: "KB article · 8 min read",
        },
        {
          title: "JIT provisioning gotchas — what we learned",
          kind: "community",
          meta: "Accepted answer · 31 upvotes",
        },
        {
          title: "Migrating role mappings from Okta groups",
          kind: "community",
          meta: "12 replies · last week",
        },
        {
          title: "Authentication & access control fundamentals",
          kind: "course",
          meta: "Skilljar · 4 lessons",
        },
        {
          title: "SCIM provisioning vs JIT — when to use which",
          kind: "community",
          meta: "8 replies · this week",
        },
        {
          title: "MFA at the Okta layer — recommended patterns",
          kind: "kb",
          meta: "KB article · 5 min read",
        },
      ],
    },
    communityResults: [
      {
        title: "Just finished an Okta migration — AMA",
        kind: "community",
        excerpt:
          "We rolled out Okta SSO across 3 community spaces last quarter. Happy to share the runbook and the three things I'd do differently next time.",
        meta: "42 replies · pinned by admin",
      },
      {
        title: "Configuring SAML SSO with Okta",
        kind: "kb",
        excerpt:
          "Step-by-step guide for community admins. Covers the SAML application setup, metadata exchange, role mapping, and JIT provisioning.",
        meta: "Official KB · updated April 2026",
      },
      {
        title: "SCIM provisioning vs JIT — when to use which",
        kind: "community",
        excerpt:
          "I've been weighing SCIM vs JIT for our 14k-seat community. Here's where each one breaks down and what the migration team recommended for us.",
        meta: "8 replies · this week",
      },
      {
        title: "Authentication & access control fundamentals",
        kind: "course",
        excerpt:
          "A 4-lesson Skilljar course covering SAML, OIDC, role hierarchies, and the most common SSO failure modes admins hit in their first 90 days.",
        meta: "Skilljar · 38 min",
      },
    ],
  },
  api: {
    id: "api",
    label: "Multi-step workflow — API integration broken",
    query: "My API integration stopped working after the latest release",
    agent: {
      paragraphs: [
        "I checked the recent release notes and your API client config — there's a known issue affecting integrations using the v2 contacts endpoint after the 18 April release. Here's what I checked, what I found, and the fix:",
      ],
      diagnosticSteps: [
        { label: "Verified your API version is current (v2.4.1)", status: "checked" },
        { label: "Checked the 18 April release for breaking changes", status: "checked" },
        {
          label: "Found a known issue with /v2/contacts.list pagination",
          status: "found",
        },
      ],
      resolution:
        "The 18 April release changed the default page size from 100 to 50 and renamed the cursor parameter from `next` to `next_page_token`. Update your client to handle the new parameter name and you're back in business.",
      resolutionLink: { label: "v2.4.1 → v2.5.0 migration guide" },
      sources: [
        {
          title: "v2.5.0 release notes — pagination changes",
          kind: "kb",
          meta: "KB article · 4 min read",
        },
        {
          title: "API client wrapper update — sample diff",
          kind: "kb",
          meta: "KB article · 2 min read",
        },
        {
          title: "Has anyone hit the new pagination limit?",
          kind: "community",
          meta: "23 replies · 4 hours ago",
        },
      ],
      followUps: [
        "Show me a code example for the new parameter",
        "Which other endpoints changed in v2.5.0?",
        "How do I roll back to v2.4.1 temporarily?",
      ],
      helpfulCount: 312,
    },
    reasoning: {
      posts: 1814,
      articles: 124,
      courses: 6,
      sourcesUsed: 4,
      durationMs: 2110,
      steps: [
        "Identified your tenant's API client version (v2.4.1) from the request signature",
        "Cross-referenced against the v2.5.0 release notes from 18 April",
        "Pulled the breaking-changes section and matched against your last 50 API errors",
        "Located the matching community thread with confirmed reproduction",
        "Drafted resolution with code-level guidance from the migration guide",
      ],
    },
    basic: {
      bullets: [
        {
          text:
            "API breakage after a platform release is usually caused by an unhandled breaking change in the new version — start by checking the release notes for that release window.",
          citation: "v2.5.0 release notes",
        },
        {
          text:
            "Common breaking-change categories include parameter renames (e.g. cursor / pagination tokens), default value changes (page sizes), and authentication header format updates.",
          citation: "v2.5.0 release notes",
        },
        {
          text:
            "If your client is on v2.4.x and you started seeing 400/422 responses after 18 April, the most likely cause is the cursor parameter rename from `next` to `next_page_token` on list endpoints.",
          citation: "v2.4.1 → v2.5.0 migration guide",
        },
        {
          text:
            "Update your SDK wrapper to handle the new parameter name and adjust the default page size from 100 to 50; both changes are backwards-compatible for read paths.",
          citation: "API client wrapper update — sample diff",
        },
        {
          text:
            "Run your integration test suite against staging before the production rollout — the contract tests catch this class of issue cleanly.",
          citation: "How we caught the v2.5.0 break in our staging suite",
        },
      ],
      sources: [
        {
          title: "v2.5.0 release notes — pagination changes",
          kind: "kb",
          meta: "KB article · 4 min read",
        },
        {
          title: "v2.4.1 → v2.5.0 migration guide",
          kind: "kb",
          meta: "KB article · 8 min read",
        },
        {
          title: "API client wrapper update — sample diff",
          kind: "kb",
          meta: "KB article · 2 min read",
        },
        {
          title: "Has anyone hit the new pagination limit?",
          kind: "community",
          meta: "23 replies · 4 hours ago",
        },
        {
          title: "How we caught the v2.5.0 break in our staging suite",
          kind: "community",
          meta: "9 replies · this week",
        },
      ],
    },
    communityResults: [
      {
        title: "Has anyone hit the new pagination limit?",
        kind: "community",
        excerpt:
          "We started getting 400s yesterday on /v2/contacts.list — looks like the cursor param was renamed. Posting in case it saves anyone else an afternoon.",
        meta: "23 replies · 4 hours ago",
      },
      {
        title: "v2.5.0 release notes — pagination changes",
        kind: "kb",
        excerpt:
          "The default page size on list endpoints changed from 100 to 50, and the pagination cursor parameter was renamed from `next` to `next_page_token`. Sample responses and migration patterns inside.",
        meta: "Official KB · 18 April",
      },
      {
        title: "API client wrapper update — sample diff",
        kind: "kb",
        excerpt:
          "Concrete before/after for the SDK wrapper most teams are using. Drop-in for the cursor rename plus a small change to handle the smaller default page size.",
        meta: "Official KB · updated April 19",
      },
      {
        title: "How we caught the v2.5.0 break in our staging suite",
        kind: "community",
        excerpt:
          "Our integration tests caught it before prod — sharing the contract test we use for any pagination-affecting endpoint, in case it helps someone.",
        meta: "9 replies · this week",
      },
    ],
  },
  refund: {
    id: "refund",
    label: "Graceful escalation — billing/refund request",
    query: "I need a refund for last month's invoice",
    agent: {
      isEscalation: true,
      paragraphs: [
        "Billing and refund requests need a human on our side — I can't process invoice changes from the agent surface, but I can route this to the right team quickly.",
      ],
      escalationCopy:
        "I'll create a billing ticket with this conversation attached so you don't have to repeat yourself. Average response time during business hours is around two hours.",
      sources: [],
      followUps: [],
      helpfulCount: 89,
    },
    reasoning: {
      posts: 0,
      articles: 0,
      courses: 0,
      sourcesUsed: 0,
      durationMs: 480,
      steps: [
        "Classified intent as billing/refund — out of self-service scope",
        "Looked up your account tier and the relevant billing-team queue",
        "Pre-drafted a ticket with the full conversation attached",
        "Skipped community / KB lookup — not a knowledge question",
      ],
    },
    basic: {
      bullets: [
        {
          text:
            "Refunds and invoice corrections are handled by the billing team, not the community surface — most billing requests need a human review of the account state before action can be taken.",
          citation: "Billing & invoice FAQ",
        },
        {
          text:
            "Pro-rated mid-cycle refunds are typically issued within 3–5 business days once approved; full-cycle refunds may require additional approval depending on plan tier.",
          citation: "How does the billing team handle pro-rated refunds?",
        },
        {
          text:
            "When opening a billing ticket, include your invoice ID, the date of the charge, and a one-line note on why the refund is being requested — this is the fastest path to resolution.",
          citation: "Billing & invoice FAQ",
        },
        {
          text:
            "Plan changes mid-cycle (downgrades, seat reductions) follow a different flow than refunds — the team can convert one into the other depending on the timing of your request.",
          citation: "Billing & invoice FAQ",
        },
      ],
      sources: [
        {
          title: "Billing & invoice FAQ",
          kind: "kb",
          meta: "Official KB · updated March 2026",
        },
        {
          title: "How does the billing team handle pro-rated refunds?",
          kind: "community",
          meta: "5 replies · last month",
        },
      ],
    },
    communityResults: [
      {
        title: "How does the billing team handle pro-rated refunds?",
        kind: "community",
        excerpt:
          "Sharing what I learned after we needed a partial refund mid-cycle. The billing team was great but knowing the process up front saved us a few back-and-forths.",
        meta: "5 replies · last month",
      },
      {
        title: "Billing & invoice FAQ",
        kind: "kb",
        excerpt:
          "Answers to the most common billing questions — payment methods, invoice corrections, plan changes mid-cycle, and refund eligibility.",
        meta: "Official KB · updated March 2026",
      },
    ],
  },
  clarify: {
    id: "clarify",
    label: "Asks for clarification — ambiguous integration question",
    query: "My integration keeps failing",
    agent: {
      paragraphs: [
        "Integrations can fail for a few different reasons — happy to dig in once I know which area you're hitting. To save you the wrong answer first, could you point me at the one that best matches what you're seeing?",
      ],
      isClarification: true,
      clarifyEyebrow: "Quick question first",
      clarifyOptions: [
        { id: "auth", label: "Authentication / SSO" },
        { id: "rate-limits", label: "Rate limits or quotas" },
        { id: "webhooks", label: "Webhook delivery" },
        { id: "api-version", label: "API version compatibility" },
      ],
      // Intentionally empty — the next turn (after the user picks an option)
      // is where sources / follow-ups / helpful count materialise.
      sources: [],
      followUps: [],
      helpfulCount: 0,
    },
    reasoning: {
      posts: 3814,
      articles: 64,
      courses: 9,
      sourcesUsed: 0,
      durationMs: 680,
      steps: [
        "Searched 3,814 community posts, 64 KB articles, 9 courses",
        "Detected 4 distinct integration failure modes in the top results — no dominant match",
        "Confidence below threshold to draft a single answer without disambiguating first",
        "Holding source synthesis until the user picks the failure mode",
      ],
    },
    basic: {
      bullets: [
        {
          text:
            "Integration failures most often trace back to authentication errors — expired tokens, mis-scoped OAuth clients, or SSO assertion mismatches after an IdP config change.",
          citation: "Troubleshooting authentication failures",
        },
        {
          text:
            "Rate limits and quotas are the next most common cause — bursts above the per-minute allowance silently return 429s that can look like outages downstream.",
          citation: "API rate limits and retry semantics",
        },
        {
          text:
            "Webhook delivery failures usually fall into three buckets: TLS/certificate problems, signature verification mismatches, and consumer endpoints returning non-2xx within the retry window.",
          citation: "Webhook delivery best practices",
        },
        {
          text:
            "Breaking changes between API versions can manifest as field-shape mismatches even when authentication and rate limits look healthy — check the version pinned in your client.",
          citation: "API versioning policy",
        },
        {
          text:
            "Less commonly, environment drift (sandbox vs production endpoints, stale base URLs) is the root cause once auth, rate limits, and webhooks have all been ruled out.",
          citation: "Environment configuration checklist",
        },
      ],
      sources: [
        {
          title: "Troubleshooting authentication failures",
          kind: "kb",
          meta: "KB article · 7 min read",
        },
        {
          title: "API rate limits and retry semantics",
          kind: "kb",
          meta: "KB article · 5 min read",
        },
        {
          title: "Webhook delivery best practices",
          kind: "kb",
          meta: "KB article · 9 min read",
        },
        {
          title: "API versioning policy",
          kind: "kb",
          meta: "KB article · 4 min read",
        },
        {
          title: "Common integration pitfalls — what we've seen",
          kind: "community",
          meta: "23 replies · pinned by admin",
        },
        {
          title: "Building reliable integrations",
          kind: "course",
          meta: "Skilljar · 6 lessons",
        },
      ],
    },
    communityResults: [
      {
        title: "Common integration pitfalls — what we've seen",
        kind: "community",
        excerpt:
          "After triaging 200+ integration issues last year, here are the four buckets they fall into and the fastest way to diagnose each. Auth first, then rate limits, then webhooks, then version mismatches.",
        meta: "23 replies · pinned by admin",
      },
      {
        title: "Troubleshooting authentication failures",
        kind: "kb",
        excerpt:
          "Step-by-step guide for expired tokens, mis-scoped OAuth clients, and SSO assertion mismatches. Includes a flow chart for narrowing down where the failure is happening.",
        meta: "Official KB · updated March 2026",
      },
      {
        title: "Webhook deliveries stopped after the platform update",
        kind: "community",
        excerpt:
          "Anyone else seeing webhook deliveries return 401s post-upgrade? Looks like the signature header rotation got bumped to a new format and our verifier hadn't caught up.",
        meta: "14 replies · this week",
      },
      {
        title: "Building reliable integrations",
        kind: "course",
        excerpt:
          "A 6-lesson Skilljar course covering auth patterns, rate-limit-aware retry logic, idempotent webhook consumers, and version-pinning strategy.",
        meta: "Skilljar · 52 min",
      },
    ],
    clarifyResolutions: {
      auth: {
        agent: {
          paragraphs: [
            "Auth failures on this platform almost always trace back to one of three things: expired or rotated client credentials, an OAuth scope that no longer covers the resource you're calling, or an SSO assertion that's drifted out of sync after an IdP change.",
            "The fastest way to disambiguate is to look at the response: 401 with a token-related error message points at credentials; 403 points at scopes; 401 with an assertion or signature error points at SSO. Run the same call with a freshly minted token from the dev console — if it succeeds, you're looking at a credential lifecycle issue rather than a platform-side regression.",
          ],
          diagnosticSteps: [
            { label: "Refresh the access token and retry the failing call", status: "checked" },
            { label: "Compare requested scopes against the current OAuth client config", status: "checked" },
            { label: "Verify the IdP signing certificate hasn't rotated in the last 30 days", status: "checked" },
            { label: "Check the audit log for credential changes in your tenant", status: "found" },
          ],
          resolution:
            "Rotate the client secret in the integration admin panel, re-grant the missing scope, and retry. If the IdP cert has rotated, re-upload the new metadata XML on both sides.",
          resolutionLink: { label: "Open integration admin panel" },
          sources: [
            { title: "Troubleshooting authentication failures", kind: "kb", meta: "KB article · 7 min read" },
            { title: "OAuth scope reference", kind: "kb", meta: "KB article · 5 min read" },
            { title: "IdP certificate rotation runbook", kind: "kb", meta: "KB article · 6 min read" },
            { title: "Token expired in production — what we did", kind: "community", meta: "Accepted answer · 18 upvotes" },
            { title: "Authentication & access control fundamentals", kind: "course", meta: "Skilljar · 4 lessons" },
          ],
          followUps: [
            "How do I rotate the client secret without downtime?",
            "Can I require MFA at the IdP layer?",
            "What scopes does the new export endpoint need?",
          ],
          helpfulCount: 412,
        },
        reasoning: {
          posts: 1284,
          articles: 22,
          courses: 4,
          sourcesUsed: 5,
          durationMs: 980,
          steps: [
            "Filtered the 3,814 integration posts to authentication-tagged threads",
            "Ranked by accepted-answer count, recency, and admin-team upvotes",
            "Identified the three dominant failure modes (credentials, scopes, SSO certs)",
            "Drafted answer from the top 5 sources, prioritising the official KB",
            "Cross-checked the resolution path against the current platform auth docs",
          ],
        },
      },
      "rate-limits": {
        agent: {
          paragraphs: [
            "Rate-limit failures are usually silent — the platform returns 429 responses that downstream code mistakes for outages. The default account-level limit is 600 requests per minute per integration, with a separate 60-per-minute ceiling on write endpoints.",
            "If the failures are bursty rather than constant, you're almost certainly above the per-minute ceiling without realising it. The fix is to add jittered exponential backoff on 429s and to batch write calls where the endpoint supports it. The X-RateLimit-* response headers tell you exactly where you stand on each call.",
          ],
          diagnosticSteps: [
            { label: "Check the response status code distribution over the last 24h", status: "checked" },
            { label: "Inspect X-RateLimit-Remaining on a representative sample of calls", status: "checked" },
            { label: "Look for traffic bursts that cross the 60/min write ceiling", status: "found" },
          ],
          resolution:
            "Add jittered exponential backoff on 429 responses and batch any write calls that fan out into more than a handful of requests. The bulk endpoints accept up to 100 records per call.",
          resolutionLink: { label: "Open API rate limit dashboard" },
          sources: [
            { title: "API rate limits and retry semantics", kind: "kb", meta: "KB article · 5 min read" },
            { title: "Bulk endpoints reference", kind: "kb", meta: "KB article · 8 min read" },
            { title: "Recommended retry patterns", kind: "kb", meta: "KB article · 4 min read" },
            { title: "Mystery 429s during nightly sync — solved", kind: "community", meta: "Accepted answer · 24 upvotes" },
            { title: "Building reliable integrations", kind: "course", meta: "Skilljar · 6 lessons" },
          ],
          followUps: [
            "Can I request a higher rate-limit ceiling?",
            "What's the right retry budget for writes?",
            "Do bulk endpoints count as one call or many?",
          ],
          helpfulCount: 318,
        },
        reasoning: {
          posts: 942,
          articles: 18,
          courses: 4,
          sourcesUsed: 5,
          durationMs: 870,
          steps: [
            "Filtered to rate-limit and 429-tagged threads from the last 12 months",
            "Confirmed the per-minute and per-endpoint ceilings against current platform docs",
            "Identified the bulk-endpoint and backoff patterns as the dominant fix",
            "Drafted answer from the top 5 sources, prioritising official rate-limit reference",
          ],
        },
      },
      webhooks: {
        agent: {
          paragraphs: [
            "Webhook delivery failures fall into three buckets: TLS / certificate issues at the consumer endpoint, signature verification mismatches after a signing-key rotation, and consumer endpoints returning a non-2xx response within the retry window. Each one looks distinct in the delivery log.",
            "Start with the platform's delivery log filtered to your endpoint URL. If you see lots of `connect_error` rows, that's TLS. `signature_invalid` means the consumer is using a stale signing secret. `non_2xx` means the consumer accepted the request but returned an error — that's almost always a bug in the handler, not in delivery.",
          ],
          diagnosticSteps: [
            { label: "Filter the delivery log to the failing webhook endpoint", status: "checked" },
            { label: "Group failures by error type (connect_error / signature_invalid / non_2xx)", status: "checked" },
            { label: "Check whether the signing secret was rotated in the last 14 days", status: "found" },
          ],
          resolution:
            "Re-fetch the current signing secret from the integration admin panel and redeploy the verifier. For TLS issues, confirm your endpoint accepts TLS 1.2+ and the certificate chain is complete.",
          resolutionLink: { label: "Open webhook delivery log" },
          sources: [
            { title: "Webhook delivery best practices", kind: "kb", meta: "KB article · 9 min read" },
            { title: "Signature verification reference", kind: "kb", meta: "KB article · 6 min read" },
            { title: "Webhook deliveries stopped after the platform update", kind: "community", meta: "14 replies · this week" },
            { title: "Idempotent webhook consumer patterns", kind: "community", meta: "Accepted answer · 19 upvotes" },
            { title: "Building reliable integrations", kind: "course", meta: "Skilljar · 6 lessons" },
          ],
          followUps: [
            "How do I make my webhook consumer idempotent?",
            "What's the retry schedule for failed deliveries?",
            "Can I replay a failed delivery from the log?",
          ],
          helpfulCount: 286,
        },
        reasoning: {
          posts: 716,
          articles: 14,
          courses: 4,
          sourcesUsed: 5,
          durationMs: 910,
          steps: [
            "Filtered to webhook-tagged threads from the last 12 months",
            "Grouped by reported error type (TLS, signature, non-2xx) to find dominant patterns",
            "Cross-referenced the recent platform update notes for signing-secret changes",
            "Drafted answer from the top 5 sources, prioritising the delivery-best-practices KB",
          ],
        },
      },
      "api-version": {
        agent: {
          paragraphs: [
            "Field-shape mismatches and unexpected 400s after a working integration suddenly breaking are usually a sign that the API version you're calling has changed. Each integration pins a version when it's created; once that version is sunset, calls automatically roll forward to the current version, and any breaking changes between them surface as runtime errors.",
            "Check the `X-API-Version` header on a working historical response and compare it to today's. If they differ, you're past the sunset date. The migration guide for each version covers the specific breaking changes — most are field renames or moves from top-level to nested objects.",
          ],
          diagnosticSteps: [
            { label: "Read X-API-Version on a current response and on a historical one", status: "checked" },
            { label: "Confirm the integration's pinned version hasn't been sunset", status: "checked" },
            { label: "Diff the version migration guides for any field-shape changes", status: "found" },
          ],
          resolution:
            "Pin the integration to the latest stable version explicitly via the integration admin panel, then update field mappings according to the v3 → v4 migration guide.",
          resolutionLink: { label: "Open version migration guide" },
          sources: [
            { title: "API versioning policy", kind: "kb", meta: "KB article · 4 min read" },
            { title: "v3 → v4 migration guide", kind: "kb", meta: "KB article · 12 min read" },
            { title: "Version sunset schedule", kind: "kb", meta: "KB article · 2 min read" },
            { title: "Caught off-guard by the v4 cutover — lessons learned", kind: "community", meta: "Accepted answer · 22 upvotes" },
            { title: "Building reliable integrations", kind: "course", meta: "Skilljar · 6 lessons" },
          ],
          followUps: [
            "How long is the deprecation window for each version?",
            "Can I subscribe to version sunset announcements?",
            "What's changed between v3 and v4 specifically?",
          ],
          helpfulCount: 247,
        },
        reasoning: {
          posts: 532,
          articles: 16,
          courses: 4,
          sourcesUsed: 5,
          durationMs: 820,
          steps: [
            "Filtered to version-related threads from the last 18 months",
            "Cross-checked the platform's current sunset schedule",
            "Identified the v3 → v4 cutover as the most likely recent break",
            "Drafted answer from the top 5 sources, prioritising the migration guide",
          ],
        },
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

type Mode = "current" | "forethought";

export function ForethoughtDemo({
  initialScenario = "sso",
  initialMode = "forethought",
  initialPick = null,
}: {
  initialScenario?: ScenarioId;
  initialMode?: Mode;
  initialPick?: ClarifyPickId | null;
} = {}) {
  const [scenarioId, setScenarioId] = useState<ScenarioId>(initialScenario);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [thinking, setThinking] = useState(false);
  // Clarify scenario — which option the user picked, if any.
  const [pickedOption, setPickedOption] = useState<ClarifyPickId | null>(
    initialScenario === "clarify" ? initialPick : null
  );

  // 400ms thinking state when scenario or mode changes — sells the
  // "actually working" feel without the demo-breaking risk of real latency.
  useEffect(() => {
    setThinking(true);
    const t = setTimeout(() => setThinking(false), 400);
    return () => clearTimeout(t);
  }, [scenarioId, mode]);

  // Reset the clarify pick when leaving the clarify scenario so stale
  // state can't bleed into the others.
  useEffect(() => {
    if (scenarioId !== "clarify") setPickedOption(null);
  }, [scenarioId]);

  const scenario = SCENARIOS[scenarioId];

  // Demo controls (scenario picker + mode toggle) live in the debug dock —
  // intentionally not on the page so the surface reads as production UI
  // during a screenshare. The dock deep-links via ?scenario=, ?mode=, ?pick=.
  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 pb-20 pt-7 sm:px-5 md:px-7 md:pt-9">
      <SearchBar query={scenario.query} />

      <div className="mt-5">
        {thinking ? (
          <ThinkingBlock mode={mode} />
        ) : mode === "forethought" ? (
          <ForethoughtAnswer
            scenario={scenario}
            pickedOption={scenarioId === "clarify" ? pickedOption : null}
            onPick={setPickedOption}
          />
        ) : (
          <CurrentAiAnswer scenario={scenario} />
        )}
      </div>

      <CommunityResults scenario={scenario} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Search bar — decorative
// ─────────────────────────────────────────────────────────────────────────────

function SearchBar({ query }: { query: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-white px-4 py-3 shadow-[0_1px_4px_-1px_rgba(0,0,0,0.04)]">
      <Search className="h-4 w-4 text-black/40" strokeWidth={2} />
      <span className="flex-1 truncate text-[15px] text-foreground">{query}</span>
      <kbd className="rounded border border-black/[0.1] bg-black/[0.03] px-1.5 py-0.5 text-[10px] font-medium text-black/50">
        ⌘K
      </kbd>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Thinking state — 400ms transition
// ─────────────────────────────────────────────────────────────────────────────

function ThinkingBlock({ mode }: { mode: Mode }) {
  const isAgent = mode === "forethought";
  return (
    <div
      className="rounded-2xl border bg-white p-6 shadow-[0_1px_4px_-1px_rgba(0,0,0,0.04)]"
      style={{
        borderColor: isAgent ? FT_TEAL_BORDER : "rgba(0,0,0,0.08)",
        backgroundColor: isAgent ? "white" : "white",
      }}
    >
      <div className="flex items-center gap-2">
        {isAgent ? (
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
              style={{ backgroundColor: FT_TEAL }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: FT_TEAL }}
            />
          </span>
        ) : (
          <Sparkles className="h-3 w-3 animate-pulse text-foreground/55" strokeWidth={2.25} />
        )}
        <span
          className="text-[12.5px] font-semibold uppercase tracking-wider"
          style={{ color: isAgent ? FT_TEAL_DARK : "rgb(82,82,91)" }}
        >
          {isAgent ? "Community Agent thinking…" : "Drafting answer…"}
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-2.5">
        {[100, 92, 78].map((w, i) => (
          <div
            key={i}
            className="h-3 animate-pulse rounded-md bg-black/[0.05]"
            style={{ width: `${w}%`, animationDelay: `${i * 70}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Current AI Answers — the "before" state for the comparison toggle.
// Matches the production AI Answers hero on communities.gainsight.com
// (also reused at /ai-answer): bordered light-blue card, "AI Answers"
// eyebrow, "Summary — <query>" title, bulleted body left, sources column
// right with "Show all" expander, "Continue reading" affordance.
// ─────────────────────────────────────────────────────────────────────────────

function CurrentAiAnswer({ scenario }: { scenario: Scenario }) {
  const { basic, query } = scenario;
  const [expanded, setExpanded] = useState(false);
  const [showAllSources, setShowAllSources] = useState(false);

  // Reset expanded/show-all when the underlying scenario changes — without
  // this, switching scenarios mid-demo could carry the wrong state across.
  useEffect(() => {
    setExpanded(false);
    setShowAllSources(false);
  }, [scenario.id]);

  const visibleSources = showAllSources
    ? basic.sources.slice(0, 10)
    : basic.sources.slice(0, 3);
  const hasMoreSources = basic.sources.length > 3;
  const totalShown = visibleSources.length;

  return (
    <section className="rounded-2xl border border-[#1B5BA8]/20 bg-[#F4F8FB] p-5 sm:p-6">
      <div className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.07em] text-[#1B5BA8]">
        <Sparkles className="h-3 w-3" strokeWidth={2.25} />
        AI Answers
      </div>

      <h2 className="mt-3 text-[22px] font-semibold leading-[1.25] tracking-[-0.01em] text-foreground sm:text-[24px]">
        Summary — {query.replace(/\?$/, "").toLowerCase()}
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="relative">
          <div
            className={`flex flex-col gap-2.5 overflow-hidden transition-[max-height] duration-300 ${
              expanded ? "max-h-[2000px]" : "max-h-[230px]"
            }`}
          >
            <ul className="flex flex-col gap-2.5">
              {basic.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-[14.5px] leading-[1.55] text-foreground/85"
                >
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-foreground/55" />
                  <span>
                    {b.text}
                    {b.citation && (
                      <span className="ml-1.5 text-foreground/50">
                        [{b.citation}]
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {!expanded && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F4F8FB] via-[#F4F8FB]/85 to-transparent" />
          )}
        </div>

        <aside className="flex flex-col gap-2 self-start">
          {visibleSources.map((s, i) => (
            <BasicSourceCard key={i} source={s} />
          ))}

          {hasMoreSources && (
            <button
              onClick={() => setShowAllSources((v) => !v)}
              className="mt-1 inline-flex items-center justify-center gap-1 rounded-md py-1.5 text-[12.5px] font-semibold text-[#1B5BA8] hover:bg-[#1B5BA8]/[0.06]"
            >
              {showAllSources
                ? `Show fewer · ${totalShown} of ${Math.min(basic.sources.length, 10)}`
                : `Show all sources · ${Math.min(basic.sources.length, 10)}`}
              <ChevronDown
                className={`h-3 w-3 transition-transform ${
                  showAllSources ? "rotate-180" : ""
                }`}
                strokeWidth={2.25}
              />
            </button>
          )}
        </aside>
      </div>

      {!expanded ? (
        <div className="mt-4">
          <button
            onClick={() => setExpanded(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-black/[0.08] bg-white py-2.5 text-[13px] font-semibold text-foreground/80 transition-all hover:border-black/[0.15] hover:bg-white/90"
          >
            Continue reading
            <ChevronDown className="h-3 w-3" strokeWidth={2.25} />
          </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          <BasicHelpfulFeedback />
          <button
            onClick={() => setExpanded(false)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-black/[0.08] bg-white py-2.5 text-[13px] font-semibold text-foreground/65 transition-all hover:border-black/[0.15] hover:text-foreground/85"
          >
            Show less
            <ChevronDown className="h-3 w-3 rotate-180" strokeWidth={2.25} />
          </button>
        </div>
      )}
    </section>
  );
}

function BasicSourceCard({ source }: { source: Source }) {
  const Icon =
    source.kind === "kb"
      ? FileText
      : source.kind === "course"
        ? GraduationCap
        : MessagesSquare;
  const tone =
    source.kind === "kb"
      ? "#6E3CFF"
      : source.kind === "course"
        ? "#10B981"
        : "#0EA5E9";
  const label =
    source.kind === "kb"
      ? "KB"
      : source.kind === "course"
        ? "Course"
        : "Community";
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="block rounded-xl border border-black/[0.06] bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-black/[0.12] hover:shadow-[0_2px_14px_-6px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3" strokeWidth={2.25} style={{ color: tone }} />
        <span
          className="text-[9.5px] font-bold uppercase tracking-wide"
          style={{ color: tone }}
        >
          {label}
        </span>
        {source.meta && (
          <>
            <span className="text-foreground/30">·</span>
            <span className="text-[10.5px] text-foreground/55">{source.meta}</span>
          </>
        )}
      </div>
      <h4 className="mt-1 line-clamp-2 text-[13.5px] font-semibold leading-[1.3] text-foreground">
        {source.title}
      </h4>
    </a>
  );
}

function BasicHelpfulFeedback() {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  return (
    <div className="flex items-center gap-3 border-t border-black/[0.08] pt-3 text-[13px] text-foreground/65">
      <span className="font-medium">
        {vote === null
          ? "Is this helpful?"
          : vote === "up"
            ? "Thanks — glad this helped."
            : "Thanks for the feedback — we'll keep refining."}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setVote((v) => (v === "up" ? null : "up"))}
          aria-pressed={vote === "up"}
          aria-label="Helpful"
          className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
            vote === "up"
              ? "bg-emerald-500/15 text-emerald-700"
              : "text-foreground/55 hover:bg-black/[0.04] hover:text-foreground/85"
          }`}
        >
          <ThumbsUp className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        <button
          onClick={() => setVote((v) => (v === "down" ? null : "down"))}
          aria-pressed={vote === "down"}
          aria-label="Not helpful"
          className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
            vote === "down"
              ? "bg-rose-500/15 text-rose-700"
              : "text-foreground/55 hover:bg-black/[0.04] hover:text-foreground/85"
          }`}
        >
          <ThumbsDown className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Forethought Community Agent — the "after" state
// ─────────────────────────────────────────────────────────────────────────────

function ForethoughtAnswer({
  scenario,
  pickedOption,
  onPick,
}: {
  scenario: Scenario;
  pickedOption?: ClarifyPickId | null;
  onPick?: (id: ClarifyPickId) => void;
}) {
  const { agent, reasoning } = scenario;
  const resolution =
    pickedOption && scenario.clarifyResolutions?.[pickedOption];
  const pickedLabel =
    pickedOption && agent.clarifyOptions?.find((o) => o.id === pickedOption)?.label;

  return (
    <section
      className="overflow-hidden rounded-2xl border bg-white shadow-[0_4px_24px_-12px_rgba(15,76,92,0.18)]"
      style={{ borderColor: FT_TEAL_BORDER }}
    >
      {/* Top accent strip — subtle gradient to suggest "premium layer on top" */}
      <div
        className="h-[3px] w-full"
        style={{
          background: `linear-gradient(90deg, ${FT_TEAL_DARK}, ${FT_TEAL}, #14B8A6)`,
        }}
      />

      <div className="p-5 sm:p-6">
        <AgentHeader />

        {/* Direct answer paragraphs */}
        <div className="mt-4 flex flex-col gap-2.5">
          {agent.paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-[14.5px] leading-[1.6] text-foreground/85"
            >
              {p}
            </p>
          ))}
        </div>

        {/* Diagnostic steps — multi-step workflow scenario */}
        {agent.diagnosticSteps && (
          <div className="mt-4 flex flex-col gap-2 rounded-xl border border-black/[0.05] bg-[#FAFBFC] p-4">
            <div
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em]"
              style={{ color: FT_TEAL_DARK }}
            >
              <Workflow className="h-3 w-3" strokeWidth={2.25} />
              What I checked
            </div>
            <ol className="flex flex-col gap-1.5">
              {agent.diagnosticSteps.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-[13.5px] leading-[1.5] text-foreground/85"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10.5px] font-semibold tabular-nums text-white"
                    style={{
                      backgroundColor:
                        step.status === "found" ? "#F59E0B" : FT_TEAL,
                    }}
                  >
                    {step.status === "found" ? (
                      <Zap className="h-2.5 w-2.5" strokeWidth={2.5} />
                    ) : (
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    )}
                  </span>
                  <span>
                    <span
                      className="mr-1.5 font-semibold tabular-nums"
                      style={{ color: FT_TEAL_DARK }}
                    >
                      {i + 1}.
                    </span>
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Resolution box */}
        {agent.resolution && (
          <div
            className="mt-3 flex flex-col gap-2 rounded-xl border p-4"
            style={{
              borderColor: FT_TEAL_BORDER,
              backgroundColor: FT_TEAL_TINT,
            }}
          >
            <div
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em]"
              style={{ color: FT_TEAL_DARK }}
            >
              <Lightbulb className="h-3 w-3" strokeWidth={2.25} />
              Resolution
            </div>
            <p className="text-[13.5px] leading-[1.6] text-foreground/85">
              {agent.resolution}
            </p>
            {agent.resolutionLink && (
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-semibold text-white"
                style={{ backgroundColor: FT_TEAL_DARK }}
              >
                {agent.resolutionLink.label}
                <ArrowRight className="h-3 w-3" strokeWidth={2.25} />
              </a>
            )}
          </div>
        )}

        {/* Clarification — agent asks a multi-choice question rather than
            guessing at an ambiguous query. Sources / follow-ups / helpful
            count are intentionally hidden — they appear on the next turn. */}
        {agent.isClarification &&
          agent.clarifyOptions &&
          agent.clarifyOptions.length > 0 && (
            <div
              className="mt-4 flex flex-col gap-2.5 rounded-xl border p-4"
              style={{
                borderColor: FT_TEAL_BORDER,
                backgroundColor: FT_TEAL_TINT,
              }}
            >
              {agent.clarifyEyebrow && (
                <div
                  className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em]"
                  style={{ color: FT_TEAL_DARK }}
                >
                  <Lightbulb className="h-3 w-3" strokeWidth={2.25} />
                  {agent.clarifyEyebrow}
                </div>
              )}
              <div className="flex flex-col gap-2">
                {agent.clarifyOptions.map((opt) => {
                  const active = pickedOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onPick?.(opt.id)}
                      aria-pressed={active}
                      className={cn(
                        "group flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-[13.5px] font-semibold transition-colors",
                        active
                          ? "shadow-sm"
                          : "bg-white hover:bg-white/70"
                      )}
                      style={
                        active
                          ? {
                              borderColor: FT_TEAL_DARK,
                              backgroundColor: FT_TEAL_DARK,
                              color: "white",
                            }
                          : {
                              borderColor: FT_TEAL_BORDER,
                              color: FT_TEAL_DARK,
                            }
                      }
                    >
                      <span className="flex items-center gap-2">
                        {active && (
                          <Check className="h-3.5 w-3.5" strokeWidth={2.75} />
                        )}
                        {opt.label}
                      </span>
                      <ArrowRight
                        className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
                        strokeWidth={2.25}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-[11.5px] text-foreground/55">
                {pickedOption
                  ? "Pick a different option to see the focused answer for that area."
                  : "Picking one narrows the search and lets me draft a focused answer with the right sources."}
              </p>
            </div>
          )}

        {/* Second turn — focused resolution after the user picks an option.
            Renders as a chat-style continuation: a user message bubble
            with the chosen label, then the agent's follow-up answer
            (paragraphs, diagnostic steps, resolution, sources, follow-ups,
            helpful counter). */}
        {agent.isClarification && resolution && pickedLabel && (
          <ResolutionTurn
            pickedLabel={pickedLabel}
            agent={resolution.agent}
            reasoning={resolution.reasoning}
          />
        )}

        {/* Escalation — refund scenario */}
        {agent.isEscalation && (
          <div
            className="mt-4 flex flex-col gap-3 rounded-xl border p-4"
            style={{
              borderColor: FT_TEAL_BORDER,
              backgroundColor: FT_TEAL_TINT,
            }}
          >
            {agent.escalationCopy && (
              <p className="text-[13.5px] leading-[1.6] text-foreground/85">
                {agent.escalationCopy}
              </p>
            )}
            <button
              className="inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-sm"
              style={{ backgroundColor: FT_TEAL_DARK }}
            >
              <Headset className="h-4 w-4" strokeWidth={2} />
              Connect you with our team
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
            </button>
            <p className="text-[11.5px] text-foreground/55">
              Your conversation will be attached automatically — no need to repeat yourself.
            </p>
          </div>
        )}

        {/* How I got here — reasoning trace */}
        <ReasoningExpander reasoning={reasoning} />

        {/* Source chips — hidden in the clarification scenario, since no
            sources have been retrieved yet on this turn. */}
        {!agent.isClarification && agent.sources.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-foreground/55">
              Drawn from
            </div>
            <div className="flex flex-col gap-2">
              {agent.sources.map((s, i) => (
                <SourceChip key={i} source={s} />
              ))}
            </div>
          </div>
        )}

        {/* Follow-ups — hidden in the clarification scenario; the multi-
            choice buttons above are themselves the follow-up. */}
        {!agent.isClarification && agent.followUps.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-foreground/55">
              Suggested follow-ups
            </div>
            <div className="flex flex-wrap gap-1.5">
              {agent.followUps.map((q, i) => (
                <button
                  key={i}
                  className="rounded-full border bg-white px-3 py-1.5 text-[12.5px] font-medium transition-colors"
                  style={{
                    borderColor: FT_TEAL_BORDER,
                    color: FT_TEAL_DARK,
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer — feedback + escalation link. In the clarify scenario:
              • Before a pick — show a soft hint (no helpful counter yet).
              • After a pick — the resolution turn renders its own footer,
                so we suppress this one entirely. */}
        {!(agent.isClarification && resolution) && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-4">
            {agent.isClarification ? (
              <span className="text-[12px] font-medium text-foreground/55">
                Pick an option above to get a focused answer
              </span>
            ) : (
              <HelpfulCounter count={agent.helpfulCount} />
            )}
            {!agent.isEscalation && !agent.isClarification && (
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-foreground/55 transition-colors hover:text-foreground/85"
              >
                Still need help? Open a ticket
                <ArrowRight className="h-3 w-3" strokeWidth={2.25} />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* Second-turn renderer for the clarify scenario. Sits inside the
   ForethoughtAnswer card after the user picks an option, so the whole
   conversation reads as a single agent thread. Renders a "user picked
   X" message, then the focused agent response (paragraphs +
   diagnostic steps + resolution + sources + follow-ups + helpful
   counter), reusing the existing visual primitives. */
function ResolutionTurn({
  pickedLabel,
  agent,
  reasoning,
}: {
  pickedLabel: string;
  agent: AgentResponse;
  reasoning: ReasoningTrace;
}) {
  return (
    <div className="mt-5 flex flex-col gap-4 border-t border-dashed border-black/[0.08] pt-5">
      {/* User pick — right-aligned chat bubble */}
      <div className="flex items-start justify-end gap-3">
        <div
          className="max-w-[420px] rounded-2xl rounded-tr-sm px-4 py-2.5 text-[13.5px] font-medium text-white shadow-sm"
          style={{ backgroundColor: FT_TEAL_DARK }}
        >
          {pickedLabel}
        </div>
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground/85 text-[11px] font-semibold text-background">
          You
        </div>
      </div>

      {/* Agent's focused follow-up — paragraphs */}
      <div className="flex flex-col gap-2.5">
        {agent.paragraphs.map((p, i) => (
          <p key={i} className="text-[14.5px] leading-[1.6] text-foreground/85">
            {p}
          </p>
        ))}
      </div>

      {/* Diagnostic steps */}
      {agent.diagnosticSteps && agent.diagnosticSteps.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl border border-black/[0.05] bg-[#FAFBFC] p-4">
          <div
            className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em]"
            style={{ color: FT_TEAL_DARK }}
          >
            <Workflow className="h-3 w-3" strokeWidth={2.25} />
            What I checked
          </div>
          <ol className="flex flex-col gap-1.5">
            {agent.diagnosticSteps.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[13.5px] leading-[1.5] text-foreground/85"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10.5px] font-semibold tabular-nums text-white"
                  style={{
                    backgroundColor:
                      step.status === "found" ? "#F59E0B" : FT_TEAL,
                  }}
                >
                  {step.status === "found" ? (
                    <Zap className="h-2.5 w-2.5" strokeWidth={2.5} />
                  ) : (
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  )}
                </span>
                <span>
                  <span
                    className="mr-1.5 font-semibold tabular-nums"
                    style={{ color: FT_TEAL_DARK }}
                  >
                    {i + 1}.
                  </span>
                  {step.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Resolution box */}
      {agent.resolution && (
        <div
          className="flex flex-col gap-2 rounded-xl border p-4"
          style={{
            borderColor: FT_TEAL_BORDER,
            backgroundColor: FT_TEAL_TINT,
          }}
        >
          <div
            className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em]"
            style={{ color: FT_TEAL_DARK }}
          >
            <Lightbulb className="h-3 w-3" strokeWidth={2.25} />
            Resolution
          </div>
          <p className="text-[13.5px] leading-[1.6] text-foreground/85">
            {agent.resolution}
          </p>
          {agent.resolutionLink && (
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-semibold text-white"
              style={{ backgroundColor: FT_TEAL_DARK }}
            >
              {agent.resolutionLink.label}
              <ArrowRight className="h-3 w-3" strokeWidth={2.25} />
            </a>
          )}
        </div>
      )}

      {/* Reasoning trace for this focused turn */}
      <ReasoningExpander reasoning={reasoning} />

      {/* Sources */}
      {agent.sources.length > 0 && (
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-foreground/55">
            Drawn from
          </div>
          <div className="flex flex-col gap-2">
            {agent.sources.map((s, i) => (
              <SourceChip key={i} source={s} />
            ))}
          </div>
        </div>
      )}

      {/* Follow-ups */}
      {agent.followUps.length > 0 && (
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-foreground/55">
            Suggested follow-ups
          </div>
          <div className="flex flex-wrap gap-1.5">
            {agent.followUps.map((q, i) => (
              <button
                key={i}
                className="rounded-full border bg-white px-3 py-1.5 text-[12.5px] font-medium transition-colors"
                style={{
                  borderColor: FT_TEAL_BORDER,
                  color: FT_TEAL_DARK,
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-4">
        <HelpfulCounter count={agent.helpfulCount} />
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-1 text-[12px] font-medium text-foreground/55 transition-colors hover:text-foreground/85"
        >
          Still need help? Open a ticket
          <ArrowRight className="h-3 w-3" strokeWidth={2.25} />
        </a>
      </div>
    </div>
  );
}

function AgentHeader() {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <Avatar />
        <div className="flex flex-col leading-[1.2]">
          <span className="text-[14.5px] font-semibold text-foreground">
            Community Agent
          </span>
          <span className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-foreground/45">
            Online · usually resolves in &lt; 30 seconds
          </span>
        </div>
      </div>

      <PoweredByForethought />
    </div>
  );
}

function Avatar() {
  return (
    <div className="relative">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${FT_TEAL}, ${FT_TEAL_DARK})`,
        }}
      >
        <Bot className="h-5 w-5" strokeWidth={2} />
      </div>
      {/* Animated online dot */}
      <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
      </span>
    </div>
  );
}

function PoweredByForethought() {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-black/[0.04] px-2.5 py-1 text-[10.5px] font-medium text-foreground/65">
      Powered by
      <span
        className="inline-flex items-center gap-0.5 font-semibold"
        style={{ color: FT_TEAL_DARK }}
      >
        <ForethoughtMark />
        Forethought
      </span>
      <span className="text-foreground/40">AI Agents by Zendesk</span>
    </div>
  );
}

function ForethoughtMark() {
  // Compact mark — three teal vertical bars suggesting the Forethought signal.
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="mr-0.5"
    >
      <rect x="1" y="3" width="2" height="6" rx="1" fill={FT_TEAL_DARK} />
      <rect x="5" y="1" width="2" height="10" rx="1" fill={FT_TEAL} />
      <rect x="9" y="3.5" width="2" height="5" rx="1" fill={FT_TEAL_DARK} />
    </svg>
  );
}

function ReasoningExpander({ reasoning }: { reasoning: ReasoningTrace }) {
  const [open, setOpen] = useState(false);
  const totalSearched =
    reasoning.posts + reasoning.articles + reasoning.courses;

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold transition-colors"
        style={{
          borderColor: FT_TEAL_BORDER,
          color: FT_TEAL_DARK,
          backgroundColor: open ? FT_TEAL_TINT : "white",
        }}
      >
        <Workflow className="h-3 w-3" strokeWidth={2.25} />
        How I got here
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2.25}
        />
      </button>

      {open && (
        <div
          className="mt-2 rounded-xl border p-3.5"
          style={{
            borderColor: FT_TEAL_BORDER,
            backgroundColor: FT_TEAL_TINT,
          }}
        >
          {totalSearched > 0 && (
            <div className="mb-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px]">
              <Stat label="Posts searched" value={reasoning.posts.toLocaleString()} />
              <Stat label="KB articles" value={reasoning.articles.toLocaleString()} />
              <Stat label="Courses" value={reasoning.courses.toLocaleString()} />
              <Stat
                label="Sources used"
                value={reasoning.sourcesUsed.toLocaleString()}
              />
              <Stat label="Time" value={`${reasoning.durationMs} ms`} />
            </div>
          )}
          <ol className="flex flex-col gap-1.5">
            {reasoning.steps.map((s, i) => (
              <li
                key={i}
                className="flex gap-2 text-[12.5px] leading-[1.5] text-foreground/80"
              >
                <span
                  className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: FT_TEAL_DARK }}
                />
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1">
      <span
        className="font-semibold tabular-nums"
        style={{ color: FT_TEAL_DARK }}
      >
        {value}
      </span>
      <span className="text-foreground/55">{label}</span>
    </div>
  );
}

function SourceChip({ source }: { source: Source }) {
  const Icon = source.kind === "kb" ? FileText : source.kind === "course" ? GraduationCap : MessagesSquare;
  const tone =
    source.kind === "kb"
      ? "#6E3CFF"
      : source.kind === "course"
        ? "#10B981"
        : "#0EA5E9";
  const label =
    source.kind === "kb" ? "KB" : source.kind === "course" ? "Course" : "Community";
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="group flex items-center gap-3 rounded-lg border border-black/[0.06] bg-white p-2.5 transition-all hover:-translate-y-0.5 hover:border-black/[0.12] hover:shadow-[0_2px_14px_-6px_rgba(0,0,0,0.08)]"
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
        style={{
          backgroundColor: `color-mix(in oklch, ${tone} 14%, white)`,
          color: tone,
        }}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col leading-[1.25]">
        <div className="flex items-center gap-1.5">
          <span
            className="text-[9.5px] font-bold uppercase tracking-wide"
            style={{ color: tone }}
          >
            {label}
          </span>
          {source.meta && (
            <>
              <span className="text-foreground/30">·</span>
              <span className="text-[10.5px] text-foreground/55">{source.meta}</span>
            </>
          )}
        </div>
        <span className="truncate text-[13px] font-semibold text-foreground">
          {source.title}
        </span>
      </div>
      <ExternalLink
        className="h-3 w-3 shrink-0 text-foreground/35 transition-colors group-hover:text-foreground/70"
        strokeWidth={2.25}
      />
    </a>
  );
}

function HelpfulCounter({ count }: { count: number }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const adjusted =
    vote === "up" ? count + 1 : vote === "down" ? Math.max(0, count - 1) : count;

  return (
    <div className="flex items-center gap-2 text-[12px] text-foreground/65">
      <span className="font-medium">
        Helpful for{" "}
        <span className="font-semibold tabular-nums text-foreground">
          {adjusted.toLocaleString()}
        </span>{" "}
        {adjusted === 1 ? "person" : "people"}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setVote((v) => (v === "up" ? null : "up"))}
          aria-pressed={vote === "up"}
          aria-label="Helpful"
          className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
            vote === "up"
              ? "bg-emerald-500/15 text-emerald-700"
              : "text-foreground/55 hover:bg-black/[0.04] hover:text-foreground/85"
          }`}
        >
          <ThumbsUp className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        <button
          onClick={() => setVote((v) => (v === "down" ? null : "down"))}
          aria-pressed={vote === "down"}
          aria-label="Not helpful"
          className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
            vote === "down"
              ? "bg-rose-500/15 text-rose-700"
              : "text-foreground/55 hover:bg-black/[0.04] hover:text-foreground/85"
          }`}
        >
          <ThumbsDown className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Community results — section below the answer
// ─────────────────────────────────────────────────────────────────────────────

function CommunityResults({ scenario }: { scenario: Scenario }) {
  const { communityResults, query } = scenario;
  // Reset filters when the scenario changes so a stale "Course"-only filter
  // from one scenario doesn't carry over and hide everything in the next.
  const [selected, setSelected] = useState<Set<SourceKind>>(new Set());
  useEffect(() => {
    setSelected(new Set());
  }, [scenario.id]);

  // Counts per type drive both the rail's badges and which checkboxes are
  // tappable — types with zero results in the current scenario are dimmed.
  const counts = useMemo(() => {
    const c: Record<SourceKind, number> = { community: 0, kb: 0, course: 0 };
    for (const r of communityResults) c[r.kind] += 1;
    return c;
  }, [communityResults]);

  const filtered = useMemo(() => {
    if (selected.size === 0) return communityResults;
    return communityResults.filter((r) => selected.has(r.kind));
  }, [communityResults, selected]);

  const toggle = (k: SourceKind) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  if (communityResults.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-[18px] font-semibold leading-[1.25] text-foreground">
        Search results for:{" "}
        <span className="font-medium text-foreground/65">{query}</span>
      </h2>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <ResultsFilters
          selected={selected}
          counts={counts}
          onToggle={toggle}
          onClear={() => setSelected(new Set())}
        />

        <section className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-foreground/55">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
              {selected.size > 0 &&
                ` · filtered to ${selected.size} type${selected.size === 1 ? "" : "s"}`}
            </span>
            <span className="text-[12px] text-foreground/40">Most relevant first</span>
          </div>

          <ul className="flex flex-col gap-2.5">
            {filtered.map((r, i) => (
              <li key={i}>
                <ResultRow row={r} />
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
    </section>
  );
}

const FILTER_TYPE_LABELS: Record<SourceKind, string> = {
  community: "Community",
  kb: "Knowledge base",
  course: "Courses",
};

function ResultsFilters({
  selected,
  counts,
  onToggle,
  onClear,
}: {
  selected: Set<SourceKind>;
  counts: Record<SourceKind, number>;
  onToggle: (k: SourceKind) => void;
  onClear: () => void;
}) {
  return (
    <aside className="flex w-full flex-col gap-4 lg:w-[220px] lg:shrink-0">
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-foreground/55">
            Type
          </h3>
          {selected.size > 0 && (
            <button
              onClick={onClear}
              className="text-[11px] font-medium text-[var(--accent-strong)] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <ul className="flex flex-col gap-0.5">
          {(Object.keys(FILTER_TYPE_LABELS) as SourceKind[]).map((k) => {
            const isOn = selected.has(k);
            const count = counts[k] ?? 0;
            const disabled = count === 0;
            return (
              <li key={k}>
                <button
                  onClick={() => onToggle(k)}
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
                    {FILTER_TYPE_LABELS[k]}
                  </span>
                  <span className="text-[11px] tabular-nums text-foreground/40">
                    {count}
                  </span>
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
          {["All sources", "Community", "Knowledge Base", "Skilljar Academy"].map(
            (s, i) => (
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
            )
          )}
        </ul>
      </section>
    </aside>
  );
}

function ResultRow({
  row,
}: {
  row: { title: string; kind: SourceKind; excerpt: string; meta: string };
}) {
  const Icon = row.kind === "kb" ? FileText : row.kind === "course" ? GraduationCap : MessagesSquare;
  const tone =
    row.kind === "kb"
      ? "#6E3CFF"
      : row.kind === "course"
        ? "#10B981"
        : "#0EA5E9";
  const label =
    row.kind === "kb" ? "KB Article" : row.kind === "course" ? "Course" : "Community";
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="group flex flex-col gap-2 rounded-xl border border-black/[0.07] bg-white p-3.5 transition-all hover:border-black/[0.12] hover:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)]"
    >
      <header className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{
            backgroundColor: `color-mix(in oklch, ${tone} 14%, white)`,
            color: tone,
          }}
        >
          <Icon className="h-2.5 w-2.5" strokeWidth={2.25} />
          {label}
        </span>
        <span className="text-[11px] text-foreground/55">{row.meta}</span>
      </header>
      <h3 className="text-[15px] font-semibold leading-snug text-foreground">
        {row.title}
      </h3>
      <p className="line-clamp-2 max-w-[80ch] text-[13px] leading-[1.45] text-foreground/65">
        {row.excerpt}
      </p>
    </a>
  );
}
