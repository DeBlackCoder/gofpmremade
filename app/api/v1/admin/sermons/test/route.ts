import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";

/**
 * Simple test endpoint to check if sermons can be fetched
 * No authentication required for testing
 */
export async function GET() {
  try {
    const db = await getDatabase();
    const sermonsCollection = db.collection("sermons");
    const count = await sermonsCollection.countDocuments();
    const sermons = await sermonsCollection.find({}).limit(5).toArray();
    
    return NextResponse.json({
      success: true,
      count,
      sample: sermons,
      message: `Found ${count} sermons in database`,
    });
  } catch (error) {
    console.error("MongoDB Test Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      details: JSON.stringify(error, null, 2),
    }, { status: 500 });
  }
}
