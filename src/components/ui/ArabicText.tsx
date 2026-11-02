import { useHarakat } from "../../hooks/useHarakat";

interface ArabicTextProps {
  text: string;
  as?: "span" | "p" | "div" | "h2" | "h3";
  className?: string;
  /** Ignore la préférence « masquer les voyelles » (ex. aide à la lecture). */
  alwaysVocalized?: boolean;
}

/**
 * Affiche du contenu arabe à apprendre : TOUJOURS en RTL (dir="rtl"), quelle
 * que soit la langue d'interface, avec la police Naskh et les harakât
 * affichées ou masquées selon la préférence de l'apprenant.
 */
export function ArabicText({ text, as: Tag = "span", className = "", alwaysVocalized }: ArabicTextProps) {
  const { show } = useHarakat();
  return (
    <Tag lang="ar" dir="rtl" className={`ar-content ${className}`}>
      {alwaysVocalized ? text : show(text)}
    </Tag>
  );
}
