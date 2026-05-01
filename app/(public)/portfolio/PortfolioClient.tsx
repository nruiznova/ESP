"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { Badge } from "@/components/ui/Badge";
import { CTABanner } from "@/components/sections/CTABanner";

type ImageRef = { url: string; publicId: string };

interface Project {
  _id: string;
  title: string;
  description: string;
  category: "commercial" | "residential";
  images: ImageRef[];
  featured: boolean;
  beforeImage?: ImageRef | null;
  afterImage?: ImageRef | null;
}

const FALLBACK_IMAGE_URL =
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=75";

const fallbackProjects: Project[] = Array.from({ length: 9 }, (_, i) => ({
  _id: String(i),
  title: i % 3 === 0 ? "Commercial Build-Out" : i % 3 === 1 ? "Kitchen Remodel" : "Custom Deck",
  description: "A stunning project delivered on time and on budget.",
  category: i % 2 === 0 ? "commercial" : "residential",
  images: [
    {
      url: [
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=75",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=75",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=75",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=75",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=75",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=75",
        "https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=800&q=75",
        "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=75",
        "https://images.unsplash.com/photo-1533779283741-cadd33d8c3db?w=800&q=75",
      ][i],
      publicId: String(i),
    },
  ],
  featured: i < 3,
}));

function projectGalleryImages(project: Project): ImageRef[] {
  return (Array.isArray(project.images) ? project.images : []).filter(
    (img): img is ImageRef => typeof img?.url === "string" && img.url.length > 0
  );
}

function portfolioThumbUrl(project: Project): string {
  return (
    projectGalleryImages(project)[0]?.url ||
    project.afterImage?.url ||
    project.beforeImage?.url ||
    FALLBACK_IMAGE_URL
  );
}

type Filter = "all" | "commercial" | "residential";

interface LightboxProps {
  project: Project;
  onClose: () => void;
}

function Lightbox({ project, onClose }: LightboxProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const beforeUrl = project.beforeImage?.url;
  const afterUrl = project.afterImage?.url;
  const hasCompare = Boolean(beforeUrl && afterUrl);
  const singleBaUrl = !hasCompare ? beforeUrl || afterUrl : undefined;
  const singleBaLabel = beforeUrl && !afterUrl ? "Before" : !beforeUrl && afterUrl ? "After" : undefined;

  const galleryImages = projectGalleryImages(project);

  useEffect(() => {
    if (galleryImages.length === 0) return;
    setImgIndex((i) => Math.min(i, galleryImages.length - 1));
  }, [project._id, galleryImages.length]);

  const hasGallery = galleryImages.length > 0;
  const galleryUrl = galleryImages[imgIndex]?.url || FALLBACK_IMAGE_URL;
  const showMediaPlaceholder = !hasCompare && !singleBaUrl && !hasGallery;

  /** Explicit height so Next/Image fill has a stable box (avoid aspect+max-h collapse) */
  const galleryMainClass =
    hasCompare || singleBaUrl
      ? "relative w-full h-[min(42vh,420px)] min-h-[220px] overflow-hidden bg-navy/30"
      : "relative w-full h-[min(52vh,560px)] min-h-[260px] overflow-hidden bg-navy/30";

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-navy/95 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden bg-surface border border-stone/20 shadow-2xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {hasCompare && beforeUrl && afterUrl && (
          <div className="relative h-[40vh] md:h-[48vh] w-full shrink-0 overflow-hidden border-b border-stone/20">
            <ReactCompareSlider
              className="h-full w-full"
              itemOne={
                <ReactCompareSliderImage src={beforeUrl} alt={`${project.title} — before`} />
              }
              itemTwo={
                <ReactCompareSliderImage src={afterUrl} alt={`${project.title} — after`} />
              }
            />
            <span className="pointer-events-none absolute left-3 top-3 rounded bg-navy/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
              Before
            </span>
            <span className="pointer-events-none absolute right-3 top-3 rounded bg-navy/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
              After
            </span>
          </div>
        )}

        {singleBaUrl && (
          <div className="relative w-full border-b border-stone/20">
            <div
              className={
                hasGallery
                  ? "relative h-[28vh] md:h-[32vh]"
                  : "relative h-[50vh] md:h-[60vh]"
              }
            >
              <Image
                src={singleBaUrl}
                alt={`${project.title} — ${singleBaLabel?.toLowerCase() ?? "photo"}`}
                fill
                className="object-cover"
              />
              {singleBaLabel && (
                <span className="pointer-events-none absolute left-3 top-3 rounded bg-navy/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                  {singleBaLabel}
                </span>
              )}
            </div>
          </div>
        )}

        {hasGallery && (
          <div className="relative border-b border-stone/10">
            {hasCompare || singleBaUrl ? (
              <p className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted">
                Project gallery ({galleryImages.length})
              </p>
            ) : null}
            <div className={galleryMainClass}>
              <Image
                key={`${project._id}-main-${imgIndex}-${galleryUrl}`}
                src={galleryUrl}
                alt={`${project.title} — photo ${imgIndex + 1} of ${galleryImages.length}`}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setImgIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
                    }
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 w-10 h-10 bg-white/90 flex items-center justify-center text-cream hover:bg-white transition-colors"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setImgIndex((prev) => (prev + 1) % galleryImages.length)}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 w-10 h-10 bg-white/90 flex items-center justify-center text-cream hover:bg-white transition-colors"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
            {galleryImages.length > 1 && (
              <div className="flex flex-wrap gap-1.5 justify-center px-4 pb-3 pt-2">
                {galleryImages.map((im, i) => (
                  <button
                    key={im.publicId ? `${im.publicId}-${i}` : `${project._id}-gal-${i}`}
                    type="button"
                    onClick={() => setImgIndex(i)}
                    className={`relative h-12 w-16 shrink-0 overflow-hidden border transition-colors ${
                      i === imgIndex ? "border-red ring-1 ring-red/40" : "border-stone/30 hover:border-stone"
                    }`}
                    aria-label={`Show photo ${i + 1}`}
                  >
                    <Image src={im.url} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {showMediaPlaceholder && (
          <div className="relative flex h-40 items-center justify-center border-b border-stone/20 bg-surface-2 text-sm text-muted">
            No project photos yet.
          </div>
        )}

        {/* Info */}
        <div className="p-6 flex items-start justify-between gap-4">
          <div>
            <Badge category={project.category} className="mb-2" />
            <h2 className="text-display text-3xl text-cream">{project.title}</h2>
            <p className="text-sm text-muted mt-2 leading-relaxed">{project.description}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-stone/30 text-muted hover:text-cream hover:border-stone transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function PortfolioClient({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Project | null>(null);

  const display = projects.length > 0 ? projects : fallbackProjects;
  const filtered = display.filter((p) => filter === "all" || p.category === filter);

  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-16 px-6 bg-surface-2">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-light mb-4 block">
            Our Work
          </span>
          <h1 className="text-display text-[clamp(3.5rem,10vw,8rem)] text-cream leading-none mb-6">
            Portfolio
          </h1>
          <span className="accent-line mb-6" />
          <p className="text-muted max-w-xl leading-relaxed">
            Every project is a testament to our commitment to quality, precision, and craft —
            commercial or residential.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-surface border-y border-stone/10 py-6 px-6 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-muted mr-2 hidden sm:block">Filter:</span>
          {(["all", "commercial", "residential"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
                filter === f
                  ? "bg-red text-white"
                  : "border border-stone/30 text-muted hover:text-cream hover:border-stone"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted">{filtered.length} projects</span>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-surface-2 py-12 px-6 min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35 }}
                  className="group relative overflow-hidden aspect-[4/3] cursor-pointer bg-surface img-hover"
                  onClick={() => setSelected(project)}
                >
                  <Image
                    src={portfolioThumbUrl(project)}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Badge category={project.category} className="mb-2 w-fit" />
                    <h3 className="text-display text-xl text-white leading-none">{project.title}</h3>
                  </div>
                  {project.featured && (
                    <div className="absolute top-4 right-4 px-2 py-1 bg-red text-white text-[10px] font-semibold uppercase tracking-widest">
                      Featured
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-24 text-muted">
              <p className="text-lg">No {filter} projects yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <Lightbox key={selected._id} project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>

      <CTABanner />
    </>
  );
}
