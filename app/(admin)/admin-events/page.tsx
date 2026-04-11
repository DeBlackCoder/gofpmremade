"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { apiClient } from "@/lib/api/client";

interface ChurchEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

const categories = ["service", "prayer", "youth", "outreach", "other"] as const;

const empty = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  category: "service" as const,
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient.get<ChurchEvent[]>("/admin/events").then(setEvents);
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await apiClient.post<ChurchEvent>("/admin/events", form);
    if (res?.id) {
      setEvents((p) => [res, ...p]);
      setForm(empty);
      setShowForm(false);
    } else {
      setError("Failed to save event.");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await apiClient.delete("/admin/events", { body: { id } });
    setEvents((p) => p.filter((e) => e.id !== id));
  }

  const inputClass =
    "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 sm:px-10 sm:py-10 max-w-5xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Admin
          </span>
          <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
            Events
          </h1>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setForm(empty);
              setShowForm(true);
            }}
            className="border border-white/30 px-5 py-2 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
          >
            + New event
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="border border-white/10 p-6 mb-10 backdrop-blur-sm bg-white/3">
          <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-5">
            New event
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Event title"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Category
                </label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      category: v as typeof form.category,
                    }))
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/15 text-white rounded-none h-10 w-full data-[size=default]:h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Date
                </label>
                <DatePicker
                  value={form.date}
                  onChange={(iso) => setForm((p) => ({ ...p, date: iso }))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Time
                </label>
                <input
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  placeholder="10:30 AM"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Location
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  placeholder="Main Auditorium"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description…"
                className={`${inputClass} resize-none`}
              />
            </div>

            {error && <p className="font-body text-red-400 text-xs">{error}</p>}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="self-start border border-white/30 px-6 py-2.5 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
              >
                {saving ? "Saving…" : "Create event"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(empty);
                }}
                className="font-body text-white/40 text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events list */}
      <div className="flex flex-col gap-1">
        <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-2">
          {events.length} event{events.length !== 1 ? "s" : ""}
        </p>
        {events.length === 0 && (
          <p className="font-body text-white/25 text-sm">No events yet.</p>
        )}
        {events.map((ev) => (
          <div
            key={ev.id}
            className="flex items-start justify-between gap-4 py-4 border-t border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-body text-white font-semibold text-sm">
                  {ev.title}
                </span>
                <span className="font-body text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-white/10 text-white/50 border border-white/15 capitalize">
                  {ev.category}
                </span>
              </div>
              <span className="font-body text-white/40 text-xs">
                {ev.date} · {ev.time} · {ev.location}
              </span>
              {ev.description && (
                <span className="font-body text-white/30 text-xs mt-0.5">
                  {ev.description}
                </span>
              )}
            </div>
            <button
              onClick={() => handleDelete(ev.id)}
              className="font-body text-white/25 text-xs hover:text-red-400 transition-colors flex-shrink-0 cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
