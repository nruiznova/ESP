"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BRAND_LOGO_LIGHT } from "@/lib/brand";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/commercial", label: "Commercial" },
  { href: "/residential", label: "Residential" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-stone/15 shadow-sm shadow-stone/5 py-2.5"
          : "bg-gradient-to-b from-white/92 via-white/60 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image
            src={BRAND_LOGO_LIGHT}
            alt="Elite Superior Construction"
            width={280}
            height={56}
            className="h-9 sm:h-10 w-auto max-w-[200px] sm:max-w-[260px] object-contain object-left"
            unoptimized
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 text-sm font-semibold uppercase tracking-widest transition-colors duration-200 relative group ${
                pathname === href ? "text-cream" : "text-muted hover:text-stone"
              }`}
            >
              {label}
              <span
                className={`absolute bottom-0 left-4 right-4 h-px bg-red transition-transform duration-300 origin-left ${
                  pathname === href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/contact"
          className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-red text-white text-sm font-semibold uppercase tracking-widest hover:bg-red-dark transition-colors duration-200"
        >
          Free Estimate
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2 group"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-6 h-0.5 bg-cream transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-cream transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-cream transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-white/98 backdrop-blur-md border-t border-stone/10 px-6 py-4 flex flex-col gap-1 shadow-md">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-3 text-sm font-semibold uppercase tracking-widest transition-colors border-b border-stone/10 last:border-0 ${
                pathname === href ? "text-cream" : "text-muted hover:text-stone"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-4 flex items-center justify-center gap-2 px-5 py-3 bg-red text-white text-sm font-semibold uppercase tracking-widest"
          >
            Free Estimate
          </Link>
        </nav>
      </div>
    </header>
  );
}
