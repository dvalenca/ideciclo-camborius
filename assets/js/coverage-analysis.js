import fs from 'fs';

function readJSON(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}

function readGeoJSON(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}

function getHighwayClassification(feature, cyclewayClassification, cityName) {
    if (feature.properties.highway === 'cycleway') {
        const wayId = feature.properties.id?.replace('way/', '') || '';
        // Mapear nomes das cidades para corresponder ao arquivo de classificação
        const cityMapping = {
            'Balneario': 'Balneário',
            'Camboriu': 'Camboriú'
        };
        const mappedCityName = cityMapping[cityName] || cityName;
        const cityData = cyclewayClassification[mappedCityName] || [];
        const classification = cityData.find(item => item.wayId === wayId);
        
        if (classification) {
            return classification.closestHighway;
        }
        return 'cycleway';
    }
    return feature.properties.highway;
}

function mapHighwayToViaType(highway) {
    const mapping = {
        'motorway': 'arterial',
        'motorway_link': 'arterial',
        'primary': 'arterial',
        'primary_link': 'arterial',
        'secondary': 'coletora',
        'secondary_link': 'coletora',
        'tertiary': 'coletora',
        'tertiary_link': 'coletora',
        'residential': 'local',
        'unclassified': 'local'
    };
    return mapping[highway] || 'local';
}

function analyzeCoverage(cityName) {
    console.log(`\n=== ANÁLISE DE COBERTURA - ${cityName.toUpperCase()} ===\n`);
    
    const waysData = readJSON(`../data/${cityName}Ways.json`);
    const geoData = readGeoJSON(`../data/${cityName}-OSM-enriched-fixed.geojson`);
    const cyclewayClassification = readJSON('../data/cycleway-classification.json');
    
    // Extensões totais por tipo de via
    const totalExtensions = {
        arterial: 0,
        coletora: 0,
        local: 0
    };
    
    waysData.forEach(way => {
        totalExtensions[way.type] += parseFloat(way.length);
    });
    
    // Cobertura por tipo de estrutura e tipo de via
    const coverage = {
        arterial: { ciclovia: 0, ciclofaixa: 0, compartilhada: 0, baixa_velocidade: 0 },
        coletora: { ciclovia: 0, ciclofaixa: 0, compartilhada: 0, baixa_velocidade: 0 },
        local: { ciclovia: 0, ciclofaixa: 0, compartilhada: 0, baixa_velocidade: 0 }
    };
    
    // Agrupar por src para evitar duplicatas
    const srcGroups = {};
    geoData.features.forEach(feature => {
        const src = feature.properties.src;
        if (src) {
            if (!srcGroups[src]) {
                srcGroups[src] = [];
            }
            srcGroups[src].push(feature);
        }
    });
    
    // Identificar duplicatas usando uma assinatura mais robusta
    const duplicateGroups = {};
    Object.entries(srcGroups).forEach(([src, features]) => {
        // Usar múltiplos campos para criar uma assinatura mais única
        const signature = features
            .map(f => {
                const length = Math.round(parseFloat(f.properties.length || f.properties.osm_length || 0));
                const type = f.properties.tipo || f.properties.type || 'unknown';
                const highway = f.properties.highway || 'unknown';
                return `${length}-${type}-${highway}`;
            })
            .sort()
            .join('|');
        
        if (!duplicateGroups[signature]) {
            duplicateGroups[signature] = [];
        }
        duplicateGroups[signature].push(src);
    });
    
    const processedSrcs = new Set();
    
    Object.entries(duplicateGroups).forEach(([signature, srcs]) => {
        const representativeSrc = srcs[0]; // Usar apenas o primeiro para evitar duplicatas
        const features = srcGroups[representativeSrc];
        
        features.forEach(feature => {
            const highway = getHighwayClassification(feature, cyclewayClassification, cityName);
            const viaType = mapHighwayToViaType(highway);
            const structureType = feature.properties.tipo || feature.properties.type;
            
            // Usar múltiplas fontes para o comprimento, priorizando comp_proportional
            let length = parseFloat(feature.properties.comp_proportional || 
                                  feature.properties.comp_new || 
                                  feature.properties.length_new || 
                                  feature.properties.length || 
                                  feature.properties.osm_length || 0);
            
            if (length > 0 && viaType && structureType) {
                // Normalizar tipos de estrutura
                const normalizedType = structureType.toLowerCase().trim();
                
                if (normalizedType.includes('ciclovia')) {
                    coverage[viaType].ciclovia += length;
                } else if (normalizedType.includes('ciclofaixa')) {
                    coverage[viaType].ciclofaixa += length;
                } else if (normalizedType.includes('compart')) {
                    coverage[viaType].compartilhada += length;
                } else if (normalizedType.includes('baixa velocidade')) {
                    coverage[viaType].baixa_velocidade += length;
                } else {
                    console.warn(`Tipo de estrutura não reconhecido: ${structureType}`);
                }
            }
        });
        
        srcs.forEach(src => processedSrcs.add(src));
    });
    
    // Gerar tabela
    console.log('TABELA DE COBERTURA (em metros):');
    console.log('Via Type'.padEnd(12) + '| Ciclovia'.padEnd(12) + '| Ciclofaixa'.padEnd(12) + '| Compartilh.'.padEnd(12) + '| Baixa Vel.'.padEnd(12) + '| Total Cob.'.padEnd(12) + '| Total Malha'.padEnd(12) + '| % Cobertura');
    console.log('-'.repeat(120));
    
    ['arterial', 'coletora', 'local'].forEach(viaType => {
        const c = coverage[viaType];
        const totalCoverage = c.ciclovia + c.ciclofaixa + c.compartilhada + c.baixa_velocidade;
        const totalMalha = totalExtensions[viaType];
        const percentage = totalMalha > 0 ? (totalCoverage / totalMalha * 100) : 0;
        
        console.log(
            viaType.padEnd(12) + '| ' +
            c.ciclovia.toFixed(0).padStart(10) + '| ' +
            c.ciclofaixa.toFixed(0).padStart(10) + '| ' +
            c.compartilhada.toFixed(0).padStart(10) + '| ' +
            c.baixa_velocidade.toFixed(0).padStart(10) + '| ' +
            totalCoverage.toFixed(0).padStart(10) + '| ' +
            totalMalha.toFixed(0).padStart(11) + '| ' +
            percentage.toFixed(2).padStart(9) + '%'
        );
    });
    
    console.log();
    
    // Percentuais por tipo de estrutura
    console.log('PERCENTUAIS DE COBERTURA POR TIPO DE ESTRUTURA:');
    ['arterial', 'coletora', 'local'].forEach(viaType => {
        const c = coverage[viaType];
        const totalMalha = totalExtensions[viaType];
        
        console.log(`\n${viaType.toUpperCase()}:`);
        console.log(`  Ciclovia: ${(c.ciclovia / totalMalha * 100).toFixed(2)}%`);
        console.log(`  Ciclofaixa: ${(c.ciclofaixa / totalMalha * 100).toFixed(2)}%`);
        console.log(`  Compartilhada: ${(c.compartilhada / totalMalha * 100).toFixed(2)}%`);
        console.log(`  Baixa velocidade: ${(c.baixa_velocidade / totalMalha * 100).toFixed(2)}%`);
    });
    
    return {
        city: cityName,
        coverage,
        totalExtensions
    };
}

function main() {
    console.log('ANÁLISE DE COBERTURA DAS MALHAS VIÁRIAS');
    console.log('=======================================');
    
    const cities = ['Balneario', 'Camboriu'];
    const allResults = {};
    
    cities.forEach(city => {
        try {
            console.log(`Iniciando análise de cobertura para ${city}...`);
            allResults[city] = analyzeCoverage(city);
            
            // Log dos resultados para debug
            const result = allResults[city];
            console.log(`Análise de cobertura para ${city} concluída:`);
            console.log(`- Total arterial: ${(result.totalExtensions.arterial / 1000).toFixed(2)}km`);
            console.log(`- Total coletora: ${(result.totalExtensions.coletora / 1000).toFixed(2)}km`);
            console.log(`- Total local: ${(result.totalExtensions.local / 1000).toFixed(2)}km`);
            
            Object.entries(result.coverage).forEach(([viaType, structures]) => {
                const total = Object.values(structures).reduce((sum, val) => sum + val, 0);
                console.log(`- Cobertura ${viaType}: ${(total / 1000).toFixed(2)}km`);
            });
            
        } catch (error) {
            console.error(`Erro ao analisar ${city}:`, error);
        }
    });
    
    fs.writeFileSync('../data/coverage-analysis.json', JSON.stringify(allResults, null, 2));
    console.log('\n✅ Resultados salvos em: ../data/coverage-analysis.json');
}

main();