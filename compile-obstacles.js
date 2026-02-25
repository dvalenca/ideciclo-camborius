import fs from 'fs';

// Ler dados originais
const data = JSON.parse(
  fs.readFileSync('assets/data/rated-data.json', 'utf8')
);

// Estrutura para armazenar resultados
const obstaclesByCity = {
  'Balneario Camboriu': {
    totalStructures: 0,
    totalObstacles: 0,
    obstacleTypes: {
      manhole_covers: 0,
      roots: 0,
      potholes: 0,
      deep_gutters_along_structure: 0,
      unevenness_obstacles: 0,
      other_obstacles: 0
    },
    structures: []
  },
  'Camboriu': {
    totalStructures: 0,
    totalObstacles: 0,
    obstacleTypes: {
      manhole_covers: 0,
      roots: 0,
      potholes: 0,
      deep_gutters_along_structure: 0,
      unevenness_obstacles: 0,
      other_obstacles: 0
    },
    structures: []
  }
};

// Processar cada estrutura
data.forEach(structure => {
  const gpxName = structure.result?.gpx_name || '';
  const city = gpxName.includes('- BC') ? 'Balneario Camboriu' : 'Camboriu';
  
  const obstacleData = {
    name: gpxName,
    city: structure.result?.city || city,
    totalObstacles: structure.result?.all_obstacles_count || 0,
    manhole_covers: structure.result?.manhole_covers || 0,
    roots: structure.result?.roots || 0,
    potholes: structure.result?.potholes || 0,
    deep_gutters: structure.result?.deep_gutters_along_structure || 0,
    unevenness: structure.result?.unevenness_obstacles || 0,
    other: structure.result?.other_obstacles || 0,
    permanent_obstacles_description: structure.result?.permanent_obstacles_asphalt_related || 'Nenhum'
  };
  
  // Acumular totais
  obstaclesByCity[city].totalStructures++;
  obstaclesByCity[city].totalObstacles += obstacleData.totalObstacles;
  obstaclesByCity[city].obstacleTypes.manhole_covers += obstacleData.manhole_covers;
  obstaclesByCity[city].obstacleTypes.roots += obstacleData.roots;
  obstaclesByCity[city].obstacleTypes.potholes += obstacleData.potholes;
  obstaclesByCity[city].obstacleTypes.deep_gutters_along_structure += obstacleData.deep_gutters;
  obstaclesByCity[city].obstacleTypes.unevenness_obstacles += obstacleData.unevenness;
  obstaclesByCity[city].obstacleTypes.other_obstacles += obstacleData.other;
  
  // Adicionar estrutura se tiver obstáculos
  if (obstacleData.totalObstacles > 0) {
    obstaclesByCity[city].structures.push(obstacleData);
  }
});

// Calcular médias
Object.keys(obstaclesByCity).forEach(city => {
  const cityData = obstaclesByCity[city];
  cityData.averageObstaclesPerStructure = cityData.totalStructures > 0 
    ? (cityData.totalObstacles / cityData.totalStructures).toFixed(2)
    : 0;
});

// Salvar resultado
fs.writeFileSync(
  'assets/data/obstacles-by-city.json',
  JSON.stringify(obstaclesByCity, null, 2)
);

console.log('✅ Arquivo obstacles-by-city.json criado com sucesso!\n');
console.log('📊 RESUMO:');
console.log(`\nBalneário Camboriú:`);
console.log(`   ${obstaclesByCity['Balneario Camboriu'].totalObstacles} obstáculos em ${obstaclesByCity['Balneario Camboriu'].totalStructures} estruturas`);
console.log(`   Média: ${obstaclesByCity['Balneario Camboriu'].averageObstaclesPerStructure} obstáculos/estrutura`);
console.log(`\nCamboriú:`);
console.log(`   ${obstaclesByCity['Camboriu'].totalObstacles} obstáculos em ${obstaclesByCity['Camboriu'].totalStructures} estruturas`);
console.log(`   Média: ${obstaclesByCity['Camboriu'].averageObstaclesPerStructure} obstáculos/estrutura`);
