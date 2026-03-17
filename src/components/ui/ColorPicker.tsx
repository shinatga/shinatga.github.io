import { useGarmentStore } from "../../store/useGarmentStore";
import { useUIStore } from "../../store/useUIStore";

const presetColors = [
  "#2d2d2d", "#1a1a1a", "#ffffff", "#f5f5f4",
  "#dc2626", "#ea580c", "#eab308", "#16a34a",
  "#2563eb", "#7c3aed", "#db2777", "#0891b2",
];

export default function ColorPicker() {
  const activePanel = useUIStore((s) => s.activePanel);
  const garmentColor = useGarmentStore((s) => s.garmentColor);
  const setGarmentColor = useGarmentStore((s) => s.setGarmentColor);

  if (activePanel !== "color") return null;

  return (
    <div className="absolute top-4 left-44 w-64 rounded-lg bg-[#1a1a1a]/95 backdrop-blur-sm border border-[#2a2a2a] p-4 z-10">
      <h3 className="text-sm font-semibold mb-3 text-white">Garment Color</h3>

      <div className="space-y-3">
        <div className="grid grid-cols-6 gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => setGarmentColor(color)}
              className={`w-8 h-8 rounded-md border-2 transition-transform hover:scale-110 ${
                garmentColor === color
                  ? "border-indigo-500 scale-110"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Custom:</label>
          <input
            type="color"
            value={garmentColor}
            onChange={(e) => setGarmentColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
          />
          <span className="text-xs text-gray-500 font-mono">{garmentColor}</span>
        </div>
      </div>
    </div>
  );
}
