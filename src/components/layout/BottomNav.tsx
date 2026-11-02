import { NavLink } from "react-router-dom";
import { Home, BookOpenCheck, Heart, Settings2 } from "lucide-react";
import { useLang } from "../../hooks/useLang";

export function BottomNav() {
  const { t } = useLang();
  const items = [
    { to: "/", icon: Home, label: t.nav.home, end: true },
    { to: "/my-words", icon: BookOpenCheck, label: t.nav.myWords },
    { to: "/memory-palace", icon: Heart, label: t.nav.memories },
    { to: "/settings", icon: Settings2, label: t.nav.settings },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--surface)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      aria-label={t.nav.label}
    >
      <ul className="mx-auto flex max-w-2xl items-stretch justify-around">
        {items.map(({ to, icon: Icon, label, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center gap-1 py-2.5 text-xs font-bold transition-colors",
                  isActive ? "text-[var(--accent)]" : "text-[var(--text-faint)] hover:text-[var(--text-muted)]",
                ].join(" ")
              }
            >
              <Icon size={22} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
