"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function TwoLinesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">
        {/* Commercial */}
        <motion.div
          className="relative flex flex-col justify-end p-10 md:p-16 min-h-[400px] lg:min-h-0 overflow-hidden group"
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=75"
            alt="Commercial Construction"
            fill
            className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/55 to-transparent" />

          <div className="relative z-10">
            <span className="text-display text-8xl text-white/10 block mb-4 leading-none select-none">
              01
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-light mb-3 block">
              Our Commercial Line
            </span>
            <h2 className="text-display text-4xl md:text-5xl text-white mb-4 leading-none">
              Commercial<br />
              <span className="text-stone-light">Construction</span>
            </h2>
            <p className="text-sm text-white/80 leading-relaxed max-w-sm mb-6">
              Tenant upfits, metal framing, drywall systems, general contracting, and exterior
              upgrades for businesses and commercial spaces — contracts from $5K to $400K.
            </p>
            <Link
              href="/commercial"
              className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-white group/link"
            >
              <span className="w-8 h-px bg-red transition-all duration-300 group-hover/link:w-12" />
              Explore Commercial
            </Link>
          </div>
        </motion.div>

        {/* Residential */}
        <motion.div
          className="relative flex flex-col justify-end p-10 md:p-16 min-h-[400px] lg:min-h-0 overflow-hidden group"
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=75"
            alt="Residential Remodeling"
            fill
            className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/55 to-transparent" />
          {/* Vertical divider */}
          <div className="absolute left-0 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent hidden lg:block" />

          <div className="relative z-10">
            <span className="text-display text-8xl text-white/10 block mb-4 leading-none select-none">
              02
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-light mb-3 block">
              Our Residential Line
            </span>
            <h2 className="text-display text-4xl md:text-5xl text-white mb-4 leading-none">
              Residential<br />
              <span className="text-stone-light">Remodeling</span>
            </h2>
            <p className="text-sm text-white/80 leading-relaxed max-w-sm mb-6">
              Kitchen transformations, custom tile showers, decks, screened-in porches, and
              interior renovations — crafted for your home, built to your vision.
            </p>
            <Link
              href="/residential"
              className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-white group/link"
            >
              <span className="w-8 h-px bg-red transition-all duration-300 group-hover/link:w-12" />
              Explore Residential
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
