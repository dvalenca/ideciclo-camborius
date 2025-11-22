// Gerador de Relatórios Consolidados
class ReportGenerator {
    constructor() {
        this.markdownExporter = new MarkdownExporter();
    }

    // Gerar relatório consolidado por cidade
    async generateCityReport(city) {
        try {
            const response = await fetch('data/processed-data.json');
            const allVias = await response.json();
            
            const cityVias = allVias.filter(via => via.city === city);
            const markdown = this.generateCityMarkdown(city, cityVias);
            
            this.downloadMarkdown(markdown, `Relatorio_${city.replace(/\s+/g, '_')}`);
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            alert('Erro ao gerar relatório consolidado.');
        }
    }

    // Gerar relatório consolidado completo
    async generateFullReport() {
        try {
            const response = await fetch('data/processed-data.json');
            const allVias = await response.json();
            
            const markdown = this.generateFullMarkdown(allVias);
            this.downloadMarkdown(markdown, 'Relatorio_Completo_IDECICLO');
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            alert('Erro ao gerar relatório completo.');
        }
    }

    // Gerar Markdown para cidade
    generateCityMarkdown(city, vias) {
        const stats = this.calculateStats(vias);
        
        return `# Relatório IDECICLO - ${city}

## 📊 Resumo Executivo

| Indicador | Valor |
|-----------|-------|
| **Total de Estruturas** | ${vias.length} |
| **Extensão Total** | ${(stats.totalLength / 1000).toFixed(1)} km |
| **Nota Média Geral** | ${stats.averageScore.toFixed(1)} |
| **Melhor Estrutura** | ${stats.bestStructure?.structure_name || 'N/A'} (${stats.bestScore?.toFixed(1) || 'N/A'}) |
| **Estrutura com Menor Nota** | ${stats.worstStructure?.structure_name || 'N/A'} (${stats.worstScore?.toFixed(1) || 'N/A'}) |

## 🏗️ Distribuição por Tipologia

${this.generateTypologyTable(stats.byTypology)}

## 📈 Ranking das Estruturas

| Posição | Estrutura | Tipologia | Extensão | Nota |
|---------|-----------|-----------|----------|------|
${vias
    .sort((a, b) => (b.average_score || 0) - (a.average_score || 0))
    .map((via, index) => 
        `| ${index + 1}º | ${via.structure_name} | ${via.typology} | ${(via.length / 1000).toFixed(1)} km | ${via.average_score?.toFixed(1) || 'N/A'} |`
    ).join('\n')}

## 🎯 Análise por Categoria

### Projeto
${this.generateCategoryAnalysis(vias, 'project_score')}

### Proteção
${this.generateCategoryAnalysis(vias, 'protection_score')}

### Conforto
${this.generateCategoryAnalysis(vias, 'comfort_score')}

### Segurança
${this.generateCategoryAnalysis(vias, 'safety_score')}

## 📋 Detalhamento das Estruturas

${vias.map(via => this.generateViaSection(via)).join('\n\n---\n\n')}

---

*Relatório gerado automaticamente pelo sistema IDECICLO em ${new Date().toLocaleDateString('pt-BR')}*
`;
    }

    // Gerar Markdown completo
    generateFullMarkdown(allVias) {
        const stats = this.calculateStats(allVias);
        const cities = [...new Set(allVias.map(via => via.city))].sort();
        
        return `# Relatório Completo IDECICLO
## Auditoria Cicloviária - Camboriú e Balneário Camboriú

## 📊 Resumo Executivo Geral

| Indicador | Valor |
|-----------|-------|
| **Total de Estruturas** | ${allVias.length} |
| **Cidades Avaliadas** | ${cities.length} |
| **Extensão Total** | ${(stats.totalLength / 1000).toFixed(1)} km |
| **Nota Média Geral** | ${stats.averageScore.toFixed(1)} |

## 🏙️ Comparativo por Cidade

${cities.map(city => {
    const cityVias = allVias.filter(via => via.city === city);
    const cityStats = this.calculateStats(cityVias);
    return `### ${city}
- **Estruturas**: ${cityVias.length}
- **Extensão**: ${(cityStats.totalLength / 1000).toFixed(1)} km
- **Nota Média**: ${cityStats.averageScore.toFixed(1)}
- **Melhor**: ${cityStats.bestStructure?.structure_name || 'N/A'} (${cityStats.bestScore?.toFixed(1) || 'N/A'})`;
}).join('\n\n')}

## 🏗️ Distribuição Geral por Tipologia

${this.generateTypologyTable(stats.byTypology)}

## 🏆 Top 10 Melhores Estruturas

| Posição | Estrutura | Cidade | Tipologia | Extensão | Nota |
|---------|-----------|--------|-----------|----------|------|
${allVias
    .sort((a, b) => (b.average_score || 0) - (a.average_score || 0))
    .slice(0, 10)
    .map((via, index) => 
        `| ${index + 1}º | ${via.structure_name} | ${via.city} | ${via.typology} | ${(via.length / 1000).toFixed(1)} km | ${via.average_score?.toFixed(1) || 'N/A'} |`
    ).join('\n')}

## ⚠️ Estruturas que Precisam de Atenção (Nota < 6)

${allVias
    .filter(via => (via.average_score || 0) < 6)
    .sort((a, b) => (a.average_score || 0) - (b.average_score || 0))
    .map(via => `- **${via.structure_name}** (${via.city}) - Nota: ${via.average_score?.toFixed(1) || 'N/A'}`)
    .join('\n') || '*Nenhuma estrutura com nota inferior a 6*'}

${cities.map(city => {
    const cityVias = allVias.filter(via => via.city === city);
    return `## 📍 ${city}

${cityVias.map(via => this.generateViaSection(via)).join('\n\n### ')}`;
}).join('\n\n---\n\n')}

---

*Relatório gerado automaticamente pelo sistema IDECICLO em ${new Date().toLocaleDateString('pt-BR')}*
`;
    }

    // Calcular estatísticas
    calculateStats(vias) {
        const validScores = vias.filter(via => via.average_score).map(via => via.average_score);
        const totalLength = vias.reduce((sum, via) => sum + via.length, 0);
        
        const bestVia = vias.reduce((best, via) => 
            (via.average_score || 0) > (best?.average_score || 0) ? via : best, null);
        
        const worstVia = vias.reduce((worst, via) => 
            (via.average_score || Infinity) < (worst?.average_score || Infinity) ? via : worst, null);

        // Agrupar por tipologia
        const byTypology = {};
        vias.forEach(via => {
            if (!byTypology[via.typology]) {
                byTypology[via.typology] = { count: 0, totalLength: 0, scores: [] };
            }
            byTypology[via.typology].count++;
            byTypology[via.typology].totalLength += via.length;
            if (via.average_score) {
                byTypology[via.typology].scores.push(via.average_score);
            }
        });

        return {
            totalLength,
            averageScore: validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0,
            bestStructure: bestVia,
            bestScore: bestVia?.average_score,
            worstStructure: worstVia,
            worstScore: worstVia?.average_score,
            byTypology
        };
    }

    // Gerar tabela de tipologias
    generateTypologyTable(byTypology) {
        let table = '| Tipologia | Quantidade | Extensão Total | Nota Média |\n|-----------|------------|----------------|------------|\n';
        
        Object.keys(byTypology).forEach(type => {
            const data = byTypology[type];
            const avgScore = data.scores.length > 0 ? 
                data.scores.reduce((a, b) => a + b, 0) / data.scores.length : 0;
            
            table += `| **${type}** | ${data.count} | ${(data.totalLength / 1000).toFixed(1)} km | ${avgScore.toFixed(1)} |\n`;
        });
        
        return table;
    }

    // Gerar análise por categoria
    generateCategoryAnalysis(vias, scoreField) {
        const validScores = vias.filter(via => via[scoreField]).map(via => via[scoreField]);
        if (validScores.length === 0) return '*Dados não disponíveis*';
        
        const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
        const max = Math.max(...validScores);
        const min = Math.min(...validScores);
        
        return `- **Média**: ${avg.toFixed(1)}
- **Maior nota**: ${max.toFixed(1)}
- **Menor nota**: ${min.toFixed(1)}`;
    }

    // Gerar seção da via
    generateViaSection(via) {
        return `### ${via.structure_name}

**Informações Básicas**
- Tipologia: ${via.typology}
- Extensão: ${(via.length / 1000).toFixed(1)} km
- Nota Geral: ${via.average_score?.toFixed(1) || 'N/A'}

**Notas por Categoria**
- Projeto: ${via.project_score?.toFixed(1) || 'N/A'}
- Proteção: ${via.protection_score?.toFixed(1) || 'N/A'}
- Conforto: ${via.comfort_score?.toFixed(1) || 'N/A'}
- Segurança: ${via.safety_score?.toFixed(1) || 'N/A'}`;
    }

    // Download do arquivo Markdown
    downloadMarkdown(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
}

// Exportar para uso global
window.ReportGenerator = ReportGenerator;