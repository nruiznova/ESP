import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Lead } from "@/models/Lead";
import { leadSchema } from "@/lib/validations";
import { sendLeadNotification } from "@/lib/resend";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const unread = searchParams.get("unread");

  const filter: Record<string, unknown> = {};
  if (unread === "true") filter.read = false;

  const leads = await Lead.find(filter).sort({ createdAt: -1 });
  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const lead = await Lead.create(parsed.data);

  try {
    await sendLeadNotification(parsed.data);
  } catch {
    // Fail silently — lead is saved regardless
  }

  const whatsappNumber = process.env.WHATSAPP_NUMBER;
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `New inquiry from ${parsed.data.name} (${parsed.data.projectType}): ${parsed.data.description.slice(0, 200)}`
      )}`
    : null;

  return NextResponse.json({ lead, whatsappUrl }, { status: 201 });
}
