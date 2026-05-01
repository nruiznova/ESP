import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/models/Testimonial";
import { testimonialSchema } from "@/lib/validations";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all");

  if (all === "true") {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    return NextResponse.json(testimonials);
  }

  const testimonials = await Testimonial.find({ visible: true }).sort({ createdAt: -1 });
  return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const testimonial = await Testimonial.create(parsed.data);
  return NextResponse.json(testimonial, { status: 201 });
}
