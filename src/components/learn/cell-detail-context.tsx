"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { Cell } from "@/lib/learn/types";

type CellDetailContextValue = {
  openCell: Cell | null;
  open: (cell: Cell) => void;
  close: () => void;
};

const CellDetailContext = createContext<CellDetailContextValue | null>(null);

export function CellDetailProvider({ children }: { children: React.ReactNode }) {
  const [openCell, setOpenCell] = useState<Cell | null>(null);

  const open = useCallback((cell: Cell) => setOpenCell(cell), []);
  const close = useCallback(() => setOpenCell(null), []);

  return (
    <CellDetailContext.Provider value={{ openCell, open, close }}>
      {children}
    </CellDetailContext.Provider>
  );
}

export function useCellDetail() {
  const ctx = useContext(CellDetailContext);
  if (!ctx) throw new Error("useCellDetail must be used inside <CellDetailProvider>");
  return ctx;
}
