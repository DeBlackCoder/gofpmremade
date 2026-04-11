"use client";

import AdminTour from "@/components/admin/AdminTour";
import { useDashboardStats, useSystemHealth } from "@/lib/hooks/queries";

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: health } = useSystemHealth();

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 sm:px-10 sm:py-10 max-w-5xl mx-auto">
      <AdminTour />

      <div className="flex items-center justify-between mb-10">
        <div className="flex flex-col gap-0.5">
          <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Assemblies Of God Church
          </span>
          <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight">
            Dashboard
          </h1>
        </div>
      </div>

      {isLoading ? (
        <p className="font-body text-white/40 text-sm">Loading dashboard…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 mb-10">
          {[
            { label: "Total Members", value: stats?.members ?? 0 },
            { label: "Total Events", value: stats?.events ?? 0 },
            { label: "Total Sermons", value: stats?.sermons ?? 0 },
            { label: "Monthly Giving", value: stats?.givingTotal ?? 0 },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-950 px-5 py-5 flex flex-col gap-1"
            >
              <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
                {stat.label}
              </span>
              <span className="font-heading text-white font-black text-3xl leading-none">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 border border-white/10 p-5">
        <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-3">
          System health
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm font-body">
          <p className="text-white/70">
            Status: <span className="text-white">{health?.status ?? "unknown"}</span>
          </p>
          <p className="text-white/70">
            Last Check: <span className="text-white">{health?.lastCheck ? new Date(health.lastCheck).toLocaleTimeString() : "unknown"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
