"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      const scrollY = window.scrollY;
      parallaxRef.current.style.transform = `translateY(${scrollY * 0.35}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy">
      {/* Background image with parallax */}
      <div ref={parallaxRef} className="absolute inset-0 scale-110">
        <Image
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
          alt="Elite Superior Construction — premium building"
          fill
          priority
          className="object-cover saturate-[0.75] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-stone/25 mix-blend-color" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/78 to-navy-muted/92" />
        <div className="absolute inset-0 bg-gradient-to-l from-red/10 to-transparent" />
      </div>

      {/* Diagonal line decoration */}
      <div
        className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
        style={{ right: "20%" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 w-full">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial="hidden"
            animate="show"
            custom={0.1}
            variants={fadeUp}
          >
            <span className="accent-line" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-light">
              Commercial · Residential · Excellence
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="text-display text-[clamp(4rem,12vw,9rem)] text-white leading-none mb-6"
            initial="hidden"
            animate="show"
            custom={0.25}
            variants={fadeUp}
          >
            Built to{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Last.</span>
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-red" />
            </span>
            <br />
            <span className="text-stone-light">Built Right.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-base md:text-lg text-white/85 max-w-xl leading-relaxed mb-10"
            initial="hidden"
            animate="show"
            custom={0.4}
            variants={fadeUp}
          >
            Elite Superior Construction delivers premium commercial and residential building
            solutions across Upstate South Carolina — backed by two decades of trusted expertise.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial="hidden"
            animate="show"
            custom={0.55}
            variants={fadeUp}
          >
            <Link
              href="/commercial"
              className="group flex items-center gap-4 px-8 py-4 bg-stone text-white font-semibold uppercase tracking-widest text-sm hover:bg-stone-light transition-colors duration-200"
            >
              <span>Commercial Projects</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/residential"
              className="group flex items-center gap-4 px-8 py-4 border border-white/40 text-white font-semibold uppercase tracking-widest text-sm hover:border-white hover:bg-white/10 transition-all duration-200"
            >
              <span>Residential Work</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Se habla español badge */}
        <motion.div
          className="absolute bottom-10 right-6 hidden md:flex items-center gap-2 px-4 py-2 bg-navy/85 border border-white/20 backdrop-blur-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <span className="w-2 h-2 bg-red rounded-full" />
          <span className="text-xs text-stone-light uppercase tracking-widest">Se Habla Español</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
