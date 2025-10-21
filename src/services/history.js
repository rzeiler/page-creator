// === Globaler History-Manager ===
const STORAGE_KEY = "svgActionHistory";
let history = [];
let historyIndex = -1;

function canUndo() {
  return historyIndex > 0;
}

function canRedo() {
  return historyIndex < history.length - 1;
}

function clearHistory() {
  history = [];
  historyIndex = -1;
  localStorage.removeItem(STORAGE_KEY);
  updateHistoryState();
  const startEvent = new CustomEvent("historyChange", {
    detail: historyIndex,
  });
  window.dispatchEvent(startEvent);
}

function loadHistory() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    history = JSON.parse(saved);
    historyIndex = history.length - 1;
  } else {
    history = [];
    historyIndex = -1;
  }

  setTimeout(() => {
    const startEvent = new CustomEvent("historyChange", {
      detail: historyIndex,
    });
    window.dispatchEvent(startEvent);
  }, 500);
}

function saveHistoryToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function recordAction(to) {
  // wenn man "zurück" gegangen ist, Redo-Äste abschneiden
  if (historyIndex < history.length - 1) {
    history = history.slice(0, historyIndex + 1);
  }

  history.push(to);
  historyIndex = history.length - 1;
  saveHistoryToStorage();
  updateHistoryState();
}

function updateHistoryState() {
  const startEvent = new CustomEvent("historyChange", {
    detail: historyIndex,
  });
  window.dispatchEvent(startEvent);
}

function undo() {
  console.log(historyIndex);

  if (historyIndex < 0) return;
  historyIndex--;
  const action = history[historyIndex];

  saveHistoryToStorage();
  updateHistoryState();

  return action;
}

function redo() {
  console.log(historyIndex);

  if (historyIndex >= history.length - 1) return;
  historyIndex++;
  const action = history[historyIndex];

  saveHistoryToStorage();
  updateHistoryState();

  return action;
}

function lastPositions() {
  // Wir merken uns die letzte bekannte Position jedes Objekts
  const lastPositions = {};
  let lastPosition;
  // Wenn es eine History gibt, suchen wir den letzten 'to'-Eintrag je ID
  history.forEach((entry) => {
    lastPositions[entry.id] = entry;
  });

  // Nun wenden wir die Positionen auf alle Objekte an
  for (const id in lastPositions) {
    lastPosition = lastPositions[id];
  }
  return lastPosition;
}

export {
  lastPositions,
  redo,
  undo,
  recordAction,
  loadHistory,
  clearHistory,
  canRedo,
  canUndo,
};
