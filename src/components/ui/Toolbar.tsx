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
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Grid3x3,
  Ruler,
  Plus,
  Upload,
  Trash2,
  EyeOff,
  ImageIcon,
  ChevronDown,
} from "lucide-react";
import { useRef, useState } from "react";
import { useGarmentStore } from "../../store/useGarmentStore";
import { useDesignStore } from "../../store/useDesignStore";
import { useUIStore } from "../../store/useUIStore";
import { FABRIC_CATALOG } from "../../lib/fabric-textures";
import type { FabricType } from "../../lib/fabric-textures";
import type { GarmentType } from "../../types/garment";
import type { ActivePanel, ViewSide } from "../../store/useUIStore";

// ─── Data ────────────────────────────────────────────────────────────────────

const garmentOptions: { type: GarmentType; label: string }[] = [
  { type: "tshirt", label: "T-Shirt" },
  { type: "longsleeve", label: "Long Sleeve" },
  { type: "tanktop", label: "Tank Top" },
  { type: "polo", label: "Polo" },
  { type: "hoodie", label: "Hoodie" },
];

const viewButtons: { side: ViewSide; icon: typeof Eye; label: string }[] = [
  { side: "front", icon: Eye, label: "Front" },
  { side: "back", icon: Eye, label: "Back" },
  { side: "left", icon: ArrowLeft, label: "Left" },
  { side: "right", icon: ArrowRight, label: "Right" },
  { side: "free", icon: RotateCcw, label: "Free" },
];

const fabricOptions: FabricType[] = ["cotton", "performance", "denim", "silk", "linen", "fleece"];

const presetColors = [
  "#1a1a1a", "#2d2d2d", "#ffffff", "#f5f5f4",
  "#dc2626", "#ea580c", "#eab308", "#16a34a",
  "#2563eb", "#7c3aed", "#db2777", "#0891b2",
];

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

const LIGHT_COLORS = new Set(["#ffffff", "#f5f5f4"]);

// ─── Sub-panels ──────────────────────────────────────────────────────────────

function TextSubPanel() {
  const addText = useDesignStore((s) => s.addText);
  const viewSide = useUIStore((s) => s.viewSide);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#ffffff");
  const [fontWeight, setFontWeight] = useState<"normal" | "bold">("bold");
  const [fontFamily, setFontFamily] = useState("Arial");

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
    <div className="subpanel-animate ds-subpanel-body">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Enter text..."
        className="ds-input"
      />

      <div>
        <p className="ds-label">Font</p>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="ds-select"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <p className="ds-label">
            Size <span className="ds-label-value">{fontSize}px</span>
          </p>
          <input
            type="range"
            min={12}
            max={120}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="ds-label">Color</p>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="ds-color-input"
          />
        </div>
      </div>

      <div className="flex gap-1.5">
        {(["normal", "bold"] as const).map((w) => (
          <button
            key={w}
            data-active={fontWeight === w}
            className="ds-chip flex-1"
            style={{ fontWeight: w === "bold" ? 700 : 400 }}
            onClick={() => setFontWeight(w)}
          >
            {w === "normal" ? "Normal" : "Bold"}
          </button>
        ))}
      </div>

      <button
        onClick={handleAdd}
        disabled={!text.trim()}
        className="ds-btn-primary"
      >
        <Plus size={13} />
        Add Text
      </button>
    </div>
  );
}

function ImageSubPanel() {
  const addImage = useDesignStore((s) => s.addImage);
  const viewSide = useUIStore((s) => s.viewSide);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        addImage({
          src,
          fileName: file.name,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          side: viewSide === "back" ? "back" : "front",
        });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="subpanel-animate ds-subpanel-body">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="ds-upload-zone"
      >
        <Upload size={20} />
        <span style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-medium)" }}>
          Click to upload
        </span>
        <span style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)" }}>
          PNG, JPG, SVG
        </span>
      </button>
    </div>
  );
}

function ColorSubPanel() {
  const garmentColor = useGarmentStore((s) => s.garmentColor);
  const setGarmentColor = useGarmentStore((s) => s.setGarmentColor);

  return (
    <div className="subpanel-animate ds-subpanel-body">
      <div className="grid grid-cols-6 gap-1.5">
        {presetColors.map((c) => (
          <button
            key={c}
            onClick={() => setGarmentColor(c)}
            className="ds-swatch"
            data-active={garmentColor === c}
            data-light={LIGHT_COLORS.has(c) || undefined}
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>

      <div className="flex items-center gap-2.5">
        <span className="ds-label" style={{ marginBottom: 0 }}>Custom</span>
        <input
          type="color"
          value={garmentColor}
          onChange={(e) => setGarmentColor(e.target.value)}
          className="ds-color-input"
        />
        <span
          className="font-mono"
          style={{ fontSize: "var(--fs-sm)", color: "var(--text-secondary)" }}
        >
          {garmentColor}
        </span>
      </div>
    </div>
  );
}

function LayersSubPanel() {
  const elements = useDesignStore((s) => s.elements);
  const selectedId = useDesignStore((s) => s.selectedId);
  const selectElement = useDesignStore((s) => s.selectElement);
  const updateElement = useDesignStore((s) => s.updateElement);
  const removeElement = useDesignStore((s) => s.removeElement);

  return (
    <div className="subpanel-animate" style={{ padding: "var(--sp-sm)" }}>
      {elements.length === 0 ? (
        <p
          className="text-center"
          style={{
            padding: "var(--sp-md)",
            fontSize: "var(--fs-base)",
            color: "var(--text-muted)",
          }}
        >
          No elements yet
        </p>
      ) : (
        <div className="flex flex-col gap-0.5 max-h-52 overflow-y-auto sidebar-scroll">
          {elements.map((el) => (
            <div
              key={el.id}
              onClick={() => selectElement(el.id)}
              className="ds-layer-item"
              data-active={selectedId === el.id}
            >
              {el.type === "text" ? (
                <Type size={11} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              ) : (
                <ImageIcon size={11} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              )}
              <span
                className="truncate flex-1"
                style={{
                  fontSize: "var(--fs-base)",
                  color: selectedId === el.id ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                {el.type === "text" ? el.text : el.fileName}
              </span>
              <span
                className="uppercase"
                style={{ fontSize: "var(--fs-xs)", color: "var(--text-muted)" }}
              >
                {el.side}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); updateElement(el.id, { visible: !el.visible }); }}
                className="ds-layer-item-action"
              >
                {el.visible ? <Eye size={11} /> : <EyeOff size={11} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}
                className="ds-layer-item-action"
                data-danger
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Toolbar ─────────────────────────────────────────────────────────────

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
        if (typeof reader.result === "string") loadDesign(reader.result);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const panelItems: { panel: ActivePanel; icon: typeof Type; label: string }[] = [
    { panel: "text", icon: Type, label: "Text" },
    { panel: "image", icon: ImagePlus, label: "Image" },
    { panel: "color", icon: Palette, label: "Color" },
    { panel: "layers", icon: Layers, label: "Layers" },
  ];

  const subPanelMap: Record<string, React.ReactNode> = {
    text: <TextSubPanel />,
    image: <ImageSubPanel />,
    color: <ColorSubPanel />,
    layers: <LayersSubPanel />,
  };

  return (
    <aside
      className="panel-animate absolute top-0 left-0 h-full z-10 flex flex-col overflow-y-auto sidebar-scroll"
      style={{
        width: "var(--sidebar-w)",
        background: "var(--bg-panel)",
        borderRight: "1px solid var(--border-subtle)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 flex-shrink-0"
        style={{
          padding: "var(--sp-md) var(--sp-lg)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 28,
            height: 28,
            borderRadius: "var(--r-md)",
            background: "var(--accent)",
            opacity: 0.9,
          }}
        >
          <Shirt size={14} color="#fff" />
        </div>
        <span style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-semibold)", color: "var(--text-primary)" }}>
          Garment Studio
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1" style={{ paddingBottom: "var(--sp-lg)" }}>

        {/* — Garment — */}
        <p className="ds-section-label">Garment</p>
        <div className="flex flex-col gap-0.5">
          {garmentOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setGarmentType(opt.type)}
              className="ds-nav-item"
              data-active={garmentType === opt.type}
            >
              <Shirt size={13} className="ds-nav-icon" />
              {opt.label}
            </button>
          ))}
        </div>

        <div className="ds-divider" />

        {/* — Fabric — */}
        <p className="ds-section-label">Fabric</p>
        <div className="flex flex-wrap gap-1.5" style={{ padding: "0 var(--sp-section)" }}>
          {fabricOptions.map((type) => {
            const info = FABRIC_CATALOG[type];
            return (
              <button
                key={type}
                onClick={() => setFabricType(type)}
                className="ds-chip"
                data-active={fabricType === type}
                title={info.label}
              >
                {info.labelKo}
              </button>
            );
          })}
        </div>

        <div className="ds-divider" />

        {/* — View — */}
        <p className="ds-section-label">View</p>
        <div className="flex gap-1" style={{ padding: "0 var(--sp-section)" }}>
          {viewButtons.map(({ side, icon: Icon, label }) => (
            <button
              key={side}
              onClick={() => setViewSide(side)}
              className="ds-chip flex-1"
              data-active={viewSide === side}
              title={label}
            >
              <Icon size={12} />
            </button>
          ))}
        </div>

        <div className="ds-divider" />

        {/* — Design — */}
        <p className="ds-section-label">Design</p>
        <div className="flex flex-col gap-0.5">
          {panelItems.map(({ panel, icon: Icon, label }) => (
            <button
              key={panel}
              onClick={() => togglePanel(panel)}
              className="ds-nav-item"
              data-active={activePanel === panel}
              style={{ justifyContent: "space-between" }}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={13} className="ds-nav-icon" />
                {label}
              </span>
              <ChevronDown
                size={12}
                style={{
                  opacity: activePanel === panel ? 0.7 : 0.3,
                  transform: activePanel === panel ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
          ))}
        </div>

        {/* Inline sub-panels */}
        {activePanel && (
          <div className="ds-subpanel">
            {subPanelMap[activePanel]}
          </div>
        )}

        <div className="ds-divider" />

        {/* — Guides — */}
        <p className="ds-section-label">Guides</p>
        <div className="flex gap-1.5" style={{ padding: "0 var(--sp-section)" }}>
          {[
            { label: "Print", icon: Grid3x3, active: showPrintGuide, toggle: togglePrintGuide },
            { label: "Size", icon: Ruler, active: showSizeGuide, toggle: toggleSizeGuide },
          ].map(({ label, icon: Icon, active, toggle }) => (
            <button
              key={label}
              onClick={toggle}
              className="ds-chip flex-1"
              data-active={active}
              data-variant="info"
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        <div className="ds-divider" />

        {/* — History — */}
        <p className="ds-section-label">History</p>
        <div className="flex items-center gap-1.5" style={{ padding: "0 var(--sp-section)" }}>
          <button onClick={undo} disabled={!canUndo()} title="Undo (Ctrl+Z)" className="ds-icon-btn">
            <Undo2 size={13} />
          </button>
          <button onClick={redo} disabled={!canRedo()} title="Redo (Ctrl+Y)" className="ds-icon-btn">
            <Redo2 size={13} />
          </button>
          <div className="flex-1" />
          <button onClick={saveToLocal} title="Quick Save" className="ds-icon-btn">
            <Save size={13} />
          </button>
          <button onClick={loadFromLocal} title="Quick Load" className="ds-icon-btn">
            <FolderOpen size={13} />
          </button>
        </div>

        <div className="ds-divider" />

        {/* — Export — */}
        <p className="ds-section-label">Export</p>
        <div className="flex flex-col gap-1.5" style={{ padding: "0 var(--sp-section)" }}>
          <button onClick={onExport} className="ds-btn-primary">
            <Download size={13} />
            Export Design
          </button>

          <div className="flex gap-1.5">
            <button onClick={handleSaveFile} title="Save as JSON" className="ds-btn-secondary">
              <Save size={11} />
              Save JSON
            </button>
            <button onClick={handleLoadFile} title="Load JSON" className="ds-btn-secondary">
              <FolderOpen size={11} />
              Load JSON
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
}
