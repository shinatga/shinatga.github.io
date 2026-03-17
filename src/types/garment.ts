export type GarmentType = "tshirt" | "hoodie";

export interface FabricTexture {
  type: "cotton" | "fleece";
  roughness: number;
  normalScale: number;
}

export interface GarmentConfig {
  type: GarmentType;
  label: string;
  modelPath: string;
  decalMeshName: string;
  decalPositionFront: [number, number, number];
  decalPositionBack: [number, number, number];
  fabricTexture: FabricTexture;
}

export const GARMENT_CONFIGS: Record<GarmentType, GarmentConfig> = {
  tshirt: {
    type: "tshirt",
    label: "T-Shirt",
    modelPath: "/models/tshirt.glb",
    decalMeshName: "T_Shirt_male",
    decalPositionFront: [0, 0.05, 0.15],
    decalPositionBack: [0, 0.05, -0.15],
    fabricTexture: {
      type: "cotton",
      roughness: 0.85,
      normalScale: 0.5,
    },
  },
  hoodie: {
    type: "hoodie",
    label: "Hoodie",
    modelPath: "/models/hoodie.glb",
    decalMeshName: "Object_2",
    decalPositionFront: [0, 0.1, 0.18],
    decalPositionBack: [0, 0.1, -0.18],
    fabricTexture: {
      type: "fleece",
      roughness: 0.7,
      normalScale: 0.8,
    },
  },
};
