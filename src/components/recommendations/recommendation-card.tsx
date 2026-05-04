"use client";

import type { RecommendationItem } from "./types";
import { CourseCard } from "./cards/course-card";
import { CommunityCard } from "./cards/community-card";
import { EventCard } from "./cards/event-card";

// Stubbed analytics. Replace `trackEvent` with the real client when one
// is available — the carousel only depends on the function shape.
function trackEvent(event: string, payload: Record<string, unknown>) {
  // eslint-disable-next-line no-console
  console.log("[track]", event, payload);
}

interface RecommendationCardProps {
  item: RecommendationItem;
  position: number;
}

export function RecommendationCard({ item, position }: RecommendationCardProps) {
  const handleClick = (clicked: RecommendationItem, pos: number) => {
    trackEvent("recommendation_click", {
      itemId: clicked.id,
      itemClass: clicked.itemClass,
      contentType: clicked.contentType,
      position: pos,
    });
  };

  switch (item.contentType) {
    case "course":
    case "lesson":
    case "learning_path":
      return <CourseCard item={item} position={position} onClickItem={handleClick} />;
    case "question":
    case "article":
    case "idea":
    case "conversation":
      return (
        <CommunityCard item={item} position={position} onClickItem={handleClick} />
      );
    case "event":
    case "product_update":
      return <EventCard item={item} position={position} onClickItem={handleClick} />;
  }
}
