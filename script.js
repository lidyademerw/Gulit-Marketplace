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

// ==========================================
// 3. SEARCH, UPLOAD & AUTH LOGIC
// ==========================================

// Search Logic
const searchInput = document.getElementById("search-input");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase().trim();
    document.querySelectorAll(".product-card").forEach((card) => {
      const label =
        card.querySelector(".product-label")?.textContent.toLowerCase() || "";
      card.style.display = label.includes(filter) ? "" : "none";
    });
  });
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
