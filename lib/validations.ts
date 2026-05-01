import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  projectType: z.enum(["commercial", "residential", "other"]),
  description: z.string().min(10, "Please describe your project (min 10 characters)"),
  budgetRange: z.string().optional(),
});

export const serviceSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  imageUrl: z.union([z.string().url(), z.literal("")]).optional(),
  imagePublicId: z.string().optional(),
  category: z.enum(["commercial", "residential"]),
  displayOrder: z
    .any()
    .transform((val) => {
      if (val === null || val === undefined || val === "") return 0;
      const n = typeof val === "number" ? val : Number(val);
      return Number.isFinite(n) ? Math.trunc(n) : 0;
    })
    .pipe(z.number().int().min(0)),
  active: z.boolean(),
});

export const projectSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  category: z.enum(["commercial", "residential"]),
  images: z.array(z.object({ url: z.string().url(), publicId: z.string() })),
  beforeImage: z
    .object({ url: z.string().url(), publicId: z.string() })
    .optional()
    .nullable(),
  afterImage: z
    .object({ url: z.string().url(), publicId: z.string() })
    .optional()
    .nullable(),
  featured: z.boolean(),
});

export const testimonialSchema = z.object({
  clientName: z.string().min(2),
  company: z.string().optional(),
  text: z.string().min(10),
  rating: z.number().int().min(1).max(5),
  visible: z.boolean(),
});

export const settingsSchema = z.object({
  phone: z.string(),
  email: z.string().email(),
  address: z.string(),
  whatsapp: z.string(),
  hours: z.string(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
