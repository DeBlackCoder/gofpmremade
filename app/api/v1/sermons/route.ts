import { NextRequest, NextResponse } from "next/server";
import { readSermons } from "@/lib/db/json-storage";

/**
 * GET /api/v1/sermons
 * 
 * Public endpoint to retrieve sermons with pagination
 * Uses JSON file storage
 * 
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * 
 * @returns Paginated list of sermons
 */
export async function GET(req: NextRequest) {
  console.log("[/api/v1/sermons] GET request received");
  
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    console.log(`[/api/v1/sermons] Reading sermons from JSON file (page=${page}, limit=${limit})...`);
    
    // Read all sermons from JSON file
    const allSermons = await readSermons();
    console.log(`[/api/v1/sermons] ✓ Read ${allSermons.length} total sermons`);
    
    // Sort by date (newest first)
    const sortedSermons = allSermons.sort((a, b) => {
      const dateA = a.dateISO || a.date;
      const dateB = b.dateISO || b.date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    
    // Apply pagination
    const paginatedSermons = sortedSermons.slice(skip, skip + limit);
    const total = allSermons.length;
    
    console.log(`[/api/v1/sermons] ✓ Returning ${paginatedSermons.length} sermons for page ${page}`);

    // Return paginated response
    return NextResponse.json({
      success: true,
      data: {
        data: paginatedSermons,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    }, { status: 200 });

  } catch (error) {
    console.error("[/api/v1/sermons] ERROR:", error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to retrieve sermons",
        details: error instanceof Error ? error.message : String(error),
      },
    }, { status: 500 });
  }
}
