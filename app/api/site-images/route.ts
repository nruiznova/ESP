import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteImages } from "@/models/SiteImages";
import { siteImagesSchema } from "@/lib/validations";
import { auth } from "@/auth";

const emptySiteImages = {
  homeHero: null,
  homeCommercial: null,
  homeResidential: null,
  commercialBanner: null,
  commercialSection: null,
  residentialBanner: null,
  residentialBeforeAfter: [
    { title: "Kitchen Transformation", before: null, after: null },
    { title: "Custom Tile Shower", before: null, after: null },
  ],
};

export async function GET() {
  try {
    await connectDB();
    let siteImages = await SiteImages.findOne().lean();
    if (!siteImages) {
      siteImages = (await SiteImages.create({})).toObject();
    }
    return NextResponse.json(siteImages);
  } catch (error) {
    console.error("GET /api/site-images failed:", error);
    return NextResponse.json(emptySiteImages);
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = siteImagesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await connectDB();
    const siteImages = await SiteImages.findOneAndUpdate({}, parsed.data, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });

    return NextResponse.json(siteImages);
  } catch (error) {
    console.error("PUT /api/site-images failed:", error);
    return NextResponse.json(
      {
        error:
          "Could not save site images. Check that MongoDB is running and MONGODB_URI is configured in .env.local.",
      },
      { status: 503 }
    );
  }
}
