import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Map, BookOpenCheck, Sticker, Heart, Settings2 } from "lucide-react";
import { useLang } from "../../hooks/useLang";
import { playSound } from "../../services/sound";

/** Barre de navigation façon jeu : grosses icônes, onglet actif dans une bulle colorée. */
export function BottomNav() {
  const { t } = useLang();
  const items = [
    { to: "/", icon: Map, label: t.game.navMap, end: true },
    { to: "/my-words", icon: BookOpenCheck, label: t.nav.myWords },
    { to: "/collection", icon: Sticker, label: t.game.navCollection },
    { to: "/memory-palace", icon: Heart, label: t.nav.memories },
    { to: "/settings", icon: Settings2, label: t.nav.settings },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-[var(--border)] bg-[var(--surface)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      aria-label={t.nav.label}
    >
      <ul className="mx-auto flex max-w-2xl items-stretch justify-around px-1">
        {items.map(({ to, icon: Icon, label, end }) => (
          <li key={to} className="flex-1">
            <NavLink to={to} end={end} onClick={() => playSound("tap")} className="flex flex-col items-center gap-0.5 py-1.5">
              {({ isActive }) => (
                <>
                  <motion.span
                    animate={isActive ? { y: [0, -4, 0], scale: 1.05 } : { y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 14 }}
                    className={[
                      "flex h-9 w-12 items-center justify-center rounded-2xl transition-colors",
                      isActive ? "bg-oasis-100 text-oasis-600 ring-2 ring-oasis-300 dark:bg-oasis-400/20 dark:text-oasis-200" : "text-[var(--text-faint)]",
                    ].join(" ")}
                  >
                    <Icon size={22} strokeWidth={2.4} />
                  </motion.span>
                  <span className={`text-[11px] font-extrabold ${isActive ? "text-oasis-600 dark:text-oasis-200" : "text-[var(--text-faint)]"}`}>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
