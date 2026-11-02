/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Interface : Nunito pour le latin, Tajawal prend le relais pour les glyphes arabes.
        sans: ["Nunito", "Tajawal", "ui-rounded", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        // Contenu arabe à apprendre : Naskh classique, excellent rendu des harakât.
        naskh: ["'Noto Naskh Arabic'", "Amiri", "Tajawal", "serif"],
      },
      colors: {
        // Palette douce inspirée de l'esthétique arabe : sauge, sable, crème, or discret.
        cream: "#FBF8F1",
        sage: {
          50: "#F2F6F1",
          100: "#E3ECE1",
          200: "#C8D9C5",
          300: "#A6C2A2",
          400: "#82A77E",
          500: "#5F8A5B",
          600: "#4A7047",
          700: "#3A5838",
        },
        sand: {
          50: "#FBF6EC",
          100: "#F5EAD5",
          200: "#EBD7B0",
          300: "#DFC089",
          400: "#CFA563",
        },
        gold: {
          200: "#F0DFA8",
          300: "#E3C878",
          400: "#C9A54A",
          500: "#A88534",
        },
        clay: {
          100: "#F7E3DC",
          200: "#EEC4B6",
          300: "#DE9C86",
          400: "#C9775E",
        },
      },
      borderRadius: {
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 4px 24px -6px rgba(74, 112, 71, 0.14), 0 2px 8px -2px rgba(74, 112, 71, 0.08)",
        softer: "0 2px 12px -2px rgba(74, 112, 71, 0.10)",
      },
    },
  },
  plugins: [],
};
