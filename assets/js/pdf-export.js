// Sistema de exportação PDF
class PDFExporter {
    constructor() {
        this.pageWidth = 210; // A4 width in mm
        this.pageHeight = 297; // A4 height in mm
        this.margin = 20;
        this.contentWidth = this.pageWidth - (this.margin * 2);
    }

    // Exportar via para PDF
    async exportVia(viaData) {
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Página 1: Informações principais
            await this.createPage1(pdf, viaData);
            
            // Página 2: Detalhes técnicos
            pdf.addPage();
            await this.createPage2(pdf, viaData);
            
            // Salvar PDF
            const fileName = `${viaData.structure_name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
            pdf.save(fileName);
            
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Erro ao gerar PDF. Tente novamente.');
        }
    }

    // Página 1: Mapa, informações básicas, notas
    async createPage1(pdf, viaData) {
        let yPos = this.margin;
        
        // Cabeçalho
        yPos = this.addHeader(pdf, yPos);
        
        // Título da estrutura
        yPos = this.addTitle(pdf, viaData.structure_name, yPos);
        
        // Informações básicas
        yPos = this.addBasicInfo(pdf, viaData, yPos);
        
        // Mapa (captura de tela)
        yPos = await this.addMap(pdf, yPos);
        
        // Notas principais
        yPos = this.addMainScores(pdf, viaData, yPos);
    }

    // Página 2: Detalhes técnicos, fotos, dados brutos
    async createPage2(pdf, viaData) {
        let yPos = this.margin;
        
        // Cabeçalho da página 2
        yPos = this.addHeader(pdf, yPos, 'Página 2/2');
        
        // Dados técnicos detalhados
        yPos = this.addDetailedData(pdf, viaData, yPos);
        
        // Notas detalhadas
        yPos = this.addDetailedScores(pdf, viaData, yPos);
        
        // Comentários (se houver)
        if (viaData.full_data.comments && viaData.full_data.comments.length > 0) {
            yPos = this.addComments(pdf, viaData.full_data.comments, yPos);
        }
    }

    // Adicionar cabeçalho
    addHeader(pdf, yPos, pageInfo = 'Página 1/2') {
        // Logo/Título IDECICLO
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(46, 125, 50);
        pdf.text('IDECICLO - Auditoria Cicloviária', this.margin, yPos);
        
        // Informações da página
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text(pageInfo, this.pageWidth - this.margin - 30, yPos);
        
        // Data de geração
        const now = new Date().toLocaleDateString('pt-BR');
        pdf.text(`Gerado em: ${now}`, this.pageWidth - this.margin - 30, yPos + 5);
        
        // Linha separadora
        pdf.setDrawColor(200, 200, 200);
        pdf.line(this.margin, yPos + 8, this.pageWidth - this.margin, yPos + 8);
        
        return yPos + 15;
    }

    // Adicionar título da estrutura
    addTitle(pdf, title, yPos) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        
        // Quebrar título se muito longo
        const lines = pdf.splitTextToSize(title, this.contentWidth);
        pdf.text(lines, this.margin, yPos);
        
        return yPos + (lines.length * 7) + 5;
    }

    // Adicionar informações básicas
    addBasicInfo(pdf, viaData, yPos) {
        const info = [
            ['Cidade:', viaData.city],
            ['Tipologia:', viaData.typology],
            ['Extensão:', `${(viaData.length / 1000).toFixed(1)} km`],
            ['Nota Geral:', viaData.full_rates?.average ? viaData.full_rates.average.toFixed(1) : 'N/A']
        ];
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        info.forEach(([label, value], index) => {
            const x = this.margin + (index % 2) * (this.contentWidth / 2);
            const y = yPos + Math.floor(index / 2) * 6;
            
            pdf.setFont('helvetica', 'bold');
            pdf.text(label, x, y);
            pdf.setFont('helvetica', 'normal');
            pdf.text(value, x + 25, y);
        });
        
        return yPos + 20;
    }

    // Adicionar mapa (captura de tela)
    async addMap(pdf, yPos) {
        try {
            const mapElement = document.getElementById('map');
            if (mapElement && window.viaMap && window.viaMap.map) {
                // Aguardar o mapa carregar completamente
                await new Promise(resolve => {
                    if (window.viaMap.map.loaded()) {
                        resolve();
                    } else {
                        window.viaMap.map.on('idle', resolve);
                    }
                });
                
                // Capturar o canvas do mapa diretamente
                const mapCanvas = window.viaMap.map.getCanvas();
                if (mapCanvas) {
                    const imgData = mapCanvas.toDataURL('image/jpeg', 0.8);
                    const imgWidth = this.contentWidth;
                    const imgHeight = (mapCanvas.height * imgWidth) / mapCanvas.width;
                    
                    pdf.addImage(imgData, 'JPEG', this.margin, yPos, imgWidth, Math.min(imgHeight, 80));
                    return yPos + Math.min(imgHeight, 80) + 10;
                }
            }
        } catch (error) {
            console.warn('Erro ao capturar mapa:', error);
        }
        
        // Placeholder se não conseguir capturar
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Mapa não disponível para exportação', this.margin, yPos);
        return yPos + 15;
    }

    // Adicionar notas principais
    addMainScores(pdf, viaData, yPos) {
        const rates = viaData.full_rates || {};
        const mainScores = [
            ['Nota Geral:', rates.average],
            ['Projeto:', rates.project],
            ['Proteção:', rates.protection],
            ['Conforto:', rates.comfort],
            ['Segurança:', rates.safety]
        ];
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Notas Principais', this.margin, yPos);
        yPos += 8;
        
        pdf.setFontSize(9);
        mainScores.forEach(([label, score], index) => {
            const x = this.margin + (index % 2) * (this.contentWidth / 2);
            const y = yPos + Math.floor(index / 2) * 6;
            
            pdf.setFont('helvetica', 'normal');
            pdf.text(label, x, y);
            
            // Cor da nota
            const color = this.getScoreColor(score);
            pdf.setTextColor(color.r, color.g, color.b);
            pdf.setFont('helvetica', 'bold');
            pdf.text(score ? score.toFixed(1) : 'N/A', x + 25, y);
            pdf.setTextColor(0, 0, 0);
        });
        
        return yPos + Math.ceil(mainScores.length / 2) * 6 + 10;
    }

    // Adicionar dados detalhados
    addDetailedData(pdf, viaData, yPos) {
        const data = viaData.full_data;
        const details = [
            ['Extensão:', `${(viaData.length / 1000).toFixed(1)} km`],
            ['Pavimento:', data.pavement_type],
            ['Condição Pavimento:', data.pavement_condition_evaluation],
            ['Segregador:', data.segregator_type],
            ['Largura Transitável:', data.ridable_width ? `${data.ridable_width}cm` : 'N/A'],
            ['Largura Buffer:', data.buffer_width ? `${data.buffer_width}cm` : 'N/A'],
            ['Largura Via:', data.road_width ? `${data.road_width}cm` : 'N/A'],
            ['Cruzamentos:', data.crosses || 0],
            ['Obstáculos Total:', data.all_obstacles_count || 0],
            ['Bueiros:', data.manhole_covers || 0],
            ['Buracos:', data.potholes || 0],
            ['Raízes:', data.roots || 0],
            ['Pontos Ônibus:', data.bus_stops_along || 0],
            ['Placas Verticais:', data.on_way_vertical_signs_count || 0],
            ['Semáforos Exclusivos:', data.exclusive_traffic_lights || 0],
            ['Travessias Pedestres:', data.pedestrian_crossings_count || 0]
        ];
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Dados Técnicos Detalhados', this.margin, yPos);
        yPos += 8;
        
        pdf.setFontSize(8);
        details.forEach(([label, value], index) => {
            const x = this.margin + (index % 3) * (this.contentWidth / 3);
            const y = yPos + Math.floor(index / 3) * 5;
            
            pdf.setFont('helvetica', 'bold');
            pdf.text(label, x, y);
            pdf.setFont('helvetica', 'normal');
            
            // Quebrar texto longo
            const text = String(value || 'N/A');
            const maxWidth = (this.contentWidth / 3) - 25;
            const lines = pdf.splitTextToSize(text, maxWidth);
            pdf.text(lines[0], x + 22, y); // Só primeira linha
        });
        
        return yPos + Math.ceil(details.length / 3) * 5 + 10;
    }

    // Adicionar notas detalhadas
    addDetailedScores(pdf, viaData, yPos) {
        const rates = viaData.full_rates || {};
        
        // Coletar todas as notas disponíveis (exceto as principais já mostradas)
        const allScores = [];
        const excludeKeys = ['average', 'project', 'protection', 'comfort', 'safety'];
        
        Object.keys(rates).forEach(key => {
            if (!excludeKeys.includes(key) && rates[key] !== null && rates[key] !== undefined) {
                // Converter chave para label legível
                const label = this.formatScoreLabel(key);
                allScores.push([label, rates[key]]);
            }
        });
        
        if (allScores.length === 0) return yPos;
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Notas Detalhadas', this.margin, yPos);
        yPos += 8;
        
        pdf.setFontSize(8);
        allScores.forEach(([label, score], index) => {
            const x = this.margin + (index % 3) * (this.contentWidth / 3);
            const y = yPos + Math.floor(index / 3) * 5;
            
            pdf.setFont('helvetica', 'normal');
            const maxLabelWidth = (this.contentWidth / 3) - 20;
            const labelLines = pdf.splitTextToSize(label, maxLabelWidth);
            pdf.text(labelLines[0], x, y); // Só primeira linha para economizar espaço
            
            const color = this.getScoreColor(score);
            pdf.setTextColor(color.r, color.g, color.b);
            pdf.setFont('helvetica', 'bold');
            pdf.text(score.toFixed(1), x + maxLabelWidth + 2, y);
            pdf.setTextColor(0, 0, 0);
        });
        
        return yPos + Math.ceil(allScores.length / 3) * 5 + 10;
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

    // Adicionar comentários
    addComments(pdf, comments, yPos) {
        if (yPos > this.pageHeight - this.margin - 30) {
            return yPos; // Não há espaço suficiente
        }
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Observações de Campo', this.margin, yPos);
        yPos += 8;
        
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        
        const maxComments = Math.min(comments.length, 5); // Limitar a 5 comentários
        
        for (let i = 0; i < maxComments; i++) {
            const comment = comments[i];
            const lines = pdf.splitTextToSize(`• ${comment}`, this.contentWidth - 5);
            
            // Verificar se ainda cabe na página
            if (yPos + (lines.length * 3) > this.pageHeight - this.margin - 10) {
                break;
            }
            
            pdf.text(lines, this.margin + 3, yPos);
            yPos += lines.length * 3 + 1;
        }
        
        if (comments.length > maxComments) {
            pdf.setFontSize(7);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`... e mais ${comments.length - maxComments} observações`, this.margin, yPos + 3);
            pdf.setTextColor(0, 0, 0);
        }
        
        return yPos + 5;
    }

    // Obter cor da nota
    getScoreColor(score) {
        if (!score) return { r: 150, g: 150, b: 150 };
        if (score >= 8) return { r: 76, g: 175, b: 80 };
        if (score >= 6) return { r: 139, g: 195, b: 74 };
        if (score >= 4) return { r: 255, g: 193, b: 7 };
        if (score >= 2) return { r: 255, g: 152, b: 0 };
        return { r: 244, g: 67, b: 54 };
    }
}

// Exportar para uso global
window.PDFExporter = PDFExporter;