"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { PodcastFeed } from "@/app/api/podcast-feed/route";
import PodcastEpisodes from "@/components/PodcastEpisodes";
import YouTubeVideos from "@/components/YouTubeVideos";

type Tab = "audio" | "video";

// ─── Glass styles ─────────────────────────────────────────────────────────────

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "16px",
  boxShadow: "0 4px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function MediaClient({
  bgUrl,
  feed,
}: {
  bgUrl: string;
  feed: PodcastFeed | null;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("audio");

  return (
    <section className="relative w-full min-h-svh">
      {/* Background */}
      <motion.div
        className="page-bg"
        style={{ "--bg-url": `url(${bgUrl})` } as React.CSSProperties}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6 }}
      />
      <div
        className="fixed inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/15 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div
        className="fixed inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Content */}
      <div className="public-content relative z-10 flex flex-col min-h-svh px-6 py-6 sm:px-10 sm:py-8">

        {/* Heading */}
        <motion.h1
          className="font-heading mt-4 sm:mt-6 text-white font-black leading-[0.92] tracking-tight"
          style={{ fontSize: "clamp(2.6rem, 10vw, 6rem)" }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Messages
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            &amp; media.
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-4 font-body text-white/60 text-sm sm:text-base leading-relaxed max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          Listen to audio messages or watch recorded services and live replays — anytime, anywhere.
        </motion.p>

        {/* ── Tab switcher ── */}
        <motion.div
          className="mt-8 flex gap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6 }}
        >
          {(["audio", "video"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="font-body text-xs tracking-widest uppercase px-5 py-2 transition-all duration-200"
              style={
                activeTab === tab
                  ? {
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.30)",
                      borderRadius: "10px",
                      color: "rgba(255,255,255,1)",
                    }
                  : {
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: "10px",
                      color: "rgba(255,255,255,0.45)",
                    }
              }
            >
              {tab === "audio" ? "Audio Messages" : "Video Services"}
            </button>
          ))}
        </motion.div>

        {/* ── Audio tab ── */}
        {activeTab === "audio" && (
          <motion.div
            key="audio"
            className="mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {feed ? (
              <PodcastEpisodes feed={feed} />
            ) : (
              <div className="px-6 py-8 flex flex-col gap-3" style={glass}>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  Audio messages are not yet configured.
                </p>
                <p className="font-body text-white/35 text-xs leading-relaxed max-w-md">
                  Set the{" "}
                  <code className="text-white/50">PODCAST_RSS_URL</code>{" "}
                  environment variable to your Spotify for Podcasters RSS feed
                  URL. Episodes will appear here automatically.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Video tab — fully automatic from YouTube RSS ── */}
        {activeTab === "video" && (
          <motion.div
            key="video"
            className="mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <YouTubeVideos />
          </motion.div>
        )}

        {/* ── CTA ── */}
        <motion.div
          className="mt-16 sm:mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "20px",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)",
            padding: "2rem",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="flex flex-col gap-1">
            <p className="font-body text-white/45 text-xs tracking-widest uppercase">
              Join us live
            </p>
            <p className="font-heading text-white font-black text-2xl sm:text-3xl leading-tight">
              Experience worship
              <br />
              in person.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="/live-service"
              className="border border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide px-7 py-2 text-sm transition-colors"
            >
              Watch live stream
            </a>
            <a
              href="/location"
              className="text-white/55 hover:text-white font-body tracking-wide px-0 py-2 text-sm underline underline-offset-4 transition-colors"
            >
              Find us
            </a>
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
