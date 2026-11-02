import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-sage-500 text-white hover:bg-sage-600 shadow-soft dark:bg-sage-400 dark:text-[#13200f] dark:hover:bg-sage-300",
  secondary: "bg-sand-200 text-[#5a4216] hover:bg-sand-300 dark:bg-sand-300/25 dark:text-sand-100 dark:hover:bg-sand-300/35",
  outline: "bg-transparent border-2 border-[var(--border)] text-[var(--text)] hover:border-sage-300",
  ghost: "bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-alt)]",
  danger: "bg-clay-300 text-white hover:bg-clay-400",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-xl",
  md: "px-5 py-3 text-base rounded-2xl",
  lg: "px-7 py-4 text-lg rounded-3xl",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 font-bold select-none transition",
        "enabled:active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
