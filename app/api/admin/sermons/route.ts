import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { readJSON, writeJSON } from "@/lib/data-store";
import type { Sermon } from "@/lib/sermons-data";
import { randomUUID } from "crypto";

const FILE = "sermons.json";

export async function GET() {
  // Public — returns custom sermons created via admin
  return NextResponse.json(readJSON<Sermon[]>(FILE, []));
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const sermons = readJSON<Sermon[]>(FILE, []);
  const sermon: Sermon = { ...body, slug: body.slug || randomUUID() };
  writeJSON(FILE, [sermon, ...sermons]);
  return NextResponse.json(sermon, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const sermons = readJSON<Sermon[]>(FILE, []);
  writeJSON(FILE, sermons.map((s) => s.slug === body.slug ? { ...s, ...body } : s));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await req.json();
  const sermons = readJSON<Sermon[]>(FILE, []);
  writeJSON(FILE, sermons.filter((s) => s.slug !== slug));
  return NextResponse.json({ ok: true });
}
