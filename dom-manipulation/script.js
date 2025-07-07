const quotes = [
  { text: "The journey of a thousand miles begins with a single step.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");

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

function createAddQuoteForm() {
  const form = document.createElement("form");

  const inputQuote = document.createElement("input");
  inputQuote.type = "text";
  inputQuote.placeholder = "Quote text";
  inputQuote.required = true;
  inputQuote.id = "quoteText";

  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.placeholder = "Category";
  inputCategory.required = true;
  inputCategory.id = "quoteCategory";

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Add Quote";
  submitBtn.type = "submit";

  form.appendChild(inputQuote);
  form.appendChild(inputCategory);
  form.appendChild(submitBtn);
  document.body.appendChild(form);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = inputQuote.value.trim();
    const category = inputCategory.value.trim();

    if (text && category) {
      quotes.push({ text, category });
      updateCategoryOptions();
      inputQuote.value = "";
      inputCategory.value = "";
      alert("Quote added!");
    }
  });
}

updateCategoryOptions();
showRandomQuote();
newQuoteBtn.addEventListener("click", showRandomQuote);
createAddQuoteForm();