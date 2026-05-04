import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";

/**
 * DEBUG endpoint to check MongoDB connection and sermon data
 */
export async function GET(req: NextRequest) {
  try {
    const db = await getDatabase();
    const sermonsCollection = db.collection("sermons");
    
    // Get all sermons without any filters
    const allSermons = await sermonsCollection.find({}).toArray();
    
    // Get collection stats
    const count = await sermonsCollection.countDocuments({});
    
    return NextResponse.json({
      success: true,
      debug: {
        connectionSuccess: true,
        databaseName: db.databaseName,
        collectionName: "sermons",
        totalDocuments: count,
        sampleDocuments: allSermons.slice(0, 3), // First 3 sermons
        allSermonSlugs: allSermons.map(s => s.slug || s._id),
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Debug endpoint error:", error);
    
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
    }, { status: 500 });
  }
}
