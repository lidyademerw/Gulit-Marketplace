// ==========================================
// 1. GLOBAL STATE & CONFIG
// ==========================================
let itemData = { name: "Product", price: "0" };
let selectedCategory = "";

const textToPageMap = {
  home: "home-section",
  "Habesha Dresses": "kemis-page",
  jewelry: "jewelry-page",
  "Habesha jewelry": "jewelry-page",
  "Habesha Jewelry": "jewelry-page",
  Spices: "spices-page",
  Info: "info-page",
  "ሙሶብ (Mesob)": "mesob-page",
  "ሸክላ (Shkla)": "shkla-page",
};

// ==========================================
// 2. MASTER NAVIGATION LOGIC
// ==========================================
function showPage(targetId) {
  const market = document.getElementById("market-view");
  const upload = document.getElementById("upload-page");
  const profile = document.getElementById("profile-page");

  // Hide the three master containers
  if (market) market.style.display = "none";
  if (upload) upload.style.display = "none";
  if (profile) profile.style.display = "none";

  if (targetId === "upload-page") {
    if (upload) upload.style.display = "block";
  } else if (targetId === "profile-page") {
    if (profile) {
      profile.style.display = "block";
      checkAuthStatus(); // Decision: show Login or Dashboard
    }
  } else {
    // Show Market and Categories
    if (market) {
      market.style.display = "block";
      const internal = market.querySelectorAll(".page-section, .hero");
      internal.forEach((s) => (s.style.display = "block"));

      const element = document.getElementById(targetId);
      if (element) {
        if (targetId === "home-section")
          window.scrollTo({ top: 0, behavior: "smooth" });
        else element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }
}
// --- 1. Master Nav Click Handler ---
document.querySelectorAll(".nav-links a, .submenu a").forEach((link) => {
  link.addEventListener("click", function (e) {
    // If it's the 'cultural materials' trigger, just toggle the menu
    if (this.id === "cultural-trigger") {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById("cultural-menu").classList.toggle("open");
      return;
    }

    // Otherwise, get the target page from the 'data-page' attribute
    const targetPageId = this.getAttribute("data-page");
    if (targetPageId) {
      e.preventDefault();
      showPage(targetPageId);

      // Close the submenu if it was open
      document.getElementById("cultural-menu")?.classList.remove("open");
    }
  });
});

// Close submenu if user clicks anywhere else on the screen
window.addEventListener("click", () => {
  document.getElementById("cultural-menu")?.classList.remove("open");
});
// ==========================================
// 3. AUTHENTICATION LOGIC (YOU TAB)
// ==========================================
function showAuthScreen(screenId) {
  const screens = [
    "auth-welcome",
    "auth-signup",
    "auth-login",
    "auth-dashboard",
  ];
  screens.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === screenId ? "block" : "none";
  });
}

function checkAuthStatus() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userName = localStorage.getItem("currentUser");
  const userDisplay = document.getElementById("user-display-name");

  if (isLoggedIn === "true") {
    showAuthScreen("auth-dashboard");
    if (userDisplay) userDisplay.innerText = "Welcome, " + userName + "!";
  } else {
    showAuthScreen("auth-welcome");
  }
}

function handleSignup() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const pass = document.getElementById("signup-pass").value.trim();
  const errorLine = document.getElementById("signup-error-line");

  if (!name || !email || !pass) {
    if (errorLine) {
      errorLine.innerText = "⚠️ እባክዎን ሁሉንም ቦታዎች ይሙሉ (Fill all fields)";
      errorLine.style.display = "block";
    }
    return;
  }
  localStorage.setItem(email, JSON.stringify({ name, email, pass }));
  alert("Signup Successful! Please Login.");
  showAuthScreen("auth-login");
}

function handleLogin() {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value.trim();
  const errorLine = document.getElementById("login-error");

  const savedData = localStorage.getItem(email);
  if (savedData) {
    const user = JSON.parse(savedData);
    if (user.pass === pass) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", user.name);
      checkAuthStatus();
    } else {
      if (errorLine) {
        errorLine.innerText = "❌ Wrong password";
        errorLine.style.display = "block";
      }
    }
  } else {
    if (errorLine) {
      errorLine.innerText = "🔍 Account not found";
      errorLine.style.display = "block";
    }
  }
}

function handleLogout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
  checkAuthStatus();
}

// ==========================================
// 4. CHAPA PAYMENT LOGIC
// ==========================================
function closeChapa() {
  const wrapper = document.getElementById("chapa-master-wrapper");
  if (wrapper) wrapper.style.display = "none";
  document.body.style.overflow = "auto";
  document.getElementById("chapa-inline-form").innerHTML = "";
}

function startChapaDirectly() {
  const wrapper = document.getElementById("chapa-master-wrapper");
  if (wrapper) {
    wrapper.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

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
      onSuccessfulPayment: () => {
        alert("Success!");
        location.reload();
      },
      onClose: () => closeChapa(),
    });
    chapa.initialize();
  } catch (e) {
    console.error(e);
  }
}

// ==========================================
// 5. SEARCH & IMAGE ZOOM
// ==========================================
function performSearch() {
  const filter = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();
  showPage("home-section");

  const sections = document.querySelectorAll(".page-section");
  sections.forEach((section) => {
    const cards = section.querySelectorAll(".product-card");
    const separator = section.querySelector(".section-separator");
    let sectionHasMatch = false;

    cards.forEach((card) => {
      const label =
        card.querySelector(".product-label")?.textContent.toLowerCase() || "";
      const name = card.getAttribute("data-name")?.toLowerCase() || "";
      if (label.includes(filter) || name.includes(filter)) {
        card.style.display = "flex";
        sectionHasMatch = true;
      } else {
        card.style.display = "none";
      }
    });
    if (separator)
      separator.style.display =
        sectionHasMatch || filter === "" ? "flex" : "none";
  });
}

function initZoomSystem() {
  document.querySelectorAll(".product-card img").forEach((img) => {
    img.onclick = function () {
      const card = this.closest(".product-card");
      document.getElementById("zoomed-image").src = this.src;
      document.getElementById("zoom-product-name").innerText =
        card.querySelector(".product-label").textContent;
      document.getElementById("zoom-product-price").innerText =
        card.querySelector(".price-text").textContent;
      document.getElementById("image-zoom-overlay").style.display = "flex";
      document.body.style.overflow = "hidden";
    };
  });
}

// ==========================================
// 6. INITIALIZATION & EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Check Auth
  checkAuthStatus();

  // Bottom Nav
  document
    .getElementById("mob-home")
    ?.addEventListener("click", () => showPage("home-section"));
  document
    .getElementById("mob-plus")
    ?.addEventListener("click", () => showPage("upload-page"));
  document
    .getElementById("mob-you")
    ?.addEventListener("click", () => showPage("profile-page"));

  // Top Nav Category Click
  document.querySelectorAll(".nav-links a, .submenu a").forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.id === "cultural-trigger") return;
      const target = textToPageMap[this.textContent.trim()];
      if (target) {
        e.preventDefault();
        showPage(target);
      }
    });
  });

  // Search
  document
    .getElementById("search-input")
    ?.addEventListener("input", performSearch);

  // Cart Buttons
  document.querySelectorAll(".cart-btn").forEach((btn) => {
    btn.onclick = function (e) {
      e.preventDefault();
      itemData.name = this.getAttribute("data-name") || "Item";
      itemData.price = this.getAttribute("data-price") || "0";
      startChapaDirectly();
    };
  });

  // Upload Photo Preview
  document
    .getElementById("photo-input")
    ?.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const prev = document.getElementById("photo-preview");
          prev.src = e.target.result;
          prev.style.display = "block";
          document.getElementById("upload-placeholder").style.display = "none";
        };
        reader.readAsDataURL(file);
      }
    });

  // Category Picker logic
  document.querySelectorAll(".cat-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      document
        .querySelectorAll(".cat-option")
        .forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
      selectedCategory = opt.getAttribute("data-value");
    });
  });

  initZoomSystem();
});

// Helper for closing Zoom
function closeZoom() {
  document.getElementById("image-zoom-overlay").style.display = "none";
  document.body.style.overflow = "auto";
}
// This function resets the page so you can shop again
function handleFinalClose() {
  console.log("Emergency Close Clicked!");

  // 1. Hide the Chapa master wrapper
  const wrapper = document.getElementById("chapa-master-wrapper");
  if (wrapper) wrapper.style.display = "none";

  // 2. Allow the body to scroll again
  document.body.style.overflow = "auto";

  // 3. THE MAGIC TRICK: Reload the page
  // Because Chapa's script "hijacks" the browser, a refresh is
  // the only 100% workable way to let the user go back to home.
  window.location.reload();
}

// Attach the click event to the ID
document.addEventListener("click", function (e) {
  // Check if the clicked element (or its parent) has our ID
  if (e.target && e.target.id === "emergency-close-btn") {
    handleFinalClose();
  }
});
// ==========================================
// 7. POST ITEM SUBMISSION LOGIC
// ==========================================

function initPostItemLogic() {
  const postBtn = document.getElementById("post-item-btn");
  const errorLine = document.getElementById("upload-error-msg");

  if (!postBtn) return;

  postBtn.addEventListener("click", () => {
    // 1. Get input values
    const nameInput = document.getElementById("upload-name");
    const priceInput = document.getElementById("upload-price");
    const photoInput = document.getElementById("photo-input");

    const name = nameInput.value.trim();
    const price = priceInput.value.trim();
    const hasPhoto = photoInput.files.length > 0;

    // 2. Clear old errors
    if (errorLine) {
      errorLine.style.display = "none";
      errorLine.innerText = "";
    }

    // 3. Validation Check
    if (!name || !price || !selectedCategory || !hasPhoto) {
      if (errorLine) {
        errorLine.innerText =
          "እባክዎ ሁሉንም መረጃዎች በትክክል ያስገቡ (Please fill all fields and add a photo)";
        errorLine.style.display = "block";

        // Small vibration effect for errors
        errorLine.style.animation = "shake 0.3s";
        setTimeout(() => (errorLine.style.animation = ""), 300);
      }
      return;
    }

    // 4. Success Logic (Simulation)
    alert("ምርትዎ በተሳካ ሁኔታ ተለጥፏል! (Success! Your item is posted)");

    // 5. RESET THE FORM
    nameInput.value = "";
    priceInput.value = "";
    photoInput.value = ""; // Clear file selector
    document.getElementById("photo-preview").style.display = "none";
    document.getElementById("upload-placeholder").style.display = "block";

    // Deselect Category buttons
    document
      .querySelectorAll(".cat-option")
      .forEach((o) => o.classList.remove("selected"));
    selectedCategory = "";

    // 6. Automatically go back to Home
    showPage("home-section");
  });
}

// Ensure this runs when the page loads
document.addEventListener("DOMContentLoaded", () => {
  initPostItemLogic();
});
