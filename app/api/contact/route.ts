import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/data-store";
import type { ContactSubmission } from "@/lib/contact-data";
import { randomUUID } from "crypto";

const FILE = "contacts.json";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const submissions = readJSON<ContactSubmission[]>(FILE, []);
  const entry: ContactSubmission = {
    ...body,
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    read: false,
  };
  writeJSON(FILE, [entry, ...submissions]);
  return NextResponse.json({ ok: true }, { status: 201 });
}
