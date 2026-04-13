"use client";

import { motion } from "framer-motion";
import { getDailyPhoto } from "@/lib/church-photos";
import { Button } from "@/components/ui/button";

// ─── Data ────────────────────────────────────────────────────────────────────

const serviceTimes = [
  { day: "Sunday", times: ["8:00 AM — First Service", "10:30 AM — Second Service"] },
  { day: "Wednesday", times: ["6:00 PM — Midweek Service"] },
  { day: "Friday", times: ["6:00 AM — Early Morning Prayer"] },
];

const details = [
  {
    label: "Address",
    value: "Assemblies Of God Church, Choba, Port Harcourt, Rivers State",
    href: "https://www.google.com/maps/place/Assemblies+Of+God+Church+Choba+2/@4.8832034,6.9008766,1123m",
  },
  { label: "Phone", value: "+234 801 234 5678", href: "tel:+2348012345678" },
  {
    label: "Email",
    value: "hello@agchurch.org",
    href: "mailto:hello@agchurch.org",
  },
  { label: "Parking", value: "Free on-site parking available", href: null },
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

// ─── Component ───────────────────────────────────────────────────────────────

export default function LocationPage() {
  const bgUrl = getDailyPhoto(6);

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

        {/* Intro + Details */}
        <motion.div
          className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
        >
          <p className="font-body text-white/70 text-sm sm:text-base leading-relaxed max-w-sm">
            We meet every week in Choba, Port Harcourt. Whether it&apos;s
            your first time or your hundredth, there is always a seat for you
            at this table.
          </p>

          <dl className="flex flex-col gap-5">
            {details.map((item, i) => (
              <motion.div
                key={item.label}
                className="flex flex-col border-t border-white/20 pt-4"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + i * 0.1, duration: 0.6 }}
              >
                <dt className="font-body text-white/45 text-xs tracking-widest uppercase mb-1">
                  {item.label}
                </dt>
                <dd>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-body text-white font-semibold text-sm sm:text-base hover:text-white/70 transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="font-body text-white font-semibold text-sm sm:text-base">
                      {item.value}
                    </span>
                  )}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>

        {/* ── Service Times ─────────────────────────────── */}
        <motion.div
          className="mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
        >
          <p className="font-body text-white/45 text-xs tracking-widest uppercase mb-5">
            Service times
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px border border-white/15 bg-white/15">
            {serviceTimes.map((s, i) => (
              <motion.div
                key={s.day}
                className="bg-black/35 backdrop-blur-sm px-6 py-7 flex flex-col gap-3 hover:bg-black/55 transition-colors duration-250"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.08, duration: 0.5 }}
              >
                <span className="font-heading text-white font-black text-xl leading-none">
                  {s.day}
                </span>
                <div className="flex flex-col gap-1">
                  {s.times.map((t) => (
                    <span
                      key={t}
                      className="font-body text-white/65 text-sm leading-relaxed"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Map embed ─────────────────────────────────── */}
        <motion.div
          className="mt-12 sm:mt-16 border border-white/15"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.7 }}
        >
          <iframe
            title="Church location map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2237.3!2d6.9008766!3d4.8832034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069dbcb5d6ca3f3%3A0xd53fd6de46d82c1b!2sAssemblies%20Of%20God%20Church%20Choba%202!5e0!3m2!1sen!2sng!4v1"
            width="100%"
            height="380"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        {/* ── FAQs ──────────────────────────────────────── */}
        <motion.div
          className="mt-12 sm:mt-16 border-t border-white/20 pt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <div>
            <p className="font-body text-white/45 text-xs tracking-widest uppercase mb-5">
              Plan your visit
            </p>
            <p className="font-body text-white/70 text-sm sm:text-base leading-relaxed max-w-sm">
              First time? Here are answers to the questions most people have
              before they walk through the door.
            </p>
          </div>

          <div>
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                className="border-t border-white/20 py-5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.25 + i * 0.08, duration: 0.5 }}
              >
                <p className="font-body text-white font-semibold text-sm mb-1.5">
                  {faq.q}
                </p>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
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
              We&apos;d love to meet you
            </p>
            <p className="font-heading text-white font-black text-2xl sm:text-3xl leading-tight">
              Come as you are.
              <br />
              Leave changed.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              className="border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none px-7"
              asChild
            >
              <a
                href="https://www.google.com/maps/place/Assemblies+Of+God+Church+Choba+2/@4.8832034,6.9008766,1123m"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get directions
              </a>
            </Button>
            <Button
              variant="ghost"
              className="text-white/55 hover:text-white hover:bg-transparent font-body tracking-wide rounded-none px-0 underline underline-offset-4"
              asChild
            >
              <a href="/contact">Contact us</a>
            </Button>
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
