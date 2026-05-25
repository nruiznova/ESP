import { Schema, model, models, Document } from "mongoose";

interface ImageRef {
  url: string;
  publicId: string;
}

interface BeforeAfterItem {
  title: string;
  before?: ImageRef | null;
  after?: ImageRef | null;
}

export interface ISiteImages extends Document {
  homeHero?: ImageRef | null;
  homeCommercial?: ImageRef | null;
  homeResidential?: ImageRef | null;
  commercialBanner?: ImageRef | null;
  commercialSection?: ImageRef | null;
  residentialBanner?: ImageRef | null;
  residentialBeforeAfter: BeforeAfterItem[];
  updatedAt: Date;
}

const ImageRefSchema = new Schema<ImageRef>(
  { url: { type: String, required: true }, publicId: { type: String, required: true } },
  { _id: false }
);

const BeforeAfterSchema = new Schema<BeforeAfterItem>(
  {
    title: { type: String, default: "" },
    before: { type: ImageRefSchema, default: null },
    after: { type: ImageRefSchema, default: null },
  },
  { _id: false }
);

const SiteImagesSchema = new Schema<ISiteImages>(
  {
    homeHero: { type: ImageRefSchema, default: null },
    homeCommercial: { type: ImageRefSchema, default: null },
    homeResidential: { type: ImageRefSchema, default: null },
    commercialBanner: { type: ImageRefSchema, default: null },
    commercialSection: { type: ImageRefSchema, default: null },
    residentialBanner: { type: ImageRefSchema, default: null },
    residentialBeforeAfter: {
      type: [BeforeAfterSchema],
      default: () => [
        { title: "Kitchen Transformation", before: null, after: null },
        { title: "Custom Tile Shower", before: null, after: null },
      ],
    },
  },
  { timestamps: true }
);

export const SiteImages = models.SiteImages || model<ISiteImages>("SiteImages", SiteImagesSchema);
