// roiCalculator.js - логика расчета ROI

function calculateROI(investment, returnAmount) {
    if (investment === 0) {
        throw new Error('Размер вложений не может быть нулем');
    }
    
    let netProfit = returnAmount - investment;
    let roi = (netProfit / investment) * 100;
    
    return {
        netProfit: netProfit,
        roi: roi,
        coefficient: roi / 100
    };
}

function getROIGrade(roi) {
    if (roi > 50) return { text: 'Отличная доходность', color: '#4caf50' };
    if (roi > 20) return { text: 'Хорошая доходность', color: '#8bc34a' };
    if (roi > 0) return { text: 'Положительная доходность', color: '#ff9800' };
    if (roi === 0) return { text: 'Нулевая доходность', color: '#ffc107' };
    return { text: 'Отрицательная доходность', color: '#f44336' };
}