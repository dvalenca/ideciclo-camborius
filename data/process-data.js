// Script para processar dados do ciclomputador para o hotsite
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar dados
const ratedData = JSON.parse(fs.readFileSync('../assets/data/rated-data.json', 'utf8'));
const balnearioGeoJSON = JSON.parse(fs.readFileSync('../../crosses/Balneario.geojson', 'utf8'));
const camboriuGeoJSON = JSON.parse(fs.readFileSync('../../crosses/Camboriu.geojson', 'utf8'));



// Função para determinar tipologia
function getTypology(data) {
  // Primeiro, tentar detectar pelo campo tipo_da_via (aceitar valores > 0)
  if (data.tipo_da_via?.Ciclovia > 0) return 'Ciclovia';
  if (data.tipo_da_via?.Ciclofaixa > 0) return 'Ciclofaixa';
  if (data.tipo_da_via?.Ciclorrota > 0) return 'Ciclorrota';
  if (data.tipo_da_via?.['Calçada compartilhada'] > 0) return 'Calçada compartilhada';
  
  // Fallback: detectar pelo nome da estrutura
  const structureName = data.result?.structure_name || '';
  if (structureName.includes('Ciclofaixa')) return 'Ciclofaixa';
  if (structureName.includes('Ciclovia')) return 'Ciclovia';
  if (structureName.includes('Compart.')) return 'Calçada compartilhada';
  if (structureName.includes('Ciclorrota')) return 'Ciclorrota';
  
  return 'Não identificada';
}

// Função para encontrar coordenadas no GeoJSON
function findCoordinatesInGeoJSON(gpxName, geoJSONData) {
  const feature = geoJSONData.features.find(f => 
    f.properties.src === gpxName || 
    f.properties.name_2 === gpxName.replace('EDIT GPX - ', '').replace('.gpx', '')
  );
  return feature ? feature.geometry.coordinates : null;
}

// Processar dados principais
const processedData = ratedData.map(item => {
  const city = item.result.city || 'Não identificada';
  const typology = getTypology(item);
  
  // Buscar coordenadas
  let coordinates = null;
  if (city === 'Balneário Camboriú') {
    coordinates = findCoordinatesInGeoJSON(item.result.gpx_name, balnearioGeoJSON);
  } else if (city === 'Camboriú') {
    coordinates = findCoordinatesInGeoJSON(item.result.gpx_name, camboriuGeoJSON);
  }

  return {
    id: item.id,
    gpx_name: item.result.gpx_name,
    structure_name: item.result.structure_name,
    city: city,
    typology: typology,
    length: parseInt(item.result.seg_length) || 0,
    coordinates: coordinates,
    
    // Notas principais
    average_score: item.rates?.average || 0,
    project_score: item.rates?.project || 0,
    protection_score: item.rates?.protection || 0,
    comfort_score: item.rates?.comfort || 0,
    safety_score: item.rates?.safety || 0,
    
    // Dados completos para página individual
    full_data: item.result,
    full_rates: item.rates,
    metadata: item.metadata,
    
    // Para busca e filtros
    searchable_text: `${item.result.structure_name} ${city} ${typology}`.toLowerCase()
  };
});

// Criar metadados das vias
const viasMetadata = {
  cities: ['Camboriú', 'Balneário Camboriú'],
  typologies: ['Ciclovia', 'Ciclofaixa', 'Ciclorrota', 'Calçada compartilhada'],
  total_structures: processedData.length,
  total_length: processedData.reduce((sum, item) => sum + item.length, 0),
  by_city: {
    'Camboriú': processedData.filter(item => item.city === 'Camboriú').length,
    'Balneário Camboriú': processedData.filter(item => item.city === 'Balneário Camboriú').length
  },
  by_typology: {
    'Ciclovia': processedData.filter(item => item.typology === 'Ciclovia').length,
    'Ciclofaixa': processedData.filter(item => item.typology === 'Ciclofaixa').length,
    'Ciclorrota': processedData.filter(item => item.typology === 'Ciclorrota').length,
    'Calçada compartilhada': processedData.filter(item => item.typology === 'Calçada compartilhada').length
  },
  score_ranges: {
    excellent: processedData.filter(item => item.average_score >= 8).length,
    good: processedData.filter(item => item.average_score >= 6 && item.average_score < 8).length,
    regular: processedData.filter(item => item.average_score >= 4 && item.average_score < 6).length,
    poor: processedData.filter(item => item.average_score >= 2 && item.average_score < 4).length,
    inadequate: processedData.filter(item => item.average_score < 2).length
  }
};

// Salvar arquivos processados
fs.writeFileSync('./processed-data.json', JSON.stringify(processedData, null, 2));
fs.writeFileSync('./vias-metadata.json', JSON.stringify(viasMetadata, null, 2));

// Criar GeoJSON combinado para mapas
const combinedGeoJSON = {
  type: "FeatureCollection",
  features: [
    ...balnearioGeoJSON.features.map(f => ({
      ...f,
      properties: {
        ...f.properties,
        city: 'Balneário Camboriú'
      }
    })),
    ...camboriuGeoJSON.features.map(f => ({
      ...f,
      properties: {
        ...f.properties,
        city: 'Camboriú'
      }
    }))
  ]
};

fs.writeFileSync('./combined-routes.geojson', JSON.stringify(combinedGeoJSON, null, 2));

console.log('✅ Dados processados com sucesso!');
console.log(`📊 Total de estruturas: ${processedData.length}`);
console.log(`📏 Extensão total: ${viasMetadata.total_length}m`);
console.log(`🏙️ Camboriú: ${viasMetadata.by_city['Camboriú']} estruturas`);
console.log(`🏖️ Balneário Camboriú: ${viasMetadata.by_city['Balneário Camboriú']} estruturas`);