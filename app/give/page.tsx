"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInitiateDonationMutation } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/stores/uiStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { getDailyPhoto } from "@/lib/church-photos";
import { API_BASE_URL } from "@/lib/constants/config";
import Link from "next/link";

type GivingType =
  | "Tithe"
  | "Offering"
  | "Mission"
  | "Building Fund"
  | "Welfare";
type Frequency = "One-time";
type Step = "amount" | "details" | "confirm" | "processing" | "done";

interface GivingOption {
  type: GivingType;
  description: string;
  scripture: string;
}

const givingOptions: GivingOption[] = [
  {
    type: "Tithe",
    description:
      "Return a tenth of your income as an act of worship and trust in God's provision.",
    scripture: "Malachi 3:10",
  },
  {
    type: "Offering",
    description:
      "Give freely above your tithe — an expression of gratitude for all God has done.",
    scripture: "2 Corinthians 9:7",
  },
  {
    type: "Mission",
    description:
      "Support our local and international outreach efforts taking the Gospel further.",
    scripture: "Matthew 28:19",
  },
  {
    type: "Building Fund",
    description:
      "Help us build and maintain a house of worship worthy of His presence.",
    scripture: "1 Chronicles 29:14",
  },
  {
    type: "Welfare",
    description: "Directly support members of our community facing hardship.",
    scripture: "Proverbs 19:17",
  },
];

const presetAmounts = [1000, 2500, 5000, 10000, 25000];
const inputClass =
  "bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:border-white/60 focus-visible:ring-0 rounded-none h-10";

export default function GivePage() {
  const bgUrl = getDailyPhoto(4);
  const user = useAuthStore((s) => s.user);
  const addToast = useUiStore((s) => s.addToast);

  // Real API mutations
  const initiateMutation = useInitiateDonationMutation();

  // Form state
  const [step, setStep] = useState<Step>("amount");
  const [givingType, setGivingType] = useState<GivingType>("Tithe");
  const [frequency, setFrequency] = useState<Frequency>("One-time");
  const [preset, setPreset] = useState<number | null>(null);
  const [customAmt, setCustomAmt] = useState("");
  const [fullName, setFullName] = useState(
    user?.fullName || (user as any)?.name || "",
  );
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");
  const [method, setMethod] = useState<"PAYSTACK" | "FLUTTERWAVE">("PAYSTACK");
  const [submitting, setSubmitting] = useState(false);
  const [completionMessage, setCompletionMessage] = useState(
    "Your gift has been recorded.",
  );

  const amount =
    preset ?? (customAmt ? parseInt(customAmt.replace(/\D/g, ""), 10) : 0);
  const displayAmount = amount ? `₦${amount.toLocaleString()}` : "₦0";

  const handleInitiateDonation = async () => {
    if (!fullName || !email || !amount) {
      addToast({
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    console.info("[GiveFlow] initiate:start", {
      method,
      amount,
      givingType,
      frequency,
      hasEmail: !!email,
      hasName: !!fullName,
      apiBaseUrl: API_BASE_URL,
    });

    setStep("processing");
    try {
      const result = await Promise.race([
        initiateMutation.mutateAsync({
          amount,
          type: givingType,
          frequency,
          fullName,
          email,
          phone,
          note,
          method,
          redirectUrl: window.location.href,
        }),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error("Payment initialization timed out after 15s"));
          }, 15000);
        }),
      ]);

      console.info("[GiveFlow] initiate:response", {
        method: result.method,
        status: result.status,
        reference: result.reference,
        hasPaymentUrl: !!result.paymentUrl,
        paymentUrlPreview: result.paymentUrl
          ? String(result.paymentUrl).slice(0, 80)
          : null,
      });

      // Payment URL generated
      if (result.paymentUrl && /^https?:\/\//i.test(result.paymentUrl)) {
        setReference(result.reference);
        setCompletionMessage("Redirecting to secure payment checkout...");
        console.info("[GiveFlow] redirect:attempt", {
          reference: result.reference,
          method,
          url: result.paymentUrl,
        });
        window.location.assign(result.paymentUrl);
      } else {
        console.warn("[GiveFlow] redirect:missing-or-invalid-url", {
          reference: result.reference,
          method,
          paymentUrl: result.paymentUrl ?? null,
        });
        setStep("confirm");
        addToast({
          type: "error",
          message:
            "Could not open payment checkout. Please confirm your payment method and try again.",
        });
      }
    } catch (error: any) {
      console.error("[GiveFlow] initiate:error", {
        method,
        message: error?.message || "Unknown error",
        details: error?.details || null,
        apiBaseUrl: API_BASE_URL,
      });
      setStep("confirm");
      addToast({
        type: "error",
        message:
          error?.message ||
          "Failed to reach payment server. Check API URL / ngrok and try again.",
      });
    }
  };

  const resetDonation = () => {
    setStep("amount");
    setPreset(null);
    setCustomAmt("");
    setFullName(user?.fullName || (user as any)?.name || "");
    setEmail(user?.email || "");
    setPhone("");
    setNote("");
    setGivingType("Tithe");
    setFrequency("One-time");
    setMethod("PAYSTACK");
    setReference("");
    setCompletionMessage("Your gift has been recorded.");
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await handleInitiateDonation();
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    resetDonation();
  };

  const selectedOption = givingOptions.find((o) => o.type === givingType)!;

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
            Give with
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            a glad heart.
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-4 font-body text-white/60 text-sm sm:text-base leading-relaxed max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          Every gift, no matter the size, fuels the work of God in Port Harcourt
          and beyond.
        </motion.p>

        {/* Step indicator */}
        {step !== "done" && (
          <motion.div
            className="mt-7 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.5 }}
          >
            {(["amount", "details", "confirm"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-1.5 ${step === s ? "opacity-100" : "opacity-35"}`}
                >
                  <span
                    className={`w-5 h-5 flex items-center justify-center border text-[10px] font-body font-semibold transition-colors ${
                      step === s
                        ? "border-white bg-white text-black"
                        : "border-white/40 text-white/50"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="font-body text-white text-[10px] tracking-widest uppercase hidden sm:block">
                    {s === "amount"
                      ? "Amount"
                      : s === "details"
                        ? "Your details"
                        : "Confirm"}
                  </span>
                </div>
                {i < 2 && <span className="w-6 h-px bg-white/20" />}
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Main Grid ─────────────────────────────────── */}
        <motion.div
          className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-14 flex-1"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          {/* ── Left — Form Steps ── */}
          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              {/* STEP 1 — Amount */}
              {step === "amount" && (
                <motion.div
                  key="amount"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col gap-7"
                >
                  {/* Giving type */}
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-white/45 text-xs tracking-widest uppercase">
                      Giving type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {givingOptions.map((o) => (
                        <button
                          key={o.type}
                          onClick={() => setGivingType(o.type)}
                          className={`font-body text-xs tracking-widest uppercase px-3 py-1.5 border transition-all duration-200 ${
                            givingType === o.type
                              ? "bg-white text-black border-transparent"
                              : "border-white/25 text-white/60 hover:border-white/50 hover:text-white"
                          }`}
                        >
                          {o.type}
                        </button>
                      ))}
                    </div>
                    <p className="font-body text-white/45 text-xs leading-relaxed mt-1 max-w-sm">
                      {selectedOption.description}{" "}
                      <span className="italic text-white/30">
                        {selectedOption.scripture}
                      </span>
                    </p>
                  </div>

                  {/* Frequency */}
                  {/* <div className="flex flex-col gap-2">
                    <label className="font-body text-white/45 text-xs tracking-widest uppercase">
                      Frequency
                    </label>
                    <div className="inline-flex items-center gap-2 border border-white/25 px-3 py-1.5 text-white/80 text-xs tracking-widest uppercase w-fit">
                      One-time giving only
                    </div>
                    <p className="font-body text-white/35 text-xs leading-relaxed max-w-sm">
                      Recurring giving options are intentionally disabled for
                      this church flow.
                    </p>
                  </div> */}

                  {/* Preset amounts */}
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-white/45 text-xs tracking-widest uppercase">
                      Select amount
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {presetAmounts.map((a) => (
                        <button
                          key={a}
                          onClick={() => {
                            setPreset(a);
                            setCustomAmt("");
                          }}
                          className={`font-body text-xs font-semibold py-2.5 border transition-all duration-200 ${
                            preset === a
                              ? "bg-white text-black border-transparent"
                              : "border-white/25 text-white/70 hover:border-white/50 hover:text-white"
                          }`}
                        >
                          ₦{a.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom amount */}
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-white/45 text-xs tracking-widest uppercase">
                      Or enter custom amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-white/40 text-sm">
                        ₦
                      </span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={customAmt}
                        onChange={(e) => {
                          setCustomAmt(e.target.value.replace(/\D/g, ""));
                          setPreset(null);
                        }}
                        className={`${inputClass} pl-7 max-w-xs`}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => amount > 0 && setStep("details")}
                    disabled={amount <= 0}
                    variant="outline"
                    className="self-start mt-2 border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none px-8 disabled:opacity-30"
                  >
                    Continue →
                  </Button>
                </motion.div>
              )}

              {/* STEP 2 — Details */}
              {step === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col gap-5"
                >
                  <button
                    onClick={() => setStep("amount")}
                    className="self-start font-body text-white/40 text-xs tracking-wide hover:text-white transition-colors"
                  >
                    ← Back
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-body text-white/45 text-xs tracking-widest uppercase">
                        Full name
                      </label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-body text-white/45 text-xs tracking-widest uppercase">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-body text-white/45 text-xs tracking-widest uppercase">
                      Phone{" "}
                      <span className="normal-case opacity-50">(optional)</span>
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className={`${inputClass} max-w-xs`}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-body text-white/45 text-xs tracking-widest uppercase">
                      Note{" "}
                      <span className="normal-case opacity-50">(optional)</span>
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder="Any message for the church..."
                      className="bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-white/60 px-3 py-2.5 font-body text-sm resize-none"
                    />
                  </div>

                  {/* Payment method */}
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="font-body text-white/45 text-xs tracking-widest uppercase">
                      Payment method
                    </label>
                    <div className="flex gap-2">
                      {(["PAYSTACK", "FLUTTERWAVE"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMethod(m)}
                          className={`font-body text-xs tracking-widest uppercase px-4 py-1.5 border transition-all duration-200 ${
                            method === m
                              ? "bg-white text-black border-transparent"
                              : "border-white/25 text-white/60 hover:border-white/50 hover:text-white"
                          }`}
                        >
                          {m === "PAYSTACK" ? "Paystack" : "Flutterwave"}
                        </button>
                      ))}
                    </div>
                    {method === "PAYSTACK" && (
                      <p className="font-body text-white/40 text-xs mt-1 leading-relaxed">
                        Paystack checkout will open after you confirm.
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() =>
                      fullName.trim() && email.trim() && setStep("confirm")
                    }
                    disabled={!fullName.trim() || !email.trim()}
                    variant="outline"
                    className="self-start mt-2 border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none px-8 disabled:opacity-30"
                  >
                    Review gift →
                  </Button>
                </motion.div>
              )}

              {/* STEP 3 — Confirm */}
              {step === "confirm" && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col gap-6"
                >
                  <button
                    onClick={() => setStep("details")}
                    className="self-start font-body text-white/40 text-xs tracking-wide hover:text-white transition-colors"
                  >
                    ← Back
                  </button>

                  {/* Summary card */}
                  <div className="border border-white/15 backdrop-blur-sm bg-white/5 divide-y divide-white/10">
                    {[
                      { label: "Amount", value: displayAmount },
                      { label: "Giving type", value: givingType },
                      // { label: "Frequency", value: frequency },
                      { label: "Name", value: fullName },
                      { label: "Email", value: email },
                      {
                        label: "Method",
                        value:
                          method === "PAYSTACK" ? "Paystack" : "Flutterwave",
                      },
                      ...(note ? [{ label: "Note", value: note }] : []),
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex justify-between gap-4 px-5 py-3"
                      >
                        <span className="font-body text-white/40 text-xs tracking-widest uppercase flex-shrink-0">
                          {label}
                        </span>
                        <span className="font-body text-white text-xs text-right">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleConfirm}
                    disabled={submitting}
                    variant="outline"
                    className="self-start border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none px-8 gap-2"
                  >
                    {submitting && (
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    )}
                    {submitting ? "Processing…" : "Proceed to payment"}
                  </Button>
                </motion.div>
              )}

              {/* STEP 4 — Processing */}
              {step === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col gap-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <p className="font-body text-white/70 text-sm">
                      Preparing secure checkout...
                    </p>
                  </div>

                  <p className="font-body text-white/45 text-xs leading-relaxed max-w-sm">
                    If this takes more than a few seconds, click back and try
                    again. We will not charge you until checkout completes.
                  </p>

                  {reference ? (
                    <p className="font-body text-white/35 text-xs break-all">
                      Reference: {reference}
                    </p>
                  ) : null}

                  <Button
                    onClick={() => setStep("confirm")}
                    variant="ghost"
                    className="self-start text-white/50 hover:text-white hover:bg-transparent font-body text-sm tracking-wide rounded-none px-0 underline underline-offset-4"
                  >
                    Back to confirmation
                  </Button>
                </motion.div>
              )}

              {/* STEP 5 — Done */}
              {step === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col gap-5 py-4"
                >
                  <span className="font-body text-white/40 text-xs tracking-widest uppercase">
                    Gift received
                  </span>
                  <p
                    className="font-heading text-white font-black leading-[0.92] tracking-tight"
                    style={{ fontSize: "clamp(2rem, 7vw, 4rem)" }}
                  >
                    Thank you,
                    <br />
                    {fullName.split(" ")[0] || "friend"}.
                  </p>
                  <p className="font-body text-white/65 text-sm leading-relaxed max-w-sm">
                    {completionMessage}
                  </p>
                  <div className="flex gap-3 flex-wrap mt-2">
                    <Button
                      variant="outline"
                      onClick={reset}
                      className="border-white/40 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none px-7"
                    >
                      Give again
                    </Button>
                    <Button
                      variant="ghost"
                      asChild
                      className="text-white/50 hover:text-white hover:bg-transparent font-body text-sm tracking-wide rounded-none px-0 underline underline-offset-4"
                    >
                      <Link href="/">Return home</Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right — Scripture + Impact sidebar ── */}
          <motion.div
            className="flex flex-col gap-8 lg:pt-1"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
          >
            {/* Live amount display */}
            {step !== "done" && (
              <div className="border-t border-white/20 pt-5">
                <p className="font-body text-white/35 text-[10px] tracking-widests uppercase mb-1">
                  Your gift
                </p>
                <p
                  className="font-heading text-white font-black leading-none tracking-tight"
                  style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
                >
                  {displayAmount}
                </p>
                <p className="font-body text-white/40 text-xs mt-1">
                  {frequency} · {givingType}
                </p>
              </div>
            )}

            {/* Scripture pull-quote */}
            <div className="border-l-2 border-white/25 pl-4">
              <p className="font-heading text-white/85 font-black text-lg sm:text-xl leading-snug italic">
                &quot;Each of you should give what you have decided in your
                heart to give, not reluctantly or under compulsion, for God
                loves a cheerful giver.&quot;
              </p>
              <p className="font-body text-white/35 text-xs mt-2 tracking-wide">
                2 Corinthians 9:7
              </p>
            </div>

            {/* Impact breakdown */}
            <div className="flex flex-col gap-0">
              <p className="font-body text-white/35 text-[10px] tracking-widest uppercase mb-3">
                Where your giving goes
              </p>
              {[
                { label: "Worship & ministry", pct: 35 },
                { label: "Community outreach", pct: 25 },
                { label: "Building & operations", pct: 20 },
                { label: "Missions & evangelism", pct: 15 },
                { label: "Welfare fund", pct: 5 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 border-t border-white/15 py-2.5"
                >
                  <span className="font-body text-white/55 text-xs flex-1">
                    {item.label}
                  </span>
                  <div className="w-24 h-px bg-white/10 relative">
                    <div
                      className="absolute inset-y-0 left-0 bg-white/40"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <span className="font-body text-white/40 text-[10px] w-6 text-right">
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>

            {/* Security note */}
            <div className="flex items-start gap-2 border border-white/10 px-3 py-3 bg-white/5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white/30 mt-0.5 flex-shrink-0"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <p className="font-body text-white/35 text-[10px] leading-relaxed">
                Your financial information is never stored on our servers. All
                payments are processed through Paystack or Flutterwave.
              </p>
            </div>
          </motion.div>
        </motion.div>

        <div className="h-16" />
      </div>
    </section>
  );
}
