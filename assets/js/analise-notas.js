// Mapeamento completo entre itens de avaliação e parâmetros do formulário
const itemsMapping = {
    // 1.1. Proteção contra a invasão
    'project_conception': {
        name: '1.1.1. Concepção do projeto',
        params: ['flow_direction', 'traffic_flow', 'localization']
    },
    'project_risks': {
        name: '1.1.2. Situações de riscos da estrutura',
        params: ['car_risk_situations', 'bus_stops_along', 'structure_side_change_without_speed_reducers_or_lights', 
                 'structure_abrupt_end_in_counterflow', 'other_car_risk_situations']
    },
    'segregation_type_rate': {
        name: '1.1.3. Segregação - Tipo',
        params: ['segregator_type']
    },
    'buffer_size': {
        name: '1.1.3. Segregação - Área de amortecimento',
        params: ['buffer_width']
    },
    
    // 1.2. Sinalização vertical
    'start_signage': {
        name: '1.2.2. Sinalização de início',
        params: ['start_indication']
    },
    'end_signage': {
        name: '1.2.2. Sinalização de fim',
        params: ['end_indication']
    },
    'on_way_vertical_signs': {
        name: '1.2.1. Sinalização vertical regulamentadora - No percurso',
        params: ['on_way_vertical_signs_count']
    },
    'cross_vertical_signs': {
        name: '1.2.3. Sinalização vertical nas travessias',
        params: ['crosses_with_vertical_sign_count', 'crosses_without_vertical_sign_count']
    },
    'luminous_signage_vertical': {
        name: '1.2.4. Sinalização luminosa - Vertical',
        params: ['exclusive_traffic_lights', 'no_exclusive_traffic_lights']
    },
    
    // 1.3. Sinalização horizontal
    'pictograms': {
        name: '1.3.1. Pictogramas',
        params: ['good_conditions_picto_signs', 'bad_conditions_picto_signs']
    },
    'arrows': {
        name: '1.3.1. Setas',
        params: ['good_conditions_arrow_signs', 'bad_conditions_arrow_signs']
    },
    'horizontal_pattern': {
        name: '1.3.2. Padrão de pintura',
        params: ['horizontal_pattern_evaluation']
    },
    'cross_horizontal_signs': {
        name: '1.3.3. Sinalização horizontal nas travessias',
        params: ['good_conditions_crossing_signs', 'bad_conditions_crossing_signs', 'no_visible_crossing_signs']
    },
    
    // 1.4. Conforto
    'structure_access': {
        name: '1.4.1. Acesso à estrutura',
        params: ['access_evaluation']
    },
    'level_differences': {
        name: '1.4.2. Desníveis',
        params: ['pavement_type']
    },
    'bidirectionality': {
        name: '1.4.3. Bidirecionalidade',
        params: ['flow_direction']
    },
    'pavement': {
        name: '1.4.4. Pavimento - Tipo',
        params: ['pavement_type']
    },
    'sinuosity': {
        name: '1.4.5. Sinuosidade',
        params: ['sinuosity_evaluation']
    },
    'width_evaluation': {
        name: '1.4.4. Largura transitável',
        params: ['ridable_width']
    },
    
    // 1.5. Segurança
    'along_risks': {
        name: '1.5.1. Riscos ao longo do percurso',
        params: ['car_risk_situations', 'all_risks_situations_count']
    },
    'luminous_signage_along': {
        name: '1.5.2. Sinalização luminosa ao longo',
        params: ['exclusive_traffic_lights', 'motorized_traffic_lights', 'pedestrian_traffic_lights']
    },
    
    // 1.6. Conflitos ao longo do percurso
    'block_size_control': {
        name: '1.6.1. Controle de velocidade - Tamanho de quadra',
        params: ['seg_length']
    },
    'lane_width_control': {
        name: '1.6.1. Controle de velocidade - Largura da faixa',
        params: ['road_width', 'contiguos_lanes']
    },
    'other_speed_controls': {
        name: '1.6.1. Controle de velocidade - Outros elementos',
        params: ['pedestrian_crossings_count', 'speed_bumps_count', 'differentiated_floor', 'other_control_elements_count']
    },
    'electronic_control': {
        name: '1.6.1. Controle de velocidade - Eletrônico',
        params: ['electronic_speed_control_count']
    },
    'unlevel_control': {
        name: '1.6.1. Controle de velocidade - Desnível',
        params: ['pedestrian_crossings_count']
    },
    
    // 1.7. Conflitos nas travessias
    'cross_risks': {
        name: '1.7.1. Riscos nas travessias',
        params: ['crosses', 'crosses_with_vertical_sign_count']
    },
    
    // 1.8. Manutenção
    'pavement_condition': {
        name: '1.8.1. Condição do pavimento',
        params: ['pavement_condition_evaluation']
    },
    'pictograms_condition': {
        name: '1.8.2. Condição dos pictogramas',
        params: ['good_conditions_picto_signs', 'bad_conditions_picto_signs']
    },
    'arrows_condition': {
        name: '1.8.2. Condição das setas',
        params: ['good_conditions_arrow_signs', 'bad_conditions_arrow_signs']
    },
    'painting_condition': {
        name: '1.8.3. Condição da pintura',
        params: ['painting_condition_evaluation']
    },
    'horizontal_cross_conditions': {
        name: '1.8.4. Condição da sinalização horizontal nas travessias',
        params: ['good_conditions_crossing_signs', 'bad_conditions_crossing_signs']
    },
    'protection_conditions': {
        name: '1.8.5. Condição da proteção',
        params: ['protection_conditions_evaluation']
    },
    
    // 1.9. Urbanidade
    'lighting': {
        name: '1.9.1. Iluminação',
        params: ['dedicated_ligthing', 'same_side_ligthing', 'both_side_ligthing', 'other_side_ligthing']
    },
    'structure_access_urbanity': {
        name: '1.9.2. Acesso à estrutura (urbanidade)',
        params: ['access_evaluation']
    },
    'obstacles': {
        name: '1.9.3. Obstáculos',
        params: ['manhole_covers', 'roots', 'potholes', 'deep_gutters_along_structure', 
                 'unevenness_obstacles', 'other_obstacles', 'all_obstacles_count']
    },
    'shading': {
        name: '1.9.4. Sombreamento',
        params: ['shading_evaluation']
    }
};

let allData = [];
let filteredData = [];
let currentSort = { column: 'score', ascending: false };

// Carregar dados
async function loadData() {
    try {
        const response = await fetch('assets/data/rated-data.json');
        allData = await response.json();
        populateItemSelect();
        populateTypologyFilter();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        document.getElementById('resultsBody').innerHTML = 
            '<tr><td colspan="5" class="no-results">Erro ao carregar dados</td></tr>';
    }
}

// Preencher select de itens
function populateItemSelect() {
    const select = document.getElementById('itemSelect');
    select.innerHTML = '<option value="">Selecione um item...</option>';
    
    // Agrupar por categoria
    const categories = {
        'Proteção': ['project_conception', 'project_risks', 'segregation_type_rate', 'buffer_size'],
        'Sinalização Vertical': ['start_signage', 'end_signage', 'on_way_vertical_signs', 'cross_vertical_signs', 'luminous_signage_vertical'],
        'Sinalização Horizontal': ['pictograms', 'arrows', 'horizontal_pattern', 'cross_horizontal_signs'],
        'Conforto': ['structure_access', 'level_differences', 'bidirectionality', 'pavement', 'sinuosity', 'width_evaluation'],
        'Segurança': ['along_risks', 'luminous_signage_along'],
        'Conflitos ao longo': ['block_size_control', 'lane_width_control', 'other_speed_controls', 'electronic_control', 'unlevel_control'],
        'Conflitos nas travessias': ['cross_risks'],
        'Manutenção': ['pavement_condition', 'pictograms_condition', 'arrows_condition', 'painting_condition', 'horizontal_cross_conditions', 'protection_conditions'],
        'Urbanidade': ['lighting', 'structure_access_urbanity', 'obstacles', 'shading']
    };
    
    Object.entries(categories).forEach(([category, items]) => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category;
        items.forEach(key => {
            if (itemsMapping[key]) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = itemsMapping[key].name;
                optgroup.appendChild(option);
            }
        });
        select.appendChild(optgroup);
    });
}

// Preencher filtro de tipologia
function populateTypologyFilter() {
    const typologies = new Set();
    allData.forEach(item => {
        const typology = getTypology(item);
        if (typology) typologies.add(typology);
    });
    
    const select = document.getElementById('typologyFilter');
    select.innerHTML = '<option value="">Todas</option>';
    Array.from(typologies).sort().forEach(typ => {
        const option = document.createElement('option');
        option.value = typ;
        option.textContent = typ;
        select.appendChild(option);
    });
}

// Obter tipologia
function getTypology(item) {
    if (item.tipo_da_via) {
        for (const [key, value] of Object.entries(item.tipo_da_via)) {
            if (value === 1) return key;
        }
    }
    return 'Não especificada';
}

// Obter valor do parâmetro
function getParamValue(item, paramKey) {
    // Procurar em result
    if (item.result && item.result[paramKey] !== undefined) {
        return item.result[paramKey];
    }
    // Procurar em outros objetos
    const searchObjects = [item.metadata, item.tipo_da_via, item.localizacao_via, 
                          item['fluxo-via'], item['fluxo-ciclo'], item.segregadores,
                          item.pavimento, item.sinuosidade, item.sombreamento,
                          item.protecao, item.segregadores_avaliacao, item.pavimento_avaliacao,
                          item.larguras_estrutura_qte, item.obstaculos_qte, item.riscos,
                          item.iluminacao_estrutura_qte, item.sinalizacao_horizontal_qte];
    
    for (const obj of searchObjects) {
        if (obj && obj[paramKey] !== undefined) {
            return obj[paramKey];
        }
    }
    return null;
}

// Formatar valor do parâmetro
function formatParamValue(value) {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    if (typeof value === 'number') return value.toLocaleString('pt-BR');
    if (typeof value === 'string' && value.length > 50) return value.substring(0, 50) + '...';
    return value;
}

// Renderizar tabela
function renderTable() {
    const tbody = document.getElementById('resultsBody');
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-results">Nenhum resultado encontrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredData.map(item => {
        const scoreClass = item.score === null ? 'score-null' : 
                          item.score >= 7 ? 'score-high' : 
                          item.score >= 4 ? 'score-medium' : 'score-low';
        
        const paramsHtml = item.params.map(p => 
            `<div class="param-item"><strong>${p.key}:</strong> ${p.value}</div>`
        ).join('');
        
        return `
            <tr>
                <td>${item.structure}</td>
                <td>${item.city}</td>
                <td>${item.typology}</td>
                <td><span class="score-badge ${scoreClass}">${item.score !== null ? item.score.toFixed(2) : 'N/A'}</span></td>
                <td><div class="params-list">${paramsHtml || 'Nenhum parâmetro disponível'}</div></td>
            </tr>
        `;
    }).join('');
}

// Filtrar e processar dados
function filterAndProcess() {
    const selectedItem = document.getElementById('itemSelect').value;
    const cityFilter = document.getElementById('cityFilter').value;
    const typologyFilter = document.getElementById('typologyFilter').value;
    
    if (!selectedItem) {
        document.getElementById('resultsBody').innerHTML = 
            '<tr><td colspan="5" class="no-results">Selecione um item de avaliação</td></tr>';
        return;
    }
    
    const mapping = itemsMapping[selectedItem];
    
    filteredData = allData
        .filter(item => {
            if (cityFilter && item.result.city !== cityFilter) return false;
            if (typologyFilter && getTypology(item) !== typologyFilter) return false;
            return true;
        })
        .map(item => {
            const score = item.rates && item.rates[selectedItem] !== undefined ? item.rates[selectedItem] : null;
            const params = mapping.params.map(paramKey => ({
                key: paramKey,
                value: formatParamValue(getParamValue(item, paramKey))
            }));
            
            return {
                structure: item.result.structure_name || 'Sem nome',
                city: item.result.city || 'N/A',
                typology: getTypology(item),
                score: score,
                params: params
            };
        });
    
    sortData();
    renderTable();
}

// Ordenar dados
function sortData() {
    filteredData.sort((a, b) => {
        let aVal = a[currentSort.column];
        let bVal = b[currentSort.column];
        
        if (aVal === null) return 1;
        if (bVal === null) return -1;
        
        if (typeof aVal === 'string') {
            return currentSort.ascending ? 
                aVal.localeCompare(bVal) : 
                bVal.localeCompare(aVal);
        }
        
        return currentSort.ascending ? aVal - bVal : bVal - aVal;
    });
}

// Event listeners
document.getElementById('itemSelect').addEventListener('change', filterAndProcess);
document.getElementById('cityFilter').addEventListener('change', filterAndProcess);
document.getElementById('typologyFilter').addEventListener('change', filterAndProcess);

document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
        const column = th.dataset.sort;
        if (currentSort.column === column) {
            currentSort.ascending = !currentSort.ascending;
        } else {
            currentSort.column = column;
            currentSort.ascending = false;
        }
        
        document.querySelectorAll('th .sort-icon').forEach(icon => icon.textContent = '↕');
        th.querySelector('.sort-icon').textContent = currentSort.ascending ? '↑' : '↓';
        
        sortData();
        renderTable();
    });
});

// Inicializar
loadData();
