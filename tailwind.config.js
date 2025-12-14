/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
      },
      animation: {
        "ai-pulse": "ai-pulse 2s ease-in-out infinite",
        "ai-glow": "ai-glow 2s ease-in-out infinite",
        "ai-spin": "ai-spin 3s linear infinite",
        "ai-spin-fast": "ai-spin 2s linear infinite",
        "ai-spin-reverse": "ai-spin-reverse 2.5s linear infinite",
        "ai-spin-slow": "ai-spin 4s linear infinite",
        "ai-spin-reverse-slow": "ai-spin-reverse 3.5s linear infinite",
        "ai-twinkle": "ai-twinkle 1.5s ease-in-out infinite",
        "ai-twinkle-delay": "ai-twinkle 1.5s ease-in-out infinite 0.5s",
        "ai-twinkle-delay-2": "ai-twinkle 1.5s ease-in-out infinite 1s",
        "ai-float": "ai-float 3s ease-in-out infinite",
        "ai-float-delay": "ai-float 3s ease-in-out infinite 1.5s",
        "ai-shimmer": "ai-shimmer 2s linear infinite",
        "ai-bounce-sparkle": "ai-bounce-sparkle 1s ease-in-out infinite",
        "ai-particle": "ai-particle 2s ease-out infinite",
        "ai-particle-delay": "ai-particle 2s ease-out infinite 0.5s",
        "ai-particle-delay-2": "ai-particle 2s ease-out infinite 1s",
        "ai-particle-delay-3": "ai-particle 2s ease-out infinite 1.5s",
      },
      keyframes: {
        "ai-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.15)", opacity: "0.9" },
        },
        "ai-glow": {
          "0%, 100%": { filter: "drop-shadow(0 0 8px rgba(250, 204, 21, 0.4))" },
          "50%": { filter: "drop-shadow(0 0 20px rgba(250, 204, 21, 0.8))" },
        },
        "ai-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "ai-spin-reverse": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "ai-twinkle": {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.6)" },
          "50%": { opacity: "1", transform: "scale(1.3)" },
        },
        "ai-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "ai-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "ai-bounce-sparkle": {
          "0%, 100%": { transform: "scale(1) rotate(0deg)" },
          "25%": { transform: "scale(1.2) rotate(10deg)" },
          "50%": { transform: "scale(0.9) rotate(-5deg)" },
          "75%": { transform: "scale(1.1) rotate(5deg)" },
        },
        "ai-particle": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-40px) scale(0)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
