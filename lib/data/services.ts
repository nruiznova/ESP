import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models/Service";

/** Shape expected by `ServiceGrid` and public listings */
export type PublicService = {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: "commercial" | "residential";
};

/**
 * Active services for the public site (same rules as GET /api/services without ?all=true).
 * Reads Mongo directly to avoid self-fetch issues (host, IPv6, static generation cache).
 */
export async function getActiveServicesForSite(
  category?: "commercial" | "residential"
): Promise<PublicService[]> {
  try {
    await connectDB();
    const filter: Record<string, unknown> = { active: true };
    if (category) filter.category = category;
    const docs = await Service.find(filter).sort({ displayOrder: 1, createdAt: -1 }).lean();
    return docs.map((d) => ({
      _id: String(d._id),
      title: d.title,
      description: d.description,
      imageUrl: d.imageUrl || undefined,
      category: d.category as "commercial" | "residential",
    }));
  } catch {
    return [];
  }
}
