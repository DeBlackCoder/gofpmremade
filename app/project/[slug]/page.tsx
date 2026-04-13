"use client";

import { motion } from "framer-motion";
import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getDailyPhoto } from "@/lib/church-photos";
import { projects } from "@/lib/projects-data";
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
  const project = projects.find((p) => p.slug === slug) ?? null;
  const [activeImg, setActiveImg] = useState(0);

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
            href="/project"
            className="font-body text-white/60 text-xs tracking-wide hover:text-white transition-colors"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            ← All projects
          </motion.a>
        </div>

        {/* Not found */}
        {!project && (
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
        {project && (
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
              {project.images.length === 1 ? (
                /* Single image — full width */
                <div className="relative w-full aspect-[16/7] overflow-hidden border border-white/15">
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                /* Multi-image — featured + side stack */
                <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-1.5">
                  {/* Featured */}
                  <div
                    className={`relative overflow-hidden border cursor-pointer transition-opacity duration-200 hover:opacity-90 ${
                      activeImg === 0 ? "border-white/50" : "border-white/15"
                    }`}
                    style={{ aspectRatio: "4/3" }}
                    onClick={() => setActiveImg(0)}
                  >
                    <Image
                      src={project.images[0]}
                      alt={`${project.title} — 1`}
                      fill
                      className="object-cover"
                      priority
                    />
                    {activeImg === 0 && (
                      <div className="absolute inset-0 ring-2 ring-inset ring-white/40 pointer-events-none" />
                    )}
                  </div>

                  {/* Side stack */}
                  <div className="flex flex-col gap-1.5">
                    {project.images.slice(1).map((src, i) => {
                      const idx = i + 1;
                      const isLast = idx === project.images.length - 1 && project.images.length > 3;
                      return (
                        <div
                          key={idx}
                          className={`relative overflow-hidden border cursor-pointer transition-opacity duration-200 hover:opacity-90 flex-1 ${
                            activeImg === idx ? "border-white/50" : "border-white/15"
                          }`}
                          style={{ minHeight: 0 }}
                          onClick={() => setActiveImg(idx)}
                        >
                          <Image
                            src={src}
                            alt={`${project.title} — ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          {activeImg === idx && (
                            <div className="absolute inset-0 ring-2 ring-inset ring-white/40 pointer-events-none" />
                          )}
                          {isLast && project.images.length > 3 && (
                            <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                              <span className="font-heading text-white font-black text-xl">
                                +{project.images.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Counter */}
              <p className="mt-2 font-body text-white/30 text-[10px] tracking-widest uppercase text-right">
                {activeImg + 1} / {project.images.length}
              </p>
            </motion.div>

            {/* Meta + Body */}
            <motion.div
              className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.7 }}
            >
              {/* Left — meta */}
              <div className="flex flex-col gap-5">
                {[
                  { label: "Year", value: project.year },
                  { label: "Project lead", value: project.lead },
                  ...(project.goal
                    ? [{ label: "Funding goal", value: project.goal }]
                    : []),
                  ...(project.raised
                    ? [{ label: "Raised so far", value: project.raised }]
                    : []),
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="flex flex-col border-t border-white/20 pt-4"
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

                {/* Progress bar */}
                {project.goal && project.raised && (
                  <motion.div
                    className="flex flex-col gap-2 pt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                  >
                    <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/70 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              (parseFloat(project.raised.replace(/[^\d.]/g, "")) /
                                parseFloat(project.goal.replace(/[^\d.]/g, ""))) *
                                100,
                            ),
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">
                      {Math.min(
                        100,
                        Math.round(
                          (parseFloat(project.raised.replace(/[^\d.]/g, "")) /
                            parseFloat(project.goal.replace(/[^\d.]/g, ""))) *
                            100,
                        ),
                      )}
                      % funded
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Right — body */}
              <div className="flex flex-col gap-6">
                <p className="font-body text-white/70 text-sm sm:text-base leading-relaxed">
                  {project.body}
                </p>

                <div className="flex gap-3 flex-wrap pt-2">
                  <Button
                    variant="outline"
                    className="border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none px-7"
                    asChild
                  >
                    <a href="/give">Support this project</a>
                  </Button>
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
              className="mt-16 sm:mt-20 border-t border-white/20 pt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.7 }}
            >
              <p className="font-body text-white/45 text-xs tracking-widest uppercase mb-5">
                Other projects
              </p>
              <div className="flex flex-col">
                {projects
                  .filter((p) => p.slug !== project.slug)
                  .slice(0, 4)
                  .map((p, i) => (
                    <motion.div
                      key={p.slug}
                      className="border-t border-white/20"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.28 + i * 0.06, duration: 0.4 }}
                    >
                      <Link
                        href={`/project/${p.slug}`}
                        className="flex items-center justify-between gap-4 py-4 group"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-body text-white font-semibold text-sm group-hover:text-white/80 transition-colors">
                            {p.title}
                          </span>
                          <span className="font-body text-white/40 text-xs">
                            {p.category} · {p.year}
                          </span>
                        </div>
                        <span className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 shrink-0">
                          →
                        </span>
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
