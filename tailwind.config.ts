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
        iasc: {
          orange: "#f16137",
          green: "#78865c",
          offwhite: "#fcfcfc",
          slate: "#2d2d2d",
        },
      },
    },
  },
  plugins: [],
};
export default config;