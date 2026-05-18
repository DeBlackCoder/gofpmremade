import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session || session.value !== "authenticated") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { currentPassword, newEmail, newPassword } = await req.json();

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: "Current password is required" },
        { status: 400 }
      );
    }

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "sanctuary2021";

    if (currentPassword !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Credentials are stored in environment variables.
    // To update them, change ADMIN_EMAIL and ADMIN_PASSWORD in your
    // .env.local (local) or Vercel environment variables (production).
    // This endpoint validates the request but cannot update env vars at runtime.

    return NextResponse.json({
      success: true,
      message: "To apply credential changes, update ADMIN_EMAIL and ADMIN_PASSWORD in your environment variables.",
      newEmail: newEmail || undefined,
      newPassword: newPassword ? "••••••••" : undefined,
    });
  } catch (error) {
    console.error("[POST /api/admin/change-password]", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
