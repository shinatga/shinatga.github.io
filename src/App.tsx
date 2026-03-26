import { useState, useCallback, useRef, useEffect } from "react";
import Scene from "./components/canvas/Scene";
import Toolbar from "./components/ui/Toolbar";
import PrintGuide from "./components/ui/PrintGuide";
import SizeGuide from "./components/ui/SizeGuide";
import ExportDialog from "./components/ui/ExportDialog";
import { useDesignStore } from "./store/useDesignStore";
import { useUIStore } from "./store/useUIStore";
import { downloadPNG, downloadPDF } from "./lib/export-utils";
import type { WebGLRenderer } from "three";

export default function App() {
  const [exportOpen, setExportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const glRef = useRef<WebGLRenderer | null>(null);
  const selectedId = useDesignStore((s) => s.selectedId);
  const updateElement = useDesignStore((s) => s.updateElement);
  const elements = useDesignStore((s) => s.elements);
  const setViewSide = useUIStore((s) => s.setViewSide);

  const undo = useDesignStore((s) => s.undo);
  const redo = useDesignStore((s) => s.redo);
  const selectedEl = elements.find((el) => el.id === selectedId);

  // Keyboard shortcuts: Ctrl+Z / Ctrl+Y
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  const handleRendererReady = useCallback((gl: WebGLRenderer) => {
    glRef.current = gl;
  }, []);

  const captureCurrentView = useCallback((): string | null => {
    if (!glRef.current) return null;
    return glRef.current.domElement.toDataURL("image/png");
  }, []);

  const handleExportPNG = useCallback(() => {
    setIsExporting(true);
    // Wait for EffectComposer to unmount and a clean frame to render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const dataUrl = captureCurrentView();
        if (dataUrl) downloadPNG(dataUrl);
        setIsExporting(false);
      });
    });
  }, [captureCurrentView]);

  const handleExportPDF = useCallback(() => {
    setIsExporting(true);
    setViewSide("front");
    // Wait for post-processing disable + view update + render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const frontUrl = captureCurrentView();
        if (!frontUrl) {
          setIsExporting(false);
          return;
        }

        setViewSide("back");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const backUrl = captureCurrentView();
            downloadPDF(frontUrl, backUrl ?? undefined);
            setIsExporting(false);
          });
        });
      });
    });
  }, [captureCurrentView, setViewSide]);

  return (
    <div className="relative w-full h-full" style={{ background: "var(--bg-primary)" }}>
      {/* Sidebar */}
      <Toolbar onExport={() => setExportOpen(true)} />

      {/* 3D Canvas — offset by sidebar width */}
      <div
        className="absolute top-0 right-0 bottom-0"
        style={{ left: "var(--sidebar-w)" }}
      >
        <Scene
          onRendererReady={handleRendererReady}
          postProcessingEnabled={!isExporting}
        />
      </div>

      {/* Overlay guides (positioned relative to canvas area) */}
      <PrintGuide />
      <SizeGuide />

      {/* Selected Element Controls */}
      {selectedEl && (
        <div
          className="absolute bottom-4 flex items-center gap-3 px-4 py-2 rounded-lg backdrop-blur-sm z-10"
          style={{
            left: "calc(var(--sidebar-w) + 50%)",
            transform: "translateX(-50%)",
            background: "rgba(22,22,22,0.95)",
            border: "1px solid var(--border-color)",
          }}
        >
          <label className="text-xs" style={{ color: "var(--text-secondary)" }}>Scale</label>
          <input
            type="range"
            min={2}
            max={50}
            value={Math.round(selectedEl.scale[0] * 100)}
            onChange={(e) => {
              const v = Number(e.target.value) / 100;
              updateElement(selectedEl.id, { scale: [v, v, v] });
            }}
            className="w-28"
          />
          <span className="text-xs w-8 font-mono" style={{ color: "var(--text-muted)" }}>
            {Math.round(selectedEl.scale[0] * 100)}%
          </span>

          <div className="w-px h-4" style={{ background: "var(--border-color)" }} />

          <label className="text-xs" style={{ color: "var(--text-secondary)" }}>Side</label>
          <button
            onClick={() =>
              updateElement(selectedEl.id, {
                side: selectedEl.side === "front" ? "back" : "front",
              })
            }
            className="px-2 py-1 rounded text-xs font-medium transition-colors"
            style={{ background: "var(--accent-dim)", color: "var(--accent-hover)" }}
          >
            {selectedEl.side}
          </button>
        </div>
      )}

      {/* Export Dialog */}
      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
      />

      {/* Watermark */}
      <div
        className="absolute bottom-4 right-4 text-[11px] z-10"
        style={{ color: "var(--text-muted)" }}
      >
        3D Garment Designer
      </div>
    </div>
  );
}
