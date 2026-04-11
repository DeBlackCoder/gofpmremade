"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";

interface PreviousStream {
  id: string;
  title: string;
  description?: string;
  streamUrl: string;
  date: string;
}

interface LiveSettings {
  isLive: boolean;
  streamUrl: string;
  title: string;
  description: string;
  previousStreams?: PreviousStream[];
}

const defaultLiveSettings: LiveSettings = {
  isLive: false,
  streamUrl: "",
  title: "",
  description: "",
  previousStreams: [],
};

export default function AdminLivePage() {
  const [settings, setSettings] = useState<LiveSettings>(defaultLiveSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingStream, setEditingStream] = useState<PreviousStream | null>(
    null,
  );

  useEffect(() => {
    apiClient.get<LiveSettings>("/admin/live").then(setSettings);
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target;
    setSettings((p) => ({
      ...p,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const updated = await apiClient.post<{ ok: boolean }>(
      "/admin/live",
      settings,
    );
    if (updated.ok) {
      const fresh = await apiClient.get<LiveSettings>("/admin/live");
      setSettings(fresh);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleDeleteStream(id: string) {
    await apiClient.delete("/admin/live", { body: { id } });
    setSettings((p) => ({
      ...p,
      previousStreams: (p.previousStreams ?? []).filter((s) => s.id !== id),
    }));
  }

  async function handleUpdateStream(e: React.FormEvent) {
    e.preventDefault();
    if (!editingStream) return;
    await apiClient.put("/admin/live", editingStream);
    setSettings((p) => ({
      ...p,
      previousStreams: (p.previousStreams ?? []).map((s) =>
        s.id === editingStream.id ? editingStream : s,
      ),
    }));
    setEditingStream(null);
  }

  const inputClass =
    "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";
  const prevStreams = settings.previousStreams ?? [];

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 sm:px-10 sm:py-10 max-w-3xl mx-auto">
      <div className="mb-10">
        <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
          Admin
        </span>
        <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
          Live Service
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 border border-white/10 p-6 backdrop-blur-sm bg-white/3"
      >
        <p className="font-body text-white/30 text-[10px] tracking-widest uppercase">
          Stream settings
        </p>

        <label className="flex items-center gap-4 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              name="isLive"
              checked={settings.isLive}
              onChange={handleChange}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full transition-colors ${settings.isLive ? "bg-red-500" : "bg-white/15"}`}
            />
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.isLive ? "translate-x-5" : ""}`}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-body text-white font-semibold text-sm">
              {settings.isLive ? (
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Live now
                </span>
              ) : (
                "Go live"
              )}
            </span>
            <span className="font-body text-white/35 text-xs">
              Toggle to show the Watch Live button on the homepage. Turning off
              auto-archives this stream.
            </span>
          </div>
        </label>

        <div className="flex flex-col gap-1">
          <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
            Stream URL
          </label>
          <input
            name="streamUrl"
            value={settings.streamUrl}
            onChange={handleChange}
            placeholder="https://youtube.com/live/..."
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
            Service title
          </label>
          <input
            name="title"
            value={settings.title}
            onChange={handleChange}
            placeholder="Sunday Service"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
            Description
          </label>
          <textarea
            name="description"
            value={settings.description}
            onChange={handleChange}
            rows={3}
            placeholder="Join us live…"
            className={`${inputClass} resize-none`}
          />
        </div>

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

      {/* Previous streams */}
      <div className="mt-10">
        <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-3">
          Previous streams — {prevStreams.length}
        </p>

        {prevStreams.length === 0 && (
          <p className="font-body text-white/25 text-sm">
            No previous streams yet.
          </p>
        )}

        {prevStreams.map((stream) => (
          <div key={stream.id}>
            {editingStream?.id === stream.id ? (
              /* Edit form */
              <form
                onSubmit={handleUpdateStream}
                className="border border-white/15 bg-white/5 p-4 mb-2 flex flex-col gap-3"
              >
                <div className="flex flex-col gap-1">
                  <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    Title
                  </label>
                  <input
                    value={editingStream.title}
                    onChange={(e) =>
                      setEditingStream(
                        (p) => p && { ...p, title: e.target.value },
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    Stream URL
                  </label>
                  <input
                    value={editingStream.streamUrl}
                    onChange={(e) =>
                      setEditingStream(
                        (p) => p && { ...p, streamUrl: e.target.value },
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    Description
                  </label>
                  <textarea
                    value={editingStream.description}
                    onChange={(e) =>
                      setEditingStream(
                        (p) => p && { ...p, description: e.target.value },
                      )
                    }
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="font-body text-sm text-white border border-white/30 px-4 py-1.5 hover:bg-white hover:text-black transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingStream(null)}
                    className="font-body text-white/40 text-sm hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between gap-4 py-4 border-t border-white/10 hover:border-white/20 transition-colors">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-body text-white font-semibold text-sm truncate">
                    {stream.title}
                  </span>
                  <span className="font-body text-white/35 text-xs">
                    {stream.date}
                  </span>
                  {stream.description && (
                    <span className="font-body text-white/30 text-xs mt-0.5 line-clamp-1">
                      {stream.description}
                    </span>
                  )}
                  <a
                    href={stream.streamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-white/30 text-[10px] underline underline-offset-2 hover:text-white transition-colors truncate mt-0.5"
                  >
                    {stream.streamUrl}
                  </a>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => setEditingStream(stream)}
                    className="font-body text-white/40 text-xs hover:text-white transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStream(stream.id)}
                    className="font-body text-white/25 text-xs hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
