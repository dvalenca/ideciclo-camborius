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
    
    const waysData = readJSON(`./assets/data/${cityName}Ways.json`);
    const processedData = readJSON('./data/processed-data.json');
    const geoData = readGeoJSON(`./assets/data/${cityName}-OSM-enriched-fixed.geojson`);
    const cyclewayClassification = readJSON('./assets/data/cycleway-classification.json');
    
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
    
    // Mapear nomes das cidades
    const cityMapping = {
        'Balneario': 'Balneário Camboriú',
        'Camboriu': 'Camboriú'
    };
    const mappedCityName = cityMapping[cityName] || cityName;
    
    // Filtrar estruturas da cidade usando processed-data.json
    const cityStructures = processedData.filter(item => item.city === mappedCityName);
    
    // Para cada estrutura, encontrar sua classificação de via no GeoJSON
    cityStructures.forEach(structure => {
        // Encontrar feature correspondente no GeoJSON
        const geoFeature = geoData.features.find(f => 
            f.properties.src === structure.gpx_name
        );
        
        if (geoFeature) {
            const highway = getHighwayClassification(geoFeature, cyclewayClassification, cityName);
            const viaType = mapHighwayToViaType(highway);
            const length = structure.length; // Usar comprimento do processed-data.json
            
            if (length > 0 && viaType) {
                if (structure.typology === 'Ciclovia') {
                    coverage[viaType].ciclovia += length;
                } else if (structure.typology === 'Ciclofaixa') {
                    coverage[viaType].ciclofaixa += length;
                } else if (structure.typology === 'Calçada compartilhada') {
                    coverage[viaType].compartilhada += length;
                }
            }
        } else {
            // Fallback: assumir via local se não encontrar no GeoJSON
            const length = structure.length;
            if (length > 0) {
                if (structure.typology === 'Ciclovia') {
                    coverage.local.ciclovia += length;
                } else if (structure.typology === 'Ciclofaixa') {
                    coverage.local.ciclofaixa += length;
                } else if (structure.typology === 'Calçada compartilhada') {
                    coverage.local.compartilhada += length;
                }
            }
        }
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
    
    fs.writeFileSync('./assets/data/coverage-analysis.json', JSON.stringify(allResults, null, 2));
    console.log('\n✅ Resultados salvos em: assets/data/coverage-analysis.json');
}

main();