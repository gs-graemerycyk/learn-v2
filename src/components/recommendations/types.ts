// Shape of a single recommendation item rendered by the "For you" carousel.
//
// These types model what the DCH (Digital Customer Hub) recommendations
// engine is expected to return per item. The static UI build hardcodes
// matching fixtures in `mock-data.ts`. When the API arrives, replace
// the fixture import with a fetch and keep the types intact.

export type ItemClass = "resumption" | "recommendation";

export type ContentType =
  | "course"
  | "lesson"
  | "learning_path"
  | "question"
  | "article"
  | "idea"
  | "conversation"
  | "event"
  | "product_update";

export interface BaseItem {
  id: string;
  itemClass: ItemClass;
  contentType: ContentType;
  title: string;
  url: string;
}

export interface CourseItem extends BaseItem {
  contentType: "course" | "lesson" | "learning_path";
  thumbnailUrl: string;
  /** Present if itemClass is "resumption". */
  progressPercent?: number;
  /** e.g. "12 min". */
  estimatedTimeRemaining?: string;
}

export interface CommunityItem extends BaseItem {
  contentType: "question" | "article" | "idea" | "conversation";
  category: string;
  authorName: string;
  authorAvatarUrl?: string;
  voteCount: number;
  replyCount: number;
  viewCount?: number;
  snippet: string;
}

export interface EventItem extends BaseItem {
  contentType: "event" | "product_update";
  /** ISO date string for events, e.g. "2026-05-15". */
  date?: string;
  /** Version string for product updates, e.g. "v4.2". */
  version?: string;
  description: string;
}

export type RecommendationItem = CourseItem | CommunityItem | EventItem;

export interface RecommendationsCarouselProps {
  items: RecommendationItem[];
}
