const products = [
    {
        id: 1,
        name: "Vita-C Cleansing Cream",
        price: 1515.00,
        category: "cleanser",
        image: "./assets/images/product_cleanser_1784868911548.png",
        rating: 5,
        description: "A gentle cleansing cream enriched with Vitamin C to brighten your skin while removing impurities. Perfect for daily use to leave your skin feeling fresh and hydrated."
    },
    {
        id: 2,
        name: "Hydrated Serum",
        price: 3333.00,
        category: "serum",
        image: "./assets/images/product_serum_1784868924066.png",
        rating: 5,
        description: "An intensive hydrating serum formulated to deliver deep moisture and plumpness to your skin. Lightweight and fast-absorbing for a radiant glow."
    },
    {
        id: 3,
        name: "Detox Hydrated Serum",
        price: 4545.00,
        category: "serum",
        image: "./assets/images/product_detox_1784868937761.png",
        rating: 5,
        description: "Purify and hydrate simultaneously with our detox serum. Helps clear out pores while maintaining essential moisture balance for a flawless complexion."
    },
    {
        id: 4,
        name: "Night Salicylic Acid",
        price: 2022.00,
        category: "serum",
        image: "./assets/images/hero_serum_1784868900274.png",
        rating: 4,
        description: "Overnight treatment featuring salicylic acid to target blemishes and uneven texture. Wake up to clearer, smoother skin."
    },
    {
        id: 5,
        name: "Daily Moisture Lotion",
        price: 2575.00,
        category: "moisturizer",
        image: "./assets/images/product_serum_1784868924066.png",
        rating: 5,
        description: "A staple for your skincare routine. This lotion provides long-lasting hydration without feeling greasy. Suitable for all skin types."
    },
    {
        id: 6,
        name: "Ginger Root Extract Serum",
        price: 3614.00,
        category: "serum",
        image: "./assets/images/product_detox_1784868937761.png",
        rating: 5,
        description: "Revitalize your skin with the power of ginger root extract. Known for its anti-aging and antioxidant properties, this serum protects and firms."
    },
    {
        id: 7,
        name: "Barrier Repair Cream",
        price: 2899.00,
        category: "moisturizer",
        image: "./assets/images/product_serum_1784868924066.png",
        rating: 5,
        description: "Ceramide-rich moisturizer that restores the skin barrier and locks in hydration for soft, healthy-looking skin all day."
    },
    {
        id: 8,
        name: "Glow Reset Toner",
        price: 1899.00,
        category: "cleanser",
        image: "./assets/images/product_cleanser_1784868911548.png",
        rating: 4,
        description: "A refreshing toner to reduce dullness, prep skin for treatment, and maintain a balanced, dewy complexion."
    },
    {
        id: 9,
        name: "Rose Dew Essence",
        price: 2650.00,
        category: "serum",
        image: "./assets/images/product_detox_1784868937761.png",
        rating: 5,
        description: "Lightweight rose-infused essence that boosts hydration, smooths texture, and leaves skin luminous and calm."
    },
    {
        id: 10,
        name: "Soft Reset Cleanser",
        price: 1749.00,
        category: "cleanser",
        image: "./assets/images/product_cleanser_1784868911548.png",
        rating: 5,
        description: "A low-foam gel cleanser that removes makeup, sunscreen, and daily buildup without stripping the skin barrier."
    },
    {
        id: 11,
        name: "Night Renewal Oil",
        price: 4299.00,
        category: "serum",
        image: "./assets/images/hero_serum_1784868900274.png",
        rating: 5,
        description: "Nourishing overnight facial oil designed to support skin repair, boost elasticity, and improve radiance while you sleep."
    },
    {
        id: 12,
        name: "Cloud Cream SPF 50",
        price: 3199.00,
        category: "moisturizer",
        image: "./assets/images/product_serum_1784868924066.png",
        rating: 4,
        description: "A lightweight daily sunscreen moisturizer with broad-spectrum protection and a smooth finish that layers beautifully under makeup."
    }
];

const couponOffers = {
    SAVE10: 10,
    SAVE15: 15,
    SAVE20: 20,
    FRESH20: 20
};

let cart = JSON.parse(localStorage.getItem('moistLeafCart')) || [];
let appliedCoupon = '';

// Elements
const productsGrid = document.getElementById('products-grid');
const filterTabs = document.getElementById('filter-tabs');
const productDetailContainer = document.getElementById('product-detail-container');
const searchInput = document.getElementById('site-search');

// Cart Elements
const cartOpenBtn = document.getElementById('cart-open-btn');
const cartCloseBtn = document.getElementById('close-cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartBadge = document.getElementById('cart-badge');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const couponInput = document.getElementById('coupon-input');
const applyCouponBtn = document.getElementById('apply-coupon-btn');
const couponMessage = document.getElementById('coupon-message');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryDiscount = document.getElementById('summary-discount');
const summaryDelivery = document.getElementById('summary-delivery');

function saveCart() {
    localStorage.setItem('moistLeafCart', JSON.stringify(cart));
}

function renderStars(rating) {
    let stars = '';
    for(let i=0; i<5; i++) {
        if(i < rating) stars += '★';
        else stars += '☆';
    }
    return stars;
}

function formatPrice(num) {
    return Number(num).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const couponPercent = appliedCoupon && couponOffers[appliedCoupon] ? couponOffers[appliedCoupon] : 0;
    const discount = subtotal * couponPercent / 100;
    const delivery = subtotal > 2000 ? 0 : (subtotal > 0 ? 149 : 0);
    const total = Math.max(0, subtotal - discount + delivery);

    return { subtotal, discount, delivery, total };
}

function updatePaymentSummary() {
    if (!summarySubtotal || !summaryDiscount || !summaryDelivery || !cartTotalPrice) return;

    const totals = getCartTotals();
    summarySubtotal.textContent = '₹' + formatPrice(totals.subtotal);
    summaryDiscount.textContent = '-₹' + formatPrice(totals.discount);
    summaryDelivery.textContent = '₹' + formatPrice(totals.delivery);
    cartTotalPrice.textContent = '₹' + formatPrice(totals.total);

    if (totals.subtotal > 2000) {
        summaryDelivery.textContent = 'Free';
    }
}

function applyCoupon(code) {
    const normalized = String(code || '').trim().toUpperCase();
    if (!normalized) {
        appliedCoupon = '';
        if (couponMessage) couponMessage.textContent = 'Enter a coupon code.';
        updatePaymentSummary();
        return false;
    }

    if (!couponOffers[normalized]) {
        appliedCoupon = '';
        if (couponMessage) couponMessage.textContent = 'Invalid coupon. Try SAVE10, SAVE15, SAVE20 or FRESH20.';
        updatePaymentSummary();
        return false;
    }

    appliedCoupon = normalized;
    if (couponMessage) couponMessage.textContent = `${normalized} applied successfully! ${couponOffers[normalized]}% off.`;
    updatePaymentSummary();
    return true;
}

// ---------------------------
// Index Page Logic
// ---------------------------
if (productsGrid) {
    function renderProducts(filter = 'all', searchTerm = '') {
        productsGrid.innerHTML = '';

        const normalizedSearch = searchTerm.toLowerCase().trim();
        const filteredProducts = products.filter(product => {
            const matchesFilter = filter === 'all' || product.category === filter;
            const matchesSearch = !normalizedSearch ||
                product.name.toLowerCase().includes(normalizedSearch) ||
                product.category.toLowerCase().includes(normalizedSearch);
            return matchesFilter && matchesSearch;
        });

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p style="grid-column: 1 / -1; padding: 2rem; border: 1px dashed #d9c5b7; border-radius: 16px; color: #7A6F68;">No products match your search.</p>';
            return;
        }

        filteredProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <a href="product.html?id=${product.id}" class="product-link">
                    <div class="product-img-wrap">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                </a>
                <div class="product-info">
                    <a href="product.html?id=${product.id}" class="product-link" style="text-decoration:none; color:inherit;">
                        <h3 class="product-title">${product.name}</h3>
                    </a>
                    <div class="product-price">₹${formatPrice(product.price)}</div>
                    <div class="product-rating">${renderStars(product.rating)}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            `;
            productsGrid.appendChild(card);
        });
    }

    let activeFilter = 'all';
    renderProducts(activeFilter, searchInput ? searchInput.value : '');

    if (filterTabs) {
        filterTabs.addEventListener('click', (e) => {
            if(e.target.classList.contains('tab')) {
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                e.target.classList.add('active');
                activeFilter = e.target.dataset.filter;
                renderProducts(activeFilter, searchInput ? searchInput.value : '');
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderProducts(activeFilter, e.target.value);
        });
    }
}

// ---------------------------
// Product Detail Page Logic
// ---------------------------
if (productDetailContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    if (product) {
        productDetailContainer.innerHTML = `
            <div class="product-detail-layout">
                <div class="pd-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="pd-info">
                    <h1 class="pd-title">${product.name}</h1>
                    <div class="pd-price">₹${formatPrice(product.price)}</div>
                    <div class="pd-rating">${renderStars(product.rating)} <span style="font-size:0.9rem; color:#777; margin-left: 0.5rem;">(124 reviews)</span></div>
                    <p class="pd-description">${product.description}</p>
                    <div class="pd-actions">
                        <button class="primary-btn dark-btn pd-add-btn" onclick="addToCart(${product.id})">Add to Cart - ₹${formatPrice(product.price)}</button>
                    </div>
                    <div class="pd-perks">
                        <p>✅ Free shipping on orders over ₹1,000</p>
                        <p>✅ 30-day money-back guarantee</p>
                        <p>✅ Dermatologist tested</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        productDetailContainer.innerHTML = `<h2>Product not found</h2><a href="index.html">Return to Home</a>`;
    }
}

// ---------------------------
// Cart Logic
// ---------------------------
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

function updateCartUI() {
    if(cartBadge) cartBadge.textContent = cart.length;

    if(cartItemsContainer) {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; margin-top:2rem;">Your cart is empty.</p>';
            appliedCoupon = '';
            if (couponInput) couponInput.value = '';
            if (couponMessage) couponMessage.textContent = '';
        } else {
            cart.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">₹${formatPrice(item.price)}</div>
                        <button class="cart-item-remove" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        updatePaymentSummary();
    }
}

// Make sure addToCart and removeFromCart are globally available 
// since we call them via inline onclick in generated HTML
window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    if(product) {
        cart.push(product);
        saveCart();
        updateCartUI();
        toggleCart();
    }
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

if(cartOpenBtn) cartOpenBtn.addEventListener('click', toggleCart);
if(cartCloseBtn) cartCloseBtn.addEventListener('click', toggleCart);
if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

if(checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if(cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const totals = getCartTotals();
        const deliveryText = totals.delivery === 0 ? 'Free delivery included' : `Delivery ₹${formatPrice(totals.delivery)}`;
        alert('Redirecting to secure payment gateway...\n\n(This is a checkout stub for demonstration purposes. Order total: ₹' + formatPrice(totals.total) + '\n' + deliveryText + ')');
        cart = [];
        appliedCoupon = '';
        saveCart();
        updateCartUI();
        toggleCart();
    });
}

if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', () => {
        applyCoupon(couponInput ? couponInput.value : '');
    });
}

if (couponInput) {
    couponInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            applyCoupon(couponInput.value);
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value;
        if (document.querySelector('.tab.active')) {
            const activeFilter = document.querySelector('.tab.active').dataset.filter;
            renderProducts(activeFilter, searchTerm);
        }
    });
}

const mobileSearchBtn = document.getElementById('mobile-search-btn');
if (mobileSearchBtn && searchInput) {
    mobileSearchBtn.addEventListener('click', () => {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    if (searchInput) {
        searchInput.value = '';
    }
});
