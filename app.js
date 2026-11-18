const STORAGE_KEY = "liste-courses-v1";

const form = document.querySelector("#add-form");
const input = document.querySelector("#item-input");
const list = document.querySelector("#items");
const sendButton = document.querySelector("#send-button");

let items = loadItems();

function loadItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter(item => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  list.replaceChildren(...items.map(item => {
    const row = document.createElement("li");

    const label = document.createElement("span");
    label.className = "item-label";
    label.textContent = item;

    const removeButton = document.createElement("button");
    removeButton.className = "delete-button";
    removeButton.type = "button";
    removeButton.textContent = "Supprimer";
    removeButton.setAttribute("aria-label", `Supprimer ${item}`);
    removeButton.addEventListener("click", () => {
      const index = items.indexOf(item);
      if (index === -1) return;
      items.splice(index, 1);
      saveAndRender();
    });

    row.append(label, removeButton);
    return row;
  }));
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const item = input.value.trim();
  if (!item) return;
  items.push(item);
  saveAndRender();
  input.value = "";
  input.focus();
});

sendButton.addEventListener("click", () => {
  const message = items.join("\n");
  items = [];
  saveAndRender();

  if (!message) return;
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.location.href = url;
});

saveAndRender();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () =>
    navigator.serviceWorker.register("./service-worker.js").catch(() => {})
  );
}
