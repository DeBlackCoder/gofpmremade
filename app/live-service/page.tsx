"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/constants/config";

import { getDailyPhoto } from "@/lib/church-photos";

// ─── Service schedule ─────────────────────────────────────────────────────────
interface ServiceSlot {
  day: number; // 0 Sun … 6 Sat
  label: string;
  startH: number;
  startM: number;
  endH: number;
  endM: number;
  title: string;
  speaker: string;
  description: string;
  youtubeId: string; // live stream embed ID — swap for your real channel ID
}

const services: ServiceSlot[] = [
  {
    day: 0,
    label: "Sunday First Service",
    startH: 8,
    startM: 0,
    endH: 10,
    endM: 0,
    title: "Walking in His Promises",
    speaker: "Pastor James Okafor",
    description:
      "An uplifting Sunday service with praise, worship, and a message rooted in the faithfulness of God.",
    youtubeId: "jfKfPfyJRdk", // replace with your live-stream video/channel ID
  },
  {
    day: 0,
    label: "Sunday Second Service",
    startH: 10,
    startM: 30,
    endH: 12,
    endM: 30,
    title: "Walking in His Promises",
    speaker: "Pastor James Okafor",
    description:
      "A second airing of our Sunday morning service — same Word, same spirit.",
    youtubeId: "jfKfPfyJRdk",
  },
  {
    day: 3,
    label: "Wednesday Bible Study",
    startH: 18,
    startM: 0,
    endH: 19,
    endM: 30,
    title: "Romans Deep Dive — Chapter 8",
    speaker: "Deacon Philip Eze",
    description:
      "A detailed study of Romans 8 exploring life in the Spirit, suffering, and the hope of glory.",
    youtubeId: "jfKfPfyJRdk",
  },
];

// ─── Chat messages (demo) ─────────────────────────────────────────────────────
interface ChatMsg {
  id: number;
  name: string;
  text: string;
  ts: string;
}

const seedMessages: ChatMsg[] = [
  {
    id: 1,
    name: "Ada N.",
    text: "Praise God! Joining from Abuja 🙏",
    ts: "10:31",
  },
  {
    id: 2,
    name: "Emeka O.",
    text: "The worship today is powerful!",
    ts: "10:33",
  },
  {
    id: 3,
    name: "Grace B.",
    text: "This message is exactly what I needed.",
    ts: "10:36",
  },
  {
    id: 4,
    name: "Tunde A.",
    text: "Watching from London. God bless this church.",
    ts: "10:38",
  },
  {
    id: 5,
    name: "Blessing C.",
    text: "Romans 8:28 — amen and amen!",
    ts: "10:40",
  },
];

function getServiceStatus(slot: ServiceSlot): "live" | "upcoming" | "past" {
  const now = new Date();
  const day = now.getDay();
  const h = now.getHours();
  const m = now.getMinutes();
  const nowMins = h * 60 + m;
  const startMins = slot.startH * 60 + slot.startM;
  const endMins = slot.endH * 60 + slot.endM;

  if (day !== slot.day) return day < slot.day ? "upcoming" : "past";
  if (nowMins < startMins) return "upcoming";
  if (nowMins >= endMins) return "past";
  return "live";
}

function fmt(h: number, m: number) {
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${hh}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function LiveServicePage() {
  const bgUrl = getDailyPhoto(1);
  const now = useNow(60_000);

  // Load live settings from admin
  const [liveSettings, setLiveSettings] = useState<{
    isLive: boolean;
    streamUrl: string;
    title: string;
    description: string;
  } | null>(null);
  useEffect(() => {
    fetch(`${API_BASE_URL}/livestream/active`)
      .then((r) => r.json())
      .then((payload) => setLiveSettings(payload?.data?.data ?? null));
  }, []);

  // Pick active/next service
  const liveService =
    services.find((s) => getServiceStatus(s) === "live") ?? null;
  const upcomingService =
    services.find((s) => getServiceStatus(s) === "upcoming") ?? null;
  const featured = liveService ?? upcomingService ?? services[0];

  // Admin "isLive" overrides the schedule check
  const isLive = liveSettings?.isLive ?? !!liveService;

  // Use admin stream URL if set, otherwise fall back to the schedule's youtubeId
  const streamUrl =
    liveSettings?.streamUrl ||
    `https://www.youtube.com/embed/${featured.youtubeId}?autoplay=1&mute=0&rel=0`;
  const serviceTitle = liveSettings?.title || featured.title;
  const serviceDesc = liveSettings?.description || featured.description;

  // Chat state
  const [messages, setMessages] = useState<ChatMsg[]>(seedMessages);
  const [draft, setDraft] = useState("");
  const [chatName, setChatName] = useState("");
  const [nameSet, setNameSet] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  function sendMessage() {
    if (!draft.trim() || !chatName.trim()) return;
    const newMsg: ChatMsg = {
      id: Date.now(),
      name: chatName,
      text: draft.trim(),
      ts: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setDraft("");
    setTimeout(
      () =>
        chatRef.current?.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth",
        }),
      50,
    );
  }

  // Countdown to next service
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    function tick() {
      const target = upcomingService ?? services[0];
      const n = new Date();
      const next = new Date();
      const daysUntil = (target.day - n.getDay() + 7) % 7 || 7;
      next.setDate(n.getDate() + daysUntil);
      next.setHours(target.startH, target.startM, 0, 0);
      const diff = next.getTime() - n.getTime();
      if (diff <= 0) {
        setCountdown("Starting now");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [upcomingService]);

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
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <motion.p
            className="font-body text-white/70 text-xs tracking-widest uppercase"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Assemblies Of God Church
          </motion.p>
          <motion.a
            href="/"
            className="font-body text-white/60 text-xs tracking-wide hover:text-white transition-colors"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            ← Return home
          </motion.a>
        </div>

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
            {isLive ? "We're" : "Join us"}
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            {isLive ? "live." : "online."}
          </motion.span>
        </motion.h1>

        {/* Live badge / Countdown */}
        <motion.div
          className="mt-5 flex items-center gap-4 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          {isLive ? (
            <span className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-white border border-white/30 px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Live now
            </span>
          ) : (
            <span className="flex items-center gap-3 font-body text-xs tracking-widest uppercase text-white/60 border border-white/20 px-3 py-1.5">
              <span className="text-white/40">Next service in</span>
              <span className="text-white font-semibold tabular-nums">
                {countdown}
              </span>
            </span>
          )}
          <span className="font-body text-white/40 text-xs tracking-wide">
            {featured.label} · {fmt(featured.startH, featured.startM)} –{" "}
            {fmt(featured.endH, featured.endM)}
          </span>
        </motion.div>

        {/* ── Main grid ────────────────────────────────── */}
        <motion.div
          className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 flex-1"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          {/* Left — video + service info */}
          <div className="flex flex-col gap-6">
            {/* Video embed */}
            <div className="relative w-full aspect-video bg-black/50 border border-white/15 overflow-hidden">
              {isLive ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={streamUrl}
                  title="Live Service"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                /* Offline placeholder */
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                  <div className="w-14 h-14 border border-white/20 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-white/40"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <p className="font-body text-white/50 text-sm max-w-xs leading-relaxed">
                    The live stream will begin at{" "}
                    {fmt(featured.startH, featured.startM)}.<br />
                    Come back then to watch with us.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none text-xs px-5 mt-1"
                    onClick={() =>
                      window.open(
                        `https://www.youtube.com/watch?v=${featured.youtubeId}`,
                        "_blank",
                      )
                    }
                  >
                    Subscribe on YouTube
                  </Button>
                </div>
              )}
            </div>

            {/* Service info */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start border-t border-white/20 pt-5">
              <div className="flex flex-col gap-1">
                <h2 className="font-heading text-white font-black text-xl sm:text-2xl leading-tight">
                  {serviceTitle}
                </h2>
                <p className="font-body text-white/50 text-xs tracking-wide">
                  {featured.speaker}
                </p>
                <p className="font-body text-white/65 text-sm leading-relaxed mt-2 max-w-md">
                  {serviceDesc}
                </p>
              </div>
              <div className="flex gap-3 sm:flex-col">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/40 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none text-xs px-5"
                  onClick={() => {
                    const url = window.location.href;
                    if (navigator.share) {
                      navigator.share({ title: serviceTitle, url });
                    } else {
                      navigator.clipboard.writeText(url);
                    }
                  }}
                >
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/55 hover:text-white hover:bg-transparent font-body text-xs tracking-wide rounded-none px-0 underline underline-offset-4"
                  asChild
                >
                  <a href="/give">Give online</a>
                </Button>
              </div>
            </div>

            {/* Schedule strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px border border-white/15 bg-white/15 mt-2">
              {services.map((s) => {
                const status = getServiceStatus(s);
                return (
                  <div
                    key={s.label}
                    className={`flex flex-col gap-0.5 px-4 py-3 backdrop-blur-sm ${status === "live" ? "bg-white/15" : "bg-black/35"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">
                        {s.label}
                      </span>
                      {status === "live" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </div>
                    <span className="font-body text-white font-semibold text-xs">
                      {fmt(s.startH, s.startM)}
                    </span>
                    <span className="font-body text-white/40 text-[10px] capitalize tracking-wide mt-0.5">
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Live chat */}
          <div
            className="flex flex-col border border-white/15 backdrop-blur-md bg-white/5 overflow-hidden sticky top-4 self-start"
            style={{ maxHeight: "560px" }}
          >
            <div className="px-4 py-3 border-b border-white/15 flex items-center justify-between">
              <span className="font-body text-white/60 text-xs tracking-widest uppercase">
                Live chat
              </span>
              <span className="font-body text-white/35 text-[10px]">
                {messages.length} messages
              </span>
            </div>

            {/* Messages */}
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 scrollbar-none"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-0.5"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-body text-white font-semibold text-xs">
                        {msg.name}
                      </span>
                      <span className="font-body text-white/25 text-[10px]">
                        {msg.ts}
                      </span>
                    </div>
                    <p className="font-body text-white/70 text-xs leading-relaxed">
                      {msg.text}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input area */}
            <div className="border-t border-white/15 px-4 py-3 flex flex-col gap-2">
              {!nameSet ? (
                <div className="flex gap-2">
                  <input
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    placeholder="Your name"
                    className="flex-1 bg-white/10 border border-white/20 px-3 py-2 font-body text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-white/50"
                    onKeyDown={(e) =>
                      e.key === "Enter" && chatName.trim() && setNameSet(true)
                    }
                  />
                  <button
                    onClick={() => chatName.trim() && setNameSet(true)}
                    className="font-body text-xs tracking-widest uppercase px-3 py-2 border border-white/30 text-white/70 hover:bg-white hover:text-black transition-colors"
                  >
                    Join
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Say something…"
                    className="flex-1 bg-white/10 border border-white/20 px-3 py-2 font-body text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-white/50"
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    className="font-body text-xs tracking-widest uppercase px-3 py-2 border border-white/30 text-white/70 hover:bg-white hover:text-black transition-colors"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Prayer request strip ─────────────────────── */}
        <motion.div
          className="mt-10 border-t border-white/20 pt-7 flex flex-col sm:flex-row sm:items-end justify-between gap-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.6 }}
        >
          <div className="flex flex-col gap-1">
            <p className="font-body text-white/45 text-xs tracking-widest uppercase">
              Need prayer?
            </p>
            <p className="font-heading text-white font-black text-xl sm:text-2xl leading-tight">
              We believe in the
              <br className="hidden sm:block" /> power of prayer.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              className="border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none px-7"
              asChild
            >
              <a href="/contact">Submit a prayer request</a>
            </Button>
            <Button
              variant="ghost"
              className="text-white/55 hover:text-white hover:bg-transparent font-body tracking-wide rounded-none px-0 underline underline-offset-4"
              asChild
            >
              <a href="/events">Upcoming services</a>
            </Button>
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
