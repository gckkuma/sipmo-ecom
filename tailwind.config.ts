import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        // SIPMO brand palette (source of truth: sipmo-tailwind-tokens.js)
        brand: {
          DEFAULT: "#451449",
          hover: "#5E2463",
          deep: "#2C0C30",
          50: "#F4EEF5",
          100: "#E5D5E8",
          200: "#C9A9CF",
          300: "#A578AD",
          400: "#7E4587",
          500: "#5E2463",
          600: "#451449",
          700: "#2C0C30"
        },
        accent: {
          cyan: "#05C0F0",
          green: "#05B57D",
          magenta: "#E30C5A",
          amber: "#F7B509",
          amberSoft: "#FEF1CC"
        },
        sand: "#F3F0EC",
        cream: "#FBFAF8",
        ink: "#231F26",
        stone: "#6B6760",
        // Focus ring / input border, plus standalone semantic states
        "brand-ring": "#E7E2DC",
        warning: "#F59E0B",
        danger: "#DC2626"
      }
    }
  }
};

export default config;
