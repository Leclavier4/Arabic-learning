import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article";
}

/** Carte « bloc de jeu » : coins très arrondis, bord épais, épaisseur en bas. */
export function Card({ as = "div", className = "", children, ...rest }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={["game-card rounded-4xl border-2 border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6", className].join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
}
