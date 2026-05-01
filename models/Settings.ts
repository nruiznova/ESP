import { Schema, model, models, Document } from "mongoose";

export interface ISettings extends Document {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  hours: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    phone: { type: String, default: "+1 (864) 416-4728" },
    email: { type: String, default: "info@elitesuperiorconstruction.com" },
    address: { type: String, default: "188 Blalock Rd B, Boiling Springs, SC 29316" },
    whatsapp: { type: String, default: "18644164728" },
    hours: { type: String, default: "Mon–Fri: 7AM–6PM · Sat: 8AM–2PM" },
  },
  { timestamps: true }
);

export const Settings = models.Settings || model<ISettings>("Settings", SettingsSchema);
