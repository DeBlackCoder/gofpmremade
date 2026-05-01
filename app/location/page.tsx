"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { getDailyPhoto } from "@/lib/church-photos";

// ─── Data ────────────────────────────────────────────────────────────────────

const serviceTimes = [
  {
    day: "Sunday",
    shortDay: "SUN",
    times: ["8:00 AM — First Service", "10:30 AM — Second Service"],
    note: "Children's Church available",
    accent: "from-amber-500/20 to-amber-500/5",
    dot: "bg-amber-400",
  },
  {
    day: "Wednesday",
    shortDay: "WED",
    times: ["6:00 PM — Midweek Service"],
    note: "Bible study & prayer",
    accent: "from-sky-500/20 to-sky-500/5",
    dot: "bg-sky-400",
  },
  {
    day: "Friday",
    shortDay: "FRI",
    times: ["6:00 AM — Early Morning Prayer"],
    note: "Open to all members",
    accent: "from-violet-500/20 to-violet-500/5",
    dot: "bg-violet-400",
  },
];

const details = [
  {
    label: "Address",
    value: "Assemblies Of God Church, Choba, Port Harcourt, Rivers State",
    href: "https://www.google.com/maps/place/Assemblies+Of+God+Church+Choba+2/@4.8832034,6.9008766,1123m",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "+234 801 234 5678",
    href: "tel:+2348012345678",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
  },
  {
    label: "Email",
    value: "hello@agchurch.org",
    href: "mailto:hello@agchurch.org",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    label: "Parking",
    value: "Free on-site parking available",
    href: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
];

const faqs = [
  {
    q: "What should I wear?",
    a: "Come as you are. We have no dress code — what matters is that you show up.",
  },
  {
    q: "Is there something for my kids?",
    a: "Yes. Children's Church runs during both Sunday services for ages 3–12, with trained and vetted volunteers.",
  },
  {
    q: "How long is a service?",
    a: "Typically 90 minutes — worship, the Word, and a moment of prayer. We don't rush God, but we respect your time.",
  },
  {
    q: "Do I need to register to attend?",
    a: "Not at all. Walk in, find a seat, and feel at home. First-time visitors are always welcome.",
  },
];

const MAPS_URL =
  "https://www.google.com/maps/place/Assemblies+Of+God+Church+Choba+2/@4.8832034,6.9008766,1123m";

// ─── Component ───────────────────────────────────────────────────────────────

export default function LocationPage() {
  const bgUrl = getDailyPhoto(6);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
      <div className="fixed inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/15 z-10 pointer-events-none" />
      <div className="fixed inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/60 to-transparent z-10 pointer-events-none" />

      {/* Content */}
      <div className="public-content relative z-10 flex flex-col min-h-svh px-6 py-6 sm:px-10 sm:py-8">

        {/* ── Heading ── */}
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
            Find
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            us here.
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-4 font-body text-white/60 text-sm sm:text-base leading-relaxed max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          We meet every week in Choba, Port Harcourt. Whether it&apos;s your
          first time or your hundredth, there is always a seat for you.
        </motion.p>

        {/* ── Service Times ── */}
        <motion.div
          className="mt-10 sm:mt-14"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          <p className="font-body text-white/45 text-xs tracking-widest uppercase mb-5">
            Service times
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {serviceTimes.map((s, i) => (
              <motion.div
                key={s.day}
                className={`relative overflow-hidden p-6 bg-gradient-to-br ${s.accent}`}
                style={{
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "20px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -4 }}
              >
                {/* Day label */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">
                    {s.shortDay}
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${s.dot} shadow-lg`} />
                </div>

                <h3 className="font-heading text-white font-black text-2xl leading-none mb-3">
                  {s.day}
                </h3>

                <div className="flex flex-col gap-1.5 mb-4">
                  {s.times.map((t) => (
                    <span key={t} className="font-body text-white/80 text-sm font-medium">
                      {t}
                    </span>
                  ))}
                </div>

                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5"
                  style={{
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "8px",
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/50">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span className="font-body text-white/55 text-[11px] italic">{s.note}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Contact Details + Map ── */}
        <motion.div
          className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
        >
          {/* Contact details */}
          <div
            className="flex flex-col"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <div className="px-6 py-4 border-b border-white/10">
              <p className="font-body text-white/45 text-xs tracking-widest uppercase">
                Contact & location
              </p>
            </div>
            <div className="flex flex-col divide-y divide-white/[0.08]">
              {details.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="flex items-start gap-4 px-6 py-5 group hover:bg-white/[0.04] transition-colors duration-200"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + i * 0.08, duration: 0.5 }}
                >
                  <div
                    className="w-11 h-11 flex items-center justify-center flex-shrink-0 text-white/50 group-hover:text-white/80 transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "12px",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-body text-white/40 text-[10px] tracking-widest uppercase">
                      {item.label}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="font-body text-white font-semibold text-sm leading-snug hover:text-white/70 transition-colors flex items-start gap-1.5 group/link"
                      >
                        <span>{item.value}</span>
                        {item.href.startsWith("http") && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0 opacity-0 group-hover/link:opacity-60 transition-opacity">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        )}
                      </a>
                    ) : (
                      <span className="font-body text-white font-semibold text-sm leading-snug">
                        {item.value}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Directions CTA inside card */}
            <div className="px-6 py-5 border-t border-white/10 mt-auto">
              <motion.a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full font-body font-semibold text-sm text-white py-3 transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.20)",
                  borderRadius: "12px",
                }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.18)" }}
                whileTap={{ scale: 0.98 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Get directions
              </motion.a>
            </div>
          </div>

          {/* Map */}
          <motion.div
            className="relative overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              minHeight: "360px",
            }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.15, duration: 0.7 }}
          >
            {/* Map header bar */}
            <div
              className="flex items-center justify-between px-5 py-3 absolute top-0 left-0 right-0 z-10"
              style={{
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-body text-white/70 text-xs tracking-widest uppercase">
                  AG Church · Choba 2
                </span>
              </div>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-white/50 text-xs tracking-wide hover:text-white transition-colors flex items-center gap-1.5"
              >
                Open in Maps
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
            <iframe
              title="Church location map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2237.3!2d6.9008766!3d4.8832034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069dbcb5d6ca3f3%3A0xd53fd6de46d82c1b!2sAssemblies%20Of%20God%20Church%20Choba%202!5e0!3m2!1sen!2sng!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block", minHeight: "360px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </motion.div>

        {/* ── FAQs ── */}
        <motion.div
          className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          {/* Left label */}
          <div className="flex flex-col gap-3">
            <p className="font-body text-white/45 text-xs tracking-widest uppercase">
              Plan your visit
            </p>
            <p className="font-heading text-white font-black text-3xl sm:text-4xl leading-tight">
              First time?
              <br />
              We&apos;ve got you.
            </p>
            <p className="font-body text-white/55 text-sm leading-relaxed mt-2 max-w-xs">
              Here are answers to the questions most people have before they
              walk through the door.
            </p>
            <motion.a
              href="/contact"
              className="mt-2 self-start font-body text-white/50 text-sm hover:text-white transition-colors underline underline-offset-4"
              whileHover={{ x: 4 }}
            >
              Still have questions? Contact us →
            </motion.a>
          </div>

          {/* FAQ accordion */}
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div
                  key={faq.q}
                  className="overflow-hidden"
                  style={{
                    background: isOpen
                      ? "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)"
                      : "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    border: `1px solid ${isOpen ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: "16px",
                    transition: "background 0.3s, border-color 0.3s",
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.25 + i * 0.07, duration: 0.4 }}
                  whileHover={{ scale: isOpen ? 1 : 1.01 }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 group"
                  >
                    <span className="font-body text-white font-semibold text-sm sm:text-base group-hover:text-white/80 transition-colors">
                      {faq.q}
                    </span>
                    <motion.div
                      className="w-8 h-8 flex items-center justify-center flex-shrink-0 border border-white/25 group-hover:border-white/50 transition-colors"
                      style={{
                        borderRadius: "10px",
                        background: isOpen ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                      }}
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <span className="text-white/70 text-xl leading-none">+</span>
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-1 border-t border-white/10">
                          <p className="font-body text-white/70 text-sm leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          className="mt-16 sm:mt-20 relative overflow-hidden flex flex-col sm:flex-row sm:items-end justify-between gap-8 p-8 sm:p-10"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "24px",
            boxShadow: "0 12px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <motion.div
            className="absolute -bottom-12 -right-12 w-56 h-56 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl pointer-events-none"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="flex flex-col gap-2 relative z-10">
            <p className="font-body text-white/50 text-xs tracking-widest uppercase">
              We&apos;d love to meet you
            </p>
            <p className="font-heading text-white font-black text-3xl sm:text-4xl leading-tight">
              Come as you are.
              <br />
              Leave changed.
            </p>
          </div>
          <div className="flex gap-4 flex-wrap relative z-10">
            <motion.a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body font-semibold text-sm text-black bg-white px-7 py-3.5 transition-all duration-300 hover:bg-white/90"
              style={{ borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Get directions
            </motion.a>
            <motion.a
              href="/contact"
              className="inline-flex items-center gap-2 font-body font-semibold text-sm text-white/80 hover:text-white px-7 py-3.5 border-2 border-white/30 hover:border-white/60 transition-all duration-300"
              style={{ borderRadius: "12px" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Contact us
            </motion.a>
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
