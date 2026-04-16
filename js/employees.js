

let employees = [];

function loadEmployees() {
    employees = getEmployees();
    renderEmployeesList();
    updateEmployeeSelect();
}

function addEmployee(name, position, plan = 100) {
    const employee = {
        id: Date.now(),
        name: name,
        position: position,
        plan: plan,
        createdAt: new Date().toISOString()
    };
    
    employees.push(employee);
    saveEmployees(employees);
    loadEmployees();
    return employee;
}

function deleteEmployee(id) {
    employees = employees.filter(emp => emp.id !== id);
    saveEmployees(employees);
    loadEmployees();
}

function getEmployeeById(id) {
    return employees.find(emp => emp.id === id);
}

function renderEmployeesList() {
    const container = document.getElementById('employeesList');
    if (!container) return;
    
    if (employees.length === 0) {
        container.innerHTML = '<div class="empty-message">Нет добавленных сотрудников</div>';
        return;
    }
    
    container.innerHTML = employees.map(emp => `
        <div class="employee-card">
            <div class="employee-info">
                <div class="employee-name">${escapeHtml(emp.name)}</div>
                <div class="employee-position">${escapeHtml(emp.position)}</div>
                <div class="employee-plan">План: ${emp.plan}%</div>
            </div>
            <button class="delete-employee-btn" data-id="${emp.id}"></button>
        </div>
    `).join('');
    
    document.querySelectorAll('.delete-employee-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            deleteEmployee(id);
        });
    });
}

function updateEmployeeSelect() {
    const select = document.getElementById('employeeSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Выберите сотрудника --</option>' +
        employees.map(emp => `<option value="${emp.id}">${escapeHtml(emp.name)} (${escapeHtml(emp.position)})</option>`).join('');
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}