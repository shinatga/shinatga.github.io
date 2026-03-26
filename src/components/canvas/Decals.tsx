import { useMemo, useState, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { Decal } from "@react-three/drei";
import { useDesignStore } from "../../store/useDesignStore";
import { useGarmentStore } from "../../store/useGarmentStore";
import { GARMENT_CONFIGS } from "../../types/garment";
import { createTextTexture, createImageTexture } from "../../lib/texture-generator";
import type { Mesh, CanvasTexture } from "three";
import type { ImageElement, TextElement } from "../../types/design";

interface DecalsProps {
  mesh: Mesh | null;
  meshRef: RefObject<Mesh>;
}

function TextDecal({ element, meshRef }: { element: TextElement; meshRef: RefObject<Mesh> }) {
  const garmentType = useGarmentStore((s) => s.garmentType);
  const config = GARMENT_CONFIGS[garmentType];
  const basePos = element.side === "front" ? config.decalPositionFront : config.decalPositionBack;

  const texture = useMemo(
    () =>
      createTextTexture({
        text: element.text,
        fontSize: element.fontSize,
        fontFamily: element.fontFamily,
        fontWeight: element.fontWeight,
        color: element.color,
      }),
    [element.text, element.fontSize, element.fontFamily, element.fontWeight, element.color]
  );

  // Dispose texture on cleanup or when it changes
  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  const position: [number, number, number] = [
    basePos[0] + element.position[0],
    basePos[1] + element.position[1],
    basePos[2],
  ];

  return (
    <Decal
      mesh={meshRef}
      position={position}
      rotation={[0, element.side === "back" ? Math.PI : 0, element.rotation]}
      scale={element.scale}
      map={texture}
      depthTest={false}
    />
  );
}

function ImageDecal({ element, meshRef }: { element: ImageElement; meshRef: RefObject<Mesh> }) {
  const garmentType = useGarmentStore((s) => s.garmentType);
  const config = GARMENT_CONFIGS[garmentType];
  const basePos = element.side === "front" ? config.decalPositionFront : config.decalPositionBack;
  const [texture, setTexture] = useState<CanvasTexture | null>(null);
  const textureRef = useRef<CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    createImageTexture(element.src).then((tex) => {
      if (!cancelled) {
        textureRef.current?.dispose();
        textureRef.current = tex;
        setTexture(tex);
      }
    });
    return () => {
      cancelled = true;
      textureRef.current?.dispose();
      textureRef.current = null;
    };
  }, [element.src]);

  if (!texture) return null;

  const position: [number, number, number] = [
    basePos[0] + element.position[0],
    basePos[1] + element.position[1],
    basePos[2],
  ];

  return (
    <Decal
      mesh={meshRef}
      position={position}
      rotation={[0, element.side === "back" ? Math.PI : 0, element.rotation]}
      scale={element.scale}
      map={texture}
      depthTest={false}
    />
  );
}

export default function Decals({ mesh, meshRef }: DecalsProps) {
  const elements = useDesignStore((s) => s.elements);

  if (!mesh) return null;

  return (
    <>
      {elements
        .filter((el) => el.visible)
        .map((el) =>
          el.type === "text" ? (
            <TextDecal key={el.id} element={el} meshRef={meshRef} />
          ) : (
            <ImageDecal key={el.id} element={el as ImageElement} meshRef={meshRef} />
          )
        )}
    </>
  );
}
