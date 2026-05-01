import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { projectSchema } from "@/lib/validations";
import { auth } from "@/auth";
import { deleteImage } from "@/lib/cloudinary";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const project = await Project.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(project);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const project = await Project.findByIdAndDelete(id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const publicIds = [
    ...project.images.map((i: { publicId: string }) => i.publicId),
    project.beforeImage?.publicId,
    project.afterImage?.publicId,
  ].filter(Boolean) as string[];

  await Promise.allSettled(publicIds.map(deleteImage));

  return NextResponse.json({ success: true });
}
