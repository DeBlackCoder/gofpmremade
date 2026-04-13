"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { getDailyPhoto } from "@/lib/church-photos";
import { projects, type ProjectCategory } from "@/lib/projects-data";

// ─── Data ────────────────────────────────────────────────────────────────────

type Filter = "All" | ProjectCategory;

const filters: Filter[] = ["All", "Construction", "Outreach", "Education", "Relief"];

const categoryColors: Record<ProjectCategory, string> = {
  Construction: "bg-amber-500/20 text-amber-200",
  Outreach:     "bg-violet-500/20 text-violet-200",
  Education:    "bg-sky-500/20 text-sky-200",
  Relief:       "bg-rose-500/20 text-rose-200",
};

const categoryActiveBg: Record<Filter, string> = {
  All:          "bg-white text-black",
  Construction: "bg-amber-400 text-amber-950",
  Outreach:     "bg-violet-400 text-violet-950",
  Education:    "bg-sky-400 text-sky-950",
  Relief:       "bg-rose-400 text-rose-950",
};

const statusColors: Record<string, string> = {
  Ongoing:   "bg-emerald-500/20 text-emerald-300",
  Completed: "bg-white/10 text-white/50",
  Upcoming:  "bg-blue-500/20 text-blue-300",
};

const stats = [
  { value: "6", label: "Active projects" },
  { value: "500+", label: "Families helped" },
  { value: "₦120M+", label: "Invested" },
  { value: "∞", label: "Impact" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const bgUrl = getDailyPhoto(7);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

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
            Faith in
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            action.
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
            We believe the church exists not just within four walls but in every
            street, school, and home it touches. These are the projects through
            which we put our faith to work.
          </p>

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

        {/* ── Projects list ─────────────────────────────── */}
        <motion.div
          className="mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
        >
          <div className="flex items-end justify-between mb-5 flex-wrap gap-4">
            <h2 className="font-body text-white/45 text-xs tracking-widest uppercase">
              Projects
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`font-body text-xs tracking-widest uppercase px-3 py-1 border transition-all duration-200 ${
                    activeFilter === f
                      ? `${categoryActiveBg[f]} border-transparent`
                      : "border-white/25 text-white/60 hover:border-white/50 hover:text-white bg-transparent"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="border-t border-white/20"
              >
                <Link
                  href={`/project/${project.slug}`}
                  className="w-full text-left py-4 sm:py-5 grid grid-cols-[1fr_auto] gap-4 items-start group flex"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body text-white font-semibold text-sm sm:text-base group-hover:text-white/80 transition-colors">
                        {project.title}
                      </span>
                      <span
                        className={`font-body text-[10px] tracking-widest uppercase px-2 py-0.5 ${categoryColors[project.category]}`}
                      >
                        {project.category}
                      </span>
                      <span
                        className={`font-body text-[10px] tracking-widest uppercase px-2 py-0.5 ${statusColors[project.status]}`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <span className="font-body text-white/45 text-xs">
                      {project.year} · Led by {project.lead}
                    </span>
                    <p className="font-body text-white/55 text-xs leading-relaxed mt-1 max-w-lg">
                      {project.summary}
                    </p>
                  </div>
                  <span className="font-body text-white/40 text-lg mt-0.5 group-hover:text-white/70 group-hover:translate-x-1 transition-all duration-300 inline-block shrink-0">
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
              No projects in this category right now.
            </motion.p>
          )}
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
              Get involved
            </p>
            <p className="font-heading text-white font-black text-2xl sm:text-3xl leading-tight">
              Your giving moves
              <br />
              mountains.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="/give"
              className="border border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide px-7 py-2 text-sm transition-colors"
            >
              Give now
            </a>
            <a
              href="/contact"
              className="text-white/55 hover:text-white font-body tracking-wide px-0 py-2 text-sm underline underline-offset-4 transition-colors"
            >
              Volunteer
            </a>
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
