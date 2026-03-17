import { TextureLoader, RepeatWrapping, SRGBColorSpace, LinearSRGBColorSpace } from "three";
import type { Texture } from "three";

export type FabricType = "cotton" | "performance" | "denim" | "silk" | "linen" | "fleece";

export interface FabricInfo {
  type: FabricType;
  label: string;
  labelKo: string;
  roughness: number;
  normalScale: number;
  metalness: number;
  repeat: number;
  /** ambientCG source ID (CC0) */
  source: string;
}

export const FABRIC_CATALOG: Record<FabricType, FabricInfo> = {
  cotton: {
    type: "cotton",
    label: "Cotton",
    labelKo: "면",
    roughness: 0.85,
    normalScale: 0.5,
    metalness: 0,
    repeat: 4,
    source: "ambientCG/Fabric038",
  },
  performance: {
    type: "performance",
    label: "Performance",
    labelKo: "기능성",
    roughness: 0.4,
    normalScale: 0.3,
    metalness: 0.05,
    repeat: 6,
    source: "ambientCG/Fabric048",
  },
  denim: {
    type: "denim",
    label: "Denim",
    labelKo: "데님",
    roughness: 0.92,
    normalScale: 0.7,
    metalness: 0,
    repeat: 3,
    source: "ambientCG/Fabric004",
  },
  silk: {
    type: "silk",
    label: "Silk",
    labelKo: "실크",
    roughness: 0.2,
    normalScale: 0.15,
    metalness: 0.08,
    repeat: 5,
    source: "ambientCG/Fabric030",
  },
  linen: {
    type: "linen",
    label: "Linen",
    labelKo: "린넨",
    roughness: 0.9,
    normalScale: 0.6,
    metalness: 0,
    repeat: 3,
    source: "ambientCG/Fabric026",
  },
  fleece: {
    type: "fleece",
    label: "Fleece",
    labelKo: "플리스",
    roughness: 0.7,
    normalScale: 0.8,
    metalness: 0,
    repeat: 3,
    source: "ambientCG/Fabric032",
  },
};

export interface FabricTextureSet {
  normalMap: Texture;
  roughnessMap: Texture;
}

const loader = new TextureLoader();
const cache = new Map<FabricType, FabricTextureSet>();

function loadTex(path: string, repeat: number, colorSpace: typeof SRGBColorSpace | typeof LinearSRGBColorSpace): Promise<Texture> {
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (tex) => {
        tex.wrapS = tex.wrapT = RepeatWrapping;
        tex.repeat.set(repeat, repeat);
        tex.colorSpace = colorSpace;
        tex.needsUpdate = true;
        resolve(tex);
      },
      undefined,
      reject,
    );
  });
}

/**
 * Load real PBR textures from ambientCG (CC0).
 * Returns cached textures if already loaded.
 */
export async function loadFabricTextures(fabricType: FabricType): Promise<FabricTextureSet> {
  const cached = cache.get(fabricType);
  if (cached) return cached;

  const info = FABRIC_CATALOG[fabricType];
  const base = `/textures/${fabricType}`;

  const [normalMap, roughnessMap] = await Promise.all([
    loadTex(`${base}/normal.jpg`, info.repeat, LinearSRGBColorSpace),
    loadTex(`${base}/roughness.jpg`, info.repeat, LinearSRGBColorSpace),
  ]);

  const set: FabricTextureSet = { normalMap, roughnessMap };
  cache.set(fabricType, set);
  return set;
}

/**
 * Get cached textures synchronously (returns undefined if not yet loaded).
 */
export function getFabricTexturesSync(fabricType: FabricType): FabricTextureSet | undefined {
  return cache.get(fabricType);
}

export function disposeFabricTextures() {
  for (const set of cache.values()) {
    set.normalMap.dispose();
    set.roughnessMap.dispose();
  }
  cache.clear();
}
