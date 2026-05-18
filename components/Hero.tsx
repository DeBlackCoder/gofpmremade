"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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

// ─── Service Times ────────────────────────────────────────────────────────────

function ServiceTimes() {
  const [serviceDays, setServiceDays] = useState<Array<{ day: string; time: string }>>([]);
  const [settings] = useLocalStorage<SiteSettings | null>("admin-site-settings", null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!settings) {
      setServiceDays([
        { day: "Sunday", time: "8:00 AM & 10:30 AM" },
        { day: "Wednesday", time: "6:00 PM" },
        { day: "Friday", time: "6:00 AM Prayer" },
      ]);
      return;
    }
    const days: Array<{ day: string; time: string }> = [];
    if (!settings.sundayHidden && (settings.sundayTime1 || settings.sundayTime2)) {
      days.push({ day: "Sunday", time: [settings.sundayTime1, settings.sundayTime2].filter(Boolean).join(" & ") });
    }
    if (!settings.mondayHidden && settings.mondayTime) days.push({ day: "Monday", time: settings.mondayTime });
    if (!settings.tuesdayHidden && settings.tuesdayTime) days.push({ day: "Tuesday", time: settings.tuesdayTime });
    if (!settings.wednesdayHidden && settings.wednesdayTime) days.push({ day: "Wednesday", time: settings.wednesdayTime });
    if (!settings.thursdayHidden && settings.thursdayTime) days.push({ day: "Thursday", time: settings.thursdayTime });
    if (!settings.fridayHidden && settings.fridayTime) days.push({ day: "Friday", time: settings.fridayTime });
    if (!settings.saturdayHidden && settings.saturdayTime) days.push({ day: "Saturday", time: settings.saturdayTime });
    setServiceDays(days);
  }, [settings, mounted]);

  if (!mounted || serviceDays.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2.5 justify-center">
      {serviceDays.map((s, i) => (
        <motion.div
          key={s.day}
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.45 }}
          className="flex items-center gap-2.5 px-4 py-2"
          style={{
            background: "linear-gradient(135deg, rgba(66,167,192,0.12) 0%, rgba(0,0,0,0.3) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(66,167,192,0.25)",
            borderRadius: "999px",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 16px rgba(0,0,0,0.25)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#42a7c0", boxShadow: "0 0 6px rgba(66,167,192,0.7)" }} />
          <span className="font-body text-white font-semibold text-xs tracking-wider">{s.day}</span>
          <span className="w-px h-3" style={{ background: "rgba(66,167,192,0.35)" }} />
          <span className="font-body text-xs font-medium" style={{ color: "#7dcfdf" }}>{s.time}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Monthly Programs ─────────────────────────────────────────────────────────

interface MonthlyProgram {
  id: string;
  day: string;
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
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !programs || programs.length === 0) return null;

  return (
    <section className="relative z-10 border-t border-white/8">
      <div className="max-w-5xl mx-auto px-6 py-14 sm:px-10 sm:py-20">
        <motion.div
          className="mb-10 flex flex-col gap-1"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-white/35 text-[10px] tracking-[0.2em] uppercase">Monthly Gatherings</p>
          <h2 className="font-heading text-white font-black text-2xl sm:text-3xl tracking-tight leading-tight">
            Recurring Services
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {programs.map((program, i) => (
            <motion.div
              key={program.id}
              className="relative overflow-hidden group"
              style={{
                background: "linear-gradient(145deg, rgba(18,28,36,0.85) 0%, rgba(8,14,20,0.9) 100%)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "24px",
                boxShadow: "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              whileHover={{ y: -3, transition: { duration: 0.25 } }}
            >
              {/* Animated teal glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(66,167,192,0.08) 0%, transparent 65%)" }}
              />

              {/* Top accent bar */}
              <div
                className="absolute top-0 left-6 right-6 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(66,167,192,0.6), transparent)" }}
              />

              <div className="p-6 sm:p-7">
                {/* Badge row */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="font-body text-[9px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-lg font-semibold"
                    style={{
                      background: "rgba(66,167,192,0.15)",
                      color: "#7dcfdf",
                      border: "1px solid rgba(66,167,192,0.2)",
                    }}
                  >
                    {program.day}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(66,167,192,0.1)",
                      border: "1px solid rgba(66,167,192,0.2)",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#42a7c0" strokeWidth="2.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                </div>

                <h3 className="font-heading text-white font-black text-xl sm:text-2xl leading-tight mb-2.5">
                  {program.title}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="font-body text-white/60 text-sm font-medium">{program.time}</span>
                </div>

                <p className="font-body text-white/60 text-sm leading-relaxed mb-5">{program.description}</p>

                {program.notes && (
                  <div
                    className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#42a7c0" strokeWidth="2" className="mt-0.5 flex-shrink-0">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <span className="font-body text-white/45 text-xs italic leading-relaxed">{program.notes}</span>
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

// ─── Static Data ──────────────────────────────────────────────────────────────

const quickLinks = [
  { label: "Visit Us", href: "/location", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
  { label: "Messages", href: "/sermons", icon: "M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.89L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" },
  { label: "Life Groups", href: "/community", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { label: "Give & Support", href: "/give", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
];

const dailyQuotes = [
  { quote: "Faith is not the absence of doubt — it is the decision to trust despite it.", ref: "Hebrews 11:1" },
  { quote: "You are not an afterthought in His story. You are the reason He entered the wilderness.", ref: "Genesis 16:13" },
  { quote: "The table is His. The food is His. The invitation is His. Your only job is to come.", ref: "Psalm 23:5" },
  { quote: "Open your hands. Whatever He wants to place here, receive. Whatever He wants to remove, release.", ref: "Matthew 6:10" },
  { quote: "You are not loved because of what you do. You are loved because of who you are — His.", ref: "Matthew 3:17" },
  { quote: "In this house, we believe there is a God worth talking to. We believe He is listening.", ref: "Joshua 24:15" },
  { quote: "To be seen by God is not a threat. It is the safest thing there is.", ref: "Genesis 16:13" },
];

function getDailyQuote() {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  return dailyQuotes[dayOfYear % dailyQuotes.length];
}

// ─── Main Hero ────────────────────────────────────────────────────────────────

export default function Hero() {
  const bgUrl = getDailyPhoto(0);
  const scripture = getDailyScripture(0);
  const dailyQuote = getDailyQuote();
  const [recentSermons, setRecentSermons] = useState<Sermon[]>([]);
  const [loadingSermons, setLoadingSermons] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  useEffect(() => {
    async function fetchSermons() {
      try {
        const response = await fetch("/api/v1/sermons?limit=3");
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) setRecentSermons(result.data.data || []);
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
      {/* ── Hero ──────────────────────────────────────── */}
      <section ref={heroRef} className="relative w-full h-svh min-h-[680px] overflow-hidden">

        {/* Parallax background */}
        <motion.div className="absolute inset-0 will-change-transform" style={{ y: bgY, scale: bgScale }}>
          <img
            src={bgUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        {/* Layered overlays for depth */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(150deg, rgba(4,12,20,0.9) 0%, rgba(5,15,25,0.6) 50%, rgba(8,18,28,0.78) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 15% 60%, rgba(66,167,192,0.06) 0%, transparent 55%)" }} />
        {/* Subtle noise grain */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40" style={{ background: "linear-gradient(to top, rgba(4,10,18,1), transparent)" }} />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 pt-20 pb-12 max-w-7xl mx-auto" style={{ zIndex: 2 }}>

          {/* Two-column layout on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-center w-full">

            {/* LEFT — Headline block */}
            <div className="flex flex-col">
              {/* Eyebrow */}
              <motion.div
                className="flex items-center gap-3 mb-7"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(66,167,192,0.12)", border: "1px solid rgba(66,167,192,0.28)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#42a7c0] animate-pulse" style={{ boxShadow: "0 0 6px rgba(66,167,192,0.8)" }} />
                  <span className="font-body text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: "#7dcfdf" }}>
                    God's Own Favour Prophetic Ministry
                  </span>
                </div>
              </motion.div>

              {/* Main headline */}
              <div className="flex gap-5 items-stretch mb-7">
                <motion.div
                  className="w-1 rounded-full flex-shrink-0 hidden sm:block"
                  style={{ background: "linear-gradient(180deg, #42a7c0 0%, rgba(66,167,192,0.15) 100%)" }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
                <div>
                  <motion.h1
                    className="font-heading text-white font-black leading-[0.87] tracking-tight"
                    style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)" }}
                  >
                    {["Love God,", "Serve People."].map((line, i) => (
                      <motion.span
                        key={line}
                        className="block"
                        initial={{ opacity: 0, x: -50, filter: "blur(8px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        transition={{ delay: 0.55 + i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {i === 1 ? (
                          <span style={{ WebkitTextStroke: "1px rgba(66,167,192,0.4)", color: "white" }}>{line}</span>
                        ) : line}
                      </motion.span>
                    ))}
                  </motion.h1>
                </div>
              </div>

              {/* Tagline */}
              <motion.p
                className="font-body text-white/55 text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.88, duration: 0.7 }}
              >
                A Spirit-filled family rooted in the Word, alive in worship, and committed to transforming lives — right here in Port Harcourt.
              </motion.p>

              {/* Scripture pill */}
              <motion.div
                className="mb-9 max-w-lg"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.7 }}
              >
                <div className="flex flex-col gap-2 p-4 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(66,167,192,0.08) 0%, rgba(0,0,0,0.25) 100%)",
                    border: "1px solid rgba(66,167,192,0.18)",
                    backdropFilter: "blur(12px)",
                  }}>
                  <p className="font-heading text-white font-black text-sm sm:text-base leading-snug italic">
                    &ldquo;{scripture.text}&rdquo;
                  </p>
                  <span className="font-body text-[10px] tracking-widest uppercase font-semibold self-start px-2.5 py-1 rounded-lg"
                    style={{ background: "#42a7c0", color: "#061018" }}>
                    {scripture.verse}
                  </span>
                </div>
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <Link href="/location"
                  className="font-body text-sm font-bold text-[#061018] tracking-wide px-7 py-3 transition-all hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    background: "linear-gradient(135deg, #5bcfe8 0%, #42a7c0 100%)",
                    borderRadius: "14px",
                    boxShadow: "0 6px 24px rgba(66,167,192,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}>
                  Plan a Visit
                </Link>

                <Link href="/live-service"
                  className="font-body text-sm font-bold text-white tracking-wide px-7 py-3 flex items-center gap-2.5 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    background: "linear-gradient(135deg, #c0392b 0%, #96281b 100%)",
                    borderRadius: "14px",
                    boxShadow: "0 6px 24px rgba(192,57,43,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Watch Live
                </Link>

                <Link href="/give"
                  className="font-body text-sm font-semibold text-white/70 tracking-wide px-7 py-3 transition-all hover:text-white hover:border-white/30 hover:-translate-y-0.5"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "14px",
                    backdropFilter: "blur(8px)",
                  }}>
                  Give
                </Link>
              </motion.div>
            </div>

            {/* RIGHT — Sermons + daily word card */}
            <motion.div
              className="w-full lg:max-w-sm hidden sm:flex flex-col overflow-hidden"
              initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: "linear-gradient(160deg, rgba(15,28,40,0.88) 0%, rgba(8,16,24,0.92) 100%)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "24px",
                boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
                borderTop: "1px solid rgba(66,167,192,0.35)",
              }}
            >
              {/* Sermons panel */}
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 rounded-full" style={{ background: "#42a7c0" }} />
                    <span className="font-body text-white/45 text-[10px] tracking-[0.18em] uppercase font-semibold">Recent Messages</span>
                  </div>
                  <Link href="/sermons"
                    className="font-body text-[10px] tracking-widest uppercase font-semibold transition-colors hover:text-white flex items-center gap-1"
                    style={{ color: "#42a7c0" }}>
                    All <span>→</span>
                  </Link>
                </div>

                {loadingSermons ? (
                  <div className="py-6 flex flex-col gap-3">
                    {[1, 2, 3].map(n => (
                      <div key={n} className="h-10 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
                    ))}
                  </div>
                ) : recentSermons.length === 0 ? (
                  <div className="py-8 text-center">
                    <span className="font-body text-white/30 text-xs">No messages yet</span>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {recentSermons.map((sermon, i) => (
                      <motion.div
                        key={sermon.slug || sermon._id}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + i * 0.1, duration: 0.5 }}
                      >
                        <Link
                          href={`/sermons/${sermon.slug || sermon._id}`}
                          className="group flex items-start justify-between gap-4 py-3.5 border-t border-white/[0.07] hover:border-white/15 transition-all duration-200"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="font-body text-white/80 font-semibold text-xs leading-snug block truncate group-hover:text-white transition-colors">
                              {sermon.title}
                            </span>
                            <span className="font-body text-white/30 text-[10px] mt-0.5 block">
                              {sermon.scripture} · {sermon.pastor}
                            </span>
                          </div>
                          <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 group-hover:translate-x-0.5 transition-all"
                            style={{ background: "rgba(66,167,192,0.12)", color: "#42a7c0", fontSize: "11px" }}>
                            →
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="mx-5 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(66,167,192,0.3), transparent)" }} />

              {/* Daily Word */}
              <div className="px-5 py-5">
                <span className="font-body text-[9px] tracking-[0.22em] uppercase font-semibold block mb-2.5" style={{ color: "#42a7c0" }}>
                  Today&apos;s Word
                </span>
                <p className="font-heading text-white/80 font-black text-sm leading-snug italic mb-2">
                  &ldquo;{dailyQuote.quote}&rdquo;
                </p>
                <span className="font-body text-white/35 text-[10px] tracking-wide">
                  — {dailyQuote.ref}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Quick Links ───────────────────────────────── */}
      <section className="relative z-10 border-t border-white/[0.07]">
        <div className="max-w-5xl mx-auto px-6 py-8 sm:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.08, duration: 0.5 }}
              >
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 py-4 px-4 transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(145deg, rgba(12,22,32,0.8) 0%, rgba(6,14,22,0.85) 100%)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "18px",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
                  }}
                >
                  <span
                    className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors group-hover:bg-[#42a7c0]/20"
                    style={{
                      background: "rgba(66,167,192,0.1)",
                      border: "1px solid rgba(66,167,192,0.2)",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#42a7c0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                  </span>
                  <span className="font-body text-white/55 text-xs tracking-wide font-medium group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission Section ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/[0.07] overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
          <Image src="/gofpm.png" alt="" width={560} height={560} className="object-contain" style={{ opacity: 0.03, userSelect: "none" }} />
        </div>

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(66,167,192,0.05) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />

        <div className="relative max-w-5xl mx-auto px-6 py-16 sm:px-10 sm:py-24 flex flex-col items-center text-center" style={{ zIndex: 1 }}>

          <motion.p
            className="font-body text-white/35 text-[10px] tracking-[0.22em] uppercase mb-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Purpose
          </motion.p>

          <motion.h2
            className="font-heading text-white font-black text-3xl sm:text-5xl leading-tight tracking-tight mb-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Built on the Word.<br />
            <span style={{ color: "#42a7c0" }}>Moved by the Spirit.</span>
          </motion.h2>

          <motion.p className="font-body text-white/40 text-sm mb-14 max-w-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            Eighteen years of lives changed in Port Harcourt and beyond.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-14 w-full max-w-2xl overflow-hidden rounded-2xl"
            style={{ background: "rgba(255,255,255,0.06)", boxShadow: "0 1px 0 rgba(255,255,255,0.07) inset" }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {[
              { value: "18+", label: "Years" },
              { value: "1,200+", label: "Members" },
              { value: "40+", label: "Nations" },
              { value: "∞", label: "Impact" },
            ].map((s, i) => (
              <div key={s.label} className="flex flex-col items-center gap-1 px-6 py-6 sm:py-8"
                style={{ background: "linear-gradient(145deg, rgba(12,22,32,0.85) 0%, rgba(6,14,22,0.9) 100%)" }}>
                <div className="w-5 h-0.5 mb-3" style={{ background: "rgba(66,167,192,0.6)" }} />
                <span className="font-heading text-white font-black text-3xl sm:text-4xl leading-none">{s.value}</span>
                <span className="font-body text-white/35 text-[9px] tracking-[0.2em] uppercase mt-1">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Mission card */}
          <motion.div
            className="w-full max-w-2xl text-left p-7 sm:p-9 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7 }}
            style={{
              background: "linear-gradient(145deg, rgba(12,22,32,0.85) 0%, rgba(6,14,22,0.9) 100%)",
              backdropFilter: "blur(28px)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "24px",
              boxShadow: "0 8px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <p className="font-body text-white/68 text-sm sm:text-base leading-[1.8] mb-4">
              We are not just a congregation — we are a family on mission. For over
              eighteen years, AG Church Choba 2 has been a place where broken people
              find wholeness, seekers find truth, and believers grow deeper in Christ.
            </p>
            <p className="font-body text-white/45 text-sm sm:text-base leading-[1.8] mb-6">
              Rooted in the Assemblies of God fellowship, we are passionate about
              Spirit-filled worship, sound biblical teaching, and reaching every
              soul in Port Harcourt and beyond with the love of Jesus.
            </p>
            <div className="flex flex-wrap gap-5 pt-1">
              <Link href="/mission" className="font-body text-sm font-semibold transition-colors"
                style={{ color: "#42a7c0" }}>
                Our full story →
              </Link>
              <Link href="/community" className="font-body text-white/40 text-sm font-semibold hover:text-white transition-colors">
                Find a life group →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Service Times ─────────────────────────────── */}
      <section className="relative z-10 border-t border-white/[0.07]">
        <div className="max-w-4xl mx-auto px-6 py-12 sm:px-10">
          <div className="flex flex-col items-center gap-7 text-center">
            <div>
              <p className="font-body text-white/35 text-[10px] tracking-[0.22em] uppercase mb-2">Gather with us</p>
              <h2 className="font-heading text-white font-black text-2xl sm:text-3xl leading-tight">
                Come as you are.<br className="sm:hidden" /> Leave transformed.
              </h2>
            </div>
            <ServiceTimes />
          </div>
        </div>
      </section>

      {/* ── Monthly Programs ──────────────────────────── */}
      <MonthlyPrograms />

      {/* ── Announcement Modal ────────────────────────── */}
      <AnnouncementModal />
    </>
  );
}