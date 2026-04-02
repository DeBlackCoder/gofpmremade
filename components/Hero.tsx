"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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

export default function Hero() {
  const bgUrl = getDailyPhoto();
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

        {/* Brand */}
        <motion.p
          className="font-body text-white/70 text-xs tracking-widest uppercase"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Assemblies Of God Church
        </motion.p>

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

        {/* Spacer */}
        <div className="flex-1" />

        {/* Nav */}
        <motion.nav
          className="grid grid-cols-2 w-full max-w-xs sm:max-w-sm gap-x-8 sm:gap-x-20 mb-2"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 1 } } }}
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

      </div>
    </section>
  );
}
