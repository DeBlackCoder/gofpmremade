"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { YouTubeFeed, YouTubeVideo } from "@/app/api/youtube-feed/route";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// ─── Glass styles ─────────────────────────────────────────────────────────────

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "16px",
  boxShadow: "0 4px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
};

const glassActive: React.CSSProperties = {
  background: "rgba(255,255,255,0.11)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.22)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
};

const glassSubtle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "12px",
};

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={glassSubtle} className="overflow-hidden animate-pulse">
      <div
        className="w-full"
        style={{
          aspectRatio: "16/9",
          background: "rgba(255,255,255,0.06)",
        }}
      />
      <div className="px-4 py-3 flex flex-col gap-2">
        <div
          className="h-3 rounded-full w-3/4"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <div
          className="h-2.5 rounded-full w-1/2"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <div
          className="h-2 rounded-full w-2/3"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
      </div>
    </div>
  );
}

// ─── Video card ───────────────────────────────────────────────────────────────

function VideoCard({
  video,
  index,
  isActive,
  onSelect,
}: {
  video: YouTubeVideo;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
    >
      <button
        onClick={onSelect}
        className="group w-full text-left"
        aria-label={`Play ${video.title}`}
      >
        <div
          className="flex flex-col overflow-hidden transition-all duration-300"
          style={isActive ? glassActive : glassSubtle}
        >
          {/* Thumbnail */}
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "16/9" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Glass play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-14 h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: isActive
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.30)",
                  borderRadius: "50%",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                {isActive ? (
                  /* Pause icon when active */
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  /* Play icon */
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white ml-0.5"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </div>
            </div>

            {/* "Now playing" badge */}
            {isActive && (
              <div
                className="absolute top-2 left-2 px-2 py-0.5 flex items-center gap-1.5"
                style={{
                  background: "rgba(239,68,68,0.85)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  borderRadius: "6px",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="font-body text-white text-[9px] tracking-widest uppercase">
                  Playing
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="px-4 py-3 flex flex-col gap-1">
            <h3 className="font-body text-white font-semibold text-sm leading-snug group-hover:text-white/80 transition-colors line-clamp-2">
              {video.title}
            </h3>
            <span className="font-body text-white/40 text-xs">
              {formatDate(video.published)}
            </span>
            {video.description && (
              <p className="font-body text-white/45 text-xs leading-relaxed mt-0.5 line-clamp-2">
                {video.description}
              </p>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function YouTubeVideos() {
  const [feed, setFeed] = useState<YouTubeFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const INITIAL_COUNT = 6;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/youtube-feed");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `HTTP ${res.status}`);
        }
        const data: YouTubeFeed = await res.json();
        if (!cancelled) {
          setFeed(data);
          // Auto-select first video
          if (data.videos.length > 0) {
            setActiveVideoId(data.videos[0].videoId);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load videos");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const visibleVideos = feed
    ? showAll
      ? feed.videos
      : feed.videos.slice(0, INITIAL_COUNT)
    : [];

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
          />
          <span className="font-body text-white/50 text-xs tracking-widest uppercase">
            Loading videos…
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div
        className="px-6 py-8 flex flex-col gap-3"
        style={glass}
      >
        <p className="font-body text-white/60 text-sm">
          Could not load videos right now.
        </p>
        <p className="font-body text-white/35 text-xs leading-relaxed">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="self-start font-body text-white/50 text-xs tracking-widest uppercase hover:text-white transition-colors underline underline-offset-4"
        >
          Try again →
        </button>
      </div>
    );
  }

  // ── Empty state ──
  if (!feed || feed.videos.length === 0) {
    return (
      <div
        className="px-6 py-10 flex flex-col items-center gap-3 text-center"
        style={glass}
      >
        <p className="font-body text-white/60 text-sm">
          No videos published yet.
        </p>
        <p className="font-body text-white/35 text-xs leading-relaxed max-w-sm">
          Videos and live stream replays will appear here automatically once
          published on the channel.
        </p>
        <a
          href={`https://www.youtube.com/channel/UCQshxkbjIwOPDHTtLoM19cQ`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-white/50 text-xs tracking-widest uppercase hover:text-white transition-colors underline underline-offset-4"
        >
          Visit channel on YouTube →
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Channel header */}
      <div
        className="flex items-center justify-between gap-4 px-5 py-4"
        style={glass}
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">
            YouTube Channel
          </span>
          <span className="font-body text-white font-semibold text-sm">
            {feed.channelName}
          </span>
          <span className="font-body text-white/35 text-xs">
            {feed.videos.length} video{feed.videos.length !== 1 ? "s" : ""}
          </span>
        </div>
        <a
          href={feed.channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-body text-white/40 text-[10px] tracking-widest uppercase hover:text-white transition-colors"
        >
          Open channel →
        </a>
      </div>

      {/* Active video player */}
      <AnimatePresence mode="wait">
        {activeVideoId && (
          <motion.div
            key={activeVideoId}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.35 }}
          >
            <div
              className="overflow-hidden"
              style={{ ...glass, borderRadius: "20px" }}
            >
              {/* Embed */}
              <div className="relative w-full aspect-video">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={
                    feed.videos.find((v) => v.videoId === activeVideoId)
                      ?.title ?? "Video"
                  }
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ border: 0 }}
                />
              </div>

              {/* Video info below player */}
              {(() => {
                const v = feed.videos.find((v) => v.videoId === activeVideoId);
                if (!v) return null;
                return (
                  <div className="px-5 py-4 flex flex-col gap-1.5">
                    <h2 className="font-body text-white font-semibold text-sm sm:text-base leading-snug">
                      {v.title}
                    </h2>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-body text-white/40 text-xs">
                        {formatDate(v.published)}
                      </span>
                      <a
                        href={`https://www.youtube.com/watch?v=${v.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-white/35 text-xs hover:text-white transition-colors underline underline-offset-4"
                      >
                        Open on YouTube →
                      </a>
                    </div>
                    {v.description && (
                      <p className="font-body text-white/50 text-xs leading-relaxed mt-1 line-clamp-3">
                        {v.description}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video grid */}
      <div>
        <p className="font-body text-white/40 text-[10px] tracking-widest uppercase mb-3">
          {activeVideoId ? "All videos" : "Recorded services & live replays"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleVideos.map((video, i) => (
            <VideoCard
              key={video.videoId}
              video={video}
              index={i}
              isActive={video.videoId === activeVideoId}
              onSelect={() => setActiveVideoId(video.videoId)}
            />
          ))}
        </div>
      </div>

      {/* Show more / less */}
      {feed.videos.length > INITIAL_COUNT && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="self-start font-body text-white/50 text-xs tracking-widest uppercase hover:text-white transition-colors underline underline-offset-4"
        >
          {showAll
            ? "Show fewer videos"
            : `Show all ${feed.videos.length} videos →`}
        </button>
      )}
    </div>
  );
}
