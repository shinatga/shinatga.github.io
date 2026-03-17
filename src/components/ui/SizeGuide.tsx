import { useUIStore } from "../../store/useUIStore";
import { useGarmentStore } from "../../store/useGarmentStore";
import { GARMENT_CONFIGS } from "../../types/garment";
import type { GarmentSize } from "../../types/garment";

const SIZES: GarmentSize[] = ["S", "M", "L", "XL"];

export default function SizeGuide() {
  const showSizeGuide = useUIStore((s) => s.showSizeGuide);
  const selectedSize = useUIStore((s) => s.selectedSize);
  const setSelectedSize = useUIStore((s) => s.setSelectedSize);
  const garmentType = useGarmentStore((s) => s.garmentType);
  const config = GARMENT_CONFIGS[garmentType];

  if (!showSizeGuide) return null;

  const dims = config.sizes[selectedSize];

  return (
    <div className="absolute top-4 right-4 w-48 rounded-lg bg-[#1a1a1a]/95 backdrop-blur-sm border border-[#2a2a2a] p-3 z-10">
      <h3 className="text-xs font-semibold text-white mb-2">
        Size Guide — {config.labelKo}
      </h3>

      {/* Size selector */}
      <div className="flex gap-1 mb-3">
        {SIZES.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`flex-1 py-1 rounded text-xs font-medium transition-colors ${
              selectedSize === size
                ? "bg-indigo-500 text-white"
                : "bg-[#0a0a0a] text-gray-400 hover:text-white"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Dimensions */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Chest</span>
          <span className="text-white font-medium">{dims.chest} cm</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Length</span>
          <span className="text-white font-medium">{dims.length} cm</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Shoulder</span>
          <span className="text-white font-medium">{dims.shoulder} cm</span>
        </div>
      </div>

      {/* Size comparison bar */}
      <div className="mt-3 pt-2 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-1">
          {SIZES.map((size) => {
            const w = config.sizes[size].chest;
            const maxW = config.sizes.XL.chest;
            const pct = (w / maxW) * 100;
            return (
              <div key={size} className="flex-1 flex flex-col items-center gap-0.5">
                <div
                  className={`w-full rounded-sm transition-all ${
                    size === selectedSize ? "bg-indigo-500" : "bg-[#2a2a2a]"
                  }`}
                  style={{ height: `${pct * 0.2}px` }}
                />
                <span className="text-[9px] text-gray-500">{size}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
