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
    row.textContent = item;
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
  // Required behavior: clear local data immediately when the app's Send button is tapped.
  items = [];
  saveAndRender();

  if (!message) return;
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.location.href = url;
});

saveAndRender();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {}));
}
