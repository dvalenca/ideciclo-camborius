function readJSON(filePath) {
    return fetch(filePath).then(response => response.json());
}

function getHighwayClassification(feature, cyclewayClassification, cityName) {
    if (feature.properties.highway === 'cycleway') {
        const wayId = feature.properties.id?.replace('way/', '') || '';
        const cityData = cyclewayClassification[cityName] || [];
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

function getCalculatedScore(gpxName, ratedData) {
    const ratedItem = ratedData.find(item => item.metadata.gpx_name === gpxName);
    return ratedItem?.rates?.average || 0;
}

function isValidStructureForViaType(structureType, viaType) {
    const validStructures = {
        'arterial': ['Ciclovia', 'Compart.'],
        'coletora': ['Ciclovia', 'Compart.', 'Ciclofaixa'],
        'local': ['Ciclovia', 'Compart.', 'Ciclofaixa', 'Baixa velocidade']
    };
    
    return validStructures[viaType]?.includes(structureType) || false;
}

async function calculateIDECICLO(cityName) {
    const waysData = await readJSON(`./assets/data/${cityName}Ways.json`);
    const geoData = await readJSON(`./assets/data/${cityName}-OSM-enriched-fixed.geojson`);
    const cyclewayClassification = await readJSON('./assets/data/cycleway-classification.json');
    const ratedData = await readJSON('../src/result/rated-data.json');
    
    const totalExtensions = {
        arterial: 0,
        coletora: 0,
        local: 0
    };
    
    waysData.forEach(way => {
        totalExtensions[way.type] += parseFloat(way.length);
    });
    
    // Agrupar por src
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
    
    // Identificar duplicatas
    const duplicateGroups = {};
    Object.entries(srcGroups).forEach(([src, features]) => {
        const signature = features
            .map(f => Math.round(parseFloat(f.properties.length || 0)))
            .sort()
            .join('|');
        
        if (!duplicateGroups[signature]) {
            duplicateGroups[signature] = [];
        }
        duplicateGroups[signature].push(src);
    });
    
    const structuresByViaType = {
        arterial: [],
        coletora: [],
        local: []
    };
    
    const processedSrcs = new Set();
    
    Object.entries(duplicateGroups).forEach(([signature, srcs]) => {
        if (srcs.length > 1) {
            // Duplicatas - usar média das notas
            const scores = srcs.map(src => getCalculatedScore(src, ratedData)).filter(s => s > 0);
            const avgScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;
            
            const representativeSrc = srcs[0];
            const features = srcGroups[representativeSrc];
            
            features.forEach(feature => {
                const highway = getHighwayClassification(feature, cyclewayClassification, cityName);
                const viaType = mapHighwayToViaType(highway);
                const structureType = feature.properties.tipo || feature.properties.type;
                const length = feature.properties.comp_proportional || 0;
                const isValid = isValidStructureForViaType(structureType, viaType);
                
                if (isValid && avgScore > 0) {
                    structuresByViaType[viaType].push({
                        name: feature.properties.name_2 || feature.properties.name || 'Sem nome',
                        structureType,
                        highway,
                        length: parseFloat(length),
                        score: avgScore,
                        product: parseFloat(length) * avgScore * 0.1,
                        duplicateInfo: `Média de ${scores.length} GPX`
                    });
                }
            });
            
            srcs.forEach(src => processedSrcs.add(src));
        } else {
            // Estrutura única
            const src = srcs[0];
            const features = srcGroups[src];
            const calculatedScore = getCalculatedScore(src, ratedData);
            
            features.forEach(feature => {
                const highway = getHighwayClassification(feature, cyclewayClassification, cityName);
                const viaType = mapHighwayToViaType(highway);
                const structureType = feature.properties.tipo || feature.properties.type;
                const length = feature.properties.comp_proportional || 0;
                const isValid = isValidStructureForViaType(structureType, viaType);
                
                if (isValid && calculatedScore > 0) {
                    structuresByViaType[viaType].push({
                        name: feature.properties.name_2 || feature.properties.name || 'Sem nome',
                        structureType,
                        highway,
                        length: parseFloat(length),
                        score: calculatedScore,
                        product: parseFloat(length) * calculatedScore * 0.1
                    });
                }
            });
            
            processedSrcs.add(src);
        }
    });
    
    const results = {};
    
    ['arterial', 'coletora', 'local'].forEach(viaType => {
        const structures = structuresByViaType[viaType];
        const totalProduct = structures.reduce((sum, s) => sum + s.product, 0);
        const totalExtension = totalExtensions[viaType];
        const result = totalExtension > 0 ? totalProduct / totalExtension : 0;
        
        results[viaType] = {
            structures,
            totalProduct,
            totalExtension,
            result
        };
    });
    
    const ideciclo = (0.60 * results.arterial.result) + 
                    (0.25 * results.coletora.result) + 
                    (0.15 * results.local.result);
    
    return {
        city: cityName,
        totalExtensions,
        results,
        ideciclo
    };
}

async function main() {
    const cities = ['Balneario', 'Camboriu'];
    const allResults = {};
    
    for (const city of cities) {
        try {
            allResults[city] = await calculateIDECICLO(city);
            console.log(`${city}: IDECICLO = ${allResults[city].ideciclo.toFixed(4)}`);
        } catch (error) {
            console.error(`Erro ao calcular IDECICLO para ${city}:`, error.message);
        }
    }
}

main();