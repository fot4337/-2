// Получение email текущего пользователя
function getCurrentUserEmail() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user && user.email ? user.email : null;
}

// Получение и отображение бонусов пользователя
function getBonuses() {
    const email = getCurrentUserEmail();
    if (!email) return 0;
    return parseInt(localStorage.getItem('bonuses_' + email) || '0', 10);
}
function setBonuses(amount) {
    const email = getCurrentUserEmail();
    if (!email) return;
    localStorage.setItem('bonuses_' + email, amount);
    document.getElementById('bonusesAmount').textContent = amount;
}
setBonuses(getBonuses());

// Загрузка промокодов из файла promokod.txt
let promoCodes = {};
fetch('promokod.txt')
    .then(response => response.text())
    .then(text => {
        // Формат файла: КОД=БОНУС (по одной строке)
        text.split('\n').forEach(line => {
            const [code, value] = line.trim().split('=');
            if (code && value) {
                promoCodes[code.trim().toUpperCase()] = parseInt(value.trim(), 10);
            }
        });
    });

// Обработка промокода
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('promoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const input = document.getElementById('promoInput');
        const code = input.value.trim().toUpperCase();
        const result = document.getElementById('promoResult');

        if (promoCodes[code]) {
            let bonuses = getBonuses();
            bonuses += promoCodes[code];
            setBonuses(bonuses);
            result.textContent = `Промокод активирован! +${promoCodes[code]} бонусов`;
            result.className = 'promo-result success';
            // Чтобы нельзя было использовать один и тот же промокод повторно
            delete promoCodes[code];
        } else {
            result.textContent = 'Промокод не найден или уже использован';
            result.className = 'promo-result error';
        }
        input.value = '';
    });
});
