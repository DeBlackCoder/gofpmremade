"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";

export default function AdminLogout() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  async function handleLogout() {
    await logout();
    router.push("/");
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
