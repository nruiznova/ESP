import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Elite Superior Construction | Commercial & Residential",
    template: "%s | Elite Superior Construction",
  },
  description:
    "Elite Superior Construction delivers premium commercial and residential construction services across Upstate South Carolina. Remodeling, tenant upfits, decks, custom tile showers, and more.",
  keywords: [
    "construction",
    "remodeling",
    "commercial construction",
    "residential remodeling",
    "South Carolina",
    "Greenville SC",
    "Boiling Springs SC",
    "contractor",
  ],
  openGraph: {
    siteName: "Elite Superior Construction",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
