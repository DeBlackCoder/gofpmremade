"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useVerifyPaymentMutation } from "@/lib/hooks/queries";

type VerifyState = "idle" | "verifying" | "success" | "failed";

function GivingVerifyContent() {
  const params = useSearchParams();
  const verifyMutation = useVerifyPaymentMutation();

  const [state, setState] = useState<VerifyState>("idle");
  const [message, setMessage] = useState("Preparing verification...");

  const reference = useMemo(() => {
    return (
      params.get("reference") ||
      params.get("trxref") ||
      params.get("tx_ref") ||
      ""
    );
  }, [params]);

  const providerStatus =
    params.get("status") || params.get("payment_status") || "";

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!reference) {
        setState("failed");
        setMessage("Missing payment reference in callback URL.");
        return;
      }

      try {
        setState("verifying");
        setMessage("Verifying payment, please wait...");

        const result = await verifyMutation.mutateAsync(reference);
        if (cancelled) return;

        const normalized = String(result.status || "").toUpperCase();

        if (normalized === "COMPLETED") {
          setState("success");
          setMessage(
            "Payment verified successfully. Thank you for your giving.",
          );
          return;
        }

        if (normalized === "FAILED") {
          setState("failed");
          setMessage("Payment was not successful. You can try again.");
          return;
        }

        setState("failed");
        setMessage(
          providerStatus
            ? `Payment is currently ${providerStatus}. Please refresh in a moment.`
            : "Payment is still pending confirmation. Please refresh shortly.",
        );
      } catch (error: unknown) {
        if (cancelled) return;
        setState("failed");
        setMessage(
          error instanceof Error ? error.message : "Could not verify payment.",
        );
      }
    }

    void verify();

    return () => {
      cancelled = true;
    };
  }, [providerStatus, reference, verifyMutation]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-2">
          Payment callback
        </p>
        <h1 className="font-heading text-white font-black text-3xl leading-none tracking-tight mb-4">
          {state === "success"
            ? "Payment confirmed"
            : state === "verifying"
              ? "Verifying payment"
              : "Payment status"}
        </h1>

        <p className="font-body text-white/70 text-sm leading-relaxed mb-5">
          {message}
        </p>

        {!!reference && (
          <p className="font-body text-white/45 text-xs mb-6 break-all">
            Reference: {reference}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Link
            href="/give"
            className="border border-white/30 px-5 py-2 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors"
          >
            Back to giving
          </Link>
          <Link
            href="/"
            className="font-body text-white/45 text-sm hover:text-white transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function GivingVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <p className="font-body text-white/70 text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <GivingVerifyContent />
    </Suspense>
  );
}
