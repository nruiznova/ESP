import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";

/** Shape expected by `PortfolioPreview` */
export type PublicProjectPreview = {
  _id: string;
  title: string;
  description: string;
  category: "commercial" | "residential";
  images: { url: string; publicId: string }[];
};

/** Shape expected by `PortfolioClient` */
export type PublicProject = PublicProjectPreview & {
  featured: boolean;
  beforeImage?: { url: string; publicId: string } | null;
  afterImage?: { url: string; publicId: string } | null;
};

function mapDocToPreview(d: {
  _id: unknown;
  title: string;
  description: string;
  category: string;
  images?: { url: string; publicId: string }[];
  afterImage?: { url: string; publicId: string } | null;
  beforeImage?: { url: string; publicId: string } | null;
}): PublicProjectPreview {
  let images = Array.isArray(d.images)
    ? d.images.map((img: { url: string; publicId: string }) => ({
        url: img.url,
        publicId: img.publicId,
      }))
    : [];
  if (images.length === 0 && d.afterImage?.url) {
    images = [{ url: d.afterImage.url, publicId: d.afterImage.publicId }];
  } else if (images.length === 0 && d.beforeImage?.url) {
    images = [{ url: d.beforeImage.url, publicId: d.beforeImage.publicId }];
  }
  return {
    _id: String(d._id),
    title: d.title,
    description: d.description,
    category: d.category as "commercial" | "residential",
    images,
  };
}

function mapDocToPublicProject(d: {
  _id: unknown;
  title: string;
  description: string;
  category: string;
  featured?: boolean;
  images?: { url: string; publicId: string }[];
  afterImage?: { url: string; publicId: string } | null;
  beforeImage?: { url: string; publicId: string } | null;
}): PublicProject {
  return {
    ...mapDocToPreview(d),
    featured: Boolean(d.featured),
    beforeImage: d.beforeImage ?? null,
    afterImage: d.afterImage ?? null,
  };
}

/**
 * All projects for the portfolio page: featured first, then newest.
 */
export async function getAllProjectsForSite(): Promise<PublicProject[]> {
  try {
    await connectDB();
    const docs = await Project.find({})
      .sort({ featured: -1, createdAt: -1 })
      .lean();
    return docs.map((d) => mapDocToPublicProject(d));
  } catch {
    return [];
  }
}

/**
 * Projects for the home "Featured Projects" section: featured first, then newest.
 */
export async function getProjectsForHomePreview(limit = 6): Promise<PublicProjectPreview[]> {
  try {
    await connectDB();
    const docs = await Project.find({})
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    return docs.map((d) => mapDocToPreview(d));
  } catch {
    return [];
  }
}

/**
 * Projects for a category page (commercial / residential): featured first, then newest.
 */
export async function getProjectsForCategoryPreview(
  category: "commercial" | "residential",
  limit = 6
): Promise<PublicProjectPreview[]> {
  try {
    await connectDB();
    const docs = await Project.find({ category })
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    return docs.map((d) => mapDocToPreview(d));
  } catch {
    return [];
  }
}
