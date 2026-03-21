// GLOBAL STATE

let cart = [];
let itemData = { name: "Order", price: 0 };
let selectedCategory = "";

// ==========================================
// 1. NAVIGATION & SEARCH
// ==========================================
const textToPageMap = {
  home: "home-section",
  "Habesha Dresses": "kemis-page",
  jewelry: "jewelry-page",
  Spices: "spices-page",
  Info: "info-page",
  "ሙሶብ (Mesob)": "mesob-page",
  "ሸክላ (Shkla)": "shkla-page",
};

// ==========================================
// FINAL MASTER NAVIGATION
// ==========================================

function showPage(targetId) {
  const market = document.getElementById("market-view");
  const upload = document.getElementById("upload-page");
  const profile = document.getElementById("profile-page");

  console.log("Navigating to: " + targetId);

  // 1. Logic for Standalone Pages (Upload & Profile)
  if (targetId === "upload-page" || targetId === "profile-page") {
    if (market) market.style.display = "none";
    if (upload)
      upload.style.display = targetId === "upload-page" ? "block" : "none";
    if (profile)
      profile.style.display = targetId === "profile-page" ? "block" : "none";
    window.scrollTo(0, 0); // Jump to top
    return; // Stop here
  }

  // 2. Logic for Marketplace Sections (Home, Jewelry, Spices, Info)
  if (market) {
    market.style.display = "block";
    if (upload) upload.style.display = "none";
    if (profile) profile.style.display = "none";

    const sections = market.querySelectorAll(".page-section, .hero");
    sections.forEach((s) => (s.style.display = "block"));

    // 3. THE SCROLL FIX
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // Give the browser a moment to make sure market-view is visible
      setTimeout(() => {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    }
  }
  // ==========================================
  // POST ITEM LOGIC
  // ==========================================

  function initPostItem() {
    const postBtn = document.getElementById("post-item-btn");
    const errorLine = document.getElementById("upload-error-msg");

    if (!postBtn) return;

    postBtn.addEventListener("click", () => {
      // 1. Get current values from the form
      const nameInput = document.getElementById("upload-name");
      const priceInput = document.getElementById("upload-price");
      const photoInput = document.getElementById("photo-input");

      const name = nameInput.value.trim();
      const price = priceInput.value.trim();
      const hasPhoto = photoInput.files.length > 0;

      // 2. Reset error line
      errorLine.style.display = "none";
      errorLine.innerText = "";

      // 3. VALIDATION: Check if everything is filled
      // 'selectedCategory' should be the global variable from your category picker
      if (!name || !price || !selectedCategory || !hasPhoto) {
        errorLine.innerText =
          "⚠️ እባክዎ ሁሉንም መረጃዎች በትክክል ያስገቡ (Please fill all fields and add a photo)";
        errorLine.style.display = "block";
        return;
      }

      // 4. SUCCESS: Simulate posting
      alert("ምርትዎ በተሳካ ሁኔታ ተለጥፏል! (Success! Your item is posted)");

      // 5. RESET FORM for next time
      nameInput.value = "";
      priceInput.value = "";
      photoInput.value = ""; // Clear file
      document.getElementById("photo-preview").style.display = "none";
      document.getElementById("upload-placeholder").style.display = "block";

      // Unselect categories
      document
        .querySelectorAll(".cat-option")
        .forEach((opt) => opt.classList.remove("selected"));
      selectedCategory = "";

      // 6. Navigate back to Home
      showPage("home-section");
    });
  }

  // MAKE SURE THIS RUNS IN YOUR DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    // ... your other setup calls ...
    initPostItem();
  });
  
}

// Ensure all links (Desktop & Submenu) use the script
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(
    ".nav-item, .sub-item, .mobile-nav-btn",
  );

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const pageId = this.getAttribute("data-page");

      if (pageId) {
        e.preventDefault();
        showPage(pageId);

        // Close dropdown if it's open
        document.getElementById("cultural-menu")?.classList.remove("open");
      }
    });
  });
});
// ==========================================
// 2. AUTHENTICATION (YOU TAB)
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
  if (isLoggedIn === "true") {
    showAuthScreen("auth-dashboard");
    const display = document.getElementById("user-display-name");
    if (display) display.innerText = "Welcome, " + userName + "!";
  } else {
    showAuthScreen("auth-welcome");
  }
}

function handleSignup() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const pass = document.getElementById("signup-pass").value.trim();
  if (name && email && pass) {
    localStorage.setItem(email, JSON.stringify({ name, email, pass }));
    alert("Signup Successful! Please Login.");
    showAuthScreen("auth-login");
  } else {
    alert("Please fill all fields!");
  }
}

function handleLogin() {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value.trim();
  const saved = localStorage.getItem(email);
  if (saved) {
    const user = JSON.parse(saved);
    if (user.pass === pass) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", user.name);
      checkAuthStatus();
    } else {
      alert("Wrong password!");
    }
  } else {
    alert("User not found!");
  }
}

function handleLogout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
  location.reload();
}

// ==========================================
// 3. SHOPPING CART SYSTEM
// ==========================================
function toggleCart() {
  const sidebar = document.getElementById("cart-sidebar");
  const overlay = document.getElementById("cart-overlay");
  const isOpen = sidebar.style.right === "0px";
  sidebar.style.right = isOpen ? "-400px" : "0px";
  overlay.style.display = isOpen ? "none" : "block";
}

function addToCart(btn) {
  const name = btn.getAttribute("data-name");
  const price = parseInt(btn.getAttribute("data-price"));
  const img = btn.closest(".product-card").querySelector("img").src;
  cart.push({ name, price, img });
  updateCartUI();
  toggleCart();
}

function updateCartUI() {
  const list = document.getElementById("cart-items-list");
  const totalDisplay = document.getElementById("cart-total-price");
  list.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    list.innerHTML += `
            <div style="display:flex; gap:15px; margin-bottom:15px; align-items:center; border-bottom:1px solid #eee; padding-bottom:10px;">
                <img src="${item.img}" style="width:60px; height:60px; border-radius:8px; object-fit:cover;">
                <div style="flex:1;">
                    <h4 style="margin:0; font-size:14px;">${item.name}</h4>
                    <p style="margin:5px 0; color:#2d8a3d; font-weight:bold;">${item.price} ETB</p>
                    <button onclick="removeItem(${index})" style="color:red; background:none; border:none; cursor:pointer; font-size:12px;">Remove</button>
                </div>
            </div>`;
  });
  totalDisplay.innerText = total + " Birr";
  itemData.price = total;
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// ==========================================
// 4. CHAPA PAYMENT & ZOOM
// ==========================================
function checkoutNow() {
  if (cart.length === 0) return alert("Your cart is empty!");
  toggleCart();
  const wrapper = document.getElementById("chapa-master-wrapper");
  wrapper.style.display = "flex";
  document.body.style.overflow = "hidden";
  try {
    const chapa = new ChapaCheckout({
      publicKey: "pk_test_CHAPUBK_TEST-gwpvAaGZ3r8JvsO5kb9rDAocxYNOOI9G",
      amount: itemData.price.toString(),
      currency: "ETB",
      txRef: "gulit-" + Date.now(),
      email: "customer@gmail.com",
      firstName: "Gulit",
      container: "chapa-inline-form",
      onSuccessfulPayment: () => {
        alert("Payment Success!");
        location.reload();
      },
      onClose: () => {
        wrapper.style.display = "none";
        document.body.style.overflow = "auto";
      },
    });
    chapa.initialize();
  } catch (e) {
    console.error(e);
  }
}

// ==========================================
// 5. MASTER INITIALIZATION (EVERYTHING STARTS HERE)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // A. Initial Login Check
  checkAuthStatus();

  // B. Cultural Materials Dropdown Trigger
  const trigger = document.getElementById("cultural-trigger");
  const menu = document.getElementById("cultural-menu");

  if (trigger && menu) {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation(); // Prevents it from closing immediately
      menu.classList.toggle("open");
    });
  }

  // C. All Navigation Links (Main Nav + Submenu + Mobile)
  const navItems = document.querySelectorAll("[data-page]");
  navItems.forEach((item) => {
    item.onclick = function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("data-page");
      if (targetId) {
        showPage(targetId); // Jump to section
        menu?.classList.remove("open"); // Close dropdown if open
      }
    };
  });

  // D. Close Dropdown if user clicks anywhere else on screen
  window.onclick = () => menu?.classList.remove("open");

  // E. Link Cart Buttons
  document.querySelectorAll(".cart-btn").forEach((btn) => {
    btn.onclick = () => addToCart(btn);
  });

  // F. Link Product Image Zoom
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

  // G. Category Picker (Upload Page)
  document.querySelectorAll(".cat-option").forEach((opt) => {
    opt.onclick = () => {
      document
        .querySelectorAll(".cat-option")
        .forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
      selectedCategory = opt.getAttribute("data-value");
    };
  });
});
// 1. The Function that actually hides the zoom
function closeZoom() {
  console.log("Closing Product Zoom...");
  const overlay = document.getElementById("image-zoom-overlay");
  if (overlay) {
    overlay.style.display = "none";
  }
  document.body.style.overflow = "auto"; // Re-enable scrolling
}

// 2. Attach the click listener to the X button
// We do this inside a separate listener to be 100% sure it works
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("btn-close-zoom");
  if (closeBtn) {
    closeBtn.onclick = closeZoom;
  }

  // EXTRA FEATURE: Close zoom if they click the background (outside the image)
  const overlay = document.getElementById("image-zoom-overlay");
  overlay.onclick = function (e) {
    if (e.target === overlay) {
      closeZoom();
    }
  };
});
// --- THE EMERGENCY RESET BUTTON ---
document.addEventListener("click", function (e) {
  // We check if the click was on the button OR the "X" symbol inside it
  if (
    e.target &&
    (e.target.id === "ultimate-close-btn" ||
      e.target.parentElement.id === "ultimate-close-btn")
  ) {
    console.log("User requested emergency exit. Resetting app...");

    // 1. Instantly hide the payment UI
    const wrapper = document.getElementById("chapa-master-wrapper");
    if (wrapper) wrapper.style.display = "none";

    // 2. Allow the page to scroll again
    document.body.style.overflow = "auto";

    window.location.reload();
  }
});
