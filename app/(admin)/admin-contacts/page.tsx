"use client";

import { useEffect, useState } from "react";
import type { ContactSubmission } from "@/lib/contact-data";

const subjectLabels: Record<string, string> = {
  general: "General inquiry", prayer: "Prayer request", membership: "Membership",
  events: "Events & programs", pastoral: "Pastoral care", other: "Other",
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { fetch("/api/admin/contacts").then((r) => r.json()).then(setContacts); }, []);

  async function markRead(id: string) {
    await fetch("/api/admin/contacts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setContacts((p) => p.map((c) => c.id === id ? { ...c, read: true } : c));
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/contacts", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setContacts((p) => p.filter((c) => c.id !== id));
  }

  const unread = contacts.filter((c) => !c.read).length;

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 sm:px-10 sm:py-10 max-w-4xl mx-auto">
      <div className="mb-10">
        <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">Admin</span>
        <div className="flex items-center gap-3 mt-0.5">
          <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight">Messages</h1>
          {unread > 0 && (
            <span className="font-body text-[10px] tracking-widest uppercase px-2 py-0.5 bg-white text-black font-semibold">
              {unread} new
            </span>
          )}
        </div>
      </div>

      {contacts.length === 0 && <p className="font-body text-white/25 text-sm">No messages yet.</p>}

      {contacts.map((c) => (
        <div key={c.id} className={`border-t transition-colors ${c.read ? "border-white/10" : "border-white/30"}`}>
          <button
            onClick={() => { setExpanded(expanded === c.id ? null : c.id); if (!c.read) markRead(c.id); }}
            className="w-full flex items-start justify-between gap-4 py-4 text-left cursor-pointer group"
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {!c.read && <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />}
                <span className={`font-body font-semibold text-sm ${c.read ? "text-white/70" : "text-white"}`}>{c.name}</span>
                <span className="font-body text-white/35 text-xs">{subjectLabels[c.subject] ?? c.subject}</span>
              </div>
              <span className="font-body text-white/30 text-xs">{c.email}{c.phone ? ` · ${c.phone}` : ""} · {new Date(c.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            <span className={`text-white/25 text-sm transition-transform flex-shrink-0 mt-1 ${expanded === c.id ? "rotate-90" : ""}`}>→</span>
          </button>

          {expanded === c.id && (
            <div className="pb-5 flex flex-col gap-4">
              <p className="font-body text-white/70 text-sm leading-relaxed whitespace-pre-wrap border-l-2 border-white/20 pl-4">
                {c.message}
              </p>
              <div className="flex items-center gap-4">
                <a href={`mailto:${c.email}`}
                  className="font-body text-white/50 text-xs border border-white/20 px-3 py-1.5 hover:bg-white hover:text-black transition-colors">
                  Reply via email
                </a>
                <button onClick={() => handleDelete(c.id)}
                  className="font-body text-white/25 text-xs hover:text-red-400 transition-colors cursor-pointer">
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
