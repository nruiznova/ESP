import type { Metadata } from "next";
import { getSettingsForSite } from "@/lib/data/settings";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — Get a Free Estimate",
  description:
    "Contact Elite Superior Construction for a free project estimate. Commercial and residential construction in Upstate South Carolina.",
};

export default async function ContactPage() {
  const settings = await getSettingsForSite();
  return <ContactClient settings={settings} />;
}
