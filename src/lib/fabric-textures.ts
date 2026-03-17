import { CanvasTexture, RepeatWrapping, LinearSRGBColorSpace } from "three";

export type FabricType = "cotton" | "performance" | "denim" | "silk" | "linen" | "fleece";

export interface FabricInfo {
  type: FabricType;
  label: string;
  labelKo: string;
  roughness: number;
  normalScale: number;
  metalness: number;
}

export const FABRIC_CATALOG: Record<FabricType, FabricInfo> = {
  cotton: {
    type: "cotton",
    label: "Cotton",
    labelKo: "면",
    roughness: 0.85,
    normalScale: 0.5,
    metalness: 0,
  },
  performance: {
    type: "performance",
    label: "Performance",
    labelKo: "기능성",
    roughness: 0.4,
    normalScale: 0.3,
    metalness: 0.05,
  },
  denim: {
    type: "denim",
    label: "Denim",
    labelKo: "데님",
    roughness: 0.92,
    normalScale: 0.7,
    metalness: 0,
  },
  silk: {
    type: "silk",
    label: "Silk",
    labelKo: "실크",
    roughness: 0.2,
    normalScale: 0.15,
    metalness: 0.08,
  },
  linen: {
    type: "linen",
    label: "Linen",
    labelKo: "린넨",
    roughness: 0.9,
    normalScale: 0.6,
    metalness: 0,
  },
  fleece: {
    type: "fleece",
    label: "Fleece",
    labelKo: "플리스",
    roughness: 0.7,
    normalScale: 0.8,
    metalness: 0,
  },
};

interface FabricTextureSet {
  normalMap: CanvasTexture;
  roughnessMap: CanvasTexture;
}

const cache = new Map<string, FabricTextureSet>();

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function makeNormalTex(size: number, repeat: number, generator: (x: number, y: number, size: number, rand: () => number) => [number, number, number], seed: number): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  const rand = seededRandom(seed);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const [nx, ny, nz] = generator(x, y, size, rand);
      data[idx] = Math.round((nx * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.round(nz * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const tex = new CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = LinearSRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function makeRoughnessTex(size: number, repeat: number, generator: (x: number, y: number, size: number, rand: () => number) => number, seed: number): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  const rand = seededRandom(seed);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const v = Math.max(0, Math.min(255, generator(x, y, size, rand)));
      data[idx] = data[idx + 1] = data[idx + 2] = v;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const tex = new CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = LinearSRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

// ─── Fabric Generators ──────────────────────────────────────

const fabricGenerators: Record<FabricType, { normal: () => CanvasTexture; roughness: () => CanvasTexture }> = {
  cotton: {
    normal: () => makeNormalTex(256, 4, (x, y, size, rand) => {
      const warp = Math.sin((x / size) * Math.PI * 64) * 0.15;
      const weft = Math.sin((y / size) * Math.PI * 64) * 0.15;
      const noise = (rand() - 0.5) * 0.08;
      return [warp + noise, weft + noise, 1];
    }, 42),
    roughness: () => makeRoughnessTex(256, 4, (x, y, size, rand) => {
      const thread = Math.sin((x / size) * Math.PI * 64) * 5 + Math.sin((y / size) * Math.PI * 64) * 5;
      return 210 + (rand() - 0.5) * 30 + thread;
    }, 123),
  },

  performance: {
    // Smooth athletic fabric with micro-mesh pattern
    normal: () => makeNormalTex(256, 6, (x, y, size, rand) => {
      // Fine diamond mesh pattern
      const meshX = Math.sin((x / size) * Math.PI * 80 + (y / size) * Math.PI * 40) * 0.06;
      const meshY = Math.sin((y / size) * Math.PI * 80 + (x / size) * Math.PI * 40) * 0.06;
      const noise = (rand() - 0.5) * 0.02;
      return [meshX + noise, meshY + noise, 1];
    }, 200),
    roughness: () => makeRoughnessTex(256, 6, (x, y, size, rand) => {
      // Very smooth with subtle variation
      const mesh = Math.sin((x / size) * Math.PI * 80) * Math.sin((y / size) * Math.PI * 80) * 8;
      return 100 + (rand() - 0.5) * 15 + mesh;
    }, 201),
  },

  denim: {
    // Twill weave with diagonal pattern
    normal: () => makeNormalTex(256, 3, (x, y, size, rand) => {
      // Diagonal twill weave
      const diag = ((x + y) / size) * Math.PI * 48;
      const twillX = Math.sin(diag) * 0.2;
      const twillY = Math.cos(diag) * 0.15;
      // Cross threads
      const weft = Math.sin((y / size) * Math.PI * 32) * 0.08;
      const noise = (rand() - 0.5) * 0.1;
      return [twillX + noise, twillY + weft + noise, 0.95];
    }, 300),
    roughness: () => makeRoughnessTex(256, 3, (x, y, size, rand) => {
      const diag = Math.sin(((x + y) / size) * Math.PI * 48) * 8;
      return 225 + (rand() - 0.5) * 25 + diag;
    }, 301),
  },

  silk: {
    // Very smooth with subtle luster variations
    normal: () => makeNormalTex(256, 5, (x, y, size, rand) => {
      // Extremely subtle — silk is almost flat
      const flow = Math.sin((x / size) * Math.PI * 8 + Math.sin((y / size) * Math.PI * 4) * 2) * 0.03;
      const noise = (rand() - 0.5) * 0.015;
      return [flow + noise, noise, 1];
    }, 400),
    roughness: () => makeRoughnessTex(256, 5, (x, y, size, rand) => {
      // Very low roughness (shiny) with subtle sheen variation
      const sheen = Math.sin((x / size) * Math.PI * 12) * Math.cos((y / size) * Math.PI * 8) * 10;
      return 55 + (rand() - 0.5) * 12 + sheen;
    }, 401),
  },

  linen: {
    // Coarse, visible fiber weave
    normal: () => makeNormalTex(256, 3, (x, y, size, rand) => {
      // Irregular woven pattern — thicker threads than cotton
      const warp = Math.sin((x / size) * Math.PI * 28) * 0.2;
      const weft = Math.sin((y / size) * Math.PI * 24) * 0.18;
      // Fiber irregularity
      const irregX = Math.sin((x / size) * Math.PI * 7 + rand() * 2) * 0.06;
      const irregY = Math.sin((y / size) * Math.PI * 5 + rand() * 2) * 0.06;
      const noise = (rand() - 0.5) * 0.12;
      return [warp + irregX + noise, weft + irregY + noise, 0.95];
    }, 500),
    roughness: () => makeRoughnessTex(256, 3, (x, y, size, rand) => {
      const thread = Math.sin((x / size) * Math.PI * 28) * 6 + Math.sin((y / size) * Math.PI * 24) * 6;
      return 220 + (rand() - 0.5) * 35 + thread;
    }, 501),
  },

  fleece: {
    normal: () => makeNormalTex(256, 3, (x, y, size, rand) => {
      const fuzzX = (rand() - 0.5) * 0.25;
      const fuzzY = (rand() - 0.5) * 0.25;
      const waveX = Math.sin((x / size) * Math.PI * 16) * 0.1;
      const waveY = Math.cos((y / size) * Math.PI * 16) * 0.1;
      return [fuzzX + waveX, fuzzY + waveY, 0.94];
    }, 77),
    roughness: () => makeRoughnessTex(256, 3, (_x, _y, _size, rand) => {
      return 180 + (rand() - 0.5) * 40;
    }, 99),
  },
};

export function getFabricTextures(fabricType: FabricType): FabricTextureSet {
  const cached = cache.get(fabricType);
  if (cached) return cached;

  const gen = fabricGenerators[fabricType];
  const set: FabricTextureSet = {
    normalMap: gen.normal(),
    roughnessMap: gen.roughness(),
  };

  cache.set(fabricType, set);
  return set;
}

export function disposeFabricTextures() {
  for (const set of cache.values()) {
    set.normalMap.dispose();
    set.roughnessMap.dispose();
  }
  cache.clear();
}
