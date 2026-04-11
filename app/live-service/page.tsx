"use client";

import { motion } from "framer-motion";
import { useLivestream } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/stores/uiStore";
import { getDailyPhoto } from "@/lib/church-photos";

export default function LiveServicePage() {
  const bgUrl = getDailyPhoto(1);
  const addToast = useUiStore((s) => s.addToast);
  const { data: livestream, isLoading, error } = useLivestream();

  if (error) {
    addToast({ type: "error", message: "Failed to load livestream" });
  }

  const isLive = livestream?.isLive || (livestream as any)?.status === "LIVE";

  return (
    <section className="relative w-full min-h-svh">
      <motion.div
        className="page-bg"
        style={{ "--bg-url": `url(${bgUrl})` } as React.CSSProperties}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6 }}
      />
      <div className="fixed inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10 z-10" />
      <div className="fixed inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent z-10" />

      <div className="public-content relative z-10 flex flex-col min-h-svh px-6 py-6 sm:px-10 sm:py-8">
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

        <motion.h1
          className="font-heading mt-6 text-white font-black leading-[0.92] tracking-tight"
          style={{ fontSize: "clamp(2.4rem, 9vw, 5rem)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
        >
          {isLive ? "We're live." : "Live service."}
        </motion.h1>

        <motion.div
          className="mt-8 border border-white/15 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          {isLoading && (
            <div className="p-8 text-center font-body text-white/60 text-sm">
              Loading livestream…
            </div>
          )}

          {!isLoading && livestream?.streamUrl && (
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src={livestream.streamUrl}
                title={livestream.title || "Live Service"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {!isLoading && !livestream?.streamUrl && (
            <div className="p-8 text-center flex flex-col gap-3">
              <p className="font-body text-white/65 text-sm">
                No live stream is active right now.
              </p>
              <a
                href="/events"
                className="font-body text-white/50 text-xs tracking-widest uppercase hover:text-white transition-colors"
              >
                View upcoming services →
              </a>
            </div>
          )}
        </motion.div>

        <motion.div
          className="mt-6 border-t border-white/20 pt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}
        >
          <p className="font-heading text-white font-black text-xl leading-tight">
            {livestream?.title || "Sunday Service"}
          </p>
          <p className="font-body text-white/55 text-sm mt-2 max-w-2xl leading-relaxed">
            {livestream?.description ||
              "Join us online for worship, prayer, and the Word."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
