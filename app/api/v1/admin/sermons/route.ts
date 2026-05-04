import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSermons, createSermon, updateSermon, deleteSermon, getSermonBySlug } from "@/lib/db/json-storage";
import type { Sermon } from "@/lib/types/sermon";
import { validateSermon } from "@/lib/utils/sermon-validation";

/**
 * Verify admin authentication from request cookies
 */
async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "authenticated";
}

/**
 * Generate a URL-friendly slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * GET /api/v1/admin/sermons
 * Retrieves all sermons from JSON file
 */
export async function GET(req: NextRequest) {
  const isAuthenticated = await verifyAdminAuth();
  
  if (!isAuthenticated) {
    return NextResponse.json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      },
    }, { status: 401 });
  }

  try {
    const sermons = await readSermons();

    return NextResponse.json({
      success: true,
      data: sermons,
    }, { status: 200 });

  } catch (error) {
    console.error("Error retrieving sermons:", error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to retrieve sermons",
      },
    }, { status: 500 });
  }
}

/**
 * POST /api/v1/admin/sermons
 * Creates a new sermon in JSON file
 */
export async function POST(req: NextRequest) {
  const isAuthenticated = await verifyAdminAuth();
  
  if (!isAuthenticated) {
    return NextResponse.json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      },
    }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validate sermon data
    const validationResult = validateSermon(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: validationResult.errors,
        },
      }, { status: 400 });
    }

    // Generate slug from title if not provided
    const sermonData = validationResult.data as Sermon;
    if (!sermonData.slug || sermonData.slug.trim() === "") {
      sermonData.slug = generateSlug(sermonData.title);
    }

    // Create sermon
    const createdSermon = await createSermon(sermonData);

    return NextResponse.json({
      success: true,
      data: createdSermon,
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating sermon:", error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to create sermon",
      },
    }, { status: 500 });
  }
}

/**
 * PUT /api/v1/admin/sermons
 * Updates an existing sermon in JSON file
 */
export async function PUT(req: NextRequest) {
  const isAuthenticated = await verifyAdminAuth();
  
  if (!isAuthenticated) {
    return NextResponse.json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      },
    }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Slug is required for updating a sermon",
        },
      }, { status: 400 });
    }

    // Validate sermon data
    const validationResult = validateSermon(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: validationResult.errors,
        },
      }, { status: 400 });
    }

    // Check if sermon exists
    const existingSermon = await getSermonBySlug(slug);

    if (!existingSermon) {
      return NextResponse.json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Sermon not found",
        },
      }, { status: 404 });
    }

    // Update sermon
    const sermonData = validationResult.data as Sermon;
    const updatedSermon = await updateSermon(slug, sermonData);

    return NextResponse.json({
      success: true,
      data: updatedSermon,
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating sermon:", error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to update sermon",
      },
    }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/admin/sermons
 * Deletes a sermon from JSON file
 */
export async function DELETE(req: NextRequest) {
  const isAuthenticated = await verifyAdminAuth();
  
  if (!isAuthenticated) {
    return NextResponse.json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      },
    }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Slug is required for deleting a sermon",
        },
      }, { status: 400 });
    }

    // Check if sermon exists
    const existingSermon = await getSermonBySlug(slug);

    if (!existingSermon) {
      return NextResponse.json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Sermon not found",
        },
      }, { status: 404 });
    }

    // Delete sermon
    const deleted = await deleteSermon(slug);

    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Failed to delete sermon",
        },
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Sermon deleted successfully",
    }, { status: 200 });

  } catch (error) {
    console.error("Error deleting sermon:", error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to delete sermon",
      },
    }, { status: 500 });
  }
}
