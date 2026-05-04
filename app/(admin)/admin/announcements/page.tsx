"use client";

import { useEffect, useState } from "react";

interface Announcement {
  id: string;
  title: string;
  message: string;
  date?: string;
  venue?: string;
  active: boolean;
  createdAt: string;
}

const emptyForm = {
  title: "",
  message: "",
  date: "",
  venue: "",
  active: true,
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchAll() {
    try {
      // Fetch all (including inactive) — we call the public endpoint but admin sees all
      // We use a custom header to signal admin context; for now we fetch all from the file
      const res = await fetch("/api/announcements/all");
      if (res.ok) {
        const data: Announcement[] = await res.json();
        setAnnouncements(data);
        return;
      }
    } catch {
      // fallback below
    }
    // Fallback: fetch active only
    try {
      const res = await fetch("/api/announcements");
      if (res.ok) {
        const data: Announcement[] = await res.json();
        setAnnouncements(data);
      }
    } catch {
      // silently fail
    }
  }

  useEffect(() => {
    void fetchAll();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function startEdit(a: Announcement) {
    setEditing(a.id);
    setForm({
      title: a.title,
      message: a.message,
      date: a.date ?? "",
      venue: a.venue ?? "",
      active: a.active,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const method = editing ? "PUT" : "POST";
      const payload = editing ? { id: editing, ...form } : form;

      const res = await fetch("/api/announcements", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        setError((err as { error?: string }).error ?? "Failed to save.");
        setSaving(false);
        return;
      }

      await fetchAll();
      setForm(emptyForm);
      setEditing(null);
      setShowForm(false);
    } catch {
      setError("Network error. Please try again.");
    }

    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    try {
      await fetch("/api/announcements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setAnnouncements((p) => p.filter((a) => a.id !== id));
    } catch {
      // silently fail
    }
  }

  const inputClass =
    "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <span className="font-body text-white/30 text-[10px] tracking-widests uppercase">
            Admin
          </span>
          <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
            Announcements
          </h1>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setEditing(null);
              setForm(emptyForm);
              setShowForm(true);
            }}
            className="border border-white/30 px-5 py-2 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
          >
            + New announcement
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="border border-white/10 p-6 mb-10 backdrop-blur-sm bg-white/3">
          <p className="font-body text-white/30 text-[10px] tracking-widests uppercase mb-5">
            {editing ? "Edit announcement" : "New announcement"}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widests uppercase">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Announcement title"
                className={inputClass}
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widests uppercase">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Full announcement message…"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Date + Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widests uppercase">
                  Date <span className="font-body text-white/20 normal-case">(optional)</span>
                </label>
                <input
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  placeholder="e.g. Sunday, 20 July 2025"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widests uppercase">
                  Venue <span className="font-body text-white/20 normal-case">(optional)</span>
                </label>
                <input
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  placeholder="e.g. Main Auditorium"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Active toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="w-4 h-4 accent-white"
              />
              <span className="font-body text-white/60 text-sm">
                Mark as active (shows to users)
              </span>
            </label>

            {error && <p className="font-body text-red-400 text-xs">{error}</p>}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="self-start border border-white/30 px-6 py-2.5 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
              >
                {saving
                  ? "Saving…"
                  : editing
                    ? "Update announcement"
                    : "Create announcement"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="font-body text-white/40 text-sm hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <p className="font-body text-white/30 text-[10px] tracking-widests uppercase mb-2">
        {announcements.length} announcement{announcements.length !== 1 ? "s" : ""}
      </p>
      {announcements.length === 0 && (
        <p className="font-body text-white/25 text-sm">No announcements created yet.</p>
      )}
      {announcements.map((a) => (
        <div
          key={a.id}
          className="flex items-start justify-between gap-4 py-4 border-t border-white/10 hover:border-white/20 transition-colors"
        >
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-body text-white font-semibold text-sm truncate">
                {a.title}
              </span>
              <span
                className={`font-body text-[9px] tracking-widests uppercase px-1.5 py-0.5 border ${
                  a.active
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                    : "bg-white/5 text-white/30 border-white/10"
                }`}
              >
                {a.active ? "Active" : "Inactive"}
              </span>
            </div>
            <span className="font-body text-white/35 text-xs line-clamp-1">
              {a.message}
            </span>
            {(a.date || a.venue) && (
              <span className="font-body text-white/25 text-[11px]">
                {[a.date, a.venue].filter(Boolean).join(" · ")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => startEdit(a)}
              className="font-body text-white/40 text-xs hover:text-white transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(a.id)}
              className="font-body text-white/25 text-xs hover:text-red-400 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
