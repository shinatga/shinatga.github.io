import { Eye, EyeOff, Trash2, Type, ImageIcon } from "lucide-react";
import { useDesignStore } from "../../store/useDesignStore";
import { useUIStore } from "../../store/useUIStore";

export default function LayerPanel() {
  const activePanel = useUIStore((s) => s.activePanel);
  const elements = useDesignStore((s) => s.elements);
  const selectedId = useDesignStore((s) => s.selectedId);
  const selectElement = useDesignStore((s) => s.selectElement);
  const updateElement = useDesignStore((s) => s.updateElement);
  const removeElement = useDesignStore((s) => s.removeElement);

  if (activePanel !== "layers") return null;

  return (
    <div className="absolute top-4 left-44 w-64 rounded-lg bg-[#1a1a1a]/95 backdrop-blur-sm border border-[#2a2a2a] p-4 z-10">
      <h3 className="text-sm font-semibold mb-3 text-white">Layers</h3>

      {elements.length === 0 ? (
        <p className="text-xs text-gray-500">No design elements yet</p>
      ) : (
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {elements.map((el) => (
            <div
              key={el.id}
              onClick={() => selectElement(el.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                selectedId === el.id
                  ? "bg-indigo-500/20 border border-indigo-500/50"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              {el.type === "text" ? (
                <Type size={12} className="text-gray-400 shrink-0" />
              ) : (
                <ImageIcon size={12} className="text-gray-400 shrink-0" />
              )}

              <span className="text-xs text-gray-300 truncate flex-1">
                {el.type === "text" ? el.text : el.fileName}
              </span>

              <span className="text-[10px] text-gray-500 uppercase">
                {el.side}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateElement(el.id, { visible: !el.visible });
                }}
                className="p-0.5 text-gray-500 hover:text-white"
              >
                {el.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeElement(el.id);
                }}
                className="p-0.5 text-gray-500 hover:text-red-400"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
