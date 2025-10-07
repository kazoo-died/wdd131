// Product array (new ones)
const products = [
  { id: 1, name: "Noise-Canceling Headphones" },
  { id: 2, name: "Smart Fitness Watch" },
  { id: 3, name: "Portable Laptop Stand" },
  { id: 4, name: "Wireless Charging Pad" },
  { id: 5, name: "Bluetooth Keyboard" },
  { id: 6, name: "4K Action Camera" }
];

// Populate select options
window.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("productName");
  if (select) {
    products.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.name;
      opt.textContent = p.name;
      select.appendChild(opt);
    });
  }

  // Update review counter
  if (window.location.pathname.includes("review.html")) {
    let count = localStorage.getItem("reviewCount");
    count = count ? parseInt(count) + 1 : 1;
    localStorage.setItem("reviewCount", count);
    document.getElementById("counter").textContent = count;
  }

  // Last modified footer date
  const footerDate = document.getElementById("lastModified");
  if (footerDate) {
    const lastMod = new Date(document.lastModified);
    footerDate.textContent = `Last Modification: ${lastMod.toLocaleString()}`;
  }
});

