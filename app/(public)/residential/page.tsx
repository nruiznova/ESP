import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { CTABanner } from "@/components/sections/CTABanner";
import { getActiveServicesForSite } from "@/lib/data/services";
import { getProjectsForCategoryPreview } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Residential Remodeling",
  description:
    "Premium residential remodeling in Upstate SC — kitchens, custom tile showers, decks, screened porches, additions, and interior renovations.",
};

export const dynamic = "force-dynamic";

const beforeAfterProjects = [
  {
    before: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=75&grayscale",
    after: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=75",
    title: "Kitchen Transformation",
  },
  {
    before: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=75&grayscale",
    after: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=75",
    title: "Custom Tile Shower",
  },
];

async function getResidentialServices() {
  return getActiveServicesForSite("residential");
}

async function getResidentialProjects() {
  return getProjectsForCategoryPreview("residential", 6);
}

export default async function ResidentialPage() {
  const [services, projects] = await Promise.all([
    getResidentialServices(),
    getResidentialProjects(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80"
          alt="Residential Remodeling"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/55 to-navy/25" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-40 w-full">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-light mb-4 block">
            Residential Line
          </span>
          <h1 className="text-display text-[clamp(3.5rem,10vw,8rem)] text-white leading-none mb-6">
            Residential<br />
            <span className="text-stone-light">Remodeling</span>
          </h1>
          <p className="text-base md:text-lg text-white/85 max-w-xl leading-relaxed">
            Kitchens, bathrooms, decks, and custom showers — built around your vision, crafted to
            last a lifetime. Your home deserves the best.
          </p>
        </div>
      </section>

      {/* Feature strip */}
      <section className="bg-surface border-y border-stone/10 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 text-sm font-semibold uppercase tracking-widest text-muted">
          {["Kitchen Remodeling", "Custom Tile Showers", "Decks & Terraces", "Screened Porches", "Interior Renovations", "Additions"].map(
            (s) => (
              <span key={s} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red rounded-full" />
                {s}
              </span>
            )
          )}
        </div>
      </section>

      {/* Before/After showcase */}
      <section className="bg-surface-2 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-light mb-3 block">
              The Transformation
            </span>
            <h2 className="text-display text-5xl md:text-6xl text-cream leading-none mb-3">
              Before & After
            </h2>
            <span className="accent-line" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {beforeAfterProjects.map((p, i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-display text-2xl text-cream">{p.title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative h-56 overflow-hidden">
                    <Image src={p.before} alt={`Before — ${p.title}`} fill className="object-cover grayscale" />
                    <div className="absolute bottom-0 left-0 right-0 py-2 px-3 bg-navy/85 text-xs font-semibold uppercase tracking-widest text-white/90">
                      Before
                    </div>
                  </div>
                  <div className="relative h-56 overflow-hidden">
                    <Image src={p.after} alt={`After — ${p.title}`} fill className="object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 py-2 px-3 bg-red/80 text-xs font-semibold uppercase tracking-widest text-white">
                      After
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-surface py-24 px-6 border-y border-stone/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-light mb-3 block">
              How We Work
            </span>
            <h2 className="text-display text-5xl md:text-6xl text-cream leading-none">
              Our Process
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { n: "01", title: "Consultation", desc: "Free on-site consultation to understand your vision and needs." },
              { n: "02", title: "Planning", desc: "Detailed proposal with timeline, materials, and transparent pricing." },
              { n: "03", title: "Build", desc: "Expert craftsmen execute your project with precision and care." },
              { n: "04", title: "Deliver", desc: "Final walkthrough, punch list, and your complete satisfaction." },
            ].map((step) => (
              <div key={step.n} className="flex flex-col gap-4">
                <span className="text-display text-5xl text-red/30">{step.n}</span>
                <h3 className="text-display text-2xl text-cream">{step.title}</h3>
                <span className="accent-line" />
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <ServiceGrid
        services={services}
        title="Residential Services"
        eyebrow="What We Offer"
        showBadge={false}
      />

      <PortfolioPreview
        projects={projects}
        lockCategory="residential"
        title="Residential Projects"
        subtitle="Recent residential work from our portfolio. Explore the full gallery for every project."
      />

      {/* CTA */}
      <CTABanner />
    </>
  );
}
