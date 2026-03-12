import React, { useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, X, Loader2, Plus } from "lucide-react";

export default function ImageUploader({ value, onChange, label = "Image", multiple = false }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files) => {
    if (!files.length) return;
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    if (multiple) {
      onChange([...(value || []), ...urls]);
    } else {
      onChange(urls[0]);
    }
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const removeImage = (idx) => {
    if (multiple) {
      onChange((value || []).filter((_, i) => i !== idx));
    } else {
      onChange("");
    }
  };

  if (multiple) {
    const images = value || [];
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-sky-400 flex flex-col items-center justify-center gap-1 transition-colors"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : <Plus className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(Array.from(e.target.files))}
        />
      </div>
    );
  }

  return (
    <div
      className="relative"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
          <img src={value} alt="" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
            <button type="button" onClick={() => inputRef.current?.click()} className="px-3 py-1.5 bg-white rounded-full text-xs font-medium text-slate-700">
              Change
            </button>
            <button type="button" onClick={() => removeImage()} className="p-1.5 bg-white rounded-full">
              <X className="w-3.5 h-3.5 text-slate-700" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-36 rounded-xl border-2 border-dashed border-slate-300 hover:border-sky-400 flex flex-col items-center justify-center gap-2 transition-colors bg-slate-50 hover:bg-sky-50"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-slate-400" />
              <span className="text-xs text-slate-400">Click or drag to upload {label}</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(Array.from(e.target.files))}
      />
    </div>
  );
}