const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

// Délégation sur document : le footer est remplacé à chaque navigation (transitions.js)
document.addEventListener("click", (event) => {
  const button = event.target.closest(".theme-toggle");
  if (!button) return;

  const root = document.documentElement;
  const current =
    root.dataset.theme || (systemDark.matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  const systemTheme = systemDark.matches ? "dark" : "light";

  try {
    if (next === systemTheme) {
      // Retour au thème système : plus besoin de forcer
      delete root.dataset.theme;
      localStorage.removeItem("theme");
    } else {
      root.dataset.theme = next;
      localStorage.setItem("theme", next);
    }
  } catch {
    root.dataset.theme = next;
  }
});

// Si l'OS change de thème pendant qu'on suit le système, rien à faire :
// le CSS s'en charge. On nettoie juste une préférence devenue redondante.
systemDark.addEventListener("change", (event) => {
  const stored = localStorage.getItem("theme");
  if (stored && stored === (event.matches ? "dark" : "light")) {
    localStorage.removeItem("theme");
    delete document.documentElement.dataset.theme;
  }
});
