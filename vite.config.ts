/// <reference types="vitest" />
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import webfontDownload from "vite-plugin-webfont-dl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), webfontDownload(), svgLoader()],
  optimizeDeps: {
    exclude: ["vue-demi"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "commitlint.config.js",
        ".eslintrc.cjs",
        "vite-env.d.ts",
        "src/main.ts",
      ],
    },
    exclude: [...configDefaults.exclude, "e2e/*"],
  },
});
