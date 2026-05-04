"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDailyPhoto } from "@/lib/church-photos";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const bgUrl = getDailyPhoto(11);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json() as { success?: boolean; error?: string };

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid credentials.");
        return;
      }

      router.push("/admin-dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-6">
      {/* Fixed background */}
      <div
        className="page-bg"
        style={
          { "--bg-url": `url(${bgUrl})`, opacity: 0.3 } as React.CSSProperties
        }
      />
      <div className="fixed inset-0 bg-linear-to-br from-black/85 via-black/60 to-black/85 pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Assemblies Of God Church
          </span>
          <h1 className="font-heading text-white font-black text-4xl leading-none tracking-tight">
            Admin
          </h1>
          <p className="font-body text-white/40 text-sm mt-1">
            Sign in with your admin credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-white/40 text-[10px] tracking-widest uppercase">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-body text-white/40 text-[10px] tracking-widest uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>

          {error && <p className="font-body text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 border border-white/30 px-6 py-2.5 font-body font-semibold text-sm text-white tracking-wide hover:bg-white hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <Link
          href="/"
          className="font-body text-white/25 text-xs hover:text-white/60 transition-colors"
        >
          ← Return to site
        </Link>
      </div>
    </div>
  );
}
