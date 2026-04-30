// Type definitions for the Learn page (Gainsight Community Cloud + Skilljar).
// Stub data only — no real API. The shape is designed so that a future
// personalization service can plug in by populating `Recommendation.reasoning`
// and `Cell.payload` from real sources.

export type CellType =
  | "question"
  | "conversation"
  | "idea"
  | "reply"
  | "article"
  | "product-update"
  | "course"
  | "lesson"
  | "learning-experience"
  | "event";

export type Author = {
  name: string;
  role: string;
  avatarColor: string; // OKLCH-friendly hex/oklch string used as a flat avatar tint
};

export type ReplyPayload = {
  author: Author;
  body: string;
  upvotes: number;
  acceptedAnswer?: boolean;
  postedAt: string; // human-readable, e.g. "2 days ago"
};

export type CellPayload = {
  question: {
    excerpt: string;
    upvotes: number;
    replyCount: number;
    topReply: ReplyPayload;
    fullThread: ReplyPayload[];
    sourceUrl?: string; // canonical link to the original community thread
  };
  conversation: {
    excerpt: string;
    participantCount: number;
    lastMessages: ReplyPayload[]; // last 2
    fullThread: ReplyPayload[];
  };
  idea: {
    description: string;
    upvotes: number;
    commentCount: number;
    status: "open" | "under-review" | "planned" | "shipped";
    topComments: ReplyPayload[];
  };
  reply: {
    parentExcerpt: string;
    parentAuthor: Author;
    quotedBody: string;
    quotedAuthor: Author;
    upvotes: number;
  };
  article: {
    lede: string;
    body: string[]; // paragraphs revealed via "continue reading"
    readMinutes: number;
    author: Author;
    articleKind?: "KB Article" | "Article" | "Guide";
    sourceUrl?: string; // canonical link to the source article
  };
  "product-update": {
    summary: string;
    keyChanges: string[];
    fullChangelog: string[];
    releasedOn: string;
  };
  course: {
    summary: string;
    lessonCount: number;
    estimatedMinutes: number;
    firstLessonTitle: string;
    firstLessonBody: string[];
    outline: { title: string; minutes: number }[];
    videoUrl?: string; // optional intro video; if present, plays on Open
    videoPoster?: string;
  };
  lesson: {
    snippet: string;
    body: string[]; // chunks revealed via "continue lesson"
    progressPercent: number; // 0–100
    durationMinutes: number;
    courseTitle: string;
    // When videoUrl is set, the lesson cell renders as a video lesson —
    // an embedded player at the top of the cell with progress under it.
    videoUrl?: string;
    videoPoster?: string;
  };
  "learning-experience": {
    summary: string;
    assets: { type: CellType; title: string; progressPercent: number }[];
    overallProgressPercent: number;
  };
  event: {
    summary: string;
    startsAt: string; // human-readable
    location: string; // "Virtual" or city
    rsvpCount: number;
    speakerNames: string[];
  };
};

export type Cell<T extends CellType = CellType> = {
  id: string;
  type: T;
  title: string;
  payload: CellPayload[T];
};

export type Recommendation = {
  id: string;
  cell: Cell;
  reasoning: string; // surfaces *why this user, why now*
};

export type Chapter = {
  id: string;
  heading: string;
  // Body is split into segments so cells can interleave between paragraphs.
  // Each segment can carry an optional `explain` annotation that is revealed
  // when the user hovers and clicks "Explain this?" on the paragraph.
  segments: { kind: "text"; text: string; explain?: string }[];
  cells: Cell[];
};

export type LearnAnswer = {
  query: string;
  intro: string;
  recommendations: Recommendation[];
  chapters: Chapter[];
  closing: string;
};
