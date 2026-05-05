"use client";

import { motion } from "framer-motion";
import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getDailyPhoto } from "@/lib/church-photos";
import { type Project } from "@/lib/projects-data";
import { Button } from "@/components/ui/button";

const categoryColors: Record<string, string> = {
  Construction: "bg-amber-500/20 text-amber-200",
  Outreach:     "bg-violet-500/20 text-violet-200",
  Education:    "bg-sky-500/20 text-sky-200",
  Relief:       "bg-rose-500/20 text-rose-200",
};

const statusColors: Record<string, string> = {
  Ongoing:   "bg-emerald-500/20 text-emerald-300",
  Completed: "bg-white/10 text-white/50",
  Upcoming:  "bg-blue-500/20 text-blue-300",
};

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const bgUrl = getDailyPhoto(7);
  const [activeImg, setActiveImg] = useState(0);
  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/projects?limit=100", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const list: Project[] = data?.data?.data ?? [];
        setAllProjects(list);
        setProject(list.find((p) => p.slug === slug) ?? null);
      })
      .catch(() => {
        setAllProjects([]);
        setProject(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

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
        {/* Loading */}
        {loading && (
          <motion.div className="mt-16 flex flex-col gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="h-8 w-64 bg-white/8 animate-pulse rounded" />
            <div className="h-4 w-40 bg-white/5 animate-pulse rounded" />
          </motion.div>
        )}

        {/* Not found */}
        {!loading && !project && (
          <motion.div
            className="mt-16 flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="font-heading text-white font-black text-3xl">
              Project not found.
            </p>
            <Link
              href="/project"
              className="font-body text-white/60 text-sm hover:text-white transition-colors"
            >
              Back to projects
            </Link>
          </motion.div>
        )}

        {/* Project detail */}
        {!loading && project && (
          <>
            {/* Heading */}
            <motion.div
              className="mt-4 sm:mt-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="flex items-center gap-2 flex-wrap mb-3">
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
              <h1
                className="font-heading text-white font-black leading-[0.92] tracking-tight"
                style={{ fontSize: "clamp(2.2rem, 8vw, 5rem)" }}
              >
                {project.title}
              </h1>
            </motion.div>

            {/* Image gallery */}
            <motion.div
              className="mt-8 sm:mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7 }}
            >
              {/* Hero — active image */}
              <div
                className="relative w-full overflow-hidden border border-white/15 cursor-pointer"
                style={{ aspectRatio: "16/7" }}
                onClick={() =>
                  setActiveImg((prev) => (prev + 1) % project.images.length)
                }
              >
                <Image
                  src={project.images[activeImg]}
                  alt={`${project.title} — ${activeImg + 1}`}
                  fill
                  className="object-cover transition-opacity duration-300"
                  priority
                  sizes="(max-width: 640px) 100vw, 90vw"
                />
                {/* tap-to-advance hint on mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                <span
                  className="absolute bottom-3 right-3 font-body text-white/80 text-[10px] tracking-widest uppercase px-2 py-1"
                  style={{
                    background: "rgba(0,0,0,0.45)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                  }}
                >
                  {activeImg + 1} / {project.images.length}
                </span>
              </div>

              {/* Thumbnail strip — all images always visible */}
              {project.images.length > 1 && (
                <div
                  className="mt-1.5 grid gap-1.5"
                  style={{
                    gridTemplateColumns: `repeat(${project.images.length}, 1fr)`,
                  }}
                >
                  {project.images.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      className={`relative overflow-hidden border transition-all duration-200 focus:outline-none ${
                        activeImg === idx
                          ? "border-white/60 opacity-100"
                          : "border-white/10 opacity-50 hover:opacity-80"
                      }`}
                      style={{ aspectRatio: "4/3" }}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <Image
                        src={src}
                        alt={`${project.title} thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 33vw, 20vw"
                      />
                      {activeImg === idx && (
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/40 pointer-events-none" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Meta + Body */}
            <motion.div
              className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 lg:gap-8"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.7 }}
            >
              {/* Left — meta */}
              <div
                className="flex flex-col gap-0"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
                  overflow: "hidden",
                }}
              >
                {[
                  { label: "Year of Commencement", value: project.year },
                  ...(project.goal
                    ? [{ label: "Project Cost", value: project.goal }]
                    : []),
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="flex flex-col px-5 py-4 border-b border-white/10"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.08, duration: 0.5 }}
                  >
                    <span className="font-body text-white/45 text-xs tracking-widest uppercase mb-1">
                      {item.label}
                    </span>
                    <span className="font-body text-white font-semibold text-sm sm:text-base">
                      {item.value}
                    </span>
                  </motion.div>
                ))}

                {/* Bank account details */}
                <motion.div
                  className="flex flex-col px-5 py-4 gap-1"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.05, duration: 0.5 }}
                >
                  <span className="font-body text-white/45 text-xs tracking-widest uppercase mb-1">
                    Project account
                  </span>
                  <span className="font-body text-white font-semibold text-sm sm:text-base tracking-widest">
                    1229195658
                  </span>
                  <span className="font-body text-white/60 text-xs leading-relaxed">
                    Zenith Bank
                  </span>
                  <span className="font-body text-white/50 text-[11px] leading-relaxed uppercase tracking-wide">
                    Assemblies of God 2 Choba — Proj Account
                  </span>
                </motion.div>
              </div>

              {/* Right — body */}
              <div
                className="flex flex-col gap-6 px-6 py-6"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "16px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.07)",
                }}
              >
                <p className="font-body text-white/70 text-sm sm:text-base leading-relaxed">
                  {project.body}
                </p>

                <div className="flex gap-3 flex-wrap pt-2">
                  {/* Paystack giving button — disabled until payment integration is live
                  <Button
                    variant="outline"
                    className="border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none px-7"
                    asChild
                  >
                    <a href="/give">Support this project</a>
                  </Button>
                  */}
                  <Button
                    variant="ghost"
                    className="text-white/55 hover:text-white hover:bg-transparent font-body tracking-wide rounded-none px-0 underline underline-offset-4"
                    asChild
                  >
                    <a href="/contact">Get involved</a>
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Other projects */}
            <motion.div
              className="mt-16 sm:mt-20 pt-8"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
                padding: "2rem",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.7 }}
            >
              <p className="font-body text-white/45 text-xs tracking-widest uppercase mb-5">
                Other projects
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {allProjects
                  .filter((p) => p.slug !== project.slug)
                  .slice(0, 4)
                  .map((p, i) => (
                    <motion.div
                      key={p.slug}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.28 + i * 0.06, duration: 0.4 }}
                    >
                      <Link
                        href={`/project/${p.slug}`}
                        className="group flex flex-col overflow-hidden transition-all duration-300"
                        style={{
                          background: "rgba(255,255,255,0.07)",
                          backdropFilter: "blur(12px)",
                          WebkitBackdropFilter: "blur(12px)",
                          border: "1px solid rgba(255,255,255,0.10)",
                          borderRadius: "12px",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                        }}
                      >
                        {/* Thumbnail */}
                        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9", borderRadius: "12px 12px 0 0" }}>
                          <Image
                            src={p.images[0]}
                            alt={p.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                        <div className="flex items-center justify-between gap-2 px-3 py-3">
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="font-body text-white font-semibold text-xs leading-snug group-hover:text-white/80 transition-colors truncate">
                              {p.title}
                            </span>
                            <span className="font-body text-white/40 text-[10px]">
                              {p.category} · {p.year}
                            </span>
                          </div>
                          <span className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 shrink-0 text-sm">
                            →
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </>
        )}

        <div className="h-12" />
      </div>
    </section>
  );
}
