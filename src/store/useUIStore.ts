import { create } from "zustand";
import type { GarmentSize } from "../types/garment";

export type ViewSide = "front" | "back" | "left" | "right" | "free";
export type ActivePanel = "text" | "image" | "color" | "layers" | null;

interface UIState {
  viewSide: ViewSide;
  activePanel: ActivePanel;
  showPrintGuide: boolean;
  showSizeGuide: boolean;
  selectedSize: GarmentSize;
  setViewSide: (side: ViewSide) => void;
  setActivePanel: (panel: ActivePanel) => void;
  togglePanel: (panel: ActivePanel) => void;
  togglePrintGuide: () => void;
  toggleSizeGuide: () => void;
  setSelectedSize: (size: GarmentSize) => void;
}

export const useUIStore = create<UIState>((set) => ({
  viewSide: "front",
  activePanel: null,
  showPrintGuide: false,
  showSizeGuide: false,
  selectedSize: "M",
  setViewSide: (viewSide) => set({ viewSide }),
  setActivePanel: (activePanel) => set({ activePanel }),
  togglePanel: (panel) =>
    set((s) => ({ activePanel: s.activePanel === panel ? null : panel })),
  togglePrintGuide: () => set((s) => ({ showPrintGuide: !s.showPrintGuide })),
  toggleSizeGuide: () => set((s) => ({ showSizeGuide: !s.showSizeGuide })),
  setSelectedSize: (selectedSize) => set({ selectedSize }),
}));
