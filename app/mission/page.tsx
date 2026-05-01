"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getDailyPhoto } from "@/lib/church-photos";

// ─── Data ────────────────────────────────────────────────────────────────────

const pillars = [
  {
    icon: "✦",
    title: "Worship",
    body: "Encountering the living God in spirit and truth — through prayer, praise, and the preaching of His Word every week.",
  },
  {
    icon: "◈",
    title: "Community",
    body: "Building authentic relationships that reflect Christ's love. No one walks alone. We carry each other's burdens and celebrate each other's breakthroughs.",
  },
  {
    icon: "◎",
    title: "Mission",
    body: "Taking the Gospel beyond our four walls — to neighbourhoods, campuses, hospitals, prisons, and nations.",
  },
];

const values = [
  {
    id: 1,
    name: "Scripture First",
    sub: "The Bible is our authority and compass",
    body: "Every decision we make — pastoral, financial, structural — is measured against the Word of God. We do not bend Scripture to culture; we let Scripture shape culture.",
  },
  {
    id: 2,
    name: "Holy Spirit Power",
    sub: "We believe in a Spirit-filled life",
    body: "We are Pentecostal in conviction and practice. We believe the gifts of the Spirit are active today and that every believer can live and serve in the Spirit's power.",
  },
  {
    id: 3,
    name: "Radical Generosity",
    sub: "We give our resources, time, and lives",
    body: "Generosity is not a budget line — it's a posture. We tithe, we give, and we serve because we have received freely and choose to give freely.",
  },
  {
    id: 4,
    name: "Integrity in All Things",
    sub: "Public and private character must align",
    body: "We hold ourselves and our leaders to a high standard not out of perfectionism, but because trust is the currency of ministry. What we do in private defines who we are in public.",
  },
  {
    id: 5,
    name: "Faithful to the Ends of the Earth",
    sub: "Missions is not optional",
    body: "Port Harcourt is not our final destination — it is our launching pad. We invest in local, national, and international mission efforts as an expression of our obedience to the Great Commission.",
  },
];

const timeline = [
  {
    year: "2006",
    heading: "Founded.",
    desc: "Pastor James Okafor and a congregation of 14 began meeting in a single room in Rumuola, Port Harcourt — with nothing but faith and a shared hunger for God.",
  },
  {
    year: "2011",
    heading: "First building.",
    desc: "After five years of house meetings and rented halls, the church dedicated its first permanent facility — debt-free — through the giving of the congregation.",
  },
  {
    year: "2018",
    heading: "1,000 members.",
    desc: "A landmark milestone and a reminder that growth is God's business. We expanded our pastoral team and launched six life groups.",
  },
  {
    year: "Today",
    heading: "1,200+ members, 40+ nations.",
    desc: "We are a church that looks like heaven — diverse, united, and still reaching. The mission continues.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function MissionPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const bgUrl = getDailyPhoto(9);

  return (
    <section className="relative w-full min-h-svh">
      {/* Fixed background */}
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
            Why we
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            exist.
          </motion.span>
        </motion.h1>

        {/* Intro + Scripture */}
        <motion.div
          className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
        >
          <p className="font-body text-white/70 text-sm sm:text-base leading-relaxed max-w-sm">
            Our mission is not a programme — it&apos;s a calling. For over
            eighteen years, we have pursued one thing: to know God deeply, make
            Him known boldly, and serve humanity selflessly — right here in Port
            Harcourt and beyond.
          </p>

          <div className="border-l-2 border-white/25 pl-5 flex flex-col gap-2">
            <p className="font-heading text-white/90 font-black text-lg sm:text-xl leading-snug">
              &quot;Go therefore and make disciples of all nations, baptising
              them in the name of the Father and of the Son and of the Holy
              Spirit.&quot;
            </p>
            <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">
              Matthew 28:19 — The Great Commission
            </span>
          </div>
        </motion.div>

        {/* ── Pillars ───────────────────────────────────── */}
        <motion.div
          className="mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          <p className="font-body text-white/45 text-xs tracking-widest uppercase mb-5">
            Our three pillars
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
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
                transition={{ delay: 1.1 + i * 0.08, duration: 0.5 }}
              >
                <span className="text-xl leading-none text-white/80">
                  {p.icon}
                </span>
                <span className="font-heading text-white font-black text-lg leading-tight">
                  {p.title}
                </span>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Values + Timeline ─────────────────────────── */}
        <motion.div
          className="mt-12 sm:mt-16 border-t border-white/20 pt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          {/* Values accordion */}
          <div>
            <p className="font-body text-white/45 text-xs tracking-widest uppercase mb-5">
              Core values
            </p>

            {values.map((v) => {
              const isOpen = expandedId === v.id;
              return (
                <div key={v.id} className="border-t border-white/20">
                  <button
                    onClick={() => setExpandedId(isOpen ? null : v.id)}
                    className="w-full text-left py-4 sm:py-5 grid grid-cols-[1fr_auto] gap-4 items-start group"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-body text-white font-semibold text-sm sm:text-base group-hover:text-white/80 transition-colors">
                        {v.name}
                      </span>
                      <span className="font-body text-white/40 text-xs">
                        {v.sub}
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
                        <div className="pb-6 pr-8">
                          <p className="font-body text-white/65 text-sm leading-relaxed max-w-md">
                            {v.body}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Timeline */}
          <div>
            <p className="font-body text-white/45 text-xs tracking-widest uppercase mb-5">
              Our story
            </p>

            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-0 top-2 bottom-2 w-px bg-white/20" />

              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  className="relative pl-5 pb-7 last:pb-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.12, duration: 0.5 }}
                >
                  {/* Dot */}
                  <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-white/50" />

                  <p className="font-body text-white/35 text-[10px] tracking-widest uppercase mb-1">
                    {item.year}
                  </p>
                  <p className="font-body text-white/70 text-sm leading-relaxed">
                    <strong className="text-white font-semibold">
                      {item.heading}
                    </strong>{" "}
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
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
              Be part of the mission
            </p>
            <p className="font-heading text-white font-black text-2xl sm:text-3xl leading-tight">
              This story is still
              <br />
              being written.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              className="border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none px-7"
              asChild
            >
              <a href="/contact">Join us this Sunday</a>
            </Button>
            <Button
              variant="ghost"
              className="text-white/55 hover:text-white hover:bg-transparent font-body tracking-wide rounded-none px-0 underline underline-offset-4"
              asChild
            >
              <a href="/community">Explore life groups</a>
            </Button>
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
