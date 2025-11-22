// Configuração das bibliotecas via CDN
const CDN_LIBRARIES = {
  mapbox: {
    css: 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css',
    js: 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'
  },
  jspdf: {
    js: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
  },
  marked: {
    js: 'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
  },
  html2canvas: {
    js: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
  }
};

// Token do Mapbox
const MAPBOX_TOKEN = 'pk.eyJ1IjoiaWFjYXB1Y2EiLCJhIjoiODViMTRmMmMwMWE1OGIwYjgxNjMyMGFkM2Q5OWJmNzUifQ.OFgXp9wbN5BJlpuJEcDm4A';

// Configurações do mapa
const MAP_CONFIG = {
  center: [-48.63, -27.0], // Centro aproximado entre Camboriú e Balneário Camboriú
  zoom: 11,
  style: 'mapbox://styles/mapbox/light-v10',
  
  // Estilos das vias por tipologia
  styles: {
    ciclovia: {
      'line-color': '#2E7D32', // Verde escuro
      'line-width': 4,
      'line-opacity': 0.8
    },
    ciclofaixa: {
      'line-color': '#1976D2', // Azul
      'line-width': 3,
      'line-dasharray': [5, 5],
      'line-opacity': 0.8
    },
    ciclorrota: {
      'line-color': '#F57C00', // Laranja
      'line-width': 2,
      'line-dasharray': [2, 4],
      'line-opacity': 0.8
    },
    'calçada compartilhada': {
      'line-color': '#7B1FA2', // Roxo
      'line-width': 2,
      'line-dasharray': [1, 3],
      'line-opacity': 0.8
    }
  },
  
  // Cores por nota
  scoreColors: {
    excellent: '#4CAF50', // Verde
    good: '#8BC34A',      // Verde claro
    regular: '#FFC107',   // Amarelo
    poor: '#FF9800',      // Laranja
    inadequate: '#F44336' // Vermelho
  }
};

// Função para obter cor por nota
function getScoreColor(score) {
  if (score >= 8) return MAP_CONFIG.scoreColors.excellent;
  if (score >= 6) return MAP_CONFIG.scoreColors.good;
  if (score >= 4) return MAP_CONFIG.scoreColors.regular;
  if (score >= 2) return MAP_CONFIG.scoreColors.poor;
  return MAP_CONFIG.scoreColors.inadequate;
}

// Função para obter estilo por tipologia
function getTypologyStyle(typology) {
  const normalizedType = typology.toLowerCase().replace(/\s+/g, ' ');
  return MAP_CONFIG.styles[normalizedType] || MAP_CONFIG.styles.ciclofaixa;
}