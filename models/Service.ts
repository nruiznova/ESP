import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IService extends Document {
  title: string;
  description: string;
  imageUrl?: string;
  imagePublicId?: string;
  category: "commercial" | "residential";
  displayOrder: number;
  active: boolean;
  createdAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    imagePublicId: { type: String },
    category: { type: String, enum: ["commercial", "residential"], required: true },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service = models.Service || model<IService>("Service", ServiceSchema);
