"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getDailyPhoto } from "@/lib/church-photos";

// ─── Types ───────────────────────────────────────────────────────────────────

type MinistryTag = "Worship" | "Outreach" | "Care" | "Children" | "Media";

interface Ministry {
  id: string;
  name: string;
  tag: MinistryTag;
  leader: string;
  meets: string;
  bio: string;
  spots: number | null;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const tagFilters: ("All" | MinistryTag)[] = [
  "All",
  "Worship",
  "Outreach",
  "Care",
  "Children",
  "Media",
];

const tagColors: Record<MinistryTag, string> = {
  Worship: "bg-violet-500/20 text-violet-200",
  Outreach: "bg-amber-500/20 text-amber-200",
  Care: "bg-rose-500/20 text-rose-200",
  Children: "bg-sky-500/20 text-sky-200",
  Media: "bg-teal-500/20 text-teal-200",
};

const tagActiveBg: Record<"All" | MinistryTag, string> = {
  All: "bg-white text-black",
  Worship: "bg-violet-400 text-violet-950",
  Outreach: "bg-amber-400 text-amber-950",
  Care: "bg-rose-400 text-rose-950",
  Children: "bg-sky-400 text-sky-950",
  Media: "bg-teal-400 text-teal-950",
};

const ministries: Ministry[] = [
  {
    id: "1",
    name: "Praise & Worship Team",
    tag: "Worship",
    leader: "Deacon Samuel Eze",
    meets: "Saturdays 4 PM",
    bio: "Our worship team leads the congregation into the presence of God every Sunday. We welcome singers, instrumentalists, and sound technicians who have a heart for worship.",
    spots: null,
  },
  {
    id: "2",
    name: "Street Evangelism",
    tag: "Outreach",
    leader: "Sis. Grace Nwosu",
    meets: "Last Saturday of the month",
    bio: "We take the Gospel to the streets, markets, and campuses of Port Harcourt. No experience needed — just a willing heart and a pair of comfortable shoes.",
    spots: 8,
  },
  {
    id: "3",
    name: "Pastoral Care Team",
    tag: "Care",
    leader: "Pastor Ruth Adeyemi",
    meets: "Wednesdays 5 PM",
    bio: "We visit the sick, support the grieving, and walk alongside members going through difficult seasons. Training is provided for all new volunteers.",
    spots: null,
  },
  {
    id: "4",
    name: "Children's Church",
    tag: "Children",
    leader: "Bro. Emeka Obi",
    meets: "Sundays 8 AM & 10:30 AM",
    bio: "We create a safe, fun, and Spirit-filled environment for children ages 3–12 to encounter God. Teachers, helpers, and creatives are all welcome.",
    spots: 5,
  },
  {
    id: "5",
    name: "Media & Tech Ministry",
    tag: "Media",
    leader: "Bro. Chidi Nkemdirim",
    meets: "Sundays from 7 AM",
    bio: "From live streaming to graphic design, our media team ensures every service reaches beyond the four walls of the church. Designers, videographers, and developers welcome.",
    spots: null,
  },
  {
    id: "6",
    name: "Prison Outreach",
    tag: "Outreach",
    leader: "Deacon Philip Okafor",
    meets: "Second Friday of the month",
    bio: "We minister to inmates at correctional facilities in Rivers State — bringing hope, the Word, and practical support to those who need it most.",
    spots: null,
  },
  {
    id: "7",
    name: "Prayer Intercessors",
    tag: "Worship",
    leader: "Sis. Blessing Amadi",
    meets: "Tuesdays & Fridays 6 AM",
    bio: "The engine room of the church. Our intercessors carry the church, the city, and the nations before the throne of God. All are welcome to join.",
    spots: null,
  },
];

const stats = [
  { value: "7", label: "Active ministries" },
  { value: "200+", label: "Volunteers" },
  { value: "52", label: "Sundays a year" },
  { value: "∞", label: "Room for you" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function MinistryPage() {
  const bgUrl = getDailyPhoto(5);
  const [activeTag, setActiveTag] = useState<"All" | MinistryTag>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    activeTag === "All"
      ? ministries
      : ministries.filter((m) => m.tag === activeTag);

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
      <div
        className="fixed inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div
        className="fixed inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
        style={{ zIndex: 0 }}
      />

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
            Serve with
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            purpose.
          </motion.span>
        </motion.h1>

        {/* Intro + Stats */}
        <motion.div
          className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
        >
          <p className="font-body text-white/70 text-sm sm:text-base leading-relaxed max-w-sm">
            Every believer is called to serve. Our ministries are the hands and
            feet of this church — each one a place where your gifts, your time,
            and your story become part of something greater than yourself.
          </p>

          <div
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-px"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex flex-col gap-0.5 px-4 py-4"
                style={{ background: "rgba(0,0,0,0.18)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
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

        {/* ── Ministries ────────────────────────────────── */}
        <motion.div
          className="mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
        >
          <div className="flex items-end justify-between mb-5 flex-wrap gap-4">
            <h2 className="font-body text-white/45 text-xs tracking-widest uppercase">
              Ministries
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

          {/* Accordion */}
          <AnimatePresence mode="popLayout">
            {filtered.map((ministry, i) => {
              const isOpen = expandedId === ministry.id;
              return (
                <motion.div
                  key={ministry.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="border-t border-white/20"
                >
                  <button
                    onClick={() => setExpandedId(isOpen ? null : ministry.id)}
                    className="w-full text-left py-4 sm:py-5 grid grid-cols-[1fr_auto] gap-4 items-start group"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-body text-white font-semibold text-sm sm:text-base group-hover:text-white/80 transition-colors">
                          {ministry.name}
                        </span>
                        <span
                          className={`font-body text-[10px] tracking-widest uppercase px-2 py-0.5 ${tagColors[ministry.tag]}`}
                        >
                          {ministry.tag}
                        </span>
                        {ministry.spots !== null && (
                          <span className="font-body text-[10px] tracking-widest uppercase px-2 py-0.5 bg-rose-500/20 text-rose-300">
                            {ministry.spots} spots left
                          </span>
                        )}
                      </div>
                      <span className="font-body text-white/45 text-xs">
                        {ministry.meets} · Led by {ministry.leader}
                      </span>
                    </div>
                    <span
                      className="font-body text-white/40 text-lg mt-0.5 group-hover:text-white/70 transition-all duration-300 inline-block"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
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
                            {ministry.bio}
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/40 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none text-xs px-5"
                            >
                              Volunteer
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
              No ministries in this category right now.
            </motion.p>
          )}
        </motion.div>

        {/* ── How to get involved ───────────────────────── */}
        <motion.div
          className="mt-16 sm:mt-20 border-t border-white/20 pt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <p className="font-body text-white/45 text-xs tracking-widest uppercase mb-8">
            How it works
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Pick a ministry",
                body: "Browse the list above and find one that matches your gifts, schedule, and passion. Not sure? Come speak with a pastor.",
              },
              {
                step: "02",
                title: "Attend an orientation",
                body: "Every ministry holds a brief welcome session for new volunteers. You'll meet the team, understand the vision, and ask any questions.",
              },
              {
                step: "03",
                title: "Start serving",
                body: "You'll be onboarded, scheduled, and supported. No one is thrown in the deep end — we grow together.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="flex flex-col gap-3 px-6 py-7"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "14px",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.28 + i * 0.08, duration: 0.5 }}
              >
                <span className="font-heading text-white/20 font-black text-4xl leading-none">
                  {item.step}
                </span>
                <span className="font-heading text-white font-black text-lg leading-tight">
                  {item.title}
                </span>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA ──────────────────────────────────────── */}
        <motion.div
          className="mt-16 sm:mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)",
            padding: "2rem",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <div className="flex flex-col gap-1">
            <p className="font-body text-white/45 text-xs tracking-widest uppercase">
              Ready to serve?
            </p>
            <p className="font-heading text-white font-black text-2xl sm:text-3xl leading-tight">
              Your gift was made
              <br />
              for a moment like this.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              className="border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none px-7"
              asChild
            >
              <a href="/contact">Talk to a pastor</a>
            </Button>
            <Button
              variant="ghost"
              className="text-white/55 hover:text-white hover:bg-transparent font-body tracking-wide rounded-none px-0 underline underline-offset-4"
              asChild
            >
              <a href="/community">See life groups</a>
            </Button>
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
