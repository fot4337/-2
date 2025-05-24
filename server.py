# server.py

from flask import Flask, send_from_directory, request, jsonify
from ssl_config import create_self_signed_cert, get_ssl_context
from card_encryption import CardEncryption
from datetime import timedelta
import os
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import base64

DB_PATH = 'users.db'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Создание таблицы пользователей при первом запуске
with get_db() as conn:
    conn.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        surname TEXT,
        email TEXT UNIQUE,
        password TEXT
    )''')
    conn.commit()

app = Flask(__name__)

# Настройка безопасности
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Strict',
    PERMANENT_SESSION_LIFETIME=timedelta(minutes=30)
)

encryptor = CardEncryption()

# Добавляем заголовки безопасности
@app.after_request
def add_security_headers(response):
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    # CSP полностью отключена для отладки/разработки
    # response.headers['Content-Security-Policy'] = "default-src 'self'"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response

# API для приёма и шифрования карты
@app.route('/api/attach_card', methods=['POST'])
def attach_card():
    data = request.json
    required = ['number', 'expiry', 'cvv', 'holder']
    if not all(k in data for k in required):
        return jsonify({'success': False, 'message': 'Некорректные данные'}), 400
    # Шифруем все данные карты одной строкой
    card_str = f"{data['number']}|{data['expiry']}|{data['cvv']}|{data['holder']}"
    encrypted = encryptor.encrypt_card_data(card_str)
    # Можно сохранить encrypted в БД или файл (демонстрация)
    with open('cards.txt', 'a', encoding='utf-8') as f:
        f.write(encrypted + '\n')
    return jsonify({'success': True, 'message': 'Карта успешно привязана'})

@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.json
    name = data.get('name', '')
    surname = data.get('surname', '')
    email = data.get('email', '').lower()
    password = data.get('password', '')
    if not email or not password:
        return jsonify({'error': 'Email и пароль обязательны'}), 400
    with get_db() as conn:
        if conn.execute('SELECT 1 FROM users WHERE email=?', (email,)).fetchone():
            return jsonify({'error': 'Пользователь уже существует'}), 400
        hash_pw = generate_password_hash(password)
        conn.execute('INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)',
                     (name, surname, email, hash_pw))
        conn.commit()
    return jsonify({'message': 'Регистрация успешна'})

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.json
    email = data.get('email', '').lower()
    password = data.get('password', '')
    with get_db() as conn:
        user = conn.execute('SELECT * FROM users WHERE email=?', (email,)).fetchone()
        if not user or not check_password_hash(user['password'], password):
            return jsonify({'error': 'Неверный email или пароль'}), 401
        # Генерируем простой токен (НЕ для продакшена)
        token_data = {
            'email': user['email'],
            'name': user['name'],
            'exp': 9999999999
        }
        token = base64.b64encode(str(token_data).encode()).decode()
        return jsonify({'token': token, 'email': user['email'], 'name': user['name']})

# Маршруты
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_files(path):
    return send_from_directory('.', path)

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('css', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)

@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory('images', filename)

if __name__ == '__main__':
    # Создаем сертификат, если его нет
    if not (os.path.exists('server.crt') and os.path.exists('server.key')):
        create_self_signed_cert()

    # Запускаем сервер с SSL
    context = get_ssl_context()
    print('Сервер запущен! Откройте https://localhost:443 или https://127.0.0.1:443 в браузере.')
    app.run(host='0.0.0.0', port=443, ssl_context=context)