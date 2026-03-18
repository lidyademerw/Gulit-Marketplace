// ==========================================
// 1. MASTER NAVIGATION LOGIC
// ==========================================
const textToPageMap = {
  home: "home-section",
  "ሐበሻ ቀሚስ": "kemis-page",
  jewelry: "jewelry-page",
  "Habesha jewelry": "jewelry-page",
  "Habesha Jewelry": "jewelry-page",
  ቅመማቅመም: "spices-page",
  Info: "info-page",
  "ሙሶብ (Mesob)": "mesob-page",
  "ሸክላ (Shkla)": "shkla-page",
};

function showPage(targetId) {
  const market = document.getElementById("market-view");
  const upload = document.getElementById("upload-page");
  const profile = document.getElementById("profile-page");

  if (market) market.style.display = "none";
  if (upload) upload.style.display = "none";
  if (profile) profile.style.display = "none";

  if (targetId === "upload-page") {
    upload.style.display = "block";
    window.scrollTo(0, 0);
  } else if (targetId === "profile-page") {
    profile.style.display = "block";
    window.scrollTo(0, 0);
  } else {
    market.style.display = "block";
    const sections = market.querySelectorAll(".page-section, .hero");
    sections.forEach((s) => (s.style.display = "block"));

    const element = document.getElementById(targetId);
    if (element) {
      if (targetId === "home-section")
        window.scrollTo({ top: 0, behavior: "smooth" });
      else element.scrollIntoView({ behavior: "smooth" });
    }
  }
}

// Navbar & Submenu Logic
const culturalTrigger = document.getElementById("cultural-trigger");
const culturalMenu = document.getElementById("cultural-menu");

if (culturalTrigger) {
  culturalTrigger.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    culturalMenu.classList.toggle("open");
  });
}

document.querySelectorAll(".nav-links a, .submenu a").forEach((link) => {
  link.addEventListener("click", function (e) {
    if (this.id === "cultural-trigger") return;
    const targetSectionId = textToPageMap[this.textContent.trim()];
    if (targetSectionId) {
      e.preventDefault();
      showPage(targetSectionId);
      if (culturalMenu) culturalMenu.classList.remove("open");
    }
  });
});

// Mobile Bottom Bar Listeners
document
  .getElementById("mob-home")
  ?.addEventListener("click", () => showPage("home-section"));
document
  .getElementById("mob-plus")
  ?.addEventListener("click", () => showPage("upload-page"));
document
  .getElementById("mob-you")
  ?.addEventListener("click", () => showPage("profile-page"));

// ==========================================
// 2. REAL CHAPA PAYMENT LOGIC (DIRECT)
// ==========================================
let itemData = { name: "Product", price: "0" };

// This function closes the payment window
function closeChapa() {
  const wrapper = document.getElementById("chapa-master-wrapper");
  if (wrapper) wrapper.style.display = "none";
  document.body.style.overflow = "auto";
  document.getElementById("chapa-inline-form").innerHTML = ""; // Clear content
}

// THIS IS THE MAIN BUTTON CLICKER
function setupCartButtons() {
  const btns = document.querySelectorAll(".cart-btn");
  btns.forEach((btn) => {
    btn.onclick = function (e) {
      e.preventDefault();

      // 1. Get Data from the button's data attributes
      itemData.name = this.getAttribute("data-name") || "Traditional Item";
      itemData.price = this.getAttribute("data-price") || "0";

      if (itemData.price === "0") {
        alert("Error: Price missing on this button!");
        return;
      }

      // 2. Open Chapa Directly
      startChapaDirectly();
    };
  });
}

function startChapaDirectly() {
  // 1. Show the Master Wrapper
  const wrapper = document.getElementById("chapa-master-wrapper");
  wrapper.style.display = "flex";
  document.body.style.overflow = "hidden";

  // 2. Initialize Chapa
  try {
    const chapa = new ChapaCheckout({
      publicKey: "pk_test_CHAPUBK_TEST-gwpvAaGZ3r8JvsO5kb9rDAocxYNOOI9G",
      amount: itemData.price,
      currency: "ETB",
      txRef: "gulit-" + Date.now(),
      email: "customer@gmail.com",
      firstName: "Gulit",
      title: "Buying " + itemData.name,
      container: "chapa-inline-form",
      onSuccessfulPayment: function (data) {
        alert("ክፍያዎ ተሳክቷል! (Payment Success!)");
        window.location.reload();
      },
      onClose: function () {
        closeChapa();
      },
    });

    chapa.initialize();
  } catch (e) {
    console.error("Chapa Error:", e);
  }
}

// Auth Screen Switcher
function showAuthScreen(screenId) {
  document.getElementById("auth-welcome").style.display = "none";
  document.getElementById("auth-signup").style.display = "none";
  document.getElementById("auth-login").style.display = "none";
  document.getElementById(screenId).style.display = "block";
}

// Run Initial Setup
setupCartButtons();
showPage("home-section");
function closeChapa() {
  console.log("Closing Chapa window...");

  // 1. Find the master wrapper and hide it
  const wrapper = document.getElementById("chapa-master-wrapper");
  if (wrapper) {
    wrapper.style.display = "none";
  }

  // 2. Allow the background to scroll again
  document.body.style.overflow = "auto";

  // 3. IMPORTANT: Clear the internal Chapa form
  // This prevents errors when you try to open it again later
  const formContainer = document.getElementById("chapa-inline-form");
  if (formContainer) {
    formContainer.innerHTML = "";
  }
}
// This function resets the page so you can shop again
function closeChapaWindow() {
  console.log("X clicked - Closing payment...");

  // 1. Hide the wrapper
  const wrapper = document.getElementById("chapa-master-wrapper");
  if (wrapper) wrapper.style.display = "none";

  // 2. Clear the payment form
  const form = document.getElementById("chapa-inline-form");
  if (form) form.innerHTML = "";

  // 3. Allow scrolling again
  document.body.style.overflow = "auto";

  // 4. THE MAGIC FIX: Reload the page state
  // If the library is "stuck", this is the only way to 100% reset it
  window.location.reload();
}

// Attach the listener to the ID
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "final-close-btn") {
    closeChapaWindow();
  }
});
// ==========================================
// IMAGE ZOOM LOGIC
// ==========================================

function initZoomSystem() {
  const productImages = document.querySelectorAll(".product-card img");

  productImages.forEach((img) => {
    img.onclick = function () {
      const card = this.closest(".product-card");
      const name = card.querySelector(".product-label").textContent;
      const priceText = card.querySelector(".price-text").textContent;
      const priceVal = card
        .querySelector(".cart-btn")
        .getAttribute("data-price");

      // 1. Fill the Zoom Modal with the right info
      document.getElementById("zoomed-image").src = this.src;
      document.getElementById("zoom-product-name").innerText = name;
      document.getElementById("zoom-product-price").innerText = priceText;

      // 2. Pass the price to the "Buy" button inside the zoom view
      document
        .getElementById("zoom-buy-btn")
        .setAttribute("data-price", priceVal);
      document.getElementById("zoom-buy-btn").setAttribute("data-name", name);

      // 3. Show the Modal
      document.getElementById("image-zoom-overlay").style.display = "flex";
      document.body.style.overflow = "hidden"; // Stop background scroll
    };
  });
}

function closeZoom() {
  document.getElementById("image-zoom-overlay").style.display = "none";
  document.body.style.overflow = "auto";
}

// Function to handle the "Add to cart" click inside the zoom view
function buyFromZoom() {
  const btn = document.getElementById("zoom-buy-btn");
  itemData.name = btn.getAttribute("data-name");
  itemData.price = btn.getAttribute("data-price");

  closeZoom(); // Close zoom before opening payment
  startChapaDirectly(); // Trigger your Chapa payment!
}

// Run the setup
initZoomSystem();
// ==========================================
// SEARCH ENGINE LOGIC
// ==========================================

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

function performSearch() {
  const filter = searchInput.value.toLowerCase().trim();

  // 1. Force the Home view to show results
  showPage("home-section");

  // 2. Target each category section (Mesob, Shkla, Jewelry, etc.)
  const sections = document.querySelectorAll(".page-section");

  sections.forEach((section) => {
    const cards = section.querySelectorAll(".product-card");
    const separator = section.querySelector(".section-separator");
    let sectionHasMatch = false;

    cards.forEach((card) => {
      // Check label (Ethiopic) and data-name (Latin)
      const label =
        card.querySelector(".product-label")?.textContent.toLowerCase() || "";
      const name = card.getAttribute("data-name")?.toLowerCase() || "";

      if (label.includes(filter) || name.includes(filter)) {
        card.style.display = "flex"; // Show matching product
        sectionHasMatch = true;
      } else {
        card.style.display = "none"; // Hide non-matching product
      }
    });

    // 3. Handle the Green Header (Separator)
    if (separator) {
      if (sectionHasMatch || filter === "") {
        section.style.display = "block"; // Show section if there's a match
        separator.style.display = "flex";
      } else {
        section.style.display = "none"; // Hide entire section if no match
      }
    }
  });

  // 4. Handle the Hero (Welcome) section
  const hero = document.getElementById("home-section");
  if (hero) {
    // Hide the welcome images when searching so results move to the top
    hero.style.display = filter === "" ? "flex" : "none";
  }
}

// Event: Search as you type
if (searchInput) {
  searchInput.addEventListener("input", performSearch);
}

// Event: Search when clicking the magnifying glass
if (searchBtn) {
  searchBtn.addEventListener("click", performSearch);
}

// Event: Reset search when input is empty
if (searchInput) {
  searchInput.addEventListener("keyup", (e) => {
    if (searchInput.value === "") {
      document
        .querySelectorAll(".product-card")
        .forEach((card) => (card.style.display = "flex"));
    }
  });
}
