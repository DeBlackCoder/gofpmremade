import { NextRequest } from "next/server";
import { readData, writeData, successResponse, paginatedResponse } from "@/lib/api/local-db";
import type { ContactSubmission, PrayerRequestInput } from "@/lib/types/resources";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const contacts = readData<ContactSubmission[]>("contacts.json");
  const prayers = contacts.filter((c) => c.subject === "Prayer Request");
  return paginatedResponse(prayers, page);
}

export async function POST(req: NextRequest) {
  const body = await req.json() as PrayerRequestInput;
  const contacts = readData<ContactSubmission[]>("contacts.json");
  const newRequest: ContactSubmission = {
    id: `prayer-${Date.now()}`,
    name: body.fullName || body.name || "Anonymous",
    email: body.email || "",
    phone: body.phone || null,
    subject: "Prayer Request",
    message: body.request || body.message || "",
    read: false,
    submittedAt: new Date().toISOString(),
  };
  contacts.unshift(newRequest);
  writeData("contacts.json", contacts);
  return successResponse(newRequest, 201);
}
