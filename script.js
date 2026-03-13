const textToPageMap = {
  home: "home-section",
  "ሐበሻ ቀሚስ": "kemis-page",
  "Habesha jewelry": "jewelry-page",
  ቅመማቅመም: "spices-page",
  "ethiopian food": "food-page",
  Info: "info-page",
  "ሙሶብ (Mesob)": "mesob-page",
  "ሸክላ (Shkla)": "shkla-page",
};

const allLinks = document.querySelectorAll(".nav-links a");

allLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    const linkText = this.textContent.trim();
    const targetSectionId = textToPageMap[linkText];

    if (targetSectionId) {
      e.preventDefault(); // Stop the jumping

      // Find the section
      const targetElement = document.getElementById(targetSectionId);

      if (targetElement) {
        // This is the command that triggers the "Slide"
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      // Close the cultural menu if it was open
      const menu = document.getElementById("cultural-menu");
      if (menu) menu.classList.remove("open");
    }
  });
});
