/**
 * Textes de l'interface — FRANÇAIS (mise en page LTR).
 * La structure de ce fichier sert de référence : ar.ts doit avoir exactement
 * les mêmes clés (TypeScript le vérifie via le type `Dict`).
 */
const fr = {
  common: {
    continue: "Continuer",
    cancel: "Annuler",
    listen: "Écouter",
    listenTo: (word: string) => `Écouter « ${word} »`,
  },
  app: {
    name: "Kalimati",
    footer: "كلماتي · Kalimati — l'arabe, un mot à la fois. 🌿",
  },
  nav: {
    label: "Navigation principale",
    home: "Accueil",
    myWords: "Mes mots",
    memories: "Souvenirs",
    settings: "Réglages",
  },
  header: {
    home: "Retour à l'accueil",
    streak: (n: number, best: number) => `Série : ${n} jour${n > 1 ? "s" : ""} · record ${best}`,
    harakatShow: "Afficher les voyelles (harakât)",
    harakatHide: "Masquer les voyelles (harakât)",
    language: "Langue de l'interface",
  },
  theme: {
    label: "Thème",
    light: "Clair",
    dark: "Sombre",
    system: "Auto",
    current: (name: string) => `Thème : ${name} (toucher pour changer)`,
  },
  speech: {
    noVoice:
      "Aucune voix arabe n'est installée sur cet appareil. Lis le mot à ton rythme avec la translittération, c'est très bien aussi 🌿",
    unsupported: "L'audio n'est pas disponible sur ce navigateur — la translittération t'aide à prononcer.",
  },
  categories: {
    verb: "Verbes",
    adjective: "Adjectifs",
    linking: "Mots de liaison",
    expression: "Expressions",
  },
  steps: {
    warmup: "Échauffement",
    discover: "Découverte",
    build: "Construire des phrases",
    memory: "Associer à un souvenir",
    read: "Lire le paragraphe",
    practice: "Pratiquer",
    complete: "Terminé !",
  },
  onboarding: {
    welcome: "Bienvenue sur Kalimati",
    subtitle: "Apprends l'arabe en douceur : 20 mots par jour, vocalisés, translittérés et lus à voix haute.",
    chooseLang: "Choisis la langue de l'interface",
    canChange: "Tu pourras la changer à tout moment, en haut de l'écran.",
    how: "Comment ça marche ?",
    points: [
      "Chaque jour, une leçon de 20 mots : verbes, adjectifs, mots de liaison et expressions.",
      "Tu les découvres, tu écris tes phrases, tu les relies à un souvenir et tu lis un petit texte.",
      "Gagne de l'XP, garde ta série 🔥 et ouvre ton cadeau surprise chaque jour 🎁",
    ],
    start: "Commencer",
  },
  dashboard: {
    hello: "Ahlan ! 👋",
    wordsSoFar: (n: number) => `Tu as déjà appris ${n} mot${n > 1 ? "s" : ""}. Continue comme ça !`,
    firstWords: "Découvrons aujourd'hui tes tout premiers mots arabes.",
    day: (n: number) => `Jour ${n}`,
    todaysLesson: "Leçon du jour",
    description:
      "20 nouveaux mots en quelques étapes douces : échauffement, flashcards, tes propres phrases, un souvenir, une petite lecture et la pratique.",
    done: "Tâche du jour accomplie — à demain !",
    viewRecap: "Revoir le récap et le cadeau",
    start: "Commencer la leçon du jour",
    continueAt: (step: string) => `Continuer — ${step}`,
    memoryPalace: "Palais de mémoire",
  },
  rank: {
    yourRank: "Ton grade",
    progress: "Progression vers le grade suivant",
    toNext: (xp: number, name: string) => `Encore ${xp} XP pour devenir ${name}`,
    max: "Tu as atteint le plus haut grade — incroyable ! 👑",
  },
  streak: {
    title: "Série",
    days: (n: number) => `${n} jour${n > 1 ? "s" : ""}`,
    best: (n: number) => `Record : ${n}`,
  },
  badges: {
    title: "Badges",
  },
  celebrate: {
    rankTitle: "Nouveau grade !",
    rankText: (name: string) => `Tu es maintenant « ${name} ». Superbe progression !`,
    badgeTitle: "Badge débloqué !",
    thanks: "Merci ! 🌿",
  },
  lesson: {
    dayStep: (day: number, step: number, total: number) => `Jour ${day} · Étape ${step}/${total}`,
    progress: "Progression de la leçon",
    warmup: {
      firstTitle: "Ta toute première leçon !",
      firstText: "Rien à réviser pour l'instant — découvrons tes premiers mots.",
      letsGo: "C'est parti",
      intro: "Un petit coup d'œil sur des mots déjà rencontrés — sans pression, juste un rappel amical.",
      reveal: "Voir",
      knew: "Je savais",
      notYet: "Pas encore",
      next: "Passer aux mots du jour",
    },
    discover: {
      intro: (done: number, total: number) =>
        `Touche chaque carte pour la retourner et découvrir son sens. ${done}/${total} retournées.`,
      flipAll: (done: number, total: number) => `Retourne toutes les cartes (${done}/${total})`,
      tapToFlip: "Touche pour retourner",
      present: "Au présent (je …)",
      cardLabel: (word: string) => `Carte « ${word} ». Touche pour la retourner.`,
    },
    build: {
      intro:
        "Écris au moins une courte phrase en arabe par catégorie, avec un des mots proposés. Les voyelles ne sont pas obligatoires et il n'y a pas de mauvaise réponse — essaie !",
      almost: "Essaie d'inclure un des mots ci-dessus — tu y es presque !",
      found: (n: number) => `${n} mot${n > 1 ? "s" : ""} de la leçon repéré${n > 1 ? "s" : ""} ✨`,
      starter: "Idée pour commencer :",
      useStarter: "Utiliser",
    },
    memory: {
      intro:
        "Choisis un mot et relie-le à un souvenir personnel ou à une émotion. Associer un mot à un vrai souvenir est l'une des meilleures façons de le garder pour toujours.",
      choose: "Choisis un mot",
      yourMemory: "Ton souvenir pour ce mot",
      placeholder: "À quoi ce mot te fait-il penser ? Un lieu, une personne, un moment…",
      save: "Enregistrer ce souvenir",
      savedTitle: "Souvenir enregistré !",
      savedText: "Tu le retrouveras à tout moment dans ton palais de mémoire.",
    },
    read: {
      intro: "Lis ce court paragraphe à voix haute, même lentement — le but est de pratiquer, pas d'être parfait.",
      story: "L'histoire du jour",
      sentences: (n: number) => `${n} phrases · les mots du jour sont surlignés`,
      done: "Je l'ai lu à voix haute",
      bravo: "Bravo d'avoir lu à voix haute ! Quelle que soit ta prononciation, tu as osé 🎤",
    },
    practice: {
      title: "Une dernière chose aujourd'hui",
      text: "Raconte ta journée à un proche — ou à toi-même, à voix haute — en essayant de glisser quelques mots du jour.",
      wordsHint: "Quelques mots à placer :",
      check: "J'ai parlé de ma journée",
      finish: "Terminer la leçon du jour 🎉",
    },
    complete: {
      title: "Leçon terminée !",
      text: "Tu as découvert 20 nouveaux mots aujourd'hui. Mabrouk ! 🌟",
      recap: "Récap du jour",
      xpEarned: "XP gagnés",
      rank: "Grade actuel",
      streak: "Jours de suite",
      words: "Les mots du jour",
      back: "Retour à l'accueil",
    },
  },
  gift: {
    title: "Ton cadeau surprise du jour",
    subtitle: "Tu l'as mérité en terminant ta tâche du jour !",
    open: "Ouvrir mon cadeau",
    video: "🎬 Vidéo",
    podcast: "🎧 Podcast",
    site: "🌐 Site",
    openLink: "Ouvrir",
    riddle: "🧩 Devinette",
    reveal: "Voir la réponse",
    fact: "💡 Le savais-tu ?",
  },
  myWords: {
    title: "Mes mots",
    count: (n: number) => `${n} mot${n > 1 ? "s" : ""} appris jusqu'ici.`,
    search: "Chercher (arabe, translittération, français)…",
    all: "Tous",
    empty: "Aucun mot pour l'instant — termine l'étape Découverte pour commencer ta collection !",
    noResult: "Aucun mot ne correspond à ta recherche.",
    day: (n: number) => `Jour ${n}`,
  },
  memories: {
    title: "Mon palais de mémoire",
    subtitle: "Tous les mots que tu as reliés à un souvenir personnel, réunis au même endroit.",
    empty: "Pas encore de souvenir — tu en ajouteras un pendant la leçon du jour.",
  },
  settings: {
    title: "Réglages",
    appearance: "Apparence",
    language: "Langue de l'interface",
    harakat: "Voyelles (harakât)",
    harakatHelp:
      "Masque les voyelles pour t'entraîner à lire comme dans un vrai texte arabe. Tu peux aussi utiliser le bouton « حَ » en haut.",
    show: "Afficher",
    hide: "Masquer",
    about: "À propos de Kalimati",
    aboutText: (words: number, lessons: number) =>
      `${words} mots · ${lessons} leçons · tout est enregistré uniquement sur cet appareil (aucun compte, aucun serveur).`,
    install: "Installer l'application",
    installText:
      "Sur Android (Chrome) : menu ⋮ → « Installer l'application ». Kalimati s'ouvre alors en plein écran et fonctionne hors-ligne.",
    danger: "Zone sensible",
    dangerText:
      "Efface ta série, ton XP, tes badges, tes souvenirs et tes mots appris sur cet appareil. C'est irréversible.",
    reset: "Réinitialiser toutes mes données",
    confirm: "Touche encore pour confirmer",
    resetDone: "Tes données ont été réinitialisées. Nouveau départ 🌱",
  },
  notFound: {
    title: "Page introuvable",
    text: "Retournons sur le bon chemin.",
    back: "Retour à l'accueil",
  },
  encouragements: {
    generic: ["Beau travail ! 🌟", "Tu avances très bien !", "Encore un pas, bravo !", "Continue sur cette lancée !"],
    warmup: ["Ta mémoire est bien réveillée !", "Réviser, c'est ancrer. Bravo !", "Échauffement réussi, on y va !"],
    discover: [
      "Nouveaux mots débloqués — ils sont à toi !",
      "Tu collectionnes les mots comme des trésors !",
      "Chaque carte retournée est un pas en avant.",
    ],
    build: [
      "Tes propres phrases en arabe — chapeau !",
      "Écrire soi-même, c'est comme ça que ça reste.",
      "Ces mots sont maintenant les tiens.",
    ],
    memory: [
      "Un souvenir rend un mot inoubliable.",
      "Ce petit ancrage t'aidera pendant des années.",
      "Merci de l'avoir partagé — il fait partie de ton chemin.",
    ],
    read: [
      "Lire à voix haute demande du courage — bravo !",
      "Ta bouche et ton cerveau viennent de faire équipe !",
      "Quel que soit le résultat, tu as osé. C'est ça qui compte.",
    ],
    practice: [
      "Les vraies conversations, c'est la vraie victoire !",
      "Tu as emmené l'arabe hors de l'app — énorme !",
      "C'est exactement comme ça qu'on devient à l'aise.",
    ],
  },
};

export type Dict = typeof fr;
export default fr;
