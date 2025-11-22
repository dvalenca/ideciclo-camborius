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
    const [viasResponse, metadataResponse] = await Promise.all([
      fetch('data/processed-data.json'),
      fetch('data/vias-metadata.json')
    ]);
    
    allVias = await viasResponse.json();
    metadata = await metadataResponse.json();
    filteredVias = [...allVias];
    
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
  
  // Calcular extensões por cidade
  const camboriuLength = allVias.filter(v => v.city === 'Camboriú').reduce((sum, v) => sum + v.length, 0);
  const bcLength = allVias.filter(v => v.city === 'Balneário Camboriú').reduce((sum, v) => sum + v.length, 0);
  
  statsContainer.innerHTML = `
    <div class="stat-card">
      <span class="stat-number">${metadata.total_structures}</span>
      <span class="stat-label">Estruturas Avaliadas</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">${(metadata.total_length / 1000).toFixed(1)}km</span>
      <span class="stat-label">Extensão Total</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">${metadata.by_city['Camboriú']}</span>
      <span class="stat-label">Camboriú (${(camboriuLength / 1000).toFixed(1)}km)</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">${metadata.by_city['Balneário Camboriú']}</span>
      <span class="stat-label">Balneário Camboriú (${(bcLength / 1000).toFixed(1)}km)</span>
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
  
  container.innerHTML = filteredVias.map(via => `
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
            <div class="info-value">${via.average_score.toFixed(1)}</div>
            <div class="info-label">Nota Média</div>
          </div>
          <div class="info-item">
            <div class="info-value">${(via.length / 1000).toFixed(1)}km</div>
            <div class="info-label">Extensão</div>
          </div>
          <div class="info-item">
            <div class="score-badge ${getScoreClass(via.average_score)}">
              ${getScoreLabel(via.average_score)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Configurar filtros e busca
function setupFilters() {
  const searchInput = document.getElementById('search-input');
  const cityFilter = document.getElementById('city-filter');
  const typologyFilter = document.getElementById('typology-filter');
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
  filteredVias.sort((a, b) => {
    switch (sortBy) {
      case 'score-desc':
        return b.average_score - a.average_score;
      case 'score-asc':
        return a.average_score - b.average_score;
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

