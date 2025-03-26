import { defineConfig } from "@lingui/cli";
import { LinguiConfig } from "@lingui/conf";
import extractor from "@lingui-solid/babel-plugin-extract-messages/extractor";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en"],
  catalogs: [
    {
      path: "<rootDir>/components/i18n/catalogs/{locale}/messages",
      include: ["src", "components"],
      exclude: ["**/node_modules/**", "**/i18n/**"],
    },
  ],
  macro: {
    corePackage: ["@lingui-solid/solid"],
    jsxPackage: ["@lingui-solid/solid/macro"],
  },
  runtimeConfigModule: {
    Trans: ["@lingui-solid/solid", "Trans"],
    useLingui: ["@lingui-solid/solid", "useLingui"],
    extractors: [extractor],
  },
} as LinguiConfig);
