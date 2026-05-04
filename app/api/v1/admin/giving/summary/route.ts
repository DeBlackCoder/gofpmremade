import { readData, successResponse } from "@/lib/api/local-db";
import type { GivingRecord } from "@/lib/types/resources";

export async function GET() {
  const records = readData<GivingRecord[]>("giving.json");
  const paid = records.filter((r) => r.status === "PAID");
  const total = paid.reduce((sum, r) => sum + r.amount, 0);
  const byType = paid.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + r.amount;
    return acc;
  }, {});
  return successResponse({ total, count: paid.length, byType });
}
