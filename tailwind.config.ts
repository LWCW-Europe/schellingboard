import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      roboto: ["var(--font-roboto)", ...defaultTheme.fontFamily.sans],
      monteserrat: ["var(--font-monteserrat)", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // Session cards span one grid row per slot; a 24h day of 15-minute
      // slots needs up to 96. Must stay in sync with class-constants.tsx.
      gridRow: Object.fromEntries(
        Array.from({ length: 96 - 12 }, (_, i) => {
          const n = i + 13;
          return [`span-${n}`, `span ${n} / span ${n}`];
        })
      ),
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
