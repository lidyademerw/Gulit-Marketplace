const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

// Trigger search on button click
searchBtn.addEventListener("click", () => {
  performSearch();
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});

function performSearch() {
  const query = searchInput.value;
  if (query) {
    alert("Searching for: " + query);
    
  }
}
