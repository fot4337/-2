// Инициализация событий для строгой CSP на странице cart.html

document.addEventListener('DOMContentLoaded', function () {
    // Кнопки в шапке
    const giftCardBtn = document.getElementById('giftCardBtn');
    if (giftCardBtn) {
        giftCardBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'gift-cards.html';
        });
    }
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }

    // Закрытие модальных окон
    const closeAddressModalBtn = document.getElementById('closeAddressModalBtn');
    if (closeAddressModalBtn) {
        closeAddressModalBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (typeof closeAddressModal === 'function') closeAddressModal();
        });
    }
    const closeCardSelectModalBtn = document.getElementById('closeCardSelectModalBtn');
    if (closeCardSelectModalBtn) {
        closeCardSelectModalBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (typeof closeCardSelectModal === 'function') closeCardSelectModal();
        });
    }

    // Форма адреса
    const addressForm = document.getElementById('addressForm');
    if (addressForm) {
        addressForm.addEventListener('submit', function (e) {
            if (typeof submitAddress === 'function') {
                submitAddress(e);
            }
        });
    }
    // Форма выбора карты
    const cardSelectForm = document.getElementById('cardSelectForm');
    if (cardSelectForm) {
        cardSelectForm.addEventListener('submit', function (e) {
            if (typeof submitCardSelect === 'function') {
                submitCardSelect(e);
            }
        });
    }

    // Форматирование полей карты
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function () {
            if (typeof formatCardNumber === 'function') formatCardNumber(cardNumber);
        });
    }
    const cardHolder = document.getElementById('cardHolder');
    if (cardHolder) {
        cardHolder.addEventListener('input', function () {
            cardHolder.value = cardHolder.value.toUpperCase();
        });
    }
    const expiry = document.getElementById('expiry');
    if (expiry) {
        expiry.addEventListener('input', function () {
            if (typeof formatExpiry === 'function') formatExpiry(expiry);
        });
    }
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function () {
            cvv.value = cvv.value.replace(/\D/g, '');
        });
    }

    // Синхронизация счетчика корзины
    function updateCartCountCart() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountEls = document.querySelectorAll('.cart-count, #cartCount');
        cartCountEls.forEach(el => el.textContent = count);
        localStorage.setItem('cartCount', count);
    }
    updateCartCountCart();
    window.addEventListener('storage', updateCartCountCart);

    // Проверка загрузки cart.js
    if (typeof displayCart !== 'function') {
        // Показываем toast вместо alert для CSP
        if (typeof showToast === 'function') {
            showToast('cart.js не загружен! Проверьте путь подключения скрипта.', '#e74c3c');
        } else {
            // fallback
            console.error('cart.js не загружен! Проверьте путь подключения скрипта.');
        }
    }
});
