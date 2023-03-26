import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { configDefaults } from "vitest/config";

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
      inline: [/solid-js/, /@solidjs\/testing-library/],
    },
    coverage: {
      reporter: ["text", "json", "html"],
    },
    exclude: [...configDefaults.exclude, "**/browser-test-runner/**"],
  },
  resolve: {
    conditions: ["development", "browser"],
  },
});
