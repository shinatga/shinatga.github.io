import { create } from "zustand";
import type { GarmentType } from "../types/garment";
import type { FabricType } from "../lib/fabric-textures";

interface GarmentState {
  garmentType: GarmentType;
  garmentColor: string;
  fabricType: FabricType;
  setGarmentType: (type: GarmentType) => void;
  setGarmentColor: (color: string) => void;
  setFabricType: (type: FabricType) => void;
}

export const useGarmentStore = create<GarmentState>((set) => ({
  garmentType: "tshirt",
  garmentColor: "#2d2d2d",
  fabricType: "cotton",
  setGarmentType: (garmentType) => set({ garmentType }),
  setGarmentColor: (garmentColor) => set({ garmentColor }),
  setFabricType: (fabricType) => set({ fabricType }),
}));
