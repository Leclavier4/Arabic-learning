import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Injecte un identifiant de build unique dans dist/sw.js.
 * Chaque déploiement produit ainsi un service worker différent : le navigateur
 * l'installe, met en cache les nouveaux fichiers et supprime l'ancien cache.
 */
function serviceWorkerVersion(): Plugin {
  let outDir = "dist";
  return {
    name: "kalimati-sw-version",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const swPath = resolve(outDir, "sw.js");
      if (!existsSync(swPath)) return;
      const source = readFileSync(swPath, "utf-8");
      writeFileSync(swPath, source.replace(/__BUILD_ID__/g, Date.now().toString(36)));
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), serviceWorkerVersion()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
