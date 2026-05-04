import { NextResponse } from "next/server";
import { countSermons } from "@/lib/db/json-storage";

/**
 * GET /api/v1/sermons/count
 * 
 * Public endpoint to retrieve the total count of sermons
 * Uses JSON file storage
 */
export async function GET() {
  console.log("[/api/v1/sermons/count] GET request received");
  
  try {
    console.log("[/api/v1/sermons/count] Counting sermons from JSON file...");
    const total = await countSermons();
    console.log(`[/api/v1/sermons/count] ✓ Found ${total} sermons`);

    return NextResponse.json({
      success: true,
      data: {
        total: total,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("[/api/v1/sermons/count] ERROR:", error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to retrieve sermon count",
        details: error instanceof Error ? error.message : String(error),
      },
    }, { status: 500 });
  }
}
