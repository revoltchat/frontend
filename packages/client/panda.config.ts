import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      keyframes: {
        scrimFadeIn: {
          "0%": {
            background: "transparent",
          },
          "100%": {
            background: "rgba(0, 0, 0, 0.6)",
          },
        },
        slideIn: {
          "0%": {
            transform: "translateY(var(--translateY))",
          },
          "100%": {
            transform: "translateY(0px)",
          },
        },
        highlightMessage: {
          "0%": {
            background: "transparent",
          },
          "5%": {
            background: "var(--md-sys-color-primary-container)",
          },
          "95%": {
            background: "var(--md-sys-color-primary-container)",
          },
          "100%": {
            background: "transparent",
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",

  // Enable jsx code gen
  jsxFramework: "solid",

  // Use template style
  // syntax: "template-literal",
});
