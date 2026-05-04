"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { PodcastFeed } from "@/app/api/podcast-feed/route";
import type { YouTubeFeed } from "@/app/api/youtube-feed/route";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HiddenItem {
  id: string;
  type: 'video' | 'audio' | 'sermon';
  title: string;
  hiddenAt: string;
}

interface Sermon {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  pastor: string;
  date: string;
  featured?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "12px",
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminMediaManagerPage() {
  const [podcastFeed, setPodcastFeed] = useState<PodcastFeed | null>(null);
  const [youtubeFeed, setYoutubeFeed] = useState<YouTubeFeed | null>(null);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [hiddenItems, setHiddenItems] = useState<HiddenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sermons' | 'audio' | 'video'>('sermons');

  useEffect(() => {
    // Load hidden items from localStorage
    const saved = localStorage.getItem("admin-hidden-media");
    if (saved) setHiddenItems(JSON.parse(saved) as HiddenItem[]);

    // Fetch sermons from MongoDB
    fetch("/api/v1/admin/sermons")
      .then((r) => r.json())
      .then((response) => {
        if (response.success && Array.isArray(response.data)) {
          setSermons(response.data);
        }
      })
      .catch(console.error);

    // Fetch podcast feed
    fetch("/api/podcast-feed")
      .then((r) => r.json())
      .then((data: PodcastFeed) => setPodcastFeed(data))
      .catch(console.error);

    // Fetch YouTube feed
    fetch("/api/youtube-feed")
      .then((r) => r.json())
      .then((data: YouTubeFeed) => setYoutubeFeed(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function hideItem(id: string, type: 'video' | 'audio' | 'sermon', title: string) {
    const newHidden: HiddenItem = {
      id,
      type,
      title,
      hiddenAt: new Date().toISOString(),
    };
    const updated = [newHidden, ...hiddenItems];
    setHiddenItems(updated);
    localStorage.setItem("admin-hidden-media", JSON.stringify(updated));
  }

  function unhideItem(id: string) {
    const updated = hiddenItems.filter((item) => item.id !== id);
    setHiddenItems(updated);
    localStorage.setItem("admin-hidden-media", JSON.stringify(updated));
  }

  const hiddenSermonIds = new Set(
    hiddenItems.filter((item) => item.type === 'sermon').map((item) => item.id)
  );
  const hiddenAudioIds = new Set(
    hiddenItems.filter((item) => item.type === 'audio').map((item) => item.id)
  );
  const hiddenVideoIds = new Set(
    hiddenItems.filter((item) => item.type === 'video').map((item) => item.id)
  );

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
          Admin
        </span>
        <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
          All Media
        </h1>
        <p className="font-body text-white/40 text-sm mt-2">
          Manage visibility of sermons, audio messages, and videos on the public site.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('sermons')}
          className={`font-body text-xs tracking-widest uppercase px-5 py-2 transition-all duration-200 ${
            activeTab === 'sermons'
              ? 'bg-white/15 border border-white/30 text-white'
              : 'bg-white/5 border border-white/10 text-white/45'
          }`}
          style={{ borderRadius: "10px" }}
        >
          Sermons
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`font-body text-xs tracking-widest uppercase px-5 py-2 transition-all duration-200 ${
            activeTab === 'audio'
              ? 'bg-white/15 border border-white/30 text-white'
              : 'bg-white/5 border border-white/10 text-white/45'
          }`}
          style={{ borderRadius: "10px" }}
        >
          Audio Messages
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`font-body text-xs tracking-widest uppercase px-5 py-2 transition-all duration-200 ${
            activeTab === 'video'
              ? 'bg-white/15 border border-white/30 text-white'
              : 'bg-white/5 border border-white/10 text-white/45'
          }`}
          style={{ borderRadius: "10px" }}
        >
          Videos
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-8">
          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          <p className="font-body text-white/50 text-sm">Loading media…</p>
        </div>
      )}

      {/* Sermons Tab */}
      {!loading && activeTab === 'sermons' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-body text-white/35 text-xs">
              {sermons.length} sermons · {hiddenSermonIds.size} hidden
            </p>
            <a
              href="/admin-sermons"
              className="font-body text-white/50 text-xs hover:text-white transition-colors"
            >
              Manage sermons →
            </a>
          </div>

          {sermons.map((sermon) => {
            const isHidden = hiddenSermonIds.has(sermon._id || sermon.slug);
            return (
              <div
                key={sermon._id || sermon.slug}
                className="flex items-start gap-4 p-4"
                style={{
                  ...glass,
                  opacity: isHidden ? 0.5 : 1,
                }}
              >
                {/* Icon */}
                <div
                  className="shrink-0 flex items-center justify-center"
                  style={{
                    borderRadius: "8px",
                    width: 48,
                    height: 48,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/50">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-body text-white font-semibold text-sm truncate">
                      {sermon.title}
                    </h3>
                    {isHidden && (
                      <span className="font-body text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
                        Hidden
                      </span>
                    )}
                    {sermon.featured && (
                      <span className="font-body text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="font-body text-white/40 text-xs">
                    {sermon.pastor} · {sermon.date}
                  </p>
                  {sermon.subtitle && (
                    <p className="font-body text-white/30 text-xs mt-1 line-clamp-1">
                      {sermon.subtitle}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={`/sermons/${sermon.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-white/35 text-xs hover:text-white transition-colors"
                  >
                    View
                  </a>
                  {isHidden ? (
                    <button
                      onClick={() => unhideItem(sermon._id || sermon.slug)}
                      className="font-body text-emerald-400/60 text-xs hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      Unhide
                    </button>
                  ) : (
                    <button
                      onClick={() => hideItem(sermon._id || sermon.slug, 'sermon', sermon.title)}
                      className="font-body text-red-400/60 text-xs hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Hide
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {sermons.length === 0 && (
            <p className="font-body text-white/25 text-sm py-8 text-center">
              No sermons found. <a href="/admin-sermons" className="underline hover:text-white">Add your first sermon</a>
            </p>
          )}
        </div>
      )}

      {/* Audio Messages Tab */}
      {!loading && activeTab === 'audio' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-body text-white/35 text-xs">
              {podcastFeed?.episodes.length || 0} episodes · {hiddenAudioIds.size} hidden
            </p>
          </div>

          {podcastFeed?.episodes.map((episode) => {
            const isHidden = hiddenAudioIds.has(episode.guid);
            return (
              <div
                key={episode.guid}
                className="flex items-start gap-4 p-4"
                style={{
                  ...glass,
                  opacity: isHidden ? 0.5 : 1,
                }}
              >
                {/* Episode artwork */}
                {episode.image && (
                  <div
                    className="shrink-0 overflow-hidden"
                    style={{ borderRadius: "8px", width: 48, height: 48 }}
                  >
                    <Image
                      src={episode.image}
                      alt={episode.title}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-body text-white font-semibold text-sm truncate">
                      {episode.title}
                    </h3>
                    {isHidden && (
                      <span className="font-body text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="font-body text-white/40 text-xs">
                    {formatDate(episode.pubDate)}
                    {episode.duration && ` · ${episode.duration}`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  {isHidden ? (
                    <button
                      onClick={() => unhideItem(episode.guid)}
                      className="font-body text-emerald-400/60 text-xs hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      Unhide
                    </button>
                  ) : (
                    <button
                      onClick={() => hideItem(episode.guid, 'audio', episode.title)}
                      className="font-body text-red-400/60 text-xs hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Hide
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {(!podcastFeed || podcastFeed.episodes.length === 0) && (
            <p className="font-body text-white/25 text-sm py-8 text-center">
              No audio episodes found. Check your RSS feed settings in <a href="/admin-media" className="underline hover:text-white">Media Settings</a>.
            </p>
          )}
        </div>
      )}

      {/* Videos Tab */}
      {!loading && activeTab === 'video' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-body text-white/35 text-xs">
              {youtubeFeed?.videos.length || 0} videos · {hiddenVideoIds.size} hidden
            </p>
          </div>

          {youtubeFeed?.videos.map((video) => {
            const isHidden = hiddenVideoIds.has(video.videoId);
            return (
              <div
                key={video.videoId}
                className="flex items-start gap-4 p-4"
                style={{
                  ...glass,
                  opacity: isHidden ? 0.5 : 1,
                }}
              >
                {/* Thumbnail */}
                <div
                  className="shrink-0 overflow-hidden"
                  style={{ borderRadius: "8px", width: 80, height: 45 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-body text-white font-semibold text-sm truncate">
                      {video.title}
                    </h3>
                    {isHidden && (
                      <span className="font-body text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="font-body text-white/40 text-xs">
                    {formatDate(video.published)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-white/35 text-xs hover:text-white transition-colors"
                  >
                    View
                  </a>
                  {isHidden ? (
                    <button
                      onClick={() => unhideItem(video.videoId)}
                      className="font-body text-emerald-400/60 text-xs hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      Unhide
                    </button>
                  ) : (
                    <button
                      onClick={() => hideItem(video.videoId, 'video', video.title)}
                      className="font-body text-red-400/60 text-xs hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Hide
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {(!youtubeFeed || youtubeFeed.videos.length === 0) && (
            <p className="font-body text-white/25 text-sm py-8 text-center">
              No videos found. Check your YouTube channel settings in <a href="/admin-media" className="underline hover:text-white">Media Settings</a>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
