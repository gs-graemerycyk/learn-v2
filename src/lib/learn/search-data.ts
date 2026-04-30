// Stub search results for the Classic Search and Short Answer routes.
// The result list reuses the same Cell types as the AI Answer page so the
// UI can render visually consistent rows across all three intent outcomes.

import type { Cell, CellType } from "./types";
import { getStubAnswer } from "./stub-data";

export type SearchResult = {
  id: string;
  cell: Cell;
  // A short sentence explaining why this result matched — surfaced under
  // the title in the list view.
  matchReason: string;
};

// Pulls the same canonical cells used in the AI Answer's chapters so the
// search list looks like a more linear projection of the same content.
export function getSearchResults(query: string): SearchResult[] {
  const answer = getStubAnswer(query);

  // Flatten cells from chapters + recommendations, de-duplicate by id.
  const seen = new Set<string>();
  const flat: Cell[] = [];
  for (const r of answer.recommendations) {
    if (!seen.has(r.cell.id)) {
      seen.add(r.cell.id);
      flat.push(r.cell);
    }
  }
  for (const ch of answer.chapters) {
    for (const c of ch.cells) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        flat.push(c);
      }
    }
  }

  return flat.map((c) => ({
    id: c.id,
    cell: c,
    matchReason: matchReasonFor(c, query),
  }));
}

function matchReasonFor(cell: Cell, _q: string): string {
  switch (cell.type) {
    case "article":
      return (cell as Cell<"article">).payload.articleKind === "KB Article"
        ? "Official KB article — exact-match topic"
        : "Editorial article that names this topic in the lede";
    case "question":
      return "Community thread — flagged as accepted-answer question";
    case "conversation":
      return "Active discussion mentioning this topic";
    case "idea":
      return "Roadmap idea cluster on this topic";
    case "reply":
      return "High-signal reply quoted across other threads";
    case "course":
      return "Course covering this end-to-end";
    case "lesson":
      return "Lesson within a course on this topic";
    case "learning-experience":
      return "Multi-asset track that includes this topic";
    case "event":
      return "Live or upcoming event covering this topic";
    case "product-update":
      return "Recent product update related to this topic";
  }
}

// Filter facet definitions used by the left rail.

export const ALL_TYPES: CellType[] = [
  "question",
  "conversation",
  "idea",
  "reply",
  "article",
  "product-update",
  "course",
  "lesson",
  "learning-experience",
  "event",
];

export const TYPE_LABEL: Record<CellType, string> = {
  question: "Questions",
  conversation: "Conversations",
  idea: "Ideas",
  reply: "Replies",
  article: "Articles",
  "product-update": "Product Updates",
  course: "Courses",
  lesson: "Lessons",
  "learning-experience": "Learning Experiences",
  event: "Events",
};

// Map a cell to its full-page detail href.
export function cellHref(id: string): string {
  return `/learn/cells/${encodeURIComponent(id)}`;
}
