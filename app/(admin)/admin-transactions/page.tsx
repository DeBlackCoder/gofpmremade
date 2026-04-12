"use client";

import { useState } from "react";
import { useAdminGiving, useAdminGivingSummary } from "@/lib/hooks/queries";

export default function AdminTransactionsPage() {
  const [page, setPage] = useState(1);
  const limit = 25;

  const { data, isLoading, error } = useAdminGiving(page, limit);
  const { data: summary } = useAdminGivingSummary();

  const records = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const summaryData = summary as
    | { totals?: { amount?: number; records?: number } }
    | undefined;

  const totalAmount = Number(summaryData?.totals?.amount ?? 0);

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 sm:px-10 sm:py-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
          Admin
        </span>
        <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
          Transactions
        </h1>
        <p className="font-body text-white/40 text-sm mt-2">
          View all giving records and payment statuses.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="border border-white/10 bg-white/5 px-4 py-4">
          <p className="font-body text-white/35 text-[10px] tracking-widest uppercase">
            Total records
          </p>
          <p className="font-heading text-white font-black text-2xl mt-2">
            {total.toLocaleString()}
          </p>
        </div>
        <div className="border border-white/10 bg-white/5 px-4 py-4">
          <p className="font-body text-white/35 text-[10px] tracking-widest uppercase">
            Total amount
          </p>
          <p className="font-heading text-white font-black text-2xl mt-2">
            ₦{totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      <section className="border border-white/10 bg-white/5">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <p className="font-body text-white/70 text-sm">
            {total} transaction{total !== 1 ? "s" : ""}
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

        {isLoading && (
          <p className="px-4 py-4 font-body text-white/40 text-sm">
            Loading transactions…
          </p>
        )}

        {!isLoading && error && (
          <p className="px-4 py-4 font-body text-red-300 text-sm">
            Failed to load transactions.
          </p>
        )}

        {!isLoading && !error && records.length === 0 && (
          <p className="px-4 py-4 font-body text-white/35 text-sm">
            No transactions found.
          </p>
        )}

        {!isLoading && !error && records.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-4xl text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 font-body text-[10px] tracking-widest uppercase text-white/40">
                    Date
                  </th>
                  <th className="px-4 py-3 font-body text-[10px] tracking-widest uppercase text-white/40">
                    Name
                  </th>
                  <th className="px-4 py-3 font-body text-[10px] tracking-widest uppercase text-white/40">
                    Type
                  </th>
                  <th className="px-4 py-3 font-body text-[10px] tracking-widest uppercase text-white/40">
                    Amount
                  </th>
                  <th className="px-4 py-3 font-body text-[10px] tracking-widest uppercase text-white/40">
                    Method
                  </th>
                  <th className="px-4 py-3 font-body text-[10px] tracking-widest uppercase text-white/40">
                    Status
                  </th>
                  <th className="px-4 py-3 font-body text-[10px] tracking-widest uppercase text-white/40">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-white/10 last:border-b-0"
                  >
                    <td className="px-4 py-3 font-body text-white/65 text-xs">
                      {new Date(record.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-body text-white text-sm">
                      {record.fullName}
                    </td>
                    <td className="px-4 py-3 font-body text-white/70 text-xs uppercase">
                      {String(record.type).replaceAll("_", " ")}
                    </td>
                    <td className="px-4 py-3 font-body text-white text-sm">
                      {record.currency}{" "}
                      {Number(record.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-body text-white/70 text-xs uppercase">
                      {record.method}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-body text-[10px] tracking-widest uppercase px-2 py-1 border ${
                          record.status === "COMPLETED"
                            ? "border-emerald-400/30 text-emerald-300 bg-emerald-500/10"
                            : record.status === "FAILED"
                              ? "border-red-400/30 text-red-300 bg-red-500/10"
                              : "border-white/20 text-white/60 bg-white/5"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-body text-white/45 text-xs">
                      {record.reference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
