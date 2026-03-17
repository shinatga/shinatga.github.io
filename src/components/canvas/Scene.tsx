import { Suspense, useState, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, ToneMapping, SSAO, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import GarmentModel from "./GarmentModel";
import Decals from "./Decals";
import DragHandler from "./DragHandler";
import Controls from "./Controls";
import type { Mesh, WebGLRenderer } from "three";

interface SceneProps {
  onRendererReady?: (gl: WebGLRenderer) => void;
  postProcessingEnabled?: boolean;
}

export default function Scene({ onRendererReady, postProcessingEnabled = true }: SceneProps) {
  const [mesh, setMesh] = useState<Mesh | null>(null);
  const rendererReported = useRef(false);

  const handleCreated = useCallback(
    ({ gl }: { gl: WebGLRenderer }) => {
      if (!rendererReported.current && onRendererReady) {
        rendererReported.current = true;
        onRendererReady(gl);
      }
    },
    [onRendererReady]
  );

  return (
    <Canvas
      camera={{ position: [0, 0.2, 1.5], fov: 40 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
      onCreated={handleCreated}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 3, -5]} intensity={0.3} />
      <directionalLight position={[0, -2, 3]} intensity={0.15} />

      <Suspense fallback={null}>
        <DragHandler mesh={mesh}>
          <GarmentModel onMeshReady={setMesh} />
          <Decals mesh={mesh} />
        </DragHandler>
        <Environment files="/hdri/studio.hdr" />
        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.4}
          scale={2}
          blur={2.5}
        />
      </Suspense>

      {postProcessingEnabled && (
        <EffectComposer>
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <SSAO
            radius={0.03}
            intensity={4}
            luminanceInfluence={0.7}
            worldDistanceThreshold={0.3}
            worldDistanceFalloff={0.05}
            worldProximityThreshold={0.3}
            worldProximityFalloff={0.1}
          />
          <Vignette eskil={false} offset={0.25} darkness={0.4} />
        </EffectComposer>
      )}

      <Controls />
    </Canvas>
  );
}
