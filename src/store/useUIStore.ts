import { create } from "zustand";

export type ViewSide = "front" | "back" | "left" | "right" | "free";
export type ActivePanel = "text" | "image" | "color" | "layers" | null;

interface UIState {
  viewSide: ViewSide;
  activePanel: ActivePanel;
  setViewSide: (side: ViewSide) => void;
  setActivePanel: (panel: ActivePanel) => void;
  togglePanel: (panel: ActivePanel) => void;
}

export const useUIStore = create<UIState>((set) => ({
  viewSide: "front",
  activePanel: null,
  setViewSide: (viewSide) => set({ viewSide }),
  setActivePanel: (activePanel) => set({ activePanel }),
  togglePanel: (panel) =>
    set((s) => ({ activePanel: s.activePanel === panel ? null : panel })),
}));
