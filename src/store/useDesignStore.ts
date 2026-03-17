import { create } from "zustand";
import type { DesignElement, TextElement, ImageElement } from "../types/design";

interface DesignState {
  elements: DesignElement[];
  selectedId: string | null;

  addText: (text: Partial<TextElement> & { text: string }) => void;
  addImage: (img: Partial<ImageElement> & { src: string; fileName: string }) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  clearAll: () => void;
}

let nextId = 1;
const genId = () => `el-${nextId++}`;

export const useDesignStore = create<DesignState>((set) => ({
  elements: [],
  selectedId: null,

  addText: (partial) => {
    const el: TextElement = {
      id: genId(),
      type: "text",
      text: partial.text,
      fontFamily: partial.fontFamily ?? "Arial",
      fontSize: partial.fontSize ?? 48,
      fontWeight: partial.fontWeight ?? "bold",
      color: partial.color ?? "#ffffff",
      position: partial.position ?? [0, 0.05, 0.15],
      scale: partial.scale ?? [0.15, 0.15, 0.15],
      rotation: partial.rotation ?? 0,
      side: partial.side ?? "front",
      visible: partial.visible ?? true,
    };
    set((s) => ({ elements: [...s.elements, el], selectedId: el.id }));
  },

  addImage: (partial) => {
    const el: ImageElement = {
      id: genId(),
      type: "image",
      src: partial.src,
      fileName: partial.fileName,
      naturalWidth: partial.naturalWidth ?? 512,
      naturalHeight: partial.naturalHeight ?? 512,
      position: partial.position ?? [0, 0.05, 0.15],
      scale: partial.scale ?? [0.15, 0.15, 0.15],
      rotation: partial.rotation ?? 0,
      side: partial.side ?? "front",
      visible: partial.visible ?? true,
    };
    set((s) => ({ elements: [...s.elements, el], selectedId: el.id }));
  },

  updateElement: (id, updates) =>
    set((s) => ({
      elements: s.elements.map((el) =>
        el.id === id ? ({ ...el, ...updates } as DesignElement) : el
      ),
    })),

  removeElement: (id) =>
    set((s) => ({
      elements: s.elements.filter((el) => el.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),

  selectElement: (id) => set({ selectedId: id }),

  clearAll: () => set({ elements: [], selectedId: null }),
}));
