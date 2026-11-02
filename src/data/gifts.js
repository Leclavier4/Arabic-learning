/*
 * كلماتي / Kalimati — Cadeaux du jour, débloqués à la fin de la tâche journalière.
 * 3 types : média (vidéo / podcast / site), devinette arabe, fun fact.
 * L'app tire un cadeau différent chaque jour (index basé sur le n° de leçon).
 *
 * Les médias ci-dessous sont RÉELS et adaptés aux débutants en arabe.
 * Vérifie/mets à jour les liens de temps en temps : les URLs changent parfois,
 * le nom reste le repère.
 *
 * Format :
 *   MEDIA_GIFTS  : { type: "video" | "podcast" | "site", title, lang, why, whyAr, url }
 *   RIDDLE_GIFTS : { q, a, fr }  — q et a en arabe vocalisé, fr = traduction question + réponse
 *   FACT_GIFTS   : { ar, fr }
 */

// ── Vidéos, podcasts et sites pour débutants ────────────────────────────
export const MEDIA_GIFTS = [
  {
    type: "video",
    title: "Learn Arabic with Maha",
    lang: "YouTube",
    why: "Une prof chaleureuse, une notion par vidéo : salutations, phrases de voyage, culture. Idéal pour débuter.",
    whyAr: "معلّمة لطيفة تشرح فكرة واحدة في كلّ فيديو: التحيّات، عبارات السفر، والثقافة.",
    url: "https://www.youtube.com/@LearnArabicwithMaha",
  },
  {
    type: "video",
    title: "Easy Arabic",
    lang: "YouTube",
    why: "Micro-trottoirs dans les rues d'Égypte, de Palestine et de Tunisie, sous-titrés en arabe et en anglais. Les « Super Easy » parlent lentement.",
    whyAr: "مقابلات في الشوارع مع ترجمة بالعربية والإنجليزية، وحلقات «سهلة جدًّا» بكلام بطيء.",
    url: "https://www.youtube.com/channel/UCb235Y4KE9oKSEl6BEAGUGA",
  },
  {
    type: "video",
    title: "ArabicPod101",
    lang: "YouTube",
    why: "Des centaines de courtes leçons classées par niveau, du grand débutant à l'avancé. Parfait pour le vocabulaire du quotidien.",
    whyAr: "مئات الدروس القصيرة مرتّبة حسب المستوى، من المبتدئ إلى المتقدّم.",
    url: "https://www.youtube.com/@ArabicPod101",
  },
  {
    type: "video",
    title: "افتح يا سمسم · Iftah Ya Simsim",
    lang: "YouTube",
    why: "Le « Sesame Street » arabe : un arabe simple et clair, pensé pour les enfants — donc parfait pour les débutants !",
    whyAr: "برنامج الأطفال الشهير بلغة عربية بسيطة وواضحة، ممتاز للمبتدئين.",
    url: "https://www.youtube.com/results?search_query=%D8%A7%D9%81%D8%AA%D8%AD+%D9%8A%D8%A7+%D8%B3%D9%85%D8%B3%D9%85",
  },
  {
    type: "podcast",
    title: "Learn Arabic | ArabicPod101.com",
    lang: "Podcast",
    why: "Le podcast d'ArabicPod101 : épisodes courts à écouter dans les transports, avec explications pas à pas.",
    whyAr: "حلقات صوتية قصيرة للاستماع في الطريق، مع شرح خطوة بخطوة.",
    url: "https://www.arabicpod101.com/",
  },
  {
    type: "site",
    title: "Al Jazeera — تعليم العربية",
    lang: "Site web",
    why: "Le site gratuit d'apprentissage de l'arabe d'Al Jazeera : leçons structurées en arabe standard, avec audio.",
    whyAr: "موقع الجزيرة المجّاني لتعليم العربية الفصحى، بدروس منظّمة مع الصوت.",
    url: "https://learning.aljazeera.net/ar",
  },
  {
    type: "site",
    title: "Talk In Arabic",
    lang: "Site web",
    why: "Plein de ressources et d'articles pour comprendre les dialectes et l'arabe du quotidien.",
    whyAr: "موارد كثيرة لفهم اللهجات والعربية اليومية.",
    url: "https://talkinarabic.com/",
  },
  {
    type: "site",
    title: "Madinah Arabic",
    lang: "Site web",
    why: "Cours gratuits d'arabe classique, très progressifs : alphabet, lecture, puis grammaire de base.",
    whyAr: "دروس مجّانية في العربية الفصحى، خطوة بخطوة: الحروف، القراءة، ثم القواعد.",
    url: "https://www.madinaharabic.com/",
  },
];

// ── Devinettes arabes simples (ألغاز) ────────────────────────────────────
export const RIDDLE_GIFTS = [
  {
    q: "مَا الشَّيْءُ الَّذِي لَهُ أَسْنَانٌ وَلَا يَعَضُّ؟",
    a: "المُشْطُ",
    fr: "Qu'est-ce qui a des dents mais ne mord pas ? — Le peigne.",
  },
  {
    q: "مَا الشَّيْءُ الَّذِي يَكْتُبُ وَلَا يَقْرَأُ؟",
    a: "القَلَمُ",
    fr: "Qu'est-ce qui écrit mais ne lit pas ? — Le stylo.",
  },
  {
    q: "مَا الشَّيْءُ الَّذِي تَرَاهُ فِي اللَّيْلِ ثَلَاثَ مَرَّاتٍ، وَفِي النَّهَارِ مَرَّةً وَاحِدَةً؟",
    a: "حَرْفُ اللَّامِ",
    fr: "Qu'est-ce qu'on voit trois fois dans « la nuit » (اللَّيْل) et une seule fois dans « le jour » (النَّهَار) ? — La lettre lām (ل).",
  },
  {
    q: "مَا الشَّيْءُ الَّذِي لَهُ عَيْنٌ وَاحِدَةٌ وَلَا يَرَى؟",
    a: "الإِبْرَةُ",
    fr: "Qu'est-ce qui a un seul œil mais ne voit pas ? — L'aiguille (son « chas » se dit « œil » en arabe).",
  },
  {
    q: "مَا الشَّيْءُ الَّذِي يَمْشِي بِلَا رِجْلَيْنِ، وَيَبْكِي بِلَا عَيْنَيْنِ؟",
    a: "السَّحَابُ",
    fr: "Qu'est-ce qui marche sans jambes et pleure sans yeux ? — Le nuage.",
  },
  {
    q: "مَا الشَّيْءُ الَّذِي كُلَّمَا أَخَذْتَ مِنْهُ كَبُرَ؟",
    a: "الحُفْرَةُ",
    fr: "Qu'est-ce qui grandit chaque fois qu'on lui enlève quelque chose ? — Le trou.",
  },
  {
    q: "بَيْتٌ بِلَا أَبْوَابٍ وَلَا نَوَافِذَ، مَا هُوَ؟",
    a: "البَيْضَةُ",
    fr: "Une maison sans portes ni fenêtres, qu'est-ce que c'est ? — L'œuf.",
  },
  {
    q: "مَا الشَّيْءُ الَّذِي يَتَكَلَّمُ جَمِيعَ اللُّغَاتِ؟",
    a: "الصَّدَى",
    fr: "Qu'est-ce qui parle toutes les langues ? — L'écho.",
  },
  {
    q: "مَا الشَّيْءُ الَّذِي لَهُ رَقَبَةٌ وَلَيْسَ لَهُ رَأْسٌ؟",
    a: "الزُّجَاجَةُ",
    fr: "Qu'est-ce qui a un cou mais pas de tête ? — La bouteille.",
  },
  {
    q: "مَا الشَّيْءُ الَّذِي كُلَّمَا زَادَ نَقَصَ؟",
    a: "العُمْرُ",
    fr: "Qu'est-ce qui diminue chaque fois qu'il augmente ? — L'âge (le temps qu'il reste à vivre).",
  },
  {
    q: "مَا الحَرْفُ الَّذِي يُوجَدُ فِي وَسَطِ «مَكَّةَ»؟",
    a: "حَرْفُ الكَافِ",
    fr: "Quelle lettre se trouve au milieu de « Makka » (مَكَّة) ? — La lettre kāf (ك).",
  },
  {
    q: "لَهُ أَوْرَاقٌ وَلَيْسَ نَبَاتًا، وَلَهُ جِلْدٌ وَلَيْسَ حَيَوَانًا، مَا هُوَ؟",
    a: "الكِتَابُ",
    fr: "Il a des feuilles mais n'est pas une plante, une peau (reliure) mais n'est pas un animal ? — Le livre.",
  },
  {
    q: "مَا الشَّيْءُ الَّذِي تَأْكُلُ مِنْهُ وَلَا تَأْكُلُهُ؟",
    a: "الصَّحْنُ",
    fr: "Dans quoi mange-t-on sans jamais le manger ? — L'assiette.",
  },
  {
    q: "يَظْهَرُ فِي النَّهَارِ، وَيَخْتَفِي فِي اللَّيْلِ، مَا هُوَ؟",
    a: "الشَّمْسُ",
    fr: "Il apparaît le jour et disparaît la nuit, qu'est-ce que c'est ? — Le soleil.",
  },
  {
    q: "مَا الشَّيْءُ الَّذِي يَسِيرُ بِلَا قَدَمَيْنِ، وَيَدْخُلُ الأُذُنَيْنِ؟",
    a: "الصَّوْتُ",
    fr: "Qu'est-ce qui voyage sans pieds et entre dans les oreilles ? — Le son.",
  },
];

// ── Fun facts sur la langue arabe ───────────────────────────────────────
export const FACT_GIFTS = [
  {
    ar: "تُكْتَبُ العَرَبِيَّةُ مِنَ اليَمِينِ إِلَى اليَسَارِ، لَكِنَّ الأَرْقَامَ تُقْرَأُ مِنَ اليَسَارِ إِلَى اليَمِينِ!",
    fr: "L'arabe s'écrit de droite à gauche… mais les nombres se lisent de gauche à droite !",
  },
  {
    ar: "فِي الأَبْجَدِيَّةِ العَرَبِيَّةِ ثَمَانِيَةٌ وَعِشْرُونَ حَرْفًا.",
    fr: "L'alphabet arabe compte 28 lettres.",
  },
  {
    ar: "تُسَمَّى العَرَبِيَّةُ «لُغَةَ الضَّادِ»، لِأَنَّ صَوْتَ الضَّادِ نَادِرٌ جِدًّا فِي لُغَاتِ العَالَمِ.",
    fr: "On appelle l'arabe « la langue du ḍād » (ض), car ce son est très rare dans les langues du monde.",
  },
  {
    ar: "كَلِمَاتٌ فَرَنْسِيَّةٌ كَثِيرَةٌ أَصْلُهَا عَرَبِيٌّ: «sucre» مِنْ «سُكَّر»، وَ«algèbre» مِنْ «الجَبْر»، وَ«magasin» مِنْ «مَخَازِن».",
    fr: "Beaucoup de mots français viennent de l'arabe : sucre (sukkar), algèbre (al-jabr), magasin (makhāzin)…",
  },
  {
    ar: "كَلِمَتَا «chiffre» وَ«zéro» فِي الفَرَنْسِيَّةِ أَصْلُهُمَا كَلِمَةُ «صِفْر» العَرَبِيَّةُ.",
    fr: "Les mots « chiffre » et « zéro » viennent tous deux de l'arabe ṣifr (صِفْر), qui veut dire « vide, zéro ».",
  },
  {
    ar: "يَحْتَفِلُ العَالَمُ بِاليَوْمِ العَالَمِيِّ لِلُّغَةِ العَرَبِيَّةِ يَوْمَ ١٨ دِيسَمْبَر.",
    fr: "La Journée mondiale de la langue arabe est célébrée chaque 18 décembre.",
  },
  {
    ar: "العَرَبِيَّةُ وَاحِدَةٌ مِنَ اللُّغَاتِ الرَّسْمِيَّةِ السِّتِّ فِي الأُمَمِ المُتَّحِدَةِ.",
    fr: "L'arabe est l'une des six langues officielles de l'ONU.",
  },
  {
    ar: "مُعْظَمُ الحُرُوفِ تَتَّصِلُ بِمَا بَعْدَهَا، إِلَّا سِتَّةَ حُرُوفٍ: ا د ذ ر ز و.",
    fr: "Presque toutes les lettres s'attachent à la suivante, sauf six : ا د ذ ر ز و.",
  },
  {
    ar: "قَدْ يَأْخُذُ الحَرْفُ الوَاحِدُ أَرْبَعَةَ أَشْكَالٍ حَسَبَ مَكَانِهِ فِي الكَلِمَةِ.",
    fr: "Une même lettre peut avoir jusqu'à 4 formes selon sa place dans le mot (isolée, début, milieu, fin).",
  },
  {
    ar: "الأَرْقَامُ ١، ٢، ٣ الَّتِي نَسْتَعْمِلُهَا فِي فَرَنْسَا تُسَمَّى «الأَرْقَامَ العَرَبِيَّةَ».",
    fr: "Les chiffres 1, 2, 3… qu'on utilise en France s'appellent les « chiffres arabes ».",
  },
  {
    ar: "«كِتَاب» وَ«مَكْتَب» وَ«كَاتِب» كَلِمَاتٌ مِنْ جَذْرٍ وَاحِدٍ: ك ت ب.",
    fr: "Livre (kitāb), bureau (maktab) et écrivain (kātib) viennent de la même racine : k-t-b.",
  },
  {
    ar: "كَلِمَةُ «amiral» فِي الفَرَنْسِيَّةِ جَاءَتْ مِنَ العَرَبِيَّةِ «أَمِير».",
    fr: "Le mot « amiral » vient de l'arabe amīr (أَمِير, « chef, prince »).",
  },
  {
    ar: "الحَرَكَاتُ (الفَتْحَةُ وَالضَّمَّةُ وَالكَسْرَةُ) تُسَاعِدُ عَلَى قِرَاءَةِ الكَلِمَةِ بِشَكْلٍ صَحِيحٍ.",
    fr: "Les harakât (fatḥa, ḍamma, kasra) indiquent les voyelles brèves et aident à bien lire.",
  },
  {
    ar: "الخَطُّ العَرَبِيُّ فَنٌّ جَمِيلٌ لَهُ أَنْوَاعٌ كَثِيرَةٌ، مِثْلُ النَّسْخِ وَالثُّلُثِ وَالكُوفِيِّ.",
    fr: "La calligraphie arabe est un art, avec de nombreux styles : naskh, thuluth, coufique…",
  },
  {
    ar: "يَتَكَلَّمُ العَرَبِيَّةَ أَكْثَرُ مِنْ أَرْبَعِمِائَةِ مِلْيُونِ شَخْصٍ فِي العَالَمِ.",
    fr: "Plus de 400 millions de personnes parlent arabe dans le monde.",
  },
];

// Assemble une file de cadeaux mélangés (un type qui tourne chaque jour).
export function giftForDay(dayNumber) {
  const cycle = dayNumber % 3;
  if (cycle === 0) return { kind: "media", data: MEDIA_GIFTS[dayNumber % MEDIA_GIFTS.length] };
  if (cycle === 1) return { kind: "riddle", data: RIDDLE_GIFTS[dayNumber % RIDDLE_GIFTS.length] };
  return { kind: "fact", data: FACT_GIFTS[dayNumber % FACT_GIFTS.length] };
}
