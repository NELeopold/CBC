

function calculateRevenue(salesCount, avgPrice) {
    if (isNaN(salesCount) || salesCount === '') {
        throw new Error('Пожалуйста, заполните поле "Количество продаж"');
    }
    
    if (isNaN(avgPrice) || avgPrice === '') {
        throw new Error('Пожалуйста, заполните поле "Средняя стоимость продажи"');
    }
    
    if (salesCount < 0 || avgPrice < 0) {
        throw new Error('Значения не могут быть отрицательными');
    }
    
    let revenue = salesCount * avgPrice;
    
    return {
        revenue: revenue,
        salesCount: salesCount,
        avgPrice: avgPrice
    };
}

function getRevenueGrade(revenue) {
    if (revenue === 0) {
        return { text: 'Доход отсутствует', color: '#9e9e9e'};
    } else if (revenue < 10000) {
        return { text: 'Небольшой доход', color: '#ff9800'};
    } else if (revenue < 100000) {
        return { text: 'Хороший доход', color: '#2196f3'};
    } else if (revenue < 1000000) {
        return { text: 'Высокий доход!', color: '#4caf50'};
    } else {
        return { text: 'Отличный результат!', color: '#9c27b0'};
    }
}

function formatRevenue(revenue) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(revenue);
}

function calculateAverageCheck(totalRevenue, totalSales) {
    if (totalSales === 0) return 0;
    return totalRevenue / totalSales;
}

function calculateRevenueGrowth(currentRevenue, previousRevenue) {
    if (previousRevenue === 0) return currentRevenue > 0 ? 100 : 0;
    return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
}