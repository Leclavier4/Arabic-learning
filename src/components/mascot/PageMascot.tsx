import { Mascot } from "./Mascot";
import type { MascotPose } from "../../context/MascotContext";
import { useMascot } from "../../hooks/useMascot";

interface PageMascotProps {
  title: string;
  subtitle?: string;
  /** Phrase par défaut de la mascotte sur cette page. */
  message: string;
  pose?: MascotPose;
}

/** En-tête de page « jeu » : titre + la mascotte qui commente (réagit si on la touche). */
export function PageMascot({ title, subtitle, message, pose = "wave" }: PageMascotProps) {
  const { reaction } = useMascot();
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h1 className="text-3xl font-extrabold leading-tight text-[var(--text)]">{title}</h1>
        {subtitle && <p className="font-semibold text-[var(--text-muted)]">{subtitle}</p>}
      </div>
      <Mascot pose={reaction?.pose ?? pose} message={reaction?.message ?? message} size={78} />
    </div>
  );
}
