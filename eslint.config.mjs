import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import htmlPlugin from "eslint-plugin-html"; // 추가

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["**/*.html"],
    plugins: { html: htmlPlugin },
    processor: htmlPlugin.processors.html,
  },
  {
    "extends": "stylelint-config-standard"
  }
]);