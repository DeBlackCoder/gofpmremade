"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { sermons } from "@/lib/sermons-data";

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
    Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000) + 7;
  return `https://images.unsplash.com/${churchPhotos[dayOfYear % churchPhotos.length]}?w=1800&q=90`;
}

function renderBody(body: string) {
  return body.split("\n\n").map((para, i) => {
    const parts = para.split(/(\*[^*]+\*)/g).map((chunk, j) =>
      chunk.startsWith("*") && chunk.endsWith("*")
        ? <em key={j}>{chunk.slice(1, -1)}</em>
        : chunk
    );
    const isScripture = para.trim().startsWith("*") && para.trim().endsWith("*");
    if (isScripture) {
      return (
        <blockquote key={i}
          className="border-l-2 border-white/30 pl-5 my-6 font-heading text-white/90 font-black text-xl sm:text-2xl leading-snug tracking-tight italic">
          {parts}
        </blockquote>
      );
    }
    return (
      <p key={i} className="font-body text-white/75 text-sm sm:text-base leading-[1.85] mb-5">
        {parts}
      </p>
    );
  });
}

export default function SermonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const sermon = sermons.find((s) => s.slug === slug);
  if (!sermon) notFound();

  const bgUrl = getDailyPhoto();
  const related = sermons.filter((s) => s.slug !== sermon.slug && s.tag === sermon.tag).slice(0, 3);

  const currentIndex = sermons.findIndex((s) => s.slug === sermon.slug);
  const prevSermon = sermons[currentIndex + 1] ?? null;
  const nextSermon = sermons[currentIndex - 1] ?? null;

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
      <div className="absolute inset-0 bg-black/75" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-svh px-6 py-6 sm:px-10 sm:py-8">

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
            href="/sermons"
            className="font-body text-white/60 text-xs tracking-wide hover:text-white transition-colors"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            ← All sermons
          </motion.a>
        </div>

        {/* Content column — centered, readable width */}
        <div className="mt-8 sm:mt-12 flex-1">
          <div className="flex flex-col w-full max-w-2xl mx-auto">

            {/* Hero block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="flex items-center gap-3 flex-wrap mb-4">
                <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">{sermon.series}</span>
                <span className="font-body text-[10px] tracking-widest uppercase px-2 py-0.5 bg-white/10 text-white/70 border border-white/20">
                  {sermon.tag}
                </span>
                <span className="font-body text-white/30 text-[10px]">{sermon.date}</span>
                <span className="font-body text-white/25 text-[10px]">·</span>
                <span className="font-body text-white/30 text-[10px]">{sermon.readTime}</span>
              </div>

              <h1
                className="font-heading text-white font-black leading-[0.92] tracking-tight"
                style={{ fontSize: "clamp(2.2rem, 8vw, 5rem)" }}
              >
                {sermon.title}
              </h1>

              <p className="mt-3 font-body text-white/55 text-sm sm:text-base leading-relaxed italic">
                {sermon.subtitle}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 border border-white/20 px-3 py-1.5">
                <span className="font-body text-white/35 text-[10px] tracking-widest uppercase">Scripture</span>
                <span className="font-body text-white/70 text-xs italic">{sermon.scripture}</span>
              </div>

              {/* Pastor byline */}
              <div className="mt-6 flex items-center gap-3 border-t border-white/20 pt-5">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/25 flex-shrink-0">
                  <Image
                    src={`https://images.unsplash.com/${sermon.pastorPhoto}?w=80&q=80`}
                    alt={sermon.pastor}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-body text-white font-semibold text-sm">{sermon.pastor}</span>
                  <span className="font-body text-white/40 text-xs tracking-wide">{sermon.pastorRole}</span>
                </div>
              </div>
            </motion.div>

            {/* Body */}
            <motion.article
              className="mt-10 sm:mt-14"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.8 }}
            >
              {renderBody(sermon.body)}
            </motion.article>

            {/* Share */}
            <motion.div
              className="mt-8 border-t border-white/20 pt-6 flex items-center gap-4 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <span className="font-body text-white/35 text-xs tracking-widest uppercase">Share</span>
              {[
                { label: "Copy link", action: () => navigator.clipboard.writeText(window.location.href) },
                { label: "WhatsApp",  action: () => window.open(`https://wa.me/?text=${encodeURIComponent(sermon.title + " — " + window.location.href)}`) },
                { label: "Email",     action: () => window.open(`mailto:?subject=${encodeURIComponent(sermon.title)}&body=${encodeURIComponent(window.location.href)}`) },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="font-body text-white/50 text-xs tracking-wide border border-white/20 px-3 py-1.5 hover:bg-white hover:text-black hover:border-transparent transition-colors"
                >
                  {label}
                </button>
              ))}
            </motion.div>

            {/* Prayer CTA */}
            <motion.div
              className="mt-8 border border-white/15 backdrop-blur-sm bg-white/5 px-6 py-5 flex flex-col gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <p className="font-body text-white/40 text-[10px] tracking-widest uppercase">Did this message speak to you?</p>
              <p className="font-heading text-white font-black text-lg sm:text-xl leading-tight">
                We'd love to pray with you.
              </p>
              <div className="flex gap-3 flex-wrap mt-1">
                <Link
                  href="/contact"
                  className="font-body text-xs tracking-widest uppercase px-5 py-2 border border-white/40 text-white hover:bg-white hover:text-black transition-colors"
                >
                  Send a prayer request
                </Link>
                <Link
                  href="/sermons"
                  className="font-body text-xs tracking-widest uppercase text-white/45 hover:text-white transition-colors underline underline-offset-4 self-center"
                >
                  Read more sermons
                </Link>
              </div>
            </motion.div>

            {/* Prev / Next navigation */}
            {(prevSermon || nextSermon) && (
              <motion.div
                className="mt-10 grid grid-cols-2 gap-px border border-white/15 bg-white/15"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.15, duration: 0.6 }}
              >
                <div className="bg-black/40 backdrop-blur-sm px-4 py-4">
                  {prevSermon ? (
                    <Link href={`/sermons/${prevSermon.slug}`} className="group flex flex-col gap-1">
                      <span className="font-body text-white/30 text-[9px] tracking-widest uppercase">← Previous</span>
                      <span className="font-body text-white/70 text-xs font-semibold group-hover:text-white transition-colors leading-snug line-clamp-2">
                        {prevSermon.title}
                      </span>
                    </Link>
                  ) : <span className="font-body text-white/15 text-xs">—</span>}
                </div>
                <div className="bg-black/40 backdrop-blur-sm px-4 py-4 text-right">
                  {nextSermon ? (
                    <Link href={`/sermons/${nextSermon.slug}`} className="group flex flex-col gap-1 items-end">
                      <span className="font-body text-white/30 text-[9px] tracking-widest uppercase">Next →</span>
                      <span className="font-body text-white/70 text-xs font-semibold group-hover:text-white transition-colors leading-snug line-clamp-2">
                        {nextSermon.title}
                      </span>
                    </Link>
                  ) : <span className="font-body text-white/15 text-xs">—</span>}
                </div>
              </motion.div>
            )}

            {/* Related sermons */}
            {related.length > 0 && (
              <motion.div
                className="mt-12 sm:mt-14"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <p className="font-body text-white/35 text-[10px] tracking-widest uppercase mb-1">
                  More in {sermon.tag}
                </p>
                <div className="flex flex-col">
                  {related.map((rel, i) => (
                    <Link
                      key={rel.slug}
                      href={`/sermons/${rel.slug}`}
                      className="group flex items-start gap-5 py-4 border-t border-white/20 hover:border-white/40 transition-colors"
                    >
                      <span className="font-heading text-white/20 font-black text-2xl leading-none pt-0.5 w-7 flex-shrink-0 group-hover:text-white/40 transition-colors">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex flex-col gap-1 flex-1">
                        <h4 className="font-body text-white font-semibold text-sm group-hover:text-white/70 transition-colors leading-snug">
                          {rel.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="font-body text-white/35 text-xs">{rel.pastor}</span>
                          <span className="font-body text-white/20 text-xs">·</span>
                          <span className="font-body text-white/30 text-xs italic">{rel.scripture}</span>
                        </div>
                      </div>
                      <span className="text-white/25 group-hover:text-white/55 group-hover:translate-x-1 transition-all duration-300 mt-1 flex-shrink-0">→</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </div>

        {/* Footer nav */}
        <motion.div
          className="mt-12 border-t border-white/20 pt-6 flex items-center justify-between flex-wrap gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          <Link href="/sermons" className="font-body text-white/50 text-xs tracking-widest uppercase hover:text-white transition-colors">
            ← All sermons
          </Link>
          <Link href="/" className="font-body text-white/50 text-xs tracking-widest uppercase hover:text-white transition-colors">
            Return home
          </Link>
        </motion.div>

        <div className="h-16" />
      </div>
    </section>
  );
}