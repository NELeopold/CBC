

const STORAGE_KEYS = {
    CALCULATIONS: 'kpi_calculations',
    EMPLOYEES: 'kpi_employees',
    SETTINGS: 'kpi_settings'
};

function saveCalculation(mode, inputs, result) {
    const calculations = getCalculations();
    
    const calculation = {
        id: Date.now(),
        date: new Date().toISOString(),
        mode: mode,
        inputs: inputs,
        result: result
    };
    
    calculations.unshift(calculation); 
    
    if (calculations.length > 50) {
        calculations.pop();
    }
    
    localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(calculations));
    return calculation;
}

function getCalculations() {
    const data = localStorage.getItem(STORAGE_KEYS.CALCULATIONS);
    return data ? JSON.parse(data) : [];
}

function clearCalculations() {
    localStorage.removeItem(STORAGE_KEYS.CALCULATIONS);
}

function saveEmployees(employees) {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
}

function getEmployees() {
    const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : [];
}

function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

function getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { theme: 'light' };
}