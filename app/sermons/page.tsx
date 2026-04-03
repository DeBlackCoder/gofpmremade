"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { sermons, seriesTags, tagColors, tagActiveBg, type SeriesTag } from "@/lib/sermons-data";

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
    Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000) + 5;
  return `https://images.unsplash.com/${churchPhotos[dayOfYear % churchPhotos.length]}?w=1800&q=90`;
}

export default function SermonsPage() {
  const bgUrl = getDailyPhoto();
  const [activeTag, setActiveTag] = useState<SeriesTag>("All");

  const filtered = activeTag === "All" ? sermons : sermons.filter((s) => s.tag === activeTag);
  const featured = sermons.find((s) => s.featured);

  return (
    <section className="relative w-full min-h-svh overflow-hidden">

      {/* Background */}
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6 }}>
        <Image src={bgUrl} alt="Church" fill priority quality={90} className="object-cover object-center" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/75 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-svh px-6 py-6 sm:px-10 sm:py-8">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <motion.p className="font-body text-white/70 text-xs tracking-widest uppercase"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            Assemblies Of God Church
          </motion.p>
          <motion.a href="/" className="font-body text-white/60 text-xs tracking-wide hover:text-white transition-colors"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            ← Return home
          </motion.a>
        </div>

        {/* Heading */}
        <motion.h1 className="font-heading mt-4 sm:mt-6 text-white font-black leading-[0.92] tracking-tight"
          style={{ fontSize: "clamp(2.6rem, 10vw, 6rem)" }}>
          <motion.span className="block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
            Words that
          </motion.span>
          <motion.span className="block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68, duration: 0.8 }}>
            last.
          </motion.span>
        </motion.h1>

        <motion.p className="mt-4 font-body text-white/60 text-sm sm:text-base leading-relaxed max-w-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85, duration: 0.6 }}>
          Sermons, reflections, and pastoral letters from our leadership — written to be read slowly.
        </motion.p>

        {/* Tag filters */}
        <motion.div className="mt-7 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.6 }}>
          {seriesTags.map((tag) => (
            <button key={tag} onClick={() => setActiveTag(tag)}
              className={`font-body text-xs tracking-widest uppercase px-4 py-1.5 border transition-all duration-200 ${
                activeTag === tag
                  ? `${tagActiveBg[tag]} border-transparent`
                  : "border-white/25 text-white/60 hover:border-white/50 hover:text-white bg-transparent"
              }`}>
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Featured sermon */}
        <AnimatePresence mode="wait">
          {activeTag === "All" && featured && (
            <motion.div key="featured"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 1.05, duration: 0.6 }}
              className="mt-10 sm:mt-12">
              <Link href={`/sermons/${featured.slug}`} className="group block border-t border-white/20 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 sm:gap-10 items-start">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">{featured.series}</span>
                      <span className={`font-body text-[10px] tracking-widest uppercase px-2 py-0.5 ${tagColors[featured.tag]}`}>{featured.tag}</span>
                      <span className="font-body text-white/30 text-[10px]">{featured.date}</span>
                    </div>
                    <h2 className="font-heading text-white font-black leading-[0.95] tracking-tight group-hover:text-white/80 transition-colors"
                      style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}>
                      {featured.title}
                    </h2>
                    <p className="font-body text-white/55 text-sm leading-relaxed max-w-lg">{featured.excerpt}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                        <Image src={`https://images.unsplash.com/${featured.pastorPhoto}?w=80&q=80`}
                          alt={featured.pastor} width={28} height={28} className="object-cover w-full h-full" />
                      </div>
                      <span className="font-body text-white/60 text-xs">{featured.pastor}</span>
                      <span className="font-body text-white/25 text-xs">·</span>
                      <span className="font-body text-white/40 text-xs italic">{featured.scripture}</span>
                      <span className="font-body text-white/25 text-xs">·</span>
                      <span className="font-body text-white/35 text-xs">{featured.readTime}</span>
                    </div>
                  </div>
                  <span className="hidden sm:block font-body text-white/30 text-3xl group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 mt-2">→</span>
                </div>
                <span className="mt-5 inline-block font-body text-white/50 text-xs tracking-widest uppercase border-b border-white/25 pb-0.5 group-hover:text-white group-hover:border-white transition-colors">
                  Read sermon
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sermon list */}
        <motion.div className="mt-10 flex flex-col"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 0.6 }}>
          <p className="font-body text-white/35 text-[10px] tracking-widest uppercase mb-1">
            {activeTag === "All" ? "All sermons" : `${activeTag} sermons`} — {filtered.length} messages
          </p>
          <AnimatePresence mode="popLayout">
            {filtered.map((sermon, i) => (
              <motion.div key={sermon.slug} layout
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}>
                <Link href={`/sermons/${sermon.slug}`}
                  className="group flex items-start gap-5 sm:gap-8 py-5 border-t border-white/20 hover:border-white/40 transition-colors">
                  {/* Date column */}
                  <div className="hidden sm:flex flex-col items-center w-10 flex-shrink-0 pt-0.5 leading-none">
                    <span className="font-body text-white/30 text-[9px] tracking-widest uppercase">
                      {new Date(sermon.dateISO).toLocaleString("en", { month: "short" }).toUpperCase()}
                    </span>
                    <span className="font-heading text-white font-black text-2xl leading-none mt-0.5">
                      {new Date(sermon.dateISO).getDate().toString().padStart(2, "0")}
                    </span>
                  </div>
                  {/* Body */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body text-white/35 text-[10px] tracking-widest uppercase">{sermon.series}</span>
                      <span className={`font-body text-[10px] tracking-widest uppercase px-2 py-0.5 ${tagColors[sermon.tag]}`}>{sermon.tag}</span>
                      {sermon.featured && (
                        <span className="font-body text-[10px] tracking-widest uppercase px-2 py-0.5 bg-white/10 text-white/60 border border-white/20">Featured</span>
                      )}
                    </div>
                    <h3 className="font-body text-white font-semibold text-sm sm:text-base group-hover:text-white/75 transition-colors leading-snug">
                      {sermon.title}
                    </h3>
                    <p className="font-body text-white/45 text-xs leading-relaxed line-clamp-2 max-w-xl hidden sm:block">
                      {sermon.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-white/15 flex-shrink-0">
                        <Image src={`https://images.unsplash.com/${sermon.pastorPhoto}?w=40&q=80`}
                          alt={sermon.pastor} width={20} height={20} className="object-cover w-full h-full" />
                      </div>
                      <span className="font-body text-white/45 text-xs">{sermon.pastor}</span>
                      <span className="font-body text-white/20 text-xs">·</span>
                      <span className="font-body text-white/35 text-xs italic">{sermon.scripture}</span>
                      <span className="font-body text-white/20 text-xs">·</span>
                      <span className="font-body text-white/30 text-xs">{sermon.readTime}</span>
                    </div>
                  </div>
                  <span className="text-white/25 text-xl group-hover:text-white/55 group-hover:translate-x-1 transition-all duration-300 mt-1 flex-shrink-0">→</span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.p className="font-body text-white/40 text-sm pt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              No sermons in this series yet. Check back soon.
            </motion.p>
          )}
        </motion.div>

        <div className="h-16" />
      </div>
    </section>
  );
}