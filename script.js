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
// Get the sections
const homeSection = document.querySelector(".hero");
const kemisPage = document.getElementById("kemis-page");

// Get the nav link
const kemisLink = document.querySelector('a[href*="Habesha Kemis"]');
const homeLink = document.querySelector('a[href*="home"]');

// Switch to Kemis Page
kemisLink.addEventListener("click", (e) => {
  e.preventDefault();
  homeSection.style.display = "none";
  kemisPage.style.display = "block";
});

// Switch back to Home
homeLink.addEventListener("click", (e) => {
  e.preventDefault();
  kemisPage.style.display = "none";
  homeSection.style.display = "flex";
});
