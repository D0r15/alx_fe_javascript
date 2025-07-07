const SERVER_URL = 'https://run.mocky.io/v3/your-mock-id'; // Replace with real mock URL
const SYNC_INTERVAL = 30000;
let quotes = [];

window.onload = () => {
  loadQuotes();
  populateCategories();
  filterQuotes();
  restoreLastFilter();
  setInterval(syncWithServer, SYNC_INTERVAL);
};

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : [];
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  displayQuotes(random ? [random] : []);
}

function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !category) return alert("Both fields are required.");

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();
  document.getElementById("quoteText").value = "";
  document.getElementById("quoteCategory").value = "";
}

function displayQuotes(quotesToDisplay) {
  const container = document.getElementById("quoteDisplay");
  container.innerHTML = "";

  if (quotesToDisplay.length === 0) {
    container.innerHTML = "<p>No quotes found.</p>";
    return;
  }

  quotesToDisplay.forEach(q => {
    const div = document.createElement("div");
    div.className = "quote";
    div.innerHTML = `<strong>${q.category}</strong>: ${q.text}`;
    container.appendChild(div);
  });
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  select.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  displayQuotes(filtered);
}

function restoreLastFilter() {
  const selected = localStorage.getItem("selectedCategory");
  if (selected) {
    const select = document.getElementById("categoryFilter");
    select.value = selected;
    filterQuotes();
  }
}

function exportToJson() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      showNotification("Quotes imported successfully.");
    } catch {
      alert("Failed to import quotes.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

function syncWithServer() {
  fetch(SERVER_URL)
    .then(res => res.json())
    .then(serverQuotes => {
      const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
      quotes = mergeQuotes(serverQuotes, localQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      showNotification("Quotes synced from server.");
    })
    .catch(err => console.error("Sync failed:", err));
}

function mergeQuotes(serverQuotes, localQuotes) {
  const seen = new Set();
  const merged = [];

  serverQuotes.forEach(q => {
    const key = q.text + q.category;
    seen.add(key);
    merged.push(q);
  });

  localQuotes.forEach(q => {
    const key = q.text + q.category;
    if (!seen.has(key)) {
      merged.push(q);
    }
  });

  return merged;
}

function showNotification(msg) {
  const notif = document.getElementById("notification");
  notif.textContent = msg;
  notif.style.display = "block";
  setTimeout(() => notif.style.display = "none", 4000);
}