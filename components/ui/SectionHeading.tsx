interface SectionHeadingProps {
  number?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({
  number,
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "items-center text-center" : "items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {(number || eyebrow) && (
        <div className="flex items-center gap-3">
          {number && (
            <span className="font-display text-sm text-red tracking-widest">{number}</span>
          )}
          {number && eyebrow && <span className="w-6 h-px bg-stone/40" />}
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-light">
              {eyebrow}
            </span>
          )}
        </div>
      )}
      <h2
        className={`text-display text-5xl md:text-6xl lg:text-7xl leading-none ${
          light ? "text-cream" : "text-cream"
        }`}
      >
        {title}
      </h2>
      <span className="accent-line" />
      {subtitle && (
        <p className={`text-base md:text-lg max-w-xl leading-relaxed ${light ? "text-cream-muted" : "text-muted"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
