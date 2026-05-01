"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { useSermons, useSearchSermons } from "@/lib/hooks/queries";
import { getDailyPhoto } from "@/lib/church-photos";

interface Sermon {
  slug: string;
  title: string;
  pastor?: string;
  excerpt?: string;
  body?: string;
  audioUrl?: string;
  date?: string;
  createdAt?: string;
  preachedAt?: string;
  podcastYoutube?: string;
  videoUrl?: string;
  scripture?: string;
  tags?: string[];
}

export default function SermonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const bgUrl = getDailyPhoto();

  const { data: pageData, isLoading } = useSermons(1);
  const { data: searchData } = useSearchSermons(slug);

  const all: Sermon[] = pageData?.data || [];
  const searched: Sermon[] = searchData?.data || [];
  const sermon: Sermon | null =
    searched.find((s) => s.slug === slug) ||
    all.find((s) => s.slug === slug) ||
    null;

  return (
    <section className="relative w-full min-h-svh">
      <motion.div
        className="page-bg"
        style={{ "--bg-url": `url(${bgUrl})` } as React.CSSProperties}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />
      <div className="fixed inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10 z-10" />
      <div className="fixed inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent z-10" />

      <div className="public-content relative z-10 flex flex-col min-h-svh px-6 py-6 sm:px-10 sm:py-8">
        <div className="flex items-center justify-between">
          <p className="font-body text-white/70 text-xs tracking-widest uppercase">
            Assemblies Of God Church
          </p>
          <Link
            href="/sermons"
            className="font-body text-white/60 text-xs tracking-wide hover:text-white transition-colors"
          >
            ← All sermons
          </Link>
        </div>

        {isLoading && (
          <div className="mt-16 font-body text-white/60 text-sm">
            Loading sermon…
          </div>
        )}

        {!isLoading && !sermon && (
          <div className="mt-16 flex flex-col gap-4">
            <p className="font-heading text-white font-black text-3xl">
              Sermon not found
            </p>
            <Link
              href="/sermons"
              className="font-body text-white/60 text-sm hover:text-white transition-colors"
            >
              Back to sermons
            </Link>
          </div>
        )}

        {sermon && (
          <div className="mt-10 max-w-3xl">
            <p className="font-body text-white/35 text-[10px] tracking-widest uppercase">
              {new Date(
                sermon.preachedAt || sermon.date || sermon.createdAt || "",
              ).toLocaleDateString()}
            </p>
            <h1
              className="font-heading mt-3 text-white font-black leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2rem, 7vw, 4rem)" }}
            >
              {sermon.title}
            </h1>
            {sermon.pastor && (
              <span className="font-body text-white/50 text-[10px] tracking-widest uppercase mb-1">
                By {sermon.pastor}
              </span>
            )}
            {(sermon.excerpt || sermon.body) && (
              <p className="font-body text-white/70 text-sm leading-relaxed mb-6">
                {sermon.excerpt || sermon.body}
              </p>
            )}

            <div className="mt-8 flex gap-3 flex-wrap">
              {(sermon.podcastYoutube || sermon.videoUrl) && (
                <Button
                  variant="outline"
                  className="border-white/30 text-white rounded-none h-9 px-4 text-xs font-body tracking-wide hover:bg-white hover:text-black transition-all"
                  asChild
                >
                  <a
                    href={sermon.podcastYoutube || sermon.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch video
                  </a>
                </Button>
              )}
              {sermon.audioUrl && (
                <a
                  href={sermon.audioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs tracking-widest uppercase px-4 py-2 border border-white/30 text-white hover:bg-white hover:text-black transition-colors"
                >
                  Listen audio
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
