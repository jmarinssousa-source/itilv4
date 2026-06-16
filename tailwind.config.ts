import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f2742",
        ocean: "#16466f",
        mist: "#f3f6f8",
        success: "#16834a",
        danger: "#c93131"
      }
    }
  },
  plugins: []
};

export default config;
