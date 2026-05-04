import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        brand: "0 4px 24px -4px rgba(99, 102, 241, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.6) inset",
        "brand-lg":
          "0 20px 50px -20px rgba(99, 102, 241, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.5) inset",
        float: "0 8px 32px -8px rgba(15, 10, 30, 0.2)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "nav-shine":
          "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 40%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
