// Controle do mapa interativo
class ViaMap {
  constructor(containerId, mapboxToken) {
    this.containerId = containerId;
    this.map = null;
    this.currentVia = null;
    
    // Token do Mapbox
    mapboxgl.accessToken = mapboxToken || 'pk.eyJ1IjoiaWFjYXB1Y2EiLCJhIjoiODViMTRmMmMwMWE1OGIwYjgxNjMyMGFkM2Q5OWJmNzUifQ.OFgXp9wbN5BJlpuJEcDm4A';
  }

  // Inicializar mapa
  init(center = [-48.63, -27.0], zoom = 11) {
    this.map = new mapboxgl.Map({
      container: this.containerId,
      style: 'mapbox://styles/mapbox/light-v10',
      center: center,
      zoom: zoom
    });

    this.map.on('load', () => {
      this.setupMapLayers();
    });

    return this.map;
  }

  // Configurar camadas do mapa
  setupMapLayers() {
    // Adicionar controles
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.FullscreenControl());

    // Carregar dados das rotas
    this.loadRoutes();
  }

  // Carregar todas as rotas
  async loadRoutes() {
    try {
      const response = await fetch('data/combined-routes.geojson');
      const geojson = await response.json();
      
      this.map.addSource('routes', {
        type: 'geojson',
        data: geojson
      });

      // Adicionar camada das rotas
      this.map.addLayer({
        id: 'routes-layer',
        type: 'line',
        source: 'routes',
        paint: {
          'line-color': '#888',
          'line-width': 2,
          'line-opacity': 0.6
        }
      });

    } catch (error) {
      console.error('Erro ao carregar rotas:', error);
    }
  }

  // Destacar via específica
  highlightVia(viaData) {
    this.currentVia = viaData;
    
    if (!viaData.coordinates) {
      console.warn('Via sem coordenadas:', viaData.structure_name);
      return;
    }

    // Criar GeoJSON da via
    const viaGeoJSON = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: viaData.coordinates
      },
      properties: {
        name: viaData.structure_name,
        typology: viaData.typology,
        score: viaData.average_score
      }
    };

    // Adicionar fonte da via destacada
    if (this.map.getSource('highlighted-via')) {
      this.map.getSource('highlighted-via').setData(viaGeoJSON);
    } else {
      this.map.addSource('highlighted-via', {
        type: 'geojson',
        data: viaGeoJSON
      });

      // Adicionar camada da via destacada
      this.map.addLayer({
        id: 'highlighted-via-layer',
        type: 'line',
        source: 'highlighted-via',
        paint: {
          'line-color': this.getTypologyColor(viaData.typology),
          'line-width': 6,
          'line-opacity': 0.9
        }
      });
    }

    // Ajustar zoom para a via
    this.fitToVia(viaData.coordinates);
  }

  // Ajustar zoom para via
  fitToVia(coordinates) {
    if (!coordinates || coordinates.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach(coord => bounds.extend(coord));
    
    this.map.fitBounds(bounds, {
      padding: 50,
      maxZoom: 16
    });
  }

  // Adicionar waypoints
  async addWaypoints(waypoints) {
    if (!waypoints || waypoints.length === 0) return;

    // Carregar configuração de tipos de waypoints
    let waypointTypes = {};
    try {
      const response = await fetch('waypoint_types.json');
      const data = await response.json();
      waypointTypes = data.waypoint_types.reduce((acc, type) => {
        acc[type.name] = type.show;
        return acc;
      }, {});
    } catch (error) {
      console.warn('Não foi possível carregar configuração de waypoints, mostrando todos');
    }

    // Filtrar waypoints baseado no campo show
    const filteredWaypoints = waypoints.filter(wp => {
      return waypointTypes[wp.name] !== false; // Mostra se não estiver explicitamente como false
    });

    const waypointsGeoJSON = {
      type: 'FeatureCollection',
      features: filteredWaypoints.map(wp => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [wp.lon, wp.lat]
        },
        properties: {
          name: wp.name,
          description: wp.description,
          comment: wp.comment
        }
      }))
    };

    this.map.addSource('waypoints', {
      type: 'geojson',
      data: waypointsGeoJSON
    });

    this.map.addLayer({
      id: 'waypoints-layer',
      type: 'circle',
      source: 'waypoints',
      paint: {
        'circle-radius': 6,
        'circle-color': '#FF5722',
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 2
      }
    });

    // Adicionar popups nos waypoints
    this.map.on('click', 'waypoints-layer', (e) => {
      const properties = e.features[0].properties;
      const coordinates = e.features[0].geometry.coordinates.slice();

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
          <div class="waypoint-popup">
            <h4>${properties.name || 'Waypoint'}</h4>
            ${properties.description ? `<p>${properties.description}</p>` : ''}
            ${properties.comment ? `<p><em>${properties.comment}</em></p>` : ''}
          </div>
        `)
        .addTo(this.map);
    });

    // Cursor pointer nos waypoints
    this.map.on('mouseenter', 'waypoints-layer', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', 'waypoints-layer', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  // Cores por tipologia
  getTypologyColor(typology) {
    const colors = {
      'Ciclovia': '#dc2626', // vermelho
      'Ciclofaixa': '#16a34a', // verde
      'Calçada compartilhada': '#2563eb', // azul
      'Ciclorrota': '#F57C00'
    };
    return colors[typology] || '#666';
  }

  // Limpar mapa
  clear() {
    if (this.map.getLayer('highlighted-via-layer')) {
      this.map.removeLayer('highlighted-via-layer');
    }
    if (this.map.getSource('highlighted-via')) {
      this.map.removeSource('highlighted-via');
    }
    if (this.map.getLayer('waypoints-layer')) {
      this.map.removeLayer('waypoints-layer');
    }
    if (this.map.getSource('waypoints')) {
      this.map.removeSource('waypoints');
    }
  }
}

// Exportar para uso global
window.ViaMap = ViaMap;