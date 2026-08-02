import { defineConfig } from "vitest/config";
import path from "path";
import esbuild from "esbuild";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js", "./src/test-setup.js"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    {
      name: "transform-jsx-in-js",
      enforce: "pre",
      transform(code, id) {
        if (
          !id.endsWith(".js") ||
          id.includes("node_modules") ||
          id.includes(".test.") ||
          id.includes("test-setup") ||
          id.includes("setupTests")
        )
          return;

        if (!/<[a-zA-Z]/.test(code)) return;

        try {
          const result = esbuild.transformSync(code, {
            loader: "jsx",
            jsx: "automatic",
            sourcemap: "inline",
            sourcefile: id,
          });
          return { code: result.code, map: result.map };
        } catch (e) {
          return null;
        }
      },
    },
  ],
});
