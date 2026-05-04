import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    data: { accessToken: "local-token", refreshToken: "local-refresh" },
  });
}
