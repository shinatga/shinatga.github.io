export type GarmentType = "tshirt" | "hoodie" | "longsleeve" | "tanktop" | "polo";

export interface FabricTexture {
  type: "cotton" | "fleece";
  roughness: number;
  normalScale: number;
}

export type GarmentSize = "S" | "M" | "L" | "XL";

export interface SizeDimensions {
  chest: number;    // cm
  length: number;   // cm
  shoulder: number; // cm
}

export interface GarmentConfig {
  type: GarmentType;
  label: string;
  labelKo: string;
  modelPath: string;
  decalMeshName: string;
  decalPositionFront: [number, number, number];
  decalPositionBack: [number, number, number];
  printArea: { width: number; height: number }; // normalized 0-1
  fabricTexture: FabricTexture;
  sizes: Record<GarmentSize, SizeDimensions>;
}

const DEFAULT_SIZES: Record<GarmentSize, SizeDimensions> = {
  S:  { chest: 91, length: 68, shoulder: 42 },
  M:  { chest: 97, length: 71, shoulder: 44 },
  L:  { chest: 103, length: 74, shoulder: 46 },
  XL: { chest: 109, length: 77, shoulder: 48 },
};

export const GARMENT_CONFIGS: Record<GarmentType, GarmentConfig> = {
  tshirt: {
    type: "tshirt",
    label: "T-Shirt",
    labelKo: "티셔츠",
    modelPath: "/models/tshirt.glb",
    decalMeshName: "T_Shirt_male",
    decalPositionFront: [0, 0.05, 0.15],
    decalPositionBack: [0, 0.05, -0.15],
    printArea: { width: 0.7, height: 0.6 },
    fabricTexture: { type: "cotton", roughness: 0.85, normalScale: 0.5 },
    sizes: DEFAULT_SIZES,
  },
  hoodie: {
    type: "hoodie",
    label: "Hoodie",
    labelKo: "후디",
    modelPath: "/models/hoodie.glb",
    decalMeshName: "Object_2",
    decalPositionFront: [0, 0.1, 0.18],
    decalPositionBack: [0, 0.1, -0.18],
    printArea: { width: 0.65, height: 0.55 },
    fabricTexture: { type: "fleece", roughness: 0.7, normalScale: 0.8 },
    sizes: {
      S:  { chest: 97, length: 66, shoulder: 44 },
      M:  { chest: 103, length: 69, shoulder: 46 },
      L:  { chest: 109, length: 72, shoulder: 48 },
      XL: { chest: 115, length: 75, shoulder: 50 },
    },
  },
  longsleeve: {
    type: "longsleeve",
    label: "Long Sleeve",
    labelKo: "긴팔",
    modelPath: "/models/longsleeve.glb",
    decalMeshName: "LongSleeve_Body",
    decalPositionFront: [0, 0.05, 0.15],
    decalPositionBack: [0, 0.05, -0.15],
    printArea: { width: 0.7, height: 0.6 },
    fabricTexture: { type: "cotton", roughness: 0.85, normalScale: 0.5 },
    sizes: DEFAULT_SIZES,
  },
  tanktop: {
    type: "tanktop",
    label: "Tank Top",
    labelKo: "나시",
    modelPath: "/models/tanktop.glb",
    decalMeshName: "TankTop_Body",
    decalPositionFront: [0, 0.05, 0.14],
    decalPositionBack: [0, 0.05, -0.14],
    printArea: { width: 0.65, height: 0.65 },
    fabricTexture: { type: "cotton", roughness: 0.82, normalScale: 0.4 },
    sizes: {
      S:  { chest: 88, length: 65, shoulder: 30 },
      M:  { chest: 94, length: 68, shoulder: 32 },
      L:  { chest: 100, length: 71, shoulder: 34 },
      XL: { chest: 106, length: 74, shoulder: 36 },
    },
  },
  polo: {
    type: "polo",
    label: "Polo",
    labelKo: "폴로",
    modelPath: "/models/polo.glb",
    decalMeshName: "Polo_Body",
    decalPositionFront: [0, 0.05, 0.15],
    decalPositionBack: [0, 0.05, -0.15],
    printArea: { width: 0.65, height: 0.55 },
    fabricTexture: { type: "cotton", roughness: 0.8, normalScale: 0.45 },
    sizes: DEFAULT_SIZES,
  },
};
