import { NextRequest } from "next/server";
import { readData, writeData, successResponse, errorResponse } from "@/lib/api/local-db";
import type { GivingRecord, InitiateGivingInput } from "@/lib/types/resources";

export async function POST(req: NextRequest) {
  const body = await req.json() as InitiateGivingInput;

  if (!body.amount || body.amount <= 0) {
    return errorResponse("Amount is required and must be greater than 0");
  }

  const reference = `REF-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const record: GivingRecord = {
    id: `give-${Date.now()}`,
    reference,
    amount: body.amount,
    currency: "NGN",
    type: body.type || "Offering",
    frequency: body.frequency || "One-time",
    fullName: body.fullName || "",
    email: body.email || "",
    phone: body.phone || null,
    note: body.note || null,
    method: body.method || "PAYSTACK",
    status: "PENDING",
    paymentUrl: null,
    paidAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const records = readData<GivingRecord[]>("giving.json");
  records.unshift(record);
  writeData("giving.json", records);

  // Return initiation result — no payment gateway, so no paymentUrl
  return successResponse({
    reference,
    status: "PENDING",
    method: body.method || "PAYSTACK",
    paymentUrl: null,
  });
}
