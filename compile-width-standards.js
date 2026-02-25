import fs from 'fs';

const data = JSON.parse(
  fs.readFileSync('assets/data/rated-data.json', 'utf8')
);

// Padrões de referência (em cm)
const STANDARDS = {
  unidirecional_minima: 100,
  unidirecional_desejavel: 150,
  bidirecional_minima: 200,
  bidirecional_desejavel: 250
};

const cities = {
  'Balneario Camboriu': {
    name: 'Balneário Camboriú',
    unidirecional: [],
    bidirecional: [],
    all: []
  },
  'Camboriu': {
    name: 'Camboriú',
    unidirecional: [],
    bidirecional: [],
    all: []
  }
};

// Processar dados
data.forEach(structure => {
  const gpxName = structure.result?.gpx_name || '';
  const city = gpxName.includes('- BC') ? 'Balneario Camboriu' : 'Camboriu';
  const direction = structure.result?.flow_direction || '';
  const width = structure.result?.ridable_width || 0;
  const length = parseFloat(structure.result?.seg_length || 0);
  
  const tipoVia = structure.tipo_da_via || {};
  let typology = 'Não identificado';
  if (tipoVia['Ciclovia'] === 1) typology = 'Ciclovia';
  else if (tipoVia['Ciclofaixa'] === 1) typology = 'Ciclofaixa';
  else if (tipoVia['Ciclorrota'] === 1) typology = 'Ciclorrota';
  else if (tipoVia['Calçada compartilhada'] === 1) typology = 'Calçada Compartilhada';
  
  if (width > 0 && length > 0) {
    const item = { name: gpxName, typology, direction, width, length };
    
    cities[city].all.push(item);
    
    if (direction.includes('Unidirecional')) {
      cities[city].unidirecional.push(item);
    } else if (direction.includes('Bidirecional')) {
      cities[city].bidirecional.push(item);
    }
  }
});

// Gerar Markdown
let md = '# Análise de Larguras por Padrões Técnicos\n\n';
md += 'Análise comparativa das larguras das estruturas cicloviárias em relação aos padrões técnicos recomendados.\n\n';
md += '## 📏 Padrões de Referência\n\n';
md += '| Tipo | Largura Mínima | Largura Desejável |\n';
md += '|------|----------------|-------------------|\n';
md += '| **Unidirecional** | 100 cm (1,0 m) | 150 cm (1,5 m) |\n';
md += '| **Bidirecional** | 200 cm (2,0 m) | 250 cm (2,5 m) |\n\n';
md += '---\n\n';

Object.keys(cities).forEach(cityKey => {
  const city = cities[cityKey];
  
  md += `## 🏙️ ${city.name}\n\n`;
  
  // Unidirecional
  if (city.unidirecional.length > 0) {
    md += '### Estruturas Unidirecionais\n\n';
    
    // Comparação com mínima (100cm)
    const uniAbaixoMinima = city.unidirecional.filter(s => s.width < STANDARDS.unidirecional_minima);
    const uniAcimaMinima = city.unidirecional.filter(s => s.width >= STANDARDS.unidirecional_minima);
    
    md += '#### Comparação com Largura Mínima (100 cm)\n\n';
    md += '| Situação | Estruturas | Extensão (m) | % Estruturas | % Extensão |\n';
    md += '|----------|-----------|--------------|--------------|------------|\n';
    
    const uniTotalExt = city.unidirecional.reduce((sum, s) => sum + s.length, 0);
    const uniAbaixoExt = uniAbaixoMinima.reduce((sum, s) => sum + s.length, 0);
    const uniAcimaExt = uniAcimaMinima.reduce((sum, s) => sum + s.length, 0);
    
    md += `| **Abaixo da mínima** | ${uniAbaixoMinima.length} | ${uniAbaixoExt.toFixed(2)} | ${((uniAbaixoMinima.length/city.unidirecional.length)*100).toFixed(1)}% | ${((uniAbaixoExt/uniTotalExt)*100).toFixed(1)}% |\n`;
    md += `| **Acima da mínima** | ${uniAcimaMinima.length} | ${uniAcimaExt.toFixed(2)} | ${((uniAcimaMinima.length/city.unidirecional.length)*100).toFixed(1)}% | ${((uniAcimaExt/uniTotalExt)*100).toFixed(1)}% |\n\n`;
    
    // Comparação com desejável (150cm)
    const uniAbaixoDesejavel = city.unidirecional.filter(s => s.width < STANDARDS.unidirecional_desejavel);
    const uniAcimaDesejavel = city.unidirecional.filter(s => s.width >= STANDARDS.unidirecional_desejavel);
    
    md += '#### Comparação com Largura Desejável (150 cm)\n\n';
    md += '| Situação | Estruturas | Extensão (m) | % Estruturas | % Extensão |\n';
    md += '|----------|-----------|--------------|--------------|------------|\n';
    
    const uniAbaixoDesejavelExt = uniAbaixoDesejavel.reduce((sum, s) => sum + s.length, 0);
    const uniAcimaDesejavelExt = uniAcimaDesejavel.reduce((sum, s) => sum + s.length, 0);
    
    md += `| **Abaixo da desejável** | ${uniAbaixoDesejavel.length} | ${uniAbaixoDesejavelExt.toFixed(2)} | ${((uniAbaixoDesejavel.length/city.unidirecional.length)*100).toFixed(1)}% | ${((uniAbaixoDesejavelExt/uniTotalExt)*100).toFixed(1)}% |\n`;
    md += `| **Acima da desejável** | ${uniAcimaDesejavel.length} | ${uniAcimaDesejavelExt.toFixed(2)} | ${((uniAcimaDesejavel.length/city.unidirecional.length)*100).toFixed(1)}% | ${((uniAcimaDesejavelExt/uniTotalExt)*100).toFixed(1)}% |\n\n`;
  }
  
  // Bidirecional
  if (city.bidirecional.length > 0) {
    md += '### Estruturas Bidirecionais\n\n';
    
    // Comparação com mínima (200cm)
    const biAbaixoMinima = city.bidirecional.filter(s => s.width < STANDARDS.bidirecional_minima);
    const biAcimaMinima = city.bidirecional.filter(s => s.width >= STANDARDS.bidirecional_minima);
    
    md += '#### Comparação com Largura Mínima (200 cm)\n\n';
    md += '| Situação | Estruturas | Extensão (m) | % Estruturas | % Extensão |\n';
    md += '|----------|-----------|--------------|--------------|------------|\n';
    
    const biTotalExt = city.bidirecional.reduce((sum, s) => sum + s.length, 0);
    const biAbaixoExt = biAbaixoMinima.reduce((sum, s) => sum + s.length, 0);
    const biAcimaExt = biAcimaMinima.reduce((sum, s) => sum + s.length, 0);
    
    md += `| **Abaixo da mínima** | ${biAbaixoMinima.length} | ${biAbaixoExt.toFixed(2)} | ${((biAbaixoMinima.length/city.bidirecional.length)*100).toFixed(1)}% | ${((biAbaixoExt/biTotalExt)*100).toFixed(1)}% |\n`;
    md += `| **Acima da mínima** | ${biAcimaMinima.length} | ${biAcimaExt.toFixed(2)} | ${((biAcimaMinima.length/city.bidirecional.length)*100).toFixed(1)}% | ${((biAcimaExt/biTotalExt)*100).toFixed(1)}% |\n\n`;
    
    // Comparação com desejável (250cm)
    const biAbaixoDesejavel = city.bidirecional.filter(s => s.width < STANDARDS.bidirecional_desejavel);
    const biAcimaDesejavel = city.bidirecional.filter(s => s.width >= STANDARDS.bidirecional_desejavel);
    
    md += '#### Comparação com Largura Desejável (250 cm)\n\n';
    md += '| Situação | Estruturas | Extensão (m) | % Estruturas | % Extensão |\n';
    md += '|----------|-----------|--------------|--------------|------------|\n';
    
    const biAbaixoDesejavelExt = biAbaixoDesejavel.reduce((sum, s) => sum + s.length, 0);
    const biAcimaDesejavelExt = biAcimaDesejavel.reduce((sum, s) => sum + s.length, 0);
    
    md += `| **Abaixo da desejável** | ${biAbaixoDesejavel.length} | ${biAbaixoDesejavelExt.toFixed(2)} | ${((biAbaixoDesejavel.length/city.bidirecional.length)*100).toFixed(1)}% | ${((biAbaixoDesejavelExt/biTotalExt)*100).toFixed(1)}% |\n`;
    md += `| **Acima da desejável** | ${biAcimaDesejavel.length} | ${biAcimaDesejavelExt.toFixed(2)} | ${((biAcimaDesejavel.length/city.bidirecional.length)*100).toFixed(1)}% | ${((biAcimaDesejavelExt/biTotalExt)*100).toFixed(1)}% |\n\n`;
  }
  
  // Resumo geral da cidade
  md += '### 📊 Resumo Geral (Todas as Estruturas)\n\n';
  
  const totalExt = city.all.reduce((sum, s) => sum + s.length, 0);
  
  // Calcular abaixo da mínima (considerando direção)
  const abaixoMinima = city.all.filter(s => {
    if (s.direction.includes('Unidirecional')) return s.width < STANDARDS.unidirecional_minima;
    if (s.direction.includes('Bidirecional')) return s.width < STANDARDS.bidirecional_minima;
    return false;
  });
  
  const abaixoDesejavel = city.all.filter(s => {
    if (s.direction.includes('Unidirecional')) return s.width < STANDARDS.unidirecional_desejavel;
    if (s.direction.includes('Bidirecional')) return s.width < STANDARDS.bidirecional_desejavel;
    return false;
  });
  
  const abaixoMinimaExt = abaixoMinima.reduce((sum, s) => sum + s.length, 0);
  const abaixoDesejavelExt = abaixoDesejavel.reduce((sum, s) => sum + s.length, 0);
  
  md += '| Critério | Estruturas | Extensão (m) | % Estruturas | % Extensão |\n';
  md += '|----------|-----------|--------------|--------------|------------|\n';
  md += `| **Abaixo da mínima** | ${abaixoMinima.length} | ${abaixoMinimaExt.toFixed(2)} | ${((abaixoMinima.length/city.all.length)*100).toFixed(1)}% | ${((abaixoMinimaExt/totalExt)*100).toFixed(1)}% |\n`;
  md += `| **Abaixo da desejável** | ${abaixoDesejavel.length} | ${abaixoDesejavelExt.toFixed(2)} | ${((abaixoDesejavel.length/city.all.length)*100).toFixed(1)}% | ${((abaixoDesejavelExt/totalExt)*100).toFixed(1)}% |\n\n`;
  
  md += '---\n\n';
});

// Comparação entre cidades
md += '## 🔄 Comparação entre Cidades\n\n';
md += '| Cidade | Total Estruturas | Abaixo Mínima | % Abaixo Mínima | Abaixo Desejável | % Abaixo Desejável |\n';
md += '|--------|------------------|---------------|-----------------|------------------|--------------------|\n';

Object.keys(cities).forEach(cityKey => {
  const city = cities[cityKey];
  
  const abaixoMinima = city.all.filter(s => {
    if (s.direction.includes('Unidirecional')) return s.width < STANDARDS.unidirecional_minima;
    if (s.direction.includes('Bidirecional')) return s.width < STANDARDS.bidirecional_minima;
    return false;
  });
  
  const abaixoDesejavel = city.all.filter(s => {
    if (s.direction.includes('Unidirecional')) return s.width < STANDARDS.unidirecional_desejavel;
    if (s.direction.includes('Bidirecional')) return s.width < STANDARDS.bidirecional_desejavel;
    return false;
  });
  
  md += `| **${city.name}** | ${city.all.length} | ${abaixoMinima.length} | ${((abaixoMinima.length/city.all.length)*100).toFixed(1)}% | ${abaixoDesejavel.length} | ${((abaixoDesejavel.length/city.all.length)*100).toFixed(1)}% |\n`;
});

md += '\n---\n\n';
md += '## 📝 Notas\n\n';
md += '- **Largura Mínima**: Padrão mínimo aceitável para circulação segura\n';
md += '- **Largura Desejável**: Padrão ideal para conforto e segurança\n';
md += '- **Unidirecional**: Estruturas com fluxo em uma única direção\n';
md += '- **Bidirecional**: Estruturas com fluxo nos dois sentidos\n';
md += '- Percentuais calculados sobre o total de estruturas/extensão de cada categoria\n';

fs.writeFileSync('ANALISE-PADROES-LARGURA.md', md);

console.log('✅ Arquivo ANALISE-PADROES-LARGURA.md criado com sucesso!\n');
