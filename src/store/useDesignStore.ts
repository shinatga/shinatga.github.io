import { create } from "zustand";
import type { DesignElement, TextElement, ImageElement } from "../types/design";

const MAX_HISTORY = 50;

interface DesignState {
  elements: DesignElement[];
  selectedId: string | null;

  // History
  _history: DesignElement[][];
  _future: DesignElement[][];

  addText: (text: Partial<TextElement> & { text: string }) => void;
  addImage: (img: Partial<ImageElement> & { src: string; fileName: string }) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  clearAll: () => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  saveDesign: () => string;
  loadDesign: (json: string) => void;
  saveToLocal: () => void;
  loadFromLocal: () => boolean;
}

let nextId = 1;
const genId = () => `el-${nextId++}`;

function pushHistory(state: DesignState): Pick<DesignState, "_history" | "_future"> {
  const history = [...state._history, state.elements].slice(-MAX_HISTORY);
  return { _history: history, _future: [] };
}

export const useDesignStore = create<DesignState>((set, get) => ({
  elements: [],
  selectedId: null,
  _history: [],
  _future: [],

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
    set((s) => ({
      ...pushHistory(s),
      elements: [...s.elements, el],
      selectedId: el.id,
    }));
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
    set((s) => ({
      ...pushHistory(s),
      elements: [...s.elements, el],
      selectedId: el.id,
    }));
  },

  updateElement: (id, updates) =>
    set((s) => ({
      ...pushHistory(s),
      elements: s.elements.map((el) =>
        el.id === id ? ({ ...el, ...updates } as DesignElement) : el
      ),
    })),

  removeElement: (id) =>
    set((s) => ({
      ...pushHistory(s),
      elements: s.elements.filter((el) => el.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),

  selectElement: (id) => set({ selectedId: id }),

  clearAll: () =>
    set((s) => ({
      ...pushHistory(s),
      elements: [],
      selectedId: null,
    })),

  undo: () =>
    set((s) => {
      if (s._history.length === 0) return s;
      const previous = s._history[s._history.length - 1];
      return {
        _history: s._history.slice(0, -1),
        _future: [s.elements, ...s._future],
        elements: previous,
        selectedId: null,
      };
    }),

  redo: () =>
    set((s) => {
      if (s._future.length === 0) return s;
      const next = s._future[0];
      return {
        _history: [...s._history, s.elements],
        _future: s._future.slice(1),
        elements: next,
        selectedId: null,
      };
    }),

  canUndo: () => get()._history.length > 0,
  canRedo: () => get()._future.length > 0,

  saveDesign: () => {
    const { elements } = get();
    return JSON.stringify({ version: 1, elements }, null, 2);
  },

  loadDesign: (json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.version === 1 && Array.isArray(data.elements)) {
        set((s) => ({
          ...pushHistory(s),
          elements: data.elements,
          selectedId: null,
        }));
        // Update nextId to avoid collisions
        const maxId = data.elements.reduce((max: number, el: DesignElement) => {
          const num = parseInt(el.id.replace("el-", ""), 10);
          return isNaN(num) ? max : Math.max(max, num);
        }, 0);
        nextId = maxId + 1;
      }
    } catch {
      console.warn("Failed to load design JSON");
    }
  },

  saveToLocal: () => {
    const json = get().saveDesign();
    localStorage.setItem("garment-design", json);
  },

  loadFromLocal: () => {
    const json = localStorage.getItem("garment-design");
    if (json) {
      get().loadDesign(json);
      return true;
    }
    return false;
  },
}));
