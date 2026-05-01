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

        {/* Enhanced Step indicator */}
        {step !== "done" && (
          <motion.div
            className="mt-8 flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.5 }}
          >
            {(["amount", "details", "confirm"] as Step[]).map((s, i) => {
              const stepIndex = ["amount", "details", "confirm"].indexOf(step);
              const currentIndex = ["amount", "details", "confirm"].indexOf(s);
              const isCompleted = currentIndex < stepIndex;
              const isCurrent = step === s;
              
              return (
                <div key={s} className="flex items-center gap-2 sm:gap-3">
                  <motion.div
                    className={`flex items-center gap-2 transition-all duration-300 ${
                      isCurrent ? "opacity-100 scale-105" : isCompleted ? "opacity-70" : "opacity-35"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-body font-bold transition-all duration-300 ${
                        isCurrent
                          ? "border-2 border-white bg-white text-black shadow-lg shadow-white/20"
                          : isCompleted
                            ? "border-2 border-white/60 bg-white/20 text-white"
                            : "border border-white/30 text-white/50"
                      }`}
                      style={{ borderRadius: "8px" }}
                    >
                      {isCompleted ? "✓" : i + 1}
                    </span>
                    <span className={`font-body text-[11px] tracking-widest uppercase hidden sm:block transition-colors ${
                      isCurrent ? "text-white font-semibold" : "text-white/60"
                    }`}>
                      {s === "amount"
                        ? "Amount"
                        : s === "details"
                          ? "Your details"
                          : "Confirm"}
                    </span>
                  </motion.div>
                  {i < 2 && (
                    <div className="relative w-8 sm:w-12 h-0.5 bg-white/15">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-white/50"
                        initial={{ width: "0%" }}
                        animate={{ width: isCompleted ? "100%" : "0%" }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
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
                  {/* Enhanced Giving type buttons */}
                  <div className="flex flex-col gap-3">
                    <label className="font-body text-white/50 text-xs tracking-widest uppercase">
                      Giving type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {givingOptions.map((o) => (
                        <motion.button
                          key={o.type}
                          onClick={() => setGivingType(o.type)}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className={`font-body text-xs tracking-widest uppercase px-4 py-3 border transition-all duration-300 ${
                            givingType === o.type
                              ? "bg-white text-black border-white shadow-lg shadow-white/20"
                              : "border-white/25 text-white/70 hover:border-white/50 hover:text-white hover:bg-white/5"
                          }`}
                          style={{ borderRadius: "10px" }}
                        >
                          {o.type}
                        </motion.button>
                      ))}
                    </div>
                    <motion.div
                      key={givingType}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 border-l-2 border-white/30"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: "0 8px 8px 0",
                      }}
                    >
                      <p className="font-body text-white/60 text-sm leading-relaxed">
                        {selectedOption.description}
                      </p>
                      <p className="font-body text-white/35 text-xs italic mt-2">
                        {selectedOption.scripture}
                      </p>
                    </motion.div>
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

                  {/* Enhanced Preset amounts */}
                  <div className="flex flex-col gap-3">
                    <label className="font-body text-white/50 text-xs tracking-widest uppercase">
                      Select amount
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {presetAmounts.map((a) => (
                        <motion.button
                          key={a}
                          onClick={() => {
                            setPreset(a);
                            setCustomAmt("");
                          }}
                          whileHover={{ scale: 1.05, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          className={`font-body text-sm font-bold py-4 border-2 transition-all duration-300 relative overflow-hidden ${
                            preset === a
                              ? "bg-white text-black border-white shadow-xl shadow-white/25"
                              : "border-white/30 text-white/80 hover:border-white/60 hover:text-white hover:bg-white/10"
                          }`}
                          style={{ borderRadius: "12px" }}
                        >
                          <span className="relative z-10">₦{a.toLocaleString()}</span>
                          {preset === a && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Custom amount */}
                  <div className="flex flex-col gap-3">
                    <label className="font-body text-white/50 text-xs tracking-widest uppercase">
                      Or enter custom amount
                    </label>
                    <div className="relative max-w-md">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-white/50 text-lg font-semibold">
                        ₦
                      </span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter amount"
                        value={customAmt}
                        onChange={(e) => {
                          setCustomAmt(e.target.value.replace(/\D/g, ""));
                          setPreset(null);
                        }}
                        className="bg-white/10 border-2 border-white/25 text-white text-lg font-semibold placeholder:text-white/30 focus-visible:border-white/70 focus-visible:ring-0 focus-visible:bg-white/15 rounded-xl h-14 pl-10 transition-all duration-300"
                      />
                      {customAmt && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() => setCustomAmt("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.2" />
                            <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => amount > 0 && setStep("details")}
                      disabled={amount <= 0}
                      variant="outline"
                      className="self-start mt-4 border-2 border-white/60 text-white bg-white/10 hover:bg-white hover:text-black font-body font-semibold tracking-wide rounded-xl px-10 py-6 text-base disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Continue to details →
                    </Button>
                  </motion.div>
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

                  {/* Payment method — disabled until Paystack/Flutterwave integration is live
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
                  */}

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
                  <div className="divide-y divide-white/10" style={{
                    background: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "16px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.28)",
                    overflow: "hidden",
                  }}>
                    {[
                      { label: "Amount", value: displayAmount },
                      { label: "Giving type", value: givingType },
                      // { label: "Frequency", value: frequency },
                      { label: "Name", value: fullName },
                      { label: "Email", value: email },
                      // Method row hidden — Paystack/Flutterwave integration disabled
                      // {
                      //   label: "Method",
                      //   value:
                      //     method === "PAYSTACK" ? "Paystack" : "Flutterwave",
                      // },
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
            {/* Enhanced Live amount display */}
            {step !== "done" && (
              <motion.div
                className="p-6"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: "20px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-body text-white/40 text-[10px] tracking-widest uppercase mb-2">
                  Your gift
                </p>
                <motion.p
                  key={displayAmount}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="font-heading text-white font-black leading-none tracking-tight"
                  style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)" }}
                >
                  {displayAmount}
                </motion.p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-2 py-1 bg-white/15 border border-white/20 font-body text-white/70 text-[10px] tracking-wider uppercase" style={{ borderRadius: "6px" }}>
                    {frequency}
                  </span>
                  <span className="px-2 py-1 bg-white/15 border border-white/20 font-body text-white/70 text-[10px] tracking-wider uppercase" style={{ borderRadius: "6px" }}>
                    {givingType}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Enhanced Scripture pull-quote */}
            <motion.div
              className="pl-6 py-5 pr-5"
              style={{
                background: "linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderLeft: "3px solid rgba(255,255,255,0.35)",
                borderRadius: "0 16px 16px 0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-heading text-white/90 font-black text-lg sm:text-xl leading-snug italic">
                &quot;Each of you should give what you have decided in your
                heart to give, not reluctantly or under compulsion, for God
                loves a cheerful giver.&quot;
              </p>
              <p className="font-body text-white/40 text-xs mt-3 tracking-wide">
                2 Corinthians 9:7
              </p>
            </motion.div>

            {/* Enhanced Impact breakdown */}
            <motion.div
              className="flex flex-col gap-0"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
                padding: "1.25rem 1.5rem",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <p className="font-body text-white/40 text-[10px] tracking-widest uppercase mb-4">
                Where your giving goes
              </p>
              {[
                { label: "Worship & ministry", pct: 35, color: "rgba(59, 130, 246, 0.6)" },
                { label: "Community outreach", pct: 25, color: "rgba(16, 185, 129, 0.6)" },
                { label: "Building & operations", pct: 20, color: "rgba(245, 158, 11, 0.6)" },
                { label: "Missions & evangelism", pct: 15, color: "rgba(139, 92, 246, 0.6)" },
                { label: "Welfare fund", pct: 5, color: "rgba(236, 72, 153, 0.6)" },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-3 border-t border-white/10 py-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + idx * 0.1, duration: 0.4 }}
                >
                  <span className="font-body text-white/65 text-xs flex-1">
                    {item.label}
                  </span>
                  <div className="w-28 h-1.5 bg-white/10 relative overflow-hidden" style={{ borderRadius: "4px" }}>
                    <motion.div
                      className="absolute inset-y-0 left-0"
                      style={{ background: item.color, borderRadius: "4px" }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ delay: 1.4 + idx * 0.1, duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className="font-body text-white/50 text-xs font-semibold w-8 text-right">
                    {item.pct}%
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Security note — hidden until Paystack/Flutterwave integration is live
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
            */}
          </motion.div>
        </motion.div>

        <div className="h-16" />
      </div>
    </section>
  );
}
