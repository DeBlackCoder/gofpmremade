"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useEvents, useRegisterForEventMutation } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/stores/uiStore";
import { getDailyPhoto } from "@/lib/church-photos";
import type { ChurchEvent, EventCategory } from "@/lib/types/resources";

type Category =
  | "All"
  | "Worship"
  | "Community"
  | "Youth"
  | "Prayer"
  | "Special";

const categoryActiveBg: Record<Category, string> = {
  All: "bg-white text-black",
  Worship: "bg-amber-400 text-amber-950",
  Community: "bg-teal-400 text-teal-950",
  Youth: "bg-violet-400 text-violet-950",
  Prayer: "bg-sky-400 text-sky-950",
  Special: "bg-rose-400 text-rose-950",
};

const categories: Category[] = [
  "All",
  "Worship",
  "Community",
  "Youth",
  "Prayer",
  "Special",
];

const categoryToEventCategories: Record<
  Exclude<Category, "All">,
  EventCategory[]
> = {
  Worship: ["SERVICE"],
  Community: ["OUTREACH"],
  Youth: ["YOUTH"],
  Prayer: ["PRAYER"],
  Special: ["OTHER"],
};

const categoryEmptyMessage: Record<Category, string> = {
  All: "No upcoming events at the moment.",
  Worship: "No worship events at the moment.",
  Community: "No community events at the moment.",
  Youth: "No youth events at the moment.",
  Prayer: "No prayer events at the moment.",
  Special: "No special events at the moment.",
};

export default function EventsPage() {
  const bgUrl = getDailyPhoto(6);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const page = 1;
  const addToast = useUiStore((s) => s.addToast);
  const registerMutation = useRegisterForEventMutation();

  // Fetch real events from API
  const { data: paginatedEvents, isLoading, error, refetch } = useEvents(page);

  useEffect(() => {
    if (error) {
      addToast({ type: "error", message: "Failed to load events" });
    }
  }, [error, addToast]);

  const events = paginatedEvents?.data || [];
  const filtered =
    activeCategory === "All"
      ? events
      : events.filter((e: ChurchEvent) =>
          categoryToEventCategories[activeCategory].includes(e.category),
        );

  const handleRegister = async (eventId: string) => {
    try {
      await registerMutation.mutateAsync({
        eventId,
        registration: {
          firstName: "Guest",
          lastName: "User",
          email: "guest@example.com",
        },
      });
      addToast({ type: "success", message: "Successfully registered!" });
    } catch (error: unknown) {
      addToast({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to register",
      });
    }
  };

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
      <div className="fixed inset-0 bg-linear-to-r from-black/75 via-black/40 to-black/10 z-10" />
      <div className="fixed inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/60 to-transparent z-10" />

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
            Upcoming
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            events.
          </motion.span>
        </motion.h1>

        {/* Category filters */}
        <motion.div
          className="mt-8 sm:mt-10 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedId(null);
              }}
              className={`font-body text-xs tracking-widest uppercase px-4 py-1.5 border transition-all duration-200 ${
                activeCategory === cat
                  ? `${categoryActiveBg[cat]} border-transparent`
                  : "border-white/25 text-white/70 hover:border-white/50 hover:text-white bg-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-white/60">Loading events...</p>
          </motion.div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <motion.div
            className="mt-8 border-t border-white/20 pt-6 sm:pt-8 flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
          >
            <p className="font-body text-white/35 text-[10px] tracking-widest uppercase">
              Events
            </p>
            <p className="font-body text-white/55 text-sm mt-2 leading-relaxed">
              Unable to load events right now. Please try again.
            </p>
            <Button
              onClick={() => void refetch()}
              className="mt-4 border-white/40 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none text-xs px-5"
            >
              Retry
            </Button>
          </motion.div>
        )}

        {/* Events list */}
        {!isLoading && !error && (
          <motion.div
            className="mt-8 flex flex-col gap-0 flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((event: ChurchEvent, i) => {
                const isOpen = expandedId === event.id;
                const eventDate = new Date(event.date || event.createdAt);
                const month = eventDate
                  .toLocaleString("en", { month: "short" })
                  .toUpperCase();
                const day = eventDate.getDate().toString().padStart(2, "0");
                const dayName = eventDate.toLocaleString("en", {
                  weekday: "short",
                });

                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                    className="border-t border-white/20"
                  >
                    <button
                      onClick={() => setExpandedId(isOpen ? null : event.id)}
                      className="w-full text-left py-4 sm:py-5 grid grid-cols-[64px_1fr_auto] sm:grid-cols-[80px_1fr_auto] gap-4 items-start group"
                    >
                      {/* Date block */}
                      <div className="flex flex-col items-center leading-none pt-0.5">
                        <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">
                          {month}
                        </span>
                        <span className="font-heading text-white font-black text-3xl sm:text-4xl leading-none mt-0.5">
                          {day}
                        </span>
                        <span className="font-body text-white/40 text-[10px] tracking-widest uppercase mt-0.5">
                          {dayName}
                        </span>
                      </div>

                      {/* Title + meta */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-body text-white font-semibold text-sm sm:text-base group-hover:text-white/80 transition-colors">
                            {event.title}
                          </span>
                          {event.featured && (
                            <span className="font-body text-[10px] tracking-widest uppercase px-2 py-0.5 bg-white/15 text-white/80 border border-white/20">
                              Featured
                            </span>
                          )}
                        </div>
                        <span className="font-body text-white/50 text-xs">
                          {event.time || "TBA"} · {event.location || "TBA"}
                        </span>
                      </div>

                      {/* Expand icon */}
                      <span
                        className="font-body text-white/40 text-lg mt-0.5 group-hover:text-white/70 transition-all duration-300"
                        style={{
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          display: "inline-block",
                        }}
                      >
                        +
                      </span>
                    </button>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pl-20 sm:pl-24 pr-8 flex flex-col gap-4">
                            <p className="font-body text-white/70 text-sm leading-relaxed max-w-lg">
                              {event.description}
                            </p>
                            {event.imageUrl && (
                              <a
                                href={event.imageUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="block max-w-lg"
                              >
                                <img
                                  src={event.imageUrl}
                                  alt={event.title}
                                  className="w-full max-h-64 object-cover border border-white/20"
                                />
                              </a>
                            )}
                            <div className="flex gap-3 flex-wrap">
                              <Button
                                onClick={() => handleRegister(event.id)}
                                disabled={registerMutation.isPending}
                                className="border-white/40 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none text-xs px-5"
                              >
                                {registerMutation.isPending
                                  ? "Registering..."
                                  : "Register"}
                              </Button>
                              <Button
                                variant="ghost"
                                className="text-white/55 hover:text-white hover:bg-transparent font-body text-xs tracking-wide rounded-none px-0 underline underline-offset-4"
                              >
                                Add to calendar
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <motion.div
                className="border-t border-white/20 pt-6 sm:pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  {activeCategory === "All"
                    ? "Events"
                    : `${activeCategory} events`}
                </p>
                <p className="font-body text-white/55 text-sm mt-2 leading-relaxed">
                  {categoryEmptyMessage[activeCategory]}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Bottom spacer */}
        <div className="h-12" />
      </div>
    </section>
  );
}
