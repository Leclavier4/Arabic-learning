/*
 * Kalimati — service worker léger pour le fonctionnement hors-ligne.
 *
 * - À l'installation : met en cache la coquille (index.html, manifest, icônes)
 *   ET les fichiers JS/CSS référencés par index.html (noms hachés par Vite).
 * - Navigation : réseau d'abord (pour recevoir les mises à jour), cache sinon.
 * - Fichiers statiques et polices Google : cache d'abord, réseau en secours.
 *
 * __BUILD_ID__ est remplacé à chaque build (voir vite.config.ts) : un nouveau
 * déploiement = un nouveau cache, l'ancien est supprimé à l'activation.
 */
const CACHE = "kalimati-__BUILD_ID__";
const SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png",
];

async function precache() {
  const cache = await caches.open(CACHE);
  await cache.addAll(SHELL);
  // Récupère les assets hachés (/assets/…) cités dans index.html.
  try {
    const html = await (await fetch("/index.html", { cache: "no-store" })).text();
    const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
    if (assets.length) await cache.addAll(assets);
  } catch {
    /* hors-ligne pendant l'installation : les assets seront mis en cache au fil de l'eau */
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put("/index.html", response.clone());
    return response;
  } catch {
    return (await cache.match("/index.html")) || (await cache.match("/")) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  // "opaque" (type 0) = réponse cross-origin sans CORS : on la garde aussi pour les polices.
  if (response.ok || response.type === "opaque") cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  const isSameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (isSameOrigin || isFont) {
    event.respondWith(cacheFirst(request));
  }
});
