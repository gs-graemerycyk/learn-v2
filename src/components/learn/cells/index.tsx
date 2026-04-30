"use client";

import type { Cell } from "@/lib/learn/types";
import { CellQuestion } from "./cell-question";
import { CellConversation } from "./cell-conversation";
import { CellIdea } from "./cell-idea";
import { CellReply } from "./cell-reply";
import { CellArticle } from "./cell-article";
import { CellProductUpdate } from "./cell-product-update";
import { CellCourse } from "./cell-course";
import { CellLesson } from "./cell-lesson";
import { CellLearningExperience } from "./cell-learning-experience";
import { CellEvent } from "./cell-event";

export function CellRouter({ cell }: { cell: Cell }) {
  switch (cell.type) {
    case "question":
      return <CellQuestion cell={cell as Cell<"question">} />;
    case "conversation":
      return <CellConversation cell={cell as Cell<"conversation">} />;
    case "idea":
      return <CellIdea cell={cell as Cell<"idea">} />;
    case "reply":
      return <CellReply cell={cell as Cell<"reply">} />;
    case "article":
      return <CellArticle cell={cell as Cell<"article">} />;
    case "product-update":
      return <CellProductUpdate cell={cell as Cell<"product-update">} />;
    case "course":
      return <CellCourse cell={cell as Cell<"course">} />;
    case "lesson":
      return <CellLesson cell={cell as Cell<"lesson">} />;
    case "learning-experience":
      return <CellLearningExperience cell={cell as Cell<"learning-experience">} />;
    case "event":
      return <CellEvent cell={cell as Cell<"event">} />;
  }
}
