import fs from 'fs';

const data = JSON.parse(
  fs.readFileSync('assets/data/rated-data.json', 'utf8')
);

const analysis = {};

data.forEach(structure => {
  const direction = structure.result?.flow_direction || 'Não informado';
  const width = structure.result?.ridable_width || 0;
  const length = parseFloat(structure.result?.seg_length || 0);
  
  // Extrair tipologia do campo tipo_da_via
  let typology = 'Não identificado';
  const tipoVia = structure.tipo_da_via || {};
  
  if (tipoVia['Ciclovia'] === 1) typology = 'Ciclovia';
  else if (tipoVia['Ciclofaixa'] === 1) typology = 'Ciclofaixa';
  else if (tipoVia['Ciclorrota'] === 1) typology = 'Ciclorrota';
  else if (tipoVia['Calçada compartilhada'] === 1) typology = 'Calçada Compartilhada';
  
  if (width > 0 && length > 0) {
    const key = `${typology}|${direction}`;
    
    if (!analysis[key]) {
      analysis[key] = {
        typology,
        direction,
        count: 0,
        totalWidth: 0,
        totalLength: 0,
        totalWidthKm: 0
      };
    }
    
    analysis[key].count++;
    analysis[key].totalWidth += width;
    analysis[key].totalLength += length;
    analysis[key].totalWidthKm += (width * length);
  }
});

const results = Object.values(analysis).map(item => ({
  typology: item.typology,
  direction: item.direction,
  count: item.count,
  totalLength: item.totalLength.toFixed(2),
  avgWidthByStructure: (item.totalWidth / item.count).toFixed(2),
  avgWidthByKm: (item.totalWidthKm / item.totalLength).toFixed(2)
}));

results.sort((a, b) => {
  if (a.typology !== b.typology) return a.typology.localeCompare(b.typology);
  return a.direction.localeCompare(b.direction);
});

fs.writeFileSync(
  'assets/data/widths-by-typology.json',
  JSON.stringify(results, null, 2)
);

console.log('\n📊 LARGURAS POR TIPOLOGIA E DIREÇÃO\n');
console.log('┌──────────────────────┬──────────────────┬────────────┬──────────────┬─────────────────────┬──────────────────────┐');
console.log('│ Tipologia            │ Direção          │ Estruturas │ Extensão (m) │ Média por Estrutura │ Média Ponderada (km) │');
console.log('├──────────────────────┼──────────────────┼────────────┼──────────────┼─────────────────────┼──────────────────────┤');

results.forEach(item => {
  const typ = item.typology.padEnd(20);
  const dir = item.direction.padEnd(16);
  const cnt = String(item.count).padStart(10);
  const len = String(item.totalLength).padStart(12);
  const avg1 = (String(item.avgWidthByStructure) + ' cm').padStart(19);
  const avg2 = (String(item.avgWidthByKm) + ' cm').padStart(20);
  
  console.log(`│ ${typ} │ ${dir} │ ${cnt} │ ${len} │ ${avg1} │ ${avg2} │`);
});

console.log('└──────────────────────┴──────────────────┴────────────┴──────────────┴─────────────────────┴──────────────────────┘');

// Resumo por tipologia
console.log('\n📈 RESUMO POR TIPOLOGIA\n');
const byTypology = {};
results.forEach(item => {
  if (!byTypology[item.typology]) {
    byTypology[item.typology] = {
      count: 0,
      totalLength: 0,
      totalWidth: 0,
      totalWidthKm: 0
    };
  }
  byTypology[item.typology].count += item.count;
  byTypology[item.typology].totalLength += parseFloat(item.totalLength);
  byTypology[item.typology].totalWidth += (parseFloat(item.avgWidthByStructure) * item.count);
  byTypology[item.typology].totalWidthKm += (parseFloat(item.avgWidthByKm) * parseFloat(item.totalLength));
});

console.log('┌──────────────────────┬────────────┬──────────────┬─────────────────────┬──────────────────────┐');
console.log('│ Tipologia            │ Estruturas │ Extensão (m) │ Média por Estrutura │ Média Ponderada (km) │');
console.log('├──────────────────────┼────────────┼──────────────┼─────────────────────┼──────────────────────┤');

Object.keys(byTypology).sort().forEach(typ => {
  const item = byTypology[typ];
  const typName = typ.padEnd(20);
  const cnt = String(item.count).padStart(10);
  const len = String(item.totalLength.toFixed(2)).padStart(12);
  const avg1 = (String((item.totalWidth / item.count).toFixed(2)) + ' cm').padStart(19);
  const avg2 = (String((item.totalWidthKm / item.totalLength).toFixed(2)) + ' cm').padStart(20);
  
  console.log(`│ ${typName} │ ${cnt} │ ${len} │ ${avg1} │ ${avg2} │`);
});

console.log('└──────────────────────┴────────────┴──────────────┴─────────────────────┴──────────────────────┘');

// Resumo por direção
console.log('\n🔄 RESUMO POR DIREÇÃO\n');
const byDirection = {};
results.forEach(item => {
  if (!byDirection[item.direction]) {
    byDirection[item.direction] = {
      count: 0,
      totalLength: 0,
      totalWidth: 0,
      totalWidthKm: 0
    };
  }
  byDirection[item.direction].count += item.count;
  byDirection[item.direction].totalLength += parseFloat(item.totalLength);
  byDirection[item.direction].totalWidth += (parseFloat(item.avgWidthByStructure) * item.count);
  byDirection[item.direction].totalWidthKm += (parseFloat(item.avgWidthByKm) * parseFloat(item.totalLength));
});

console.log('┌──────────────────┬────────────┬──────────────┬─────────────────────┬──────────────────────┐');
console.log('│ Direção          │ Estruturas │ Extensão (m) │ Média por Estrutura │ Média Ponderada (km) │');
console.log('├──────────────────┼────────────┼──────────────┼─────────────────────┼──────────────────────┤');

Object.keys(byDirection).sort().forEach(dir => {
  const item = byDirection[dir];
  const dirName = dir.padEnd(16);
  const cnt = String(item.count).padStart(10);
  const len = String(item.totalLength.toFixed(2)).padStart(12);
  const avg1 = (String((item.totalWidth / item.count).toFixed(2)) + ' cm').padStart(19);
  const avg2 = (String((item.totalWidthKm / item.totalLength).toFixed(2)) + ' cm').padStart(20);
  
  console.log(`│ ${dirName} │ ${cnt} │ ${len} │ ${avg1} │ ${avg2} │`);
});

console.log('└──────────────────┴────────────┴──────────────┴─────────────────────┴──────────────────────┘');

console.log('\n✅ Arquivo widths-by-typology.json criado!\n');
