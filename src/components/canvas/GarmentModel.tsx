import { useRef, useEffect, useMemo, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useGarmentStore } from "../../store/useGarmentStore";
import { GARMENT_CONFIGS } from "../../types/garment";
import { loadFabricTextures, FABRIC_CATALOG } from "../../lib/fabric-textures";
import type { FabricTextureSet } from "../../lib/fabric-textures";
import { MeshStandardMaterial, Vector2 } from "three";
import type { Group, Mesh } from "three";

interface GarmentModelProps {
  onMeshReady: (mesh: Mesh | null) => void;
}

export default function GarmentModel({ onMeshReady }: GarmentModelProps) {
  const groupRef = useRef<Group>(null);
  const onMeshReadyRef = useRef(onMeshReady);
  onMeshReadyRef.current = onMeshReady;

  const garmentType = useGarmentStore((s) => s.garmentType);
  const garmentColor = useGarmentStore((s) => s.garmentColor);
  const fabricType = useGarmentStore((s) => s.fabricType);
  const config = GARMENT_CONFIGS[garmentType];
  const fabricInfo = FABRIC_CATALOG[fabricType];

  const [textures, setTextures] = useState<FabricTextureSet | null>(null);

  const { scene } = useGLTF(config.modelPath, false, true);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Load textures async
  useEffect(() => {
    let cancelled = false;
    loadFabricTextures(fabricType).then((set) => {
      if (!cancelled) setTextures(set);
    });
    return () => { cancelled = true; };
  }, [fabricType]);

  // Apply materials when textures or other deps change
  useEffect(() => {
    if (!textures) return;

    const clonedMaterials: MeshStandardMaterial[] = [];
    let namedMesh: Mesh | null = null;
    let firstMesh: Mesh | null = null;

    clonedScene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;

        const clonedMat = mesh.material instanceof MeshStandardMaterial
          ? mesh.material.clone()
          : new MeshStandardMaterial();

        clonedMat.color.set(garmentColor);

        // Clone textures to avoid cache pollution
        const normalClone = textures.normalMap.clone();
        normalClone.needsUpdate = true;
        clonedMat.normalMap = normalClone;
        clonedMat.normalScale = new Vector2(
          fabricInfo.normalScale,
          fabricInfo.normalScale
        );

        const roughnessClone = textures.roughnessMap.clone();
        roughnessClone.needsUpdate = true;
        clonedMat.roughnessMap = roughnessClone;
        clonedMat.roughness = fabricInfo.roughness;
        clonedMat.metalness = fabricInfo.metalness;

        mesh.material = clonedMat;
        clonedMaterials.push(clonedMat);

        if (mesh.name === config.decalMeshName && !namedMesh) {
          namedMesh = mesh;
        }
        if (!firstMesh) {
          firstMesh = mesh;
        }
      }
    });

    const targetMesh = namedMesh ?? firstMesh;
    onMeshReadyRef.current(targetMesh);

    return () => {
      onMeshReadyRef.current(null);
      for (const mat of clonedMaterials) {
        mat.normalMap?.dispose();
        mat.roughnessMap?.dispose();
        mat.dispose();
      }
    };
  }, [clonedScene, garmentColor, garmentType, fabricType, fabricInfo, textures, config]);

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/models/tshirt.glb", false, true);
