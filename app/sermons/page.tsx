"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useSermons, useSearchSermons } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/stores/uiStore";
import { getDailyPhoto } from "@/lib/church-photos";
import PodcastEpisodes from "@/components/PodcastEpisodes";
import YouTubeVideos from "@/components/YouTubeVideos";
import type { PodcastFeed } from "@/app/api/podcast-feed/route";
import { useEffect } from "react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "word" | "audio" | "video";

interface SermonItem {
  id?: string;
  slug: string;
  title: string;
  pastor?: string;
  author?: string;
  date?: string;
  dateISO?: string;
  excerpt?: string;
  content?: string;
  createdAt?: string;
  tags?: string[];
}

const tabs: { id: Tab; label: string }[] = [
  { id: "word", label: "The Word" },
  { id: "audio", label: "Audio Messages" },
  { id: "video", label: "Video Sessions" },
];

// ─── Glass styles ─────────────────────────────────────────────────────────────

const glass: React.CSSProperties = {
  background: "rgba(0,0,0,0.45)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "16px",
  boxShadow: "0 4px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SermonsPage() {
  const bgUrl = getDailyPhoto(5);
  const [activeTab, setActiveTab] = useState<Tab>("word");

  // ── The Word state ──
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const addToast = useUiStore((s) => s.addToast);

  // ── Hidden items (blocklist) ──
  const [hiddenItems] = useLocalStorage<Array<{ id: string; type: string }>>("admin-hidden-media", []);
  const [hiddenSermonIds, setHiddenSermonIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const sermonIds = new Set(
      hiddenItems.filter((item) => item.type === 'sermon').map((item) => item.id)
    );
    setHiddenSermonIds(sermonIds);
  }, [hiddenItems]);

  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useSearchSermons(searchTerm);
  const { data: paginatedSermons, isLoading, error } = useSermons(page);

  if (error) addToast({ type: "error", message: "Failed to load sermons" });
  if (searchError) addToast({ type: "error", message: "Search failed" });

  const displaySermons = searchTerm
    ? searchResults?.data || []
    : paginatedSermons?.data || [];
  
  // Filter out hidden sermons
  const filtered = displaySermons.filter((sermon) => {
    const sermonId = sermon.id || (sermon as any)._id || (sermon as any).slug;
    return !hiddenSermonIds.has(sermonId);
  });
  
  const featured = filtered.length > 0 ? filtered[0] : null;

  // ── Audio state — fetch podcast feed client-side ──
  const [podcastFeed, setPodcastFeed] = useState<PodcastFeed | null>(null);
  const [podcastLoading, setPodcastLoading] = useState(false);
  const [podcastError, setPodcastError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab !== "audio" || podcastFeed !== null || podcastLoading) return;
    let cancelled = false;
    setPodcastLoading(true);
    fetch("/api/podcast-feed")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const ct = r.headers.get("content-type") || "";
        if (!ct.includes("application/json")) throw new Error("Invalid response from podcast API");
        return r.json();
      })
      .then((data: PodcastFeed & { error?: string }) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setPodcastFeed(data);
        setPodcastLoading(false);
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setPodcastError(e.message);
          setPodcastLoading(false);
        }
      });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <section className="relative w-full min-h-svh overflow-hidden">
      {/* Logo watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true" style={{ zIndex: 0 }}>
        <img src="/logo.png" alt="" className="object-contain" style={{ width: "min(80vw, 700px)", height: "min(80vw, 700px)", opacity: 0.04, userSelect: "none" }} />
      </div>
      {/* Background */}

      {/* Content */}
      <div className="public-content relative flex flex-col items-center min-h-svh px-6 py-6 sm:px-10 sm:py-8" style={{ zIndex: 1 }}>

        {/* Heading */}
        <motion.h1
          className="font-heading mt-4 sm:mt-6 text-white font-black leading-[0.92] tracking-tight text-center"
          style={{ fontSize: "clamp(2.6rem, 10vw, 6rem)" }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Words that
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            last.
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-4 font-body text-white/60 text-sm sm:text-base leading-relaxed max-w-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          Read the Word, listen to audio messages, or watch recorded services — anytime, anywhere.
        </motion.p>

        {/* ── Tab switcher ── */}
        <motion.div
          className="mt-8 flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6 }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="font-body text-xs tracking-widest uppercase px-5 py-2 transition-all duration-200"
              style={
                activeTab === tab.id
                  ? {
                      background: "rgba(212,175,55,0.15)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(212,175,55,0.4)",
                      borderRadius: "10px",
                      color: "#D4AF37",
                    }
                  : {
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: "10px",
                      color: "rgba(255,255,255,0.45)",
                    }
              }
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* ══════════════════════════════════════════════
            TAB 1 — THE WORD (written sermons)
        ══════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {activeTab === "word" && (
            <motion.div
              key="word"
              className="mt-10 flex flex-col w-full max-w-4xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {/* Loading */}
              {isLoading && (
                <div className="flex items-center gap-3 py-8">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <p className="font-body text-white/50 text-sm">Loading sermons…</p>
                </div>
              )}

              {/* Featured sermon */}
              {!isLoading && featured && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <p className="font-body text-white/40 text-[10px] tracking-widest uppercase mb-3">
                    Featured
                  </p>
                  <Link
                    href={`/sermons/${featured.slug}`}
                    className="group block p-5 sm:p-6"
                    style={glass}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 sm:gap-10 items-start">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">
                            Latest sermon
                          </span>
                          <span className="font-body text-white/30 text-[10px]">
                            {featured.date || new Date(featured.dateISO || featured.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        <h2
                          className="font-heading text-white font-black leading-[0.95] tracking-tight group-hover:text-white/80 transition-colors"
                          style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
                        >
                          {featured.title}
                        </h2>
                        <p className="font-body text-white/55 text-sm leading-relaxed max-w-lg line-clamp-3">
                          {featured.excerpt || (featured as SermonItem).content}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="font-body text-white/60 text-xs">
                            {featured.pastor || (featured as SermonItem).author || "Pastor"}
                          </span>
                          <span className="font-body text-white/25 text-xs">·</span>
                          <span className="font-body text-white/35 text-xs">5 min read</span>
                        </div>
                      </div>
                      <span className="hidden sm:block font-body text-white/30 text-3xl group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 mt-2">
                        →
                      </span>
                    </div>
                    <span className="mt-5 inline-block font-body text-white/50 text-xs tracking-widest uppercase border-b border-white/25 pb-0.5 group-hover:text-white group-hover:border-white transition-colors">
                      Read sermon
                    </span>
                  </Link>
                </motion.div>
              )}

              {/* Sermon list */}
              {!isLoading && (
                <>
                  <p className="font-body text-white/35 text-[10px] tracking-widest uppercase mb-1">
                    All sermons — {filtered.length} messages
                  </p>
                  <AnimatePresence mode="popLayout">
                    {filtered.map((sermon, i) => (
                      <motion.div
                        key={sermon.slug}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                      >
                        <Link
                          href={`/sermons/${sermon.slug}`}
                          className="group flex items-start gap-5 sm:gap-8 py-5 border-t border-white/20 hover:border-white/40 transition-colors"
                        >
                          <div className="hidden sm:flex flex-col items-center w-10 flex-shrink-0 pt-0.5 leading-none">
                            <span className="font-body text-white/30 text-[9px] tracking-widest uppercase">
                              {new Date(sermon.dateISO || sermon.createdAt || sermon.date || Date.now())
                                .toLocaleString("en", { month: "short" })
                                .toUpperCase()}
                            </span>
                            <span className="font-heading text-white font-black text-2xl leading-none mt-0.5">
                              {new Date(sermon.dateISO || sermon.createdAt || sermon.date || Date.now())
                                .getDate()
                                .toString()
                                .padStart(2, "0")}
                            </span>
                          </div>
                          <div className="flex-1 flex flex-col gap-1.5">
                            <span className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                              Sermon
                            </span>
                            <h3 className="font-body text-white font-semibold text-sm sm:text-base group-hover:text-white/75 transition-colors leading-snug">
                              {sermon.title}
                            </h3>
                            <p className="font-body text-white/45 text-xs leading-relaxed line-clamp-2 max-w-xl hidden sm:block">
                              {sermon.excerpt || (sermon as SermonItem).content}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="font-body text-white/45 text-xs">
                                {sermon.pastor || (sermon as SermonItem).author || "Pastor"}
                              </span>
                              <span className="font-body text-white/20 text-xs">·</span>
                              <span className="font-body text-white/30 text-xs">5 min read</span>
                            </div>
                          </div>
                          <span className="text-white/25 text-xl group-hover:text-white/55 group-hover:translate-x-1 transition-all duration-300 mt-1 flex-shrink-0">
                            →
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filtered.length === 0 && (
                    <p className="font-body text-white/40 text-sm pt-8">
                      No sermons found. Check back soon.
                    </p>
                  )}

                  {/* Pagination */}
                  {!searchTerm && paginatedSermons?.pagination && (
                    <motion.div
                      className="flex items-center justify-between mt-10 px-5 py-4"
                      style={{
                        background: "rgba(0,0,0,0.45)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        borderRadius: "12px",
                      }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="font-body text-xs tracking-widest uppercase text-white/60 disabled:text-white/30 hover:text-white transition-colors disabled:cursor-not-allowed"
                      >
                        ← Previous
                      </button>
                      <span className="font-body text-xs text-white/40">
                        Page {page} of{" "}
                        {Math.ceil((paginatedSermons.pagination?.total || 0) / 10)}
                      </span>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={
                          page >= Math.ceil((paginatedSermons.pagination?.total || 0) / 10)
                        }
                        className="font-body text-xs tracking-widest uppercase text-white/60 disabled:text-white/30 hover:text-white transition-colors disabled:cursor-not-allowed"
                      >
                        Next →
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════
              TAB 2 — AUDIO MESSAGES (Spotify RSS)
          ══════════════════════════════════════════════ */}
          {activeTab === "audio" && (
            <motion.div
              key="audio"
              className="mt-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {podcastLoading && (
                <div className="flex items-center gap-3 py-8">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <p className="font-body text-white/50 text-sm">Loading audio messages…</p>
                </div>
              )}

              {podcastError && !podcastLoading && (
                <div className="px-6 py-8 flex flex-col gap-3" style={glass}>
                  <p className="font-body text-white/60 text-sm">
                    Could not load audio messages due to database congestion.
                  </p>
                  <p className="font-body text-white/35 text-xs">{podcastError}</p>
                </div>
              )}

              {!podcastLoading && !podcastError && podcastFeed && (
                <PodcastEpisodes feed={podcastFeed} />
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════
              TAB 3 — VIDEO SESSIONS (YouTube RSS)
          ══════════════════════════════════════════════ */}
          {activeTab === "video" && (
            <motion.div
              key="video"
              className="mt-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <YouTubeVideos />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-16" />
      </div>
    </section>
  );
}
