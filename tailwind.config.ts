import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { purple: "#7C3AED", pink: "#DB2777", dark: "#0F0F0F", surface: "#1A1A1A", border: "#2A2A2A" },
      },
    },
  },
  plugins: [],
};
export default config;
