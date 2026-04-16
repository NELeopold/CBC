

function calculateKPI(actual, planned, weight) {
    if (planned === 0) {
        throw new Error('Плановое значение не может быть нулем');
    }
    
    let achievement = (actual / planned) * 100;
    let cappedAchievement = Math.min(200, Math.max(0, achievement));
    let kpi = (cappedAchievement * weight) / 100;
    kpi = Math.min(100, Math.max(0, kpi));
    
    return {
        achievement: achievement,
        cappedAchievement: cappedAchievement,
        kpi: kpi,
        weightedResult: (cappedAchievement * weight) / 100
    };
}

function getKPIGrade(kpi) {
    if (kpi >= 90) return { grade: 'A', text: 'Отлично', color: '#4caf50' };
    if (kpi >= 70) return { grade: 'B', text: 'Хорошо', color: '#8bc34a' };
    if (kpi >= 50) return { grade: 'C', text: 'Средне', color: '#ff9800' };
    if (kpi >= 30) return { grade: 'D', text: 'Ниже среднего', color: '#f44336' };
    return { grade: 'F', text: 'Критично', color: '#9e9e9e' };
}