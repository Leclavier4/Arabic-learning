# كلماتي · Kalimati

Apprends **20 mots d'arabe par jour** en jouant avec **Fenek (فَنَك)**, un
petit fennec du désert : flashcards vocalisées, phrases que tu écris
toi-même, souvenirs personnels, lecture à voix haute, carte-parcours façon
Duolingo, étoiles, coffre au trésor et album d'autocollants. Pensé pour les
enfants (et agréable pour tous), mobile-first, installable comme une vraie
app (PWA) et utilisable hors-ligne.

Aucun backend, aucune base de données, aucun compte : tout est sauvegardé
dans le `localStorage` du navigateur.

## 🎮 Mode jeu

- **Fenek, la mascotte** : fennec dessiné en SVG inline et animé avec Framer
  Motion (poses `idle`, `wave`, `cheer`, `think`, `sleep`, `celebrate`).
  Présente sur chaque écran, avec des bulles bilingues qui varient. Elle
  encourage, félicite, fait la fête aux montées de grade et dort une fois la
  leçon du jour finie. Elle regarde vers la droite en français et vers la
  gauche en arabe. Touche-la, elle te répond !
- **Carte-parcours** : les leçons sont des nœuds sur le chemin de l'oasis
  (terminé ✓, aujourd'hui ⭐ qui pulse, futur 🔒) avec palmiers, oasis et
  dunes. Fenek marche jusqu'au nœud du jour.
- **HUD** toujours visible : grade, barre d'XP, série 🔥, étoiles ⭐, langue,
  voyelles (حَ) et bouton son. Les gains d'XP et d'étoiles s'envolent en « +N ».
- **Leçon en « pas de pierre »** : Fenek saute de pierre en pierre à chaque
  étape validée. Chaque nouvelle flashcard rapporte une étoile.
- **Coffre au trésor** de fin de journée qui s'ouvre sur le cadeau du jour.
- **مجموعتي / Ma collection** : album d'autocollants (badges et grades).
- **Sons** générés à la volée (Web Audio, aucun fichier), bouton muet,
  option **« Réduire les animations »**. Feedback toujours positif.
- Pour renommer la mascotte ou changer les récompenses en étoiles, modifie
  `src/config/game.ts`.

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
- **Gamification** : XP, 6 grades bilingues (فَنَكٌ صَغِير Petit fennec →
  سُلْطَانُ الكَلِمَات Sultan des mots) avec confettis, série 🔥 + record,
  étoiles, 8 badges, cadeau du jour (vidéo/podcast réel, devinette arabe ou
  fun fact) dans un coffre au trésor.
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
react-router-dom. Polices Google rondes : Baloo 2 (latin) et Baloo
Bhaijaan 2 (arabe, harakât lisibles), avec Noto Naskh Arabic en secours.
Mascotte, décor, coffre et sons sont générés en SVG/Web Audio : aucun
fichier externe.

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
  config/             game.ts (nom de la mascotte, récompenses en étoiles)
  data/               wordbank.js, gifts.js (contenu) + déclarations .d.ts
  i18n/               fr.ts, ar.ts (textes d'interface), index.ts
  types/              types TypeScript partagés
  constants/          grades, badges, étapes, catégories
  services/           arabic (normalisation, détection, surlignage),
                      paragraph, speech, sound (effets Web Audio),
                      storage, date, confetti…
  hooks/              useLang, useHarakat, useTheme, useProgress,
                      useLesson, useMascot, useLocalStorage
  context/            PreferencesContext (langue/RTL, voyelles, thème,
                      sons, animations réduites), MascotContext (réactions
                      de la mascotte), ProgressContext (progression, XP, étoiles)
  components/
    mascot/           Fennec (SVG animé), Mascot (+ bulle), SpeechBubble,
                      PageMascot
    game/             GameHud, PathMap, MapDecor, StepStones,
                      TreasureChest, StarBurst, DesertBackdrop
    ui/               Button (« jelly »), Card, Pill, ArabicText,
                      SpeakButton, Toast, CategoryTitle, Ornament
    layout/           AppShell, BottomNav, LanguageSwitch, HarakatToggle,
                      ThemeToggle, GlobalCelebrations, SpeechNotice
    lesson/           WarmupStep, Flashcard, DiscoverStep,
                      BuildSentencesStep, MemoryStep, ReadParagraphStep,
                      PracticeStep, LessonCompleteScreen, GiftCard (coffre),
                      WordMeaning
  pages/              Onboarding, Dashboard (carte), Lesson, MyWords,
                      Collection, MemoryPalace, Settings, NotFound
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
