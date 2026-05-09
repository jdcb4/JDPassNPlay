import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Must match the repository name segment in the GitHub Pages URL (case-sensitive).
  // Repo: github.com/jdcb4/JDPassNPlay → https://jdcb4.github.io/JDPassNPlay/
  base: mode === "github-pages" ? "/JDPassNPlay/" : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
}));
