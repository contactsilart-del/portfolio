import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Thème sombre "SILART" — palette portée du design Jack 3D Creator
        nuit: "#0C0C0C", // fond
        surface: "#141417", // cartes
        clair: "#D7E2EA", // texte principal (bleu acier clair)
        doux: "#96A0A8", // texte secondaire
        accent: "#BBCCD7", // accents (haut du dégradé titres)
      },
      fontFamily: {
        sans: ["var(--font-kanit)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
