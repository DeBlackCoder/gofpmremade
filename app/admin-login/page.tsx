"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { getDailyPhoto } from "@/lib/church-photos";

export default function AdminLoginPage() {
  const router = useRouter();
  const bgUrl = getDailyPhoto(11);
  const login = useAuthStore((s) => s.login);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ email, password });
      if (!isAdmin()) {
        await clearAuth();
        setError("You do not have permission to access admin.");
        return;
      }
      router.push("/admin-dashboard");
    } catch (err: any) {
      setError(err?.message || "Invalid password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-6">
      <div
        className="page-bg"
        style={
          { "--bg-url": `url(${bgUrl})`, opacity: 0.3 } as React.CSSProperties
        }
      />
      <div className="fixed inset-0 bg-gradient-to-br from-black/85 via-black/60 to-black/85 pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Assemblies Of God Church
          </span>
          <h1 className="font-heading text-white font-black text-4xl leading-none tracking-tight">
            Admin
          </h1>
          <p className="font-body text-white/40 text-sm mt-1">
            Enter your password to access the dashboard.
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
              placeholder="admin@yourchurch.com"
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
              autoFocus
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

        <a
          href="/"
          className="font-body text-white/25 text-xs hover:text-white/60 transition-colors"
        >
          ← Return to site
        </a>
      </div>
    </div>
  );
}
