import Link from "next/link";
import Image from "next/image";
import { BRAND_LOGO_LIGHT } from "@/lib/brand";

const serviceLinks = [
  { href: "/commercial", label: "Commercial Construction" },
  { href: "/residential", label: "Residential Remodeling" },
  { href: "/commercial#tenant-upfits", label: "Tenant Upfits" },
  { href: "/residential#custom-showers", label: "Custom Tile Showers" },
  { href: "/residential#decks", label: "Decks & Porches" },
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Get a Quote" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-stone/15 relative overflow-hidden">
      {/* Top border accent */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-red to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6 group w-fit">
              <Image
                src={BRAND_LOGO_LIGHT}
                alt="Elite Superior Construction"
                width={320}
                height={64}
                className="h-12 sm:h-14 w-auto max-w-[min(100%,320px)] object-contain object-left"
                unoptimized
              />
            </Link>

            <p className="text-muted text-sm leading-relaxed max-w-sm mb-6">
              Uniting commercial strength with residential craftsmanship across Upstate South
              Carolina. Built on two decades of trusted expertise.
            </p>

            <div className="flex flex-col gap-2 text-sm">
              <a
                href="tel:+18644164728"
                className="text-stone hover:text-cream transition-colors flex items-center gap-2"
              >
                <span className="text-red">—</span> +1 (864) 416-4728
              </a>
              <a
                href="mailto:info@elitesuperiorconstruction.com"
                className="text-stone hover:text-cream transition-colors flex items-center gap-2"
              >
                <span className="text-red">—</span> info@elitesuperiorconstruction.com
              </a>
              <span className="text-muted flex items-center gap-2">
                <span className="text-red">—</span> 188 Blalock Rd B, Boiling Springs, SC 29316
              </span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-display text-lg text-cream tracking-wider mb-5">Services</h3>
            <ul className="flex flex-col gap-2">
              {serviceLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted hover:text-cream transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-red transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-display text-lg text-cream tracking-wider mb-5">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted hover:text-cream transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-red transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="text-xs text-muted uppercase tracking-widest mb-2">Service Area</p>
              <p className="text-sm text-stone">
                Upstate South Carolina<br />
                Greenville · Spartanburg<br />
                Boiling Springs · Inman<br />
                & surrounding areas
              </p>
            </div>
          </div>
        </div>

        <div className="section-divider my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {year} Elite Superior Construction. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span className="text-red">■</span> Se habla Español
          </p>
        </div>
      </div>
    </footer>
  );
}
