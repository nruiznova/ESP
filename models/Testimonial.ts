import { Schema, model, models, Document } from "mongoose";

export interface ITestimonial extends Document {
  clientName: string;
  company?: string;
  text: string;
  rating: number;
  visible: boolean;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true },
    company: { type: String },
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Testimonial =
  models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);
