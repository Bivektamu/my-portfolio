import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  // Vitest globals (describe/it/expect/vi...) for co-located test files.
  {
    files: ["**/*.test.js", "src/test-setup.js", "src/setupTests.js"],
    languageOptions: { globals: globals.vitest },
  },
  globalIgnores([
    ".next/**",
    ".netlify/**",
    "out/**",
    "build/**",
    "node_modules/**",
    "public/**",
    "design-files/**",
  ]),
]);
