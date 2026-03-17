import { useRef, useCallback } from "react";
import { useDesignStore } from "../../store/useDesignStore";
import { useGarmentStore } from "../../store/useGarmentStore";
import { useUIStore } from "../../store/useUIStore";
import { GARMENT_CONFIGS } from "../../types/garment";
import type { ThreeEvent } from "@react-three/fiber";
import type { Mesh } from "three";

interface DragHandlerProps {
  mesh: Mesh | null;
  children: React.ReactNode;
}

/**
 * Wraps garment group with pointer event handlers for dragging selected decals.
 * Uses R3F's built-in raycasting via event.point.
 */
export default function DragHandler({ mesh, children }: DragHandlerProps) {
  const isDragging = useRef(false);

  const selectedId = useDesignStore((s) => s.selectedId);
  const elements = useDesignStore((s) => s.elements);
  const updateElement = useDesignStore((s) => s.updateElement);
  const selectElement = useDesignStore((s) => s.selectElement);
  const garmentType = useGarmentStore((s) => s.garmentType);
  const viewSide = useUIStore((s) => s.viewSide);

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!selectedId || !mesh) return;
      isDragging.current = true;
      e.stopPropagation();
    },
    [selectedId, mesh]
  );

  const handlePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!isDragging.current || !selectedId) return;
      e.stopPropagation();

      const el = elements.find((el) => el.id === selectedId);
      if (!el) return;

      const config = GARMENT_CONFIGS[garmentType];
      const basePos =
        el.side === "front"
          ? config.decalPositionFront
          : config.decalPositionBack;

      // e.point is the intersection point on the mesh surface
      const offsetX = e.point.x - basePos[0];
      const offsetY = e.point.y - basePos[1];

      // Clamp to reasonable range
      const clampedX = Math.max(-0.15, Math.min(0.15, offsetX));
      const clampedY = Math.max(-0.2, Math.min(0.2, offsetY));

      updateElement(selectedId, {
        position: [clampedX, clampedY, el.position[2]],
      });
    },
    [selectedId, elements, garmentType, updateElement]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      // If clicking on the garment without dragging, deselect
      if (!isDragging.current && selectedId) {
        // Only deselect if we're in free view or matching side
        const el = elements.find((el) => el.id === selectedId);
        if (el) {
          const clickedFront = e.point.z > 0;
          const elSide = el.side;
          const matchesSide =
            (clickedFront && elSide === "front") ||
            (!clickedFront && elSide === "back");
          if (!matchesSide) {
            selectElement(null);
          }
        }
      }
    },
    [selectedId, elements, selectElement, viewSide]
  );

  return (
    <group
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleClick}
    >
      {children}
    </group>
  );
}
