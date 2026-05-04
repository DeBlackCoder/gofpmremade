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

type SeriesTag = "Faith" | "Family" | "Prayer" | "Identity" | "Prophecy";

interface Sermon {
  slug: string;
  title: string;
  subtitle?: string;
  series?: string;
  tag: SeriesTag;
  date: string;
  dateISO?: string;
  pastor: string;
  pastorRole?: string;
  scripture?: string;
  excerpt?: string;
  body?: string;
  featured?: boolean;
  podcastLinks?: {
    spotify?: string;
    apple?: string;
    youtube?: string;
  };
}

const emptyForm = {
  slug: "",
  title: "",
  subtitle: "",
  series: "",
  tag: "Faith" as SeriesTag,
  date: "",
  dateISO: "",
  pastor: "",
  pastorRole: "",
  pastorPhoto: "",
  readTime: "",
  scripture: "",
  excerpt: "",
  body: "",
  featured: false,
  podcastSpotify: "",
  podcastApple: "",
  podcastYoutube: "",
};

const tags: SeriesTag[] = ["Faith", "Family", "Prayer", "Identity", "Prophecy"];

export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get<{ success: boolean; data: Sermon[] }>("/admin/sermons")
      .then((response) => setSermons(response.data));
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = e.target;
    setForm((p) => ({
      ...p,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function startEdit(sermon: Sermon) {
    setEditing(sermon.slug);
    setForm({
      ...emptyForm,
      ...sermon,
      podcastSpotify: sermon.podcastLinks?.spotify ?? "",
      podcastApple: sermon.podcastLinks?.apple ?? "",
      podcastYoutube: sermon.podcastLinks?.youtube ?? "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    // Build podcast links object only if at least one link is provided
    const podcastLinks: { spotify?: string; apple?: string; youtube?: string } = {};
    if (form.podcastSpotify.trim()) podcastLinks.spotify = form.podcastSpotify;
    if (form.podcastApple.trim()) podcastLinks.apple = form.podcastApple;
    if (form.podcastYoutube.trim()) podcastLinks.youtube = form.podcastYoutube;

    const payload = {
      slug:
        form.slug ||
        form.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      title: form.title,
      subtitle: form.subtitle,
      series: form.series,
      tag: form.tag,
      date: form.date,
      dateISO: form.dateISO,
      pastor: form.pastor,
      pastorRole: form.pastorRole,
      scripture: form.scripture,
      excerpt: form.excerpt,
      body: form.body,
      featured: form.featured,
      ...(Object.keys(podcastLinks).length > 0 && { podcastLinks }),
    };
    const method = editing ? "PUT" : "POST";
    const response =
      method === "PUT"
        ? await apiClient.put<{ success: boolean; data: Sermon }>(
            "/admin/sermons",
            payload,
          )
        : await apiClient.post<{ success: boolean; data: Sermon }>(
            "/admin/sermons",
            payload,
          );

    if (response && response.success) {
      const updated = await apiClient.get<{ success: boolean; data: Sermon[] }>(
        "/admin/sermons",
      );
      setSermons(updated.data);
      setForm(emptyForm);
      setEditing(null);
      setShowForm(false);
    } else {
      setError("Failed to save.");
    }
    setSaving(false);
  }

  async function handleDelete(slug: string) {
    if (!confirm("Delete this sermon?")) return;
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>("/admin/sermons", { slug });
    if (response && response.success) {
      setSermons((p) => p.filter((s) => s.slug !== slug));
    }
  }

  const inputClass =
    "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-5xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Admin
          </span>
          <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
            Sermons
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
            + New sermon
          </button>
        )}
      </div>

      {/* Form — shown only when creating or editing */}
      {showForm && (
        <div className="border border-white/10 p-6 mb-10 backdrop-blur-sm bg-white/3">
          <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-5">
            {editing ? "Edit sermon" : "New sermon"}
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
                  placeholder="Sermon title"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Subtitle
                </label>
                <input
                  name="subtitle"
                  value={form.subtitle}
                  onChange={handleChange}
                  placeholder="One-line subtitle"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Series
                </label>
                <input
                  name="series"
                  value={form.series}
                  onChange={handleChange}
                  placeholder="Series name"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Tag
                </label>
                <Select
                  value={form.tag}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, tag: v as SeriesTag }))
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/15 text-white rounded-none h-10 w-full data-[size=default]:h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Scripture
                </label>
                <input
                  name="scripture"
                  value={form.scripture}
                  onChange={handleChange}
                  placeholder="John 3:16"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Pastor
                </label>
                <input
                  name="pastor"
                  value={form.pastor}
                  onChange={handleChange}
                  placeholder="Pastor name"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Role
                </label>
                <input
                  name="pastorRole"
                  value={form.pastorRole}
                  onChange={handleChange}
                  placeholder="Senior Pastor"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Date
                </label>
                <DatePicker
                  value={form.dateISO}
                  onChange={(iso) =>
                    setForm((p) => ({
                      ...p,
                      dateISO: iso,
                      date: new Date(iso).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={2}
                placeholder="Short excerpt shown in listings…"
                className={`${inputClass} resize-none`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                Body{" "}
                <span className="normal-case opacity-50">
                  (separate paragraphs with blank line, *text* for italic)
                </span>
              </label>
              <textarea
                name="body"
                value={form.body}
                onChange={handleChange}
                rows={8}
                placeholder="Sermon body…"
                className={`${inputClass} resize-none`}
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-4 h-4 accent-white"
              />
              <span className="font-body text-white/60 text-sm">
                Mark as featured
              </span>
            </label>

            {/* Podcast links */}
            <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
              <p className="font-body text-white/30 text-[10px] tracking-widest uppercase">
                Podcast links{" "}
                <span className="normal-case opacity-60">(optional)</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    Spotify
                  </label>
                  <input
                    name="podcastSpotify"
                    value={form.podcastSpotify}
                    onChange={handleChange}
                    placeholder="https://open.spotify.com/..."
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    Apple Podcasts
                  </label>
                  <input
                    name="podcastApple"
                    value={form.podcastApple}
                    onChange={handleChange}
                    placeholder="https://podcasts.apple.com/..."
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    YouTube
                  </label>
                  <input
                    name="podcastYoutube"
                    value={form.podcastYoutube}
                    onChange={handleChange}
                    placeholder="https://youtube.com/..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
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
                    ? "Update sermon"
                    : "Create sermon"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="font-body text-white/40 text-sm hover:text-white transition-colors"
                >
                  Cancel
                </button>
              )}
              {!editing && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm(emptyForm);
                  }}
                  className="font-body text-white/40 text-sm hover:text-white transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-2">
        {sermons.length} sermon{sermons.length !== 1 ? "s" : ""}
      </p>
      {sermons.length === 0 && (
        <p className="font-body text-white/25 text-sm">
          No sermons created yet.
        </p>
      )}
      {sermons.map((s) => (
        <div
          key={s.slug}
          className="flex items-start justify-between gap-4 py-4 border-t border-white/10 hover:border-white/20 transition-colors"
        >
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-body text-white font-semibold text-sm truncate">
                {s.title}
              </span>
              {s.featured && (
                <span className="font-body text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-white/10 text-white/50 border border-white/15">
                  Featured
                </span>
              )}
              <span className="font-body text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-white/5 text-white/35 border border-white/10">
                {s.tag}
              </span>
            </div>
            <span className="font-body text-white/35 text-xs italic">
              {s.scripture} · {s.pastor} · {s.date}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => startEdit(s)}
              className="font-body text-white/40 text-xs hover:text-white transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(s.slug)}
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
