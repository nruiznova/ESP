import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { CTABanner } from "@/components/sections/CTABanner";
import { getActiveServicesForSite } from "@/lib/data/services";
import { getProjectsForCategoryPreview } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Commercial Construction",
  description:
    "Commercial construction services in Upstate SC — tenant upfits, metal framing, drywall, general contracting, and exterior upgrades. Contracts from $5K to $400K.",
};

export const dynamic = "force-dynamic";

const commercialHighlights = [
  { icon: "🏢", title: "Tenant Upfits", desc: "Complete interior build-outs for retail, office, and warehouse spaces." },
  { icon: "🔩", title: "Metal Framing", desc: "Interior and exterior wall systems including engineered metal truss systems." },
  { icon: "🧱", title: "Drywall & Acoustical", desc: "40+ years of combined experience in all aspects of drywall and acoustical work." },
  { icon: "🏗️", title: "General Contracting", desc: "Full project management from design coordination to final punch list." },
];

async function getCommercialServices() {
  return getActiveServicesForSite("commercial");
}

async function getCommercialProjects() {
  return getProjectsForCategoryPreview("commercial", 6);
}

export default async function CommercialPage() {
  const [services, projects] = await Promise.all([
    getCommercialServices(),
    getCommercialProjects(),
  ]);

  return (
    <>
      {/* Page Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80"
          alt="Commercial Construction"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/55 to-navy/25" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-40 w-full">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-light mb-4 block">
            Commercial Line
          </span>
          <h1 className="text-display text-[clamp(3.5rem,10vw,8rem)] text-white leading-none mb-6">
            Commercial<br />
            <span className="text-stone-light">Construction</span>
          </h1>
          <p className="text-base md:text-lg text-white/85 max-w-xl leading-relaxed">
            Precision-built commercial spaces — from tenant upfits and metal framing to
            full-scale general contracting. Contracts up to $400,000.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-surface py-16 px-6 border-b border-stone/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {commercialHighlights.map((h, i) => (
            <div key={i} className="flex flex-col gap-3 p-6 border border-stone/10 hover:border-stone/30 transition-colors">
              <span className="text-3xl">{h.icon}</span>
              <h3 className="text-display text-xl text-cream">{h.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MEC Legacy section */}
      <section className="bg-surface-2 py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-light mb-4 block">
              Our Commercial Heritage
            </span>
            <h2 className="text-display text-5xl md:text-6xl text-cream leading-none mb-6">
              18 Years of Commercial<br />
              <span className="text-stone">Expertise</span>
            </h2>
            <span className="accent-line mb-6" />
            <p className="text-muted leading-relaxed mb-4">
              Our commercial division carries the legacy of MEC Construction Inc., operating in
              Upstate South Carolina since 2002. Specializing in smaller commercial projects and
              custom residential work, we bring contractor-grade discipline to every project.
            </p>
            <p className="text-muted leading-relaxed mb-8">
              We regularly perform for general contractors the metal framing and drywall work,
              or specialty components — from retail build-outs in malls to stand-alone stores,
              office buildings, assisted living facilities, and hospital renovations.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-red text-white font-semibold uppercase tracking-widest text-sm hover:bg-red-dark transition-colors"
            >
              Get a Commercial Estimate
            </Link>
          </div>

          <div className="relative h-96 lg:h-[500px] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
              alt="Commercial work"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-navy/45 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-red" />
          </div>
        </div>
      </section>

      {/* Services */}
      <ServiceGrid
        services={services}
        title="Commercial Services"
        eyebrow="What We Offer"
        showBadge={false}
      />

      {/* Portfolio */}
      <PortfolioPreview
        projects={projects}
        lockCategory="commercial"
        title="Commercial Projects"
        subtitle="Recent commercial work from our portfolio. Explore the full gallery for every project."
      />

      {/* CTA */}
      <CTABanner />
    </>
  );
}
