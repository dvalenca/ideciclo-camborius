# Como Analisar Larguras das Estruturas Cicloviárias

Este documento explica como foi criado o arquivo `widths-analysis.json` que compila dados de largura (ridable_width) das ciclovias, ciclofaixas e vias compartilhadas.

## 📁 Fonte dos Dados

O arquivo fonte é `assets/data/rated-data.json`, que contém o campo `ridable_width` (largura útil em centímetros) para cada estrutura auditada.

## 🔍 Estrutura dos Dados de Largura

Cada estrutura possui:

```json
{
  "result": {
    "gpx_name": "EDIT GPX - Ciclovia 4a. Av. - BC.gpx",
    "city": "Balneário Camboriú",
    "ridable_width": 218,
    "seg_length": "1500"
  }
}
```

## 🛠️ Script de Análise

### Criar o arquivo `compile-widths.js`:

```javascript
const fs = require('fs');

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

console.log('✅ Arquivo criado com sucesso!');
```

### Executar o script:

```bash
node compile-widths.js
```

## 📊 Resultados Obtidos

### Resumo Geral
- **Total de estruturas:** 111
- **Largura mínima:** 75 cm
- **Largura máxima:** 350 cm
- **Largura média:** 181.97 cm
- **Extensão total:** 107.369 km

### Por Cidade

| Cidade | Estruturas | Min | Max | Média | Extensão |
|--------|-----------|-----|-----|-------|----------|
| Balneário Camboriú | 70 | 85 cm | 350 cm | 186.61 cm | 65.885 km |
| Camboriú | 41 | 75 cm | 299 cm | 174.05 cm | 41.484 km |

### Por Tipo de Estrutura

| Tipo | Quantidade | Min | Max | Média | Extensão |
|------|-----------|-----|-----|-------|----------|
| Ciclovia | 27 | 141 cm | 300 cm | 218.33 cm | 26.400 km |
| Ciclofaixa | 74 | 75 cm | 234 cm | 166.62 cm | 77.734 km |
| Compartilhada | 10 | 85 cm | 350 cm | 197.40 cm | 3.235 km |

### Distribuição por Faixa de Largura

| Faixa | Estruturas | Extensão | % Estruturas | % Extensão |
|-------|-----------|----------|--------------|------------|
| 0-100cm | 2 | 310 m | 1.8% | 0.3% |
| 100-150cm | 21 | 26.439 km | 18.9% | 24.6% |
| 150-200cm | 58 | 56.995 km | 52.3% | 53.1% |
| 200-250cm | 20 | 19.865 km | 18.0% | 18.5% |
| 250-300cm | 7 | 3.185 km | 6.3% | 3.0% |
| 300+cm | 3 | 575 m | 2.7% | 0.5% |

## 📈 Estrutura do JSON Gerado

```json
{
  "summary": {
    "total_structures": 111,
    "structures_with_width": 111,
    "min_width": 75,
    "max_width": 350,
    "avg_width": "181.97",
    "total_extension": 107369
  },
  "by_city": {
    "Balneario Camboriu": {
      "total_structures": 70,
      "min_width": 85,
      "max_width": 350,
      "avg_width": "186.61",
      "total_extension": 65885
    },
    "Camboriu": { /* ... */ }
  },
  "by_type": {
    "Ciclovia": {
      "count": 27,
      "min": 141,
      "max": 300,
      "avg": "218.33",
      "total_extension": 26400
    },
    "Ciclofaixa": { /* ... */ },
    "Compart.": { /* ... */ }
  },
  "width_distribution": {
    "0-100cm": {
      "count": 2,
      "extension": 310,
      "structures": [
        {
          "name": "EDIT GPX - Ciclofaixa R. Jesuíno A. Pereira T1 - Cb.gpx",
          "city": "Camboriu",
          "type": "Ciclofaixa",
          "width": 75,
          "length": 245
        }
      ]
    },
    "100-150cm": { /* ... */ }
    /* ... outras faixas ... */
  },
  "structures": [
    /* Lista completa ordenada por largura (decrescente) */
  ]
}
```

## 🎯 Insights

### Larguras Críticas
- **2 estruturas** com menos de 100cm (inadequadas)
- **Menor largura:** 75cm (Ciclofaixa R. Jesuíno A. Pereira T1 - Cb)
- **Maior largura:** 350cm (Via compartilhada)

### Padrões por Tipo
- **Ciclovias** são mais largas (média 218cm)
- **Ciclofaixas** são mais estreitas (média 167cm)
- **Compartilhadas** têm grande variação (85-350cm)

### Concentração
- **52.3%** das estruturas têm entre 150-200cm
- **53.1%** da extensão total está nessa faixa

## 💡 Uso no Dashboard

Este arquivo pode gerar:

- **Gráfico de barras:** Distribuição de estruturas por faixa de largura
- **Gráfico de pizza:** Distribuição de extensão por faixa
- **Comparativo:** Larguras médias por cidade/tipo
- **Ranking:** Estruturas mais/menos largas
- **Mapa de calor:** Larguras por região

## 🔄 Atualização

Para atualizar após novas auditorias:

```bash
node compile-widths.js
```

## 📝 Notas Técnicas

- Larguras em **centímetros** (cm)
- Extensões em **metros** (m)
- Campo fonte: `ridable_width` (largura útil para circulação)
- Estruturas ordenadas por largura decrescente
- Faixas de distribuição configuráveis no script
