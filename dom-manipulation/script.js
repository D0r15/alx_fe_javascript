const quotes = [
  { text: "The journey of a thousand miles begins with a single step.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const quoteForm = document.getElementById("quoteForm");
const quoteText = document.getElementById("quoteText");
const quoteCategory = document.getElementById("quoteCategory");
const categorySelect = document.getElementById("categorySelect");

// Get unique categories from quotes
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

// Show a random quote from the selected category
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = filteredQuotes[randomIndex].text;
}

// Handle new quote submission
function handleAddQuote(e) {
  e.preventDefault();
  const text = quoteText.value.trim();
  const category = quoteCategory.value.trim();
  if (text && category) {
    quotes.push({ text, category });
    quoteText.value = "";
    quoteCategory.value = "";
    updateCategoryOptions();
    alert("Quote added!");
  }
}

// Initialize
updateCategoryOptions();
showRandomQuote();

newQuoteBtn.addEventListener("click", showRandomQuote);
quoteForm.addEventListener("submit", handleAddQuote);