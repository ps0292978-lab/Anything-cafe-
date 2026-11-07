
// ===================================
// ANYTHING CAFE - WEBSITE JAVASCRIPT
// ===================================

// MENU DATA
const products = [
  {
    id: 1,
    name: "Classic Cappuccino",
    category: "coffee",
    price: 149,
    description: "Rich espresso topped with silky steamed milk.",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=700"
  },
  {
    id: 2,
    name: "Caramel Latte",
    category: "coffee",
    price: 179,
    description: "Smooth latte with delicious caramel sweetness.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700"
  },
  {
    id: 3,
    name: "Iced Americano",
    category: "coffee",
    price: 139,
    description: "Bold espresso poured over refreshing ice.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=700"
  },
  {
    id: 4,
    name: "Chocolate Brownie",
    category: "dessert",
    price: 129,
    description: "Warm, fudgy chocolate brownie.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700"
  },
  {
    id: 5,
    name: "Blueberry Cheesecake",
    category: "dessert",
    price: 199,
    description: "Creamy cheesecake with blueberry topping.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=700"
  },
  {
    id: 6,
    name: "Chocolate Croissant",
    category: "food",
    price: 119,
    description: "Buttery, flaky pastry filled with chocolate.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=700"
  },
  {
    id: 7,
    name: "Grilled Sandwich",
    category: "food",
    price: 159,
    description: "Golden grilled sandwich with fresh filling.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700"
  },
  {
    id: 8,
    name: "Classic Waffles",
    category: "dessert",
    price: 189,
    description: "Crispy waffles served with sweet toppings.",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=700"
  },
  {
    id: 9,
    name: "Cold Coffee",
    category: "coffee",
    price: 169,
    description: "Chilled, creamy coffee for a refreshing break.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700"
  }
];

// DOM ELEMENTS
const menuGrid = document.getElementById("menuGrid");
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartHeadingCount = document.getElementById("cartHeadingCount");
const cartTotal = document.getElementById("cartTotal");

let cart = [];

// TOAST MESSAGE
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// DISPLAY MENU
function renderMenu(category = "all") {
  const filtered = category === "all"
    ? products
    : products.filter(product => product.category === category);

  menuGrid.innerHTML = filtered.map(product => `
    <article class="menu-card">
      <div class="menu-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="menu-category">${product.category}</span>
      </div>
      <div class="menu-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="menu-bottom">
          <span class="price">₹${product.price}</span>
          <button class="add-button" data-add="${product.id}">
            + ADD TO BAG
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// MENU FILTERS
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    button.classList.add("active");
    renderMenu(button.dataset.category);
  });
});

// ADD TO CART
menuGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const id = Number(button.dataset.add);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...products.find(product => product.id === id),
      quantity: 1
    });
  }

  updateCart();
  showToast("Added to your bag! ☕");
});

// UPDATE CART
function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  cartCount.textContent = totalItems;
  cartHeadingCount.textContent = `(${totalItems})`;
  cartTotal.textContent = `₹${totalPrice}`;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart">
        Your bag is waiting for something delicious ☕
      </p>`;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>₹${item.price * item.quantity}</p>
        <div class="quantity-controls">
          <button data-decrease="${item.id}">−</button>
          <span>${item.quantity}</span>
          <button data-increase="${item.id}">+</button>
          <button data-remove="${item.id}" aria-label="Remove item">×</button>
        </div>
      </div>
    </div>
  `).join("");
}

// CART QUANTITY AND REMOVE
cartItems.addEventListener("click", event => {
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  const remove = event.target.closest("[data-remove]");

  if (increase) {
    const item = cart.find(i => i.id === Number(increase.dataset.increase));
    if (item) item.quantity++;
  }

  if (decrease) {
    const item = cart.find(i => i.id === Number(decrease.dataset.decrease));
    if (item) {
      item.quantity--;
      if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== item.id);
      }
    }
  }

  if (remove) {
    cart = cart.filter(i => i.id !== Number(remove.dataset.remove));
  }

  updateCart();
});

// OPEN / CLOSE CART
function openCart() {
  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

// WHATSAPP ORDER
document.getElementById("checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your bag is empty!");
    return;
  }

  const phoneNumber = "919999999999"; // CHANGE TO YOUR CAFE WHATSAPP NUMBER

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  let message = "Hello ANYTHING Cafe! ☕ I would like to order:\n\n";

  cart.forEach(item => {
    message += `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
  });

  message += `\nTotal: ₹${total}\n\nPlease confirm my order.`;

  const whatsappURL =
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank");
});

// TABLE BOOKING
const bookingDate = document.getElementById("bookingDate");
const today = new Date();
const localToday = new Date(
  today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

bookingDate.min = localToday;

document.getElementById("bookingForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("guestName").value.trim();
  const phone = document.getElementById("guestPhone").value.trim();
  const date = bookingDate.value;
  const time = document.getElementById("bookingTime").value;
  const guests = document.getElementById("guestCount").value;
  const note = document.getElementById("bookingNote").value.trim();

  if (!/^[0-9+\-\s()]{7,18}$/.test(phone)) {
    showToast("Please enter a valid phone number.");
    return;
  }

  const cafeNumber = "919999999999"; // CHANGE TO YOUR CAFE WHATSAPP NUMBER

  const message =
`Hello ANYTHING Cafe! ☕
I would like to request a table reservation.

Name: ${name}
Phone: ${phone}
Date: ${date}
Time: ${time}
Guests: ${guests}
Special Request: ${note || "None"}

Please confirm my reservation.`;

  const url = `https://wa.me/${cafeNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
  showToast("Opening WhatsApp for your reservation!");
});

// MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  menuToggle.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.textContent = "☰";
  });
});

// SCROLL REVEAL ANIMATION
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(element => {
  observer.observe(element);
});

// INITIALIZE
renderMenu();
updateCart();
