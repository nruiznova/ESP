"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Testimonial {
  _id: string;
  clientName: string;
  company?: string;
  text: string;
  rating: number;
}

const fallbackTestimonials: Testimonial[] = [
  {
    _id: "1",
    clientName: "James Whitfield",
    company: "Whitfield Commercial Properties",
    text: "Elite Superior transformed our office space completely. The team was professional, the work was flawless, and they finished ahead of schedule. I'll be using them for our next three properties.",
    rating: 5,
  },
  {
    _id: "2",
    clientName: "Maria & Carlos Herrera",
    text: "They remodeled our entire kitchen and two bathrooms. The attention to detail and quality of the tile work was outstanding. Our house feels brand new. Truly elite work.",
    rating: 5,
  },
  {
    _id: "3",
    clientName: "Robert Kim",
    company: "Golden Strip School of Music",
    text: "Exceptional commercial build-out. They understood our acoustic needs perfectly and delivered a space that serves our students beautifully. Highly professional team.",
    rating: 5,
  },
  {
    _id: "4",
    clientName: "Sarah Thompson",
    text: "Our new deck and screened porch is absolutely stunning. We use it every weekend now. The craftsmanship and cedar work exceeded all expectations.",
    rating: 5,
  },
];

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const displayItems = testimonials.length > 0 ? testimonials : fallbackTestimonials;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-surface-2 py-24 px-6 relative overflow-hidden">
      {/* Large quote mark */}
      <div
        className="absolute left-0 top-0 text-display leading-none text-stone/[0.08] select-none pointer-events-none"
        style={{ fontSize: "20rem" }}
        aria-hidden
      >
        "
      </div>

      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <SectionHeading
            eyebrow="Client Stories"
            title="What They Say"
            number="05"
          />

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="w-12 h-12 border border-stone/30 text-muted hover:text-cream hover:border-stone flex items-center justify-center transition-colors duration-200"
              aria-label="Previous testimonial"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="w-12 h-12 border border-stone/30 text-muted hover:text-cream hover:border-stone flex items-center justify-center transition-colors duration-200"
              aria-label="Next testimonial"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {displayItems.map((t) => (
                <div
                  key={t._id}
                  className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-surface border border-stone/10 p-8 hover:border-stone/30 transition-colors duration-300"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < t.rating ? "text-red" : "text-muted"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-cream-muted leading-relaxed mb-8 text-sm">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="border-t border-stone/15 pt-6">
                    <p className="text-display text-lg text-cream leading-none">{t.clientName}</p>
                    {t.company && (
                      <p className="text-xs text-muted mt-1 tracking-wide">{t.company}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
