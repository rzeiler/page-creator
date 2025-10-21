export function useFileService() {
  const supportsFileSystemAccess = "showSaveFilePicker" in window;

  /**
   * Speichert eine Textdatei (z. B. SVG) lokal
   * @param {string} content - Dateiinhalte
   * @param {string} filename - Dateiname
   */
  async function saveFile(content, filename = "file.svg") {
    try {
      // 🧭 Sicherstellen, dass content ein String ist
      if (typeof content !== "string") {
        if (content instanceof Element) {
          content = content.outerHTML;
        } else if (content && content.toString) {
          content = content.toString();
        } else {
          throw new Error("Ungültiger Inhaltstyp beim Speichern.");
        }
      }

      if (supportsFileSystemAccess) {
        // 🧩 Modern: File System Access API
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: "SVG Datei",
              accept: { "image/svg+xml": [".svg"] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
      } else {
        // 🪶 Fallback: Blob + a[href=download]
        const blob = new Blob([content], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }

      const event = new CustomEvent("saved", {
        detail: { text: "✅ Datei gespeichert", name: filename },
      });
      window.dispatchEvent(event);

      console.log("✅ Datei gespeichert:", filename);
    } catch (err) {
      console.warn("❌ Speichern abgebrochen oder Fehler:", err);
    }
  }

  /**
   * Öffnet und liest eine Datei (z. B. SVG)
   * @returns {Promise<string|null>}
   */
  async function openFile() {
    try {
      if (supportsFileSystemAccess) {
        // 🧩 Modern: File System Access API
        const [fileHandle] = await window.showOpenFilePicker({
          types: [
            {
              description: "SVG Datei",
              accept: { "image/svg+xml": [".svg"] },
            },
          ],
          multiple: false,
        });
        const file = await fileHandle.getFile();
        return await file.text();
      } else {
        // 🪶 Fallback: input[type=file]
        return new Promise((resolve) => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".svg";
          input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return resolve(null);
            const text = await file.text();
            resolve(text);
          };
          input.click();
        });
      }
    } catch (err) {
      console.warn("❌ Öffnen abgebrochen oder Fehler:", err);
      return null;
    }
  }

  return {
    saveFile,
    openFile,
  };
}
