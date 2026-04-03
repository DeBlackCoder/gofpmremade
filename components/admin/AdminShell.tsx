"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    sub: "Overview & stats",
    href: "/admin-dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" opacity=".8"/>
        <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity=".8"/>
        <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity=".8"/>
        <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity=".8"/>
      </svg>
    ),
  },
  {
    label: "Sermons",
    sub: "Create & manage",
    href: "/admin-sermons",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 2h12v10H2z" stroke="currentColor" strokeWidth="1.2" fill="none" rx="1"/>
        <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Events",
    sub: "Upcoming & past",
    href: "/admin-events",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
        <path d="M5 1v3M11 1v3M1 7h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Messages",
    sub: "Contact responses",
    href: "/admin-contacts",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 3h14v9a1 1 0 01-1 1H2a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
        <path d="M1 3l7 5 7-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Live",
    sub: "Stream settings",
    href: "/admin-live",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" fill="currentColor"/>
        <path d="M3.5 12.5a6.5 6.5 0 009 0M3.5 3.5a6.5 6.5 0 019 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M5.5 10.5a3.5 3.5 0 005 0M5.5 5.5a3.5 3.5 0 015 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`flex-shrink-0 flex flex-col py-6 border-r border-white/8 bg-black/50 backdrop-blur-xl transition-all duration-300 ${open ? "w-60 px-3" : "w-14 px-2"}`}>

        {/* Brand */}
        {open && (
          <div className="px-3 mb-6">
            <p className="font-body text-white/30 text-[9px] tracking-widest uppercase mb-0.5">Browse</p>
          </div>
        )}
        {!open && <div className="mb-6 h-5" />}

        {/* Nav cards */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!open ? item.label : undefined}
                className={`group flex items-center gap-3 rounded-xl transition-all duration-200 ${open ? "px-3 py-3" : "px-2 py-2.5 justify-center"} ${
                  active
                    ? "bg-white/15 border border-white/20"
                    : "border border-transparent hover:bg-white/6 hover:border-white/10"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  active ? "bg-white text-black" : "bg-white/10 text-white/60 group-hover:bg-white/15 group-hover:text-white"
                }`}>
                  {item.icon}
                </div>
                {open && (
                  <>
                    <div className="flex flex-col gap-0 min-w-0">
                      <span className={`font-body font-semibold text-sm leading-tight transition-colors ${active ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                        {item.label}
                      </span>
                      <span className="font-body text-white/30 text-[10px] leading-tight truncate">{item.sub}</span>
                    </div>
                    <span className={`ml-auto text-xs transition-colors flex-shrink-0 ${active ? "text-white/60" : "text-white/20 group-hover:text-white/40"}`}>›</span>
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* More coming card — only when open */}
        {open && (
          <div className="mx-1 mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-4">
            <p className="font-body text-white/50 text-[9px] tracking-widest uppercase mb-1">More coming</p>
            <p className="font-body text-white/35 text-xs leading-relaxed">New features are added regularly by the team.</p>
          </div>
        )}

        {/* Bottom actions */}
        <div className={`mt-4 flex flex-col gap-0.5 ${open ? "px-1" : "items-center"}`}>
          {open ? (
            <>
              <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg font-body text-white/35 text-xs hover:text-white hover:bg-white/6 transition-colors">
                <span className="text-[10px]">↗</span> View site
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg font-body text-white/35 text-xs hover:text-red-400 hover:bg-red-400/8 transition-colors text-left cursor-pointer">
                <span className="text-[10px]">←</span> Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/" title="View site" className="w-8 h-8 flex items-center justify-center rounded-lg text-white/35 hover:text-white hover:bg-white/6 transition-colors text-sm">↗</Link>
              <button onClick={handleLogout} title="Sign out" className="w-8 h-8 flex items-center justify-center rounded-lg text-white/35 hover:text-red-400 hover:bg-red-400/8 transition-colors text-sm cursor-pointer">←</button>
            </>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Toggle bar */}
        <div className="flex items-center px-6 pt-6 pb-0">
          <button
            onClick={() => setOpen((p) => !p)}
            className="flex items-center gap-2 font-body text-white/35 text-xs hover:text-white transition-colors cursor-pointer border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/6"
          >
            <span className="text-base leading-none">{open ? "←" : "→"}</span>
            {open ? "Hide sidebar" : "Show sidebar"}
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
