import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { serviceSchema } from "@/lib/validations";
import { auth } from "@/auth";
import { jsonErrorFromMongoOrUnknown } from "@/lib/mongo-http-error";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const all = searchParams.get("all");
    const filter: Record<string, unknown> = all === "true" ? {} : { active: true };
    if (category) filter.category = category;

    const services = await Service.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    return NextResponse.json(services);
  } catch (e: unknown) {
    return jsonErrorFromMongoOrUnknown(e);
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const payload = {
      ...parsed.data,
      imageUrl: parsed.data.imageUrl === "" ? undefined : parsed.data.imageUrl,
    };
    const service = await Service.create(payload);
    return NextResponse.json(service, { status: 201 });
  } catch (e: unknown) {
    return jsonErrorFromMongoOrUnknown(e);
  }
}
