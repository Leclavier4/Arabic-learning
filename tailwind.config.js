/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Interface : Baloo 2 (latin, rond et amical) + Baloo Bhaijaan 2 (même famille, en arabe).
        sans: ["'Baloo 2'", "'Baloo Bhaijaan 2'", "Nunito", "ui-rounded", "system-ui", "sans-serif"],
        // Contenu arabe à apprendre : police ronde pour enfants, harakât bien lisibles.
        arabic: ["'Baloo Bhaijaan 2'", "'Noto Naskh Arabic'", "Tajawal", "sans-serif"],
      },
      colors: {
        // Univers « désert & oasis » : gai mais doux pour les yeux.
        cream: "#FFFAF0",
        oasis: {
          50: "#ECFAF8",
          100: "#CFF3EE",
          200: "#A2E6DE",
          300: "#6FD3C8",
          400: "#35B9AC",
          500: "#1C8C82",
          600: "#167469",
          700: "#115A52",
        },
        sand: {
          50: "#FFF9EE",
          100: "#FCEFD6",
          200: "#F8DFB0",
          300: "#F1C985",
          400: "#E5AE5C",
          500: "#C98E3E",
          600: "#A06F2C",
        },
        coral: {
          100: "#FFE4DE",
          200: "#FFC6B8",
          300: "#FF9C85",
          400: "#F57A5F",
          500: "#D9583A",
        },
        sun: {
          100: "#FFF7D6",
          200: "#FFEFB0",
          300: "#FFE07A",
          400: "#FFCC3D",
          500: "#E8AE00",
          600: "#B98A00",
        },
        gold: {
          200: "#F6E3A6",
          300: "#EBCB6B",
          400: "#D4AA3A",
          500: "#A88534",
        },
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      boxShadow: {
        soft: "0 6px 24px -8px rgba(160, 111, 44, 0.25), 0 2px 8px -2px rgba(160, 111, 44, 0.10)",
        softer: "0 3px 14px -4px rgba(160, 111, 44, 0.18)",
      },
    },
  },
  plugins: [],
};
