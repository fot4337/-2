<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Личный кабинет - TechnoLife</title>
    <link rel="stylesheet" href="/static/css/fontawesome/fontawesome-free-6.7.2-web/css/fontawesome.min.css">
    <link rel="stylesheet" href="/static/css/fontawesome/fontawesome-free-6.7.2-web/css/solid.min.css">
    <link rel="stylesheet" href="/static/css/fontawesome/fontawesome-free-6.7.2-web/css/brands.min.css">
    <link rel="stylesheet" href="/static/css/fontawesome/fontawesome-free-6.7.2-web/css/regular.min.css">
    <link rel="stylesheet" href="static/css/personal-account.css">
    <link rel="stylesheet" href="static/css/mobile-override.css">
</head>
<body>
    <header class="header">
        <a href="index.html" class="logo">
            <img src="images/logo.png" alt="TechnoLife">
            <span class="logo-text">TechnoLife</span>
        </a>
        <button class="cart-btn" onclick="window.location.href='cart.html'">
            <i class="fas fa-shopping-cart"></i>
            Корзина
            <span class="cart-count" id="cartCount">0</span>
        </button>
    </header>

    <main>
        <div class="dashboard-container">
            <div class="profile-block" id="profileBlock" style="background:#fff; border-radius:15px; padding:24px 30px 18px 30px; margin-bottom:20px; box-shadow:0 2px 5px rgba(0,0,0,0.07); text-align:center;">
                <div class="profile-title"><i class="fas fa-user-circle"></i> Профиль пользователя</div>
                <div id="profileName" class="profile-name"></div>
                <div id="profileEmail" class="profile-email"></div>
            </div>
            <!-- История заказов -->
            <div class="dashboard-item" style="padding:24px 18px;">
                <div class="dashboard-item-title"><i class="fas fa-history"></i> История заказов</div>
                <div id="ordersHistory"></div>
            </div>
            <!-- История бонусов -->
            <div class="dashboard-item" style="padding:24px 18px;">
                <div class="dashboard-item-title"><i class="fas fa-gift"></i> История бонусов</div>
                <div id="bonusesHistory"></div>
            </div>
            <a href="wallet.html" class="dashboard-item">
                <i class="fas fa-wallet"></i>
                <div class="dashboard-item-title">Кошелек</div>
                <div class="dashboard-item-desc">Баланс и история операций</div>
            </a>
            <a href="cards.html" class="dashboard-item">
                <i class="fas fa-credit-card"></i>
                <div class="dashboard-item-title">Банковские карты</div>
                <div class="dashboard-item-desc">Привязка и удаление карт</div>
            </a>
            <a href="bonuses.html" class="dashboard-item">
                <i class="fas fa-gift"></i>
                <div class="dashboard-item-title">Мои бонусы</div>
                <div class="dashboard-item-desc">Бонусный счет и акции</div>
            </a>
            <a href="#" class="dashboard-item" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i>
                <div class="dashboard-item-title">Выйти</div>
                <div class="dashboard-item-desc">Завершить сеанс</div>
            </a>
        </div>
    </main>
    <script src="/static/js/personal-account.js"></script>
    <script>
        // Пример обновления количества товаров в корзине
        function updateCartCountPA() {
            const count = localStorage.getItem('cartCount') || '0';
            document.getElementById('cartCount').textContent = count;
        }
        updateCartCountPA();
        window.addEventListener('storage', updateCartCountPA);
        // Корректный выход из аккаунта
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('auth_token');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    </script>
</body>
</html>
