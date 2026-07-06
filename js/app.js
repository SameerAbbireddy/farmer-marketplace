/**
 * AgroMarket - Premium Frontend Logic
 */

// 1. Data Mockup
const DB_PRODUCTS = [
    { id: 101, name: "Organic Red Tomatoes", price: 45, unit: "kg", category: "vegetables", farmer: "Green Valley Farm", rating: 4.8, img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", badge: "Bestseller" },
    { id: 102, name: "Fresh Hass Avocado", price: 120, unit: "piece", category: "fruits", farmer: "SunSide Orchards", rating: 4.9, img: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", badge: "Organic" },
    { id: 103, name: "Pure A2 Cow Milk", price: 65, unit: "liter", category: "dairy", farmer: "Daisy Meadows", rating: 4.7, img: "https://images.unsplash.com/photo-1550583724-1255818c053b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", badge: null },
    { id: 104, name: "Honey Crisp Apples", price: 180, unit: "kg", category: "fruits", farmer: "Apple Ridge", rating: 4.9, img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", badge: "Seasonal" },
    { id: 105, name: "Farm Fresh Eggs", price: 90, unit: "dozen", category: "dairy", farmer: "Feather Hill", rating: 4.6, img: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", badge: "Free Range" },
    { id: 106, name: "Raw Wildflower Honey", price: 350, unit: "500g", category: "honey", farmer: "Bee Happy Apiary", rating: 5.0, img: "https://images.unsplash.com/photo-1587049352847-4d4b1ed748d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", badge: "Raw" },
    { id: 107, name: "Organic Spinach", price: 30, unit: "bunch", category: "vegetables", farmer: "Leafy Lanes", rating: 4.5, img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", badge: "Fresh" },
    { id: 108, name: "Grass-Fed Beef Steaks", price: 850, unit: "kg", category: "meat", farmer: "Highland Pastures", rating: 4.8, img: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", badge: "Premium" },
];

const ML_RECOMMENDED = [
    DB_PRODUCTS[0], // Tomatoes
    DB_PRODUCTS[6], // Spinach
    DB_PRODUCTS[1], // Avocado
    DB_PRODUCTS[3]  // Apples
];

// 2. State & DOM
let cart = [];

const productsGrid = document.getElementById('productsGrid');
const recommendedGrid = document.getElementById('recommendedGrid');
const categoryPills = document.querySelectorAll('.category-pill');
const cartBadge = document.getElementById('cartBadge');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalValue = document.getElementById('cartTotalValue');
const checkoutBtn = document.getElementById('checkoutBtn');
const navbar = document.getElementById('navbar');

// 3. Render Utils
const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

function createCardHTML(product) {
    const badgeHTML = product.badge ? `<div class="card-badge">${product.badge}</div>` : '';
    return `
        <div class="product-card" data-aos="fade-up">
            ${badgeHTML}
            <button class="wishlist-btn" onclick="toggleWishlist(this)"><i class="fa-solid fa-heart"></i></button>
            <div class="card-img-wrap">
                <img src="${product.img}" alt="${product.name}" loading="lazy">
            </div>
            <div class="card-content">
                <div class="card-category">${product.category}</div>
                <h3 class="card-title">${product.name}</h3>
                <div class="card-farmer"><i class="fa-solid fa-tractor"></i> ${product.farmer}</div>
                <div class="card-footer">
                    <div class="card-price">₹${product.price} <span>/ ${product.unit}</span></div>
                    <button class="add-btn" onclick="addToCart(${product.id}, this)" aria-label="Add to cart">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderProducts(category = 'all') {
    productsGrid.innerHTML = ''; 
    const filtered = category === 'all' ? DB_PRODUCTS : DB_PRODUCTS.filter(p => p.category === category);
    
    if (filtered.length === 0) {
        productsGrid.innerHTML = `<p style="text-align:center; grid-column: 1/-1; color: var(--text-secondary);">No products found in this category.</p>`;
        return;
    }
    
    filtered.forEach((p, index) => {
        const cardStr = createCardHTML(p);
        productsGrid.insertAdjacentHTML('beforeend', cardStr);
        productsGrid.lastElementChild.setAttribute('data-aos-delay', (index % 4) * 100);
    });
    
    initScrollAnimations();
}

function renderRecommendations() {
    recommendedGrid.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
    
    setTimeout(() => {
        recommendedGrid.innerHTML = '';
        ML_RECOMMENDED.forEach((p, index) => {
            const cardStr = createCardHTML(p);
            recommendedGrid.insertAdjacentHTML('beforeend', cardStr);
            recommendedGrid.lastElementChild.setAttribute('data-aos-delay', (index % 4) * 100);
        });
        initScrollAnimations();
    }, 1200);
}

// 4. Cart & Interactions
window.toggleWishlist = (btn) => {
    btn.classList.toggle('active');
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => btn.style.transform = '', 200);
}

window.addToCart = (productId, btnEl) => {
    const product = DB_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) existingItem.qty += 1;
    else cart.push({ ...product, qty: 1 });

    const icon = btnEl.querySelector('i');
    icon.className = 'fa-solid fa-check';
    btnEl.classList.add('added');
    
    setTimeout(() => {
        icon.className = 'fa-solid fa-plus';
        btnEl.classList.remove('added');
    }, 1500);

    updateCartUI();
    if(cart.length === 1 && cart[0].qty === 1) toggleCart(true);
};

window.updateCartQty = (productId, delta) => {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].qty += delta;
        if (cart[itemIndex].qty <= 0) cart.splice(itemIndex, 1);
        updateCartUI();
    }
};

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.innerText = totalItems;
    
    if (totalItems > 0) {
        cartBadge.style.transform = 'translate(25%, -25%) scale(1.2)';
        setTimeout(() => cartBadge.style.transform = 'translate(25%, -25%) scale(1)', 200);
    }

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>Your basket is empty</p>
                <button class="btn btn-outline" onclick="toggleCart(false)" style="margin-top: 1rem;">Continue Shopping</button>
            </div>
        `;
        cartTotalValue.innerText = '₹0.00';
        checkoutBtn.disabled = true;
        return;
    }

    let cartHTML = '';
    let totalValue = 0;

    cart.forEach(item => {
        totalValue += item.price * item.qty;
        cartHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                        <span class="cart-item-price">₹${item.price}</span>
                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)"><i class="fa-solid fa-minus"></i></button>
                            <span style="font-weight: 600; font-size: 0.9rem;">${item.qty}</span>
                            <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = cartHTML;
    cartTotalValue.innerText = formatCurrency(totalValue);
    checkoutBtn.disabled = false;
}

window.toggleCart = (show) => {
    if (show) {
        cartOverlay.classList.add('active');
        cartDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        cartOverlay.classList.remove('active');
        cartDrawer.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 5. Scroll & Ticker logic
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
}

function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });
}

function initTicker() {
    const tickerContainer = document.getElementById('tickerContent');
    const items = [
        { name: "Tomatoes", price: "₹45/kg", trend: "down" },
        { name: "Onions", price: "₹30/kg", trend: "up" },
        { name: "Wheat", price: "₹28/kg", trend: "up" },
        { name: "Potatoes", price: "₹22/kg", trend: "down" },
        { name: "Apples (Shimla)", price: "₹180/kg", trend: "up" },
        { name: "Carrots", price: "₹50/kg", trend: "down" }
    ];
    let html = '';
    for(let i=0; i<3; i++) {
        items.forEach(item => {
            const icon = item.trend === 'up' ? '<i class="fa-solid fa-caret-up ticker-up"></i>' : '<i class="fa-solid fa-caret-down ticker-down"></i>';
            html += `<div class="ticker-item"><span>Live Market: ${item.name}</span> <span class="ticker-price">${item.price}</span> ${icon}</div>`;
        });
    }
    tickerContainer.innerHTML = html;
}

// 6. Bootstrap
document.addEventListener('DOMContentLoaded', () => {
    initTicker();
    initNavbarScroll();
    
    categoryPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            categoryPills.forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            renderProducts(e.target.getAttribute('data-category'));
        });
    });

    openCartBtn.addEventListener('click', () => toggleCart(true));
    closeCartBtn.addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleCart(false); });
    
    renderRecommendations();
    renderProducts('all');
    updateCartUI();
});
