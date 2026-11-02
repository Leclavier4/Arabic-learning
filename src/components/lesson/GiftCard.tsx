import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Gift as GiftIcon, HelpCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ArabicText } from "../ui/ArabicText";
import { SpeakButton } from "../ui/SpeakButton";
import type { FactGift, Gift, MediaGift, RiddleGift } from "../../types";
import { burstGift } from "../../services/confetti";
import { playSound } from "../../services/sound";
import { TreasureChest } from "../game/TreasureChest";
import { useLang } from "../../hooks/useLang";

/**
 * Coffre au trésor de fin de journée : il se dandine, on le touche, il
 * s'ouvre (son + confettis) et révèle le cadeau du jour (giftForDay).
 */
export function GiftCard({ gift, onOpen }: { gift: Gift; onOpen?: () => void }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  const openChest = () => {
    if (open) return;
    setOpen(true);
    playSound("chest");
    burstGift();
    onOpen?.();
  };

  return (
    <Card as="section" className="flex flex-col items-center gap-3 border-sun-300 bg-sun-100/60 text-center dark:bg-sun-300/10">
      <h3 className="text-xl font-extrabold text-[var(--text)]">{t.gift.title}</h3>
      <button
        type="button"
        onClick={openChest}
        disabled={open}
        aria-label={t.gift.open}
        className="rounded-4xl p-1 disabled:cursor-default"
      >
        <TreasureChest open={open} size={open ? 120 : 160} />
      </button>
      {!open ? (
        <>
          <p className="text-sm font-semibold text-[var(--text-muted)]">{t.gift.subtitle}</p>
          <Button variant="sun" size="lg" onClick={openChest} silent>
            <GiftIcon size={20} />
            {t.gift.open}
          </Button>
        </>
      ) : (
        <motion.div
          className="w-full text-start"
          initial={{ scale: 0.7, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.35 }}
        >
          <div className="rounded-3xl border-2 border-sun-300 bg-[var(--surface)] p-4">
            {gift.kind === "media" && <MediaGiftView data={gift.data} />}
            {gift.kind === "riddle" && <RiddleGiftView data={gift.data} />}
            {gift.kind === "fact" && <FactGiftView data={gift.data} />}
          </div>
        </motion.div>
      )}
    </Card>
  );
}

function MediaGiftView({ data }: { data: MediaGift }) {
  const { t, lang } = useLang();
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--gold)]">
        {t.gift[data.type]} · {data.lang}
      </p>
      <h3 className="text-lg font-extrabold text-[var(--text)]" dir="auto">
        {data.title}
      </h3>
      <p className="text-sm text-[var(--text-muted)]">{lang === "ar" && data.whyAr ? data.whyAr : data.why}</p>
      <a
        href={data.url}
        target="_blank"
        rel="noreferrer noopener"
        className="btn-jelly mt-2 inline-flex w-fit items-center gap-2 rounded-2xl bg-oasis-500 px-4 py-2.5 font-extrabold text-white [--btn-edge:theme(colors.oasis.700)] hover:bg-oasis-400"
      >
        {t.gift.openLink} <ExternalLink size={16} className="rtl:-scale-x-100" />
      </a>
    </div>
  );
}

function RiddleGiftView({ data }: { data: RiddleGift }) {
  const { t, lang } = useLang();
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--gold)]">{t.gift.riddle}</p>
      <div className="flex items-start gap-2">
        <SpeakButton text={data.q} />
        <ArabicText as="p" text={data.q} className="flex-1 text-xl text-[var(--text)]" />
      </div>
      {revealed ? (
        <div className="rounded-2xl bg-[var(--surface)] p-3">
          <ArabicText as="p" text={data.a} className="text-2xl font-bold text-oasis-600 dark:text-oasis-300" />
          {lang === "fr" && <p className="mt-1 text-xs text-[var(--text-muted)]">{data.fr}</p>}
        </div>
      ) : (
        <Button variant="secondary" onClick={() => setRevealed(true)} className="w-fit">
          <HelpCircle size={16} />
          {t.gift.reveal}
        </Button>
      )}
    </div>
  );
}

function FactGiftView({ data }: { data: FactGift }) {
  const { t, lang } = useLang();
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--gold)]">{t.gift.fact}</p>
      <ArabicText as="p" text={data.ar} className="text-xl text-[var(--text)]" />
      {lang === "fr" && <p className="text-sm text-[var(--text-muted)]">{data.fr}</p>}
    </div>
  );
}
