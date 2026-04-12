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

          {/* Right — stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-px border border-white/15 bg-white/15">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex flex-col gap-0.5 px-4 py-4 bg-black/30 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.08, duration: 0.5 }}
              >
                <span className="font-heading text-white font-black text-2xl sm:text-3xl leading-none">
                  {s.value}
                </span>
                <span className="font-body text-white/45 text-[10px] tracking-widest uppercase mt-1">
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
          <div className="flex items-end justify-between mb-5 flex-wrap gap-4">
            <h2 className="font-body text-white/45 text-xs tracking-widest uppercase">
              Life groups
            </h2>
            {/* Tag filters */}
            <div className="flex flex-wrap gap-2">
              {tagFilters.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setActiveTag(tag);
                    setExpandedId(null);
                  }}
                  className={`font-body text-xs tracking-widest uppercase px-3 py-1 border transition-all duration-200 ${
                    activeTag === tag
                      ? `${tagActiveBg[tag]} border-transparent`
                      : "border-white/25 text-white/60 hover:border-white/50 hover:text-white bg-transparent"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Groups accordion */}
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
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="border-t border-white/20"
                >
                  <button
                    onClick={() => setExpandedId(isOpen ? null : group.id)}
                    className="w-full text-left py-4 sm:py-5 grid grid-cols-[1fr_auto] gap-4 items-start group"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-body text-white font-semibold text-sm sm:text-base group-hover:text-white/80 transition-colors">
                          {group.name}
                        </span>
                        <span
                          className={`font-body text-[10px] tracking-widest uppercase px-2 py-0.5 ${tagColors[group.tag]}`}
                        >
                          {group.tag}
                        </span>
                        {group.spots !== null && (
                          <span className="font-body text-[10px] tracking-widest uppercase px-2 py-0.5 bg-rose-500/20 text-rose-300">
                            {group.spots} spots left
                          </span>
                        )}
                      </div>
                      <span className="font-body text-white/45 text-xs">
                        {group.meets} · Led by {group.leader}
                      </span>
                    </div>
                    <span
                      className="font-body text-white/40 text-lg mt-0.5 group-hover:text-white/70 transition-all duration-300"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        display: "inline-block",
                      }}
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pr-8 flex flex-col gap-4 max-w-lg">
                          <p className="font-body text-white/70 text-sm leading-relaxed">
                            {group.bio}
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/40 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none text-xs px-5"
                            >
                              Join this group
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white/55 hover:text-white hover:bg-transparent font-body text-xs tracking-wide rounded-none px-0 underline underline-offset-4"
                            >
                              Learn more
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No groups in this category right now.
            </motion.p>
          )}
        </motion.div>

        {/* ── Testimonials ─────────────────────────────── */}
        <motion.div
          className="mt-16 sm:mt-20 border-t border-white/20 pt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <h2 className="font-body text-white/45 text-xs tracking-widest uppercase mb-8">
            Stories from our community
          </h2>

          <div className="relative max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-4"
              >
                <p className="font-heading text-white font-black text-xl sm:text-2xl leading-snug">
                  &quot;{testimonials[testimonialIdx].quote}&quot;
                </p>
                <div className="flex flex-col">
                  <span className="font-body text-white font-semibold text-sm">
                    {testimonials[testimonialIdx].name}
                  </span>
                  <span className="font-body text-white/45 text-xs tracking-wide">
                    {testimonials[testimonialIdx].role}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={prev}
                className="font-body text-white/50 text-sm tracking-wide hover:text-white transition-colors border border-white/25 hover:border-white/60 w-8 h-8 flex items-center justify-center"
              >
                ←
              </button>
              <button
                onClick={next}
                className="font-body text-white/50 text-sm tracking-wide hover:text-white transition-colors border border-white/25 hover:border-white/60 w-8 h-8 flex items-center justify-center"
              >
                →
              </button>
              <span className="font-body text-white/30 text-xs tracking-widest">
                {testimonialIdx + 1} / {testimonials.length}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── CTA ──────────────────────────────────────── */}
        <motion.div
          className="mt-16 sm:mt-20 border-t border-white/20 pt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <div className="flex flex-col gap-1">
            <p className="font-body text-white/45 text-xs tracking-widest uppercase">
              Ready to belong?
            </p>
            <p className="font-heading text-white font-black text-2xl sm:text-3xl leading-tight">
              Everyone has a seat
              <br />
              at this table.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              className="border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none px-7"
              asChild
            >
              <a href="/contact">Get in touch</a>
            </Button>
            <Button
              variant="ghost"
              className="text-white/55 hover:text-white hover:bg-transparent font-body tracking-wide rounded-none px-0 underline underline-offset-4"
              asChild
            >
              <a href="/events">See upcoming events</a>
            </Button>
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
