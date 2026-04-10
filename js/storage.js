// storage.js - работа с localStorage

const STORAGE_KEYS = {
    CALCULATIONS: 'kpi_calculations',
    EMPLOYEES: 'kpi_employees',
    SETTINGS: 'kpi_settings'
};

// Сохранить расчет в историю
function saveCalculation(mode, inputs, result) {
    const calculations = getCalculations();
    
    const calculation = {
        id: Date.now(),
        date: new Date().toISOString(),
        mode: mode,
        inputs: inputs,
        result: result
    };
    
    calculations.unshift(calculation); // Добавляем в начало
    
    // Ограничиваем историю 50 записями
    if (calculations.length > 50) {
        calculations.pop();
    }
    
    localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(calculations));
    return calculation;
}

// Получить все расчеты
function getCalculations() {
    const data = localStorage.getItem(STORAGE_KEYS.CALCULATIONS);
    return data ? JSON.parse(data) : [];
}

// Очистить историю
function clearCalculations() {
    localStorage.removeItem(STORAGE_KEYS.CALCULATIONS);
}

// Сохранить сотрудников
function saveEmployees(employees) {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
}

// Получить сотрудников
function getEmployees() {
    const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : [];
}

// Сохранить настройки
function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// Получить настройки
function getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { theme: 'light' };
}