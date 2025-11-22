// Mapa geral com todas as estruturas
class OverviewMap {
  constructor(containerId, mapboxToken) {
    this.containerId = containerId;
    this.map = null;
    this.structures = [];
    
    mapboxgl.accessToken = mapboxToken || 'pk.eyJ1IjoiaWFjYXB1Y2EiLCJhIjoiODViMTRmMmMwMWE1OGIwYjgxNjMyMGFkM2Q5OWJmNzUifQ.OFgXp9wbN5BJlpuJEcDm4A';
  }

  // Inicializar mapa
  init() {
    this.map = new mapboxgl.Map({
      container: this.containerId,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-48.63, -27.0],
      zoom: 11
    });

    this.map.on('load', () => {
      this.setupMapLayers();
      this.loadAllStructures();
    });

    return this.map;
  }

  // Configurar camadas do mapa
  setupMapLayers() {
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.FullscreenControl());
  }

  // Carregar todas as estruturas
  async loadAllStructures() {
    try {
      const response = await fetch('data/processed-data.json');
      this.structures = await response.json();
      
      this.addStructuresToMap();
    } catch (error) {
      console.error('Erro ao carregar estruturas:', error);
    }
  }

  // Adicionar estruturas ao mapa
  addStructuresToMap() {
    // Criar GeoJSON com todas as estruturas
    const geojson = {
      type: 'FeatureCollection',
      features: this.structures
        .filter(structure => structure.coordinates && structure.coordinates.length > 0)
        .map(structure => ({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: structure.coordinates
          },
          properties: {
            id: structure.id,
            name: structure.structure_name,
            typology: structure.typology,
            score: structure.average_score,
            city: structure.city,
            length: structure.length_km
          }
        }))
    };

    // Adicionar fonte
    this.map.addSource('all-structures', {
      type: 'geojson',
      data: geojson
    });

    // Adicionar camada das estruturas
    this.map.addLayer({
      id: 'structures-layer',
      type: 'line',
      source: 'all-structures',
      paint: {
        'line-color': [
          'case',
          ['==', ['get', 'typology'], 'Ciclovia'], '#dc2626',
          ['==', ['get', 'typology'], 'Ciclofaixa'], '#16a34a',
          ['==', ['get', 'typology'], 'Calçada compartilhada'], '#2563eb',
          '#666'
        ],
        'line-width': 3,
        'line-opacity': 0.8
      }
    });

    // Adicionar interatividade
    this.addInteractivity();
  }

  // Adicionar interatividade
  addInteractivity() {
    // Cursor pointer ao passar sobre as estruturas
    this.map.on('mouseenter', 'structures-layer', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', 'structures-layer', () => {
      this.map.getCanvas().style.cursor = '';
    });

    // Click para ir para página da estrutura
    this.map.on('click', 'structures-layer', (e) => {
      const properties = e.features[0].properties;
      window.location.href = `via.html?id=${properties.id}`;
    });

    // Popup ao passar o mouse
    this.map.on('mouseenter', 'structures-layer', (e) => {
      const properties = e.features[0].properties;
      const coordinates = e.lngLat;

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      })
        .setLngLat(coordinates)
        .setHTML(`
          <div class="structure-popup">
            <h4>${properties.name}</h4>
            <p><strong>Tipologia:</strong> ${properties.typology}</p>
            <p><strong>Cidade:</strong> ${properties.city}</p>
            <p><strong>Nota:</strong> ${properties.score.toFixed(1)}</p>
            <p><strong>Extensão:</strong> ${properties.length.toFixed(2)}km</p>
            <p><em>Clique para ver detalhes</em></p>
          </div>
        `)
        .addTo(this.map);

      this.currentPopup = popup;
    });

    this.map.on('mouseleave', 'structures-layer', () => {
      if (this.currentPopup) {
        this.currentPopup.remove();
        this.currentPopup = null;
      }
    });
  }

  // Filtrar estruturas no mapa
  filterStructures(filters) {
    if (!this.map.getSource('all-structures')) return;

    let filteredStructures = this.structures;

    // Aplicar filtros
    if (filters.city) {
      filteredStructures = filteredStructures.filter(s => s.city === filters.city);
    }
    if (filters.typology) {
      filteredStructures = filteredStructures.filter(s => s.typology === filters.typology);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredStructures = filteredStructures.filter(s => 
        s.structure_name.toLowerCase().includes(searchTerm)
      );
    }

    // Atualizar GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: filteredStructures
        .filter(structure => structure.coordinates && structure.coordinates.length > 0)
        .map(structure => ({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: structure.coordinates
          },
          properties: {
            id: structure.id,
            name: structure.structure_name,
            typology: structure.typology,
            score: structure.average_score,
            city: structure.city,
            length: structure.length_km
          }
        }))
    };

    this.map.getSource('all-structures').setData(geojson);
  }
}

// Exportar para uso global
window.OverviewMap = OverviewMap;