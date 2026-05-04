"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getDailyPhoto } from "@/lib/church-photos";
import AnnouncementModal from "@/components/AnnouncementModal";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Sermon {
  _id: string;
  title: string;
  pastor: string;
  scripture: string;
  date: string;
  slug?: string;
}

// ─── Service Times Component ──────────────────────────────────────────────────

interface SiteSettings {
  sundayHidden?: boolean;
  sundayTime1?: string;
  sundayTime2?: string;
  mondayHidden?: boolean;
  mondayTime?: string;
  tuesdayHidden?: boolean;
  tuesdayTime?: string;
  wednesdayHidden?: boolean;
  wednesdayTime?: string;
  thursdayHidden?: boolean;
  thursdayTime?: string;
  fridayHidden?: boolean;
  fridayTime?: string;
  saturdayHidden?: boolean;
  saturdayTime?: string;
}

function ServiceTimes() {
  const [serviceDays, setServiceDays] = useState<Array<{ day: string; time: string }>>([]);
  const [settings] = useLocalStorage<SiteSettings | null>("admin-site-settings", null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!settings) {
      // Default service times
      setServiceDays([
        { day: "Sunday", time: "8:00 AM & 10:30 AM" },
        { day: "Wednesday", time: "6:00 PM" },
        { day: "Friday", time: "6:00 AM Prayer" },
      ]);
      return;
    }

    const days: Array<{ day: string; time: string }> = [];

    // Sunday
    if (!settings.sundayHidden && (settings.sundayTime1 || settings.sundayTime2)) {
      const times = [settings.sundayTime1, settings.sundayTime2].filter(Boolean).join(" & ");
      days.push({ day: "Sunday", time: times });
    }

    // Monday
    if (!settings.mondayHidden && settings.mondayTime) {
      days.push({ day: "Monday", time: settings.mondayTime });
    }

    // Tuesday
    if (!settings.tuesdayHidden && settings.tuesdayTime) {
      days.push({ day: "Tuesday", time: settings.tuesdayTime });
    }

    // Wednesday
    if (!settings.wednesdayHidden && settings.wednesdayTime) {
      days.push({ day: "Wednesday", time: settings.wednesdayTime });
    }

    // Thursday
    if (!settings.thursdayHidden && settings.thursdayTime) {
      days.push({ day: "Thursday", time: settings.thursdayTime });
    }

    // Friday
    if (!settings.fridayHidden && settings.fridayTime) {
      days.push({ day: "Friday", time: settings.fridayTime });
    }

    // Saturday
    if (!settings.saturdayHidden && settings.saturdayTime) {
      days.push({ day: "Saturday", time: settings.saturdayTime });
    }

    setServiceDays(days);
  }, [settings, mounted]);

  if (!mounted || serviceDays.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {serviceDays.map((s) => (
        <div
          key={s.day}
          className="flex flex-col gap-0.5 px-4 py-3"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "12px",
          }}
        >
          <span className="font-body text-white font-semibold text-xs tracking-wide">
            {s.day}
          </span>
          <span className="font-body text-white/50 text-xs">
            {s.time}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Monthly Programs Component ───────────────────────────────────────────────

interface MonthlyProgram {
  id: string;
  day: string; // Dynamic day (e.g., "1st Sunday", "Last Friday", "15th")
  title: string;
  time: string;
  description: string;
  notes: string;
}

const defaultMonthlyPrograms: MonthlyProgram[] = [
  {
    id: "first-day-default",
    day: "1st Sunday",
    title: "First Sunday Communion Service",
    time: "10:30 AM",
    description: "Holy Communion service with special worship and prayer",
    notes: "All members are encouraged to attend",
  },
  {
    id: "last-day-default",
    day: "Last Day",
    title: "Thanksgiving Service",
    time: "6:00 PM",
    description: "Monthly thanksgiving and testimony service",
    notes: "Bring your testimonies to share",
  },
];

function MonthlyPrograms() {
  const [programs] = useLocalStorage<MonthlyProgram[]>("admin-monthly-programs", defaultMonthlyPrograms);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!programs || programs.length === 0) {
    return null;
  }

  return (
    <section className="relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12 sm:px-10 sm:py-16">
        <motion.p
          className="font-body text-white/40 text-xs tracking-widest uppercase mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Monthly Special Programs
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {programs.map((program, i) => (
            <motion.div
              key={program.id}
              className="relative overflow-hidden p-6"
              style={{
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="font-body text-[10px] tracking-widest uppercase px-3 py-1"
                  style={{
                    background: "rgba(139, 92, 246, 0.2)",
                    color: "rgb(196, 181, 253)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: "8px",
                  }}
                >
                  {program.day}
                </span>
                <span className="w-2.5 h-2.5 rounded-full shadow-lg bg-violet-400" />
              </div>

              {/* Title & Time */}
              <h3 className="font-heading text-white font-black text-xl sm:text-2xl leading-tight mb-2">
                {program.title}
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-white/50"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="font-body text-white/70 text-sm font-medium">
                  {program.time}
                </span>
              </div>

              {/* Description */}
              <p className="font-body text-white/70 text-sm leading-relaxed mb-4">
                {program.description}
              </p>

              {/* Notes */}
              {program.notes && (
                <div
                  className="inline-flex items-start gap-2 px-3 py-2"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "10px",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-white/40 mt-0.5 flex-shrink-0"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span className="font-body text-white/50 text-xs italic leading-relaxed">
                    {program.notes}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Quick Links & Daily Quotes ───────────────────────────────────────────────

const quickLinks = [
  { label: "Plan a visit", href: "/location" },
  { label: "Watch sermons", href: "/sermons" },
  { label: "Join a group", href: "/community" },
  { label: "Give online", href: "/give" },
];

const dailyQuotes = [
  {
    quote: "Faith is not the absence of doubt — it is the decision to trust despite it.",
    ref: "Hebrews 11:1",
  },
  {
    quote: "You are not an afterthought in His story. You are the reason He entered the wilderness.",
    ref: "Genesis 16:13",
  },
  {
    quote: "The table is His. The food is His. The invitation is His. Your only job is to come.",
    ref: "Psalm 23:5",
  },
  {
    quote: "Open your hands. Whatever He wants to place here, receive. Whatever He wants to remove, release.",
    ref: "Matthew 6:10",
  },
  {
    quote: "You are not loved because of what you do. You are loved because of who you are — His.",
    ref: "Matthew 3:17",
  },
  {
    quote: "In this house, we believe there is a God worth talking to. We believe He is listening.",
    ref: "Joshua 24:15",
  },
  {
    quote: "To be seen by God is not a threat. It is the safest thing there is.",
    ref: "Genesis 16:13",
  },
];

function getDailyQuote() {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return dailyQuotes[dayOfYear % dailyQuotes.length];
}

export default function Hero() {
  const bgUrl = getDailyPhoto(0);
  const dailyQuote = getDailyQuote();
  const [recentSermons, setRecentSermons] = useState<Sermon[]>([]);
  const [loadingSermons, setLoadingSermons] = useState(true);

  useEffect(() => {
    async function fetchSermons() {
      try {
        const response = await fetch("/api/v1/sermons?limit=3");
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setRecentSermons(result.data.data || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch sermons:", error);
      } finally {
        setLoadingSermons(false);
      }
    }
    fetchSermons();
  }, []);

  return (
    <>
      {/* ── Hero section ─────────────────────────────── */}
      <section className="relative w-full h-svh min-h-[600px]">
        {/* Background */}
        <motion.div
          className="page-bg"
          style={{ "--bg-url": `url(${bgUrl})` } as React.CSSProperties}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8 }}
        />
        <div className="fixed inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/15 z-10 pointer-events-none" />
        <div className="fixed inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none" />

        {/* Content */}
        <div className="public-content relative z-20 flex flex-col h-full px-6 py-6 sm:px-10 sm:py-8">

          {/* ── Hero headline ── */}
          <div className="flex-1 flex flex-col justify-center mt-6 sm:mt-0">
            {/* Location pill */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-5"
            >
              <span
                className="font-body text-white/60 text-xs tracking-widest uppercase px-4 py-1.5 inline-flex items-center gap-2"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: "24px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Assemblies of God · Choba 2 · Port Harcourt
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="font-heading text-white font-black leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(3rem, 11vw, 7rem)" }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                Love God,
              </motion.span>
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                love to serve.
              </motion.span>
            </motion.h1>

            {/* Welcome text */}
            <motion.p
              className="mt-4 font-heading text-white/50 font-black text-lg sm:text-xl tracking-tight"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.88, duration: 0.7 }}
            >
              You are welcome.
            </motion.p>

            {/* Tagline — glass pill */}
            <motion.div
              className="mt-6 self-start"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.7 }}
            >
              <p
                className="font-body text-white/75 text-sm sm:text-base leading-relaxed px-5 py-3"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "14px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
                  maxWidth: "26rem",
                }}
              >
                A Spirit-filled community rooted in faith, worship, and service — right here in Port Harcourt.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="mt-6 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <Link
                href="/location"
                className="font-body text-sm font-semibold text-black tracking-wide px-6 py-2.5 transition-all hover:opacity-90"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,1)",
                }}
              >
                Plan a visit
              </Link>
              <Link
                href="/live-service"
                className="font-body text-sm font-semibold text-white tracking-wide px-6 py-2.5 flex items-center gap-2 transition-all"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.10)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Watch Live
              </Link>
              <Link
                href="/give"
                className="font-body text-sm font-semibold text-white/70 tracking-wide px-6 py-2.5 transition-all hover:text-white"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                }}
              >
                Give
              </Link>
            </motion.div>
          </div>

          {/* ── Bottom: sermons + quote ── */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-2">

            {/* Latest sermons */}
            <motion.div
              className="w-full sm:max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.7 }}
            >
              <div
                className="px-4 py-4"
                style={{
                  background: "rgba(0,0,0,0.35)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">
                    Latest sermons
                  </span>
                  <Link
                    href="/sermons"
                    className="font-body text-white/50 text-[10px] tracking-widest uppercase hover:text-white transition-colors"
                  >
                    View all →
                  </Link>
                </div>
                {loadingSermons ? (
                  <div className="py-8 text-center">
                    <span className="font-body text-white/40 text-xs">Loading sermons...</span>
                  </div>
                ) : recentSermons.length === 0 ? (
                  <div className="py-8 text-center">
                    <span className="font-body text-white/40 text-xs">No sermons available</span>
                  </div>
                ) : (
                  recentSermons.map((sermon, i) => (
                    <motion.div
                      key={sermon.slug}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 + i * 0.1, duration: 0.5 }}
                    >
                      <Link
                        href={`/sermons/${sermon.slug || sermon._id}`}
                        className="group flex items-center justify-between gap-4 py-2.5 border-t border-white/10 hover:border-white/25 transition-colors"
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-body text-white/85 font-semibold text-xs truncate group-hover:text-white transition-colors">
                            {sermon.title}
                          </span>
                          <span className="font-body text-white/35 text-[10px] italic">
                            {sermon.scripture} · {sermon.pastor}
                          </span>
                        </div>
                        <span className="text-white/25 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 shrink-0 text-sm">
                          →
                        </span>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Daily quote */}
            <motion.div
              className="hidden sm:flex flex-col items-end gap-2 max-w-xs text-right"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.35, duration: 0.7 }}
            >
              <div
                className="px-5 py-4 flex flex-col items-end gap-2"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <span className="font-body text-white/35 text-[9px] tracking-widest uppercase">
                  Word for today
                </span>
                <p className="font-heading text-white/80 font-black text-sm leading-snug italic">
                  &ldquo;{dailyQuote.quote}&rdquo;
                </p>
                <span className="font-body text-white/40 text-[10px] tracking-wide">
                  — {dailyQuote.ref}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Quick links strip ─────────────────────────── */}
      <section className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 sm:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
              >
                <Link
                  href={item.href}
                  className="group flex items-center justify-center py-4 px-4 text-center transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "14px",
                  }}
                >
                  <span className="font-body text-white/65 text-xs tracking-widest uppercase group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission section ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:px-10 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Left */}
            <div>
              <motion.p
                className="font-body text-white/45 text-xs tracking-widest uppercase mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Our Mission
              </motion.p>
              <motion.h2
                className="font-heading text-white font-black text-3xl sm:text-4xl leading-tight tracking-tight max-w-md"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.7 }}
              >
                Why we exist.
              </motion.h2>

              {/* Stats */}
              <motion.div
                className="mt-8 grid grid-cols-2 gap-px"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.7 }}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "14px",
                  overflow: "hidden",
                }}
              >
                {[
                  { value: "18+", label: "Years serving" },
                  { value: "1,200+", label: "Members" },
                  { value: "40+", label: "Nations" },
                  { value: "∞", label: "Impact" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col gap-0.5 px-5 py-4"
                    style={{ background: "rgba(0,0,0,0.2)" }}
                  >
                    <span className="font-heading text-white font-black text-2xl leading-none">
                      {s.value}
                    </span>
                    <span className="font-body text-white/40 text-[10px] tracking-widest uppercase mt-0.5">
                      {s.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right */}
            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.7 }}
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                padding: "2rem",
              }}
            >
              <p className="font-body text-white/72 text-sm sm:text-base leading-relaxed">
                Our mission is not a programme — it&apos;s a calling. For over
                eighteen years, we have pursued one thing: to know God deeply,
                make Him known boldly, and serve humanity selflessly.
              </p>
              <p className="font-body text-white/52 text-sm sm:text-base leading-relaxed">
                Worship, community, and mission are the heartbeat of this house.
                We exist to help people encounter Christ, grow in faith, and
                live out the gospel in Port Harcourt and beyond.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/mission"
                  className="font-body text-white/80 text-sm tracking-wide underline underline-offset-4 hover:text-white transition-colors"
                >
                  Read the full mission →
                </Link>
                <Link
                  href="/community"
                  className="font-body text-white/50 text-sm tracking-wide underline underline-offset-4 hover:text-white transition-colors"
                >
                  Join a life group →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Service times strip ───────────────────────── */}
      <section className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="font-body text-white/40 text-xs tracking-widest uppercase mb-1">
                Join us in person
              </p>
              <p className="font-heading text-white font-black text-xl sm:text-2xl leading-tight">
                You are always welcome.
              </p>
            </div>
            <ServiceTimes />
          </div>
        </div>
      </section>

      {/* ── Monthly Programs ───────────────────────────── */}
      <MonthlyPrograms />

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Assemblies Of God Church logo"
                width={44}
                height={44}
              />
              <div className="flex flex-col gap-0.5">
                <span className="font-body text-white text-sm tracking-widest uppercase">
                  Assemblies Of God Church
                </span>
                <span className="font-body text-white/35 text-xs">
                  Choba 2 · Port Harcourt, Rivers State
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {["Community", "Events", "Sermons", "Projects", "Give", "Contact"].map((label) => (
                <Link
                  key={label}
                  href={`/${label.toLowerCase()}`}
                  className="font-body text-white/40 text-xs tracking-widests uppercase hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="font-body text-white/25 text-xs">
              © {new Date().getFullYear()} Assemblies Of God Church, Choba 2. All rights reserved.
            </span>
            <Link
              href="/admin-login"
              className="font-body text-white/20 text-xs hover:text-white/50 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>

      {/* ── Announcement Modal ────────────────────────── */}
      <AnnouncementModal />
    </>
  );
}
