<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход в аккаунт - TechnoLife</title>
    <link rel="stylesheet" href="/static/css/login.css">
    <link rel="stylesheet" href="/static/css/mobile-override.css">
    <link rel="stylesheet" href="/css/fontawesome/fontawesome-free-6.7.2-web/css/fontawesome.min.css">
    <link rel="stylesheet" href="/css/fontawesome/fontawesome-free-6.7.2-web/css/solid.min.css">
    <link rel="stylesheet" href="/css/fontawesome/fontawesome-free-6.7.2-web/css/brands.min.css">
    <link rel="stylesheet" href="/css/fontawesome/fontawesome-free-6.7.2-web/css/regular.min.css">
</head>
</head>
<body>
    <div class="login-container">
        <form class="login-form" method="post" action="">
            <h2>Вход в личный кабинет</h2>
            <?php
            $error = '';
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $login = $_POST['login'] ?? '';
                $password = $_POST['password'] ?? '';
                if ($login === 'admin' && $password === 'Admin123') {
                    session_start();
                    $_SESSION['user'] = 'admin';
                    header('Location: personal-account.html');
                    exit();
                } else {
                    $error = 'Неверный логин или пароль';
                }
            }
            if ($error) {
                echo '<div class="login-error">' . htmlspecialchars($error) . '</div>';
            }
            ?>
            <label for="login">Логин</label>
            <input type="text" id="login" name="login" required autofocus>
            <label for="password">Пароль</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Войти</button>
        </form>
    </div>
</body>
</html>
