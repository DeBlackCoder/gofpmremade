"use client";

import { useEffect, useState } from "react";
import type { CommunityGroup, GroupTag } from "@/lib/community-data";
import { ministriesApi } from "@/lib/api/endpoints/ministries";
import type { MinistryGroup } from "@/lib/types/resources";

const tags: GroupTag[] = ["Men", "Women", "Youth", "Families", "All Ages"];
const empty = {
  name: "",
  tag: "All Ages" as GroupTag,
  meets: "",
  leader: "",
  bio: "",
  spots: "",
};

function tagToBackend(
  tag: GroupTag,
): "MEN" | "WOMEN" | "YOUTH" | "FAMILIES" | "ALL_AGES" {
  const mapping: Record<
    GroupTag,
    "MEN" | "WOMEN" | "YOUTH" | "FAMILIES" | "ALL_AGES"
  > = {
    Men: "MEN",
    Women: "WOMEN",
    Youth: "YOUTH",
    Families: "FAMILIES",
    "All Ages": "ALL_AGES",
  };

  return mapping[tag];
}

function backendToTag(tag: string): GroupTag {
  const mapping: Record<string, GroupTag> = {
    MEN: "Men",
    WOMEN: "Women",
    YOUTH: "Youth",
    FAMILIES: "Families",
    ALL_AGES: "All Ages",
  };

  return mapping[tag] || "All Ages";
}

export default function AdminCommunityPage() {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    ministriesApi
      .list(1, 100)
      .then((payload) => {
        const groups = (payload?.data ?? []).map((group: MinistryGroup) => ({
          ...group,
          tag: backendToTag(group.tag),
        }));
        setGroups(groups);
      })
      .catch(() => setGroups([]));
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function startEdit(g: CommunityGroup) {
    setEditing(g.id);
    setForm({ ...empty, ...g, spots: g.spots != null ? String(g.spots) : "" });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancel() {
    setEditing(null);
    setForm(empty);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      tag: tagToBackend(form.tag),
      meets: form.meets,
      leader: form.leader,
      bio: form.bio,
      spots: form.spots ? Number(form.spots) : null,
    };
    try {
      if (editing) {
        await ministriesApi.update(editing, payload);
      } else {
        await ministriesApi.create(payload);
      }

      const updated = await ministriesApi.list(1, 100);
      const nextGroups = (updated?.data ?? []).map((group: MinistryGroup) => ({
        ...group,
        tag: backendToTag(group.tag),
      }));
      setGroups(nextGroups);
      cancel();
    } catch {
      setError("Failed to save.");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this group?")) return;
    await ministriesApi.delete(id);
    setGroups((p) => p.filter((g) => g.id !== id));
  }

  const inputClass =
    "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 sm:px-10 sm:py-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Admin
          </span>
          <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
            Community
          </h1>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setEditing(null);
              setForm(empty);
              setShowForm(true);
            }}
            className="border border-white/30 px-5 py-2 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
          >
            + New group
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="border border-white/10 p-6 mb-10 backdrop-blur-sm bg-white/3">
          <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-5">
            {editing ? "Edit group" : "New group"}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Group name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Men of Valour"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Tag
                </label>
                <select
                  name="tag"
                  value={form.tag}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none`}
                >
                  {tags.map((t) => (
                    <option key={t} value={t} className="text-black">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Leader
                </label>
                <input
                  name="leader"
                  value={form.leader}
                  onChange={handleChange}
                  required
                  placeholder="Leader name"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Meets
                </label>
                <input
                  name="meets"
                  value={form.meets}
                  onChange={handleChange}
                  required
                  placeholder="Saturdays, 7:00 AM"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Spots{" "}
                  <span className="normal-case opacity-50">
                    (leave blank = open)
                  </span>
                </label>
                <input
                  name="spots"
                  type="number"
                  min="1"
                  value={form.spots}
                  onChange={handleChange}
                  placeholder="Unlimited"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                Description
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description of the group…"
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
                {saving ? "Saving…" : editing ? "Update group" : "Create group"}
              </button>
              <button
                type="button"
                onClick={cancel}
                className="font-body text-white/40 text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-2">
        {groups.length} group{groups.length !== 1 ? "s" : ""}
      </p>
      {groups.length === 0 && (
        <p className="font-body text-white/25 text-sm">No groups yet.</p>
      )}
      {groups.map((g) => (
        <div
          key={g.id}
          className="flex items-start justify-between gap-4 py-4 border-t border-white/10 hover:border-white/20 transition-colors"
        >
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-body text-white font-semibold text-sm">
                {g.name}
              </span>
              <span className="font-body text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-white/10 text-white/50 border border-white/15">
                {g.tag}
              </span>
              {g.spots != null && (
                <span className="font-body text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-amber-500/15 text-amber-300 border border-amber-500/20">
                  {g.spots} spots
                </span>
              )}
            </div>
            <span className="font-body text-white/40 text-xs">
              {g.meets} · {g.leader}
            </span>
            {g.bio && (
              <span className="font-body text-white/25 text-xs mt-0.5 line-clamp-1">
                {g.bio}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => startEdit(g)}
              className="font-body text-white/40 text-xs hover:text-white transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(g.id)}
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
