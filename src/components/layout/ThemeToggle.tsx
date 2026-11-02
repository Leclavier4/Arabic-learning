import { Sun, Moon, MonitorSmartphone } from "lucide-react";
import { useTheme, type ThemeChoice } from "../../hooks/useTheme";
import { useLang } from "../../hooks/useLang";

const ORDER: ThemeChoice[] = ["light", "dark", "system"];
const ICONS: Record<ThemeChoice, typeof Sun> = { light: Sun, dark: Moon, system: MonitorSmartphone };

/** Sélecteur complet clair / sombre / auto (page Réglages). */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLang();
  return (
    <div role="radiogroup" aria-label={t.theme.label} className="flex w-fit items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
      {ORDER.map((value) => {
        const Icon = ICONS[value];
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(value)}
            className={[
              "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold transition",
              active ? "bg-oasis-500 text-white dark:bg-oasis-400 dark:text-[#13200f]" : "text-[var(--text-muted)] hover:bg-[var(--surface-alt)]",
            ].join(" ")}
          >
            <Icon size={16} />
            {t.theme[value]}
          </button>
        );
      })}
    </div>
  );
}
