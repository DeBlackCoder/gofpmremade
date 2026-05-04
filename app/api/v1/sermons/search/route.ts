import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import type { Sermon } from "@/lib/types/sermon";

/**
 * GET /api/v1/sermons/search
 * 
 * Public endpoint to search sermons
 * 
 * Query parameters:
 * - q: Search query (required)
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * 
 * @returns Paginated search results
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    if (!query || query.trim() === "") {
      return NextResponse.json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Search query is required",
        },
      }, { status: 400 });
    }

    // Connect to MongoDB and get the sermons collection
    const db = await getDatabase();
    const sermonsCollection = db.collection<Sermon>("sermons");

    // Create text search filter
    // Search in title, subtitle, excerpt, body, pastor, series, scripture
    const searchRegex = new RegExp(query.trim(), "i");
    const searchFilter = {
      $or: [
        { title: searchRegex },
        { subtitle: searchRegex },
        { excerpt: searchRegex },
        { body: searchRegex },
        { pastor: searchRegex },
        { series: searchRegex },
        { scripture: searchRegex },
      ],
    };

    // Query sermons with search filter and pagination
    const [sermons, total] = await Promise.all([
      sermonsCollection
        .find(searchFilter)
        .sort({ dateISO: -1, date: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      sermonsCollection.countDocuments(searchFilter),
    ]);

    // Transform MongoDB documents to match expected Sermon type
    const transformedSermons = sermons.map((sermon) => ({
      ...sermon,
      id: sermon.slug || sermon._id.toString(),
      createdAt: sermon.dateISO || sermon.date || new Date().toISOString(),
      updatedAt: sermon.dateISO || sermon.date || new Date().toISOString(),
      content: sermon.body,
      author: sermon.pastor,
    }));

    // Return paginated search results in the format expected by the frontend
    return NextResponse.json({
      success: true,
      data: {
        data: transformedSermons,
        total,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Error searching sermons:", error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to search sermons",
      },
    }, { status: 500 });
  }
}
