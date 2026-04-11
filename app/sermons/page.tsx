"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useSermons, useSearchSermons } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/stores/uiStore";
import { getDailyPhoto } from "@/lib/church-photos";

export default function SermonsPage() {
  const bgUrl = getDailyPhoto(5);
  const [activeTag, setActiveTag] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const addToast = useUiStore((s) => s.addToast);

  // Fetch real data from API
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useSearchSermons(searchTerm);
  const { data: paginatedSermons, isLoading, error } = useSermons(page);

  // Handle errors
  if (error) {
    addToast({ type: "error", message: "Failed to load sermons" });
  }
  if (searchError) {
    addToast({ type: "error", message: "Search failed" });
  }

  // Use search results if searching, otherwise use all sermons
  const displaySermons = searchTerm
    ? searchResults?.data || []
    : paginatedSermons?.data || [];
  const featured = displaySermons.length > 0 ? displaySermons[0] : null;
  const filtered = displaySermons;

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
      <div className="fixed inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10 z-10" />
      <div className="fixed inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent z-10" />

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
            Words that
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            last.
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-4 font-body text-white/60 text-sm sm:text-base leading-relaxed max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          Sermons, reflections, and pastoral letters from our leadership —
          written to be read slowly.
        </motion.p>

        {/* Tag filters - simplified since API doesn't have tag filtering yet */}
        <motion.div
          className="mt-7 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6 }}
        >
          <button
            onClick={() => {
              setActiveTag("All");
              setPage(1);
            }}
            className={`font-body text-xs tracking-widest uppercase px-4 py-1.5 border transition-all duration-200 ${
              activeTag === "All"
                ? "bg-white/10 border-white text-white"
                : "border-white/25 text-white/60 hover:border-white/50 hover:text-white bg-transparent"
            }`}
          >
            All Sermons
          </button>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-white/60">Loading sermons...</p>
          </motion.div>
        )}

        {/* Featured sermon */}
        <AnimatePresence mode="wait">
          {!isLoading && featured && (
            <motion.div
              key="featured"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 1.05, duration: 0.6 }}
              className="mt-10 sm:mt-12"
            >
              <Link
                href={`/sermons/${featured.id}`}
                className="group block border-t border-white/20 pt-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 sm:gap-10 items-start">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">
                        Featured Sermon
                      </span>
                      <span className="font-body text-white/30 text-[10px]">
                        {new Date(featured.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2
                      className="font-heading text-white font-black leading-[0.95] tracking-tight group-hover:text-white/80 transition-colors"
                      style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
                    >
                      {featured.title}
                    </h2>
                    <p className="font-body text-white/55 text-sm leading-relaxed max-w-lg line-clamp-3">
                      {featured.excerpt || (featured as any).content}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-body text-white/60 text-xs">
                        {featured.pastor || (featured as any).author || "Pastor"}
                      </span>
                      <span className="font-body text-white/25 text-xs">·</span>
                      <span className="font-body text-white/35 text-xs">
                        5 min read
                      </span>
                    </div>
                  </div>
                  <span className="hidden sm:block font-body text-white/30 text-3xl group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 mt-2">
                    →
                  </span>
                </div>
                <span className="mt-5 inline-block font-body text-white/50 text-xs tracking-widest uppercase border-b border-white/25 pb-0.5 group-hover:text-white group-hover:border-white transition-colors">
                  Read sermon
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sermon list */}
        <motion.div
          className="mt-10 flex flex-col"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.6 }}
        >
          <p className="font-body text-white/35 text-[10px] tracking-widest uppercase mb-1">
            All sermons — {filtered.length} messages
          </p>
          <AnimatePresence mode="popLayout">
            {filtered.map((sermon, i) => (
              <motion.div
                key={sermon.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <Link
                  href={`/sermons/${sermon.id}`}
                  className="group flex items-start gap-5 sm:gap-8 py-5 border-t border-white/20 hover:border-white/40 transition-colors"
                >
                  {/* Date column */}
                  <div className="hidden sm:flex flex-col items-center w-10 flex-shrink-0 pt-0.5 leading-none">
                    <span className="font-body text-white/30 text-[9px] tracking-widest uppercase">
                      {new Date(sermon.createdAt)
                        .toLocaleString("en", { month: "short" })
                        .toUpperCase()}
                    </span>
                    <span className="font-heading text-white font-black text-2xl leading-none mt-0.5">
                      {new Date(sermon.createdAt)
                        .getDate()
                        .toString()
                        .padStart(2, "0")}
                    </span>
                  </div>
                  {/* Body */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                        Sermon
                      </span>
                    </div>
                    <h3 className="font-body text-white font-semibold text-sm sm:text-base group-hover:text-white/75 transition-colors leading-snug">
                      {sermon.title}
                    </h3>
                    <p className="font-body text-white/45 text-xs leading-relaxed line-clamp-2 max-w-xl hidden sm:block">
                      {sermon.excerpt || (sermon as any).content}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="font-body text-white/45 text-xs">
                        {sermon.pastor || (sermon as any).author || "Pastor"}
                      </span>
                      <span className="font-body text-white/20 text-xs">·</span>
                      <span className="font-body text-white/30 text-xs">
                        5 min read
                      </span>
                    </div>
                  </div>
                  <span className="text-white/25 text-xl group-hover:text-white/55 group-hover:translate-x-1 transition-all duration-300 mt-1 flex-shrink-0">
                    →
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.p
              className="font-body text-white/40 text-sm pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No sermons found. Check back soon.
            </motion.p>
          )}

          {/* Pagination */}
          {!searchTerm && paginatedSermons?.pagination && (
            <motion.div
              className="flex items-center justify-between mt-10 pt-8 border-t border-white/20"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="font-body text-xs tracking-widest uppercase text-white/60 disabled:text-white/30 hover:text-white transition-colors disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <span className="font-body text-xs text-white/40">
                Page {page} of{" "}
                {Math.ceil((paginatedSermons.pagination?.total || 0) / 10)}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={
                  page >=
                  Math.ceil((paginatedSermons.pagination?.total || 0) / 10)
                }
                className="font-body text-xs tracking-widest uppercase text-white/60 disabled:text-white/30 hover:text-white transition-colors disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </motion.div>
          )}
        </motion.div>

        <div className="h-16" />
      </div>
    </section>
  );
}
