"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface Announcement {
  id: string;
  title: string;
  message: string;
  date?: string;
  venue?: string;
  active: boolean;
  createdAt: string;
}

const STORAGE_KEY = "dismissed-announcements";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const transition = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

export default function AnnouncementModal() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Swipe state
  const pointerStartY = useRef<number | null>(null);
  const pointerCurrentY = useRef<number | null>(null);

  // Auto-cycle timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/announcements");
        if (!res.ok) return;
        const all: Announcement[] = await res.json();

        const raw = localStorage.getItem(STORAGE_KEY);
        const dismissed: string[] = raw ? (JSON.parse(raw) as string[]) : [];

        const unseen = all.filter((a) => !dismissed.includes(a.id));
        if (unseen.length > 0) {
          setAnnouncements(unseen);
          setVisible(true);
        }
      } catch {
        // silently fail — modal is non-critical
      }
    }
    load();
  }, []);

  // Auto-cycle every 5 seconds when multiple announcements
  useEffect(() => {
    if (!visible || announcements.length <= 1) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % announcements.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [visible, announcements.length]);

  function resetTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (announcements.length <= 1) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % announcements.length);
    }, 5000);
  }

  function dismiss() {
    const raw = localStorage.getItem(STORAGE_KEY);
    const dismissed: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    const allIds = announcements.map((a) => a.id);
    const merged = Array.from(new Set([...dismissed, ...allIds]));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    setVisible(false);
  }

  function goTo(i: number) {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
    resetTimer();
  }

  function goNext() {
    setDirection(1);
    setIndex((i) => (i + 1) % announcements.length);
    resetTimer();
  }

  function goPrev() {
    setDirection(-1);
    setIndex((i) => (i - 1 + announcements.length) % announcements.length);
    resetTimer();
  }

  // Swipe-down gesture handlers
  function handlePointerDown(e: React.PointerEvent) {
    pointerStartY.current = e.clientY;
    pointerCurrentY.current = e.clientY;
  }

  function handlePointerMove(e: React.PointerEvent) {
    pointerCurrentY.current = e.clientY;
  }

  function handlePointerUp() {
    if (pointerStartY.current !== null && pointerCurrentY.current !== null) {
      const delta = pointerCurrentY.current - pointerStartY.current;
      if (delta > 80) {
        dismiss();
      }
    }
    pointerStartY.current = null;
    pointerCurrentY.current = null;
  }

  if (!visible || announcements.length === 0) return null;

  const current = announcements[index];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="announcement-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) dismiss();
          }}
        >
          {/* Card */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "20px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Drag handle hint */}
            <div className="flex justify-center pt-3 pb-0">
              <div className="w-8 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">
                Announcement
              </span>
              <button
                onClick={dismiss}
                aria-label="Close announcements"
                className="w-7 h-7 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Slide content */}
            <div className="relative overflow-hidden" style={{ minHeight: 160 }}>
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={current.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="px-5 pb-2"
                >
                  <h2 className="font-heading text-white font-black text-xl sm:text-2xl leading-tight tracking-tight mb-3">
                    {current.title}
                  </h2>
                  <p className="font-body text-white/70 text-sm leading-relaxed mb-4">
                    {current.message}
                  </p>

                  {(current.date || current.venue) && (
                    <div className="flex flex-wrap gap-3 mb-2">
                      {current.date && (
                        <div
                          className="flex items-center gap-1.5 px-3 py-1.5"
                          style={{
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: "8px",
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <rect x="0.5" y="1.5" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.1" fill="none" opacity=".6" />
                            <path d="M3 0.5v2M8 0.5v2M0.5 4.5h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity=".6" />
                          </svg>
                          <span className="font-body text-white/55 text-[11px]">{current.date}</span>
                        </div>
                      )}
                      {current.venue && (
                        <div
                          className="flex items-center gap-1.5 px-3 py-1.5"
                          style={{
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: "8px",
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M5.5 1C3.57 1 2 2.57 2 4.5c0 2.7 3.5 5.5 3.5 5.5S9 7.2 9 4.5C9 2.57 7.43 1 5.5 1z" stroke="currentColor" strokeWidth="1.1" fill="none" opacity=".6" />
                            <circle cx="5.5" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.1" fill="none" opacity=".6" />
                          </svg>
                          <span className="font-body text-white/55 text-[11px]">{current.venue}</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-white/10 mt-2">
              <Link
                href="/announcements"
                onClick={dismiss}
                className="font-body text-white/50 text-xs tracking-wide hover:text-white transition-colors"
              >
                View all announcements →
              </Link>

              {/* Dot indicators + nav arrows */}
              {announcements.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={goPrev}
                    aria-label="Previous announcement"
                    className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M7 1L3 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-1.5">
                    {announcements.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Go to announcement ${i + 1}`}
                        className="transition-all duration-300"
                        style={{
                          width: i === index ? 16 : 6,
                          height: 6,
                          borderRadius: 3,
                          background: i === index ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.25)",
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={goNext}
                    aria-label="Next announcement"
                    className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M3 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
