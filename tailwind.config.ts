import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 暗红 — 强调色
        "roman-red": {
          50: "#fef2f2",
          100: "#fde3e3",
          200: "#fbcbcb",
          300: "#f7a6a6",
          400: "#f07474",
          500: "#e54848",
          600: "#cf2c2c",
          700: "#8B0000", // 主色
          800: "#7a0000",
          900: "#5c0000",
        },
        // 古铜绿 — 辅助强调
        "bronze": {
          50: "#f4f7f5",
          100: "#e4ebe6",
          200: "#cad7cd",
          300: "#a9bcad",
          400: "#849e88",
          500: "#5F7D6B", // 主色
          600: "#4d6657",
          700: "#3e5245",
          800: "#33423a",
          900: "#2b3730",
        },
        // 大理石 / 石头色
        "marble": {
          50: "#fafaf9",
          100: "#f5f0eb",
          200: "#e8e0d6",
          300: "#d6c9b9",
          400: "#c0ad98",
          500: "#ad9580",
          600: "#9c826d",
          700: "#826b5b",
          800: "#6b584e",
          900: "#2C2C2C", // 主文字色
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
    },
  },
  plugins: [],
};
export default config;