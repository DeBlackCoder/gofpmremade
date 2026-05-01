"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { getDailyPhoto } from "@/lib/church-photos";

// ─── Data ────────────────────────────────────────────────────────────────────

type GroupTag = "Men" | "Women" | "Youth" | "Families" | "All Ages";

interface Group {
  id: number;
  name: string;
  tag: GroupTag;
  meets: string;
  leader: string;
  bio: string;
  spots: number | null; // null = open
}

const groups: Group[] = [
  {
    id: 1,
    name: "Men of Valour",
    tag: "Men",
    meets: "Saturdays, 7:00 AM",
    leader: "Pastor James Okafor",
    bio: "A brotherhood of men committed to accountability, prayer, and growing in godly character. We meet weekly over breakfast for the Word and open conversation.",
    spots: null,
  },
  {
    id: 2,
    name: "Women of Grace",
    tag: "Women",
    meets: "Thursdays, 5:30 PM",
    leader: "Deaconess Ruth Amadi",
    bio: "A warm space for women to study Scripture, share life, and support one another through every season. All women are welcome, whether you're new to faith or have walked with God for decades.",
    spots: null,
  },
  {
    id: 3,
    name: "Youth Connect",
    tag: "Youth",
    meets: "Fridays, 6:00 PM",
    leader: "Bro. Emmanuel Dike",
    bio: "Built for teenagers aged 13–19. We do life together through worship, real talk, and community service. If you're young and want more than just Sunday, this is for you.",
    spots: 12,
  },
  {
    id: 4,
    name: "Family Life Circle",
    tag: "Families",
    meets: "2nd & 4th Sundays, 12:30 PM",
    leader: "Pastor & Mrs. Nwosu",
    bio: "For married couples and parents navigating faith and family. We discuss practical topics — raising children, healthy marriages, finances — all through a Biblical lens.",
    spots: 6,
  },
  {
    id: 5,
    name: "Young Adults Fellowship",
    tag: "Youth",
    meets: "Wednesdays, 7:00 PM",
    leader: "Sis. Chiamaka Eze",
    bio: "A community for 20s and 30s wrestling with faith, career, and identity. We study the Bible, eat together, and lean on each other as we figure life out.",
    spots: null,
  },
  {
    id: 6,
    name: "Senior Saints",
    tag: "All Ages",
    meets: "Tuesdays, 10:00 AM",
    leader: "Elder Thomas Briggs",
    bio: "A fellowship for our beloved elders — a place of prayer, wisdom-sharing, and mutual care. We also coordinate pastoral visits for members who cannot attend in person.",
    spots: null,
  },
];

const testimonials = [
  {
    id: 1,
    quote:
      "I walked in knowing no one. Within two months, I had a family. This church changed my life.",
    name: "Adaeze M.",
    role: "Member since 2022",
  },
  {
    id: 2,
    quote:
      "The Men of Valour group held me accountable when I had nothing holding me together. I owe those brothers so much.",
    name: "Chukwuemeka O.",
    role: "Men of Valour",
  },
  {
    id: 3,
    quote:
      "As a young professional new to Port Harcourt, the Young Adults Fellowship gave me a home away from home.",
    name: "Blessing A.",
    role: "Young Adults Fellowship",
  },
];

const stats = [
  { value: "1,200+", label: "Members" },
  { value: "6", label: "Life groups" },
  { value: "18", label: "Years serving PH" },
  { value: "40+", label: "Nations represented" },
];

const tagFilters: (GroupTag | "All")[] = [
  "All",
  "Men",
  "Women",
  "Youth",
  "Families",
  "All Ages",
];

const tagColors: Record<GroupTag, string> = {
  Men: "bg-sky-500/20 text-sky-200",
  Women: "bg-rose-500/20 text-rose-200",
  Youth: "bg-violet-500/20 text-violet-200",
  Families: "bg-amber-500/20 text-amber-200",
  "All Ages": "bg-teal-500/20 text-teal-200",
};

const tagActiveBg: Record<GroupTag | "All", string> = {
  All: "bg-white text-black",
  Men: "bg-sky-400 text-sky-950",
  Women: "bg-rose-400 text-rose-950",
  Youth: "bg-violet-400 text-violet-950",
  Families: "bg-amber-400 text-amber-950",
  "All Ages": "bg-teal-400 text-teal-950",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const bgUrl = getDailyPhoto(2);
  const [activeTag, setActiveTag] = useState<GroupTag | "All">("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const filtered =
    activeTag === "All" ? groups : groups.filter((g) => g.tag === activeTag);

  const prev = () =>
    setTestimonialIdx(
      (i) => (i - 1 + testimonials.length) % testimonials.length,
    );
  const next = () => setTestimonialIdx((i) => (i + 1) % testimonials.length);

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
            Better
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            together.
          </motion.span>
        </motion.h1>

        {/* Intro + Stats */}
        <motion.div
          className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
        >
          {/* Left — intro */}
          <p className="font-body text-white/70 text-sm sm:text-base leading-relaxed max-w-sm">
            We believe no one should do life alone. Whether you&apos;re new to
            faith or have walked with God for years, there&apos;s a place for
            you in our community — a group, a table, a home.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex flex-col gap-1 px-5 py-5 relative overflow-hidden group cursor-default"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.0 + i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="font-heading text-white font-black text-3xl sm:text-4xl leading-none relative z-10">
                  {s.value}
                </span>
                <span className="font-body text-white/50 text-[10px] tracking-widest uppercase mt-1 relative z-10">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Life Groups ───────────────────────────────── */}
        <motion.div
          className="mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
        >
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="font-body text-white/50 text-xs tracking-widest uppercase mb-1">
                Life groups
              </h2>
              <p className="font-body text-white/40 text-xs">
                {filtered.length} {filtered.length === 1 ? 'group' : 'groups'} available
              </p>
            </div>
            {/* Enhanced Tag filters */}
            <div className="flex flex-wrap gap-2">
              {tagFilters.map((tag) => (
                <motion.button
                  key={tag}
                  onClick={() => {
                    setActiveTag(tag);
                    setExpandedId(null);
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`font-body text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-300 ${
                    activeTag === tag
                      ? `${tagActiveBg[tag]} border-transparent shadow-lg`
                      : "border-white/30 text-white/70 hover:border-white/60 hover:text-white bg-white/5 hover:bg-white/10"
                  }`}
                  style={{ borderRadius: "8px" }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Enhanced Groups accordion */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((group, i) => {
                const isOpen = expandedId === group.id;
                return (
                  <motion.div
                    key={group.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="relative overflow-hidden"
                    style={{
                      background: isOpen 
                        ? "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)"
                        : "rgba(255,255,255,0.04)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: `1px solid ${isOpen ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.10)"}`,
                      borderRadius: "16px",
                      boxShadow: isOpen 
                        ? "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
                        : "0 2px 12px rgba(0,0,0,0.2)",
                    }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <button
                      onClick={() => setExpandedId(isOpen ? null : group.id)}
                      className="w-full text-left p-5 sm:p-6 grid grid-cols-[1fr_auto] gap-4 items-start group"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-body text-white font-bold text-base sm:text-lg group-hover:text-white/90 transition-colors">
                            {group.name}
                          </span>
                          <span
                            className={`font-body text-[10px] tracking-widest uppercase px-2.5 py-1 ${tagColors[group.tag]}`}
                            style={{ borderRadius: "6px" }}
                          >
                            {group.tag}
                          </span>
                          {group.spots !== null && (
                            <motion.span
                              className="font-body text-[10px] tracking-widest uppercase px-2.5 py-1 bg-rose-500/25 text-rose-200 border border-rose-400/30"
                              style={{ borderRadius: "6px" }}
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                            >
                              {group.spots} spots left
                            </motion.span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-white/50 text-xs">
                          <span className="font-body">{group.meets}</span>
                          <span className="text-white/30">·</span>
                          <span className="font-body">{group.leader}</span>
                        </div>
                      </div>
                      <motion.div
                        className="w-10 h-10 flex items-center justify-center border border-white/30 group-hover:border-white/60 transition-all duration-300"
                        style={{
                          borderRadius: "10px",
                          background: isOpen ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                        }}
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="font-body text-white/70 text-xl">
                          +
                        </span>
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden border-t border-white/10"
                        >
                          <div className="p-5 sm:p-6 pt-4 flex flex-col gap-5 bg-black/10">
                            <p className="font-body text-white/75 text-sm leading-relaxed max-w-2xl">
                              {group.bio}
                            </p>
                            <div className="flex gap-3 flex-wrap">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-white/50 text-white bg-white/10 hover:bg-white hover:text-black font-body font-semibold tracking-wide rounded-xl text-xs px-6 py-5 transition-all duration-300"
                                >
                                  Join this group
                                </Button>
                              </motion.div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/60 hover:text-white hover:bg-transparent font-body text-xs tracking-wide rounded-none px-0 underline underline-offset-4"
                              >
                                Learn more →
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
          </div>

          {filtered.length === 0 && (
            <motion.p
              className="font-body text-white/40 text-sm pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No groups in this category right now.
            </motion.p>
          )}
        </motion.div>

        {/* Enhanced Testimonials */}
        <motion.div
          className="mt-16 sm:mt-20 p-7 sm:p-10 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "24px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-body text-white/50 text-xs tracking-widest uppercase">
                Stories from our community
              </h2>
              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTestimonialIdx(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === testimonialIdx
                        ? "bg-white w-8"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="relative max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIdx}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-6"
                >
                  <div className="relative">
                    <svg
                      className="absolute -top-2 -left-2 text-white/10"
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="currentColor"
                    >
                      <path d="M10 20c0-5.523 4.477-10 10-10v10H10zm20 0c0-5.523 4.477-10 10-10v10H30z" />
                    </svg>
                    <p className="font-heading text-white font-black text-xl sm:text-2xl lg:text-3xl leading-snug pl-8">
                      {testimonials[testimonialIdx].quote}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pl-8">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center">
                      <span className="font-heading text-white font-bold text-lg">
                        {testimonials[testimonialIdx].name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body text-white font-bold text-sm">
                        {testimonials[testimonialIdx].name}
                      </span>
                      <span className="font-body text-white/50 text-xs tracking-wide">
                        {testimonials[testimonialIdx].role}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Enhanced Nav */}
              <div className="mt-8 flex items-center gap-3">
                <motion.button
                  onClick={prev}
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="font-body text-white/60 hover:text-white transition-colors border-2 border-white/30 hover:border-white/60 w-10 h-10 flex items-center justify-center"
                  style={{ borderRadius: "10px" }}
                >
                  ←
                </motion.button>
                <motion.button
                  onClick={next}
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                  className="font-body text-white/60 hover:text-white transition-colors border-2 border-white/30 hover:border-white/60 w-10 h-10 flex items-center justify-center"
                  style={{ borderRadius: "10px" }}
                >
                  →
                </motion.button>
                <span className="font-body text-white/40 text-xs tracking-widest ml-2">
                  {testimonialIdx + 1} of {testimonials.length}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced CTA */}
        <motion.div
          className="mt-16 sm:mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-8 p-8 sm:p-10 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "24px",
            boxShadow: "0 12px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          whileHover={{ scale: 1.01 }}
        >
          <motion.div
            className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <div className="flex flex-col gap-2 relative z-10">
            <p className="font-body text-white/50 text-xs tracking-widest uppercase">
              Ready to belong?
            </p>
            <p className="font-heading text-white font-black text-3xl sm:text-4xl leading-tight">
              Everyone has a seat
              <br />
              at this table.
            </p>
          </div>
          <div className="flex gap-4 flex-wrap relative z-10">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="border-2 border-white/60 text-white bg-white/10 hover:bg-white hover:text-black font-body font-semibold tracking-wide rounded-xl px-8 py-6 text-base transition-all duration-300 shadow-lg hover:shadow-xl"
                asChild
              >
                <a href="/contact">Get in touch</a>
              </Button>
            </motion.div>
            <Button
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-transparent font-body tracking-wide rounded-none px-0 underline underline-offset-4 text-base"
              asChild
            >
              <a href="/events">See upcoming events →</a>
            </Button>
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
