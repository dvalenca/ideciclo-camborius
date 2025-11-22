// Sistema de exportação em Markdown
class MarkdownExporter {
    constructor() {
        this.template = '';
    }

    // Exportar via para Markdown
    async exportVia(viaData) {
        try {
            const markdown = this.generateMarkdown(viaData);
            this.downloadMarkdown(markdown, viaData.structure_name);
        } catch (error) {
            console.error('Erro ao gerar Markdown:', error);
            alert('Erro ao gerar relatório. Tente novamente.');
        }
    }

    // Gerar conteúdo Markdown
    generateMarkdown(viaData) {
        const data = viaData.full_data;
        const rates = viaData.full_rates || {};
        
        return `# ${viaData.structure_name}

## 📍 Informações Básicas

| Campo | Valor |
|-------|-------|
| **Cidade** | ${viaData.city} |
| **Tipologia** | ${viaData.typology} |
| **Extensão** | ${(viaData.length / 1000).toFixed(1)} km |
| **Nota Geral** | ${rates.average ? rates.average.toFixed(1) : 'N/A'} |

## 🏆 Notas de Avaliação

### Notas Principais
| Categoria | Nota | Classificação |
|-----------|------|---------------|
| **Projeto** | ${this.formatScore(rates.project)} | ${this.getClassification(rates.project)} |
| **Proteção** | ${this.formatScore(rates.protection)} | ${this.getClassification(rates.protection)} |
| **Conforto** | ${this.formatScore(rates.comfort)} | ${this.getClassification(rates.comfort)} |
| **Segurança** | ${this.formatScore(rates.safety)} | ${this.getClassification(rates.safety)} |

### Notas Detalhadas
${this.generateDetailedScores(rates)}

## 🛣️ Características Físicas

| Campo | Valor |
|-------|-------|
| **Tipo de Pavimento** | ${data.pavement_type || 'N/A'} |
| **Condição do Pavimento** | ${data.pavement_condition_evaluation || 'N/A'} |
| **Largura Transitável** | ${data.ridable_width ? `${data.ridable_width} cm` : 'N/A'} |
| **Largura do Buffer** | ${data.buffer_width ? `${data.buffer_width} cm` : 'N/A'} |
| **Largura da Via** | ${data.road_width ? `${data.road_width} cm` : 'N/A'} |
| **Tipo de Segregador** | ${data.segregator_type || 'N/A'} |
| **Direção do Fluxo** | ${data.flow_direction || 'N/A'} |
| **Fluxo do Tráfego** | ${data.traffic_flow || 'N/A'} |
| **Localização** | ${data.localization || 'N/A'} |
| **Limite de Velocidade** | ${data.speed_limit || 'N/A'} |
| **Faixas Contíguas** | ${data.contiguos_lanes || 'N/A'} |
| **Estacionamento** | ${data.parking || 'N/A'} |

## 🛡️ Avaliações de Segurança

| Campo | Valor |
|-------|-------|
| **Condições de Proteção** | ${data.protection_conditions_evaluation || 'N/A'} |
| **Avaliação de Acesso** | ${data.access_evaluation || 'N/A'} |
| **Arborização** | ${data.shading_evaluation || 'N/A'} |
| **Sinuosidade** | ${data.sinuosity_evaluation || 'N/A'} |
| **Situações de Risco** | ${data.car_risk_situations || 'Nenhuma'} |
| **Total de Riscos** | ${data.all_risks_situations_count || 0} |
| **Cruzamentos** | ${data.crosses || 0} |

## 🚦 Sinalização

| Campo | Valor |
|-------|-------|
| **Padrão Horizontal** | ${data.horizontal_pattern_evaluation || 'N/A'} |
| **Condição da Pintura** | ${data.painting_condition_evaluation || 'N/A'} |
| **Placas Verticais na Via** | ${data.on_way_vertical_signs_count || 0} |
| **Cruzamentos com Placa** | ${data.crosses_with_vertical_sign_count || 0} |
| **Cruzamentos sem Placa** | ${data.crosses_without_vertical_sign_count || 0} |
| **Semáforos Exclusivos** | ${data.exclusive_traffic_lights || 0} |
| **Semáforos Motorizados** | ${data.motorized_traffic_lights || 0} |
| **Semáforos Pedestres** | ${data.pedestrian_traffic_lights || 0} |
| **Pictogramas (Bom Estado)** | ${data.good_conditions_picto_signs || 0} |
| **Pictogramas (Má Estado)** | ${data.bad_conditions_picto_signs || 0} |
| **Sinais Cruzamento (Bom)** | ${data.good_conditions_crossing_signs || 0} |
| **Sinais Cruzamento (Ruim)** | ${data.bad_conditions_crossing_signs || 0} |

## ⚠️ Obstáculos

| Tipo | Quantidade |
|------|------------|
| **Total de Obstáculos** | ${data.all_obstacles_count || 0} |
| **Bueiros** | ${data.manhole_covers || 0} |
| **Buracos** | ${data.potholes || 0} |
| **Raízes** | ${data.roots || 0} |
| **Desníveis** | ${data.unevenness_obstacles || 0} |
| **Outros Obstáculos** | ${data.other_obstacles || 0} |
| **Pontos de Ônibus** | ${data.bus_stops_along || 0} |

## 💡 Infraestrutura

| Campo | Valor |
|-------|-------|
| **Iluminação Dedicada** | ${data.dedicated_ligthing || 0} |
| **Iluminação Mesmo Lado** | ${data.same_side_ligthing || 0} |
| **Iluminação Outro Lado** | ${data.other_side_ligthing || 0} |
| **Iluminação Ambos Lados** | ${data.both_side_ligthing || 0} |
| **Travessias de Pedestres** | ${data.pedestrian_crossings_count || 0} |
| **Lombadas** | ${data.speed_bumps_count || 0} |
| **Controle Eletrônico** | ${data.electronic_speed_control_count || 0} |
| **Piso Diferenciado** | ${data.differentiated_floor || 0} |

${this.generateComments(data.comments)}

---

*Relatório gerado automaticamente pelo sistema IDECICLO em ${new Date().toLocaleDateString('pt-BR')}*
`;
    }

    // Gerar notas detalhadas
    generateDetailedScores(rates) {
        const excludeKeys = ['average', 'project', 'protection', 'comfort', 'safety'];
        const detailedScores = [];
        
        Object.keys(rates).forEach(key => {
            if (!excludeKeys.includes(key) && rates[key] !== null && rates[key] !== undefined) {
                const label = this.formatScoreLabel(key);
                detailedScores.push([label, rates[key]]);
            }
        });
        
        if (detailedScores.length === 0) {
            return '*Nenhuma nota detalhada disponível*';
        }
        
        let table = '| Categoria | Nota | Classificação |\n|-----------|------|---------------|\n';
        detailedScores.forEach(([label, score]) => {
            table += `| **${label}** | ${this.formatScore(score)} | ${this.getClassification(score)} |\n`;
        });
        
        return table;
    }

    // Gerar comentários
    generateComments(comments) {
        if (!comments || comments.length === 0) {
            return '';
        }
        
        let section = '## 💬 Observações de Campo\n\n';
        comments.forEach((comment, index) => {
            section += `${index + 1}. ${comment}\n`;
        });
        
        return section;
    }

    // Formatar nota
    formatScore(score) {
        return score ? score.toFixed(1) : 'N/A';
    }

    // Obter classificação
    getClassification(score) {
        if (!score) return 'N/A';
        if (score >= 8) return '🟢 Excelente';
        if (score >= 6) return '🟡 Bom';
        if (score >= 4) return '🟠 Regular';
        if (score >= 2) return '🔴 Ruim';
        return '⚫ Inadequado';
    }

    // Formatar label da nota
    formatScoreLabel(key) {
        const labels = {
            'segregation': 'Segregação',
            'vertical_signs': 'Sinais Verticais',
            'horizontal_signs': 'Sinais Horizontais',
            'speed_control': 'Controle Velocidade',
            'cross_conflicts': 'Conflitos Cruzamento',
            'maintenance_and_urbanity': 'Manutenção/Urbanidade',
            'obstacles': 'Obstáculos',
            'width_evaluation': 'Largura',
            'pavement': 'Pavimento',
            'buffer_size': 'Tamanho Buffer',
            'cross_risks': 'Riscos Cruzamento',
            'project_risks': 'Riscos Projeto',
            'electronic_control': 'Controle Eletrônico',
            'unlevel_control': 'Controle Desnível',
            'maintenance': 'Manutenção',
            'horizontal_sign_conditions': 'Condição Sinais Horiz.',
            'urbanity': 'Urbanidade',
            'horizontal_cross_conditions': 'Condição Cruzamentos'
        };
        
        return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Download do arquivo Markdown
    downloadMarkdown(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
}

// Exportar para uso global
window.MarkdownExporter = MarkdownExporter;