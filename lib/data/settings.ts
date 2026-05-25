import { connectDB } from "@/lib/mongodb";
import { Settings } from "@/models/Settings";

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  hours: string;
}

export const SITE_SETTINGS_DEFAULTS: SiteSettings = {
  phone: "+1 (864) 416-4728",
  email: "info@elitesuperiorconstruction.com",
  address: "188 Blalock Rd B, Boiling Springs, SC 29316",
  whatsapp: "18644164728",
  hours: "Mon–Fri: 7AM–6PM · Sat: 8AM–2PM",
};

export async function getSettingsForSite(): Promise<SiteSettings> {
  try {
    await connectDB();
    const doc = await Settings.findOne().lean();

    if (!doc) {
      return SITE_SETTINGS_DEFAULTS;
    }

    return {
      phone: doc.phone || SITE_SETTINGS_DEFAULTS.phone,
      email: doc.email || SITE_SETTINGS_DEFAULTS.email,
      address: doc.address || SITE_SETTINGS_DEFAULTS.address,
      whatsapp: doc.whatsapp || SITE_SETTINGS_DEFAULTS.whatsapp,
      hours: doc.hours || SITE_SETTINGS_DEFAULTS.hours,
    };
  } catch {
    return SITE_SETTINGS_DEFAULTS;
  }
}
