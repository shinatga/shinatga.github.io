import { useState, useCallback, useRef, useEffect } from "react";
import Scene from "./components/canvas/Scene";
import Toolbar from "./components/ui/Toolbar";
import TextPanel from "./components/ui/TextPanel";
import ImagePanel from "./components/ui/ImagePanel";
import ColorPicker from "./components/ui/ColorPicker";
import LayerPanel from "./components/ui/LayerPanel";
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
    <div className="relative w-full h-full bg-[#0a0a0a]">
      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Scene
          onRendererReady={handleRendererReady}
          postProcessingEnabled={!isExporting}
        />
      </div>

      {/* UI Overlays */}
      <Toolbar onExport={() => setExportOpen(true)} />
      <TextPanel />
      <ImagePanel />
      <ColorPicker />
      <LayerPanel />

      {/* Selected Element Controls */}
      {selectedEl && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-lg bg-[#1a1a1a]/95 backdrop-blur-sm border border-[#2a2a2a] z-10">
          <label className="text-xs text-gray-400">Scale:</label>
          <input
            type="range"
            min={2}
            max={50}
            value={Math.round(selectedEl.scale[0] * 100)}
            onChange={(e) => {
              const v = Number(e.target.value) / 100;
              updateElement(selectedEl.id, { scale: [v, v, v] });
            }}
            className="w-32 accent-indigo-500"
          />
          <span className="text-xs text-gray-500 w-8">
            {Math.round(selectedEl.scale[0] * 100)}%
          </span>

          <div className="w-px h-4 bg-[#2a2a2a]" />

          <label className="text-xs text-gray-400">Side:</label>
          <button
            onClick={() =>
              updateElement(selectedEl.id, {
                side: selectedEl.side === "front" ? "back" : "front",
              })
            }
            className="px-2 py-1 rounded text-xs bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
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

      {/* Loading overlay */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-600 z-10">
        3D Garment Designer
      </div>
    </div>
  );
}
