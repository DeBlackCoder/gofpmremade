"use client";

import { useState } from "react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonthlyProgram {
  id: string;
  day: string;
  title: string;
  time: string;
  description: string;
  notes: string;
}

const defaultPrograms: MonthlyProgram[] = [
  {
    id: "first-day-default",
    day: "1st Sunday",
    title: "First Sunday Communion Service",
    time: "10:30 AM",
    description: "Holy Communion service with special worship and prayer",
    notes: "All members are encouraged to attend",
  },
  {
    id: "last-day-default",
    day: "Last Day",
    title: "Thanksgiving Service",
    time: "6:00 PM",
    description: "Monthly thanksgiving and testimony service",
    notes: "Bring your testimonies to share",
  },
];

const emptyForm: Omit<MonthlyProgram, "id"> = {
  day: "",
  title: "",
  time: "",
  description: "",
  notes: "",
};

const inputClass =
  "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "12px",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminMonthlyProgramsPage() {
  const [programs, setPrograms] = useLocalStorage<MonthlyProgram[]>(
    "admin-monthly-programs",
    defaultPrograms
  );

  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function startEdit(program: MonthlyProgram) {
    setEditing(program.id);
    setForm({
      day: program.day,
      title: program.title,
      time: program.time,
      description: program.description,
      notes: program.notes,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancel() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const program: MonthlyProgram = {
      id: editing || `program-${Date.now()}`,
      day: form.day,
      title: form.title,
      time: form.time,
      description: form.description,
      notes: form.notes,
    };

    const updated = editing
      ? programs.map((p) => (p.id === editing ? program : p))
      : [...programs, program];

    setPrograms(updated);
    cancel();
    setSaving(false);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this monthly program?")) return;
    setPrograms(programs.filter((p) => p.id !== id));
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Admin
          </span>
          <h1 className="font-heading text-white font-black text-3xl sm:text-4xl mt-0.5">
            Monthly Programs
          </h1>
          <p className="font-body text-white/40 text-sm mt-2">
            Manage recurring monthly programs
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => {
              setEditing(null);
              setForm(emptyForm);
              setShowForm(true);
            }}
            className="border border-white/30 px-4 py-2 text-white hover:bg-white hover:text-black transition-colors"
          >
            + New program
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-5 mb-8" style={glass}>
          <p className="text-white/30 text-xs mb-4">
            {editing ? "Edit program" : "New program"}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input name="day" value={form.day} onChange={handleChange} placeholder="Day" className={inputClass} />
            <input name="time" value={form.time} onChange={handleChange} placeholder="Time" className={inputClass} />
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className={inputClass} />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className={inputClass} />
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className={inputClass} />

            <div className="flex gap-3">
              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={cancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="grid gap-4">
        {programs.map((p) => (
          <div key={p.id} className="p-4 border border-white/10">
            <h3>{p.title}</h3>
            <p>{p.day} • {p.time}</p>
            <p>{p.description}</p>
            {p.notes && <p>Note: {p.notes}</p>}

            <div className="flex gap-3 mt-2">
              <button onClick={() => startEdit(p)}>Edit</button>
              <button onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}