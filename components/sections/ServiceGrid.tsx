"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Service {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: "commercial" | "residential";
}

interface ServiceGridProps {
  services: Service[];
  title?: string;
  eyebrow?: string;
  showBadge?: boolean;
}

const fallbackImages = {
  commercial:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=75",
  residential:
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=75",
};

export function ServiceGrid({
  services,
  title = "Our Services",
  eyebrow = "What We Do",
  showBadge = true,
}: ServiceGridProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-surface py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16" ref={ref}>
          <SectionHeading eyebrow={eyebrow} title={title} number="03" />
          <p className="text-sm text-muted uppercase tracking-widest md:text-right">
            Commercial & Residential
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p>Services coming soon. Check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.article
                key={service._id}
                className="group relative bg-surface border border-stone/10 overflow-hidden hover:border-stone/30 transition-colors duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={service.imageUrl || fallbackImages[service.category]}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
                  {showBadge && (
                    <div className="absolute top-4 left-4">
                      <Badge category={service.category} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-display text-2xl text-cream mb-2 leading-none">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>

                {/* Red bottom accent on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
