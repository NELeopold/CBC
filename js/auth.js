// auth.js - Авторизация и проверка прав

const CURRENT_USER_KEY = 'kpi_current_user';

// Проверка авторизации
function checkAuth() {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (!currentUser) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(currentUser);
}

// Получить текущего пользователя
function getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Проверка прав
function hasPermission(permission) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const permissions = {
        'admin': {
            canManageEmployees: true,
            canDeleteHistory: true,
            canViewHistory: true,
            canViewEmployeesTab: true,
            canViewKpiTab: false,
            canViewRoiTab: false,
            canViewRevenueTab: false
        },
        'user': {
            canManageEmployees: false,
            canDeleteHistory: false,
            canViewHistory: false,
            canViewEmployeesTab: false,
            canViewKpiTab: true,
            canViewRoiTab: true,
            canViewRevenueTab: true
        }
    };
    
    return permissions[user.role]?.[permission] || false;
}

// Выход
function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'index.html';
}

// Отображение информации о пользователе
function displayUserInfo() {
    const user = getCurrentUser();
    const userInfoDiv = document.getElementById('userInfo');
    
    if (user && userInfoDiv) {
        const roleNames = {
            'admin': 'Администратор',
            'user': 'Пользователь'
        };
        
        userInfoDiv.innerHTML = `
            <span style="font-size:0.85em; color:#666;">
                ${user.username} • ${roleNames[user.role] || user.role}
            </span>
        `;
    }
}

// Настройка видимости вкладок в зависимости от роли
function setupTabsByRole() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Находим все кнопки режимов
    const roiBtn = document.querySelector('.mode-btn[data-mode="roi"]');
    const revenueBtn = document.querySelector('.mode-btn[data-mode="revenue"]');
    const kpiBtn = document.querySelector('.mode-btn[data-mode="kpi"]');
    const employeesBtn = document.querySelector('.mode-btn[data-mode="employees"]');
    
    if (user.role === 'admin') {
        // Админ: скрываем ROI, Доход, KPI, показываем только Сотрудники
        if (roiBtn) roiBtn.style.display = 'none';
        if (revenueBtn) revenueBtn.style.display = 'none';
        if (kpiBtn) kpiBtn.style.display = 'none';
        if (employeesBtn) employeesBtn.style.display = 'block';
        
        // Делаем кнопку "Сотрудники" активной
        if (employeesBtn) employeesBtn.classList.add('active');
        
        // Переключаем на режим сотрудников
        setTimeout(() => {
            if (typeof switchMode === 'function') {
                switchMode('employees');
            }
        }, 100);
    } else {
        // Пользователь: показываем ROI, Доход, KPI, скрываем Сотрудники
        if (roiBtn) roiBtn.style.display = 'block';
        if (revenueBtn) revenueBtn.style.display = 'block';
        if (kpiBtn) kpiBtn.style.display = 'block';
        if (employeesBtn) employeesBtn.style.display = 'none';
        
        // Делаем кнопку ROI активной
        if (roiBtn) roiBtn.classList.add('active');
        
        // Переключаем на режим ROI
        setTimeout(() => {
            if (typeof switchMode === 'function') {
                switchMode('roi');
            }
        }, 100);
    }
}

// Настройка видимости истории
function setupHistoryVisibility() {
    const historySection = document.getElementById('historySection');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    if (!historySection) return;
    
    if (hasPermission('canViewHistory')) {
        historySection.style.display = 'block';
        if (clearHistoryBtn) {
            clearHistoryBtn.style.display = hasPermission('canDeleteHistory') ? 'block' : 'none';
        }
        if (typeof loadHistory === 'function') {
            loadHistory();
        }
    } else {
        historySection.style.display = 'none';
    }
}

// Инициализация auth на dashboard
function initAuth() {
    const user = checkAuth();
    if (user) {
        displayUserInfo();
        setupTabsByRole();
        setupHistoryVisibility();
        
        // Кнопка выхода
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    }
}