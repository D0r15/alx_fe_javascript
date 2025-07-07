let quotes = [];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");
const quoteForm = document.getElementById("quoteForm");
const importFile = document.getElementById("importFile");
const exportBtn = document.getElementById("exportBtn");

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default sample quotes
    quotes = [
      { text: "The journey of a thousand miles begins with a single step.", category: "Inspiration" },
      { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" }
    ];
    saveQuotes();
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Update categories dropdown
function updateCategoryOptions() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Display a random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const selectedQuote = filteredQuotes[randomIndex];

  quoteDisplay.textContent = selectedQuote.text;

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", selectedQuote.text);
}

// Load last quote from sessionStorage
function loadLastQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    quoteDisplay.textContent = `Last viewed: "${last}"`;
  }
}

// Handle new quote submission
quoteForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    updateCategoryOptions();
    quoteForm.reset();
    alert("Quote added!");
  }
});

// Import quotes from JSON file
importFile.addEventListener("change", function (event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        updateCategoryOptions();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid format. Please upload an array of quotes.");
      }
    } catch (err) {
      alert("Error reading file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
});

// Export quotes to JSON file
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

// Initialize
loadQuotes();
updateCategoryOptions();
loadLastQuote();
newQuoteBtn.addEventListener("click", showRandomQuote);