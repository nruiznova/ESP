import { HeroSection } from "@/components/sections/HeroSection";
import { StatsBar } from "@/components/sections/StatsBar";
import { TwoLinesSection } from "@/components/sections/TwoLinesSection";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { CTABanner } from "@/components/sections/CTABanner";
import { getActiveServicesForSite } from "@/lib/data/services";
import { getProjectsForHomePreview } from "@/lib/data/projects";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/models/Testimonial";

export const dynamic = "force-dynamic";

async function getServices() {
  return getActiveServicesForSite();
}

async function getProjects() {
  return getProjectsForHomePreview(6);
}

async function getTestimonials() {
  try {
    await connectDB();
    const docs = await Testimonial.find({ visible: true })
      .sort({ createdAt: -1 })
      .lean();
    return docs.map((d) => ({
      _id: String(d._id),
      clientName: d.clientName,
      company: d.company,
      text: d.text,
      rating: d.rating,
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [services, projects, testimonials] = await Promise.all([
    getServices(),
    getProjects(),
    getTestimonials(),
  ]);

  return (
    <>
      <HeroSection />
      <StatsBar />
      <TwoLinesSection />
      <ServiceGrid
        services={services}
        title="Our Services"
        eyebrow="What We Do"
        showBadge
      />
      <PortfolioPreview projects={projects} />
      <TestimonialsCarousel testimonials={testimonials} />
      <CTABanner />
    </>
  );
}
