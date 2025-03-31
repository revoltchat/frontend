import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import solid from "eslint-plugin-solid/configs/typescript";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      // minified files
      "**/i18n/catalogs/**",
      "**/i18n/locales/**",

      // build artifacts
      "**/coverage/**",
      "**/dist/**",
      "**/styled-system/**",
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  solid,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          caughtErrors: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  prettier,
]);
