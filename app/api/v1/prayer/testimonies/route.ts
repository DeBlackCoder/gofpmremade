import { NextRequest } from "next/server";
import { readData, writeData, successResponse } from "@/lib/api/local-db";
import type { ContactSubmission, TestimonyInput } from "@/lib/types/resources";

export async function GET() {
  const contacts = readData<ContactSubmission[]>("contacts.json");
  const testimonies = contacts.filter((c) => c.subject === "Testimony");
  return successResponse({ data: testimonies });
}

export async function POST(req: NextRequest) {
  const body = await req.json() as TestimonyInput;
  const contacts = readData<ContactSubmission[]>("contacts.json");
  const newTestimony: ContactSubmission = {
    id: `testimony-${Date.now()}`,
    name: body.fullName || body.name || "Anonymous",
    email: body.email || "",
    phone: body.phone || null,
    subject: "Testimony",
    message: body.content || body.message || "",
    read: false,
    submittedAt: new Date().toISOString(),
  };
  contacts.unshift(newTestimony);
  writeData("contacts.json", contacts);
  return successResponse(newTestimony, 201);
}
