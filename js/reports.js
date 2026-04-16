function exportToCSV(data, filename = 'report.csv') {
    if (!data || data.length === 0) {
        alert('Нет данных для экспорта');
        return;
    }
    
    const headers = Object.keys(data[0]);
    
    let csv = headers.join(',') + '\n';
    
    data.forEach(row => {
        const values = headers.map(header => {
            let value = row[header];
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csv += values.join(',') + '\n';
    });
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Отчет успешно экспортирован!');
}

function exportToJSON(data, filename = 'report.json') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('JSON файл успешно экспортирован!');
}

function importFromJSON(file, callback) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            callback(data);
            alert('Данные успешно импортированы!');
        } catch (error) {
            alert('Ошибка при импорте: неверный формат JSON');
        }
    };
    
    reader.onerror = function() {
        alert('Ошибка при чтении файла');
    };
    
    reader.readAsText(file);
}

function generateKPIReport(employees, calculations) {
    const report = {
        generatedAt: new Date().toISOString(),
        totalEmployees: employees.length,
        averageKPI: 0,
        topPerformers: [],
        lowPerformers: [],
        calculations: calculations
    };
    
    if (employees.length > 0 && calculations.length > 0) {
        const kpiValues = calculations
            .filter(calc => calc.mode === 'kpi')
            .map(calc => parseFloat(calc.result));
        
        if (kpiValues.length > 0) {
            report.averageKPI = kpiValues.reduce((a, b) => a + b, 0) / kpiValues.length;
        }
        
        const employeeKPIs = employees.map(emp => {
            const empCalculations = calculations.filter(calc => calc.employeeId === emp.id);
            const avgKPI = empCalculations.length > 0 
                ? empCalculations.reduce((a, b) => a + parseFloat(b.result), 0) / empCalculations.length
                : 0;
            return { ...emp, avgKPI };
        });
        
        report.topPerformers = employeeKPIs
            .filter(emp => emp.avgKPI >= 80)
            .sort((a, b) => b.avgKPI - a.avgKPI);
        
        report.lowPerformers = employeeKPIs
            .filter(emp => emp.avgKPI < 50 && emp.avgKPI > 0)
            .sort((a, b) => a.avgKPI - b.avgKPI);
    }
    
    return report;
}

function generateFinancialReport(calculations) {
    const roiCalculations = calculations.filter(calc => calc.mode === 'roi');
    const revenueCalculations = calculations.filter(calc => calc.mode === 'revenue');
    
    const report = {
        generatedAt: new Date().toISOString(),
        totalROICalculations: roiCalculations.length,
        totalRevenueCalculations: revenueCalculations.length,
        averageROI: 0,
        totalRevenue: 0,
        bestROI: null,
        worstROI: null
    };
    
    if (roiCalculations.length > 0) {
        const roiValues = roiCalculations.map(calc => parseFloat(calc.result));
        report.averageROI = roiValues.reduce((a, b) => a + b, 0) / roiValues.length;
        report.bestROI = Math.max(...roiValues);
        report.worstROI = Math.min(...roiValues);
    }
    
    if (revenueCalculations.length > 0) {
        report.totalRevenue = revenueCalculations.reduce((sum, calc) => {
            return sum + (calc.inputs?.revenue || 0);
        }, 0);
    }
    
    return report;
}

function printReport(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        alert('Элемент для печати не найден');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Отчет KPI Bonus App</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #667eea; }
                table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background: #667eea; color: white; }
                .footer { margin-top: 30px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            ${element.cloneNode(true).innerHTML}
            <div class="footer">
                <p>Отчет сгенерирован ${new Date().toLocaleString()}</p>
                <p>KPI Bonus App © 2024</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function addExportButtons() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    const exportDiv = document.createElement('div');
    exportDiv.className = 'export-buttons';
    exportDiv.style.marginTop = '15px';
    exportDiv.style.display = 'flex';
    exportDiv.style.gap = '10px';
    exportDiv.innerHTML = `
        <button class="export-csv-btn" style="flex:1; padding:8px; background:#4caf50; color:white; border:none; border-radius:8px; cursor:pointer;">📄 Экспорт CSV</button>
        <button class="export-print-btn" style="flex:1; padding:8px; background:#2196f3; color:white; border:none; border-radius:8px; cursor:pointer;">🖨️ Печать</button>
    `;
    
    container.appendChild(exportDiv);
    
    document.querySelector('.export-csv-btn')?.addEventListener('click', () => {
        const calculations = getCalculations();
        exportToCSV(calculations, 'kpi_calculations.csv');
    });
    
    document.querySelector('.export-print-btn')?.addEventListener('click', () => {
        printReport('resultsContainer');
    });
}