import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { readJSON, writeJSON } from "@/lib/data-store";
import type { CommunityGroup } from "@/lib/community-data";
import { randomUUID } from "crypto";

const FILE = "community.json";

export async function GET() {
  return NextResponse.json(readJSON<CommunityGroup[]>(FILE, []));
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const groups = readJSON<CommunityGroup[]>(FILE, []);
  const group: CommunityGroup = { ...body, id: randomUUID(), spots: body.spots ? Number(body.spots) : null };
  writeJSON(FILE, [...groups, group]);
  return NextResponse.json(group, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const groups = readJSON<CommunityGroup[]>(FILE, []);
  writeJSON(FILE, groups.map((g) => g.id === body.id ? { ...g, ...body, spots: body.spots ? Number(body.spots) : null } : g));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  writeJSON(FILE, readJSON<CommunityGroup[]>(FILE, []).filter((g) => g.id !== id));
  return NextResponse.json({ ok: true });
}
