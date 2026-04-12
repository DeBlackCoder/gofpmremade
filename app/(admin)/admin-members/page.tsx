"use client";

import { useState } from "react";
import { useAdminMember, useAdminMembers } from "@/lib/hooks/queries";

export default function AdminMembersPage() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const { data, isLoading, error } = useAdminMembers(page, 25);
  const {
    data: selectedMember,
    isLoading: detailsLoading,
    error: detailsError,
  } = useAdminMember(selectedId);

  const members = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 sm:px-10 sm:py-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
          Admin
        </span>
        <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
          Members
        </h1>
        <p className="font-body text-white/40 text-sm mt-2">
          View member records and inspect details before promoting roles in the
          database.
        </p>
      </div>

      {isLoading && (
        <p className="font-body text-white/40 text-sm">Loading members…</p>
      )}

      {!isLoading && error && (
        <div className="border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="font-body text-red-300 text-sm">
            Failed to load members.
          </p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <section className="border border-white/10 bg-white/5">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <p className="font-body text-white/70 text-sm">
                {total} member{total !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="font-body text-xs text-white/60 border border-white/20 px-3 py-1 disabled:opacity-40 cursor-pointer"
                >
                  Prev
                </button>
                <span className="font-body text-white/40 text-xs">
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="font-body text-xs text-white/60 border border-white/20 px-3 py-1 disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>

            {members.length === 0 ? (
              <p className="px-4 py-4 font-body text-white/35 text-sm">
                No members found.
              </p>
            ) : (
              <div>
                {members.map((member) => {
                  const isSelected = selectedId === member.id;

                  return (
                    <button
                      key={member.id}
                      onClick={() => setSelectedId(member.id)}
                      className={`w-full text-left px-4 py-3 border-b border-white/10 transition-colors ${
                        isSelected ? "bg-white/15" : "hover:bg-white/8"
                      }`}
                    >
                      <p className="font-body text-white text-sm font-semibold">
                        {member.fullName || "Unnamed member"}
                      </p>
                      <p className="font-body text-white/45 text-xs mt-0.5">
                        {member.email}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="border border-white/10 bg-white/5 px-4 py-4">
            <p className="font-body text-white/35 text-[10px] tracking-widest uppercase mb-3">
              Member details
            </p>

            {!selectedId && (
              <p className="font-body text-white/45 text-sm">
                Select a member to load full details.
              </p>
            )}

            {selectedId && detailsLoading && (
              <p className="font-body text-white/45 text-sm">
                Loading details…
              </p>
            )}

            {selectedId && detailsError && (
              <p className="font-body text-red-300 text-sm">
                Could not load member details.
              </p>
            )}

            {selectedId && selectedMember && (
              <div className="flex flex-col gap-3">
                <div>
                  <p className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    Name
                  </p>
                  <p className="font-body text-white text-sm mt-1">
                    {selectedMember.fullName || "Unnamed member"}
                  </p>
                </div>
                <div>
                  <p className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    Email
                  </p>
                  <p className="font-body text-white text-sm mt-1">
                    {selectedMember.email}
                  </p>
                </div>
                <div>
                  <p className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    Phone
                  </p>
                  <p className="font-body text-white text-sm mt-1">
                    {selectedMember.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    Role
                  </p>
                  <p className="font-body text-white text-sm mt-1">
                    {selectedMember.role || "MEMBER"}
                  </p>
                </div>
                <div>
                  <p className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    Status
                  </p>
                  <p className="font-body text-white text-sm mt-1">
                    {selectedMember.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div>
                  <p className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                    Joined
                  </p>
                  <p className="font-body text-white text-sm mt-1">
                    {selectedMember.createdAt
                      ? new Date(selectedMember.createdAt).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
