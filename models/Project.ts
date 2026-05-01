import mongoose, { Schema, model, models, Document } from "mongoose";

interface ImageRef {
  url: string;
  publicId: string;
}

export interface IProject extends Document {
  title: string;
  description: string;
  category: "commercial" | "residential";
  images: ImageRef[];
  beforeImage?: ImageRef | null;
  afterImage?: ImageRef | null;
  featured: boolean;
  createdAt: Date;
}

const ImageRefSchema = new Schema<ImageRef>(
  { url: { type: String, required: true }, publicId: { type: String, required: true } },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ["commercial", "residential"], required: true },
    images: { type: [ImageRefSchema], default: [] },
    beforeImage: { type: ImageRefSchema, default: null },
    afterImage: { type: ImageRefSchema, default: null },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Project = models.Project || model<IProject>("Project", ProjectSchema);
