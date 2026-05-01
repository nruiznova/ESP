import type { Metadata } from "next";
import { getRequestOrigin } from "@/lib/get-request-origin";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — Get a Free Estimate",
  description:
    "Contact Elite Superior Construction for a free project estimate. Commercial and residential construction in Upstate South Carolina.",
};

async function getSettings() {
  try {
    const origin = await getRequestOrigin();
    const res = await fetch(`${origin}/api/settings`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const settings = await getSettings();
  return <ContactClient settings={settings} />;
}
