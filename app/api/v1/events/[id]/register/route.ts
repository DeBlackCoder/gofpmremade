import { NextRequest } from "next/server";
import { successResponse } from "@/lib/api/local-db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json() as { firstName: string; lastName: string; email: string };
  const registration = {
    id: `reg-${Date.now()}`,
    eventId: id,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    checkedIn: false,
    createdAt: new Date().toISOString(),
  };
  return successResponse(registration, 201);
}
