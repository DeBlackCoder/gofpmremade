"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSermons } from "@/lib/hooks/queries";
import { getDailyPhoto } from "@/lib/church-photos";
import type { Sermon } from "@/lib/types/resources";

interface SiteSettings {
  guidanceText?: string;
  guidancePhone?: string;
  guidanceEmail?: string;
}

export default function SermonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const bgUrl = getDailyPhoto();

  const { data: pageData, isLoading } = useSermons(1);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const all: Sermon[] = pageData?.data || [];
  const sermon: Sermon | null = all.find((s) => s.slug === slug) || null;

  // Fetch site settings for guidance section
  useEffect(() => {
    fetch("/api/v1/site-settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data?.data) {
          setSettings(data.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative w-full min-h-svh overflow-hidden">
      {/* Logo watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true" style={{ zIndex: 0 }}>
        <img src="/logo.png" alt="" className="object-contain" style={{ width: "min(80vw, 700px)", height: "min(80vw, 700px)", opacity: 0.04, userSelect: "none" }} />
      </div>

      <div className="public-content relative flex flex-col items-center min-h-svh px-6 py-6 sm:px-10 sm:py-8" style={{ zIndex: 1 }}>
        <div className="flex items-center justify-between">
          <p className="font-body text-white/70 text-xs tracking-widest uppercase">
            GOD'S OWN FAVOUR PROPHETIC MINISTRY
          </p>
          <Link
            href="/sermons"
            className="font-body text-white/60 text-xs tracking-wide hover:text-white transition-colors"
          >
            ← All sermons
          </Link>
        </div>

        {isLoading && (
          <div className="mt-16 font-body text-white/60 text-sm">
            Loading sermon…
          </div>
        )}

        {!isLoading && !sermon && (
          <div className="mt-16 flex flex-col gap-4">
            <p className="font-heading text-white font-black text-3xl">
              Sermon not found
            </p>
            <Link
              href="/sermons"
              className="font-body text-white/60 text-sm hover:text-white transition-colors"
            >
              Back to sermons
            </Link>
          </div>
        )}

        {sermon && (
          <div className="mt-10 max-w-3xl">
            <p className="font-body text-white/35 text-[10px] tracking-widest uppercase">
              {new Date(
                sermon.preachedAt || sermon.date || sermon.createdAt || "",
              ).toLocaleDateString()}
            </p>
            <h1
              className="font-heading mt-3 text-white font-black leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2rem, 7vw, 4rem)" }}
            >
              {sermon.title}
            </h1>
            {sermon.pastor && (
              <span className="font-body text-white/50 text-[10px] tracking-widest uppercase mb-1 block mt-2">
                By {sermon.pastor}
              </span>
            )}

            {/* Scripture Reference - Moved to top */}
            {sermon.scripture && (
              <div className="mt-6 p-6 border border-white/15 bg-white/5 backdrop-blur-sm rounded-lg">
                <p className="font-body text-white/40 text-[10px] tracking-widest uppercase mb-2">
                  Scripture
                </p>
                <p className="font-body text-white/90 text-sm">
                  {sermon.scripture}
                </p>
              </div>
            )}

            {sermon.excerpt && (
              <p className="font-body text-white/70 text-base leading-relaxed mt-6 mb-8">
                {sermon.excerpt}
              </p>
            )}

            <div className="mt-8 flex gap-3 flex-wrap">
              {(sermon.podcastYoutube || sermon.videoUrl) && (
                <Button
                  variant="outline"
                  className="border-white/30 text-white rounded-none h-9 px-4 text-xs font-body tracking-wide hover:bg-white hover:text-black transition-all"
                  asChild
                >
                  <a
                    href={sermon.podcastYoutube || sermon.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch video
                  </a>
                </Button>
              )}
              {sermon.audioUrl && (
                <a
                  href={sermon.audioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs tracking-widest uppercase px-4 py-2 border border-white/30 text-white hover:bg-white hover:text-black transition-colors"
                >
                  Listen audio
                </a>
              )}
            </div>

            {/* Sermon Body Content */}
            {sermon.body && (
              <div className="mt-12 pt-8 border-t border-white/10">
                <div 
                  className="font-body text-white/80 text-sm sm:text-base leading-relaxed prose prose-invert prose-sm sm:prose-base max-w-none"
                  style={{
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {sermon.body}
                </div>
              </div>
            )}

            {/* Guidance & Counselling Section */}
            <motion.div
              className="mt-16 p-8 border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-600/5 backdrop-blur-sm rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-400"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-white font-bold text-lg mb-2">
                    Need Guidance or Counselling?
                  </h3>
                  <p className="font-body text-white/70 text-sm leading-relaxed mb-4">
                    {settings?.guidanceText || 
                      "If this message has stirred something in your heart, or if you're facing challenges and need someone to talk to, we're here for you. Our pastoral team is available for guidance, prayer, and counselling."}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {settings?.guidancePhone && (
                      <a
                        href={`tel:${settings.guidancePhone}`}
                        className="inline-flex items-center gap-2 font-body text-xs tracking-wide px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-200 hover:bg-amber-500/30 transition-colors rounded"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        Call {settings.guidancePhone}
                      </a>
                    )}
                    {settings?.guidanceEmail && (
                      <a
                        href={`mailto:${settings.guidanceEmail}`}
                        className="inline-flex items-center gap-2 font-body text-xs tracking-wide px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-200 hover:bg-amber-500/30 transition-colors rounded"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        Email us
                      </a>
                    )}
                    {!settings?.guidancePhone && !settings?.guidanceEmail && (
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 font-body text-xs tracking-wide px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-200 hover:bg-amber-500/30 transition-colors rounded"
                      >
                        Contact us
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
