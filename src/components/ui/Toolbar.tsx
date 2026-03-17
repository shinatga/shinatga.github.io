import {
  Shirt,
  Type,
  ImagePlus,
  Palette,
  Layers,
  Download,
  RotateCcw,
  Eye,
  ArrowLeft,
  ArrowRight,
  Scissors,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Grid3x3,
  Ruler,
} from "lucide-react";
import { useGarmentStore } from "../../store/useGarmentStore";
import { useDesignStore } from "../../store/useDesignStore";
import { useUIStore } from "../../store/useUIStore";
import { FABRIC_CATALOG } from "../../lib/fabric-textures";
import type { FabricType } from "../../lib/fabric-textures";
import type { GarmentType } from "../../types/garment";
import type { ActivePanel, ViewSide } from "../../store/useUIStore";

const garmentOptions: { type: GarmentType; label: string }[] = [
  { type: "tshirt", label: "T-Shirt" },
  { type: "longsleeve", label: "Long Sleeve" },
  { type: "tanktop", label: "Tank Top" },
  { type: "polo", label: "Polo" },
  { type: "hoodie", label: "Hoodie" },
];

const panelButtons: { panel: ActivePanel; icon: typeof Type; label: string }[] = [
  { panel: "text", icon: Type, label: "Text" },
  { panel: "image", icon: ImagePlus, label: "Image" },
  { panel: "color", icon: Palette, label: "Color" },
  { panel: "layers", icon: Layers, label: "Layers" },
];

const viewButtons: { side: ViewSide; icon: typeof Eye; label: string }[] = [
  { side: "front", icon: Eye, label: "Front" },
  { side: "back", icon: Eye, label: "Back" },
  { side: "left", icon: ArrowLeft, label: "Left" },
  { side: "right", icon: ArrowRight, label: "Right" },
  { side: "free", icon: RotateCcw, label: "Free" },
];

const fabricOptions: FabricType[] = ["cotton", "performance", "denim", "silk", "linen", "fleece"];

interface ToolbarProps {
  onExport: () => void;
}

export default function Toolbar({ onExport }: ToolbarProps) {
  const garmentType = useGarmentStore((s) => s.garmentType);
  const setGarmentType = useGarmentStore((s) => s.setGarmentType);
  const fabricType = useGarmentStore((s) => s.fabricType);
  const setFabricType = useGarmentStore((s) => s.setFabricType);
  const viewSide = useUIStore((s) => s.viewSide);
  const setViewSide = useUIStore((s) => s.setViewSide);
  const activePanel = useUIStore((s) => s.activePanel);
  const togglePanel = useUIStore((s) => s.togglePanel);

  const showPrintGuide = useUIStore((s) => s.showPrintGuide);
  const togglePrintGuide = useUIStore((s) => s.togglePrintGuide);
  const showSizeGuide = useUIStore((s) => s.showSizeGuide);
  const toggleSizeGuide = useUIStore((s) => s.toggleSizeGuide);

  const undo = useDesignStore((s) => s.undo);
  const redo = useDesignStore((s) => s.redo);
  const canUndo = useDesignStore((s) => s.canUndo);
  const canRedo = useDesignStore((s) => s.canRedo);
  const saveToLocal = useDesignStore((s) => s.saveToLocal);
  const loadFromLocal = useDesignStore((s) => s.loadFromLocal);
  const saveDesign = useDesignStore((s) => s.saveDesign);
  const loadDesign = useDesignStore((s) => s.loadDesign);

  const handleSaveFile = () => {
    const json = saveDesign();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "garment-design.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          loadDesign(reader.result);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
      {/* Garment selector */}
      <div className="flex gap-1 rounded-lg bg-[#1a1a1a]/90 backdrop-blur-sm p-1 border border-[#2a2a2a]">
        {garmentOptions.map((opt) => (
          <button
            key={opt.type}
            onClick={() => setGarmentType(opt.type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              garmentType === opt.type
                ? "bg-indigo-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Shirt size={14} />
            {opt.label}
          </button>
        ))}
      </div>

      {/* Fabric selector */}
      <div className="flex flex-wrap gap-1 rounded-lg bg-[#1a1a1a]/90 backdrop-blur-sm p-1 border border-[#2a2a2a] max-w-[220px]">
        <div className="flex items-center gap-1 px-2 py-1 text-gray-500">
          <Scissors size={12} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Fabric</span>
        </div>
        {fabricOptions.map((type) => {
          const info = FABRIC_CATALOG[type];
          return (
            <button
              key={type}
              onClick={() => setFabricType(type)}
              title={info.label}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                fabricType === type
                  ? "bg-indigo-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {info.labelKo}
            </button>
          );
        })}
      </div>

      {/* View controls */}
      <div className="flex gap-1 rounded-lg bg-[#1a1a1a]/90 backdrop-blur-sm p-1 border border-[#2a2a2a]">
        {viewButtons.map(({ side, icon: Icon, label }) => (
          <button
            key={side}
            onClick={() => setViewSide(side)}
            title={label}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewSide === side
                ? "bg-indigo-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon size={14} />
          </button>
        ))}
      </div>

      {/* Panel toggles */}
      <div className="flex flex-col gap-1 rounded-lg bg-[#1a1a1a]/90 backdrop-blur-sm p-1 border border-[#2a2a2a]">
        {panelButtons.map(({ panel, icon: Icon, label }) => (
          <button
            key={panel}
            onClick={() => togglePanel(panel)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activePanel === panel
                ? "bg-indigo-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
            title={label}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Guides */}
      <div className="flex gap-1 rounded-lg bg-[#1a1a1a]/90 backdrop-blur-sm p-1 border border-[#2a2a2a]">
        <button
          onClick={togglePrintGuide}
          title="Print Area Guide"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            showPrintGuide
              ? "bg-cyan-500 text-white"
              : "text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <Grid3x3 size={14} />
          Print
        </button>
        <button
          onClick={toggleSizeGuide}
          title="Size Guide"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            showSizeGuide
              ? "bg-cyan-500 text-white"
              : "text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <Ruler size={14} />
          Size
        </button>
      </div>

      {/* Undo/Redo + Save/Load */}
      <div className="flex gap-1 rounded-lg bg-[#1a1a1a]/90 backdrop-blur-sm p-1 border border-[#2a2a2a]">
        <button
          onClick={undo}
          disabled={!canUndo()}
          title="Undo (Ctrl+Z)"
          className="px-2.5 py-1.5 rounded-md text-xs transition-colors disabled:text-gray-600 text-gray-400 hover:text-white hover:bg-white/10"
        >
          <Undo2 size={14} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          title="Redo (Ctrl+Y)"
          className="px-2.5 py-1.5 rounded-md text-xs transition-colors disabled:text-gray-600 text-gray-400 hover:text-white hover:bg-white/10"
        >
          <Redo2 size={14} />
        </button>
        <div className="w-px bg-[#2a2a2a]" />
        <button
          onClick={saveToLocal}
          title="Quick Save"
          className="px-2.5 py-1.5 rounded-md text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Save size={14} />
        </button>
        <button
          onClick={loadFromLocal}
          title="Quick Load"
          className="px-2.5 py-1.5 rounded-md text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <FolderOpen size={14} />
        </button>
      </div>

      {/* Export + File operations */}
      <div className="flex gap-1">
        <button
          onClick={onExport}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-medium transition-colors"
        >
          <Download size={14} />
          Export
        </button>
        <button
          onClick={handleSaveFile}
          title="Save as JSON"
          className="px-3 py-2 rounded-lg bg-[#1a1a1a]/90 border border-[#2a2a2a] text-gray-400 hover:text-white text-xs transition-colors"
        >
          <Save size={14} />
        </button>
        <button
          onClick={handleLoadFile}
          title="Load JSON"
          className="px-3 py-2 rounded-lg bg-[#1a1a1a]/90 border border-[#2a2a2a] text-gray-400 hover:text-white text-xs transition-colors"
        >
          <FolderOpen size={14} />
        </button>
      </div>
    </div>
  );
}
