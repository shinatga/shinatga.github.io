import { useState } from "react";
import { Plus } from "lucide-react";
import { useDesignStore } from "../../store/useDesignStore";
import { useUIStore } from "../../store/useUIStore";

const FONT_OPTIONS = [
  { value: "Arial", label: "Arial" },
  { value: "'Noto Sans KR'", label: "Noto Sans KR" },
  { value: "'Playfair Display'", label: "Playfair Display" },
  { value: "'Bebas Neue'", label: "Bebas Neue" },
  { value: "'Permanent Marker'", label: "Permanent Marker" },
  { value: "'Black Han Sans'", label: "Black Han Sans" },
  { value: "'Oswald'", label: "Oswald" },
  { value: "monospace", label: "Monospace" },
];

export default function TextPanel() {
  const activePanel = useUIStore((s) => s.activePanel);
  const addText = useDesignStore((s) => s.addText);
  const viewSide = useUIStore((s) => s.viewSide);

  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#ffffff");
  const [fontWeight, setFontWeight] = useState<"normal" | "bold">("bold");
  const [fontFamily, setFontFamily] = useState("Arial");

  if (activePanel !== "text") return null;

  const handleAdd = () => {
    if (!text.trim()) return;
    addText({
      text: text.trim(),
      fontSize,
      color,
      fontWeight,
      fontFamily,
      side: viewSide === "back" ? "back" : "front",
    });
    setText("");
  };

  return (
    <div className="absolute top-4 left-44 w-64 rounded-lg bg-[#1a1a1a]/95 backdrop-blur-sm border border-[#2a2a2a] p-4 z-10">
      <h3 className="text-sm font-semibold mb-3 text-white">Add Text</h3>

      <div className="space-y-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Enter text..."
          className="w-full px-3 py-2 rounded-md bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        />

        {/* Font selector */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Font</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full px-3 py-1.5 rounded-md bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Size</label>
            <input
              type="range"
              min={12}
              max={120}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <span className="text-xs text-gray-500">{fontSize}px</span>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setFontWeight("normal")}
            className={`px-3 py-1 rounded text-xs ${
              fontWeight === "normal"
                ? "bg-indigo-500 text-white"
                : "bg-[#0a0a0a] text-gray-400"
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => setFontWeight("bold")}
            className={`px-3 py-1 rounded text-xs font-bold ${
              fontWeight === "bold"
                ? "bg-indigo-500 text-white"
                : "bg-[#0a0a0a] text-gray-400"
            }`}
          >
            Bold
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={!text.trim()}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium transition-colors"
        >
          <Plus size={14} />
          Add Text
        </button>
      </div>
    </div>
  );
}
