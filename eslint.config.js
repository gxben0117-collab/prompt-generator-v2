import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: [
      "**/*",
      "!src/**",
      "!tests/**",
      "!scripts/create_standalone_html.mjs",
      "!scripts/prepare-vite-entry.mjs",
      "!scripts/sync-core-spec-module.mjs",
      "!scripts/verify-ui.mjs",
      "dist/**",
      "coverage/**",
      "node_modules/**",
    ],
  },
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        Blob: "readonly",
        FormData: "readonly",
        URL: "readonly",
        setTimeout: "readonly",
      },
    },
  },
  {
    files: [
      "tests/**/*.js",
      "scripts/create_standalone_html.mjs",
      "scripts/prepare-vite-entry.mjs",
      "scripts/sync-core-spec-module.mjs",
      "scripts/verify-ui.mjs",
    ],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
];
