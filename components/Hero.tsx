"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { sermons } from "@/lib/sermons-data";
import HeroTour from "@/components/HeroTour";
import { getDailyPhoto } from "@/lib/church-photos";

const navLinks = [
  { label: "Community", href: "/community" },
  { label: "Give", href: "/give" },
  { label: "Ministry", href: "/ministry" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
  { label: "Sermons", href: "/sermons" },
  { label: "Projects", href: "/project" },
  { label: "Location", href: "/location" },
];

const dailyQuotes = [
  {
    quote:
      "Faith is not the absence of doubt — it is the decision to trust despite it.",
    ref: "Hebrews 11:1",
  },
  {
    quote:
      "You are not an afterthought in His story. You are the reason He entered the wilderness.",
    ref: "Genesis 16:13",
  },
  {
    quote:
      "The table is His. The food is His. The invitation is His. Your only job is to come.",
    ref: "Psalm 23:5",
  },
  {
    quote:
      "Open your hands. Whatever He wants to place here, receive. Whatever He wants to remove, release.",
    ref: "Matthew 6:10",
  },
  {
    quote:
      "You are not loved because of what you do. You are loved because of who you are — His.",
    ref: "Matthew 3:17",
  },
  {
    quote:
      "In this house, we believe there is a God worth talking to. We believe He is listening.",
    ref: "Joshua 24:15",
  },
  {
    quote:
      "To be seen by God is not a threat. It is the safest thing there is.",
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
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <section className="relative w-full h-svh min-h-150">
        <HeroTour />

        {/* Fixed background */}
        <motion.div
          className="page-bg"
          style={{ "--bg-url": `url(${bgUrl})` } as React.CSSProperties}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6 }}
        />

        {/* Dark gradient overlay — heavier on the left so text is always readable */}
        <div className="fixed inset-0 bg-linear-to-r from-black/75 via-black/40 to-black/10 z-10" />
        <div className="fixed inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/60 to-transparent z-10" />

        {/* Content */}
        <div className="public-content relative z-10 flex flex-col h-full px-6 py-6 sm:px-10 sm:py-8">
          {/* Navbar */}
          <motion.header
            className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:pb-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex items-center justify-between gap-4 lg:contents">
              <motion.div className="flex items-center gap-3" data-tour="brand">
                <Image
                  src="/logo.png"
                  alt="Assemblies Of God Church logo"
                  width={60}
                  height={60}
                  priority
                  // className="h-16 w-16 rounded-md object-contain border border-white/15 bg-white/5 p-1.5"
                />
                <p className="font-body text-white/70 text-xs tracking-widest uppercase">
                  Assemblies Of God Church
                </p>
              </motion.div>

              <div className="flex items-center gap-3 lg:order-last">
                <motion.a
                  href="/live-service"
                  data-tour="watch-live"
                  className="hidden sm:flex items-center justify-center gap-2 font-body text-xs font-semibold text-white tracking-wide border border-white/30 px-3 py-1.5 hover:bg-white hover:text-black transition-colors w-fit"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Watch Live
                </motion.a>

                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="lg:hidden inline-flex items-center justify-center rounded-none border border-white/20 px-3 py-2 text-white/80 hover:bg-white hover:text-black transition-colors"
                  aria-label="Toggle navigation menu"
                  aria-expanded={menuOpen}
                >
                  <span className="flex flex-col gap-1">
                    <span className="block h-px w-4 bg-current" />
                    <span className="block h-px w-4 bg-current" />
                    <span className="block h-px w-4 bg-current" />
                  </span>
                </button>
              </div>
            </div>

            <nav
              className="hidden lg:flex flex-wrap items-center gap-x-5 gap-y-2 lg:flex-1 lg:justify-center"
              data-tour="nav"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-body text-[11px] tracking-widest uppercase text-white/65 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <motion.a
              href="/live-service"
              data-tour="watch-live"
              className="sm:hidden flex items-center justify-center gap-2 font-body text-xs font-semibold text-white tracking-wide border border-white/30 px-3 py-1.5 hover:bg-white hover:text-black transition-colors w-fit"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Watch Live
            </motion.a>

            <motion.div
              className="lg:hidden overflow-hidden"
              initial={false}
              animate={
                menuOpen
                  ? { height: "auto", opacity: 1 }
                  : { height: 0, opacity: 0 }
              }
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="pt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-none border border-white/15 bg-black/35 px-3 py-2 font-body text-[11px] tracking-widest uppercase text-white/75 hover:bg-white hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.header>

          {/* Heading */}
          <motion.h1
            className="font-heading mt-4 sm:mt-6 text-white font-black leading-[0.92] tracking-tight"
            data-tour="heading"
            style={{ fontSize: "clamp(2.6rem, 10vw, 6rem)" }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Love God, love
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.68, duration: 0.8 }}
            >
              to serve.
            </motion.span>
          </motion.h1>

          {/* Latest Sermons */}
          <motion.div
            className="mt-16 sm:mt-20"
            data-tour="latest-sermons"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.12, delayChildren: 1.0 },
              },
            }}
          >
            <motion.div
              className="flex items-center justify-between mb-3"
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">
                Latest sermons
              </span>
              <Link
                href="/sermons"
                className="font-body text-white/50 text-[10px] tracking-widest uppercase hover:text-white transition-colors"
              >
                View all →
              </Link>
            </motion.div>
            {sermons.slice(0, 3).map((sermon) => (
              <motion.div
                key={sermon.slug}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: "easeOut" },
                  },
                }}
              >
                <Link
                  href={`/sermons/${sermon.slug}`}
                  className="group flex items-center justify-between gap-4 py-3 border-t border-white/15 hover:border-white/35 transition-colors"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-body text-white/85 font-semibold text-sm truncate group-hover:text-white transition-colors">
                      {sermon.title}
                    </span>
                    <span className="font-body text-white/35 text-xs italic">
                      {sermon.scripture} · {sermon.pastor}
                    </span>
                  </div>
                  <span className="text-white/25 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 shrink-0 text-sm">
                    →
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom bar: daily quote */}
          <motion.div
            className="flex items-end justify-end gap-8 w-full"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.08, delayChildren: 1.0 },
              },
            }}
          >
            {/* Daily quote */}
            <motion.div
              className="flex flex-col items-end gap-1.5 max-w-sm pb-1 border-t border-white/15 pt-3"
              data-tour="daily-quote"
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: "easeOut" },
                },
              }}
            >
              <span className="font-body text-white/30 text-[9px] tracking-widest uppercase">
                Word for today
              </span>
              <p className="font-heading text-white/80 font-black text-sm sm:text-base leading-snug italic text-right">
                &ldquo;{dailyQuote.quote}&rdquo;
              </p>
              <span className="font-body text-white/35 text-[10px] tracking-wide">
                — {dailyQuote.ref}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10  border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:px-10 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16 items-start">
            <div>
              <p className="font-body text-white/45 text-xs tracking-widest uppercase mb-4">
                Our Mission
              </p>
              <h2 className="font-heading text-white font-black text-3xl sm:text-4xl leading-tight tracking-tight max-w-md">
                Why we exist.
              </h2>
            </div>

            <div className="flex flex-col gap-5 max-w-2xl">
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
              <Link
                href="/mission"
                className="font-body text-white/80 text-sm tracking-wide underline underline-offset-4 hover:text-white transition-colors w-fit"
              >
                Read the full mission
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10  border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.jpeg"
              alt="Assemblies Of God Church logo"
              width={48}
              height={48}
              className="h-12 w-12 rounded-md object-contain border border-white/20 bg-white/5 p-1.5 shrink-0"
            />
            <div className="flex flex-col gap-1">
              <span className="font-body text-white text-sm tracking-widest uppercase">
                Assemblies Of God Church
              </span>
              <span className="font-body text-white/35 text-xs">
                Port Harcourt, Rivers State
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link
              href="/community"
              className="font-body text-white/45 text-xs tracking-widest uppercase hover:text-white transition-colors"
            >
              Community
            </Link>
            <Link
              href="/events"
              className="font-body text-white/45 text-xs tracking-widest uppercase hover:text-white transition-colors"
            >
              Events
            </Link>
            <Link
              href="/give"
              className="font-body text-white/45 text-xs tracking-widest uppercase hover:text-white transition-colors"
            >
              Give
            </Link>
            <Link
              href="/contact"
              className="font-body text-white/45 text-xs tracking-widest uppercase hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
