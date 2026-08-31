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
    // Legacy CRA migration files — do not lint (see AGENTS.md "Legacy CRA files").
    "src/App.js",
    "src/App.css",
    "src/index.js",
    "src/index.css",
    "src/setupTests.js",
    "src/reportWebVitals.js",
    "src/context/**",
    "src/styles/**",
    "src/components/Blob.jsx",
    "src/components/Header.js",
    "src/components/NavItem.js",
    "src/components/ProjectCard.js",
    "src/components/about.js",
    "src/components/banner.js",
    "src/components/contact.js",
    "src/components/customCursor.js",
    "src/components/index.js",
    "src/components/layout.js",
    "src/components/project.js",
    "src/components/seo.js",
    "src/components/skill.js",
    "src/components/hooks/useScrollSpy.js",
    "src/components/ui/**",
  ]),
]);
