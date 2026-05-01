"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 20, suffix: "+", label: "Years of Combined Experience" },
  { value: 500, suffix: "+", label: "Projects Completed" },
  { value: 400, suffix: "K", label: "Max Contract Value ($)" },
  { value: 100, suffix: "%", label: "Owner-Operated" },
];

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);

  return count;
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCountUp(stat.value, active);
  return (
    <div className="flex flex-col items-center gap-2 text-center px-6">
      <span className="text-display text-5xl md:text-6xl text-cream">
        {count}
        <span className="text-red">{stat.suffix}</span>
      </span>
      <span className="text-xs uppercase tracking-[0.2em] text-muted max-w-[12ch] leading-relaxed">
        {stat.label}
      </span>
    </div>
  );
}

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative bg-surface border-y border-stone/10 overflow-hidden">
      {/* Red left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-stone/10">
          {stats.map((stat, i) => (
            <StatItem key={i} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
