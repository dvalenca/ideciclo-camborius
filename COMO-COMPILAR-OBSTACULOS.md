# Como Compilar Obstáculos por Cidade

Este documento explica como foi criado o arquivo `obstacles-by-city.json` que compila todos os obstáculos das estruturas cicloviárias por cidade.

## 📁 Fonte dos Dados

O arquivo fonte é `assets/data/rated-data.json`, que contém dados detalhados de cada estrutura cicloviária auditada, incluindo:

- Informações da estrutura (nome, cidade, tipo)
- Dados de obstáculos permanentes
- Contadores de cada tipo de obstáculo

## 🔍 Estrutura dos Dados de Obstáculos

Cada estrutura no `rated-data.json` possui os seguintes campos relacionados a obstáculos:

```json
{
  "result": {
    "gpx_name": "EDIT GPX - Ciclofaixa Av. Atlântica - BC.gpx",
    "city": "Balneário Camboriú",
    "all_obstacles_count": 100,
    "permanent_obstacles_asphalt_related": "Bueiro, Raíz, Buraco...",
    "manhole_covers": 57,
    "roots": 2,
    "potholes": 3,
    "deep_gutters_along_structure": 0,
    "unevenness_obstacles": 0,
    "other_obstacles": 4
  }
}
```

## 🛠️ Script de Compilação

### Passo 1: Criar o script Node.js

Crie um arquivo `compile-obstacles.js`:

```javascript
const fs = require('fs');

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

console.log('✅ Arquivo criado com sucesso!');
console.log(`\nBalneário Camboriú: ${obstaclesByCity['Balneario Camboriu'].totalObstacles} obstáculos`);
console.log(`Camboriú: ${obstaclesByCity['Camboriu'].totalObstacles} obstáculos`);
```

### Passo 2: Executar o script

```bash
node compile-obstacles.js
```

## 📊 Resultado

O arquivo gerado `obstacles-by-city.json` contém:

```json
{
  "Balneario Camboriu": {
    "totalStructures": 70,
    "totalObstacles": 531,
    "averageObstaclesPerStructure": "7.59",
    "obstacleTypes": {
      "manhole_covers": 274,
      "roots": 9,
      "potholes": 131,
      "deep_gutters_along_structure": 3,
      "unevenness_obstacles": 13,
      "other_obstacles": 58
    },
    "structures": [
      {
        "name": "EDIT GPX - Ciclofaixa Av. Atlântica - BC.gpx",
        "city": "Balneário Camboriú",
        "totalObstacles": 100,
        "manhole_covers": 57,
        "roots": 2,
        "potholes": 3,
        "deep_gutters": 0,
        "unevenness": 0,
        "other": 4,
        "permanent_obstacles_description": "Bueiro, Raíz, Buraco..."
      }
      // ... mais estruturas
    ]
  },
  "Camboriu": {
    // ... mesma estrutura
  }
}
```

## 🎯 Tipos de Obstáculos

| Campo | Descrição |
|-------|-----------|
| `manhole_covers` | Bueiros/tampas de esgoto |
| `roots` | Raízes de árvores |
| `potholes` | Buracos no asfalto |
| `deep_gutters_along_structure` | Valas profundas |
| `unevenness_obstacles` | Desníveis |
| `other_obstacles` | Outros obstáculos |

## 🔄 Atualização

Para atualizar os dados após novas auditorias:

1. Certifique-se que `rated-data.json` está atualizado
2. Execute novamente: `node compile-obstacles.js`
3. O arquivo `obstacles-by-city.json` será recriado

## 💡 Uso no Dashboard

Este arquivo pode ser usado para:

- Gráficos comparativos entre cidades
- Análise de tipos de obstáculos mais comuns
- Identificação de estruturas problemáticas
- Relatórios de manutenção prioritária

## 📝 Notas

- Estruturas sem obstáculos não aparecem na lista `structures`
- A identificação da cidade é feita pelo sufixo do nome do GPX (`- BC` ou `- Cb`)
- Médias são calculadas considerando todas as estruturas, mesmo as sem obstáculos
