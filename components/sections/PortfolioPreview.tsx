"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Project {
  _id: string;
  title: string;
  description: string;
  category: "commercial" | "residential";
  images: { url: string; publicId: string }[];
}

interface PortfolioPreviewProps {
  projects: Project[];
  /** Hide All / Commercial / Residential toggles; parent passes only this category's projects */
  lockCategory?: "commercial" | "residential";
  eyebrow?: string;
  title?: string;
  number?: string;
  subtitle?: string;
}

export function PortfolioPreview({
  projects,
  lockCategory,
  eyebrow = "Our Work",
  title = "Featured Projects",
  number = "04",
  subtitle = "A selection of commercial and residential projects that define our standard.",
}: PortfolioPreviewProps) {
  const [filter, setFilter] = useState<"all" | "commercial" | "residential">("all");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const filtered = lockCategory
    ? projects
    : projects.filter((p) => filter === "all" || p.category === filter);

  return (
    <section className="bg-surface py-24 px-6 relative overflow-hidden">
      <div className="absolute right-6 top-12 text-display text-[12rem] text-stone/[0.07] select-none pointer-events-none leading-none">
        {number}
      </div>

      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12"
        >
          <SectionHeading eyebrow={eyebrow} title={title} number={number} subtitle={subtitle} />

          {lockCategory ? (
            <div className="flex items-center gap-3 md:pb-1">
              <Badge category={lockCategory} />
              <span className="text-xs text-muted uppercase tracking-widest hidden sm:inline">
                {lockCategory === "commercial" ? "Commercial work" : "Residential work"}
              </span>
            </div>
          ) : (
            <div className="flex gap-2">
              {(["all", "commercial", "residential"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
                  filter === f
                    ? "bg-red text-white"
                    : "border border-stone/30 text-muted hover:text-cream hover:border-stone"
                }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 px-6 border border-dashed border-stone/25 bg-surface-2/50">
            <p className="text-muted text-sm mb-4 max-w-md mx-auto">
              {projects.length === 0
                ? lockCategory
                  ? `No ${lockCategory} portfolio projects to show here yet. See the full portfolio for our latest work.`
                  : "We're refreshing this section. Browse the full portfolio for recent projects."
                : lockCategory
                  ? `No ${lockCategory} projects in this preview. See the full portfolio for more.`
                  : `No ${filter === "all" ? "" : filter} projects in this preview. Try another filter or see the full portfolio.`}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-stone text-white text-xs font-semibold uppercase tracking-widest hover:bg-stone-light transition-colors"
              >
                View full portfolio
              </Link>
              {projects.length === 0 ? (
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-stone/30 text-cream text-xs font-semibold uppercase tracking-widest hover:border-cream hover:bg-cream/5 transition-colors"
                >
                  Contact us
                </Link>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((project, i) => {
              const imgSrc = project.images[0]?.url;
              const titleProj = project.title;
              const category = project.category;

              return (
                <Link key={project._id} href="/portfolio">
                  <motion.article
                    className="group relative overflow-hidden aspect-[4/3] bg-surface-2 img-hover cursor-pointer h-full block"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                  >
                    {imgSrc ? (
                      <Image src={imgSrc} alt={titleProj} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-surface-2 px-4">
                        <span className="text-muted text-xs uppercase tracking-widest text-center">{titleProj}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-navy/92 via-navy/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                    <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                      <Badge category={category} className="mb-2 w-fit" />
                      <h3 className="text-display text-2xl text-white leading-none">{titleProj}</h3>
                    </div>
                  </motion.article>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-3 px-8 py-4 border border-stone/30 text-cream text-sm font-semibold uppercase tracking-widest hover:border-cream hover:bg-cream/5 transition-all duration-200"
          >
            View full portfolio
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
