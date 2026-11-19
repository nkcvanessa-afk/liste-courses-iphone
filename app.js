const STORAGE_KEY = "liste-courses-v1";

const form = document.querySelector("#add-form");
const input = document.querySelector("#item-input");
const list = document.querySelector("#items");
const sendButton = document.querySelector("#send-button");
const suggestions = document.querySelector("#suggestions");
const CUSTOM_ITEMS_KEY = "liste-courses-custom-items-v1";

const CATALOG = [
  "Pommes", "Oranges", "Clémentines", "Citrons", "Tomates", "Pommes de terre", "Carottes", "Oignons", "Salade verte", "Salade iceberg", "Salade laitue", "Mâche", "Concombre", "Courgettes", "Poivrons", "Champignons", "Brocoli",
  "Lait", "Lait d’avoine", "Lait de soja", "Lait d’amande", "Lait matcha", "Beurre demi-sel", "Crème fraîche", "Crème fraîche végétale", "Yaourts nature", "Yaourt végétal", "Skyr", "Fromage blanc", "Fromage râpé", "Mozzarella râpée", "Emmental", "Mozzarella", "Cheddar", "Brie", "Fromage de chèvre", "Camembert", "Cottage cheese", "Babybel", "Œufs", "Desserts lactés",
  "Poulet", "Steak haché", "Jambon blanc", "Lardons", "Saucisses", "Escalopes de dinde", "Falafels", "Steak végétal", "Nuggets végétaux",
  "Saumon", "Poisson blanc", "Crevettes", "Thon en boîte",
  "Pain", "Pain de mie", "Pain à muffins", "Pâtes", "Riz", "Lentilles", "Pois chiches secs", "Quinoa", "Farine", "Céréales du petit-déjeuner", "Flocons d’avoine", "Biscottes", "Pâte à tarte",
  "Huile d’olive", "Huile de tournesol", "Vinaigre", "Sel", "Poivre", "Épices", "Sucre vanillé", "Levure chimique", "Sucre en poudre", "Sucre en morceaux", "Miel", "Confiture", "Sauce tomate", "Maïs", "Haricots verts", "Petits pois", "Soupe", "Compote", "Nutella", "Beurre de cacahuètes", "Surgelés",
  "Jus d’orange", "Café", "Thé", "Chocolat en tablette", "Soda",
  "Croûtons", "Sauce salade", "Pastilles lave-vaisselle", "Liquide vaisselle", "Éponges", "Sacs-poubelle", "Essuie-tout", "Papier toilette", "Lessive", "Adoucissant", "Nettoyant multi-usages", "Nettoyant pour les sols", "Gel WC", "Nettoyant pour les vitres", "Gel douche", "Shampoing", "Dentifrice", "Brosses à dents", "Déodorant"
];

let items = loadItems();
let customItems = loadCustomItems();

function loadCustomItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOM_ITEMS_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter(item => typeof item === "string") : [];
  } catch { return []; }
}

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();
}

function renderSuggestions() {
  const query = normalize(input.value);
  if (!query) { suggestions.hidden = true; suggestions.replaceChildren(); return; }
  const matches = [...new Map([...CATALOG, ...customItems].map(item => [normalize(item), item])).values()]
    .filter(item => normalize(item).includes(query)).slice(0, 8);
  suggestions.replaceChildren(...matches.map(item => {
    const row = document.createElement("li");
    const option = document.createElement("button");
    option.type = "button";
    option.className = "suggestion-button";
    option.textContent = item;
    option.addEventListener("click", () => { input.value = item; suggestions.hidden = true; input.focus(); });
    row.append(option);
    return row;
  }));
  suggestions.hidden = matches.length === 0;
}

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
  if (![...CATALOG, ...customItems].some(saved => normalize(saved) === normalize(item))) {
    customItems.push(item);
    localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(customItems));
  }
  items.push(item);
  saveAndRender();
  input.value = "";
  renderSuggestions();
  input.focus();
});

input.addEventListener("input", renderSuggestions);
input.addEventListener("keydown", event => { if (event.key === "Escape") suggestions.hidden = true; });

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
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {}));
}
