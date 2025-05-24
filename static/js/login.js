// --- Вход через серверное API ---
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const icon = document.querySelector('.toggle-password i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}
window.togglePassword = togglePassword;

function showNotification(message, type = 'success') {
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    notification.textContent = message;
    notification.style.background = type === 'error' ? '#e74c3c' : '#2ecc71';
    notification.style.color = '#fff';
    notification.style.position = 'fixed';
    notification.style.left = '50%';
    notification.style.top = '30px';
    notification.style.transform = 'translateX(-50%)';
    notification.style.zIndex = '9999';
    notification.style.padding = '16px 32px';
    notification.style.borderRadius = '10px';
    notification.style.fontSize = '17px';
    notification.style.boxShadow = '0 4px 16px rgba(44,62,80,0.15)';
    notification.style.opacity = '0.98';
    notification.style.display = 'block';
    setTimeout(() => notification.remove(), 3000);
}
window.showNotification = showNotification;

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.token) {
            // Сохраняем токен и пользователя
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('currentUser', JSON.stringify({
                name: data.name || '',
                email: data.email
            }));
            showNotification('Вход выполнен успешно!');
            setTimeout(() => {
                window.location.href = 'personal-account.html';
            }, 1000);
        } else {
            showNotification(data.error || 'Неверный email или пароль', 'error');
        }
    } catch (err) {
        showNotification('Ошибка соединения с сервером', 'error');
    }
}
window.handleLogin = handleLogin;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        try {
            // Для base64-словаря, не JWT
            const tokenData = JSON.parse(atob(token));
            if (tokenData.exp && tokenData.exp * 1000 > Date.now()) {
                window.location.href = 'personal-account.html';
            }
        } catch (e) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('currentUser');
        }
    }
});

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}
['email', 'password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                loginForm.requestSubmit();
            }
        });
    }
});