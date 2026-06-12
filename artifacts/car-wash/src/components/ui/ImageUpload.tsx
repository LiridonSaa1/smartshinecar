import { useRef, useState } from "react";
import { Upload, Link, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  previewClassName?: string;
  compact?: boolean;
}

export function ImageUpload({ value, onChange, placeholder = "Paste image URL or upload a file", className = "", previewClassName }: ImageUploadProps) {
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/storage/uploads", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      onChange(url);
    } catch (e: any) {
      setError(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Tab switcher */}
      <div className="flex gap-1 p-0.5 bg-gray-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${tab === "upload" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Upload className="h-3.5 w-3.5" />Upload file
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${tab === "url" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Link className="h-3.5 w-3.5" />Paste URL
        </button>
      </div>

      {/* Upload area */}
      {tab === "upload" && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors cursor-pointer h-28 ${uploading ? "border-blue-300 bg-blue-50/50 cursor-wait" : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30"}`}
        >
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} disabled={uploading} />
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
              <span className="text-xs text-blue-600 font-medium">Uploading…</span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">Click or drag & drop an image</span>
              <span className="text-[10px] text-gray-400">JPG, PNG, WebP, GIF</span>
            </>
          )}
        </div>
      )}

      {/* URL input */}
      {tab === "url" && (
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="text-xs"
        />
      )}

      {/* Error */}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      {/* Preview */}
      {value && (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 h-40">
          <img
            src={value}
            alt="Preview"
            className={`w-full h-full object-cover ${previewClassName ?? ""}`}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow transition-colors"
            title="Remove image"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
