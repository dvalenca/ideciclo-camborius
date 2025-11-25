// Dados globais
let allVias = [];
let filteredVias = [];
let metadata = {};
let overviewMap = null;

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  renderStats();
  initOverviewMap();
  renderVias();
  setupFilters();
  updateResultsCount();
});

// Inicializar mapa geral
function initOverviewMap() {
  const mapContainer = document.getElementById('overview-map');
  if (mapContainer) {
    overviewMap = new OverviewMap('overview-map');
    overviewMap.init();
  }
}

// Carregar dados
async function loadData() {
  try {
    const [viasResponse, metadataResponse, coverageResponse] = await Promise.all([
      fetch('data/processed-data.json'),
      fetch('data/vias-metadata.json'),
      fetch('assets/data/coverage-analysis.json')
    ]);
    
    allVias = await viasResponse.json();
    metadata = await metadataResponse.json();
    const coverageAnalysis = await coverageResponse.json();
    filteredVias = [...allVias];
    
    // Calcular totais do coverage-analysis
    const balnearioTotal = Object.values(coverageAnalysis.Balneario.coverage)
      .reduce((sum, category) => sum + Object.values(category).reduce((s, v) => s + v, 0), 0);
    const camboriuTotal = Object.values(coverageAnalysis.Camboriu.coverage)
      .reduce((sum, category) => sum + Object.values(category).reduce((s, v) => s + v, 0), 0);
    
    // Atualizar metadata com dados do coverage
    metadata.coverage_total_length = balnearioTotal + camboriuTotal;
    metadata.coverage_balneario = balnearioTotal;
    metadata.coverage_camboriu = camboriuTotal;
    
    console.log(`✅ Carregados ${allVias.length} estruturas`);
  } catch (error) {
    console.error('❌ Erro ao carregar dados:', error);
    showError('Erro ao carregar dados das vias');
  }
}

// Renderizar estatísticas
function renderStats() {
  const statsContainer = document.getElementById('stats-container');
  if (!statsContainer) return;
  
  statsContainer.innerHTML = `
    <div class="stat-card">
      <span class="stat-number">${metadata.total_structures}</span>
      <span class="stat-label">Estruturas Avaliadas</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">${(metadata.coverage_total_length / 1000).toFixed(1)}km</span>
      <span class="stat-label">Extensão Total</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">${metadata.by_city['Camboriú']}</span>
      <span class="stat-label">Camboriú (${(metadata.coverage_camboriu / 1000).toFixed(1)}km)</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">${metadata.by_city['Balneário Camboriú']}</span>
      <span class="stat-label">Balneário Camboriú (${(metadata.coverage_balneario / 1000).toFixed(1)}km)</span>
    </div>
  `;
}

// Renderizar lista de vias
function renderVias() {
  const container = document.getElementById('vias-container');
  if (!container) return;
  
  if (filteredVias.length === 0) {
    container.innerHTML = '<div class="loading">Nenhuma via encontrada</div>';
    return;
  }
  
  const scoreType = document.getElementById('score-type-filter')?.value || 'average';
  const scoreLabels = {
    'average': 'Nota Média',
    'project': 'Projeto',
    'urbanity': 'Urbanidade',
    'maintenance': 'Manutenção',
    'safety': 'Segurança'
  };
  
  container.innerHTML = filteredVias.map(via => {
    const score = via[`${scoreType}_score`] || 0;
    return `
    <div class="via-card" onclick="openVia(${via.id})">
      <div class="via-header">
        <h3 class="via-name">${via.structure_name}</h3>
        <div class="location-typology">
          <p class="via-location">${via.city}</p>
          <span class="typology-badge typology-${via.typology.toLowerCase().replace(/\s+/g, '-')}">${via.typology}</span>
        </div>
      </div>
      <div class="via-body">
        <div class="via-info">
          <div class="info-item">
            <div class="info-value">${score.toFixed(1)}</div>
            <div class="info-label">${scoreLabels[scoreType]}</div>
          </div>
          <div class="info-item">
            <div class="info-value">${(via.length / 1000).toFixed(1)}km</div>
            <div class="info-label">Extensão</div>
          </div>
          <div class="info-item">
            <div class="score-badge ${getScoreClass(score)}">
              ${getScoreLabel(score)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `}).join('');
}

// Configurar filtros e busca
function setupFilters() {
  const searchInput = document.getElementById('search-input');
  const cityFilter = document.getElementById('city-filter');
  const typologyFilter = document.getElementById('typology-filter');
  const scoreTypeFilter = document.getElementById('score-type-filter');
  const sortSelect = document.getElementById('sort-select');
  
  if (searchInput) {
    searchInput.addEventListener('input', debounce(applyFilters, 300));
  }
  
  if (cityFilter) {
    cityFilter.addEventListener('change', applyFilters);
  }
  
  if (typologyFilter) {
    typologyFilter.addEventListener('change', applyFilters);
  }
  
  if (scoreTypeFilter) {
    scoreTypeFilter.addEventListener('change', () => {
      // Mantém a ordenação atual, apenas reaplica com o novo tipo de nota
      applyFilters();
    });
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters);
  }
}

// Aplicar filtros
function applyFilters() {
  const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
  const selectedCity = document.getElementById('city-filter')?.value || '';
  const selectedTypology = document.getElementById('typology-filter')?.value || '';
  const sortBy = document.getElementById('sort-select')?.value || 'name';
  
  // Filtrar
  filteredVias = allVias.filter(via => {
    const matchesSearch = via.searchable_text.includes(searchTerm);
    const matchesCity = !selectedCity || via.city === selectedCity;
    const matchesTypology = !selectedTypology || via.typology === selectedTypology;
    return matchesSearch && matchesCity && matchesTypology;
  });
  
  // Ordenar
  const scoreType = document.getElementById('score-type-filter')?.value || 'average';
  filteredVias.sort((a, b) => {
    switch (sortBy) {
      case 'score-desc':
        return (b[`${scoreType}_score`] || 0) - (a[`${scoreType}_score`] || 0);
      case 'score-asc':
        return (a[`${scoreType}_score`] || 0) - (b[`${scoreType}_score`] || 0);
      case 'length-desc':
        return b.length - a.length;
      case 'length-asc':
        return a.length - b.length;
      case 'name':
      default:
        return a.structure_name.localeCompare(b.structure_name);
    }
  });
  
  renderVias();
  updateResultsCount();
  
  // Sincronizar filtros com o mapa
  if (overviewMap) {
    const filters = {
      city: selectedCity,
      typology: selectedTypology,
      search: searchTerm
    };
    overviewMap.filterStructures(filters);
  }
}

// Atualizar contador de resultados
function updateResultsCount() {
  const counter = document.getElementById('results-count');
  if (counter) {
    counter.textContent = `${filteredVias.length} estrutura${filteredVias.length !== 1 ? 's' : ''} encontrada${filteredVias.length !== 1 ? 's' : ''}`;
  }
}

// Abrir página da via
function openVia(viaId) {
  window.location.href = `via.html?id=${viaId}`;
}

// Utilitários
function getScoreClass(score) {
  if (score >= 8) return 'score-excellent';
  if (score >= 6) return 'score-good';
  if (score >= 4) return 'score-regular';
  if (score >= 2) return 'score-poor';
  return 'score-inadequate';
}

function getScoreLabel(score) {
  if (score >= 8) return 'Excelente';
  if (score >= 6) return 'Bom';
  if (score >= 4) return 'Regular';
  if (score >= 2) return 'Ruim';
  return 'Inadequado';
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showError(message) {
  const container = document.getElementById('vias-container');
  if (container) {
    container.innerHTML = `<div class="loading">❌ ${message}</div>`;
  }
}

