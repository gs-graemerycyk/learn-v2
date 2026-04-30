// Canonical stub answer for the Learn page prototype.
//
// The Learn page is the "Long Answer" outcome of the search-intent system.
// When a user query is classified as Long-Answer intent (vs. Classic Search,
// Short Answer, or Support Escalation), the page renders this kind of
// chaptered, content-card-woven response.
//
// One canonical answer is returned regardless of query — the demo focuses on
// the engagement experience, not search variance. The content below is drawn
// from a real Gainsight Community AI answer about migrating from Khoros to
// Gainsight Community.

import type {
  Author,
  Cell,
  Chapter,
  LearnAnswer,
  Recommendation,
} from "./types";
import { closingCopy, introCopy } from "./copy";

const authors: Record<string, Author> = {
  priya: { name: "Priya Sharma", role: "Customer Success Manager", avatarColor: "#FCA5A5" },
  marcus: { name: "Marcus Chen", role: "Head of Community Ops", avatarColor: "#86EFAC" },
  rin: { name: "Rin Takeda", role: "Community Migration Lead", avatarColor: "#A5B4FC" },
  jamie: { name: "Jamie Ortiz", role: "Solutions Engineer", avatarColor: "#FCD34D" },
  alex: { name: "Alex Park", role: "Senior Community Admin", avatarColor: "#7DD3FC" },
  community: { name: "Gainsight Community", role: "Official", avatarColor: "#C4B5FD" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Cells
// ─────────────────────────────────────────────────────────────────────────────

// Real KB article from communities.gainsight.com — used as the primary citation.
const kbArticleCell: Cell<"article"> = {
  id: "a-migration-faq",
  type: "article",
  title: "Gainsight Community Migration FAQ",
  payload: {
    articleKind: "KB Article",
    sourceUrl: "https://communities.gainsight.com/topic/show?tid=23011&fid=17",
    lede:
      "The official KB article covering what migrates, what doesn't, the recommended process end-to-end, and the data-format requirements for moving from Khoros to Gainsight Community.",
    body: [
      "Most community content carries over: categories with their parent/sub structure, topics and threads, replies including inline images, quotes, @mentions, tables, polls, and likes. Attachments are supported across common file types — Gainsight can convert unsupported formats during the import.",
      "User data including username, first/last name, user ID, avatar, followers/following, and roles transfers. Points, badges, and ranks are supported as an add-on if you want to preserve gamification state. Passwords are not migrated for security reasons; private messages are also excluded.",
      "Preferred export formats are CSV (comma-delimited) or UTF-8 SQL. Other formats are workable but may require a conversion step. The structure of the first export must remain consistent across subsequent exports — migration scripts are written against it.",
    ],
    readMinutes: 8,
    author: authors.community,
  },
};

// Real community thread — used as the social proof / peer experience citation.
const peerQuestionCell: Cell<"question"> = {
  id: "q-migrated-to-gainsight",
  type: "question",
  title: "Has anyone migrated to Gainsight Community product?",
  payload: {
    sourceUrl: "https://communities.gainsight.com/topic/show?tid=24794&fid=17",
    excerpt:
      "We're evaluating Gainsight Community to replace our existing Khoros instance. Looking for honest takes from teams who've actually done the migration — what surprised you, what would you do differently, and how did UAT go?",
    upvotes: 31,
    replyCount: 14,
    topReply: {
      author: authors.alex,
      body:
        "We migrated last summer. Two things I wish we'd done earlier: (1) put Khoros in read-only at least three full days before the final export — we lost a handful of posts because someone didn't see the comms; (2) export your URL structures and walk through them with the migration team in week one, not week six. The redirects are usually the long pole.",
      upvotes: 22,
      acceptedAnswer: true,
      postedAt: "5 days ago",
    },
    fullThread: [
      {
        author: authors.alex,
        body:
          "We migrated last summer. Two things I wish we'd done earlier: (1) put Khoros in read-only at least three full days before the final export — we lost a handful of posts because someone didn't see the comms; (2) export your URL structures and walk through them with the migration team in week one, not week six. The redirects are usually the long pole.",
        upvotes: 22,
        acceptedAnswer: true,
        postedAt: "5 days ago",
      },
      {
        author: authors.rin,
        body:
          "Echoing the read-only point. I'd add: budget for two sandbox runs minimum, possibly three. Each one we did surfaced something we hadn't anticipated — usually around custom user roles or a category that had been renamed multiple times in Khoros.",
        upvotes: 14,
        postedAt: "4 days ago",
      },
      {
        author: authors.priya,
        body:
          "If you're on SSO, the cutover is dramatically simpler. If you're on default auth, start the user comms about password resets at least two weeks before launch. We sent three reminders and still got a wave of support tickets on day one.",
        upvotes: 11,
        postedAt: "3 days ago",
      },
    ],
  },
};

const peerConversationCell: Cell<"conversation"> = {
  id: "c-gamification-debate",
  type: "conversation",
  title: "Migrate gamification or start fresh? An admin debate",
  payload: {
    excerpt:
      "Eight admins weighing in on whether to bring points, badges, and ranks across or use the migration as a clean reset. The thread leans toward 'start fresh' for teams under 5K users and 'migrate' for teams with established badge programs.",
    participantCount: 8,
    lastMessages: [
      {
        author: authors.marcus,
        body:
          "We migrated everything and regretted it. Half our badges had outdated criteria that didn't make sense in the new product context. We ended up doing a second cleanup pass.",
        upvotes: 7,
        postedAt: "2 days ago",
      },
      {
        author: authors.jamie,
        body:
          "Counter-take: starting fresh meant our power users felt their tenure didn't carry over. We had three 5-year contributors stop posting for a month. The badges aren't just data, they're status.",
        upvotes: 9,
        postedAt: "1 day ago",
      },
    ],
    fullThread: [
      {
        author: authors.marcus,
        body:
          "We migrated everything and regretted it. Half our badges had outdated criteria that didn't make sense in the new product context. We ended up doing a second cleanup pass.",
        upvotes: 7,
        postedAt: "2 days ago",
      },
      {
        author: authors.jamie,
        body:
          "Counter-take: starting fresh meant our power users felt their tenure didn't carry over. We had three 5-year contributors stop posting for a month. The badges aren't just data, they're status.",
        upvotes: 9,
        postedAt: "1 day ago",
      },
      {
        author: authors.rin,
        body:
          "The pattern that worked for us: migrate the points and historical badges as read-only \"legacy\" markers, then redesign the active badge program from scratch. Best of both.",
        upvotes: 12,
        postedAt: "1 day ago",
      },
    ],
  },
};

const ideaCell: Cell<"idea"> = {
  id: "i-self-serve-redirects",
  type: "idea",
  title: "Self-serve URL mapping tool for Khoros → Gainsight redirects",
  payload: {
    description:
      "A guided, web-based tool to upload your Khoros URL structure and auto-generate the 301 redirect mapping for Gainsight Community. Today this requires emailing examples back and forth with the migration team — would love a self-serve version, especially for teams running multiple sandbox iterations.",
    upvotes: 96,
    commentCount: 18,
    status: "under-review",
    topComments: [
      {
        author: authors.jamie,
        body:
          "+1. Even a CSV-in/CSV-out validator would save us a week. The redirect mapping was the longest single task in our migration.",
        upvotes: 21,
        postedAt: "6 days ago",
      },
      {
        author: authors.community,
        body:
          "Marking this under review — the migration team is scoping a v1 for Q3. We'll post a more concrete spec here once it's locked.",
        upvotes: 28,
        postedAt: "2 days ago",
      },
    ],
  },
};

const replyCell: Cell<"reply"> = {
  id: "r-soft-launch",
  type: "reply",
  title: "On running a quiet soft-launch before the public cutover",
  payload: {
    parentAuthor: authors.priya,
    parentExcerpt:
      "Worried about the moment we flip the domain — it feels like a single point of failure. Did anyone do a phased rollout?",
    quotedAuthor: authors.alex,
    quotedBody:
      "Yes — we soft-launched to power users for 48 hours on a temporary subdomain. They caught two role-mapping bugs we missed in UAT. By the time we did the public cutover, everything was clean and our top contributors were already vouching for the new platform in early threads.",
    upvotes: 19,
  },
};

const productUpdateCell: Cell<"product-update"> = {
  id: "p-migration-tooling",
  type: "product-update",
  title: "Migration tooling: faster sandbox imports + audit log",
  payload: {
    summary:
      "Two upgrades to the Gainsight Community migration pipeline: sandbox imports now run in roughly half the previous time for typical mid-sized communities, and every migration run produces a full audit log you can review against the source export.",
    keyChanges: [
      "Sandbox imports for communities under 100K topics now complete in <4 hours (was 8–10)",
      "Per-run audit log: counts of categories, topics, replies, users, and any rejected records with reason codes",
      "Inline image rehosting now happens in parallel with the topic import",
      "Updated handling for Khoros polls and structured-content blocks",
    ],
    fullChangelog: [
      "Sandbox imports for communities under 100K topics now complete in <4 hours (was 8–10)",
      "Per-run audit log: counts of categories, topics, replies, users, and any rejected records with reason codes",
      "Inline image rehosting now happens in parallel with the topic import",
      "Updated handling for Khoros polls and structured-content blocks",
      "Better error messages when an export's structure drifts between runs",
      "Support for OpenSSH 4096-bit RSA keys (in addition to the existing 2048)",
      "Improved redirect mapping templates for known Khoros URL patterns",
      "Backwards-compatible with existing migration plans — no changes required",
    ],
    releasedOn: "April 24, 2026",
  },
};

const courseCell: Cell<"course"> = {
  id: "co-migration-prep",
  type: "course",
  title: "Planning your Khoros → Gainsight migration",
  payload: {
    summary:
      "A 5-lesson Skilljar course that walks community admins through the full migration plan — from inventory to cutover. Most teams take this in week one, before requesting the first export.",
    lessonCount: 5,
    estimatedMinutes: 42,
    firstLessonTitle: "Inventory: what you have today, in URLs",
    firstLessonBody: [
      "Before you write a single migration ticket, you need a clean picture of your existing community's URL surface area. Khoros uses recognizable patterns — /t/.../ for topics, /c/.../ for categories, sometimes /idea/.../ or /event/.../ depending on which add-ons you've licensed.",
      "Walk your sitemap and document each pattern, with at least three concrete URL examples per pattern. This is what the migration team will use to build your 301 redirects, and it's the single artifact that most often delays cutover when it's missing or incomplete.",
    ],
    outline: [
      { title: "Inventory: what you have today, in URLs", minutes: 8 },
      { title: "Decide: migrate gamification or start fresh", minutes: 7 },
      { title: "Plan your two exports — sandbox and final", minutes: 9 },
      { title: "User comms: the password-reset moment (default auth)", minutes: 9 },
      { title: "Read-only window and the cutover checklist", minutes: 9 },
    ],
    videoUrl: "https://www.w3.org/2010/05/sintel/trailer.mp4",
    videoPoster: undefined,
  },
};

const lessonCell: Cell<"lesson"> = {
  id: "le-export-format",
  type: "lesson",
  title: "Lesson 3.2 — Why the first export's structure matters most",
  payload: {
    snippet:
      "Migration scripts are written against the structure of your first export. Every subsequent export must match — same column order, same field semantics, same handling of nullable fields. Drift between exports is the most common cause of cutover delays.",
    body: [
      "Migration scripts are written against the structure of your first export. Every subsequent export must match — same column order, same field semantics, same handling of nullable fields. Drift between exports is the most common cause of cutover delays.",
      "If you do need to change the export structure (a new field comes online, or you decide to include something you didn't initially), surface that as early as possible. Each structural change typically adds about a week to the migration timeline because the import scripts need adjustment and the sandbox cycle has to repeat.",
      "The simplest discipline: name a single owner for the export pipeline who reviews every export against the first one before sending it. A 5-minute diff catches drift that costs weeks downstream.",
    ],
    progressPercent: 0,
    durationMinutes: 6,
    courseTitle: "Planning your Khoros → Gainsight migration",
    // Video-first lesson — Big Buck Bunny used as a stand-in for the
    // Skilljar lesson recording.
    videoUrl: "https://www.w3.org/2010/05/sintel/trailer.mp4",
    videoPoster: undefined,
  },
};

const learningExperienceCell: Cell<"learning-experience"> = {
  id: "lx-migration-track",
  type: "learning-experience",
  title: "End-to-end migration track for community admins",
  payload: {
    summary:
      "A curated track covering the full migration arc — planning course, the live webinar, peer experiences from teams who've done it, and the audit checklist. Around 4 hours total spread across two weeks.",
    assets: [
      { type: "course", title: "Planning your Khoros → Gainsight migration", progressPercent: 0 },
      { type: "event", title: "Khoros Migration Webinar (live walkthrough)", progressPercent: 0 },
      { type: "conversation", title: "Migrate gamification or start fresh? — admin debate", progressPercent: 25 },
      { type: "article", title: "Gainsight Community Migration FAQ", progressPercent: 100 },
    ],
    overallProgressPercent: 31,
  },
};

// Khoros Migration Webinar — primary event for the answer.
const khorosWebinarCell: Cell<"event"> = {
  id: "e-khoros-webinar",
  type: "event",
  title: "Khoros Migration Webinar — live walkthrough",
  payload: {
    summary:
      "A 60-minute live walkthrough of the Khoros → Gainsight Community migration process. Bring your URL inventory; the migration team will work through one or two attendee structures live, including the redirect mapping decisions.",
    startsAt: "May 8, 2026 · 10:00 AM PT",
    location: "Virtual (Zoom) · Gainsight Community Live",
    rsvpCount: 218,
    speakerNames: ["Rin Takeda", "Marcus Chen"],
  },
};

// New to Gainsight CC — onboarding event for newer admins.
const newToCcEventCell: Cell<"event"> = {
  id: "e-new-to-cc",
  type: "event",
  title: "New to Gainsight Community? Start here",
  payload: {
    summary:
      "A 45-minute orientation for admins who are new to Gainsight Community Cloud. Covers the platform model, where the migration team plugs in, and the three things every new admin should set up in their first week.",
    startsAt: "May 14, 2026 · 11:00 AM PT",
    location: "Virtual (Zoom)",
    rsvpCount: 96,
    speakerNames: ["Priya Sharma", "Jamie Ortiz"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Recommendations — surface reasoning per *this user*
// ─────────────────────────────────────────────────────────────────────────────

const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    reasoning: "The official migration FAQ — start here",
    cell: kbArticleCell,
  },
  {
    id: "rec-2",
    reasoning: "Real teams who've migrated, sharing what they'd do differently",
    cell: peerQuestionCell,
  },
  {
    id: "rec-3",
    reasoning: "Live walkthrough — bring your URL inventory",
    cell: khorosWebinarCell,
  },
  {
    id: "rec-4",
    reasoning: "An idea your peers are upvoting — vote to push it to the roadmap",
    cell: ideaCell,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Chapters
// ─────────────────────────────────────────────────────────────────────────────

const chapters: Chapter[] = [
  {
    id: "ch-scope",
    heading: "What carries over from Khoros — and what doesn't",
    segments: [
      {
        kind: "text",
        text: "Most of your community comes with you. Categories and their full parent/sub structure migrate, along with topics, threads, and replies — including inline images, quotes, @mentions, tables, polls, and likes. Attachments transfer for common file types; Gainsight will convert unsupported formats during the import. User data including usernames, first and last names, user IDs, avatars, follower relationships, and roles all move across.",
        explain:
          "Translation for your team specifically: the things your community considers 'theirs' — their threads, their reactions, their followers, their attachments — all carry over. The migration is genuinely lossless on the content side. The real planning effort is around what the *next* community looks like, not what gets preserved.",
      },
      {
        kind: "text",
        text: "Three categories of data do not migrate. User passwords cannot transit between platforms for security reasons — users either reset on first login or, if you're on SSO, sign in via the SSO button without a reset. Private messages are excluded. And any user settings whose semantics don't have a clean equivalent in Gainsight will be dropped rather than approximated.",
        explain:
          "If you're on default authentication, the password-reset moment is the single biggest UX risk in the cutover. Plan three rounds of comms: two weeks before, three days before, and at-launch — and make sure your support team knows the launch date so they're not blindsided by ticket volume.",
      },
      {
        kind: "text",
        text: "Gamification — points, badges, and ranks — is supported as a paid add-on if you want to preserve community standing. Many teams take the migration as an opportunity to redesign their badge program from scratch; the right call depends on how much of your active engagement loop is currently tied to badge mechanics.",
      },
    ],
    cells: [kbArticleCell, peerConversationCell],
  },
  {
    id: "ch-process",
    heading: "The recommended migration process, end-to-end",
    segments: [
      {
        kind: "text",
        text: "The first phase is plan and inventory. Document your existing Khoros URL structures — patterns like /t/.../ for topics and /c/.../ for categories — with concrete examples. The migration team uses this artifact to build your 301 redirects, and it's the most common reason cutovers slip. Decide early whether to migrate gamification or start fresh; that choice changes the export scope and the add-on conversation.",
        explain:
          "Your community currently has 14,000+ topics and 6 active idea boards. Plan for the URL inventory to take roughly a week of one admin's time — it's not a 30-minute exercise. Treat it as the first deliverable of the migration project, not as a side task.",
      },
      {
        kind: "text",
        text: "The data exchange step is two exports, not one. The first goes to a sandbox so your team can review and validate; the final goes to production. Both must share the same structure — column order, field semantics, nullable handling — because the migration scripts are written against the first export. Preferred formats are CSV (comma-delimited) or UTF-8 SQL; other formats are workable with conversion.",
      },
      {
        kind: "text",
        text: "Transfer happens over sFTP hosted on AWS. Provide an OpenSSH 2048-bit RSA public key (4096 also supported as of the April release); Gainsight provides the sFTP endpoint. For files under 100MB, a file-share link (Google Drive or similar) is acceptable. Include all inline images and attachments in the export — this is the most common omission.",
      },
      {
        kind: "text",
        text: "Sandbox imports and UAT are where the migration earns or loses its timeline. Gainsight runs at least two sandbox imports so your team can review data, perform UAT, and feed back. Each additional sandbox cycle adds roughly two weeks: one for UAT and one for migration-script adjustments. Budget for two; plan for the possibility of three.",
        explain:
          "Practical rule: every issue your team raises in UAT either gets fixed before cutover or carries forward as known debt. There's no third option. Triage UAT findings into 'must fix' vs 'accept and document' before the second sandbox to keep the timeline honest.",
      },
      {
        kind: "text",
        text: "Final cutover and go-live: switch the existing Khoros community to read-only two to three days before the final export to prevent in-flight content loss. After the production import, run final data checks. Once you sign off, Gainsight configures redirects and switches the domain to the new community.",
      },
    ],
    cells: [courseCell, lessonCell, productUpdateCell, replyCell],
  },
  {
    id: "ch-auth-urls",
    heading: "Authentication, URL handling, and timeline factors",
    segments: [
      {
        kind: "text",
        text: "Authentication is the cutover moment most teams underestimate. If you use SSO, it's clean — users sign in via the SSO button on day one and there is no password migration to plan around. If you use default authentication, passwords cannot be migrated for security reasons, and every user must request a new password. Communicate this clearly and repeatedly: pre-launch comms, day-of-launch comms, and a high-visibility help link in the new community for the first month.",
      },
      {
        kind: "text",
        text: "URL handling is the other long-running thread. If you're migrating from a vendor Gainsight has migrated before — Khoros is one — prior 301 redirect mappings can often be reused as a starting point. If you're a new vendor or have heavily customized URL patterns, send concrete examples across categories, topics, and any custom content types early so the redirects can be built and tested.",
        explain:
          "Khoros is in the 'previously migrated' bucket, so you'll start from established mappings rather than from scratch — that typically saves 1–2 weeks. The variance is in your custom URL patterns: any one-off paths your team built using legacy plugins will need explicit handling.",
      },
      {
        kind: "text",
        text: "Timeline starts when the migration plan and initial export are in. Duration depends on data volume, export format quality, structural complexity, and vendor familiarity. Migrating from a known vendor with a clean export and a simple structure can run 6–8 weeks; new vendors or complex structures (custom roles, deeply nested categories, ideas plus product updates plus events together) routinely run 12+ weeks.",
      },
    ],
    cells: [khorosWebinarCell, newToCcEventCell, learningExperienceCell],
  },
  {
    id: "ch-data",
    heading: "Data requirements and best practices",
    segments: [
      {
        kind: "text",
        text: "Export from production. Sandbox or staging environments tend to drift in subtle ways, and migration debugging on a staging-derived dataset costs more than it saves. Maintain a consistent export structure across runs — it's worth nominating a single owner for the export pipeline who diffs every run against the first.",
        explain:
          "If you currently don't have a clear owner for community data, this migration is the right moment to assign one. The role doesn't have to be permanent, but during the migration window it has to be one named human who can be paged on export questions.",
      },
      {
        kind: "text",
        text: "Include every inline image and attachment in the export package. The two most common ways content silently degrades during migration are missing inline images (because they were referenced but not packaged) and dropped attachments on older threads. Both are recoverable but only if caught in sandbox UAT.",
      },
      {
        kind: "text",
        text: "If your migration includes ideas, product updates, or any structured content beyond core topics and replies, flag this early — it may require additional services or a scope adjustment, and it adds a layer to the redirect plan because these often have their own URL patterns.",
      },
    ],
    cells: [peerQuestionCell, ideaCell],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export function getStubAnswer(query: string): LearnAnswer {
  const q = (query || "How do I migrate from Khoros to Gainsight Community?").trim();
  return {
    query: q,
    intro: introCopy(q),
    recommendations,
    chapters,
    closing: closingCopy(),
  };
}

// Lookup any cell by id — used by the full-page cell detail route.
export function getCellById(id: string): Cell | null {
  const all: Cell[] = [
    kbArticleCell,
    peerQuestionCell,
    peerConversationCell,
    ideaCell,
    replyCell,
    productUpdateCell,
    courseCell,
    lessonCell,
    learningExperienceCell,
    khorosWebinarCell,
    newToCcEventCell,
  ];
  return all.find((c) => c.id === id) ?? null;
}
