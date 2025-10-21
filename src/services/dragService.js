// dragService.js
(function () {
  let isMouseDown = false;
  let isDragging = false;
  let lastMouse = { x: 0, y: 0 };
  let currentTranslate = { x: 0, y: 0 };
  let activeElement = null;
  const dragThreshold = 10; // Pixel

  function getCurrentTranslate(target) {
    const initialTransform = (target.getAttribute("transform") || "").replace(
      /\s+/g,
      ""
    );
    const match = initialTransform.match(/translate\(([-\d.]+)[ ,]([-\d.]+)\)/);
    if (match) {
      currentTranslate.x = parseFloat(match[1]);
      currentTranslate.y = parseFloat(match[2]);
    } else {
      currentTranslate.x = 0;
      currentTranslate.y = 0;
    }
  }

  window.addEventListener("mousedown", (e) => {
    // Nur linke Maustaste (0)
    if (e.button !== 0) return;

    const target = e.target.closest("[allowDrag]");
    if (!target) return;

    e.preventDefault();
    isMouseDown = true;
    activeElement = target;
    lastMouse = { x: e.clientX, y: e.clientY };

    getCurrentTranslate(target);
  });

  window.addEventListener("mousemove", (e) => {
    if (!isMouseDown || !activeElement) return;

    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Drag erst starten, wenn Bewegung groß genug
    if (!isDragging && distance < dragThreshold) return;

    // Falls dies der erste „echte“ Drag ist
    if (!isDragging) {
      isDragging = true;
      const startEvent = new CustomEvent("dragstart", {
        detail: { element: activeElement },
      });
      activeElement.dispatchEvent(startEvent);
    }

    const newX = currentTranslate.x + dx;
    const newY = currentTranslate.y + dy;
    activeElement.setAttribute("transform", `translate(${newX}, ${newY})`);
  });

  window.addEventListener("mouseup", (e) => {
    if (isDragging && activeElement) {
      const event = new CustomEvent("dragend", {
        detail: { element: activeElement },
      });
      window.dispatchEvent(event);
    }

    // Reset
    isMouseDown = false;
    isDragging = false;
    activeElement = null;
  });
})();
