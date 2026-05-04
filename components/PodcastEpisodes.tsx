"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { PodcastEpisode, PodcastFeed } from "@/app/api/podcast-feed/route";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(raw: string): string {
  try {
    return new Date(raw).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

function formatDuration(raw: string): string {
  if (!raw) return "";
  // Already in HH:MM:SS or MM:SS
  if (raw.includes(":")) return raw;
  // Seconds only
  const secs = parseInt(raw, 10);
  if (isNaN(secs)) return raw;
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
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
  border: "1px solid rgba(255,255,255,0.20)",
  borderRadius: "16px",
  boxShadow: "0 6px 28px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.12)",
};

const glassSubtle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "12px",
};

// ─── Episode card ─────────────────────────────────────────────────────────────

function EpisodeCard({
  episode,
  index,
  feedImage,
}: {
  episode: PodcastEpisode;
  index: number;
  feedImage: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const image = episode.image || feedImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
    >
      <div style={expanded ? glassActive : glass} className="overflow-hidden transition-all duration-300">
        {/* Card header — always visible */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full text-left px-4 py-4 sm:px-5 sm:py-5"
          aria-expanded={expanded}
        >
          <div className="flex items-start gap-4">
            {/* Episode artwork */}
            {image && (
              <div
                className="shrink-0 overflow-hidden"
                style={{ borderRadius: "10px", width: 56, height: 56 }}
              >
                <Image
                  src={image}
                  alt={episode.title}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
            )}

            {/* Meta */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                {episode.episodeNumber !== null && (
                  <span
                    className="font-body text-[9px] tracking-widest uppercase px-2 py-0.5"
                    style={glassSubtle}
                  >
                    <span className="text-white/50">Ep {episode.episodeNumber}</span>
                  </span>
                )}
                <span className="font-body text-white/35 text-[10px]">
                  {formatDate(episode.pubDate)}
                </span>
                {episode.duration && (
                  <span className="font-body text-white/30 text-[10px]">
                    · {formatDuration(episode.duration)}
                  </span>
                )}
              </div>

              <h3 className="font-body text-white font-semibold text-sm sm:text-base leading-snug">
                {episode.title}
              </h3>

              {episode.description && (
                <p className="font-body text-white/50 text-xs leading-relaxed line-clamp-2 mt-0.5">
                  {episode.description}
                </p>
              )}
            </div>

            {/* Expand toggle */}
            <span
              className="font-body text-white/40 text-lg shrink-0 mt-0.5 transition-transform duration-300"
              style={{
                transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
                display: "inline-block",
              }}
            >
              +
            </span>
          </div>
        </button>

        {/* Expanded — HTML5 audio player */}
        <AnimatePresence initial={false}>
          {expanded && episode.audioUrl && (
            <motion.div
              key="player"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-5 sm:px-5 flex flex-col gap-3">
                {/* Divider */}
                <div
                  className="w-full h-px"
                  style={{ background: "rgba(255,255,255,0.10)" }}
                />

                {/* Full description */}
                {episode.description && (
                  <p className="font-body text-white/60 text-xs leading-relaxed">
                    {episode.description}
                  </p>
                )}

                {/* HTML5 audio player */}
                <audio
                  controls
                  preload="none"
                  className="w-full"
                  style={{
                    // Custom audio player styling via filter
                    filter: "invert(1) hue-rotate(180deg) brightness(0.85)",
                    borderRadius: "8px",
                  }}
                >
                  <source src={episode.audioUrl} type="audio/mpeg" />
                  <source src={episode.audioUrl} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>

                {/* Direct download link */}
                <a
                  href={episode.audioUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-white/35 text-[10px] tracking-widest uppercase hover:text-white transition-colors self-start"
                >
                  Download audio →
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PodcastEpisodes({ feed }: { feed: PodcastFeed }) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 6;
  
  // Filter out hidden episodes using reactive localStorage hook
  const [hiddenItems] = useLocalStorage<Array<{ id: string; type: string }>>("admin-hidden-media", []);
  const [filteredEpisodes, setFilteredEpisodes] = useState(feed.episodes);
  
  useEffect(() => {
    const hiddenAudioIds = new Set(
      hiddenItems
        .filter((item) => item.type === 'audio')
        .map((item) => item.id)
    );
    setFilteredEpisodes(feed.episodes.filter(ep => !hiddenAudioIds.has(ep.guid)));
  }, [hiddenItems, feed.episodes]);
  
  const visible = showAll ? filteredEpisodes : filteredEpisodes.slice(0, INITIAL_COUNT);

  return (
    <div className="flex flex-col gap-6">
      {/* Feed header */}
      <div
        className="flex items-center gap-4 px-5 py-4"
        style={glass}
      >
        {feed.image && (
          <div
            className="shrink-0 overflow-hidden"
            style={{ borderRadius: "12px", width: 64, height: 64 }}
          >
            <Image
              src={feed.image}
              alt={feed.title}
              width={64}
              height={64}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
        )}
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">
            Podcast
          </span>
          <h2 className="font-body text-white font-semibold text-sm sm:text-base leading-snug truncate">
            {feed.title}
          </h2>
          <span className="font-body text-white/40 text-xs">
            {filteredEpisodes.length} episode{filteredEpisodes.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Episode list */}
      <div className="flex flex-col gap-3">
        <p className="font-body text-white/40 text-[10px] tracking-widest uppercase">
          All episodes — {filteredEpisodes.length} messages
        </p>

        {visible.map((ep, i) => (
          <EpisodeCard
            key={ep.guid}
            episode={ep}
            index={i}
            feedImage={feed.image}
          />
        ))}
      </div>

      {/* Show more / less */}
      {filteredEpisodes.length > INITIAL_COUNT && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="self-start font-body text-white/50 text-xs tracking-widest uppercase hover:text-white transition-colors underline underline-offset-4"
        >
          {showAll
            ? "Show fewer episodes"
            : `Show all ${filteredEpisodes.length} episodes →`}
        </button>
      )}
    </div>
  );
}
