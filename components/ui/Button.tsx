"use client";

import { forwardRef } from "react";
import Link from "next/link";

type Variant = "primary" | "outline" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-red text-white border border-red hover:bg-red-dark hover:border-red-dark active:scale-[0.98]",
  outline:
    "bg-transparent text-cream border border-cream/40 hover:border-cream hover:bg-cream/5 active:scale-[0.98]",
  ghost:
    "bg-transparent text-stone-light border border-transparent hover:text-cream hover:border-stone/30 active:scale-[0.98]",
  dark:
    "bg-surface text-cream border border-surface-2 hover:bg-surface-2 active:scale-[0.98]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm tracking-wider",
  md: "px-6 py-3 text-sm tracking-widest",
  lg: "px-8 py-4 text-base tracking-widest",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", href, external, className = "", children, ...props },
  ref
) {
  const baseClasses = `inline-flex items-center justify-center gap-2 font-body font-semibold uppercase transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`;
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
});
