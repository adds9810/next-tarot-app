import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ["var(--font-title)", "cursive"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderColor: {
        border: "hsl(var(--border))",
        destructive: "hsl(var(--destructive))",
      },
      textColor: {
        "destructive-foreground": "hsl(var(--destructive-foreground))",
      },
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(0, 100%, 50%)",
          foreground: "hsl(0, 100%, 100%)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        twinkle: {
          "0%": {
            opacity: "0",
            transform: "scale(0.4)",
            filter: "blur(1px)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.2)",
            filter: "blur(0px)",
          },
          "100%": {
            opacity: "0",
            transform: "scale(0.4)",
            filter: "blur(1px)",
          },
        },
      },
      animation: {
        twinkle:
          "twinkle var(--twinkle-duration, 3s) cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
