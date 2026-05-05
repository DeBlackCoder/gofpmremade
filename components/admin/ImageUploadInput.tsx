"use client";

import { useRef, useState } from "react";

interface ImageUploadInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const inputClass =
  "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

/**
 * A combined image input that lets the admin either:
 *  - Upload a file from their local device (converted to base64)
 *  - Paste a remote URL directly
 *
 * Shows a live preview of whichever source is active.
 */
export function ImageUploadInput({
  value,
  onChange,
  placeholder = "https://example.com/image.jpg",
  label,
  disabled = false,
  className = "",
}: ImageUploadInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(`Image must be under 10 MB. Yours: ${(file.size / 1024 / 1024).toFixed(1)} MB`);
      e.target.value = "";
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (!base64?.startsWith("data:image")) {
        setError("Failed to read image. Please try again.");
        e.target.value = "";
        return;
      }
      onChange(base64);
    };
    reader.onerror = () => {
      setError("Error reading image. Please try a different file.");
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  }

  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileName("");
    setError("");
    onChange(e.target.value);
  }

  const isBase64 = value?.startsWith("data:image");
  const hasPreview = Boolean(value);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
          {label}
        </label>
      )}

      <div className="flex items-start gap-3">
        {/* Preview thumbnail */}
        <div
          className="flex-shrink-0 w-16 h-16 overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          {hasPreview ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Upload button */}
          <label
            className={`inline-flex items-center gap-2 px-3 py-2 border border-white/25 font-body text-white/80 text-xs hover:bg-white/10 hover:border-white/40 transition-colors ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
            style={{ borderRadius: "6px" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {fileName ? fileName : "Upload from device"}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={disabled}
              className="hidden"
            />
          </label>

          {/* URL input */}
          <input
            type="text"
            value={isBase64 ? "" : value}
            onChange={handleUrlChange}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <p className="font-body text-red-400 text-xs">{error}</p>
      )}
    </div>
  );
}
