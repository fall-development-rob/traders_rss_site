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
        // Financial theme colors
        'fin-navy': '#0a1628',
        'fin-slate': '#1e293b',
        'fin-gold': '#f59e0b',
        'fin-green': '#10b981',
        'fin-red': '#ef4444',
        'fin-gold-light': '#fbbf24',
        'fin-green-light': '#34d399',
        'fin-red-light': '#f87171',
      },
    },
  },
  plugins: [],
} satisfies Config;
