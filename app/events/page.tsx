"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const churchPhotos = [
  "photo-1438032005730-c779502df39b",
  "photo-1529070538774-1843cb3265df",
  "photo-1543968996-ee822b8176ba",
  "photo-1508739773434-c26b3d09e071",
  "photo-1519817914152-22d216bb9170",
  "photo-1514896856000-91cb6de818e0",
  "photo-1555396273-367ea4eb4db5",
  "photo-1502672260266-1c1ef2d93688",
  "photo-1600585154340-be6161a56a0c",
  "photo-1507003211169-0a1dd7228f2d",
];

function getDailyPhoto(): string {
  const now = new Date();
  const dayOfYear =
    Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000) + 6;
  return `https://images.unsplash.com/${churchPhotos[dayOfYear % churchPhotos.length]}?w=1800&q=90`;
}

type Category = "All" | "Worship" | "Community" | "Youth" | "Prayer" | "Special";

interface Event {
  id: number;
  title: string;
  date: string;        // e.g. "2025-04-13"
  day: string;         // "Sun"
  dayNum: string;      // "13"
  month: string;       // "APR"
  time: string;
  location: string;
  category: Category;
  description: string;
  featured?: boolean;
}

const events: Event[] = [
  {
    id: 1,
    title: "Easter Sunday Celebration",
    date: "2025-04-13",
    day: "Sun", dayNum: "13", month: "APR",
    time: "8:00 AM & 10:30 AM",
    location: "Main Sanctuary",
    category: "Worship",
    description: "Join us for a joyful celebration of the resurrection. Two services with live worship, a special message, and family activities for children.",
    featured: true,
  },
  {
    id: 2,
    title: "Men's Prayer Breakfast",
    date: "2025-04-19",
    day: "Sat", dayNum: "19", month: "APR",
    time: "7:00 AM",
    location: "Fellowship Hall",
    category: "Prayer",
    description: "Men of all ages gather for a morning of prayer, fellowship, and a shared breakfast. Come with an open heart.",
  },
  {
    id: 3,
    title: "Youth Night: Ignite",
    date: "2025-04-25",
    day: "Fri", dayNum: "25", month: "APR",
    time: "6:00 PM",
    location: "Youth Centre",
    category: "Youth",
    description: "A high-energy evening for teenagers featuring worship, games, and a powerful message designed just for the next generation.",
  },
  {
    id: 4,
    title: "Community Outreach Day",
    date: "2025-05-03",
    day: "Sat", dayNum: "03", month: "MAY",
    time: "9:00 AM – 2:00 PM",
    location: "Church Grounds & Neighbourhood",
    category: "Community",
    description: "We take the love of God into our streets. Food drives, free medical checks, and neighbourhood clean-up. Everyone is welcome to serve.",
  },
  {
    id: 5,
    title: "Wednesday Bible Study",
    date: "2025-05-07",
    day: "Wed", dayNum: "07", month: "MAY",
    time: "6:00 PM",
    location: "Chapel",
    category: "Prayer",
    description: "An in-depth study of the Book of Romans. Open to all members and visitors seeking to grow in the Word.",
  },
  {
    id: 6,
    title: "Women's Conference: Crowned",
    date: "2025-05-16",
    day: "Fri", dayNum: "16", month: "MAY",
    time: "10:00 AM",
    location: "Main Sanctuary",
    category: "Special",
    description: "A two-day conference celebrating women of faith. Featuring keynote speakers, breakout sessions, and an evening of worship and praise.",
    featured: true,
  },
  {
    id: 7,
    title: "Children's Ministry Funday",
    date: "2025-05-24",
    day: "Sat", dayNum: "24", month: "MAY",
    time: "11:00 AM",
    location: "Church Grounds",
    category: "Youth",
    description: "An afternoon of fun, games, and Bible-based activities for children aged 4–12. Bring the whole family!",
  },
  {
    id: 8,
    title: "New Members' Welcome Sunday",
    date: "2025-06-01",
    day: "Sun", dayNum: "01", month: "JUN",
    time: "10:30 AM",
    location: "Main Sanctuary",
    category: "Community",
    description: "We formally welcome new members into our church family. If you've been attending and feel ready to commit, this Sunday is for you.",
  },
];

const categories: Category[] = ["All", "Worship", "Community", "Youth", "Prayer", "Special"];

const categoryColors: Record<Category, string> = {
  All:       "bg-white/15 text-white",
  Worship:   "bg-amber-500/20 text-amber-200",
  Community: "bg-teal-500/20 text-teal-200",
  Youth:     "bg-violet-500/20 text-violet-200",
  Prayer:    "bg-sky-500/20 text-sky-200",
  Special:   "bg-rose-500/20 text-rose-200",
};

const categoryActiveBg: Record<Category, string> = {
  All:       "bg-white text-black",
  Worship:   "bg-amber-400 text-amber-950",
  Community: "bg-teal-400 text-teal-950",
  Youth:     "bg-violet-400 text-violet-950",
  Prayer:    "bg-sky-400 text-sky-950",
  Special:   "bg-rose-400 text-rose-950",
};

export default function EventsPage() {
  const bgUrl = getDailyPhoto();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = activeCategory === "All"
    ? events
    : events.filter((e) => e.category === activeCategory);

  return (
    <section className="relative w-full min-h-svh overflow-hidden">

      {/* Background */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6 }}
      >
        <Image src={bgUrl} alt="Church" fill priority quality={90} className="object-cover object-center" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-svh px-6 py-6 sm:px-10 sm:py-8">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <motion.p
            className="font-body text-white/70 text-xs tracking-widest uppercase"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          >
            Assemblies Of God Church
          </motion.p>
          <motion.a
            href="/"
            className="font-body text-white/60 text-xs tracking-wide hover:text-white transition-colors"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          >
            ← Return home
          </motion.a>
        </div>

        {/* Heading */}
        <motion.h1
          className="font-heading mt-4 sm:mt-6 text-white font-black leading-[0.92] tracking-tight"
          style={{ fontSize: "clamp(2.6rem, 10vw, 6rem)" }}
        >
          <motion.span className="block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
            Upcoming
          </motion.span>
          <motion.span className="block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68, duration: 0.8 }}>
            events.
          </motion.span>
        </motion.h1>

        {/* Category filters */}
        <motion.div
          className="mt-8 sm:mt-10 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setExpandedId(null); }}
              className={`font-body text-xs tracking-widest uppercase px-4 py-1.5 border transition-all duration-200 ${
                activeCategory === cat
                  ? `${categoryActiveBg[cat]} border-transparent`
                  : "border-white/25 text-white/70 hover:border-white/50 hover:text-white bg-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Events list */}
        <motion.div
          className="mt-8 flex flex-col gap-0 flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((event, i) => {
              const isOpen = expandedId === event.id;
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className="border-t border-white/20"
                >
                  <button
                    onClick={() => setExpandedId(isOpen ? null : event.id)}
                    className="w-full text-left py-4 sm:py-5 grid grid-cols-[64px_1fr_auto] sm:grid-cols-[80px_1fr_auto] gap-4 items-start group"
                  >
                    {/* Date block */}
                    <div className="flex flex-col items-center leading-none pt-0.5">
                      <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">{event.month}</span>
                      <span className="font-heading text-white font-black text-3xl sm:text-4xl leading-none mt-0.5">{event.dayNum}</span>
                      <span className="font-body text-white/40 text-[10px] tracking-widest uppercase mt-0.5">{event.day}</span>
                    </div>

                    {/* Title + meta */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-body text-white font-semibold text-sm sm:text-base group-hover:text-white/80 transition-colors">
                          {event.title}
                        </span>
                        {event.featured && (
                          <span className="font-body text-[10px] tracking-widest uppercase px-2 py-0.5 bg-white/15 text-white/80 border border-white/20">
                            Featured
                          </span>
                        )}
                        <span className={`font-body text-[10px] tracking-widest uppercase px-2 py-0.5 ${categoryColors[event.category]}`}>
                          {event.category}
                        </span>
                      </div>
                      <span className="font-body text-white/50 text-xs">
                        {event.time} · {event.location}
                      </span>
                    </div>

                    {/* Expand icon */}
                    <span
                      className="font-body text-white/40 text-lg mt-0.5 group-hover:text-white/70 transition-all duration-300"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}
                    >
                      +
                    </span>
                  </button>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pl-[80px] sm:pl-[96px] pr-8 flex flex-col gap-4">
                          <p className="font-body text-white/70 text-sm leading-relaxed max-w-lg">
                            {event.description}
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/40 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none text-xs px-5"
                            >
                              Register
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white/55 hover:text-white hover:bg-transparent font-body text-xs tracking-wide rounded-none px-0 underline underline-offset-4"
                            >
                              Add to calendar
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.p
              className="font-body text-white/40 text-sm pt-8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              No events in this category right now. Check back soon.
            </motion.p>
          )}
        </motion.div>

        {/* Bottom spacer */}
        <div className="h-12" />

      </div>
    </section>
  );
}