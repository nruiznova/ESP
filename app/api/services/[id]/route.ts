import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { serviceSchema } from "@/lib/validations";
import { auth } from "@/auth";
import { deleteImage } from "@/lib/cloudinary";
import { jsonErrorFromMongoOrUnknown } from "@/lib/mongo-http-error";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const payload = {
      ...parsed.data,
      imageUrl: parsed.data.imageUrl === "" ? undefined : parsed.data.imageUrl,
    };
    const service = await Service.findByIdAndUpdate(id, payload, { new: true });
    if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(service);
  } catch (e: unknown) {
    return jsonErrorFromMongoOrUnknown(e);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const { id } = await params;
    const service = await Service.findByIdAndDelete(id);
    if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (service.imagePublicId) {
      await deleteImage(service.imagePublicId).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return jsonErrorFromMongoOrUnknown(e);
  }
}
