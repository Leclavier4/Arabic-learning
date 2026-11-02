import React from "react";
import { playSound } from "../../services/sound";

type Variant = "primary" | "secondary" | "sun" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  /** Pas de petit « clic » sonore (ex. quand l'action joue déjà son propre son). */
  silent?: boolean;
}

/*
 * Boutons « jelly » façon jeu : aplat de couleur + épaisseur en bas (ombre
 * pleine). Au clic, le bouton s'enfonce (translate + ombre qui disparaît)
 * puis rebondit — classe .btn-jelly dans index.css.
 */
const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-oasis-500 text-white [--btn-edge:theme(colors.oasis.700)] hover:bg-oasis-400",
  secondary: "bg-sand-200 text-sand-600 [--btn-edge:theme(colors.sand.400)] hover:bg-sand-100 dark:bg-sand-300 dark:text-[#4a3412]",
  sun: "bg-sun-400 text-[#5c4300] [--btn-edge:theme(colors.sun.600)] hover:bg-sun-300",
  outline:
    "border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--text)] [--btn-edge:var(--border)] hover:border-oasis-300",
  ghost: "bg-transparent text-[var(--text-muted)] [--btn-edge:transparent] hover:bg-[var(--surface-alt)]",
  danger: "bg-coral-400 text-white [--btn-edge:theme(colors.coral.500)] hover:bg-coral-300",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-3.5 py-1.5 text-sm rounded-2xl",
  md: "px-5 py-3 text-base rounded-2xl",
  lg: "px-7 py-4 text-lg rounded-3xl",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  silent,
  className = "",
  type = "button",
  onClick,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={(e) => {
        if (!silent) playSound("tap");
        onClick?.(e);
      }}
      className={[
        "btn-jelly inline-flex items-center justify-center gap-2 font-extrabold select-none",
        "disabled:cursor-not-allowed disabled:opacity-45",
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
