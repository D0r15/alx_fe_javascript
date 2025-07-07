  const SERVER_URL ="https://mocki.io/v1/9d41d4b0-50f6-4983-a8ee-53710b8f8e15";
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
      if (!quote) {
        document.getElementById("quoteDisplay").innerHTML = "<p>No quote found.</p>";
        return;
      }
      document.getElementById("quoteDisplay").innerHTML = `<blockquote>${quote.text}</blockquote><p><strong>Category:</strong> ${quote.category}</p>`;
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
      quotes.push({ text, category });
      saveQuotes();
      populateCategories();
      filterQuotes();
      document.getElementById("formContainer").innerHTML = "";
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
          alert("Quotes imported successfully!");
        } catch (error) {
          alert("Failed to import quotes.");
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

    function mergeQuotes(server, local) {
      const existing = new Set(local.map(q => q.text));
      return [...local, ...server.filter(q => !existing.has(q.text))];
    }

    function fetchQuotesFromServer() {
      fetch(SERVER_URL)
        .then(res => res.json())
        .then(serverQuotes => {
          quotes = mergeQuotes(serverQuotes, quotes);
          saveQuotes();
          populateCategories();
          filterQuotes();
          showNotification("Quotes fetched from server.");
        })
        .catch(err => {
          console.error("Server fetch failed", err);
          showNotification("Failed to fetch quotes from server.");
        });
    }

    function showNotification(msg) {
      alert(msg); // You can replace this with a fancier UI
    }

    function syncWithServer() {
      fetchQuotesFromServer();
    }

    populateCategories();
    filterQuotes();
    setInterval(syncWithServer, SYNC_INTERVAL);