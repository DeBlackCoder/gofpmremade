import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import type { Sermon } from "@/lib/types/sermon";

/**
 * GET /api/v1/sermons/[id]
 * 
 * Public endpoint to retrieve a single sermon by ID or slug
 * 
 * @param params - Route parameters containing the sermon ID or slug
 * @returns Single sermon document
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Connect to MongoDB and get the sermons collection
    const db = await getDatabase();
    const sermonsCollection = db.collection<Sermon>("sermons");

    // Try to find by slug first, then by _id
    let sermon = await sermonsCollection.findOne({ slug: id });
    
    if (!sermon) {
      // Try finding by MongoDB _id if the id looks like an ObjectId
      try {
        const { ObjectId } = await import("mongodb");
        if (ObjectId.isValid(id)) {
          sermon = await sermonsCollection.findOne({ _id: new ObjectId(id) });
        }
      } catch (e) {
        // Not a valid ObjectId, continue
      }
    }

    if (!sermon) {
      return NextResponse.json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Sermon not found",
        },
      }, { status: 404 });
    }

    // Transform MongoDB document to match expected Sermon type
    const transformedSermon = {
      ...sermon,
      id: sermon.slug || sermon._id.toString(),
      createdAt: sermon.dateISO || sermon.date || new Date().toISOString(),
      updatedAt: sermon.dateISO || sermon.date || new Date().toISOString(),
      content: sermon.body,
      author: sermon.pastor,
    };

    // Return sermon
    return NextResponse.json({
      success: true,
      data: transformedSermon,
    }, { status: 200 });

  } catch (error) {
    console.error("Error retrieving sermon:", error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to retrieve sermon",
      },
    }, { status: 500 });
  }
}
