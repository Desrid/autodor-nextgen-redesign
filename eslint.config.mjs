// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import storybook from "eslint-plugin-storybook";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypeScript,
  ...storybook.configs["flat/recommended"],
  globalIgnores([
    ".next/**",
    "coverage/**",
    "playwright-report/**",
    "storybook-static/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);
