import { useEffect, useRef } from "react";
import { CameraControls } from "@react-three/drei";
import { useUIStore } from "../../store/useUIStore";
import CameraControlsImpl from "camera-controls";

export default function Controls() {
  const controlsRef = useRef<CameraControlsImpl>(null);
  const viewSide = useUIStore((s) => s.viewSide);

  useEffect(() => {
    const cc = controlsRef.current;
    if (!cc) return;

    cc.smoothTime = 0.35;

    switch (viewSide) {
      case "front":
        cc.setLookAt(0, 0.2, 1.5, 0, 0, 0, true);
        break;
      case "back":
        cc.setLookAt(0, 0.2, -1.5, 0, 0, 0, true);
        break;
      case "left":
        cc.setLookAt(-1.5, 0.2, 0, 0, 0, 0, true);
        break;
      case "right":
        cc.setLookAt(1.5, 0.2, 0, 0, 0, 0, true);
        break;
      // "free" - no camera movement, user controls freely
    }
  }, [viewSide]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={0.5}
      maxDistance={3}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={(3 * Math.PI) / 4}
    />
  );
}
