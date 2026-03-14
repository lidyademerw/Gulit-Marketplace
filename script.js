// ==========================================
// 1. PAGE MAPPING & MASTER SWITCHER
// ==========================================
const textToPageMap = {
  home: "home-section",
  "ሐበሻ ቀሚስ": "kemis-page",
  "Habesha jewelry": "jewelry-page",
  ቅመማቅመም: "spices-page",
  Info: "info-page",
  "ሙሶብ (Mesob)": "mesob-page",
  "ሸክላ (Shkla)": "shkla-page",
};

function showPage(targetId) {
  const market = document.getElementById("market-view");
  const upload = document.getElementById("upload-page");
  const info = document.getElementById("profile-page");

  // 1. Hide the three main "Page Containers"
  if (market) market.style.display = "none";
  if (upload) upload.style.display = "none";
  if (info) info.style.display = "none";

  // 2. Logic for showing the correct container
  if (targetId === "upload-page") {
    upload.style.display = "block";
    window.scrollTo(0, 0); // Always start at top of upload
  } else if (targetId === "profile-page") {
    info.style.display = "block";
    window.scrollTo(0, 0); // Always start at top of info
  } else {
    // This is for Home, Dresses, Jewelry, Spices, etc.
    market.style.display = "block";

    // IMPORTANT: Make sure all product sections inside the market are VISIBLE
    // This allows you to scroll down from Home to see everything.
    const sections = market.querySelectorAll(".page-section, .hero");
    sections.forEach((s) => {
      s.style.display = "block";
    });

    // 3. Scroll to the specific section
    const element = document.getElementById(targetId);
    if (element) {
      if (targetId === "home-section") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Scroll to the specific category (like Jewelry)
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }
}
// ==========================================
// 2. NAVBAR & NAVIGATION LOGIC
// ==========================================
const culturalTrigger = document.getElementById("cultural-trigger");
const culturalMenu = document.getElementById("cultural-menu");

if (culturalTrigger) {
  culturalTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    culturalMenu.classList.toggle("open");
  });
}

const allLinks = document.querySelectorAll(".nav-links a, .submenu a");
allLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    if (this.id === "cultural-trigger") return;

    const linkText = this.textContent.trim();
    const targetSectionId = textToPageMap[linkText];

    if (targetSectionId) {
      e.preventDefault();
      showPage(targetSectionId);
      if (culturalMenu) culturalMenu.classList.remove("open");
    }
  });
});

// ==========================================
// 3. MOBILE BOTTOM NAV LOGIC
// ==========================================
const mobHome = document.getElementById("mob-home");
const mobPlus = document.getElementById("mob-plus");
const mobYou = document.getElementById("mob-you");

if (mobHome) mobHome.addEventListener("click", () => showPage("home-section"));
if (mobPlus) mobPlus.addEventListener("click", () => showPage("upload-page"));
if (mobYou) mobYou.addEventListener("click", () => showPage("profile-page"));

// ==========================================
// 4. PAYMENT MODAL LOGIC
// ==========================================
const cartButtons = document.querySelectorAll(".cart-btn");
const paymentOverlay = document.getElementById("payment-overlay");
const closeModal = document.getElementById("close-modal");

cartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    paymentOverlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  });
});

if (closeModal) {
  closeModal.addEventListener("click", () => {
    paymentOverlay.style.display = "none";
    document.body.style.overflow = "auto";
  });
}

window.addEventListener("click", (e) => {
  if (e.target === paymentOverlay) {
    paymentOverlay.style.display = "none";
    document.body.style.overflow = "auto";
  }
  if (culturalTrigger && e.target !== culturalTrigger) {
    culturalMenu.classList.remove("open");
  }
});

// ==========================================
// 5. SEARCH LOGIC
// ==========================================
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

function performSearch() {
  const filter = searchInput.value.toLowerCase().trim();
  const allCards = document.querySelectorAll(".product-card");

  // Ensure market is visible when searching
  showPage("home-section");

  allCards.forEach((card) => {
    const productName = card.querySelector("h3")
      ? card.querySelector("h3").textContent.toLowerCase()
      : "";
    const productLabel = card.querySelector(".product-label")
      ? card.querySelector(".product-label").textContent.toLowerCase()
      : "";

    if (productName.includes(filter) || productLabel.includes(filter)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

if (searchBtn) searchBtn.addEventListener("click", performSearch);
if (searchInput) {
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") performSearch();
  });
  searchInput.addEventListener("input", () => {
    if (searchInput.value === "") {
      document
        .querySelectorAll(".product-card")
        .forEach((card) => (card.style.display = ""));
    }
  });
}

// ==========================================
// 6. SELLER UPLOAD LOGIC
// ==========================================
const photoInput = document.getElementById("photo-input");
const photoPreview = document.getElementById("photo-preview");
const uploadPlaceholder = document.getElementById("upload-placeholder");

if (photoInput) {
  photoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        photoPreview.src = e.target.result;
        photoPreview.style.display = "block";
        uploadPlaceholder.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });
}

const catOptions = document.querySelectorAll(".cat-option");
catOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    catOptions.forEach((o) => o.classList.remove("selected"));
    opt.classList.add("selected");
  });
});

const postBtn = document.getElementById("post-item-btn");
if (postBtn) {
  postBtn.addEventListener("click", () => {
    const name = document.getElementById("upload-name").value;
    const price = document.getElementById("upload-price").value;
    if (name && price) {
      alert("ምርትዎ በተሳካ ሁኔታ ተለጥፏል!");
      showPage("home-section");
    } else {
      alert("እባክዎ ስም እና ዋጋ ያስገቡ");
    }
  });
}
