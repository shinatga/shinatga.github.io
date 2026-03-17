import { useRef, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useGarmentStore } from "../../store/useGarmentStore";
import { GARMENT_CONFIGS } from "../../types/garment";
import { getFabricTextures, FABRIC_CATALOG } from "../../lib/fabric-textures";
import { MeshStandardMaterial, Vector2 } from "three";
import type { Group, Mesh } from "three";

interface GarmentModelProps {
  onMeshReady: (mesh: Mesh | null) => void;
}

export default function GarmentModel({ onMeshReady }: GarmentModelProps) {
  const groupRef = useRef<Group>(null);
  const garmentType = useGarmentStore((s) => s.garmentType);
  const garmentColor = useGarmentStore((s) => s.garmentColor);
  const fabricType = useGarmentStore((s) => s.fabricType);
  const config = GARMENT_CONFIGS[garmentType];
  const fabricInfo = FABRIC_CATALOG[fabricType];

  const { scene } = useGLTF(config.modelPath);

  // Clone scene to avoid mutating the useGLTF cache
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    const clonedMaterials: MeshStandardMaterial[] = [];
    const fabric = getFabricTextures(fabricType);

    let namedMesh: Mesh | null = null;
    let firstMesh: Mesh | null = null;

    clonedScene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;

        const clonedMat = mesh.material instanceof MeshStandardMaterial
          ? mesh.material.clone()
          : new MeshStandardMaterial();

        // Apply garment color
        clonedMat.color.set(garmentColor);

        // Apply PBR fabric textures
        const normalClone = fabric.normalMap.clone();
        normalClone.needsUpdate = true;
        clonedMat.normalMap = normalClone;
        clonedMat.normalScale = new Vector2(
          fabricInfo.normalScale,
          fabricInfo.normalScale
        );

        const roughnessClone = fabric.roughnessMap.clone();
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
    onMeshReady(targetMesh);

    return () => {
      onMeshReady(null);
      for (const mat of clonedMaterials) {
        mat.normalMap?.dispose();
        mat.roughnessMap?.dispose();
        mat.dispose();
      }
    };
  }, [clonedScene, garmentColor, garmentType, fabricType, fabricInfo, onMeshReady, config]);

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}
