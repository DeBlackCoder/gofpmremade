"use client";

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MediaSettings {
  podcastRssUrl: string;
  youtubeChannelId: string;
  youtubeChannelUrl: string;
  spotifyShowUrl: string;
}

interface ManualVideo {
  id: string;
  title: string;
  videoId: string;
  date: string;
  description: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputClass =
  "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "12px",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminMediaPage() {
  // ── Media settings ──
  const [settings, setSettings] = useState<MediaSettings>({
    podcastRssUrl: "https://anchor.fm/s/111293d28/podcast/rss",
    youtubeChannelId: "UCQshxkbjIwOPDHTtLoM19cQ",
    youtubeChannelUrl: "https://www.youtube.com/@AssembliesOfGodChoba2",
    spotifyShowUrl: "",
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // ── Manual videos ──
  const [videos, setVideos] = useState<ManualVideo[]>([]);
  const [videoForm, setVideoForm] = useState({
    title: "",
    videoId: "",
    date: "",
    description: "",
  });
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);

  // Load from localStorage (since backend may be offline)
  useEffect(() => {
    const saved = localStorage.getItem("admin-media-settings");
    if (saved) setSettings(JSON.parse(saved) as MediaSettings);
    const savedVideos = localStorage.getItem("admin-manual-videos");
    if (savedVideos) setVideos(JSON.parse(savedVideos) as ManualVideo[]);
  }, []);

  function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingSettings(true);
    localStorage.setItem("admin-media-settings", JSON.stringify(settings));
    setTimeout(() => {
      setSavingSettings(false);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    }, 400);
  }

  function addVideo(e: React.FormEvent) {
    e.preventDefault();
    setSavingVideo(true);
    const newVideo: ManualVideo = {
      id: Date.now().toString(),
      ...videoForm,
    };
    const updated = [newVideo, ...videos];
    setVideos(updated);
    localStorage.setItem("admin-manual-videos", JSON.stringify(updated));
    setVideoForm({ title: "", videoId: "", date: "", description: "" });
    setShowVideoForm(false);
    setSavingVideo(false);
  }

  function deleteVideo(id: string) {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    localStorage.setItem("admin-manual-videos", JSON.stringify(updated));
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
          Admin
        </span>
        <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
          Media
        </h1>
        <p className="font-body text-white/40 text-sm mt-2">
          Manage podcast RSS feed, YouTube channel, and video entries.
        </p>
      </div>

      {/* ── Feed settings ── */}
      <section className="mb-8 p-5 sm:p-6" style={glass}>
        <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-5">
          Feed settings
        </p>
        <form onSubmit={saveSettings} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
              Spotify / Anchor RSS Feed URL
            </label>
            <input
              value={settings.podcastRssUrl}
              onChange={(e) =>
                setSettings((p) => ({ ...p, podcastRssUrl: e.target.value }))
              }
              placeholder="https://anchor.fm/s/xxx/podcast/rss"
              className={inputClass}
            />
            <p className="font-body text-white/25 text-xs">
              Audio messages are fetched automatically from this URL. Update it
              if you change your podcast host.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
              YouTube Channel ID
            </label>
            <input
              value={settings.youtubeChannelId}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  youtubeChannelId: e.target.value,
                }))
              }
              placeholder="UCxxxxxxxxxxxxxxxxxxxxxxxxx"
              className={inputClass}
            />
            <p className="font-body text-white/25 text-xs">
              Videos are fetched automatically from this channel. Find it in
              YouTube Studio → Settings → Channel → Advanced.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
              YouTube Channel URL{" "}
              <span className="normal-case opacity-50">(for &quot;View channel&quot; link)</span>
            </label>
            <input
              value={settings.youtubeChannelUrl}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  youtubeChannelUrl: e.target.value,
                }))
              }
              placeholder="https://www.youtube.com/@YourHandle"
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={savingSettings}
              className="self-start border border-white/30 px-6 py-2.5 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
            >
              {savingSettings ? "Saving…" : "Save settings"}
            </button>
            {settingsSaved && (
              <span className="font-body text-white/50 text-xs">Saved ✓</span>
            )}
          </div>
        </form>
      </section>

      {/* ── Manual video entries ── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-body text-white/30 text-[10px] tracking-widest uppercase">
              Manual video entries
            </p>
            <p className="font-body text-white/35 text-xs mt-0.5">
              Add specific YouTube videos to feature. These supplement the
              auto-fetched channel feed.
            </p>
          </div>
          {!showVideoForm && (
            <button
              onClick={() => setShowVideoForm(true)}
              className="border border-white/30 px-4 py-2 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors cursor-pointer shrink-0"
            >
              + Add video
            </button>
          )}
        </div>

        {showVideoForm && (
          <div className="p-5 mb-4" style={glass}>
            <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-4">
              New video
            </p>
            <form onSubmit={addVideo} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    Title
                  </label>
                  <input
                    value={videoForm.title}
                    onChange={(e) =>
                      setVideoForm((p) => ({ ...p, title: e.target.value }))
                    }
                    required
                    placeholder="Sunday Service — May 2025"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    YouTube Video ID
                  </label>
                  <input
                    value={videoForm.videoId}
                    onChange={(e) =>
                      setVideoForm((p) => ({ ...p, videoId: e.target.value }))
                    }
                    required
                    placeholder="dQw4w9WgXcQ"
                    className={inputClass}
                  />
                  <p className="font-body text-white/20 text-[10px]">
                    From youtube.com/watch?v=<strong>THIS_PART</strong>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    Date
                  </label>
                  <input
                    type="date"
                    value={videoForm.date}
                    onChange={(e) =>
                      setVideoForm((p) => ({ ...p, date: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    Description{" "}
                    <span className="normal-case opacity-50">(optional)</span>
                  </label>
                  <input
                    value={videoForm.description}
                    onChange={(e) =>
                      setVideoForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Brief description"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={savingVideo}
                  className="self-start border border-white/30 px-6 py-2.5 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
                >
                  {savingVideo ? "Adding…" : "Add video"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowVideoForm(false)}
                  className="font-body text-white/40 text-sm hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {videos.length === 0 && !showVideoForm && (
          <p className="font-body text-white/25 text-sm">
            No manual videos added. The channel feed is fetched automatically.
          </p>
        )}

        {videos.map((v) => (
          <div
            key={v.id}
            className="flex items-start justify-between gap-4 py-4 border-t border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex items-start gap-3 min-w-0">
              {/* Thumbnail */}
              <div
                className="shrink-0 overflow-hidden"
                style={{ borderRadius: "6px", width: 64, height: 36 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`}
                  alt={v.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-body text-white font-semibold text-sm truncate">
                  {v.title}
                </span>
                <span className="font-body text-white/35 text-xs">
                  {v.videoId}
                  {v.date ? ` · ${v.date}` : ""}
                </span>
                {v.description && (
                  <span className="font-body text-white/25 text-xs line-clamp-1">
                    {v.description}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`https://www.youtube.com/watch?v=${v.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-white/35 text-xs hover:text-white transition-colors"
              >
                View
              </a>
              <button
                onClick={() => deleteVideo(v.id)}
                className="font-body text-white/25 text-xs hover:text-red-400 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ── Info box ── */}
      <div
        className="p-4 flex flex-col gap-1"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
        }}
      >
        <p className="font-body text-white/40 text-[10px] tracking-widest uppercase">
          How auto-fetch works
        </p>
        <p className="font-body text-white/30 text-xs leading-relaxed">
          Audio messages are fetched from your Spotify RSS feed every hour.
          Videos are fetched from your YouTube channel feed every 30 minutes.
          New episodes and live stream replays appear automatically — no manual
          action needed.
        </p>
      </div>
    </div>
  );
}
