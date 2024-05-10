import { applyTailwind } from "./tailwindcss/index.mjs";

const defaultConfig = applyTailwind({
  content: ["./index.html", "./src/**/*.{tsx,ts,css,scss}"],
  safelist: [],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
      },
      boxShadow: {
        "4size1": `rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;`,
      },
    },
  },
  plugins: [],
});

export default defaultConfig;
