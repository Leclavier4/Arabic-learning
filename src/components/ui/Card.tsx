import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article";
}

export function Card({ as = "div", className = "", children, ...rest }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={[
        "rounded-3xl border p-5 shadow-softer sm:p-6",
        "border-[var(--border)] bg-[var(--surface)]",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
}
