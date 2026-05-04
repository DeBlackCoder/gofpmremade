"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PastorSettings {
  pastorName: string;
  pastorWifeName: string;
  pastorPhotoUrl: string;
  pastorWifePhotoUrl: string;
  pastorHidden: boolean;
}

const defaults: PastorSettings = {
  pastorName: "Rev. Emmanuel Okafor",
  pastorWifeName: "Mrs. Grace Okafor",
  pastorPhotoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces",
  pastorWifePhotoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces",
  pastorHidden: false,
};

const inputClass =
  "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "12px",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPastorPage() {
  const [settings, setSettings] = useState<PastorSettings>(defaults);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pastorImagePreview, setPastorImagePreview] = useState<string | null>(null);
  const [wifeImagePreview, setWifeImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin-site-settings");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSettings({
        pastorName: parsed.pastorName ?? defaults.pastorName,
        pastorWifeName: parsed.pastorWifeName ?? defaults.pastorWifeName,
        pastorPhotoUrl: parsed.pastorPhotoUrl ?? defaults.pastorPhotoUrl,
        pastorWifePhotoUrl: parsed.pastorWifePhotoUrl ?? defaults.pastorWifePhotoUrl,
        pastorHidden: parsed.pastorHidden ?? defaults.pastorHidden,
      });
      setPastorImagePreview(parsed.pastorPhotoUrl ?? defaults.pastorPhotoUrl);
      setWifeImagePreview(parsed.pastorWifePhotoUrl ?? defaults.pastorWifePhotoUrl);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setSettings((p) => ({ ...p, [name]: e.target.checked }));
    } else {
      setSettings((p) => ({ ...p, [name]: value }));
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, type: "pastor" | "wife") {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - accept all common image formats
    const validImageTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      'image/tiff',
      'image/heic',
      'image/heif'
    ];

    const isValidType = validImageTypes.includes(file.type.toLowerCase()) || file.type.startsWith("image/");
    
    if (!isValidType) {
      alert(`Please select a valid image file.\nSelected: ${file.type || 'unknown type'}\nSupported: JPG, PNG, GIF, WebP, SVG, BMP, TIFF, HEIC`);
      e.target.value = ''; // Reset input
      return;
    }

    // Check file size (max 10MB for better compatibility)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert(`Image size should be less than 10MB.\nYour file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      e.target.value = ''; // Reset input
      return;
    }

    // Create preview with error handling
    const reader = new FileReader();
    
    reader.onloadstart = () => {
      // Optional: Show loading state
      console.log(`Loading ${type} image...`);
    };

    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      // Validate the result
      if (!base64String || !base64String.startsWith('data:image')) {
        alert('Failed to read image file. Please try again.');
        e.target.value = ''; // Reset input
        return;
      }

      if (type === "pastor") {
        setPastorImagePreview(base64String);
        setSettings((p) => ({ ...p, pastorPhotoUrl: base64String }));
      } else {
        setWifeImagePreview(base64String);
        setSettings((p) => ({ ...p, pastorWifePhotoUrl: base64String }));
      }
      
      console.log(`✓ ${type} image loaded successfully`);
    };

    reader.onerror = () => {
      alert('Error reading image file. Please try a different image.');
      e.target.value = ''; // Reset input
      console.error('FileReader error:', reader.error);
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    // Get existing settings
    const stored = localStorage.getItem("admin-site-settings");
    const existingSettings = stored ? JSON.parse(stored) : {};

    // Merge pastor settings with existing settings
    const updatedSettings = {
      ...existingSettings,
      pastorName: settings.pastorName,
      pastorWifeName: settings.pastorWifeName,
      pastorPhotoUrl: settings.pastorPhotoUrl,
      pastorWifePhotoUrl: settings.pastorWifePhotoUrl,
      pastorHidden: settings.pastorHidden,
    };

    localStorage.setItem("admin-site-settings", JSON.stringify(updatedSettings));

    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 400);
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
          Admin
        </span>
        <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
          Pastor Management
        </h1>
        <p className="font-body text-white/40 text-sm mt-2">
          Manage lead pastor information and photos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* ── Visibility Toggle ── */}
        <section className="p-5 sm:p-6 flex flex-col gap-4" style={glass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-1">
                Visibility
              </p>
              <p className="font-body text-white/50 text-xs">
                Show pastor section on Ministry and Location pages
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="pastorHidden"
                checked={!settings.pastorHidden}
                onChange={(e) => setSettings(p => ({ ...p, pastorHidden: !e.target.checked }))}
                className="w-5 h-5 accent-white"
              />
              <span className="font-body text-white/60 text-sm">Visible</span>
            </label>
          </div>
        </section>

        {/* ── Lead Pastor ── */}
        <section className="p-5 sm:p-6 flex flex-col gap-4" style={glass}>
          <p className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Lead Pastor
          </p>

          {/* Photo Upload */}
          <div className="flex flex-col gap-3">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
              Photo
            </label>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div
                className="w-32 h-40 overflow-hidden flex-shrink-0"
                style={{
                  border: "2px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                {pastorImagePreview ? (
                  <img
                    src={pastorImagePreview}
                    alt="Pastor preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex flex-col gap-2 flex-1">
                <label
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-white/30 font-body text-white text-sm hover:bg-white/10 transition-colors cursor-pointer"
                  style={{ borderRadius: "8px" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Upload from device
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "pastor")}
                    className="hidden"
                  />
                </label>
                <p className="font-body text-white/30 text-xs">
                  Or paste image URL below. Max 10MB. All image formats supported.
                </p>
              </div>
            </div>
          </div>

          {/* Photo URL */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
              Photo URL (optional)
            </label>
            <input
              name="pastorPhotoUrl"
              value={settings.pastorPhotoUrl}
              onChange={handleChange}
              placeholder="https://example.com/pastor.jpg"
              className={inputClass}
            />
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
              Full Name
            </label>
            <input
              name="pastorName"
              value={settings.pastorName}
              onChange={handleChange}
              placeholder="Rev. John Doe"
              className={inputClass}
              required
            />
          </div>
        </section>

        {/* ── Pastor's Wife ── */}
        <section className="p-5 sm:p-6 flex flex-col gap-4" style={glass}>
          <p className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Pastor&apos;s Wife
          </p>

          {/* Photo Upload */}
          <div className="flex flex-col gap-3">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
              Photo
            </label>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div
                className="w-32 h-40 overflow-hidden flex-shrink-0"
                style={{
                  border: "2px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                {wifeImagePreview ? (
                  <img
                    src={wifeImagePreview}
                    alt="Wife preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex flex-col gap-2 flex-1">
                <label
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-white/30 font-body text-white text-sm hover:bg-white/10 transition-colors cursor-pointer"
                  style={{ borderRadius: "8px" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Upload from device
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "wife")}
                    className="hidden"
                  />
                </label>
                <p className="font-body text-white/30 text-xs">
                  Or paste image URL below. Max 10MB. All image formats supported.
                </p>
              </div>
            </div>
          </div>

          {/* Photo URL */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
              Photo URL (optional)
            </label>
            <input
              name="pastorWifePhotoUrl"
              value={settings.pastorWifePhotoUrl}
              onChange={handleChange}
              placeholder="https://example.com/wife.jpg"
              className={inputClass}
            />
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
              Full Name
            </label>
            <input
              name="pastorWifeName"
              value={settings.pastorWifeName}
              onChange={handleChange}
              placeholder="Mrs. Jane Doe"
              className={inputClass}
              required
            />
          </div>
        </section>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="border border-white/30 px-6 py-2.5 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && (
            <span className="font-body text-white/50 text-xs">Saved ✓</span>
          )}
        </div>
      </form>
    </div>
  );
}
