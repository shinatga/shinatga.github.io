import { useUIStore } from "../../store/useUIStore";
import { useGarmentStore } from "../../store/useGarmentStore";
import { GARMENT_CONFIGS } from "../../types/garment";

export default function PrintGuide() {
  const showPrintGuide = useUIStore((s) => s.showPrintGuide);
  const garmentType = useGarmentStore((s) => s.garmentType);
  const config = GARMENT_CONFIGS[garmentType];

  if (!showPrintGuide) return null;

  const { width, height } = config.printArea;
  const pxW = Math.round(width * 300);
  const pxH = Math.round(height * 400);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-5">
      <div
        className="border-2 border-dashed border-cyan-400/60 rounded-sm relative"
        style={{ width: `${pxW}px`, height: `${pxH}px` }}
      >
        {/* Corner marks */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

        {/* Label */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-medium whitespace-nowrap">
          Print Area ({Math.round(width * 100)}% x {Math.round(height * 100)}%)
        </div>

        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-px h-4 bg-cyan-400/30 absolute left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="h-px w-4 bg-cyan-400/30 absolute top-1/2 -translate-y-1/2 -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
