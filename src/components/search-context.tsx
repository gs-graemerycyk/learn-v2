"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface SearchContextType {
  value: string;
  setValue: (v: string) => void;
  isFocused: boolean;
  setIsFocused: (v: boolean) => void;
  heroSearchVisible: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  openModalWithQuery: (query: string) => void;
  closeModal: () => void;
  pendingQuery: string | null;
  clearPendingQuery: () => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [heroSearchVisible, setHeroSearchVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const openModalWithQuery = useCallback((query: string) => {
    setPendingQuery(query);
    setIsModalOpen(true);
  }, []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const clearPendingQuery = useCallback(() => setPendingQuery(null), []);

  useEffect(() => {
    const handleScroll = () => {
      // Hero search disappears when scrolled ~40% of viewport
      const threshold = window.innerHeight * 0.38;
      setHeroSearchVisible(window.scrollY < threshold);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const setValueCb = useCallback((v: string) => setValue(v), []);
  const setIsFocusedCb = useCallback((v: boolean) => setIsFocused(v), []);

  return (
    <SearchContext.Provider value={{ value, setValue: setValueCb, isFocused, setIsFocused: setIsFocusedCb, heroSearchVisible, isModalOpen, openModal, openModalWithQuery, closeModal, pendingQuery, clearPendingQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
