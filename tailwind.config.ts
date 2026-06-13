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
        warm: {
          50: "#fef7ee",
          100: "#fdedd3",
          200: "#f9d8a5",
          300: "#f5bb6d",
          400: "#ef9532",
          500: "#eb7a10",
          600: "#d66106",
          700: "#b24908",
          800: "#8e390d",
          900: "#73310e",
        },
      },
    },
  },
  plugins: [],
};
export default config;