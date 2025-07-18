const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
const POST_URL = "https://jsonplaceholder.typicode.com/posts";
const SYNC_INTERVAL = 60000; // 1 minute

let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  filter.innerHTML = '<option value="all">All Categories</option>' +
    categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

  const savedFilter = localStorage.getItem("lastFilter") || "all";
  filter.value = savedFilter;
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastFilter", selectedCategory);
  const filtered = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
  displayQuote(filtered[Math.floor(Math.random() * filtered.length)]);
}

function displayQuote(quote) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (!quote) {
    quoteDisplay.innerHTML = "<p>No quote found.</p>";
  } else {
    quoteDisplay.innerHTML = `<blockquote>${quote.text}</blockquote><p><strong>Category:</strong> ${quote.category}</p>`;
  }
}

function showRandomQuote() {
  const currentCategory = document.getElementById("categoryFilter").value;
  const filtered = currentCategory === "all" ? quotes : quotes.filter(q => q.category === currentCategory);
  displayQuote(filtered[Math.floor(Math.random() * filtered.length)]);
}

function createAddQuoteForm() {
  const container = document.getElementById("formContainer");
  container.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="Quote text" />
    <input type="text" id="newQuoteCategory" placeholder="Category" />
    <button onclick="addQuote()">Save Quote</button>
  `;
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Both fields are required.");
  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  document.getElementById("formContainer").innerHTML = "";
  postQuoteToServer(newQuote);
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch(POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    await response.json();
    showNotification("Quote posted to server.");
  } catch (error) {
    showNotification("Failed to post quote to server.");
  }
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      filterQuotes();
      showNotification("Quotes imported successfully!");
    } catch {
      showNotification("Failed to import quotes.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function mergeQuotes(serverQuotes, localQuotes) {
  const existingTexts = new Set(localQuotes.map(q => q.text));
  return [...localQuotes, ...serverQuotes.filter(q => !existingTexts.has(q.text))];
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    let serverQuotes = await response.json();

    if (!Array.isArray(serverQuotes)) serverQuotes = [];

    const formattedQuotes = serverQuotes.map(q => ({
      text: q.title || q.text || "",
      category: q.category || "General"
    }));

    quotes = mergeQuotes(formattedQuotes, quotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    showNotification("Quotes synced with server!");
  } catch (error) {
    showNotification("Failed to fetch quotes from server.");
  }
}

function syncQuotes() {
  fetchQuotesFromServer();
}

function showNotification(msg) {
  const notification = document.getElementById("notification");
  notification.textContent = msg;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 4000);
}

// Initialize app
populateCategories();
filterQuotes();
setInterval(syncQuotes, SYNC_INTERVAL);