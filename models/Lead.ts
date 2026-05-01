import { Schema, model, models, Document } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  projectType: "commercial" | "residential" | "other";
  description: string;
  budgetRange?: string;
  read: boolean;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    projectType: {
      type: String,
      enum: ["commercial", "residential", "other"],
      required: true,
    },
    description: { type: String, required: true },
    budgetRange: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Lead = models.Lead || model<ILead>("Lead", LeadSchema);
