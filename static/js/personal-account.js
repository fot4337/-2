// Отображение профиля текущего пользователя
function showCurrentUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    document.getElementById('profileName').textContent = currentUser.name || '';
    document.getElementById('profileEmail').textContent = currentUser.email || '';
}

// --- История заказов ---
function getCurrentUserEmail() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user && user.email ? user.email : null;
}

function getOrders() {
    const email = getCurrentUserEmail();
    if (!email) return [];
    return JSON.parse(localStorage.getItem('orders_' + email) || '[]');
}
function saveOrders(orders) {
    const email = getCurrentUserEmail();
    if (!email) return;
    localStorage.setItem('orders_' + email, JSON.stringify(orders));
}

function renderOrdersHistory() {
    const container = document.getElementById('ordersHistory');
    const orders = getOrders();
    if (!orders.length) {
        container.innerHTML = `<div style="color:#888; padding:28px 0; text-align:center;">
            <div style="font-size:1.2em; font-weight:600; color:#1976D2; margin-bottom:10px;">У вас пока нет заказов</div>
            <div style="font-size:1.05em; color:#444; margin-bottom:12px;">Здесь появятся ваши покупки.</div>
        </div>`;
        return;
    }
    container.innerHTML = `<table style="width:100%;font-size:15px;border-collapse:collapse;">
        <tr style='background:#f5f7fa;'><th>Дата</th><th>Товары</th><th>Адрес</th><th>Статус</th><th></th></tr>
        ${orders.map((o,i) => `
            <tr style='border-bottom:1px solid #eee;'>
                <td>${new Date(o.date).toLocaleString()}</td>
                <td>${o.items.map(it => `${it.name} (${it.quantity} шт.)`).join('<br>')}</td>
                <td>${o.address ? `${o.address.city}, ${o.address.street}, д.${o.address.house}, кв.${o.address.apartment}` : '-'}</td>
                <td>${o.status || 'Выполнен'}</td>
                <td><button onclick="repeatOrder(${i})" style='background:#2196F3;color:#fff;border:none;padding:6px 12px;border-radius:5px;cursor:pointer;'>Повторить</button></td>
            </tr>
        `).join('')}</table>`;
}

window.repeatOrder = function(idx) {
    const orders = getOrders();
    const order = orders[idx];
    if (!order) return;
    // Кладём товары в корзину
    localStorage.setItem('cartItems', JSON.stringify(order.items));
    window.location.href = 'cart.html';
}

// --- История бонусов и прогресс ---
function getBonusesHistory() {
    const email = getCurrentUserEmail();
    if (!email) return [];
    return JSON.parse(localStorage.getItem('bonusesHistory_' + email) || '[]');
}
function saveBonusesHistory(history) {
    const email = getCurrentUserEmail();
    if (!email) return;
    localStorage.setItem('bonusesHistory_' + email, JSON.stringify(history));
}
function renderBonusesHistory() {
    const container = document.getElementById('bonusesHistory');
    const history = getBonusesHistory();
    if (!history.length) {
        container.innerHTML = `<div style="color:#888; text-align:center; padding:18px 0;">Нет операций с бонусами</div>`;
        return;
    }
    container.innerHTML = `<ul style='list-style:none;padding:0;max-height:320px;overflow-y:auto;'>${history.map(h =>
        `<li style='margin-bottom:10px; background:#f7faff; border-radius:8px; padding:10px 14px; display:flex; align-items:center; gap:12px;'>
            <i class="fas ${h.amount>0?'fa-arrow-down':'fa-arrow-up'}" style="color:${h.amount>0?'#2196F3':'#e74c3c'};font-size:1.2em;"></i>
            <span style='color:${h.amount>0?'#2196F3':'#e74c3c'};font-weight:bold;min-width:60px;display:inline-block;'>${h.amount>0?'+':''}${h.amount}</span>
            <span style='color:#555;flex:1;'>${h.desc||''}</span>
            <span style='color:#aaa;font-size:12px;'>${new Date(h.date).toLocaleDateString()}</span>
        </li>`).join('')}</ul>`;
}
function renderBonusesProgress() {
    // Безлимит — ничего не отображаем
    if (document.getElementById('bonusesProgress')) {
        document.getElementById('bonusesProgress').innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    showCurrentUserProfile();
    renderOrdersHistory();
    renderBonusesHistory();
    renderBonusesProgress();
});