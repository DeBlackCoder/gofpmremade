"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Community", href: "/community" },
  { label: "Give", href: "/give" },
  { label: "Ministry", href: "/ministry" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
  { label: "Sermons", href: "/sermons" },
  { label: "Announcements", href: "/announcements" },
  { label: "Projects", href: "/project" },
  { label: "Location", href: "/location" },
];

// Pages that are admin/auth — skip navbar here.
const EXCLUDED_PREFIXES = ["/admin", "/admin-login", "/register"];
const EXCLUDED_EXACT: string[] = [];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Close on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isExcluded =
    EXCLUDED_EXACT.includes(pathname) ||
    EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isExcluded) return null;

  return (
    <motion.header
      className="sticky top-0 z-50 w-full pointer-events-none"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Outer wrapper — provides the margin from screen edges */}
      <div className="public-content px-4 pt-3 sm:px-6 sm:pt-4">
        {/* Floating glass pill */}
        <div
          ref={menuRef}
          className="pointer-events-auto flex flex-col"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "16px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image
                src="/logo.png"
                alt="Assemblies Of God Church logo"
                width={36}
                height={36}
                priority
              />
              <div className="flex flex-col gap-0">
                <span className="font-body text-white/70 text-[11px] tracking-widest uppercase leading-tight">
                  Assemblies Of God Church
                </span>
                <span className="font-body text-white/40 text-[9px] tracking-widest uppercase leading-tight">
                  Choba 2
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex flex-nowrap items-center gap-x-5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative font-body text-[11px] tracking-widest uppercase transition-colors text-white/55 hover:text-white"
                >
                  {/* Hidden bold copy reserves width so active state doesn't shift layout */}
                  <span className="invisible font-bold block h-0 overflow-hidden" aria-hidden="true">
                    {link.label}
                  </span>
                  <span
                    className={`absolute inset-0 flex items-center transition-colors ${
                      pathname === link.href || pathname.startsWith(link.href + "/")
                        ? "text-white font-bold"
                        : "text-white/55 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/live-service"
                className="hidden sm:flex items-center gap-2 font-body text-xs font-semibold text-white tracking-wide border border-white/30 px-3 py-1.5 hover:bg-white hover:text-black transition-colors"
                style={{ borderRadius: "8px" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Watch Live
              </Link>

              {/* Hamburger / Close */}
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="lg:hidden inline-flex items-center justify-center border border-white/20 text-white/80 hover:bg-white hover:text-black transition-colors"
                style={{ borderRadius: "8px", width: 38, height: 36 }}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ opacity: 0, rotate: -45 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 45 }}
                      transition={{ duration: 0.18 }}
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
                      transition={{ duration: 0.18 }}
                      className="flex flex-col gap-1 items-center"
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

          {/* Mobile dropdown */}
          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 border-t border-white/10">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`px-3 py-2 font-body text-[11px] tracking-widest uppercase transition-all duration-200 ${
                        pathname === link.href || pathname.startsWith(link.href + "/")
                          ? "text-white"
                          : "text-white/75 hover:text-white"
                      }`}
                      style={{
                        background:
                          pathname === link.href || pathname.startsWith(link.href + "/")
                            ? "rgba(255,255,255,0.15)"
                            : "rgba(255,255,255,0.06)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        borderRadius: "10px",
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/live-service"
                    onClick={() => setMenuOpen(false)}
                    className="sm:hidden px-3 py-2 font-body text-[11px] tracking-widest uppercase text-white/75 hover:text-white transition-colors flex items-center gap-2"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: "10px",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Watch Live
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
