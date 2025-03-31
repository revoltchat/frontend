import extractor from "@lingui-solid/babel-plugin-extract-messages/extractor";
import { defineConfig } from "@lingui/cli";
import { LinguiConfig } from "@lingui/conf";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "dev"],
  catalogs: [
    {
      path: "<rootDir>/components/i18n/catalogs/{locale}/messages",
      include: ["src", "components"],
      exclude: ["**/node_modules/**", "**/i18n/locales/**"],
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
