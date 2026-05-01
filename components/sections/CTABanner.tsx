"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function CTABanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="relative py-28 px-6 overflow-hidden bg-stone" ref={ref}>
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-10 grain" />

      {/* Large text decoration */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none select-none">
        <span className="text-display text-[18rem] text-white/10 leading-none pr-8 hidden lg:block">
          ESC
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70 mb-4 block">
            Start Your Project
          </span>
          <h2 className="text-display text-[clamp(3rem,8vw,6rem)] text-white leading-none mb-6">
            Ready to Build<br />Something Great?
          </h2>
          <p className="text-base text-white/85 leading-relaxed max-w-xl mb-10">
            From commercial tenant upfits to residential renovations — contact us for a free
            consultation and estimate. We serve all of Upstate South Carolina and beyond.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-stone font-semibold uppercase tracking-widest text-sm hover:bg-surface-2 transition-colors duration-200"
            >
              Get a Free Estimate
            </Link>
            <a
              href="tel:+18644164728"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white/50 text-white font-semibold uppercase tracking-widest text-sm hover:border-white transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
              </svg>
              (864) 416-4728
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
