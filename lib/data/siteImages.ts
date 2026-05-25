import { connectDB } from "@/lib/mongodb";
import { SiteImages } from "@/models/SiteImages";

export interface ImageRef {
  url: string;
  publicId: string;
}

export interface BeforeAfterDisplay {
  title: string;
  before: string;
  after: string;
}

export interface SiteImagesDisplay {
  homeHero: string;
  homeCommercial: string;
  homeResidential: string;
  commercialBanner: string;
  commercialSection: string;
  residentialBanner: string;
  residentialBeforeAfter: BeforeAfterDisplay[];
}

export const SITE_IMAGE_DEFAULTS: SiteImagesDisplay = {
  homeHero: "/images/hero-home.png",
  homeCommercial: "/images/commercial-home.png",
  homeResidential: "/images/residential-home.png",
  commercialBanner:
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80",
  commercialSection:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  residentialBanner:
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80",
  residentialBeforeAfter: [
    {
      title: "Kitchen Transformation",
      before:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=75&grayscale",
      after: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=75",
    },
    {
      title: "Custom Tile Shower",
      before:
        "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=75&grayscale",
      after: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=75",
    },
  ],
};

function resolveImageUrl(
  stored: ImageRef | null | undefined,
  fallback: string
): string {
  return stored?.url || fallback;
}

export async function getSiteImages(): Promise<SiteImagesDisplay> {
  try {
    await connectDB();
    const doc = await SiteImages.findOne().lean();

    if (!doc) {
      return SITE_IMAGE_DEFAULTS;
    }

    const defaults = SITE_IMAGE_DEFAULTS.residentialBeforeAfter;

    return {
      homeHero: resolveImageUrl(doc.homeHero, SITE_IMAGE_DEFAULTS.homeHero),
      homeCommercial: resolveImageUrl(
        doc.homeCommercial,
        SITE_IMAGE_DEFAULTS.homeCommercial
      ),
      homeResidential: resolveImageUrl(
        doc.homeResidential,
        SITE_IMAGE_DEFAULTS.homeResidential
      ),
      commercialBanner: resolveImageUrl(
        doc.commercialBanner,
        SITE_IMAGE_DEFAULTS.commercialBanner
      ),
      commercialSection: resolveImageUrl(
        doc.commercialSection,
        SITE_IMAGE_DEFAULTS.commercialSection
      ),
      residentialBanner: resolveImageUrl(
        doc.residentialBanner,
        SITE_IMAGE_DEFAULTS.residentialBanner
      ),
      residentialBeforeAfter: [0, 1].map((i) => {
        const stored = doc.residentialBeforeAfter?.[i];
        const fallback = defaults[i];
        return {
          title: stored?.title || fallback.title,
          before: resolveImageUrl(stored?.before, fallback.before),
          after: resolveImageUrl(stored?.after, fallback.after),
        };
      }),
    };
  } catch {
    return SITE_IMAGE_DEFAULTS;
  }
}
