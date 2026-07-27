import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--accent-color)",
        },
        completed: {
          DEFAULT: "var(--completed-color)",
        },
        progress: {
          DEFAULT: "var(--progress-color)",
        },
        remaining: {
          DEFAULT: "var(--remaining-color)",
        },
        main: {
          DEFAULT: "var(--bg-main)",
        },
        card: {
          DEFAULT: "var(--bg-card)",
        },
        txt: {
          main: "var(--text-main)",
          muted: "var(--text-muted)",
        },
        border: "var(--border-color)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
