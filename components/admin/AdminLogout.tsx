"use client";

import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin-login");
  }

  return (
    <button
      onClick={handleLogout}
      className="font-body text-white/40 text-xs tracking-wide border border-white/15 px-3 py-1.5 hover:bg-white hover:text-black transition-colors cursor-pointer"
    >
      Sign out
    </button>
  );
}
