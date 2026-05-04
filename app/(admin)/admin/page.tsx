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
    const res = await fetch(url, { 
      signal: AbortSignal.timeout(2000), // Reduced from 4000ms to 2000ms
      credentials: 'include',
      cache: 'no-store', // Don't cache to get fresh data
    });
    if (!res.ok) {
      console.error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
      return null;
    }
    const data = await res.json();
    
    // Handle different response formats
    // Simple count response: { success: true, data: { total: N } }
    if (data?.success && typeof data?.data?.total === "number") return data.data.total;
    
    // Paginated responses with nested data: { success: true, data: { data: [...], total: N } }
    if (data?.success && data?.data?.total !== undefined) return data.data.total;
    
    // IMPORTANT: Check for nested pagination BEFORE checking array length
    // This ensures we extract data.data.pagination.total for /api/v1/sermons responses
    if (data?.success && data?.data?.pagination?.total !== undefined) {
      return data.data.pagination.total;
    }
    
    if (data?.success && Array.isArray(data?.data?.data)) return data.data.data.length;
    
    // MongoDB responses: { success: true, data: [...] }
    if (data?.success && Array.isArray(data?.data)) return data.data.length;
    
    // Standard paginated responses: { data: [...], total: N } or { data: [...], pagination: { total: N } }
    if (typeof data?.total === "number") return data.total;
    if (typeof data?.pagination?.total === "number") return data.pagination.total;
    
    // Direct array responses
    if (Array.isArray(data?.data)) return data.data.length;
    if (Array.isArray(data)) return data.length;
    
    console.error(`Unexpected response format from ${url}:`, data);
    return null;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

async function fetchPodcastCount(): Promise<number | null> {
  try {
    const res = await fetch(`/api/podcast-feed`, { 
      signal: AbortSignal.timeout(3000), // Reduced from 5000ms
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.episodes?.length ?? null;
  } catch {
    return null;
  }
}

async function fetchYouTubeCount(): Promise<number | null> {
  try {
    const res = await fetch(`/api/youtube-feed`, { 
      signal: AbortSignal.timeout(3000), // Reduced from 5000ms
      cache: 'no-store',
    });
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
  { label: "New sermon", href: "/admin/sermons", desc: "Add a written message" },
  { label: "New event", href: "/admin/events", desc: "Schedule an event" },
  { label: "Live stream", href: "/admin/live", desc: "Start or configure stream" },
  { label: "Media settings", href: "/admin/media", desc: "Update RSS & YouTube" },
  { label: "Projects", href: "/admin/projects", desc: "Add or edit projects" },
  { label: "Site settings", href: "/admin/settings", desc: "Church info & times" },
  { label: "Community", href: "/admin/community", desc: "Manage life groups" },
  { label: "Messages", href: "/admin/contacts", desc: "View contact messages" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<StatCard[]>([
    { label: "Sermons", value: "…", href: "/admin/sermons", status: "loading" },
    { label: "Audio messages", value: "…", href: "/admin/media", status: "loading" },
    { label: "Videos", value: "…", href: "/admin/media", status: "loading" },
    { label: "Events", value: "…", href: "/admin/events", status: "loading" },
    { label: "Community groups", value: "…", href: "/admin/community", status: "loading" },
    { label: "Projects", value: "…", href: "/admin/projects", status: "loading" },
    { label: "Members", value: "…", href: "/admin/members", status: "loading" },
    { label: "Messages", value: "…", href: "/admin/contacts", status: "loading" },
  ]);

  useEffect(() => {
    async function loadStats() {
      console.log("Dashboard: Loading stats...");
      
      // Fetch from actual API endpoints
      const [
        sermonsCount,
        eventsCount,
        communityCount,
        membersCount,
        contactsCount,
        audioCount,
        videoCount,
      ] = await Promise.all([
        fetchCount(`/api/v1/sermons/count`),
        fetchCount(`/api/v1/events`),
        fetchCount(`/api/v1/ministries`),
        fetchCount(`/api/v1/members`),
        fetchCount(`/api/v1/admin/prayer-requests`),
        fetchPodcastCount(),
        fetchYouTubeCount(),
      ]);

      console.log("Dashboard: Fetched counts:", {
        sermonsCount,
        eventsCount,
        communityCount,
        membersCount,
        contactsCount,
        audioCount,
        videoCount,
      });

      // Local counts (always available)
      const savedProjects = localStorage.getItem("admin-projects");
      const projectsCount = savedProjects
        ? JSON.parse(savedProjects).length
        : defaultProjects.length;

      const savedVideos = localStorage.getItem("admin-manual-videos");
      const manualVideos = savedVideos ? JSON.parse(savedVideos).length : 0;

      setStats([
        {
          label: "Sermons",
          value: sermonsCount ?? 0,
          sub: "written messages",
          href: "/admin/sermons",
          status: sermonsCount !== null ? "live" : "offline",
        },
        {
          label: "Audio messages",
          value: audioCount ?? "—",
          sub: audioCount !== null ? "from Spotify RSS" : "RSS unavailable",
          href: "/admin/media",
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
          href: "/admin/media",
          status: videoCount !== null ? "live" : manualVideos > 0 ? "local" : "offline",
        },
        {
          label: "Events",
          value: eventsCount ?? 0,
          sub: "upcoming & past",
          href: "/admin/events",
          status: eventsCount !== null ? "live" : "offline",
        },
        {
          label: "Community groups",
          value: communityCount ?? 0,
          sub: "life groups",
          href: "/admin/community",
          status: communityCount !== null ? "live" : "offline",
        },
        {
          label: "Projects",
          value: projectsCount,
          sub: "local data",
          href: "/admin/projects",
          status: "local",
        },
        {
          label: "Members",
          value: membersCount ?? 0,
          sub: "registered",
          href: "/admin/members",
          status: membersCount !== null ? "live" : "offline",
        },
        {
          label: "Messages",
          value: contactsCount ?? 0,
          sub: "prayer requests",
          href: "/admin/contacts",
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
        <div
          className="flex items-center gap-2 px-3 py-1.5"
          style={{
            background: "rgba(52,211,153,0.08)",
            border: "1px solid rgba(52,211,153,0.20)",
            borderRadius: "8px",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-body text-[10px] tracking-widest uppercase text-emerald-300/80">
            Local backend active
          </span>
        </div>
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
