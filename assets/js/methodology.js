// Sistema interativo da metodologia
class MethodologyTree {
    constructor() {
        this.criteria = {
            projeto: {
                name: 'Projeto',
                weight: 0.4,
                description: 'Avalia a concepção e riscos do projeto cicloviário',
                subcriteria: {
                    concepcao: {
                        name: 'Concepção do Projeto',
                        weight: 0.6,
                        description: 'Adequação do projeto às normas e boas práticas'
                    },
                    riscos: {
                        name: 'Riscos do Projeto',
                        weight: 0.4,
                        description: 'Identificação e mitigação de riscos'
                    }
                }
            },
            protecao: {
                name: 'Proteção',
                weight: 0.35,
                description: 'Avalia a segurança e proteção dos ciclistas',
                subcriteria: {
                    segregacao: {
                        name: 'Tipo de Segregação',
                        weight: 0.3,
                        description: 'Qualidade da separação física do tráfego'
                    },
                    condicoes: {
                        name: 'Condições de Proteção',
                        weight: 0.25,
                        description: 'Estado e efetividade da proteção'
                    },
                    sinais_verticais: {
                        name: 'Sinais Verticais',
                        weight: 0.25,
                        description: 'Presença e qualidade da sinalização vertical'
                    },
                    sinais_horizontais: {
                        name: 'Sinais Horizontais',
                        weight: 0.2,
                        description: 'Presença e qualidade da sinalização horizontal'
                    }
                }
            },
            conforto: {
                name: 'Conforto',
                weight: 0.25,
                description: 'Avalia o conforto e facilidade de uso',
                subcriteria: {
                    pavimento: {
                        name: 'Pavimento',
                        weight: 0.3,
                        description: 'Qualidade e estado do pavimento'
                    },
                    largura: {
                        name: 'Largura',
                        weight: 0.25,
                        description: 'Adequação da largura da via'
                    },
                    obstaculos: {
                        name: 'Obstáculos',
                        weight: 0.25,
                        description: 'Presença e impacto de obstáculos'
                    },
                    velocidade: {
                        name: 'Controle de Velocidade',
                        weight: 0.2,
                        description: 'Medidas de controle de velocidade'
                    }
                }
            }
        };
    }

    renderMainCriteria() {
        return Object.entries(this.criteria).map(([key, criterion]) => `
            <div class="criterion-node main-criterion" data-criterion="${key}">
                <div class="criterion-header">
                    <h4>${criterion.name}</h4>
                    <span class="weight-badge">${(criterion.weight * 100).toFixed(0)}%</span>
                </div>
                <p class="criterion-description">${criterion.description}</p>
                <div class="subcriteria-container" id="sub-${key}">
                    ${this.renderSubcriteria(criterion.subcriteria)}
                </div>
            </div>
        `).join('');
    }

    renderSubcriteria(subcriteria) {
        return Object.entries(subcriteria).map(([key, subcriterion]) => `
            <div class="criterion-node sub-criterion" data-subcriterion="${key}">
                <div class="criterion-header">
                    <h5>${subcriterion.name}</h5>
                    <span class="weight-badge small">${(subcriterion.weight * 100).toFixed(0)}%</span>
                </div>
                <p class="criterion-description small">${subcriterion.description}</p>
            </div>
        `).join('');
    }

    attachEventListeners() {
        // Adicionar interatividade aos nós
        document.querySelectorAll('.criterion-node').forEach(node => {
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                this.highlightCriterion(node);
            });
        });
    }

    highlightCriterion(node) {
        // Remover highlight anterior
        document.querySelectorAll('.criterion-node.highlighted').forEach(n => {
            n.classList.remove('highlighted');
        });

        // Adicionar highlight atual
        node.classList.add('highlighted');

        // Mostrar detalhes
        this.showCriterionDetails(node);
    }

    showCriterionDetails(node) {
        const criterionKey = node.dataset.criterion || node.dataset.subcriterion;
        // Implementar painel de detalhes se necessário
    }
}

// CSS para árvore interativa
const treeStyles = `
<style>
.interactive-tree {
    margin: 2rem 0;
}

.tree-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin: 1.5rem 0;
}

.criterion-node {
    background: white;
    border: 2px solid #E8F5E8;
    border-radius: 8px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s;
}

.criterion-node:hover {
    border-color: #2E7D32;
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.15);
}

.criterion-node.highlighted {
    border-color: #2E7D32;
    background: #E8F5E8;
}

.main-criterion {
    border-left: 6px solid #2E7D32;
}

.sub-criterion {
    border-left: 4px solid #4CAF50;
    margin: 0.75rem 0;
    padding: 1rem;
}

.criterion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.criterion-header h4,
.criterion-header h5 {
    margin: 0;
    color: #2E7D32;
}

.weight-badge.small {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
}

.criterion-description {
    color: #666;
    font-size: 0.9rem;
    margin: 0;
}

.criterion-description.small {
    font-size: 0.8rem;
}

.subcriteria-container {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #E8F5E8;
}

.formula-display {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    margin-top: 2rem;
}
</style>
`;

// Adicionar estilos ao head
document.head.insertAdjacentHTML('beforeend', treeStyles);

// Exportar para uso global
window.MethodologyTree = MethodologyTree;