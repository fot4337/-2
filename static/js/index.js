// --- Фильтрация по цене ---
function applyPriceFilter() {
    const min = parseInt(document.getElementById('minPrice')?.value || '0', 10);
    const max = parseInt(document.getElementById('maxPrice')?.value || '0', 10);
    let filtered = products;
    if (!isNaN(min) && min > 0) {
        filtered = filtered.filter(p => p.price >= min);
    }
    if (!isNaN(max) && max > 0) {
        filtered = filtered.filter(p => p.price <= max);
    }
    renderProducts(filtered);
}

// --- Инициализация фильтра по цене (без инлайна) ---
function initPriceFilter() {
    const btn = document.querySelector('.apply-filter-btn');
    if (btn) {
        btn.addEventListener('click', applyPriceFilter);
    }
    // Enter по input'ам
    ['minPrice','maxPrice'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keydown', e => {
                if (e.key === 'Enter') applyPriceFilter();
            });
        }
    });
}

// --- Инициализация сортировки (без инлайна) ---
function initSort() {
    const select = document.getElementById('sortSelect');
    if (!select) return;
    select.addEventListener('change', function() {
        sortProducts(this.value);
    });
}

// --- Сортировка товаров ---
function sortProducts(type) {
    let sorted = [...products];
    if (type === 'price-asc') sorted.sort((a,b)=>a.price-b.price);
    else if (type === 'price-desc') sorted.sort((a,b)=>b.price-a.price);
    else if (type === 'name') sorted.sort((a,b)=>a.name.localeCompare(b.name,'ru'));
    else if (type === 'popular') sorted = sorted; // TODO: сортировка по популярности
    renderProducts(sorted);
}

// --- Инициализация фильтров и сортировки при загрузке ---
document.addEventListener('DOMContentLoaded', () => {
    initPriceFilter();
    initSort();
});
// --- Глобальный массив товаров из DOM ---
function getAllProductsFromDOM() {
    return Array.from(document.querySelectorAll('.product-card')).map((card, idx) => {
        return {
            id: idx + 1,
            name: card.querySelector('.product-title')?.textContent?.trim() || '',
            description: card.querySelector('.product-desc, .product-description')?.textContent?.trim() || '',
            price: parseInt(card.querySelector('.product-price')?.textContent?.replace(/[^\d]/g, '') || '0', 10),
            image: card.querySelector('img')?.getAttribute('src') || '',
            category: card.getAttribute('data-category')?.toLowerCase().trim() || ''
        };
    });
}

let products = getAllProductsFromDOM();

// --- Рендер товаров (для поиска и категорий) ---
function renderProducts(productsToShow) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-bottom">
                    <span class="product-price">${product.price.toLocaleString('ru-RU')}</span>
                    <div class="product-actions">
                        <button class="btn-buy">В корзину</button>
                        <button class="btn-details">Подробнее</button>
                        <button class="btn-fav">В избранное</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    assignProductCardHandlers();
}

function assignProductCardHandlers() {
    document.querySelectorAll('.product-card').forEach(card => {
        const productName = card.querySelector('.product-title')?.textContent;
        const product = products.find(p => p.name === productName);
        if (!product) return;
        card.querySelector('.btn-buy')?.addEventListener('click', () => addToCart(product.id));
        card.querySelector('.btn-details')?.addEventListener('click', () => showDetails(product.id));
        card.querySelector('.btn-fav')?.addEventListener('click', () => addToWishlist(product.id));
    });
}

// --- Заглушки для addToCart, addToWishlist, showDetails ---
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
    // Для совместимости с личным кабинетом
    localStorage.setItem('cartCount', count);
}

// --- Кастомное уведомление (toast) ---
function showToast(message, color = '#2ecc71') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.background = color;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const idx = cartItems.findIndex(item => item.id === productId);
    if (idx !== -1) {
        cartItems[idx].quantity += 1;
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    showToast('Товар добавлен в корзину!');
}

function addToWishlist(productId) {
    alert('Товар добавлен в избранное!');
    // Здесь можно реализовать добавление в localStorage/wishlist
}
function showDetails(productId) {
    alert('Страница товара в разработке.');
}

// --- Категории ---
function initCategoryFilters() {
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const category = (e.target.dataset.category || '').toLowerCase().trim();
            if (!category || category === 'all') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => (p.category || '').toLowerCase().trim() === category);
                renderProducts(filtered);
            }
        });
    });
}

// --- Поиск ---
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    });
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
    products = getAllProductsFromDOM();
    assignProductCardHandlers();
    initCategoryFilters();
    initSearch();
    updateCartCount();

    // Кнопка входа
    const loginBtn = document.querySelector('.action-btn[onclick*="login.html"]');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
    // Кнопка корзины
    const cartBtn = document.querySelector('.action-btn[onclick*="cart.html"]');
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
    // Кнопка регистрации (если есть)
    const registerBtn = document.querySelector('.action-btn[onclick*="register.html"]');
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    }
    // Боковое меню
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('sidebar').classList.toggle('active');
        });
    }
    // Кнопка подарочных карт
    const giftBtn = document.querySelector('.gift-card-btn');
    if (giftBtn) {
        giftBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'gift-cards.html';
        });
    }
});
