"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─── Nav items ────────────────────────────────────────────────────────────────

const navItems = [
  {
    label: "Dashboard",
    sub: "Overview & stats",
    href: "/admin",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" opacity=".8" />
        <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity=".8" />
        <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity=".8" />
        <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity=".8" />
      </svg>
    ),
  },
  {
    label: "Sermons",
    sub: "Create & manage",
    href: "/admin/sermons",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 2h12v10H2z" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Events",
    sub: "Upcoming & past",
    href: "/admin/events",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M5 1v3M11 1v3M1 7h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Community",
    sub: "Groups & members",
    href: "/admin/community",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="5" cy="6" r="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <circle cx="11" cy="6" r="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M1 14c0-2.2 1.8-4 4-4M10 14c0-2.2 1.8-4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    label: "Messages",
    sub: "Contact responses",
    href: "/admin/contacts",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 3h14v9a1 1 0 01-1 1H2a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M1 3l7 5 7-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Announcements",
    sub: "Publish & manage",
    href: "/admin/announcements",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 8c0-1.1.9-2 2-2h1V5a3 3 0 016 0v1h1a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M6 11v1a2 2 0 004 0v-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <circle cx="8" cy="8.5" r="1" fill="currentColor" opacity=".7" />
      </svg>
    ),
  },
  {
    label: "Live",
    sub: "Stream settings",
    href: "/admin/live",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" fill="currentColor" />
        <path d="M3.5 12.5a6.5 6.5 0 009 0M3.5 3.5a6.5 6.5 0 019 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M5.5 10.5a3.5 3.5 0 005 0M5.5 5.5a3.5 3.5 0 015 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    label: "Media",
    sub: "Audio & video",
    href: "/admin/media",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <polygon points="6,5 12,8 6,11" fill="currentColor" opacity=".8" />
      </svg>
    ),
  },
  {
    label: "Media Manager",
    sub: "Hide/show content",
    href: "/admin/media-manager",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2" width="14" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <rect x="1" y="6.5" width="14" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <rect x="1" y="11" width="14" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <circle cx="4" cy="3.5" r="0.8" fill="currentColor" />
        <circle cx="4" cy="8" r="0.8" fill="currentColor" />
        <circle cx="4" cy="12.5" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Projects",
    sub: "Manage projects",
    href: "/admin/projects",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="4" width="14" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Monthly Programs",
    sub: "1st & last day",
    href: "/admin/monthly-programs",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="5" cy="9" r="1" fill="currentColor" />
        <circle cx="11" cy="9" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Pastor",
    sub: "Lead pastor info",
    href: "/admin/pastor",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M8 1v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Settings",
    sub: "Site & church info",
    href: "/admin/settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

// ─── Glass style ──────────────────────────────────────────────────────────────

const glassPanel: React.CSSProperties = {
  background: "rgba(0,0,0,0.55)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  borderRight: "1px solid rgba(255,255,255,0.08)",
};

const glassDrawer: React.CSSProperties = {
  background: "rgba(10,10,10,0.92)",
  backdropFilter: "blur(28px)",
  WebkitBackdropFilter: "blur(28px)",
  borderTop: "1px solid rgba(255,255,255,0.10)",
};

const glassBottomBar: React.CSSProperties = {
  background: "rgba(0,0,0,0.75)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderTop: "1px solid rgba(255,255,255,0.10)",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on outside tap
  useEffect(() => {
    if (!drawerOpen) return;
    function handleClick(e: MouseEvent | TouchEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [drawerOpen]);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
  }

  // Current page label for mobile header
  const currentPage = navItems.find((n) => n.href === pathname);

  // Bottom bar shows first 5 items
  const bottomItems = navItems.slice(0, 5);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Desktop sidebar ── */}
      <aside
        className={`hidden lg:flex shrink-0 flex-col py-6 transition-all duration-300 sticky top-0 h-screen overflow-y-auto ${sidebarOpen ? "w-60 px-3" : "w-14 px-2"}`}
        style={glassPanel}
        data-tour="sidebar"
      >
        {/* Browse label */}
        {sidebarOpen && (
          <div className="px-3 mb-4">
            <p className="font-body text-white/30 text-[9px] tracking-widest uppercase mb-0.5">
              Browse
            </p>
          </div>
        )}
        {!sidebarOpen && <div className="mb-4 h-5" />}

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen((p) => !p)}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className={`flex items-center gap-2 rounded-lg font-body text-white/35 text-xs hover:text-white hover:bg-white/6 transition-colors cursor-pointer mb-4 border border-white/10 ${sidebarOpen ? "px-3 py-1.5 self-start" : "w-8 h-8 justify-center self-center"}`}
        >
          <span className="text-sm leading-none">{sidebarOpen ? "←" : "→"}</span>
          {sidebarOpen && <span>Hide</span>}
        </button>

        {/* Nav */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!sidebarOpen ? item.label : undefined}
                className={`group flex items-center gap-3 rounded-xl transition-all duration-200 ${sidebarOpen ? "px-3 py-3" : "px-2 py-2.5 justify-center"} ${
                  active
                    ? "bg-white/15 border border-white/20"
                    : "border border-transparent hover:bg-white/6 hover:border-white/10"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    active
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/60 group-hover:bg-white/15 group-hover:text-white"
                  }`}
                >
                  {item.icon}
                </div>
                {sidebarOpen && (
                  <>
                    <div className="flex flex-col gap-0 min-w-0">
                      <span className={`font-body font-semibold text-sm leading-tight transition-colors ${active ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                        {item.label}
                      </span>
                      <span className="font-body text-white/30 text-[10px] leading-tight truncate">
                        {item.sub}
                      </span>
                    </div>
                    <span className={`ml-auto text-xs transition-colors shrink-0 ${active ? "text-white/60" : "text-white/20 group-hover:text-white/40"}`}>
                      ›
                    </span>
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* More coming */}
        {sidebarOpen && (
          <div className="mx-1 mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-4">
            <p className="font-body text-white/50 text-[9px] tracking-widest uppercase mb-1">
              More coming
            </p>
            <p className="font-body text-white/35 text-xs leading-relaxed">
              New features are added regularly.
            </p>
          </div>
        )}

        {/* Bottom actions */}
        <div className={`mt-4 flex flex-col gap-0.5 ${sidebarOpen ? "px-1" : "items-center"}`}>
          {sidebarOpen ? (
            <>
              <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg font-body text-white/35 text-xs hover:text-white hover:bg-white/6 transition-colors">
                <span className="text-[10px]">↗</span> View site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg font-body text-white/35 text-xs hover:text-red-400 hover:bg-red-400/8 transition-colors text-left cursor-pointer"
              >
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

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center justify-between px-4 py-3 shrink-0"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex flex-col gap-0">
            <span className="font-body text-white/30 text-[9px] tracking-widest uppercase leading-tight">
              Admin
            </span>
            <span className="font-body text-white font-semibold text-sm leading-tight">
              {currentPage?.label ?? "Dashboard"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="font-body text-white/40 text-[10px] tracking-widest uppercase px-3 py-1.5 border border-white/15 rounded-lg hover:text-white transition-colors"
            >
              Site
            </Link>
            <button
              onClick={() => setDrawerOpen((o) => !o)}
              className="flex flex-col gap-1 items-center justify-center w-9 h-9 border border-white/15 rounded-lg text-white/70 hover:text-white transition-colors"
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {drawerOpen ? (
                  <motion.span
                    key="x"
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-center"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </motion.span>
                ) : (
                  <motion.span
                    key="burger"
                    initial={{ opacity: 0, rotate: 45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -45 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-1"
                  >
                    <span className="block h-px w-4 bg-current" />
                    <span className="block h-px w-4 bg-current" />
                    <span className="block h-px w-4 bg-current" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile full-screen drawer */}
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              key="drawer"
              ref={drawerRef}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-x-0 bottom-0 z-50 flex flex-col"
              style={{ ...glassDrawer, maxHeight: "80vh", borderRadius: "20px 20px 0 0" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <div className="px-4 pb-2 pt-1">
                <p className="font-body text-white/30 text-[9px] tracking-widest uppercase">
                  Navigation
                </p>
              </div>

              <nav className="flex flex-col gap-1 px-3 pb-4 overflow-y-auto">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                        active
                          ? "bg-white/15 border border-white/20"
                          : "border border-transparent hover:bg-white/8"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          active ? "bg-white text-black" : "bg-white/10 text-white/60"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div className="flex flex-col gap-0 min-w-0">
                        <span className={`font-body font-semibold text-sm leading-tight ${active ? "text-white" : "text-white/70"}`}>
                          {item.label}
                        </span>
                        <span className="font-body text-white/30 text-[10px] leading-tight">
                          {item.sub}
                        </span>
                      </div>
                      {active && (
                        <span className="ml-auto text-white/50 text-xs">›</span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Drawer footer */}
              <div
                className="flex items-center justify-between px-5 py-4 border-t border-white/10"
                style={{ background: "rgba(0,0,0,0.3)" }}
              >
                <Link
                  href="/"
                  className="font-body text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors"
                >
                  ↗ View public site
                </Link>
                <button
                  onClick={handleLogout}
                  className="font-body text-white/40 text-xs tracking-widest uppercase hover:text-red-400 transition-colors cursor-pointer"
                >
                  ← Sign out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll area — add bottom padding on mobile for the tab bar */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {children}
        </main>

        {/* ── Mobile bottom tab bar ── */}
        <div
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-around px-2 py-2"
          style={glassBottomBar}
        >
          {bottomItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-2 py-1 min-w-0 flex-1"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    active
                      ? "bg-white text-black scale-110"
                      : "text-white/45 hover:text-white"
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`font-body text-[9px] tracking-wide uppercase leading-none transition-colors ${
                    active ? "text-white" : "text-white/35"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
          {/* More button — opens drawer */}
          <button
            onClick={() => setDrawerOpen((o) => !o)}
            className="flex flex-col items-center gap-1 px-2 py-1 min-w-0 flex-1"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white/45 hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="3" cy="8" r="1.5" fill="currentColor" />
                <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                <circle cx="13" cy="8" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <span className="font-body text-[9px] tracking-wide uppercase leading-none text-white/35">
              More
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
