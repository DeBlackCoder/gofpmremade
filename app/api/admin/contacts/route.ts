import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { readJSON, writeJSON } from "@/lib/data-store";
import type { ContactSubmission } from "@/lib/contact-data";

const FILE = "contacts.json";

export async function GET() {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(readJSON<ContactSubmission[]>(FILE, []));
}

export async function PATCH(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const submissions = readJSON<ContactSubmission[]>(FILE, []);
  writeJSON(FILE, submissions.map((s) => s.id === id ? { ...s, read: true } : s));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const submissions = readJSON<ContactSubmission[]>(FILE, []);
  writeJSON(FILE, submissions.filter((s) => s.id !== id));
  return NextResponse.json({ ok: true });
}
