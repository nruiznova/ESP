type Category = "commercial" | "residential";

interface BadgeProps {
  category: Category;
  className?: string;
}

const config: Record<Category, { label: string; classes: string }> = {
  commercial: {
    label: "Commercial",
    classes: "bg-stone/20 text-stone-light border border-stone/30",
  },
  residential: {
    label: "Residential",
    classes: "bg-red/15 text-red-light border border-red/25",
  },
};

export function Badge({ category, className = "" }: BadgeProps) {
  const { label, classes } = config[category];
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest ${classes} ${className}`}
    >
      {label}
    </span>
  );
}
