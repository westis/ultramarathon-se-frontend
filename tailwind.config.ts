import type { Config } from "tailwindcss";

export default {
  darkMode: "class", // Enable dark mode
  content: ["./src/**/*.{html,js,ts,vue}"],
  theme: {
    extend: {
      colors: {
        ultra: {
          primary: {
            100: "#fae7e9",
            200: "#f1b8be",
            300: "#e78993",
            400: "#de5a67",
            500: "#d42b3c",
            600: "#a5212f",
            700: "#761821",
            800: "#470e14",
            900: "#1C0408",
          },
          secondary: {
            100: "#eaeef7",
            200: "#c1cce8",
            300: "#97aad9",
            400: "#6e88ca",
            500: "#4566ba",
            600: "#354f91",
            700: "#263968",
            800: "#17223e",
            900: "#080b15",
          },
          tertiary: {
            100: "#eff7ea",
            200: "#cfe8c1",
            300: "#afd997",
            400: "#8fca6d",
            500: "#6fbb44",
            600: "#579235",
            700: "#3e6826",
            800: "#253e17",
            900: "#0c1508",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
