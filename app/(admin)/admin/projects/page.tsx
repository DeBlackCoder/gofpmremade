"use client";

import { useEffect, useState } from "react";
import { type Project, type ProjectCategory } from "@/lib/projects-data";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";

// ─── Types ────────────────────────────────────────────────────────────────────

const categories: ProjectCategory[] = ["Construction", "Outreach", "Education", "Relief"];
const statuses = ["Ongoing", "Completed", "Upcoming"] as const;

const emptyForm = {
  slug: "",
  title: "",
  category: "Construction" as ProjectCategory,
  status: "Ongoing" as Project["status"],
  year: new Date().getFullYear().toString(),
  summary: "",
  body: "",
  goal: "",
  raised: "",
  images: ["", "", "", "", "", ""],
};

const inputClass =
  "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "12px",
};

const categoryColors: Record<ProjectCategory, string> = {
  Construction: "bg-amber-500/20 text-amber-300",
  Outreach: "bg-violet-500/20 text-violet-300",
  Education: "bg-sky-500/20 text-sky-300",
  Relief: "bg-rose-500/20 text-rose-300",
};

const statusColors: Record<Project["status"], string> = {
  Ongoing: "bg-emerald-500/20 text-emerald-300",
  Completed: "bg-white/10 text-white/50",
  Upcoming: "bg-blue-500/20 text-blue-300",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    fetch("/api/v1/projects?limit=100", { cache: "no-store" })
      .then((res) => res.json())
      .then((payload) => setProjects(payload?.data?.data ?? []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleImageChange(idx: number, value: string) {
    setForm((p) => {
      const images = [...p.images];
      images[idx] = value;
      return { ...p, images };
    });
  }

  function startEdit(project: Project) {
    setEditing(project.slug);
    setForm({
      slug: project.slug,
      title: project.title,
      category: project.category,
      status: project.status,
      year: project.year,
      summary: project.summary,
      body: project.body,
      goal: project.goal ?? "",
      raised: project.raised ?? "",
      images: [...project.images, "", "", "", "", "", ""].slice(0, 6),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancel() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(false);
    setSaveError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");

    const slug =
      form.slug ||
      form.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const project: Project = {
      slug,
      title: form.title,
      category: form.category,
      status: form.status,
      year: form.year,
      lead: "Church Leadership",
      summary: form.summary,
      body: form.body,
      goal: form.goal || null,
      raised: form.raised || null,
      images: form.images.filter(Boolean),
    };

    try {
      const res = await fetch("/api/v1/projects", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(project),
      });
      const payload = await res.json();

      if (!res.ok || !payload?.data) {
        setSaveError(payload?.error ?? `Server error (${res.status}). Check that images are not too large.`);
        return;
      }

      setProjects((current) =>
        editing
          ? current.map((p) => (p.slug === editing ? payload.data : p))
          : [payload.data, ...current],
      );
      cancel();
    } catch (err: any) {
      setSaveError(err.message ?? "Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch("/api/v1/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) setProjects((p) => p.filter((project) => project.slug !== slug));
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Admin
          </span>
          <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
            Projects
          </h1>
        </div>
        {!showForm && (
          <button
            onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}
            className="border border-white/30 px-4 py-2 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors cursor-pointer shrink-0"
          >
            + New project
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-5 sm:p-6 mb-8" style={glass}>
          <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-5">
            {editing ? "Edit project" : "New project"}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Title</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="Project title" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Year of Commencement</label>
                <input name="year" value={form.year} onChange={handleChange} required placeholder="2025" className={inputClass} />
              </div>
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{" "}
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className={`${inputClass} appearance-none`}>
                  {categories.map((c) => <option key={c} value={c} className="text-black">{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={`${inputClass} appearance-none`}>
                  {statuses.map((s) => <option key={s} value={s} className="text-black">{s}</option>)}
                </select>
              </div>
            </div>
            {/* Row 3 — funding */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Project Cost <span className="normal-case opacity-50">(optional)</span>
                </label>
                <input name="goal" value={form.goal} onChange={handleChange} placeholder="₦120,000,000" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Raised So Far <span className="normal-case opacity-50">(optional)</span>
                </label>
                <input name="raised" value={form.raised} onChange={handleChange} placeholder="₦74,000,000" className={inputClass} />
              </div>
            </div>
            {/* Summary */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Summary <span className="normal-case opacity-50">(shown on card)</span></label>
              <textarea name="summary" value={form.summary} onChange={handleChange} required rows={2} placeholder="One or two sentences…" className={`${inputClass} resize-none`} />
            </div>
            {/* Body */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Full description</label>
              <textarea name="body" value={form.body} onChange={handleChange} rows={5} placeholder="Full project description…" className={`${inputClass} resize-none`} />
            </div>
            {/* Images */}
            <div className="flex flex-col gap-3">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                Images <span className="normal-case opacity-50">(up to 6)</span>
              </label>
              {form.images.map((img, idx) => (
                <ImageUploadInput
                  key={idx}
                  value={img}
                  onChange={(val) => handleImageChange(idx, val)}
                  placeholder={`Image ${idx + 1} URL or upload`}
                />
              ))}
            </div>
            {/* Actions */}
            <div className="flex flex-col gap-2 pt-1">
              {saveError && (
                <p className="font-body text-red-400 text-xs">{saveError}</p>
              )}
              <div className="flex items-center gap-3">
                <button type="submit" disabled={saving} className="self-start border border-white/30 px-6 py-2.5 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40 cursor-pointer">
                  {saving ? "Saving…" : editing ? "Update project" : "Create project"}
                </button>
                <button type="button" onClick={cancel} className="font-body text-white/40 text-sm hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-2">
        {loading ? "Loading…" : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
      </p>
      {loading && (
        <div className="flex flex-col gap-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start justify-between gap-4 py-4 border-t border-white/10">
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-48 bg-white/8 animate-pulse rounded" />
                <div className="h-3 w-32 bg-white/5 animate-pulse rounded" />
              </div>
              <div className="h-3 w-16 bg-white/5 animate-pulse rounded" />
            </div>
          ))}
        </div>
      )}
      {!loading && projects.length === 0 && (
        <p className="font-body text-white/25 text-sm">No projects yet.</p>
      )}
      {!loading && projects.map((p) => (
        <div
          key={p.slug}
          className="flex items-start justify-between gap-4 py-4 border-t border-white/10 hover:border-white/20 transition-colors"
        >
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-body text-white font-semibold text-sm truncate">{p.title}</span>
              <span className={`font-body text-[9px] tracking-widest uppercase px-1.5 py-0.5 ${categoryColors[p.category]}`}>
                {p.category}
              </span>
              <span className={`font-body text-[9px] tracking-widest uppercase px-1.5 py-0.5 ${statusColors[p.status]}`}>
                {p.status}
              </span>
            </div>
            <span className="font-body text-white/40 text-xs">
              {p.year} · {p.lead}
            </span>
            <p className="font-body text-white/25 text-xs line-clamp-1 mt-0.5">{p.summary}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => startEdit(p)} className="font-body text-white/40 text-xs hover:text-white transition-colors cursor-pointer">Edit</button>
            <button onClick={() => handleDelete(p.slug)} className="font-body text-white/25 text-xs hover:text-red-400 transition-colors cursor-pointer">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
