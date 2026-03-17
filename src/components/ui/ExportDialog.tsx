import { X, FileImage, FileText } from "lucide-react";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
}

export default function ExportDialog({
  open,
  onClose,
  onExportPNG,
  onExportPDF,
}: ExportDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-80 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-white"
        >
          <X size={16} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-white">Export Design</h2>

        <div className="space-y-2">
          <button
            onClick={() => {
              onExportPNG();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0a0a0a] hover:bg-indigo-500/20 border border-[#2a2a2a] hover:border-indigo-500/50 text-white transition-colors"
          >
            <FileImage size={20} className="text-indigo-400" />
            <div className="text-left">
              <div className="text-sm font-medium">Export as PNG</div>
              <div className="text-xs text-gray-500">
                Current view as image
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              onExportPDF();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0a0a0a] hover:bg-indigo-500/20 border border-[#2a2a2a] hover:border-indigo-500/50 text-white transition-colors"
          >
            <FileText size={20} className="text-indigo-400" />
            <div className="text-left">
              <div className="text-sm font-medium">Export as PDF</div>
              <div className="text-xs text-gray-500">
                Front & back views
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
