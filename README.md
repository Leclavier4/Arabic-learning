# كلماتي · Kalimati

Apprends **20 mots d'arabe par jour**, à ton rythme : flashcards vocalisées,
phrases que tu écris toi-même, souvenirs personnels, lecture à voix haute,
et une touche de gamification (grades, série, badges, cadeau surprise
chaque jour). Pensé pour les débutants, mobile-first, installable comme une
vraie app (PWA) et utilisable hors-ligne.

Aucun backend, aucune base de données, aucun compte : tout est sauvegardé
dans le `localStorage` du navigateur.

## ✨ Fonctionnalités

- **Langue d'interface au choix** : français (mise en page LTR) ou arabe
  (mise en page RTL), modifiable à tout moment (en-tête, accueil, réglages,
  onboarding). Le **contenu arabe à apprendre est toujours affiché en RTL**.
- **Une leçon par jour** de 20 mots : 5 **الأفعال** (verbes), 5 **الصفات**
  (adjectifs), 5 **أدوات الربط** (mots de liaison), 5 **التعبيرات** (expressions).
  Chaque mot : arabe vocalisé (harakât), translittération, traduction
  française, explication en arabe simple (et forme du présent pour les verbes).
- **Parcours d'une leçon** :
  0. **تسخين / Échauffement** — révision espacée de mots des leçons précédentes.
  1. **الاكتشاف / Découverte** — flashcards (recto : mot vocalisé + audio ;
     verso : translittération + traduction).
  2. **بناء الجمل / Construire des phrases** — une phrase par catégorie ; les
     mots de la leçon sont détectés et surlignés, **avec ou sans voyelles**,
     même conjugués (يَكْتُبُ, سَعِيدَة…).
  3. **اربط بذكرى / Associer à un souvenir** — sauvegardé dans « ذاكرتي ».
  4. **اقرأ الفقرة / Lire le paragraphe** — paragraphe arabe vocalisé de 7
     phrases généré côté client (gabarits grammaticaux, aucune IA).
  5. **تدرّب في الحياة / Pratiquer** — raconter sa journée à un proche.
- **Gamification** : XP, 6 grades bilingues (مبتدئ Débutant → سيّد الكلمات
  Maître des mots) avec confettis, série 🔥 + record, 8 badges, cadeau du jour
  (vidéo/podcast réel, devinette arabe ou fun fact) avec effet d'ouverture.
- **Bouton « حَ »** pour afficher / masquer les harakât partout
  (badge spécial si tu termines une leçon sans voyelles 🌙).
- **كلماتي / Mes mots** : tous les mots appris, filtrables par catégorie,
  recherche en arabe (sans voyelles), en translittération ou en français, audio.
- **Audio** via `speechSynthesis` (voix arabe). Si aucune voix arabe n'est
  installée, un message doux s'affiche — jamais d'erreur.
- Thème clair / sombre / auto, réinitialisation des données avec confirmation.

## 🧱 Stack

React 18 + Vite + TypeScript, Tailwind CSS (propriétés logiques `start/end`,
variantes `rtl:`), Framer Motion, lucide-react, canvas-confetti,
react-router-dom. Polices Google : Noto Naskh Arabic (contenu), Tajawal
(interface arabe), Nunito (interface française).

## 📂 Structure du projet

```
public/
  manifest.json       manifeste PWA
  sw.js               service worker (cache hors-ligne)
  favicon.svg
  icons/              icônes PWA 192/512 (+ maskable, apple-touch)
scripts/
  generate-icons.mjs  régénère les icônes PNG (npm run icons)
src/
  data/               wordbank.js, gifts.js (contenu) + déclarations .d.ts
  i18n/               fr.ts, ar.ts (textes d'interface), index.ts
  types/              types TypeScript partagés
  constants/          grades, badges, étapes, catégories
  services/           arabic (normalisation, détection, surlignage),
                      paragraph, speech, storage, date, confetti…
  hooks/              useLang, useHarakat, useTheme, useProgress,
                      useLesson, useLocalStorage
  context/            PreferencesContext (langue/RTL, voyelles, thème),
                      ProgressContext (progression + logique métier)
  components/
    ui/               Button, Card, Pill, ProgressBar, ArabicText,
                      SpeakButton, Toast, CategoryTitle, Ornament
    layout/           AppShell, Header, BottomNav, LanguageSwitch,
                      HarakatToggle, ThemeToggle, GlobalCelebrations,
                      SpeechNotice
    dashboard/        TodayCard, RankCard, StreakCard, BadgesGrid
    lesson/           WarmupStep, Flashcard, DiscoverStep,
                      BuildSentencesStep, MemoryStep, ReadParagraphStep,
                      PracticeStep, LessonCompleteScreen, GiftCard,
                      StepProgressHeader, WordMeaning
  pages/              Onboarding, Dashboard, Lesson, MyWords,
                      MemoryPalace, Settings, NotFound
```

## 🚀 Lancer en local

Prérequis : Node.js 18 ou plus récent.

```bash
npm install
npm run dev
```

Ouvre l'URL affichée (par défaut http://localhost:5173).

Build de production (vérifie aussi les types) et prévisualisation :

```bash
npm run build
npm run preview
```

> Le service worker (mode hors-ligne) n'est actif qu'en production
> (`npm run build` + `npm run preview`, ou sur Vercel), pas avec `npm run dev`.

## ☁️ Déployer sur Vercel

1. Pousse le projet sur un dépôt GitHub.
2. Sur [vercel.com](https://vercel.com) : **Add New → Project**, importe le dépôt.
3. **Nom du projet : en minuscules uniquement** (lettres, chiffres, tirets),
   par exemple `kalimati-arabic`. Vercel refuse les majuscules, et ce nom
   devient l'adresse du site : `kalimati-arabic.vercel.app`.
4. Vercel détecte Vite automatiquement (`vercel.json` fourni) :
   - Build Command : `npm run build`
   - Output Directory : `dist`
5. Clique **Deploy**. Chaque nouveau push sur GitHub redéploie le site.

Ou avec la CLI :

```bash
npm install -g vercel
vercel --prod
```

## 📱 Installer sur Android (PWA)

1. Ouvre le site dans **Chrome** sur Android.
2. Menu **⋮ → « Installer l'application »** (ou « Ajouter à l'écran d'accueil »).
3. Kalimati s'ouvre en plein écran comme une app, et fonctionne **hors-ligne**
   une fois visitée (les mots, la progression et les polices sont en cache).

## 💾 Contenu

- `src/data/wordbank.js` — 65 verbes, 60 adjectifs, 32 mots de liaison,
  60 expressions → **13 leçons** assemblées par `buildLessons()`. Les mots
  de liaison, moins nombreux, sont réutilisés en rotation (révision espacée).
  Pour ajouter des mots, ajoute des lignes dans les listes : les leçons se
  recalculent toutes seules.
- `src/data/gifts.js` — vidéos/podcasts/sites réels pour débutants,
  devinettes arabes et fun facts ; `giftForDay(n)` en tire un par jour.
  Vérifie les liens de temps en temps (les URL de chaînes changent parfois).

## 🔒 Confidentialité

Aucune donnée ne quitte le navigateur. Tout est stocké dans `localStorage`
sous le préfixe `kalimati:`. **Réglages → Réinitialiser toutes mes données**
efface la progression (après confirmation) en conservant tes préférences
d'affichage.
