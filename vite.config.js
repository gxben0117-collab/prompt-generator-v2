import { defineConfig } from "vite";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 800,
  },
  test: {
    testTimeout: 60000,
  },
});
