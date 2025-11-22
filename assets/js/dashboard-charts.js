// Sistema de Gráficos para Dashboard
class DashboardCharts {
    constructor() {
        this.charts = {};
        this.data = [];
    }

    // Inicializar com dados
    init(data) {
        this.data = data;
        this.createAllCharts();
    }

    // Criar todos os gráficos
    createAllCharts() {
        this.createTypologyChart();
        this.createCityChart();
        this.createScoresChart();
        this.createLengthChart();
        this.createCategoriesChart();
        this.createObstaclesChart();
    }

    // 1. Gráfico de distribuição por tipologia
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
                    backgroundColor: ['#2E7D32', '#1976D2', '#7B1FA2', '#F57C00'],
                    borderWidth: 3,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
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

    // 2. Gráfico de estruturas por cidade
    createCityChart() {
        const ctx = document.getElementById('cityChart').getContext('2d');
        
        const cityData = {};
        this.data.forEach(via => {
            cityData[via.city] = (cityData[via.city] || 0) + 1;
        });

        this.charts.city = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(cityData),
                datasets: [{
                    label: 'Estruturas',
                    data: Object.values(cityData),
                    backgroundColor: 'rgba(46, 125, 50, 0.8)',
                    borderColor: '#2E7D32',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // 3. Gráfico de distribuição de notas
    createScoresChart() {
        const ctx = document.getElementById('scoresChart').getContext('2d');
        
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
                    backgroundColor: ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    // 4. Gráfico de extensão por tipologia
    createLengthChart() {
        const ctx = document.getElementById('lengthChart').getContext('2d');
        
        const lengthData = {};
        this.data.forEach(via => {
            const type = via.typology;
            lengthData[type] = (lengthData[type] || 0) + (via.length / 1000);
        });

        this.charts.length = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(lengthData),
                datasets: [{
                    label: 'Extensão (km)',
                    data: Object.values(lengthData).map(val => val.toFixed(1)),
                    backgroundColor: ['rgba(46, 125, 50, 0.8)', 'rgba(25, 118, 210, 0.8)', 'rgba(123, 31, 162, 0.8)'],
                    borderColor: ['#2E7D32', '#1976D2', '#7B1FA2'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                    y: { 
                        beginAtZero: true,
                        ticks: { callback: (value) => value + ' km' }
                    }
                }
            }
        });
    }

    // 5. Gráfico de notas por categoria
    createCategoriesChart() {
        const ctx = document.getElementById('categoriesChart').getContext('2d');
        
        const categories = ['project_score', 'protection_score', 'comfort_score', 'safety_score'];
        const avgScores = categories.map(cat => {
            const sum = this.data.reduce((acc, via) => acc + (via[cat] || 0), 0);
            return (sum / this.data.length).toFixed(1);
        });

        this.charts.categories = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Projeto', 'Proteção', 'Conforto', 'Segurança'],
                datasets: [{
                    label: 'Nota Média',
                    data: avgScores,
                    backgroundColor: 'rgba(46, 125, 50, 0.2)',
                    borderColor: '#2E7D32',
                    pointBackgroundColor: '#2E7D32',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#2E7D32'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10,
                        ticks: { stepSize: 2 }
                    }
                }
            }
        });
    }

    // 6. Gráfico de obstáculos vs riscos
    createObstaclesChart() {
        const ctx = document.getElementById('obstaclesChart').getContext('2d');
        
        const obstaclesData = this.data.map(via => via.full_data?.all_obstacles_count || 0);
        const risksData = this.data.map(via => via.full_data?.all_risks_situations_count || 0);
        const labels = this.data.map((via, index) => `Estrutura ${index + 1}`);

        this.charts.obstacles = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Obstáculos vs Riscos',
                    data: this.data.map(via => ({
                        x: via.full_data?.all_obstacles_count || 0,
                        y: via.full_data?.all_risks_situations_count || 0
                    })),
                    backgroundColor: 'rgba(46, 125, 50, 0.6)',
                    borderColor: '#2E7D32',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Obstáculos' },
                        beginAtZero: true
                    },
                    y: {
                        title: { display: true, text: 'Riscos' },
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: () => 'Estrutura',
                            label: (context) => `Obstáculos: ${context.parsed.x}, Riscos: ${context.parsed.y}`
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
window.DashboardCharts = DashboardCharts;