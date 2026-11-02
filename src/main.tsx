import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { PreferencesProvider } from "./context/PreferencesContext";
import { ProgressProvider } from "./context/ProgressContext";
import "./index.css";

// HashRouter : aucune config serveur nécessaire au déploiement (Vercel statique, PWA hors-ligne).
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <PreferencesProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </PreferencesProvider>
    </HashRouter>
  </React.StrictMode>
);

// Service worker (PWA hors-ligne) — uniquement en production pour ne pas gêner le dev.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* l'app fonctionne aussi sans service worker */
    });
  });
}
