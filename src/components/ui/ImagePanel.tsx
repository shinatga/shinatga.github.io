import { useRef } from "react";
import { Upload } from "lucide-react";
import { useDesignStore } from "../../store/useDesignStore";
import { useUIStore } from "../../store/useUIStore";

export default function ImagePanel() {
  const activePanel = useUIStore((s) => s.activePanel);
  const addImage = useDesignStore((s) => s.addImage);
  const viewSide = useUIStore((s) => s.viewSide);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (activePanel !== "image") return null;

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

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="absolute top-4 left-44 w-64 rounded-lg bg-[#1a1a1a]/95 backdrop-blur-sm border border-[#2a2a2a] p-4 z-10">
      <h3 className="text-sm font-semibold mb-3 text-white">Add Image</h3>

      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center gap-2 px-4 py-8 rounded-lg border-2 border-dashed border-[#2a2a2a] hover:border-indigo-500 text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <Upload size={24} />
          <span className="text-sm">Click to upload image</span>
          <span className="text-xs text-gray-500">PNG, JPG, SVG</span>
        </button>
      </div>
    </div>
  );
}
