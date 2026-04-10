// auth-page.js - логика для страницы входа/регистрации

const USERS_KEY = 'kpi_users';
const CURRENT_USER_KEY = 'kpi_current_user';

// Предустановленный администратор
const DEFAULT_ADMIN = {
    id: 'admin_1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@kpi-app.com',
    role: 'admin',
    createdAt: new Date().toISOString()
};

// Инициализация - создаем админа если его нет
function initAdmin() {
    let users = getUsers();
    console.log('Текущие пользователи:', users);
    
    const adminExists = users.find(u => u.role === 'admin');
    
    if (!adminExists) {
        users.push(DEFAULT_ADMIN);
        saveUsers(users);
        console.log('Администратор создан: admin / admin123');
        console.log('Все пользователи после создания:', getUsers());
    } else {
        console.log('Администратор уже существует');
    }
}

// Получить всех пользователей
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    const parsedUsers = users ? JSON.parse(users) : [];
    console.log('getUsers() вернул:', parsedUsers);
    return parsedUsers;
}

// Сохранить пользователей
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    console.log('Пользователи сохранены:', users);
}

// Зарегистрировать пользователя (только роль "user")
function registerUser(username, email, password) {
    const users = getUsers();
    
    // Проверка на существующего пользователя
    if (users.find(u => u.username === username)) {
        throw new Error('Пользователь с таким именем уже существует');
    }
    
    if (users.find(u => u.email === email)) {
        throw new Error('Пользователь с таким email уже существует');
    }
    
    // Создание нового пользователя (только роль "user")
    const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        password: password,
        role: 'user',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    console.log('Новый пользователь зарегистрирован:', newUser);
    return newUser;
}

// Вход пользователя
function loginUser(username, password) {
    const users = getUsers();
    console.log('Попытка входа:', username, password);
    console.log('Все пользователи:', users);
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        console.log('Пользователь не найден или пароль неверен');
        throw new Error('Неверное имя пользователя или пароль');
    }
    
    console.log('Пользователь найден:', user);
    
    const currentUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAuthenticated: true
    };
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    console.log('Текущий пользователь сохранен:', currentUser);
    
    return currentUser;
}

// Показать ошибку
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// Показать успех
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

// Переключение табов
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tab = btn.dataset.tab;
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.remove('active');
        
        if (tab === 'login') {
            document.getElementById('loginForm').classList.add('active');
        } else {
            document.getElementById('registerForm').classList.add('active');
        }
    });
});

// Регистрация (только пользователь)
document.getElementById('registerBtn').addEventListener('click', () => {
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Валидация
    if (!username || !email || !password || !confirmPassword) {
        showError('Заполните все поля!');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Пароли не совпадают!');
        return;
    }
    
    if (password.length < 4) {
        showError('Пароль должен быть не менее 4 символов!');
        return;
    }
    
    if (!email.includes('@')) {
        showError('Введите корректный email!');
        return;
    }
    
    if (username.length < 3) {
        showError('Имя пользователя должно быть не менее 3 символов!');
        return;
    }
    
    try {
        registerUser(username, email, password);
        showSuccess('Регистрация прошла успешно! Теперь войдите в систему.');
        
        // Очищаем форму
        document.getElementById('regUsername').value = '';
        document.getElementById('regEmail').value = '';
        document.getElementById('regPassword').value = '';
        document.getElementById('regConfirmPassword').value = '';
        
        // Переключаем на форму входа
        document.querySelector('.tab-btn[data-tab="login"]').click();
        
    } catch(error) {
        showError(error.message);
    }
});

// Вход
document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    console.log('Нажата кнопка входа:', { username, password });
    
    if (!username || !password) {
        showError('Заполните все поля!');
        return;
    }
    
    try {
        const user = loginUser(username, password);
        
        // Приветствие в зависимости от роли
        if (user.role === 'admin') {
            showSuccess(`Добро пожаловать, Администратор ${user.username}!`);
        } else {
            showSuccess(`Добро пожаловать, ${user.username}!`);
        }
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch(error) {
        showError(error.message);
    }
});

// Функция для очистки localStorage (для отладки)
function clearAllData() {
    localStorage.clear();
    console.log('Все данные очищены');
    location.reload();
}

// Добавляем кнопку очистки (только для отладки, можно закомментировать)
// window.clearAllData = clearAllData;

// Вход по Enter
document.getElementById('loginPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('loginBtn').click();
    }
});

document.getElementById('regConfirmPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('registerBtn').click();
    }
});

// Инициализируем администратора при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализация...');
    initAdmin();
    
    // Выводим подсказку в консоль
    console.log('========================================');
    console.log('Для входа как администратор:');
    console.log('Логин: admin');
    console.log('Пароль: admin123');
    console.log('========================================');
});