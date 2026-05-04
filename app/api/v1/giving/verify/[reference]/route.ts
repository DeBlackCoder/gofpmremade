import { NextRequest } from "next/server";
import { readData, writeData, successResponse, errorResponse } from "@/lib/api/local-db";
import type { GivingRecord } from "@/lib/types/resources";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const records = readData<GivingRecord[]>("giving.json");
  const record = records.find((r) => r.reference === reference);
  if (!record) return errorResponse("Record not found", 404);

  // Mark as paid
  const idx = records.findIndex((r) => r.reference === reference);
  records[idx] = { ...record, status: "PAID", paidAt: new Date().toISOString() };
  writeData("giving.json", records);

  return successResponse(records[idx]);
}
