"use client";

import { useEffect, useState } from "react";
import type { Sermon, SeriesTag } from "@/lib/sermons-data";

const emptyForm = {
  slug: "", title: "", subtitle: "", series: "", tag: "Faith" as SeriesTag,
  date: "", dateISO: "", pastor: "", pastorRole: "", pastorPhoto: "",
  readTime: "", scripture: "", excerpt: "", body: "", featured: false,
};

const tags: SeriesTag[] = ["Faith", "Family", "Prayer", "Identity", "Prophecy"];

export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetch("/api/admin/sermons").then((r) => r.json()).then(setSermons); }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
  }

  function startEdit(sermon: Sermon) {
    setEditing(sermon.slug);
    setForm({ ...emptyForm, ...sermon });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() { setEditing(null); setForm(emptyForm); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const payload = { ...form, slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") };
    const method = editing ? "PUT" : "POST";
    const res = await fetch("/api/admin/sermons", {
      method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    if (res.ok) {
      const updated = await fetch("/api/admin/sermons").then((r) => r.json());
      setSermons(updated); setForm(emptyForm); setEditing(null);
    } else { setError("Failed to save."); }
    setSaving(false);
  }

  async function handleDelete(slug: string) {
    if (!confirm("Delete this sermon?")) return;
    await fetch("/api/admin/sermons", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
    setSermons((p) => p.filter((s) => s.slug !== slug));
  }

  const inputClass = "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 sm:px-10 sm:py-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">Admin</span>
        <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">Sermons</h1>
      </div>

      {/* Form */}
      <div className="border border-white/10 p-6 mb-10 backdrop-blur-sm bg-white/3">
        <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-5">
          {editing ? "Edit sermon" : "New sermon"}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Title</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="Sermon title" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Subtitle</label>
              <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="One-line subtitle" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Series</label>
              <input name="series" value={form.series} onChange={handleChange} placeholder="Series name" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Tag</label>
              <select name="tag" value={form.tag} onChange={handleChange} className={`${inputClass} appearance-none`}>
                {tags.map((t) => <option key={t} value={t} className="text-black">{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Scripture</label>
              <input name="scripture" value={form.scripture} onChange={handleChange} placeholder="John 3:16" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Pastor</label>
              <input name="pastor" value={form.pastor} onChange={handleChange} placeholder="Pastor name" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Role</label>
              <input name="pastorRole" value={form.pastorRole} onChange={handleChange} placeholder="Senior Pastor" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Date</label>
              <input name="dateISO" type="date" value={form.dateISO} onChange={(e) => setForm((p) => ({ ...p, dateISO: e.target.value, date: new Date(e.target.value).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) }))} className={inputClass} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Excerpt</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} placeholder="Short excerpt shown in listings…" className={`${inputClass} resize-none`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Body <span className="normal-case opacity-50">(separate paragraphs with blank line, *text* for italic)</span></label>
            <textarea name="body" value={form.body} onChange={handleChange} rows={8} placeholder="Sermon body…" className={`${inputClass} resize-none`} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-white" />
            <span className="font-body text-white/60 text-sm">Mark as featured</span>
          </label>
          {error && <p className="font-body text-red-400 text-xs">{error}</p>}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving}
              className="self-start border border-white/30 px-6 py-2.5 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40 cursor-pointer">
              {saving ? "Saving…" : editing ? "Update sermon" : "Create sermon"}
            </button>
            {editing && (
              <button type="button" onClick={cancelEdit} className="font-body text-white/40 text-sm hover:text-white transition-colors">Cancel</button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-2">{sermons.length} sermon{sermons.length !== 1 ? "s" : ""}</p>
      {sermons.length === 0 && <p className="font-body text-white/25 text-sm">No sermons created yet.</p>}
      {sermons.map((s) => (
        <div key={s.slug} className="flex items-start justify-between gap-4 py-4 border-t border-white/10 hover:border-white/20 transition-colors">
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-body text-white font-semibold text-sm truncate">{s.title}</span>
              {s.featured && <span className="font-body text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-white/10 text-white/50 border border-white/15">Featured</span>}
              <span className="font-body text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-white/5 text-white/35 border border-white/10">{s.tag}</span>
            </div>
            <span className="font-body text-white/35 text-xs italic">{s.scripture} · {s.pastor} · {s.date}</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => startEdit(s)} className="font-body text-white/40 text-xs hover:text-white transition-colors cursor-pointer">Edit</button>
            <button onClick={() => handleDelete(s.slug)} className="font-body text-white/25 text-xs hover:text-red-400 transition-colors cursor-pointer">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
