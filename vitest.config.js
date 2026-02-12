import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [
      "node_modules/**",
      "dist/**",
      ".nuxt/**",
      ".output/**",
      "tests/**",
      "test/e2e-playwright/**",
      "test/templates/**",
      "**/*.spec.{js,ts}" // Playwright uses .spec.js, vitest uses .test.js
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "test/**",
        "**/*.config.{js,ts}",
        "**/*.spec.{js,ts}",
        "**/*.test.{js,ts}"
      ]
    },
  },
  resolve: {
    alias: {
      "~": resolve(__dirname),
      "@": resolve(__dirname),
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
});
