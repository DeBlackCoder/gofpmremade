"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useInitiateDonationMutation,
  useVerifyPaymentMutation,
} from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/stores/uiStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { getDailyPhoto } from "@/lib/church-photos";

type GivingType =
  | "Tithe"
  | "Offering"
  | "Mission"
  | "Building Fund"
  | "Welfare";
type Frequency = "One-time" | "Weekly" | "Monthly";
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
const frequencies: Frequency[] = ["One-time", "Weekly", "Monthly"];

const inputClass =
  "bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:border-white/60 focus-visible:ring-0 rounded-none h-10";

export default function GivePage() {
  const bgUrl = getDailyPhoto(4);
  const user = useAuthStore((s) => s.user);
  const addToast = useUiStore((s) => s.addToast);

  // Real API mutations
  const initiateMutation = useInitiateDonationMutation();
  const verifyMutation = useVerifyPaymentMutation();

  // Form state
  const [step, setStep] = useState<Step>("amount");
  const [givingType, setGivingType] = useState<GivingType>("Tithe");
  const [frequency, setFrequency] = useState<Frequency>("One-time");
  const [preset, setPreset] = useState<number | null>(null);
  const [customAmt, setCustomAmt] = useState("");
  const [fullName, setFullName] = useState(user?.fullName || (user as any)?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");
  const [method, setMethod] = useState<"bank" | "card">("card");
  const [submitting, setSubmitting] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Bank details for transfers
  const bankDetails = [
    {
      bank: "Zenith Bank",
      account: "1010899365",
      name: "Assemblies of God Church",
    },
    { bank: "GTBank", account: "0211277651", name: "Assemblies of God Church" },
    {
      bank: "Access Bank",
      account: "0720891840",
      name: "Assemblies of God Church",
    },
  ];

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

    setStep("processing");
    try {
      const result = await initiateMutation.mutateAsync({
        amount,
        type: givingType,
        frequency,
        fullName,
        email,
        phone,
        note,
        redirectUrl: window.location.href,
      });

      // Payment URL generated
      if (result.paymentUrl) {
        setReference(result.reference);
        // Redirect to payment gateway
        window.location.href = result.paymentUrl;
      } else {
        setStep("done");
        addToast({
          type: "success",
          message: "Donation initiated! Check your email for payment link",
        });
      }
    } catch (error: any) {
      setStep("confirm");
      addToast({
        type: "error",
        message: error?.message || "Failed to initiate donation",
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
    setReference("");
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await handleInitiateDonation();
    } finally {
      setSubmitting(false);
    }
  };

  const copyAccount = async (account: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(account);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      addToast({ type: "error", message: "Failed to copy" });
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
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-white/45 text-xs tracking-widest uppercase">
                      Frequency
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {frequencies.map((f) => (
                        <button
                          key={f}
                          onClick={() => setFrequency(f)}
                          className={`font-body text-xs tracking-widest uppercase px-3 py-1.5 border transition-all duration-200 ${
                            frequency === f
                              ? "bg-white text-black border-transparent"
                              : "border-white/25 text-white/60 hover:border-white/50 hover:text-white"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

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
                      {(["bank", "card"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMethod(m)}
                          className={`font-body text-xs tracking-widest uppercase px-4 py-1.5 border transition-all duration-200 ${
                            method === m
                              ? "bg-white text-black border-transparent"
                              : "border-white/25 text-white/60 hover:border-white/50 hover:text-white"
                          }`}
                        >
                          {m === "bank" ? "Bank transfer" : "Card"}
                        </button>
                      ))}
                    </div>
                    {method === "card" && (
                      <p className="font-body text-white/40 text-xs mt-1 leading-relaxed">
                        Card payments are processed securely via Paystack.
                        You'll be redirected after confirmation.
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
                      { label: "Frequency", value: frequency },
                      { label: "Name", value: fullName },
                      { label: "Email", value: email },
                      {
                        label: "Method",
                        value: method === "bank" ? "Bank transfer" : "Card",
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

                  {/* Bank details (if bank method) */}
                  {method === "bank" && (
                    <div className="flex flex-col gap-3">
                      <p className="font-body text-white/45 text-xs tracking-widest uppercase">
                        Transfer to any of these accounts
                      </p>
                      <div className="flex flex-col gap-2">
                        {bankDetails.map((b, idx) => (
                          <div
                            key={b.bank}
                            className="border border-white/15 bg-white/5 px-4 py-3 flex items-center justify-between gap-4"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="font-body text-white/40 text-[10px] tracking-widests uppercase">
                                {b.bank}
                              </span>
                              <span className="font-body text-white font-semibold text-sm tracking-wider">
                                {b.account}
                              </span>
                              <span className="font-body text-white/50 text-[10px]">
                                {b.name}
                              </span>
                            </div>
                            <button
                              onClick={() => copyAccount(b.account, idx)}
                              className="font-body text-[10px] tracking-widests uppercase border border-white/25 px-3 py-1.5 text-white/50 hover:bg-white hover:text-black hover:border-transparent transition-colors flex-shrink-0"
                            >
                              {copiedIdx === idx ? "Copied!" : "Copy"}
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="font-body text-white/35 text-xs leading-relaxed">
                        After transferring, click the button below to notify us
                        and receive your giving acknowledgement.
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleConfirm}
                    disabled={submitting}
                    variant="outline"
                    className="self-start border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none px-8 gap-2"
                  >
                    {submitting && (
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    )}
                    {submitting
                      ? "Processing…"
                      : method === "bank"
                        ? "I've sent the transfer"
                        : "Proceed to payment"}
                  </Button>
                </motion.div>
              )}

              {/* STEP 4 — Done */}
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
                    Your {givingType.toLowerCase()} of {displayAmount} has been
                    recorded. A confirmation will be sent to {email}. May God
                    multiply what you have sown.
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
                      <a href="/">Return home</a>
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
                "Each of you should give what you have decided in your heart to
                give, not reluctantly or under compulsion, for God loves a
                cheerful giver."
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
                Your financial information is never stored on our servers. Bank
                transfers go directly to our verified church account.
              </p>
            </div>
          </motion.div>
        </motion.div>

        <div className="h-16" />
      </div>
    </section>
  );
}
