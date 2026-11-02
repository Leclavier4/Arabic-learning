import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Gift as GiftIcon, HelpCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ArabicText } from "../ui/ArabicText";
import { SpeakButton } from "../ui/SpeakButton";
import type { FactGift, Gift, MediaGift, RiddleGift } from "../../types";
import { burstGift } from "../../services/confetti";
import { useLang } from "../../hooks/useLang";

/** Carte « surprise » : un paquet cadeau qui s'ouvre (confettis) sur le cadeau du jour. */
export function GiftCard({ gift }: { gift: Gift }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Card
        as="section"
        className="flex flex-col items-center gap-2 border-2 border-dashed border-gold-300 bg-sand-50 py-8 text-center dark:bg-gold-300/10"
      >
        <motion.div animate={{ y: [0, -6, 0], rotate: [0, -3, 3, 0] }} transition={{ duration: 2.2, repeat: Infinity }} className="text-5xl">
          🎁
        </motion.div>
        <h3 className="text-lg font-black text-[var(--text)]">{t.gift.title}</h3>
        <p className="text-sm text-[var(--text-muted)]">{t.gift.subtitle}</p>
        <Button
          onClick={() => {
            setOpen(true);
            burstGift();
          }}
          className="mt-2"
        >
          <GiftIcon size={18} />
          {t.gift.open}
        </Button>
      </Card>
    );
  }

  return (
    <motion.div initial={{ scale: 0.85, opacity: 0, rotate: -2 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 180, damping: 14 }}>
      <Card className="border-2 border-gold-300/70 bg-sand-50 dark:bg-gold-300/10">
        {gift.kind === "media" && <MediaGiftView data={gift.data} />}
        {gift.kind === "riddle" && <RiddleGiftView data={gift.data} />}
        {gift.kind === "fact" && <FactGiftView data={gift.data} />}
      </Card>
    </motion.div>
  );
}

function MediaGiftView({ data }: { data: MediaGift }) {
  const { t, lang } = useLang();
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--gold)]">
        {t.gift[data.type]} · {data.lang}
      </p>
      <h3 className="text-lg font-black text-[var(--text)]" dir="auto">
        {data.title}
      </h3>
      <p className="text-sm text-[var(--text-muted)]">{lang === "ar" && data.whyAr ? data.whyAr : data.why}</p>
      <a
        href={data.url}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-2 inline-flex w-fit items-center gap-2 rounded-2xl bg-sage-500 px-4 py-2.5 font-bold text-white hover:bg-sage-600"
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
          <ArabicText as="p" text={data.a} className="text-2xl font-bold text-sage-600 dark:text-sage-300" />
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
