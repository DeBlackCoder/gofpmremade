"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getDailyPhoto } from "@/lib/church-photos";

interface Announcement {
  id: string;
  title: string;
  message: string;
  date?: string;
  venue?: string;
  active: boolean;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const bgUrl = getDailyPhoto(3);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

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
      <div className="fixed inset-0 bg-linear-to-r from-black/75 via-black/40 to-black/10 z-10" />
      <div className="fixed inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/60 to-transparent z-10" />

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
            Church
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            announcements.
          </motion.span>
        </motion.h1>

        {/* Loading state */}
        {loading && (
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-white/60">Loading announcements...</p>
          </motion.div>
        )}

        {/* Announcements List */}
        {!loading && (
          <motion.div
            className="mt-8 sm:mt-12 flex flex-col gap-4 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7 }}
          >
            {announcements.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-20 text-center"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "16px",
                }}
              >
                <p className="font-body text-white/40 text-sm">No announcements at this time.</p>
                <p className="font-body text-white/30 text-xs mt-1">Check back soon.</p>
              </div>
            ) : (
              announcements.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + i * 0.08, duration: 0.5 }}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                  }}
                >
                  <h2 className="font-heading text-white font-black text-lg sm:text-xl leading-tight tracking-tight mb-2">
                    {a.title}
                  </h2>
                  <p className="font-body text-white/65 text-sm leading-relaxed mb-4">
                    {a.message}
                  </p>

                  {(a.date || a.venue) && (
                    <div className="flex flex-wrap gap-2">
                      {a.date && (
                        <div
                          className="flex items-center gap-1.5 px-3 py-1.5"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.10)",
                            borderRadius: "8px",
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <rect x="0.5" y="1.5" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.1" fill="none" opacity=".6" />
                            <path d="M3 0.5v2M8 0.5v2M0.5 4.5h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity=".6" />
                          </svg>
                          <span className="font-body text-white/50 text-xs">{a.date}</span>
                        </div>
                      )}
                      {a.venue && (
                        <div
                          className="flex items-center gap-1.5 px-3 py-1.5"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.10)",
                            borderRadius: "8px",
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M5.5 1C3.57 1 2 2.57 2 4.5c0 2.7 3.5 5.5 3.5 5.5S9 7.2 9 4.5C9 2.57 7.43 1 5.5 1z" stroke="currentColor" strokeWidth="1.1" fill="none" opacity=".6" />
                            <circle cx="5.5" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.1" fill="none" opacity=".6" />
                          </svg>
                          <span className="font-body text-white/50 text-xs">{a.venue}</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Bottom spacer */}
        <div className="h-12" />
      </div>
    </section>
  );
}
