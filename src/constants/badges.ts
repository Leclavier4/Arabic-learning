import type { Badge } from "../types";

export const BADGES: Badge[] = [
  {
    id: "first-lesson",
    name: { fr: "Premier pas", ar: "الخطوة الأولى" },
    description: { fr: "Termine ta toute première leçon.", ar: "أنهِ درسك الأوّل." },
    emoji: "🎉",
  },
  {
    id: "first-memory",
    name: { fr: "Gardien des souvenirs", ar: "حارس الذكريات" },
    description: { fr: "Enregistre ton premier souvenir associé à un mot.", ar: "احفظ أوّل ذكرى مرتبطة بكلمة." },
    emoji: "🗝️",
  },
  {
    id: "streak-3",
    name: { fr: "Bien lancé", ar: "انطلاقة جميلة" },
    description: { fr: "3 jours d'affilée, sans interruption.", ar: "ثلاثة أيّام متتالية بلا انقطاع." },
    emoji: "🔥",
  },
  {
    id: "streak-7",
    name: { fr: "Une semaine entière", ar: "أسبوع كامل" },
    description: { fr: "7 jours de suite — une semaine complète !", ar: "سبعة أيّام متتالية — أسبوع كامل!" },
    emoji: "🗓️",
  },
  {
    id: "streak-30",
    name: { fr: "Inarrêtable", ar: "لا شيء يوقفك" },
    description: { fr: "30 jours de suite. Impressionnant !", ar: "ثلاثون يومًا متتاليًا. مدهش!" },
    emoji: "🚀",
  },
  {
    id: "words-100",
    name: { fr: "Club des 100", ar: "نادي المئة" },
    description: { fr: "100 mots appris au total.", ar: "تعلّمت مئة كلمة." },
    emoji: "💯",
  },
  {
    id: "lessons-10",
    name: { fr: "Dix leçons", ar: "عشرة دروس" },
    description: { fr: "10 leçons terminées.", ar: "أنهيت عشرة دروس." },
    emoji: "📚",
  },
  {
    id: "no-harakat",
    name: { fr: "Lecteur sans voyelles", ar: "قارئ بلا حركات" },
    description: {
      fr: "Termine une leçon avec les voyelles masquées.",
      ar: "أنهِ درسًا والحركات مخفيّة.",
    },
    emoji: "🌙",
  },
];

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}
