// Vérifier l'authentification
if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
}

// Données statistiques détaillées - CAX Corp, maître du monde
const statsData = {
    totalEmployees: 2847650,
    departments: {
        hr: { name: 'HR & Personnel', employees: 142350, avgSalary: 285000, budget: 40570475000 },
        it: { name: 'IT & Cybersecurity', employees: 456800, avgSalary: 375000, budget: 171300000000 },
        finance: { name: 'Finance & Banking', employees: 289450, avgSalary: 420000, budget: 121509000000 },
        admin: { name: 'Administration', employees: 154200, avgSalary: 195000, budget: 30069000000 },
        operations: { name: 'Global Operations', employees: 735600, avgSalary: 158000, budget: 116265200000 },
        sales: { name: 'Sales & Market Control', employees: 598500, avgSalary: 340000, budget: 203490000000 },
        marketing: { name: 'Marketing & Media', employees: 182750, avgSalary: 265000, budget: 48429250000 },
        aerospace: { name: 'Aerospace & Orbital Stations', employees: 238000, avgSalary: 525000, budget: 125010000000 }
    },
    locations: {
        france: { name: 'France (HQ)', employees: 425650 },
        usa: { name: 'United States', employees: 489450 },
        china: { name: 'China', employees: 347800 },
        japan: { name: 'Japan', employees: 298750 },
        germany: { name: 'Germany', employees: 287200 },
        india: { name: 'India', employees: 312300 },
        uk: { name: 'United Kingdom', employees: 186500 },
        other: { name: 'Other Global Operations', employees: 0 }
    },
    growthHistory: [
        { year: 2015, employees: 280000 },
        { year: 2016, employees: 580000 },
        { year: 2017, employees: 920000 },
        { year: 2018, employees: 1280000 },
        { year: 2019, employees: 1650000 },
        { year: 2020, employees: 1950000 },
        { year: 2025, employees: 2750000 },
        { year: 2026, employees: 2847650 }
    ],
    revenueHistory: [
        { year: 2015, revenue: 45200000000, taxes: 13560000000 },
        { year: 2016, revenue: 125800000000, taxes: 37740000000 },
        { year: 2017, revenue: 285400000000, taxes: 85620000000 },
        { year: 2018, revenue: 620900000000, taxes: 186270000000 },
        { year: 2019, revenue: 1245000000000, taxes: 373500000000 },
        { year: 2020, revenue: 2150000000000, taxes: 645000000000 },
        { year: 2021, revenue: 3250000000000, taxes: 975000000000 },
        { year: 2022, revenue: 4800000000000, taxes: 1440000000000 },
        { year: 2023, revenue: 6200000000000, taxes: 1860000000000 },
        { year: 2024, revenue: 7350000000000, taxes: 2205000000000 },
        { year: 2025, revenue: 8000000000000, taxes: 2400000000000 },
        { year: 2026, revenue: 8470000000000, taxes: 2541000000000 }
    ]
};

// Initialiser les graphiques
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    populateDepartmentTable();
});

function initCharts() {
    // Chart.js colors
    const colors = [
        '#1a1a1a',
        '#4a4a4a',
        '#7a7a7a',
        '#ababab',
        '#dc3545',
        '#666666',
        '#999999',
        '#cccccc'
    ];

    // 1. Department Bar Chart
    const deptCtx = document.getElementById('departmentChart').getContext('2d');
    new Chart(deptCtx, {
        type: 'bar',
        data: {
            labels: Object.values(statsData.departments).map(d => d.name),
            datasets: [{
                label: 'Number of Employees',
                data: Object.values(statsData.departments).map(d => d.employees),
                backgroundColor: colors,
                borderColor: '#e0e0e0',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#666666',
                        font: { size: 11 }
                    },
                    grid: {
                        color: '#e0e0e0'
                    }
                },
                x: {
                    ticks: {
                        color: '#666666',
                        font: { size: 11 }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // 2. Location Pie Chart
    const locCtx = document.getElementById('locationChart').getContext('2d');
    new Chart(locCtx, {
        type: 'doughnut',
        data: {
            labels: Object.values(statsData.locations).map(l => l.name),
            datasets: [{
                data: Object.values(statsData.locations).map(l => l.employees),
                backgroundColor: colors,
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#666666',
                        font: { size: 11 },
                        padding: 15
                    }
                }
            }
        }
    });

    // 3. Department Distribution Radar Chart
    const distCtx = document.getElementById('distributionChart').getContext('2d');
    new Chart(distCtx, {
        type: 'radar',
        data: {
            labels: Object.values(statsData.departments).map(d => d.name),
            datasets: [{
                label: 'Employees',
                data: Object.values(statsData.departments).map(d => d.employees),
                borderColor: '#1a1a1a',
                backgroundColor: 'rgba(26, 26, 26, 0.1)',
                pointBackgroundColor: '#1a1a1a',
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#1a1a1a'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    ticks: {
                        color: '#999999',
                        font: { size: 10 }
                    },
                    grid: {
                        color: '#e0e0e0'
                    }
                }
            }
        }
    });

    // 4. Growth Line Chart
    const growthCtx = document.getElementById('growthChart').getContext('2d');
    new Chart(growthCtx, {
        type: 'line',
        data: {
            labels: statsData.growthHistory.map(g => g.year),
            datasets: [{
                label: 'Total Employees',
                data: statsData.growthHistory.map(g => g.employees),
                borderColor: '#1a1a1a',
                backgroundColor: 'rgba(26, 26, 26, 0.05)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#1a1a1a',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: '#666666',
                        font: { size: 11 }
                    },
                    grid: {
                        color: '#e0e0e0'
                    }
                },
                x: {
                    ticks: {
                        color: '#666666',
                        font: { size: 11 }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // 5. Revenue & Taxes Line Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: statsData.revenueHistory.map(r => r.year),
            datasets: [
                {
                    label: 'Global Revenue',
                    data: statsData.revenueHistory.map(r => r.revenue / 1000000000), // Convert to billions
                    borderColor: '#1a1a1a',
                    backgroundColor: 'rgba(26, 26, 26, 0.05)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#1a1a1a',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                },
                {
                    label: 'Taxes Paid',
                    data: statsData.revenueHistory.map(r => r.taxes / 1000000000), // Convert to billions
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.05)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#dc3545',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#666666',
                        font: { size: 11 },
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: '#666666',
                        font: { size: 11 },
                        callback: function(value) {
                            return '€' + value + 'B';
                        }
                    },
                    grid: {
                        color: '#e0e0e0'
                    }
                },
                x: {
                    ticks: {
                        color: '#666666',
                        font: { size: 11 }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function populateDepartmentTable() {
    const tbody = document.getElementById('departmentTableBody');
    
    const rows = Object.values(statsData.departments).map(dept => {
        const percentage = ((dept.employees / statsData.totalEmployees) * 100).toFixed(1);
        const budgetFormatted = (dept.budget / 1000000).toFixed(2);
        
        return `
            <tr>
                <td><strong>${dept.name}</strong></td>
                <td>${dept.employees}</td>
                <td>${percentage}%</td>
                <td>€${dept.avgSalary.toLocaleString()}</td>
                <td>€${budgetFormatted}M</td>
            </tr>
        `;
    });

    tbody.innerHTML = rows.join('');
}
