"use client";

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SiteSettings {
  churchName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  // Service times - all days with hide option
  mondayTime: string;
  mondayHidden: boolean;
  tuesdayTime: string;
  tuesdayHidden: boolean;
  wednesdayTime: string;
  wednesdayHidden: boolean;
  thursdayTime: string;
  thursdayHidden: boolean;
  fridayTime: string;
  fridayHidden: boolean;
  saturdayTime: string;
  saturdayHidden: boolean;
  sundayTime1: string;
  sundayTime2: string;
  sundayHidden: boolean;
  // Pastor information
  pastorName: string;
  pastorWifeName: string;
  pastorPhotoUrl: string;
  pastorWifePhotoUrl: string;
  pastorHidden: boolean;
  // Social
  youtubeUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  whatsappNumber: string;
}

const defaults: SiteSettings = {
  churchName: "Assemblies Of God Church",
  tagline: "Choba 2 · Port Harcourt",
  address: "Assemblies Of God Church, Choba, Port Harcourt, Rivers State",
  phone: "+234 801 234 5678",
  email: "hello@agchurch.org",
  mondayTime: "",
  mondayHidden: true,
  tuesdayTime: "",
  tuesdayHidden: true,
  wednesdayTime: "6:00 PM — Midweek Service",
  wednesdayHidden: false,
  thursdayTime: "",
  thursdayHidden: true,
  fridayTime: "6:00 AM — Early Morning Prayer",
  fridayHidden: false,
  saturdayTime: "",
  saturdayHidden: true,
  sundayTime1: "8:00 AM — First Service",
  sundayTime2: "10:30 AM — Second Service",
  sundayHidden: false,
  pastorName: "Rev. Emmanuel Okafor",
  pastorWifeName: "Mrs. Grace Okafor",
  pastorPhotoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces",
  pastorWifePhotoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces",
  pastorHidden: false,
  youtubeUrl: "https://www.youtube.com/@AssembliesOfGodChoba2",
  facebookUrl: "",
  instagramUrl: "",
  twitterUrl: "",
  whatsappNumber: "",
};

const inputClass =
  "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "12px",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin-site-settings");
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SiteSettings>;
      // Check if pastor fields exist, if not, add them with defaults
      const updated = {
        ...defaults,
        ...parsed,
        // Force add pastor fields if they don't exist
        pastorName: parsed.pastorName ?? defaults.pastorName,
        pastorWifeName: parsed.pastorWifeName ?? defaults.pastorWifeName,
        pastorPhotoUrl: parsed.pastorPhotoUrl ?? defaults.pastorPhotoUrl,
        pastorWifePhotoUrl: parsed.pastorWifePhotoUrl ?? defaults.pastorWifePhotoUrl,
        pastorHidden: parsed.pastorHidden ?? defaults.pastorHidden,
      };
      setSettings(updated);
      // Save updated settings back to localStorage
      localStorage.setItem("admin-site-settings", JSON.stringify(updated));
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setSettings((p) => ({ ...p, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setSettings((p) => ({ ...p, [name]: value }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    localStorage.setItem("admin-site-settings", JSON.stringify(settings));
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 400);
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
          Admin
        </span>
        <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
          Site Settings
        </h1>
        <p className="font-body text-white/40 text-sm mt-2">
          Update church info, service times, and social links.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* ── Church info ── */}
        <section className="p-5 sm:p-6 flex flex-col gap-4" style={glass}>
          <p className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Church info
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Church name</label>
              <input name="churchName" value={settings.churchName} onChange={handleChange} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Tagline / Location</label>
              <input name="tagline" value={settings.tagline} onChange={handleChange} placeholder="Choba 2 · Port Harcourt" className={inputClass} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Address</label>
            <input name="address" value={settings.address} onChange={handleChange} className={inputClass} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Phone</label>
              <input name="phone" value={settings.phone} onChange={handleChange} placeholder="+234 800 000 0000" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Email</label>
              <input name="email" type="email" value={settings.email} onChange={handleChange} placeholder="hello@church.org" className={inputClass} />
            </div>
          </div>
        </section>

        {/* ── Service times ── */}
        <section className="p-5 sm:p-6 flex flex-col gap-4" style={glass}>
          <p className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Service times
          </p>
          
          {/* Sunday */}
          <div className="flex flex-col gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <label className="font-body text-white/40 text-xs tracking-widest uppercase">Sunday</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="sundayHidden"
                  checked={!settings.sundayHidden}
                  onChange={(e) => setSettings(p => ({ ...p, sundayHidden: !e.target.checked }))}
                  className="w-4 h-4 accent-white"
                />
                <span className="font-body text-white/40 text-xs">Show on site</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="sundayTime1" value={settings.sundayTime1} onChange={handleChange} placeholder="8:00 AM — First Service" className={inputClass} disabled={settings.sundayHidden} />
              <input name="sundayTime2" value={settings.sundayTime2} onChange={handleChange} placeholder="10:30 AM — Second Service" className={inputClass} disabled={settings.sundayHidden} />
            </div>
          </div>

          {/* Monday */}
          <div className="flex flex-col gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <label className="font-body text-white/40 text-xs tracking-widest uppercase">Monday</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="mondayHidden"
                  checked={!settings.mondayHidden}
                  onChange={(e) => setSettings(p => ({ ...p, mondayHidden: !e.target.checked }))}
                  className="w-4 h-4 accent-white"
                />
                <span className="font-body text-white/40 text-xs">Show on site</span>
              </label>
            </div>
            <input name="mondayTime" value={settings.mondayTime} onChange={handleChange} placeholder="6:00 PM — Service" className={inputClass} disabled={settings.mondayHidden} />
          </div>

          {/* Tuesday */}
          <div className="flex flex-col gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <label className="font-body text-white/40 text-xs tracking-widest uppercase">Tuesday</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="tuesdayHidden"
                  checked={!settings.tuesdayHidden}
                  onChange={(e) => setSettings(p => ({ ...p, tuesdayHidden: !e.target.checked }))}
                  className="w-4 h-4 accent-white"
                />
                <span className="font-body text-white/40 text-xs">Show on site</span>
              </label>
            </div>
            <input name="tuesdayTime" value={settings.tuesdayTime} onChange={handleChange} placeholder="6:00 PM — Service" className={inputClass} disabled={settings.tuesdayHidden} />
          </div>

          {/* Wednesday */}
          <div className="flex flex-col gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <label className="font-body text-white/40 text-xs tracking-widest uppercase">Wednesday</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="wednesdayHidden"
                  checked={!settings.wednesdayHidden}
                  onChange={(e) => setSettings(p => ({ ...p, wednesdayHidden: !e.target.checked }))}
                  className="w-4 h-4 accent-white"
                />
                <span className="font-body text-white/40 text-xs">Show on site</span>
              </label>
            </div>
            <input name="wednesdayTime" value={settings.wednesdayTime} onChange={handleChange} placeholder="6:00 PM — Midweek Service" className={inputClass} disabled={settings.wednesdayHidden} />
          </div>

          {/* Thursday */}
          <div className="flex flex-col gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <label className="font-body text-white/40 text-xs tracking-widest uppercase">Thursday</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="thursdayHidden"
                  checked={!settings.thursdayHidden}
                  onChange={(e) => setSettings(p => ({ ...p, thursdayHidden: !e.target.checked }))}
                  className="w-4 h-4 accent-white"
                />
                <span className="font-body text-white/40 text-xs">Show on site</span>
              </label>
            </div>
            <input name="thursdayTime" value={settings.thursdayTime} onChange={handleChange} placeholder="6:00 PM — Service" className={inputClass} disabled={settings.thursdayHidden} />
          </div>

          {/* Friday */}
          <div className="flex flex-col gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <label className="font-body text-white/40 text-xs tracking-widest uppercase">Friday</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="fridayHidden"
                  checked={!settings.fridayHidden}
                  onChange={(e) => setSettings(p => ({ ...p, fridayHidden: !e.target.checked }))}
                  className="w-4 h-4 accent-white"
                />
                <span className="font-body text-white/40 text-xs">Show on site</span>
              </label>
            </div>
            <input name="fridayTime" value={settings.fridayTime} onChange={handleChange} placeholder="6:00 AM — Early Morning Prayer" className={inputClass} disabled={settings.fridayHidden} />
          </div>

          {/* Saturday */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="font-body text-white/40 text-xs tracking-widest uppercase">Saturday</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="saturdayHidden"
                  checked={!settings.saturdayHidden}
                  onChange={(e) => setSettings(p => ({ ...p, saturdayHidden: !e.target.checked }))}
                  className="w-4 h-4 accent-white"
                />
                <span className="font-body text-white/40 text-xs">Show on site</span>
              </label>
            </div>
            <input name="saturdayTime" value={settings.saturdayTime} onChange={handleChange} placeholder="6:00 PM — Service" className={inputClass} disabled={settings.saturdayHidden} />
          </div>
        </section>

        {/* ── Pastor Information ── */}
        <section className="p-5 sm:p-6 flex flex-col gap-4" style={glass}>
          <p className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Lead Pastor
          </p>
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <p className="font-body text-white/50 text-xs">
              Display lead pastor information on the location page
            </p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="pastorHidden"
                checked={!settings.pastorHidden}
                onChange={(e) => setSettings(p => ({ ...p, pastorHidden: !e.target.checked }))}
                className="w-4 h-4 accent-white"
              />
              <span className="font-body text-white/40 text-xs">Show on site</span>
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Pastor&apos;s name</label>
              <input 
                name="pastorName" 
                value={settings.pastorName} 
                onChange={handleChange} 
                placeholder="Rev. John Doe" 
                className={inputClass} 
                disabled={settings.pastorHidden} 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Pastor&apos;s wife</label>
              <input 
                name="pastorWifeName" 
                value={settings.pastorWifeName} 
                onChange={handleChange} 
                placeholder="Mrs. Jane Doe" 
                className={inputClass} 
                disabled={settings.pastorHidden} 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Pastor&apos;s photo URL</label>
              <input 
                name="pastorPhotoUrl" 
                value={settings.pastorPhotoUrl} 
                onChange={handleChange} 
                placeholder="https://example.com/pastor.jpg" 
                className={inputClass} 
                disabled={settings.pastorHidden} 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Wife&apos;s photo URL</label>
              <input 
                name="pastorWifePhotoUrl" 
                value={settings.pastorWifePhotoUrl} 
                onChange={handleChange} 
                placeholder="https://example.com/wife.jpg" 
                className={inputClass} 
                disabled={settings.pastorHidden} 
              />
            </div>
          </div>
        </section>

        {/* ── Social links ── */}
        <section className="p-5 sm:p-6 flex flex-col gap-4" style={glass}>
          <p className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Social links
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">YouTube</label>
              <input name="youtubeUrl" value={settings.youtubeUrl} onChange={handleChange} placeholder="https://youtube.com/@handle" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Facebook</label>
              <input name="facebookUrl" value={settings.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/page" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Instagram</label>
              <input name="instagramUrl" value={settings.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/handle" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">WhatsApp number</label>
              <input name="whatsappNumber" value={settings.whatsappNumber} onChange={handleChange} placeholder="+234 800 000 0000" className={inputClass} />
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="self-start border border-white/30 px-6 py-2.5 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
          >
            {saving ? "Saving…" : "Save settings"}
          </button>
          {saved && (
            <span className="font-body text-white/50 text-xs">Saved ✓</span>
          )}
        </div>
      </form>

      {/* ── Change Password ── */}
      <ChangePassword />
    </div>
  );
}

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const inputClass =
    "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

  const glass: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "12px",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Failed to change password." });
      } else {
        setMessage({ type: "success", text: "Password updated successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-8 p-5 sm:p-6 flex flex-col gap-4" style={glass}>
      <p className="font-body text-white/30 text-[10px] tracking-widest uppercase">
        Change password
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Current password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required placeholder="••••••••" className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">New password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Min. 8 characters" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Confirm new password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Repeat new password" className={inputClass} />
          </div>
        </div>
        {message && (
          <p className={`font-body text-xs ${message.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="self-start border border-white/30 px-6 py-2.5 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
        >
          {saving ? "Updating…" : "Update password"}
        </button>
      </form>
    </section>
  );
}
