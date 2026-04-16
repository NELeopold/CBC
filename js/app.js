let currentMode = 'roi';


const modeBtns = document.querySelectorAll('.mode-btn');
const calculateBtn = document.getElementById('calculateBtn');
const themeToggle = document.getElementById('themeToggle');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const subtitleText = document.getElementById('subtitleText');


function switchMode(mode) {
    currentMode = mode;
    
    // Обновляем активную кнопку
    modeBtns.forEach(btn => {
        if (btn.getAttribute('data-mode') === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const subtitles = {
        'roi': 'Калькулятор окупаемости инвестиций',
        'revenue': 'Калькулятор выручки от продаж',
        'kpi': 'Калькулятор эффективности сотрудника',
        'employees': 'Управление сотрудниками'
    };
    
    if (subtitleText) {
        subtitleText.textContent = subtitles[mode] || 'Калькулятор эффективности';
    }
    
    // Скрываем все режимы
    const roiMode = document.getElementById('roiMode');
    const revenueMode = document.getElementById('revenueMode');
    const kpiMode = document.getElementById('kpiMode');
    const employeesMode = document.getElementById('employeesMode');
    
    if (roiMode) roiMode.style.display = 'none';
    if (revenueMode) revenueMode.style.display = 'none';
    if (kpiMode) kpiMode.style.display = 'none';
    if (employeesMode) employeesMode.style.display = 'none';

    const selectedMode = document.getElementById(`${mode}Mode`);
    if (selectedMode) selectedMode.style.display = 'block';

    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) resultsContainer.innerHTML = '';

    if (calculateBtn) {
        const user = getCurrentUser();
        // Если админ ИЛИ режим сотрудников - скрываем кнопку
        if (user?.role === 'admin' || mode === 'employees') {
            calculateBtn.style.display = 'none';
        } else {
            calculateBtn.style.display = 'block';
        }
    }
}

function displayROIResult(result) {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    const grade = getROIGrade(result.roi);
    const progressPercent = Math.min(100, Math.max(0, (result.roi + 100) / 2));
    
    container.innerHTML = `
        <div class="result-card">
            <div class="result-value ${result.roi >= 0 ? 'positive' : 'negative'}">${result.roi.toFixed(1)}%</div>
            <div class="result-status" style="color: ${grade.color}">${grade.text}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%; background: ${result.roi >= 0 ? 'linear-gradient(90deg, #4caf50, #8bc34a)' : 'linear-gradient(90deg, #f44336, #ff9800)'}"></div>
            </div>
        </div>
        <div class="details">
            <div class="detail-card">
                <div class="detail-label">Чистая прибыль</div>
                <div class="detail-value">${result.netProfit.toLocaleString()} ₽</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Коэффициент ROI</div>
                <div class="detail-value">${result.coefficient.toFixed(2)}</div>
            </div>
        </div>
    `;
}

function displayRevenueResult(result) {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    const grade = getRevenueGrade(result.revenue);
    
    container.innerHTML = `
        <div class="result-card">
            <div class="result-value revenue-value">${result.revenue.toLocaleString()} ₽</div>
            <div class="result-status" style="color: ${grade.color}">${grade.text}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.min(100, result.revenue / 100000 * 100)}%; background: linear-gradient(90deg, #2196f3, #64b5f6)"></div>
            </div>
        </div>
        <div class="details">
            <div class="detail-card">
                <div class="detail-label">Количество продаж</div>
                <div class="detail-value">${result.salesCount.toLocaleString()}</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Средний чек</div>
                <div class="detail-value">${result.avgPrice.toLocaleString()} ₽</div>
            </div>
        </div>
    `;
}

function displayKPIResult(result) {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    const grade = getKPIGrade(result.kpi);
    
    container.innerHTML = `
        <div class="result-card">
            <div class="result-value kpi-result-value">${result.kpi.toFixed(1)}%</div>
            <div class="result-status" style="color: ${grade.color}">${grade.text}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${result.kpi}%"></div>
            </div>
        </div>
        <div class="details">
            <div class="detail-card">
                <div class="detail-label">Выполнение плана</div>
                <div class="detail-value">${result.achievement.toFixed(1)}%</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Взвешенный результат</div>
                <div class="detail-value">${result.weightedResult.toFixed(1)}%</div>
            </div>
        </div>
    `;
}

function calculate() {
    try {
        let result;
        let resultValue = '';
        
        switch(currentMode) {
            case 'roi':
                const investment = parseFloat(document.getElementById('investment')?.value);
                const returnAmount = parseFloat(document.getElementById('returnAmount')?.value);
                
                if (isNaN(investment)) throw new Error('Заполните поле "Размер вложений"');
                if (isNaN(returnAmount)) throw new Error('Заполните поле "Доход от вложений"');
                
                result = calculateROI(investment, returnAmount);
                resultValue = result.roi.toFixed(1) + '%';
                displayROIResult(result);
                break;
                
            case 'revenue':
                const salesCount = parseFloat(document.getElementById('salesCount')?.value);
                const avgPrice = parseFloat(document.getElementById('avgPrice')?.value);
                
                if (isNaN(salesCount)) throw new Error('Заполните поле "Количество продаж"');
                if (isNaN(avgPrice)) throw new Error('Заполните поле "Средняя стоимость продажи"');
                
                result = calculateRevenue(salesCount, avgPrice);
                resultValue = result.revenue.toLocaleString() + ' ₽';
                displayRevenueResult(result);
                break;
                
            case 'kpi':
                const employeeId = document.getElementById('employeeSelect')?.value;
                const actual = parseFloat(document.getElementById('actual')?.value);
                const planned = parseFloat(document.getElementById('planned')?.value);
                const weight = parseFloat(document.getElementById('weight')?.value) || 100;
                
                if (!employeeId) throw new Error('Выберите сотрудника');
                if (isNaN(actual)) throw new Error('Заполните поле "Фактический результат"');
                if (isNaN(planned)) throw new Error('Заполните поле "Плановое значение"');
                
                result = calculateKPI(actual, planned, weight);
                resultValue = result.kpi.toFixed(1) + '%';
                displayKPIResult(result);
                break;
                
            case 'employees':
                return;
                
            default:
                return;
        }
        
        saveCalculationToHistory(currentMode, resultValue);
        
    } catch(error) {
        alert(error.message);
        console.error('Calculation error:', error);
    }
}

// ========== РАБОТА С ИСТОРИЕЙ ==========
function saveCalculationToHistory(mode, resultValue) {
    const currentUser = getCurrentUser();
    
    const calculation = {
        id: Date.now(),
        date: new Date().toISOString(),
        mode: mode,
        result: resultValue,
        userName: currentUser?.username || 'Unknown',
        userRole: currentUser?.role || 'user'
    };
    
    const calculations = getCalculations();
    calculations.unshift(calculation);
    
    if (calculations.length > 50) calculations.pop();
    
    localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(calculations));
    
    if (hasPermission('canViewHistory')) {
        loadHistory();
    }
}

function loadHistory() {
    if (!hasPermission('canViewHistory')) {
        const historySection = document.getElementById('historySection');
        if (historySection) historySection.style.display = 'none';
        return;
    }
    
    const calculations = getCalculations();
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    
    if (historySection && historyList) {
        if (calculations.length > 0) {
            historySection.style.display = 'block';
            
            const canDelete = hasPermission('canDeleteHistory');
            
            historyList.innerHTML = calculations.map(calc => `
                <div class="history-item">
                    <div>
                        <strong>${getModeName(calc.mode)}</strong><br>
                        <small class="history-date">${new Date(calc.date).toLocaleString()}</small>
                        <small> • ${calc.userName} (${calc.userRole === 'admin' ? 'Админ' : 'Пользователь'})</small>
                    </div>
                    <div>
                        <span class="history-value">${calc.result}</span>
                        ${canDelete ? `<button class="history-delete" data-id="${calc.id}">🗑️</button>` : ''}
                    </div>
                </div>
            `).join('');
            
            if (canDelete) {
                document.querySelectorAll('.history-delete').forEach(btn => {
                    btn.addEventListener('click', () => {
                        deleteHistoryItem(parseInt(btn.getAttribute('data-id')));
                    });
                });
            }
        } else {
            historySection.style.display = 'block';
            historyList.innerHTML = '<div class="empty-history">История расчетов пуста</div>';
        }
    }
}

function deleteHistoryItem(id) {
    if (!hasPermission('canDeleteHistory')) {
        alert('У вас нет прав для удаления истории');
        return;
    }
    
    let calculations = getCalculations();
    calculations = calculations.filter(calc => calc.id !== id);
    localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(calculations));
    loadHistory();
}

function clearHistory() {
    if (!hasPermission('canDeleteHistory')) {
        alert('У вас нет прав для очистки истории');
        return;
    }
    
    if (confirm('Очистить всю историю расчетов?')) {
        clearCalculations();
        loadHistory();
        alert('История очищена');
    }
}



function getModeName(mode) {
    const names = {
        'roi': 'ROI',
        'revenue': 'Доход',
        'kpi': 'KPI'
    };
    return names[mode] || mode;
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    if (themeToggle) themeToggle.textContent = isDark ? '☀️' : '🌙';
    if (typeof saveSettings === 'function') {
        saveSettings({ theme: isDark ? 'dark' : 'light' });
    }
}

function loadTheme() {
    if (typeof getSettings === 'function') {
        const settings = getSettings();
        if (settings.theme === 'dark') {
            document.body.classList.add('dark');
            if (themeToggle) themeToggle.textContent = '☀️';
        }
    }
}

function showAddEmployeeModal() {
    if (!hasPermission('canManageEmployees')) {
        alert('У вас нет прав для добавления сотрудников');
        return;
    }
    
    const name = prompt('Введите имя сотрудника:');
    if (!name || name.trim() === '') {
        alert('Имя сотрудника обязательно!');
        return;
    }
    
    const position = prompt('Введите должность:');
    if (!position || position.trim() === '') {
        alert('Должность обязательна!');
        return;
    }
    
    const planInput = prompt('Введите плановое значение (по умолчанию 100):', '100');
    const plan = parseFloat(planInput);
    const finalPlan = isNaN(plan) ? 100 : plan;
    
    if (typeof addEmployee === 'function') {
        const newEmployee = addEmployee(name.trim(), position.trim(), finalPlan);
        if (newEmployee) {
            alert(`Сотрудник "${name}" успешно добавлен!`);
            if (typeof loadEmployees === 'function') {
                loadEmployees();
            }
        } else {
            alert('Ошибка при добавлении сотрудника');
        }
    } else {
        alert('Ошибка: функция addEmployee не найдена');
    }
}


function setupEventListeners() {
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.getAttribute('data-mode');

            if (btn.style.display !== 'none') {
                switchMode(mode);
            }
        });
    });
    const exportHistoryBtn = document.getElementById('exportHistoryBtn');
    if (exportHistoryBtn) {
        exportHistoryBtn.addEventListener('click', exportHistoryToCSV);
    }
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculate);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearHistory);
    }
    
    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', showAddEmployeeModal);
    }
    
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && currentMode !== 'employees') {
                calculate();
            }
        });
    })
}


document.addEventListener('DOMContentLoaded', () => {
    console.log('App initializing...');
    
    if (typeof initAuth === 'function') {
        initAuth();
    }
    
    if (typeof loadEmployees === 'function') {
        loadEmployees();
    }
    
    loadTheme();
    setupEventListeners();
    
    console.log('App initialized');
});

function exportHistoryToCSV() {

    if (!hasPermission('canViewHistory')) {
        alert('У вас нет прав для скачивания истории');
        return;
    }
    
    const calculations = getCalculations();
    
    if (calculations.length === 0) {
        alert('Нет данных для экспорта');
        return;
    }
    

    const data = calculations.map(calc => ({
        'Дата': new Date(calc.date).toLocaleString('ru-RU'),
        'Тип расчета': getModeName(calc.mode),
        'Результат': calc.result,
        'Пользователь': calc.userName || 'Unknown',
    }));

    const headers = ['Дата', 'Тип расчета', 'Результат', 'Пользователь'];

    let csv = headers.join(';') + '\n';
    
    data.forEach(row => {
        const values = headers.map(header => {
            let value = row[header];

            if (typeof value === 'string' && (value.includes(';') || value.includes('"'))) {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csv += values.join(';') + '\n';
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const filename = `kpi_history_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}.csv`;
    
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`История успешно скачана! Файл: ${filename}`);
}

function exportDetailedHistoryToCSV() {
    if (!hasPermission('canViewHistory')) {
        alert('У вас нет прав для скачивания истории');
        return;
    }
    
    const calculations = getCalculations();
    
    if (calculations.length === 0) {
        alert('Нет данных для экспорта');
        return;
    }
    

    const data = calculations.map(calc => {
        let details = '';

        if (calc.inputs) {
            if (calc.mode === 'roi') {
                details = `Инвестиции: ${calc.inputs.investment || '?'} ₽, Доход: ${calc.inputs.returnAmount || '?'} ₽`;
            } else if (calc.mode === 'revenue') {
                details = `Продажи: ${calc.inputs.salesCount || '?'} шт., Средний чек: ${calc.inputs.avgPrice || '?'} ₽`;
            } else if (calc.mode === 'kpi') {
                details = `Факт: ${calc.inputs.actual || '?'}, План: ${calc.inputs.planned || '?'}, Вес: ${calc.inputs.weight || '100'}%`;
            }
        }
        
        return {
            'Дата': new Date(calc.date).toLocaleString('ru-RU'),
            'Тип расчета': getModeName(calc.mode),
            'Результат': calc.result,
            'Детали': details,
            'Пользователь': calc.userName || 'Unknown',
        };
    });
    
    const headers = ['Дата', 'Тип расчета', 'Результат', 'Детали', 'Пользователь'];
    
    let csv = headers.join(';') + '\n';
    
    data.forEach(row => {
        const values = headers.map(header => {
            let value = row[header];
            if (typeof value === 'string' && (value.includes(';') || value.includes('"'))) {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csv += values.join(';') + '\n';
    });
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const filename = `kpi_history_detailed_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.csv`;
    
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`Детальная история успешно скачана!`);
}