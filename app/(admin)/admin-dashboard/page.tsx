"use client";

import AdminTour from "@/components/admin/AdminTour";
import Link from "next/link";
import { useEffect, useState } from "react";
import { projects as defaultProjects } from "@/lib/projects-data";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: string | number;
  sub?: string;
  href: string;
  status: "live" | "local" | "loading" | "offline";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchCount(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const data = await res.json();
    // Handle paginated responses: { data: [...], total: N } or { data: [...] }
    if (typeof data?.total === "number") return data.total;
    if (typeof data?.pagination?.total === "number") return data.pagination.total;
    if (Array.isArray(data?.data)) return data.data.length;
    if (Array.isArray(data)) return data.length;
    return null;
  } catch {
    return null;
  }
}

async function fetchPodcastCount(): Promise<number | null> {
  try {
    const res = await fetch(`/api/podcast-feed`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.episodes?.length ?? null;
  } catch {
    return null;
  }
}

async function fetchYouTubeCount(): Promise<number | null> {
  try {
    const res = await fetch(`/api/youtube-feed`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.videos?.length ?? null;
  } catch {
    return null;
  }
}

// ─── Glass style ──────────────────────────────────────────────────────────────

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "14px",
};

// ─── Status dot ───────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: StatCard["status"] }) {
  const colors: Record<StatCard["status"], string> = {
    live: "bg-emerald-400",
    local: "bg-sky-400",
    loading: "bg-white/30 animate-pulse",
    offline: "bg-yellow-400/60",
  };
  return <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors[status]}`} />;
}

// ─── Quick actions ────────────────────────────────────────────────────────────

const quickActions = [
  { label: "New sermon", href: "/admin-sermons", desc: "Add a written message" },
  { label: "New event", href: "/admin-events", desc: "Schedule an event" },
  { label: "Live stream", href: "/admin-live", desc: "Start or configure stream" },
  { label: "Media settings", href: "/admin-media", desc: "Update RSS & YouTube" },
  { label: "Projects", href: "/admin-projects", desc: "Add or edit projects" },
  { label: "Site settings", href: "/admin-settings", desc: "Church info & times" },
  { label: "Community", href: "/admin-community", desc: "Manage life groups" },
  { label: "Messages", href: "/admin-contacts", desc: "View contact messages" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<StatCard[]>([
    { label: "Sermons", value: "…", href: "/admin-sermons", status: "loading" },
    { label: "Audio messages", value: "…", href: "/admin-media", status: "loading" },
    { label: "Videos", value: "…", href: "/admin-media", status: "loading" },
    { label: "Events", value: "…", href: "/admin-events", status: "loading" },
    { label: "Community groups", value: "…", href: "/admin-community", status: "loading" },
    { label: "Projects", value: "…", href: "/admin-projects", status: "loading" },
    { label: "Members", value: "…", href: "/admin-members", status: "loading" },
    { label: "Messages", value: "…", href: "/admin-contacts", status: "loading" },
  ]);

  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadStats() {
      const API = "http://localhost:4000/api/v1";

      // Run all fetches in parallel
      const [
        sermonsCount,
        eventsCount,
        communityCount,
        membersCount,
        contactsCount,
        audioCount,
        videoCount,
      ] = await Promise.all([
        fetchCount(`${API}/admin/sermons`),
        fetchCount(`${API}/admin/events`),
        fetchCount(`${API}/admin/community`),
        fetchCount(`${API}/admin/members`),
        fetchCount(`${API}/admin/contacts`),
        fetchPodcastCount(),
        fetchYouTubeCount(),
      ]);

      // Local counts (always available)
      const savedProjects = localStorage.getItem("admin-projects");
      const projectsCount = savedProjects
        ? JSON.parse(savedProjects).length
        : defaultProjects.length;

      const savedVideos = localStorage.getItem("admin-manual-videos");
      const manualVideos = savedVideos ? JSON.parse(savedVideos).length : 0;

      const isOnline = sermonsCount !== null || eventsCount !== null;
      setBackendOnline(isOnline);

      setStats([
        {
          label: "Sermons",
          value: sermonsCount ?? "—",
          sub: sermonsCount === null ? "backend offline" : "written messages",
          href: "/admin-sermons",
          status: sermonsCount !== null ? "live" : "offline",
        },
        {
          label: "Audio messages",
          value: audioCount ?? "—",
          sub: audioCount !== null ? "from Spotify RSS" : "RSS unavailable",
          href: "/admin-media",
          status: audioCount !== null ? "live" : "offline",
        },
        {
          label: "Videos",
          value: videoCount !== null
            ? videoCount + manualVideos
            : manualVideos > 0
              ? `${manualVideos}+`
              : "—",
          sub: videoCount !== null
            ? "from YouTube channel"
            : manualVideos > 0
              ? `${manualVideos} manual`
              : "channel feed offline",
          href: "/admin-media",
          status: videoCount !== null ? "live" : manualVideos > 0 ? "local" : "offline",
        },
        {
          label: "Events",
          value: eventsCount ?? "—",
          sub: eventsCount === null ? "backend offline" : "upcoming & past",
          href: "/admin-events",
          status: eventsCount !== null ? "live" : "offline",
        },
        {
          label: "Community groups",
          value: communityCount ?? "—",
          sub: communityCount === null ? "backend offline" : "life groups",
          href: "/admin-community",
          status: communityCount !== null ? "live" : "offline",
        },
        {
          label: "Projects",
          value: projectsCount,
          sub: "local data",
          href: "/admin-projects",
          status: "local",
        },
        {
          label: "Members",
          value: membersCount ?? "—",
          sub: membersCount === null ? "backend offline" : "registered",
          href: "/admin-members",
          status: membersCount !== null ? "live" : "offline",
        },
        {
          label: "Messages",
          value: contactsCount ?? "—",
          sub: contactsCount === null ? "backend offline" : "contact submissions",
          href: "/admin-contacts",
          status: contactsCount !== null ? "live" : "offline",
        },
      ]);
    }

    loadStats();
  }, []);

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-5xl mx-auto">
      <AdminTour />

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Assemblies Of God Church · Choba 2
          </span>
          <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
            Dashboard
          </h1>
        </div>
        {backendOnline !== null && (
          <div
            className="flex items-center gap-2 px-3 py-1.5"
            style={{
              background: backendOnline
                ? "rgba(52,211,153,0.08)"
                : "rgba(255,200,0,0.08)",
              border: `1px solid ${backendOnline ? "rgba(52,211,153,0.20)" : "rgba(255,200,0,0.20)"}`,
              borderRadius: "8px",
            }}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${backendOnline ? "bg-emerald-400 animate-pulse" : "bg-yellow-400"}`}
            />
            <span
              className={`font-body text-[10px] tracking-widest uppercase ${backendOnline ? "text-emerald-300/80" : "text-yellow-300/70"}`}
            >
              {backendOnline ? "Backend online" : "Backend offline"}
            </span>
          </div>
        )}
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex flex-col gap-1.5 px-4 py-4 transition-all hover:scale-[1.02] group"
            style={glass}
          >
            <div className="flex items-center gap-1.5">
              <StatusDot status={stat.status} />
              <span className="font-body text-white/40 text-[10px] tracking-widest uppercase truncate">
                {stat.label}
              </span>
            </div>
            <span
              className={`font-heading font-black text-2xl sm:text-3xl leading-none transition-colors ${
                stat.value === "…" || stat.value === "—"
                  ? "text-white/20"
                  : "text-white group-hover:text-white/80"
              }`}
            >
              {stat.value}
            </span>
            {stat.sub && (
              <span className="font-body text-white/25 text-[10px] leading-tight">
                {stat.sub}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-4 mb-8">
        {[
          { color: "bg-emerald-400", label: "Live from backend" },
          { color: "bg-sky-400", label: "Local data" },
          { color: "bg-yellow-400/60", label: "Backend offline" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
            <span className="font-body text-white/30 text-[10px]">{item.label}</span>
          </div>
        ))}
      </div>

      {/* ── Quick actions ── */}
      <div>
        <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-3">
          Quick actions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col gap-1 px-4 py-4 transition-all hover:scale-[1.02] group"
              style={glass}
            >
              <span className="font-body text-white font-semibold text-sm group-hover:text-white/80 transition-colors">
                {action.label}
              </span>
              <span className="font-body text-white/35 text-xs leading-snug">
                {action.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
