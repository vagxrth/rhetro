import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        white: {
          1: "#FFFFFF",
          2: "rgba(255, 255, 255, 0.72)",
          3: "rgba(255, 255, 255, 0.4)",
          4: "rgba(255, 255, 255, 0.64)",
          5: "rgba(255, 255, 255, 0.80)",
        },
        black: {
          1: "#1E1E1F",
          2: "#2D2D2E",
          3: "#252526",
          4: "#323233",
          5: "#3A3A3B",
          6: "#2A2A2B",
        },
        purple: {
          1: "#7225D8",
          2: "#8B3FE8",
          3: "#5E1DB3",
          4: "rgba(114, 37, 216, 0.2)",
          5: "rgba(114, 37, 216, 0.1)",
        },
        gray: {
          1: "#8E8E93",
          2: "#636366",
          3: "#48484A",
        },
      },
      fontFamily: {
        sf: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'sans-serif'],
      },
      backgroundImage: {
        "nav-focus":
          "linear-gradient(270deg, rgba(114, 37, 216, 0.15) 0%, rgba(114, 37, 216, 0.00) 100%)",
        "gradient-purple": "linear-gradient(135deg, #7225D8 0%, #5E1DB3 100%)",
        "gradient-card": "linear-gradient(180deg, rgba(37, 37, 38, 0) 0%, rgba(37, 37, 38, 0.9) 100%)",
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'player': '0 -4px 20px rgba(0, 0, 0, 0.4)',
        'button': '0 2px 10px rgba(114, 37, 216, 0.4)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
      },
      borderRadius: {
        'apple': '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;