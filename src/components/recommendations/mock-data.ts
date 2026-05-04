import type { RecommendationItem } from "./types";

// Static fixtures for the "For you" carousel. 10 items total:
//   2 resumptions (pinned to the front) + 8 recommendations.
//
// Themed for the EmailMonkey demo brand. Replace this module with
// data fetched from the DCH recommendations engine when ready —
// the carousel takes whatever array you pass to it.

export const mockRecommendations: RecommendationItem[] = [
  /* ── Resumptions ── */
  {
    id: "res-course-segmentation",
    itemClass: "resumption",
    contentType: "course",
    title: "Advanced Segmentation Strategies",
    url: "/academy/courses/advanced-segmentation",
    thumbnailUrl:
      "https://placehold.co/640x360/5B2BD9/FFFFFF/png?text=Segmentation",
    progressPercent: 60,
    estimatedTimeRemaining: "12 min",
  },
  {
    id: "res-lesson-drip",
    itemClass: "resumption",
    contentType: "lesson",
    title: "Setting Up Drip Campaigns",
    url: "/academy/lessons/setting-up-drip-campaigns",
    thumbnailUrl:
      "https://placehold.co/640x360/A237D8/FFFFFF/png?text=Drip+Campaigns",
    progressPercent: 25,
    estimatedTimeRemaining: "18 min",
  },

  /* ── Recommendations ── */
  {
    id: "rec-path-deliverability",
    itemClass: "recommendation",
    contentType: "learning_path",
    title: "Email Deliverability Mastery",
    url: "/academy/paths/email-deliverability-mastery",
    thumbnailUrl:
      "https://placehold.co/640x360/3F2BBE/FFFFFF/png?text=Deliverability",
    estimatedTimeRemaining: "4 hr",
  },
  {
    id: "rec-article-spam",
    itemClass: "recommendation",
    contentType: "article",
    title: "Avoiding Spam Filters",
    url: "/community-hub/articles/avoiding-spam-filters",
    category: "Deliverability",
    authorName: "Lena Alvarez",
    authorAvatarUrl:
      "https://placehold.co/64x64/F5C8C8/3F2BBE/png?text=LA",
    voteCount: 42,
    replyCount: 7,
    viewCount: 1284,
    snippet:
      "Authentication, list hygiene, and content patterns that keep your campaigns out of the junk folder — without sounding like a robot.",
  },
  {
    id: "rec-article-list-hygiene",
    itemClass: "recommendation",
    contentType: "article",
    title: "Subscriber List Hygiene Best Practices",
    url: "/community-hub/articles/subscriber-list-hygiene",
    category: "Lists",
    authorName: "Marcus Pham",
    authorAvatarUrl:
      "https://placehold.co/64x64/C8E0F5/3F2BBE/png?text=MP",
    voteCount: 31,
    replyCount: 4,
    viewCount: 892,
    snippet:
      "Suppression lists, re-engagement windows, and the unsubscribe flow most teams get wrong. A practical checklist you can run quarterly.",
  },
  {
    id: "rec-question-gdpr",
    itemClass: "recommendation",
    contentType: "question",
    title: "How do I handle GDPR for EU subscribers?",
    url: "/community-hub/questions/gdpr-eu-subscribers",
    category: "Compliance",
    authorName: "Sofia Reyes",
    authorAvatarUrl:
      "https://placehold.co/64x64/D8C8F5/3F2BBE/png?text=SR",
    voteCount: 18,
    replyCount: 12,
    viewCount: 540,
    snippet:
      "We're rolling out a campaign across the EU and need to confirm our consent capture is compliant. Anyone got a checklist they're using?",
  },
  {
    id: "rec-question-send-time",
    itemClass: "recommendation",
    contentType: "question",
    title: "Best send-time for B2B campaigns?",
    url: "/community-hub/questions/best-send-time-b2b",
    category: "Strategy",
    authorName: "Priya Shah",
    voteCount: 9,
    replyCount: 23,
    viewCount: 612,
    snippet:
      "Tuesday 10am has been our default forever but our open rates are sliding. What's working for B2B SaaS in 2026?",
  },
  {
    id: "rec-idea-ab-subjects",
    itemClass: "recommendation",
    contentType: "idea",
    title: "Native A/B test for subject lines",
    url: "/community-hub/ideas/ab-test-subject-lines",
    category: "Feature requests",
    authorName: "Devon Carter",
    authorAvatarUrl:
      "https://placehold.co/64x64/F5E0C8/3F2BBE/png?text=DC",
    voteCount: 156,
    replyCount: 34,
    viewCount: 2104,
    snippet:
      "Would love to A/B test subject lines without leaving the campaign editor — pick two variants, set a winner metric, and let it run.",
  },
  {
    id: "rec-event-summit-2026",
    itemClass: "recommendation",
    contentType: "event",
    title: "EmailMonkey Summit 2026 — Register",
    url: "/community-hub/events/emailmonkey-summit-2026",
    date: "2026-09-22",
    description:
      "Two days of sessions on lifecycle marketing, deliverability, and the next chapter of the EmailMonkey product. Online and in San Francisco.",
  },
  {
    id: "rec-update-v42",
    itemClass: "recommendation",
    contentType: "product_update",
    title: "v4.2: New automation triggers",
    url: "/community-hub/updates/v4-2-automation-triggers",
    version: "v4.2",
    description:
      "Inactivity windows, list-cross triggers, and a redesigned condition editor — build branching journeys without dropping into the API.",
  },
];
