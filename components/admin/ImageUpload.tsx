"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (data: { url: string; publicId: string } | null) => void;
  folder?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, folder = "elite-construction", label = "Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const text = await res.text();
      let data: { error?: string; url?: string; publicId?: string } = {};
      if (text.trim()) {
        try {
          data = JSON.parse(text) as typeof data;
        } catch {
          throw new Error(`Invalid server response (${res.status})`);
        }
      }
      if (!res.ok) {
        throw new Error(data.error || `Upload failed (${res.status})`);
      }
      if (!data.url || !data.publicId) {
        throw new Error("Invalid upload response: missing url or publicId");
      }
      onChange({ url: data.url, publicId: data.publicId });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-stone-light mb-2 block">
        {label}
      </label>

      {value ? (
        <div className="relative h-48 bg-surface-2 border border-stone/20 overflow-hidden group">
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <div className="absolute inset-0 bg-navy/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-2 bg-surface text-cream text-xs font-semibold uppercase tracking-widest hover:bg-surface-2 transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="px-3 py-2 bg-red text-white text-xs font-semibold uppercase tracking-widest hover:bg-red-dark transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="h-48 border-2 border-dashed border-stone/20 hover:border-stone/40 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors bg-surface-2"
        >
          {uploading ? (
            <>
              <div className="w-6 h-6 border-2 border-stone/30 border-t-stone-light rounded-full animate-spin" />
              <span className="text-xs text-muted">Uploading…</span>
            </>
          ) : (
            <>
              <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-xs text-muted text-center">Drop image here or click to browse<br />JPG, PNG, WebP · Max 10MB</span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && <p className="text-red-light text-xs mt-1">{error}</p>}
    </div>
  );
}
