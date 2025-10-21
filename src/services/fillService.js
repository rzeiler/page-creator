// fillService.js
(function () {
  const colors = [
    "#f4a460",
    "#8b4513",
    "#ff595e",
    "#ffca3a",
    "#8ac926",
    "#1982c4",
    "#6a4c93",
    "#ffffff",
    "#000000",
  ];
  let menu = null;
  let currentTarget = null;

  // Menü erstellen (einmalig)
  function createMenu() {
    menu = document.createElement("div");
    menu.style.position = "fixed";
    menu.style.display = "none";
    menu.style.background = "#fff";
    menu.style.border = "1px solid #ccc";
    menu.style.borderRadius = "8px";
    menu.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
    menu.style.padding = "6px";
    menu.style.zIndex = "9999";
    menu.style.userSelect = "none";

    // Farbbuttons
    colors.forEach((c) => {
      const swatch = document.createElement("div");
      swatch.style.width = "24px";
      swatch.style.height = "24px";
      swatch.style.borderRadius = "4px";
      swatch.style.background = c;
      swatch.style.display = "inline-block";
      swatch.style.margin = "4px";
      swatch.style.cursor = "pointer";
      swatch.title = c;
      swatch.addEventListener("click", () => applyColor(c));
      menu.appendChild(swatch);
    });

    document.body.appendChild(menu);
  }

  // Farbe anwenden
  function applyColor(color) {
    if (currentTarget) {
      currentTarget.setAttribute("fill", color);
      const event = new CustomEvent("filled", {
        detail: { element: currentTarget, color },
      });
      window.dispatchEvent(event);
    }
    hideMenu();
  }

  // Menü anzeigen
  function showMenu(x, y) {
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.display = "block";
  }

  // Menü ausblenden
  function hideMenu() {
    menu.style.display = "none";
    currentTarget = null;
  }

  // Kontextmenü-Handler
  window.addEventListener("contextmenu", (e) => {
    const target = e.target.closest("[allowFill]");
    if (!target) return;

    e.preventDefault();
    currentTarget = target;
    showMenu(e.clientX, e.clientY);
  });

  // Klick außerhalb schließt Menü
  window.addEventListener("click", (e) => {
    if (menu && !menu.contains(e.target)) hideMenu();
  });

  // Rechtsklick außerhalb des Menüs schließt es ebenfalls
  window.addEventListener("contextmenu", (e) => {
    if (
      menu &&
      menu.style.display === "block" &&
      !menu.contains(e.target.closest("div"))
    ) {
      if (!e.target.closest("[allowFill]")) hideMenu();
    }
  });

  // Initialisierung beim Laden
  createMenu();
})();
