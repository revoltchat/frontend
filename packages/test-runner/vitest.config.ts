import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
  },
  test: {
    globals: true,
    environment: "jsdom",
    transformMode: {
      web: [/\.jsx?$/],
    },
    setupFiles: "./packages/test-runner/setupVitest.js",
    deps: {
      inline: [/solid-js/, /solid-testing-library/],
    },
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
  resolve: {
    conditions: ["development", "browser"],
  },
});
