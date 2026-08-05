import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import { getSettingsForSite } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettingsForSite();
  const phoneDigits = settings.phone.replace(/[^\d+]/g, "");

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer settings={settings} />
      <FloatingCTA whatsapp={settings.whatsapp} phone={phoneDigits} />
    </>
  );
}
