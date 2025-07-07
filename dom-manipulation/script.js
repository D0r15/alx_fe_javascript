let quotes = [];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const quoteForm = document.getElementById("quoteForm");
const categoryFilter = document.getElementById("categoryFilter");
const importFile = document.getElementById("importFile");
const exportBtn = document.getElementById("exportBtn");

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The journey of a thousand miles begins with a single step.", category: "Inspiration" },
      { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" }
    ];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const categories = Array.from(new Set(quotes.map(q => q.category)));
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  const lastSelected = localStorage.getItem("selectedCategory");
  if (lastSelected) {
    categoryFilter.value = lastSelected;
  }
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  let filtered = quotes;
  if (selectedCategory !== "all") {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  quoteDisplay.innerHTML = "";
  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    quoteDisplay.appendChild(p);
  });
}

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filtered = quotes;

  if (selectedCategory !== "all") {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const selected = filtered[randomIndex];

  quoteDisplay.textContent = `"${selected.text}" — ${selected.category}`;
  sessionStorage.setItem("lastQuote", selected.text);
}

function loadLastQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    quoteDisplay.textContent = `Last viewed: "${last}"`;
  }
}

quoteForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    filterQuotes();
    quoteForm.reset();
    alert("Quote added!");
  }
});

importFile.addEventListener("change", function (event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid format. Upload an array of quotes.");
      }
    } catch {
      alert("Error reading the file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
});

exportBtn.addEventListener("click", function () {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

categoryFilter.addEventListener("change", filterQuotes);

loadQuotes();
populateCategories();
loadLastQuote();
filterQuotes();
newQuoteBtn.addEventListener("click", showRandomQuote);