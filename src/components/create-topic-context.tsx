"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type TopicMode = "new" | "from-search" | "from-answer";

interface CreateTopicContextType {
  isOpen: boolean;
  mode: TopicMode;
  aiQuery: string | null;
  /** true when transitioning from search modal — skip backdrop animation */
  crossFade: boolean;
  openNew: () => void;
  openFromSearch: (query: string) => void;
  /** Pre-fills the topic with a query (like openFromSearch) but the close
   *  button just dismisses the modal — no return-to-search behavior. Used
   *  when opening from an AI Answer's "Ask in the community" affordance. */
  openFromAnswer: (query: string) => void;
  close: () => void;
}

const CreateTopicContext = createContext<CreateTopicContextType | null>(null);

export function useCreateTopic() {
  const ctx = useContext(CreateTopicContext);
  if (!ctx) throw new Error("useCreateTopic must be used within CreateTopicProvider");
  return ctx;
}

export function CreateTopicProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<TopicMode>("new");
  const [aiQuery, setAiQuery] = useState<string | null>(null);
  const [crossFade, setCrossFade] = useState(false);

  const openNew = useCallback(() => {
    setMode("new");
    setAiQuery(null);
    setCrossFade(false);
    setIsOpen(true);
  }, []);

  const openFromSearch = useCallback((query: string) => {
    setMode("from-search");
    setAiQuery(query);
    setCrossFade(true);
    setIsOpen(true);
  }, []);

  const openFromAnswer = useCallback((query: string) => {
    setMode("from-answer");
    setAiQuery(query);
    setCrossFade(false);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setCrossFade(false);
  }, []);

  return (
    <CreateTopicContext.Provider value={{ isOpen, mode, aiQuery, crossFade, openNew, openFromSearch, openFromAnswer, close }}>
      {children}
    </CreateTopicContext.Provider>
  );
}
