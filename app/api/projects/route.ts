import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { projectSchema } from "@/lib/validations";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const limit = searchParams.get("limit");

  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  if (featured === "true") filter.featured = true;

  let query = Project.find(filter).sort({ createdAt: -1 });
  if (limit) query = query.limit(parseInt(limit));

  const projects = await query;
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const project = await Project.create(parsed.data);
  return NextResponse.json(project, { status: 201 });
}
