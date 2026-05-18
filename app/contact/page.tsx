"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDailyPhoto } from "@/lib/church-photos";
import { API_BASE_URL } from "@/lib/constants/config";

const contactDetails = [
  {
    label: "Address",
    value: "God's Own Favour Prophetic Ministry, Eleme, Rivers State",
    href: "https://maps.google.com",
  },
  { label: "Phone", value: "+234 80 6626 7207", href: "tel:+2348066267207" },
  {
    label: "Email",
    value: "hello@gofpm.org",
    href: "mailto:hello@gofpm.org",
  },
  {
    label: "Service Times",
    value: "Sun 8 AM & 10:30 AM · Wed 6 PM",
    href: null,
  },
];

type FormState = "idle" | "sending" | "sent" | "error";

const inputClass =
  "bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:border-white/60 focus-visible:ring-0 rounded-none h-10";

export default function ContactPage() {
  const bgUrl = getDailyPhoto(3);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormState>("idle");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Logo watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true" style={{ zIndex: 0 }}>
        <img src="/logo.png" alt="" className="object-contain" style={{ width: "min(80vw, 700px)", height: "min(80vw, 700px)", opacity: 0.04, userSelect: "none" }} />
      </div>
      {/* Background */}

      {/* Content */}
      <div className="public-content relative flex flex-col items-center px-6 py-6 sm:px-10 sm:py-8" style={{ zIndex: 1 }}>
        {/* Heading */}
        <motion.h1
          className="font-heading mt-4 sm:mt-6 text-white font-black leading-[0.92] tracking-tight text-center"
          style={{ fontSize: "clamp(2.6rem, 10vw, 6rem)" }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Get in
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            touch.
          </motion.span>
        </motion.h1>

        {/* Body */}
        <motion.div
          className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 flex-1 w-full max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {/* Left — details */}
          <div className="flex flex-col gap-8">
            <p className="font-body text-white/70 text-sm sm:text-base leading-relaxed max-w-sm">
              We&apos;d love to hear from you. Reach out with any questions,
              prayer requests, or if you&apos;d simply like to know more about
              our community.
            </p>
            <dl className="flex flex-col gap-5">
              {contactDetails.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="flex flex-col border-t border-white/20 pt-4"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + i * 0.1, duration: 0.6 }}
                >
                  <dt className="font-body text-white/45 text-xs tracking-widest uppercase mb-1">
                    {item.label}
                  </dt>
                  <dd>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="font-body text-white font-semibold text-sm sm:text-base hover:text-white/70 transition-colors"
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
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
          </div>

          {/* Right — form */}
          <div className="p-6 sm:p-8" style={{
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}>
            {status === "sent" ? (
              <motion.div
                className="flex flex-col gap-3 py-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="font-body text-white/40 text-xs tracking-widest uppercase">
                  Message sent
                </span>
                <p className="font-heading text-white font-black text-3xl sm:text-4xl leading-tight">
                  Thank you,
                  <br />
                  {form.name.split(" ")[0] || "friend"}.
                </p>
                <p className="font-body text-white/65 text-sm leading-relaxed max-w-xs">
                  We&apos;ll get back to you as soon as we can. May God bless
                  your day.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "",
                      message: "",
                    });
                  }}
                  className="mt-4 self-start font-body text-white/60 text-sm underline underline-offset-4 hover:text-white transition-colors"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-body text-xs tracking-widest uppercase" style={{ color: "#D4AF37" }}>
                      Name
                    </label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-body text-xs tracking-widest uppercase" style={{ color: "#D4AF37" }}>
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Phone + Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-body text-xs tracking-widest uppercase" style={{ color: "#D4AF37" }}>
                      Phone{" "}
                      <span className="normal-case opacity-50">(optional)</span>
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+234 800 000 0000"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-body text-xs tracking-widest uppercase" style={{ color: "#D4AF37" }}>
                      Subject
                    </label>
                    <Select
                      value={form.subject}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, subject: v }))
                      }
                    >
                      <SelectTrigger
                        className={`${inputClass} w-full data-[size=default]:h-10`}
                      >
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General inquiry</SelectItem>
                        <SelectItem value="prayer">Prayer request</SelectItem>
                        <SelectItem value="membership">Membership</SelectItem>
                        <SelectItem value="events">
                          Events &amp; programs
                        </SelectItem>
                        <SelectItem value="pastoral">Pastoral care</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <label className="font-body text-xs tracking-widest uppercase" style={{ color: "#D4AF37" }}>
                    Message
                  </label>
                  <Textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Write your message here…"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:border-white/60 focus-visible:ring-0 rounded-none resize-none"
                  />
                </div>

                {/* Error */}
                {status === "error" && (
                  <p className="font-body text-red-400 text-sm">
                    Something went wrong. Please try again.
                  </p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={status === "sending"}
                  variant="outline"
                  className="mt-1 self-start gap-2 border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none px-7"
                >
                  {status === "sending" && (
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                  {status === "sending" ? "Sending…" : "Send message"}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
