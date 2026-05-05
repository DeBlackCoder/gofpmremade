import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/mongoose";
import Project from "@/lib/models/Project";

async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "authenticated";
  } catch {
    return false;
  }
}

// GET — list projects (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const skip = (page - 1) * limit;

    await connectDB();
    const [projects, total] = await Promise.all([
      Project.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Project.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        data: projects,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    console.error("[GET /api/v1/projects]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST — create project (admin)
export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    if (!body.title || !body.category || !body.summary) {
      return NextResponse.json({ success: false, error: "title, category and summary are required" }, { status: 400 });
    }
    const slug = body.slug || body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    await connectDB();
    const project = await Project.create({ ...body, slug });
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/v1/projects]", error);
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "A project with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 });
  }
}

// PUT — update project (admin)
export async function PUT(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    if (!body.slug) {
      return NextResponse.json({ success: false, error: "slug is required" }, { status: 400 });
    }
    await connectDB();
    const project = await Project.findOneAndUpdate(
      { slug: body.slug },
      { $set: body },
      { new: true, runValidators: true }
    ).lean();
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("[PUT /api/v1/projects]", error);
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE — delete project (admin)
export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ success: false, error: "slug is required" }, { status: 400 });
    }
    await connectDB();
    const result = await Project.findOneAndDelete({ slug });
    if (!result) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("[DELETE /api/v1/projects]", error);
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 });
  }
}
