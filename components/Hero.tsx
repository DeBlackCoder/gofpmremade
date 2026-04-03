"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { sermons } from "@/lib/sermons-data";

const churchPhotos = [
  "photo-1438032005730-c779502df39b", // stained glass interior
  "photo-1529070538774-1843cb3265df", // brown church exterior
  "photo-1543968996-ee822b8176ba", // bell tower
  "photo-1508739773434-c26b3d09e071", // cross on hill
  "photo-1519817914152-22d216bb9170", // church at dusk
  "photo-1514896856000-91cb6de818e0", // church exterior
  "photo-1555396273-367ea4eb4db5", // church interior
  "photo-1502672260266-1c1ef2d93688", // church pews
  "photo-1600585154340-be6161a56a0c", // modern church
  "photo-1507003211169-0a1dd7228f2d", // chapel interior
];

function getDailyPhoto(): string {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const photo = churchPhotos[dayOfYear % churchPhotos.length];
  return `https://images.unsplash.com/${photo}?w=1800&q=90`;
}

const navLinks = [
  [{ label: "Welcome", href: "/" },       { label: "Community", href: "/community" }],
  [{ label: "Our Mission", href: "/mission" }, { label: "Ministry", href: "/ministry" }],
  [{ label: "Events", href: "/events" },  { label: "Contact", href: "/contact" }],
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
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dailyQuotes[dayOfYear % dailyQuotes.length];
}

export default function Hero() {
  const bgUrl = getDailyPhoto();
  const dailyQuote = getDailyQuote();
  return (
    <section className="relative w-full h-svh min-h-[600px] overflow-hidden">

      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6 }}
      >
        <Image
          src={bgUrl}
          alt="Church interior with stained glass windows"
          fill
          priority
          quality={90}
          className="object-cover object-center"
        />
      </motion.div>

      {/* Dark gradient overlay — heavier on the left so text is always readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
      {/* Bottom fade for nav area */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-6 py-6 sm:px-10 sm:py-8">

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
            href="/live-service"
            className="flex items-center gap-2 font-body text-xs font-semibold text-white tracking-wide border border-white/30 px-3 py-1.5 hover:bg-white hover:text-black transition-colors"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Watch Live
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
          className="mt-8 sm:mt-10"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 1.0 } } }}
        >
          <motion.div
            className="flex items-center justify-between mb-3"
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          >
            <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">Latest sermons</span>
            <Link href="/sermons" className="font-body text-white/50 text-[10px] tracking-widest uppercase hover:text-white transition-colors">
              View all →
            </Link>
          </motion.div>
          {sermons.slice(0, 3).map((sermon) => (
            <motion.div
              key={sermon.slug}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } }}
            >
              <Link
                href={`/sermons/${sermon.slug}`}
                className="group flex items-center justify-between gap-4 py-3 border-t border-white/15 hover:border-white/35 transition-colors"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-body text-white/85 font-semibold text-sm truncate group-hover:text-white transition-colors">
                    {sermon.title}
                  </span>
                  <span className="font-body text-white/35 text-xs italic">{sermon.scripture} · {sermon.pastor}</span>
                </div>
                <span className="text-white/25 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 text-sm">→</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom bar: nav left, daily quote right */}
        <motion.div
          className="flex items-end justify-between gap-8 w-full"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 1.0 } } }}
        >
          {/* Nav */}
          <motion.nav
            className="grid grid-cols-2 gap-x-8 sm:gap-x-20 flex-shrink-0"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          >
            {navLinks.map(([left, right], i) => (
              <div key={i} className="contents">
                <motion.a
                  href={left.href}
                  className="py-3 text-white/90 font-body font-semibold text-sm sm:text-[15px] tracking-wide border-t border-white/20 hover:text-white transition-colors"
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                >
                  {left.label}
                </motion.a>
                <motion.a
                  href={right.href}
                  className="py-3 text-white/90 font-body font-semibold text-sm sm:text-[15px] tracking-wide border-t border-white/20 hover:text-white transition-colors"
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                >
                  {right.label}
                </motion.a>
              </div>
            ))}
          </motion.nav>

          {/* Daily quote */}
          <motion.div
            className="hidden md:flex flex-col items-end gap-1.5 max-w-sm pb-1 border-t border-white/15 pt-3"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
          >
            <span className="font-body text-white/30 text-[9px] tracking-widest uppercase">Word for today</span>
            <p className="font-heading text-white/80 font-black text-sm sm:text-base leading-snug italic text-right">
              &ldquo;{dailyQuote.quote}&rdquo;
            </p>
            <span className="font-body text-white/35 text-[10px] tracking-wide">— {dailyQuote.ref}</span>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
