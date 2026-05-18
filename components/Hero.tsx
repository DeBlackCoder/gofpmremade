"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getDailyPhoto, getDailyScripture } from "@/lib/church-photos";
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
          className="flex items-center gap-3 px-4 py-2.5"
          style={{
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "999px",
          }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: "#42a7c0" }}
          />
          <span className="font-body text-white font-semibold text-xs tracking-wide">
            {s.day}
          </span>
          <span
            className="font-body text-xs"
            style={{ color: "#3ca7c2" }}
          >
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
          Monthly Gatherings
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {programs.map((program, i) => (
            <motion.div
              key={program.id}
              className="relative overflow-hidden"
              style={{
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* Gold left border stripe */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ background: "#42a7c0", borderRadius: "20px 0 0 20px" }}
              />

              <div className="pl-6 pr-6 py-6">
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-body text-[10px] tracking-widest uppercase px-3 py-1"
                    style={{
                      background: "rgb(187, 187, 187)",
                      color: "#141414",
                      border: "1px solid rgba(212,175,55,0.3)",
                      borderRadius: "8px",
                    }}
                  >
                    {program.day}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full shadow-lg"
                    style={{ background: "#42a7c0" }}
                  />
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
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Quick Links & Daily Quotes ───────────────────────────────────────────────

const quickLinks = [
  { label: "Visit Us", href: "/location" },
  { label: "Messages", href: "/sermons" },
  { label: "Life Groups", href: "/community" },
  { label: "Give & Support", href: "/give" },
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
  const scripture = getDailyScripture(0);
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
      <section className="relative w-full h-svh min-h-[600px] sm:min-h-[700px] overflow-visible">
        {/* Background image */}
        <img
          src={bgUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ zIndex: 0 }}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(120deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.70) 100%)", zIndex: 1 }}
        />

        {/* Content — centered single column */}
        <div
          className="public-content relative h-full flex flex-col items-center justify-center gap-4 sm:gap-8 px-6 pt-20 pb-10 sm:pt-0 sm:px-10 sm:pb-12 text-center"
          style={{ zIndex: 2 }}
        >

          {/* ── Headline + CTAs ── */}
          <div className="flex flex-col items-center w-full max-w-3xl">

            

            {/* Headline with gold left border accent */}
            <div className="flex gap-5 sm:gap-5 items-stretch mb-6 justify-center flex-wrap sm:flex-nowrap">
              <motion.div
                className="hidden sm:block w-1 rounded-full flex-shrink-0"
                style={{ background: "#42a7c0" }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.h1
                className="font-heading text-white font-black leading-[0.88] tracking-tight"
                style={{ fontSize: "clamp(2.2rem, 7vw, 6.5rem)" }}
              >
                <motion.span
                  className="block"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  Love God,
                </motion.span>
                <motion.span
                  className="block"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  Serve People.
                </motion.span>
              </motion.h1>
            </div>

            {/* Welcome + tagline */}
            <motion.p
              className="font-heading text-white/50 font-black text-lg sm:text-xl tracking-tight mb-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.88, duration: 0.7 }}
            >
              Every soul is welcome here.
            </motion.p>

            <motion.p
              className="font-body text-white/60 text-sm sm:text-base leading-relaxed mb-8 max-w-md"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.7 }}
            >
              A Spirit-filled family rooted in the Word, alive in worship, and committed to transforming lives — right here in Port Harcourt.
            </motion.p>

            {/* Scripture */}
            <motion.div
              className="mb-8 flex flex-col items-center gap-1.5 max-w-md"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.7 }}
            >
              <p className="font-heading text-white font-black text-base sm:text-lg leading-snug italic drop-shadow-lg">
                &ldquo;{scripture.text}&rdquo;
              </p>
              <span
                className="font-body text-xs tracking-widest uppercase self-start px-3 py-1"
                style={{
                  background: "#42a7c0",
                  border: "1px solid rgba(231, 231, 228, 0.3)",
                  borderRadius: "20px",
                  color: "#0a0a0a", 
                }}
              >
                {scripture.verse}
              </span>
            </motion.div>

            {/* CTAs row */}
            <motion.div
              className="flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              {/* Plan a visit — solid white */}
              <Link
                href="/location"
                className="font-body text-sm font-semibold text-black tracking-wide px-6 py-2.5 transition-all hover:opacity-90"
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
                }}
              >
                Plan a Visit
              </Link>
              {/* Watch Live — red gradient */}
              <Link
                href="/live-service"
                className="font-body text-sm font-semibold text-white tracking-wide px-6 py-2.5 flex items-center gap-2 transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #557a92 0%, #b91c1c 100%)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 16px rgba(185,28,28,0.4)",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Watch Live
              </Link>
              {/* Give — ghost outline */}
              <Link
                href="/give"
                className="font-body text-sm font-semibold text-white/80 tracking-wide px-6 py-2.5 transition-all hover:text-white hover:border-white/40"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "12px",
                }}
              >
                Give
              </Link>
            </motion.div>
          </div>{/* end headline+CTAs */}

          {/* ── Sermons + quote row ── */}
          <div className="flex flex-col sm:flex-row gap-5 w-full max-w-3xl justify-center">
            <div
              className="flex flex-col overflow-hidden"
              style={{
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "20px",
                borderTop: "2px solid #42a7c0",
              }}
            >
              {/* Sermons section */}
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">
                    Recent Messages
                  </span>
                  <Link
                    href="/sermons"
                    className="font-body text-[10px] tracking-widest uppercase transition-colors hover:text-white"
                    style={{ color: "#42a7c0" }}
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
                    <span className="font-body text-white/40 text-xs">No messages yet</span>
                  </div>
                ) : (
                  recentSermons.map((sermon, i) => (
                    <motion.div
                      key={sermon.slug}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + i * 0.1, duration: 0.5 }}
                    >
                      <Link
                        href={`/sermons/${sermon.slug || sermon._id}`}
                        className="group flex items-center justify-between gap-4 py-3 border-t border-white/10 hover:border-white/20 transition-colors"
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-body text-white/85 font-semibold text-xs truncate group-hover:text-white transition-colors">
                            {sermon.title}
                          </span>
                          <span className="font-body text-white/35 text-[10px] italic">
                            {sermon.scripture} · {sermon.pastor}
                          </span>
                        </div>
                        <span
                          className="group-hover:translate-x-1 transition-all duration-300 shrink-0 text-sm"
                          style={{ color: "rgba(18, 64, 124, 0.5)" }}
                        >
                          →
                        </span>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Divider */}
              <div className="mx-5 h-px" style={{ background: "rgba(212,175,55,0.2)" }} />

              {/* Daily quote section */}
              <div className="px-5 py-5 flex flex-col gap-2">
                <span className="font-body text-[9px] tracking-widest uppercase" style={{ color: "#b7c0c2" }}>
                  Today&apos;s Word
                </span>
                <p className="font-heading text-white/80 font-black text-sm leading-snug italic">
                  &ldquo;{dailyQuote.quote}&rdquo;
                </p>
                <span className="font-body text-white/40 text-[10px] tracking-wide">
                  — {dailyQuote.ref}
                </span>
              </div>
            </div>
          </div>{/* end sermons+quote row */}
        </div>{/* end content */}
      </section>

      {/* ── Quick links strip ─────────────────────────── */}
      <section className="relative z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-8 sm:px-10">
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
                  className="group flex items-center gap-3 py-4 px-4 transition-all duration-300"
                  style={{
                    background: "rgba(0,0,0,0.45)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "20px",
                  }}
                >
                  <span
                    className="font-body text-[10px] font-bold flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full"
                    style={{
                      background: "rgba(250, 250, 250, 0.7)",
                      color: "#42a7c0",
                      border: "1px solid rgba(212,175,55,0.25)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
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
      <section className="relative z-10 border-t border-white/10 overflow-hidden">
        {/* Logo watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
          style={{ zIndex: 0 }}
        >
          <Image
            src="/gofpm.png"
            alt=""
            width={600}
            height={600}
            className="object-contain"
            style={{ opacity: 0.04, userSelect: "none" }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-16 sm:px-10 sm:py-20 flex flex-col items-center text-center" style={{ zIndex: 1 }}>

          {/* Section label */}
          <motion.p
            className="font-body text-white/45 text-xs tracking-widest uppercase mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Purpose
          </motion.p>
          <motion.h2
            className="font-heading text-white font-black text-3xl sm:text-4xl leading-tight tracking-tight mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Built on the Word.<br />Moved by the Spirit.
          </motion.h2>

          {/* Stats — horizontal row of 4 */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-0 mb-12 w-full"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {[
              { value: "18+", label: "Years serving" },
              { value: "1,200+", label: "Members" },
              { value: "40+", label: "Nations" },
              { value: "\u221e", label: "Impact" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col gap-1 px-6 py-5"
                style={{
                  borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Gold divider line above each stat */}
                <div
                  className="w-8 h-0.5 mb-3"
                  style={{ background: "#42a7c0" }}
                />
                <span className="font-heading text-white font-black text-3xl sm:text-4xl leading-none">
                  {s.value}
                </span>
                <span className="font-body text-white/40 text-[10px] tracking-widest uppercase mt-1">
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Mission text card */}
          <motion.div
            className="flex flex-col gap-5 w-full text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7 }}
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "20px",
              padding: "2rem",
            }}
          >
            <p className="font-body text-white/72 text-sm sm:text-base leading-relaxed">
              We are not just a congregation — we are a family on mission. For over
              eighteen years, AG Church Choba 2 has been a place where broken people
              find wholeness, seekers find truth, and believers grow deeper in Christ.
            </p>
            <p className="font-body text-white/52 text-sm sm:text-base leading-relaxed">
              Rooted in the Assemblies of God fellowship, we are passionate about
              Spirit-filled worship, sound biblical teaching, and reaching every
              soul in Port Harcourt and beyond with the love of Jesus.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/mission"
                className="font-body text-white/80 text-sm tracking-wide underline underline-offset-4 hover:text-white transition-colors"
              >
                Our full story →
              </Link>
              <Link
                href="/community"
                className="font-body text-white/50 text-sm tracking-wide underline underline-offset-4 hover:text-white transition-colors"
              >
                Find a life group →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Service times strip ───────────────────────── */}
      <section className="relative z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-10 sm:px-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <div>
              <p className="font-body text-white/40 text-xs tracking-widest uppercase mb-1">
                Gather with us
              </p>
              <p className="font-heading text-white font-black text-xl sm:text-2xl leading-tight">
                Come as you are. Leave transformed.
              </p>
            </div>
            <ServiceTimes />
          </div>
        </div>
      </section>

      {/* ── Monthly Programs ───────────────────────────── */}
      <MonthlyPrograms />

      

      {/* ── Announcement Modal ────────────────────────── */}
      <AnnouncementModal />
    </>
  );
}
