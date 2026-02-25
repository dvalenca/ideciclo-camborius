import fs from 'fs';

// Ler dados originais
const data = JSON.parse(
  fs.readFileSync('assets/data/rated-data.json', 'utf8')
);

// Estrutura para armazenar resultados
const widthData = {
  summary: {
    total_structures: 0,
    structures_with_width: 0,
    min_width: Infinity,
    max_width: 0,
    avg_width: 0,
    total_extension: 0
  },
  by_city: {
    'Balneario Camboriu': {
      total_structures: 0,
      min_width: Infinity,
      max_width: 0,
      avg_width: 0,
      total_extension: 0
    },
    'Camboriu': {
      total_structures: 0,
      min_width: Infinity,
      max_width: 0,
      avg_width: 0,
      total_extension: 0
    }
  },
  by_type: {
    'Ciclovia': { count: 0, min: Infinity, max: 0, avg: 0, total_extension: 0 },
    'Ciclofaixa': { count: 0, min: Infinity, max: 0, avg: 0, total_extension: 0 },
    'Compart.': { count: 0, min: Infinity, max: 0, avg: 0, total_extension: 0 }
  },
  width_distribution: {
    '0-100cm': { count: 0, extension: 0, structures: [] },
    '100-150cm': { count: 0, extension: 0, structures: [] },
    '150-200cm': { count: 0, extension: 0, structures: [] },
    '200-250cm': { count: 0, extension: 0, structures: [] },
    '250-300cm': { count: 0, extension: 0, structures: [] },
    '300+cm': { count: 0, extension: 0, structures: [] }
  },
  structures: []
};

let totalWidth = 0;
let widthCount = 0;

// Processar cada estrutura
data.forEach(structure => {
  const gpxName = structure.result?.gpx_name || '';
  const city = gpxName.includes('- BC') ? 'Balneario Camboriu' : 'Camboriu';
  const width = structure.result?.ridable_width || 0;
  const length = parseFloat(structure.result?.seg_length || 0);
  
  // Extrair tipo de estrutura do nome
  let structureType = 'Ciclofaixa';
  if (gpxName.includes('Ciclovia')) structureType = 'Ciclovia';
  else if (gpxName.includes('Compart.')) structureType = 'Compart.';
  
  widthData.summary.total_structures++;
  widthData.by_city[city].total_structures++;
  widthData.by_city[city].total_extension += length;
  widthData.summary.total_extension += length;
  
  if (width > 0) {
    widthData.summary.structures_with_width++;
    totalWidth += width;
    widthCount++;
    
    // Min/Max geral
    if (width < widthData.summary.min_width) widthData.summary.min_width = width;
    if (width > widthData.summary.max_width) widthData.summary.max_width = width;
    
    // Min/Max por cidade
    if (width < widthData.by_city[city].min_width) widthData.by_city[city].min_width = width;
    if (width > widthData.by_city[city].max_width) widthData.by_city[city].max_width = width;
    
    // Min/Max por tipo
    if (width < widthData.by_type[structureType].min) widthData.by_type[structureType].min = width;
    if (width > widthData.by_type[structureType].max) widthData.by_type[structureType].max = width;
    widthData.by_type[structureType].count++;
    widthData.by_type[structureType].total_extension += length;
    
    // Distribuição por faixa de largura
    let range = '300+cm';
    if (width < 100) range = '0-100cm';
    else if (width < 150) range = '100-150cm';
    else if (width < 200) range = '150-200cm';
    else if (width < 250) range = '200-250cm';
    else if (width < 300) range = '250-300cm';
    
    widthData.width_distribution[range].count++;
    widthData.width_distribution[range].extension += length;
    widthData.width_distribution[range].structures.push({
      name: gpxName,
      city: city,
      type: structureType,
      width: width,
      length: length
    });
    
    // Adicionar à lista de estruturas
    widthData.structures.push({
      name: gpxName,
      city: city,
      type: structureType,
      width: width,
      length: length
    });
  }
});

// Calcular médias
widthData.summary.avg_width = widthCount > 0 ? (totalWidth / widthCount).toFixed(2) : 0;

Object.keys(widthData.by_city).forEach(city => {
  const cityStructures = widthData.structures.filter(s => s.city === city);
  const cityWidthSum = cityStructures.reduce((sum, s) => sum + s.width, 0);
  widthData.by_city[city].avg_width = cityStructures.length > 0 
    ? (cityWidthSum / cityStructures.length).toFixed(2) 
    : 0;
  
  if (widthData.by_city[city].min_width === Infinity) widthData.by_city[city].min_width = null;
});

Object.keys(widthData.by_type).forEach(type => {
  const typeStructures = widthData.structures.filter(s => s.type === type);
  const typeWidthSum = typeStructures.reduce((sum, s) => sum + s.width, 0);
  widthData.by_type[type].avg = typeStructures.length > 0 
    ? (typeWidthSum / typeStructures.length).toFixed(2) 
    : 0;
  
  if (widthData.by_type[type].min === Infinity) widthData.by_type[type].min = null;
});

if (widthData.summary.min_width === Infinity) widthData.summary.min_width = null;

// Ordenar estruturas por largura (decrescente)
widthData.structures.sort((a, b) => b.width - a.width);

// Salvar resultado
fs.writeFileSync(
  'assets/data/widths-analysis.json',
  JSON.stringify(widthData, null, 2)
);

console.log('✅ Arquivo widths-analysis.json criado com sucesso!\n');
console.log('📊 RESUMO GERAL:');
console.log(`   Total de estruturas: ${widthData.summary.total_structures}`);
console.log(`   Estruturas com largura: ${widthData.summary.structures_with_width}`);
console.log(`   Largura mínima: ${widthData.summary.min_width} cm`);
console.log(`   Largura máxima: ${widthData.summary.max_width} cm`);
console.log(`   Largura média: ${widthData.summary.avg_width} cm`);
console.log(`   Extensão total: ${widthData.summary.total_extension.toFixed(2)} m\n`);

console.log('🏙️  POR CIDADE:');
Object.keys(widthData.by_city).forEach(city => {
  const c = widthData.by_city[city];
  console.log(`   ${city}:`);
  console.log(`     Min: ${c.min_width} cm | Max: ${c.max_width} cm | Média: ${c.avg_width} cm`);
  console.log(`     Extensão: ${c.total_extension.toFixed(2)} m\n`);
});

console.log('🚴 POR TIPO:');
Object.keys(widthData.by_type).forEach(type => {
  const t = widthData.by_type[type];
  if (t.count > 0) {
    console.log(`   ${type}: ${t.count} estruturas`);
    console.log(`     Min: ${t.min} cm | Max: ${t.max} cm | Média: ${t.avg} cm`);
    console.log(`     Extensão: ${t.total_extension.toFixed(2)} m\n`);
  }
});

console.log('📏 DISTRIBUIÇÃO POR LARGURA:');
Object.keys(widthData.width_distribution).forEach(range => {
  const d = widthData.width_distribution[range];
  console.log(`   ${range}: ${d.count} estruturas | ${d.extension.toFixed(2)} m`);
});
