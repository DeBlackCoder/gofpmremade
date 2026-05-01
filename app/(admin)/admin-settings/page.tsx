"use client";

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SiteSettings {
  churchName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  // Service times
  sundayTime1: string;
  sundayTime2: string;
  wednesdayTime: string;
  fridayTime: string;
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
  sundayTime1: "8:00 AM — First Service",
  sundayTime2: "10:30 AM — Second Service",
  wednesdayTime: "6:00 PM — Midweek Service",
  fridayTime: "6:00 AM — Early Morning Prayer",
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
    if (stored) setSettings(JSON.parse(stored) as SiteSettings);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setSettings((p) => ({ ...p, [e.target.name]: e.target.value }));
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Sunday — 1st service</label>
              <input name="sundayTime1" value={settings.sundayTime1} onChange={handleChange} placeholder="8:00 AM — First Service" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Sunday — 2nd service</label>
              <input name="sundayTime2" value={settings.sundayTime2} onChange={handleChange} placeholder="10:30 AM — Second Service" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Wednesday</label>
              <input name="wednesdayTime" value={settings.wednesdayTime} onChange={handleChange} placeholder="6:00 PM — Midweek Service" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Friday</label>
              <input name="fridayTime" value={settings.fridayTime} onChange={handleChange} placeholder="6:00 AM — Early Morning Prayer" className={inputClass} />
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
    </div>
  );
}
