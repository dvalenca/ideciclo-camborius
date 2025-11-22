// Sistema de Gráficos para Dashboard
class ChartsManager {
    constructor() {
        this.charts = {};
        this.data = [];
    }

    // Inicializar com dados
    init(data) {
        this.data = data;
        this.createAllCharts();
        document.getElementById('charts-section').style.display = 'grid';
    }

    // Criar todos os gráficos
    createAllCharts() {
        this.createTypologyChart();
        this.createCityChart();
        this.createScoresChart();
        this.createLengthChart();
    }

    // Gráfico de distribuição por tipologia
    createTypologyChart() {
        const ctx = document.getElementById('typologyChart').getContext('2d');
        
        const typologyData = {};
        this.data.forEach(via => {
            const type = via.typology;
            typologyData[type] = (typologyData[type] || 0) + 1;
        });

        this.charts.typology = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(typologyData),
                datasets: [{
                    data: Object.values(typologyData),
                    backgroundColor: [
                        '#2E7D32', // Verde para Ciclovia
                        '#1976D2', // Azul para Ciclofaixa
                        '#7B1FA2', // Roxo para Compartilhada
                        '#F57C00', // Laranja para outros
                        '#D32F2F'  // Vermelho para outros
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed * 100) / total).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfico de estruturas por cidade
    createCityChart() {
        const ctx = document.getElementById('cityChart').getContext('2d');
        
        const cityData = {};
        this.data.forEach(via => {
            const city = via.city;
            cityData[city] = (cityData[city] || 0) + 1;
        });

        this.charts.city = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(cityData),
                datasets: [{
                    label: 'Número de Estruturas',
                    data: Object.values(cityData),
                    backgroundColor: 'rgba(46, 125, 50, 0.8)',
                    borderColor: '#2E7D32',
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return `Estruturas: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    // Gráfico de distribuição de notas
    createScoresChart() {
        const ctx = document.getElementById('scoresChart').getContext('2d');
        
        // Criar faixas de notas
        const scoreBands = {
            'Excelente (8-10)': 0,
            'Bom (6-8)': 0,
            'Regular (4-6)': 0,
            'Ruim (2-4)': 0,
            'Inadequado (0-2)': 0
        };

        this.data.forEach(via => {
            const score = via.average_score || 0;
            if (score >= 8) scoreBands['Excelente (8-10)']++;
            else if (score >= 6) scoreBands['Bom (6-8)']++;
            else if (score >= 4) scoreBands['Regular (4-6)']++;
            else if (score >= 2) scoreBands['Ruim (2-4)']++;
            else scoreBands['Inadequado (0-2)']++;
        });

        this.charts.scores = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(scoreBands),
                datasets: [{
                    data: Object.values(scoreBands),
                    backgroundColor: [
                        '#4CAF50', // Verde - Excelente
                        '#8BC34A', // Verde claro - Bom
                        '#FFC107', // Amarelo - Regular
                        '#FF9800', // Laranja - Ruim
                        '#F44336'  // Vermelho - Inadequado
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed * 100) / total).toFixed(1);
                                return `${context.label}: ${context.parsed} estruturas (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfico de extensão por tipologia
    createLengthChart() {
        const ctx = document.getElementById('lengthChart').getContext('2d');
        
        const lengthData = {};
        this.data.forEach(via => {
            const type = via.typology;
            if (!lengthData[type]) {
                lengthData[type] = 0;
            }
            lengthData[type] += via.length / 1000; // Converter para km
        });

        this.charts.length = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(lengthData),
                datasets: [{
                    label: 'Extensão Total (km)',
                    data: Object.values(lengthData).map(val => val.toFixed(1)),
                    backgroundColor: [
                        'rgba(46, 125, 50, 0.8)',   // Verde para Ciclovia
                        'rgba(25, 118, 210, 0.8)',  // Azul para Ciclofaixa
                        'rgba(123, 31, 162, 0.8)',  // Roxo para Compartilhada
                        'rgba(245, 124, 0, 0.8)',   // Laranja para outros
                        'rgba(211, 47, 47, 0.8)'    // Vermelho para outros
                    ],
                    borderColor: [
                        '#2E7D32',
                        '#1976D2',
                        '#7B1FA2',
                        '#F57C00',
                        '#D32F2F'
                    ],
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed.y} km`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + ' km';
                            }
                        }
                    }
                }
            }
        });
    }

    // Atualizar gráficos com dados filtrados
    updateCharts(filteredData) {
        this.data = filteredData;
        
        // Destruir gráficos existentes
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        
        // Recriar com novos dados
        this.createAllCharts();
    }

    // Destruir todos os gráficos
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
}

// Exportar para uso global
window.ChartsManager = ChartsManager;