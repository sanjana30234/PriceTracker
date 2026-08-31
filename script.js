/* =======================================================
   PriceTracker — script.js
   Core functionality: Product rendering, Compare Cart,
   Filtering, Sorting, Search, Price Comparison
   ======================================================= */

// ── Product Data ────────────────────────────────────────
const products = [
  {
    id: 1,
    name: "Apple AirPods Pro (2nd Gen)",
    category: "electronics",
    image: "https://images-na.ssl-images-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg",
    rating: 4.8,
    price: 22999,
    originalPrice: 26900,
    store: "Amazon",
    discount: 14,
    storeUrl: "#"
  },
  {
    id: 2,
    name: "Sony WH-1000XM5",
    category: "electronics",
    image: "https://images-na.ssl-images-amazon.com/images/I/61+btxzpfDL._AC_SL1500_.jpg",
    rating: 4.7,
    price: 28499,
    originalPrice: 34990,
    store: "Flipkart",
    discount: 18,
    storeUrl: "#"
  },
  {
    id: 3,
    name: "Samsung Galaxy S24",
    category: "electronics",
    image: "https://images-na.ssl-images-amazon.com/images/I/71OOBrRJkML._AC_SL1500_.jpg",
    rating: 4.6,
    price: 59999,
    originalPrice: 74999,
    store: "Croma",
    discount: 20,
    storeUrl: "#"
  },
  {
    id: 4,
    name: "Apple iPhone 15",
    category: "electronics",
    image: "https://images-na.ssl-images-amazon.com/images/I/61bk6SECL2L._AC_SL1500_.jpg",
    rating: 4.7,
    price: 69999,
    originalPrice: 79900,
    store: "Reliance Digital",
    discount: 12,
    storeUrl: "#"
  },
  {
    id: 5,
    name: "Lenovo IdeaPad Slim 5",
    category: "electronics",
    image: "https://images-na.ssl-images-amazon.com/images/I/51g2pDWnlXL._AC_SL1500_.jpg",
    rating: 4.4,
    price: 52999,
    originalPrice: 65000,
    store: "Amazon",
    discount: 18,
    storeUrl: "#"
  },
  {
    id: 6,
    name: "Nike Air Max 270",
    category: "fashion",
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/02a4e0e2-c044-4c64-9bf3-9c1f4ed1be6f/air-max-270-shoes-V4RF4P.png",
    rating: 4.5,
    price: 11995,
    originalPrice: 13995,
    store: "Myntra",
    discount: 14,
    storeUrl: "#"
  },
  {
    id: 7,
    name: "Logitech MX Master 3S",
    category: "accessories",
    image: "https://resource.logitech.com/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-view-graphite.png",
    rating: 4.8,
    price: 9995,
    originalPrice: 11995,
    store: "Amazon",
    discount: 17,
    storeUrl: "#"
  },
  {
    id: 8,
    name: "Kindle Paperwhite (16GB)",
    category: "electronics",
    image: "https://images-na.ssl-images-amazon.com/images/I/61FnliCRFBL._AC_SL1000_.jpg",
    rating: 4.6,
    price: 14999,
    originalPrice: 17999,
    store: "Amazon",
    discount: 17,
    storeUrl: "#"
  },
  {
    id: 9,
    name: "Boat Rockerz 450 Pro",
    category: "accessories",
    image: "https://images-na.ssl-images-amazon.com/images/I/61tZEOsWBOL._AC_SL1500_.jpg",
    rating: 4.2,
    price: 1799,
    originalPrice: 3990,
    store: "Flipkart",
    discount: 55,
    storeUrl: "#"
  },
  {
    id: 10,
    name: "Adidas Ultraboost 22",
    category: "fashion",
    image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/93fbad5b0a874726a6beac78011cca53_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg",
    rating: 4.4,
    price: 14499,
    originalPrice: 17999,
    store: "Myntra",
    discount: 19,
    storeUrl: "#"
  }
];

// ── State ───────────────────────────────────────────────
let compareCart = [];
let currentFilter = 'all';
let currentSort = 'default';
let searchQuery = '';

// ── Helpers ─────────────────────────────────────────────
function formatPrice(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let stars = '';
  for (let i = 0; i < full; i++) stars += '<span class="star">★</span>';
  if (half) stars += '<span class="star">½</span>';
  return stars;
}

function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  setTimeout(() => {
    toast.className = 'toast';
  }, 2800);
}

// ── Render Products ─────────────────────────────────────
function renderProducts(list) {
  const grid = document.getElementById('products-grid');
  const noResults = document.getElementById('no-results');

  if (list.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';
  grid.innerHTML = list.map(p => {
    const inCart = compareCart.some(c => c.id === p.id);
    return `
      <div class="product-card" id="product-${p.id}" data-category="${p.category}">
        <div class="product-img-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/200x150?text=Product'" />
        </div>
        <div class="product-body">
          <div class="product-meta">
            <span class="product-category">${p.category}</span>
            <span class="product-rating">${renderStars(p.rating)} ${p.rating}</span>
          </div>
          <div class="product-name">${p.name}</div>
          <div class="product-store">🏪 ${p.store}</div>
          <div class="product-pricing">
            <span class="product-price">${formatPrice(p.price)}</span>
            <span class="product-original">${formatPrice(p.originalPrice)}</span>
            <span class="product-discount">${p.discount}% off</span>
          </div>
          <div class="product-footer">
            <button
              class="btn-add ${inCart ? 'added' : ''}"
              id="add-btn-${p.id}"
              onclick="addToCompare(${p.id})"
              ${inCart ? 'disabled' : ''}
            >
              ${inCart ? '✓ Added' : '+ Add to Compare'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ── Get Filtered + Sorted Products ─────────────────────
function getFilteredProducts() {
  let list = [...products];

  // Apply category filter
  if (currentFilter !== 'all') {
    list = list.filter(p => p.category === currentFilter);
  }

  // Apply search
  if (searchQuery.trim() !== '') {
    // BUG #4: Search is case-sensitive — missing .toLowerCase() on p.name
    list = list.filter(p => p.name.indexOf(searchQuery.trim()) !== -1);
  }

  // Apply sort
  if (currentSort === 'price-low') {
    // BUG #5: Reversed sort — should be a.price - b.price for ascending
    list.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

// ── Filter ──────────────────────────────────────────────
function filterProducts(category) {
  currentFilter = category;

  // Update active filter button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById('filter-' + category);
  if (activeBtn) activeBtn.classList.add('active');

  renderProducts(getFilteredProducts());
}

// ── Sort ────────────────────────────────────────────────
function sortProducts(value) {
  currentSort = value;
  renderProducts(getFilteredProducts());
}

// ── Search ──────────────────────────────────────────────
function handleHeroSearch() {
  const input = document.getElementById('hero-search-input').value;
  searchQuery = input;
  document.getElementById('nav-search-input').value = input;
  renderProducts(getFilteredProducts());
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function handleNavSearch() {
  const input = document.getElementById('nav-search-input').value;
  searchQuery = input;
  document.getElementById('hero-search-input').value = input;
  renderProducts(getFilteredProducts());
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function clearSearch() {
  searchQuery = '';
  document.getElementById('hero-search-input').value = '';
  document.getElementById('nav-search-input').value = '';
  renderProducts(getFilteredProducts());
}

// Enter key triggers search
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('hero-search-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleHeroSearch();
  });
  document.getElementById('nav-search-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleNavSearch();
  });
});

// ── Add to Compare Cart ─────────────────────────────────
function addToCompare(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // BUG #2: No duplicate check — same product can be added multiple times
  // (the check below is intentionally missing its actual guard)
  const alreadyAdded = compareCart.find(p => p.id === productId);
  if (alreadyAdded) {
    showToast('Product is already in your compare cart.', 'error');
  }

  compareCart.push(product);

  // BUG #1: Cart count increments by 2 — adds 2 instead of 1
  updateCartCount(compareCart.length + 1);

  const btn = document.getElementById('add-btn-' + productId);
  if (btn) {
    btn.textContent = '✓ Added';
    btn.classList.add('added');
    btn.disabled = true;
  }

  renderCartItems();
  showToast(`${product.name} added to Compare Cart! 🛒`, 'success');
}

// ── Update Cart Count ───────────────────────────────────
function updateCartCount(count) {
  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-badge').textContent = count + ' items';
}

// ── Remove from Cart ────────────────────────────────────
function removeFromCart(productId) {
  const index = compareCart.findIndex(p => p.id === productId);
  if (index === -1) return;

  compareCart.splice(index, 1);

  // BUG #3: Cart UI not re-rendered after removal — only count updates
  updateCartCount(compareCart.length);

  // Re-enable the add button on the product card
  const btn = document.getElementById('add-btn-' + productId);
  if (btn) {
    btn.textContent = '+ Add to Compare';
    btn.classList.remove('added');
    btn.disabled = false;
  }

  // Hide comparison table when items change
  document.getElementById('comparison-area').style.display = 'none';

  showToast('Product removed from cart.', '');
}

// ── Render Cart Items ───────────────────────────────────
function renderCartItems() {
  const grid = document.getElementById('cart-items-grid');
  const emptyCart = document.getElementById('empty-cart');
  const cartActions = document.getElementById('cart-actions');

  if (compareCart.length === 0) {
    emptyCart.style.display = 'block';
    grid.style.display = 'none';
    cartActions.style.display = 'none';
    document.getElementById('comparison-area').style.display = 'none';
    return;
  }

  emptyCart.style.display = 'none';
  grid.style.display = 'grid';
  cartActions.style.display = 'flex';

  grid.innerHTML = compareCart.map(p => `
    <div class="cart-item-card" id="cart-card-${p.id}">
      <img class="cart-item-img" src="${p.image}" alt="${p.name}"
           onerror="this.src='https://via.placeholder.com/80x80?text=Img'" />
      <div class="cart-item-name">${p.name}</div>
      <div class="cart-item-store">🏪 ${p.store}</div>
      <div class="cart-item-price">${formatPrice(p.price)}</div>
      <div class="cart-item-rating">${renderStars(p.rating)} ${p.rating}</div>
      <button class="cart-item-remove" onclick="removeFromCart(${p.id})">
        ✕ Remove
      </button>
    </div>
  `).join('');
}

// ── Clear Cart ──────────────────────────────────────────
function clearCart() {
  // Re-enable all add buttons
  compareCart.forEach(p => {
    const btn = document.getElementById('add-btn-' + p.id);
    if (btn) {
      btn.textContent = '+ Add to Compare';
      btn.classList.remove('added');
      btn.disabled = false;
    }
  });
  compareCart = [];
  updateCartCount(0);
  renderCartItems();
  document.getElementById('comparison-area').style.display = 'none';
  showToast('Compare cart cleared.', '');
}
// BUG #8: clearCart is defined but the event listener is never wired to #clear-cart-btn
// (Students need to add: document.getElementById('clear-cart-btn').addEventListener('click', clearCart))

// ── Render Comparison Table ─────────────────────────────
function renderComparisonTable() {
  // BUG #9: No guard clause — table renders even with 0 items
  const tbody = document.getElementById('comparison-tbody');
  const savingsBanner = document.getElementById('savings-banner');

  const prices = compareCart.map(p => p.price);

  // BUG #6: Lowest price logic is inverted — uses > instead of <
  let lowestPrice = prices[0];
  let highestPrice = prices[0];

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > lowestPrice) {
      lowestPrice = prices[i];
    }
    if (prices[i] > highestPrice) {
      highestPrice = prices[i];
    }
  }

  tbody.innerHTML = compareCart.map(p => {
    const isBest = p.price === lowestPrice;
    return `
      <tr class="${isBest ? 'best-price-row' : ''}">
        <td>
          <strong>${p.name}</strong>
          ${isBest ? '<span class="best-price-badge">Best Price</span>' : ''}
        </td>
        <td>${p.store}</td>
        <td class="price-cell">${formatPrice(p.price)}</td>
        <td>${formatPrice(p.originalPrice)}</td>
        <td><span class="product-discount">${p.discount}%</span></td>
        <td>${renderStars(p.rating)} ${p.rating}</td>
      </tr>
    `;
  }).join('');

  // BUG #7: Savings calculated from originalPrice difference, not from actual price difference
  const savings = compareCart.reduce((max, p) => Math.max(max, p.originalPrice), 0)
                - compareCart.reduce((min, p) => Math.min(min, p.originalPrice), 0);

  if (savings > 0) {
    savingsBanner.innerHTML = `
      <span class="savings-icon">💰</span>
      <div class="savings-text">
        <strong>You save ${formatPrice(savings)} by choosing the best deal!</strong>
        <span>Compare more products to find even bigger savings.</span>
      </div>
      <a href="#" class="btn btn-primary btn-sm" onclick="alert('Visit the store directly to purchase this product.')">View Deal</a>
    `;
    savingsBanner.style.display = 'flex';
  } else {
    savingsBanner.style.display = 'none';
  }

  document.getElementById('comparison-area').style.display = 'block';
  document.getElementById('comparison-area').scrollIntoView({ behavior: 'smooth' });
}

// ── Scroll Helpers ──────────────────────────────────────
function scrollToCompare() {
  document.getElementById('compare-section').scrollIntoView({ behavior: 'smooth' });
}

// ── Mobile Menu ─────────────────────────────────────────
function toggleMenu() {
  const links = document.getElementById('nav-links');
  links.classList.toggle('open');
}

// ── Navbar active link on scroll ────────────────────────
window.addEventListener('scroll', () => {
  const sections = ['hero', 'products', 'compare-section', 'about'];
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section && window.scrollY >= section.offsetTop - 100) {
      current = id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href').replace('#', '');
    if (href === current) link.classList.add('active');
  });
});

// ── Init ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(getFilteredProducts());
  renderCartItems();
});
