"use client";

import { createContext, useContext } from "react";

// Two cross-cutting concerns shared by the widget tree:
//
// 1. PanelScope — where the cell-detail / AI-tutor / support modals are
//    positioned. "viewport" (default) means fixed to the browser viewport
//    like a normal page modal. "container" means absolute-positioned within
//    the nearest positioned ancestor — used inside the in-app widget where
//    overlays should cover only the widget drawer, not the host app.
//
// 2. WidgetMode — "builder" disables interactive elements (cell clicks,
//    tutor opens, support escalation) so the widget reads as a static
//    preview inside the bot-builder admin canvas. "published" renders the
//    full interactive experience.

export type PanelScope = "viewport" | "container";
export type WidgetMode = "builder" | "published";

const PanelScopeContext = createContext<PanelScope>("viewport");
const WidgetModeContext = createContext<WidgetMode>("published");

export function PanelScopeProvider({
  scope,
  children,
}: {
  scope: PanelScope;
  children: React.ReactNode;
}) {
  return (
    <PanelScopeContext.Provider value={scope}>
      {children}
    </PanelScopeContext.Provider>
  );
}

export function WidgetModeProvider({
  mode,
  children,
}: {
  mode: WidgetMode;
  children: React.ReactNode;
}) {
  return (
    <WidgetModeContext.Provider value={mode}>
      {children}
    </WidgetModeContext.Provider>
  );
}

export function usePanelScope(): PanelScope {
  return useContext(PanelScopeContext);
}

export function useWidgetMode(): WidgetMode {
  return useContext(WidgetModeContext);
}
