import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tet-red": "#D71E1E",
        "tet-gold": "#FFD700",
        "coin-yellow": "#FFC107",
        "cream": "#FFF8E7",
        "primary": "#D4AF37",
        "background-light": "#7B0F0F",
        "background-dark": "#520808",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Roboto'", "sans-serif"],
      },
      backgroundImage: {
        'pattern': "url('https://www.transparenttextures.com/patterns/cubes.png')",
        'clouds': "url('https://www.transparenttextures.com/patterns/foggy-birds.png')",
        'gold-gradient': "linear-gradient(135deg, #FFF59D 0%, #FFD700 50%, #FFA000 100%)",
      },
      boxShadow: {
        'gold-glow': '0 0 30px rgba(255, 215, 0, 0.6)',
        'card': '0 10px 30px rgba(0,0,0,0.5)',
      },
      animation: {
        "wiggle": "wiggle 1s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "float-medium": "float 4s ease-in-out infinite",
        "shine": "shine 1.5s",
        "falling": "falling 10s linear infinite",
        "sway": "sway 3s ease-in-out infinite alternate",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "burst": "burst 1s ease-out forwards",
        "sparkle": "sparkle 2s linear infinite",
        "firework-burst": "firework-burst 2s infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shine: {
          "0%": { left: "-50%", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { left: "100%", opacity: "0" },
        },
        falling: {
          "0%": { top: "-10%" },
          "100%": { top: "110%" },
        },
        sway: {
          "0%": { transform: "translateX(0px) rotate(0deg)" },
          "100%": { transform: "translateX(20px) rotate(45deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(255, 215, 0, 0.7)" },
          "50%": { transform: "scale(1.02)", boxShadow: "0 0 30px 15px rgba(255, 215, 0, 0.2)" },
        },
        burst: {
          "0%": { transform: "scale(0.5) translateY(100px)", opacity: "0" },
          "80%": { transform: "scale(1.1) translateY(-20px)", opacity: "1" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        sparkle: {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "0" },
          "50%": { transform: "scale(1) rotate(180deg)", opacity: "1" },
          "100%": { transform: "scale(0) rotate(360deg)", opacity: "0" },
        },
        "firework-burst": {
          "0%": { transform: "scale(0.1)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        }
      },
    },
  },
  plugins: [],
};
export default config;
