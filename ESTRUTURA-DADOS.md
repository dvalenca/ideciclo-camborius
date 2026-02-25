# 📊 Estrutura de Dados - IDECICLO Camboriú

## Resumo Executivo

Este documento descreve todos os arquivos de dados do projeto, sua origem e como são gerados.

---

## 🎯 Arquivo Principal (Fonte)

### `assets/data/rated-data.json` (1,5 MB)

**Origem**: Arquivo EXTERNO gerado pelo sistema de auditoria cicloviária  
**Status**: NÃO é gerado por scripts deste projeto  
**Função**: Base de dados principal com todas as avaliações

**Campos principais**:
- `gpx_name`: Nome do arquivo GPX da estrutura
- `city`: Cidade (Camboriú ou Balneário Camboriú)
- `ridable_width`: Largura útil (cm)
- `seg_length`: Extensão (metros)
- `flow_direction`: Direção (Unidirecional/Bidirecional)
- `tipo_da_via`: Tipologia (Ciclovia, Ciclofaixa, Calçada Compartilhada)
- `all_obstacles_count`: Total de obstáculos
- `manhole_covers`, `potholes`, `roots`, etc.: Tipos de obstáculos
- `rates`: Notas calculadas (average, project, protection, comfort, safety)

---

## 🔄 Arquivos Gerados Automaticamente

### 1. Análise de Obstáculos

**Arquivo**: `assets/data/obstacles-by-city.json` (32 KB)  
**Script**: `compile-obstacles.js`  
**Comando**: `node compile-obstacles.js`

**Conteúdo**:
- Total de obstáculos por cidade
- Tipos: bueiros, buracos, raízes, valas profundas, desníveis
- Lista de estruturas com obstáculos
- Médias por estrutura

**Resultados atuais**:
- Balneário Camboriú: 531 obstáculos em 70 estruturas (média: 7.59)
- Camboriú: 420 obstáculos em 41 estruturas (média: 10.24)

---

### 2. Análise de Larguras

**Arquivo**: `assets/data/widths-analysis.json` (44 KB)  
**Script**: `compile-widths.js`  
**Comando**: `node compile-widths.js`

**Conteúdo**:
- Larguras mínima, máxima e média (geral, por cidade, por tipo)
- Distribuição por faixas (0-100cm, 100-150cm, 150-200cm, etc.)
- Extensão total por faixa
- Lista completa ordenada por largura

**Resultados atuais**:
- Geral: 75cm (mín) | 350cm (máx) | 181.97cm (média)
- Ciclovias: 218.33cm (média)
- Ciclofaixas: 166.62cm (média)
- Calçadas Compartilhadas: 197.40cm (média)

---

### 3. Larguras por Tipologia e Direção

**Arquivo**: `assets/data/widths-by-typology.json` (1,2 KB)  
**Script**: `compile-widths-by-typology.js`  
**Comando**: `node compile-widths-by-typology.js`

**Conteúdo**:
- Média por estrutura
- Média ponderada por quilômetro
- Agrupamento por tipologia
- Agrupamento por direção de fluxo

**Resultados atuais**:
- Ciclovia Bidirecional: 212.08cm (média por estrutura)
- Ciclofaixa Bidirecional: 168.99cm (média por estrutura)
- Ciclofaixa Unidirecional: 155.00cm (média por estrutura)

---

### 4. Análise de Padrões Técnicos

**Arquivo**: `ANALISE-PADROES-LARGURA.md` (Markdown)  
**Script**: `compile-width-standards.js`  
**Comando**: `node compile-width-standards.js`

**Conteúdo**:
- Comparação com larguras mínimas (100cm uni, 200cm bi)
- Comparação com larguras desejáveis (150cm uni, 250cm bi)
- Percentuais de adequação por cidade
- Relatório detalhado em formato Markdown

---

### 5. Dados Processados para o Hotsite

**Arquivos**: 
- `data/processed-data.json`
- `data/vias-metadata.json`
- `data/combined-routes.geojson`

**Script**: `data/process-data.js`  
**Comando**: `cd data && node process-data.js`

**Conteúdo**:
- Dados otimizados para o frontend
- Coordenadas geográficas das estruturas
- Metadados estatísticos agregados
- GeoJSON combinado das duas cidades

---

### 6. Waypoints dos Arquivos GPX

**Arquivos**:
- `data/waypoints-data.json`
- `data/waypoints-by-file.json`

**Script**: `data/process-gpx.js`  
**Comando**: `cd data && node process-gpx.js`

**Conteúdo**:
- Pontos de interesse extraídos dos GPX
- Anotações das auditorias
- Agrupamento por arquivo GPX

**Nota**: Requer arquivos GPX em `../../src/gpx-files/`

---

## 📁 Arquivos Geoespaciais (Manuais)

### GeoJSON das Cidades

- `assets/data/Balneario-OSM-enriched-fixed.geojson`
- `assets/data/Camboriu-OSM-enriched-fixed.geojson`

**Origem**: OpenStreetMap + enriquecimento manual  
**Uso**: Mapas interativos e cálculo do IDECICLO

### Classificação de Vias

- `assets/data/BalnearioWays.json`
- `assets/data/CamboriuWays.json`

**Origem**: Processamento OSM  
**Conteúdo**: Classificação das vias (arterial, coletora, local)

---

## 🚀 Como Atualizar Todos os Dados

### Opção 1: Script Automatizado

```bash
./update-data.sh
```

### Opção 2: Comandos Individuais

```bash
# Análises de obstáculos e larguras
node compile-obstacles.js
node compile-widths.js
node compile-widths-by-typology.js
node compile-width-standards.js

# Processar dados para o hotsite
cd data
node process-data.js
node process-gpx.js
```

---

## 📊 Fluxo de Dados

```
┌─────────────────────────────────────────┐
│  ENTRADA (Sistema de Auditoria)         │
│  rated-data.json (1,5 MB)               │
└──────────────┬──────────────────────────┘
               │
               ├──► compile-obstacles.js ──► obstacles-by-city.json
               │
               ├──► compile-widths.js ──► widths-analysis.json
               │
               ├──► compile-widths-by-typology.js ──► widths-by-typology.json
               │
               ├──► compile-width-standards.js ──► ANALISE-PADROES-LARGURA.md
               │
               └──► process-data.js ──► processed-data.json
                                     └──► vias-metadata.json
                                     └──► combined-routes.geojson
```

---

## 🔍 Campos Importantes do rated-data.json

### Identificação
- `gpx_name`: Nome do arquivo GPX
- `city`: Cidade
- `street`: Nome da rua/via

### Dimensões
- `ridable_width`: Largura útil (cm)
- `buffer_width`: Largura do amortecimento (cm)
- `seg_length`: Extensão do segmento (m)

### Tipologia
- `tipo_da_via`: Objeto com Ciclovia, Ciclofaixa, Ciclorrota, Calçada compartilhada
- `flow_direction`: Unidirecional/Bidirecional
- `traffic_flow`: Mão Única/Mão Dupla

### Obstáculos
- `all_obstacles_count`: Total
- `manhole_covers`: Bueiros
- `potholes`: Buracos
- `roots`: Raízes
- `deep_gutters_along_structure`: Valas profundas
- `unevenness_obstacles`: Desníveis
- `other_obstacles`: Outros

### Avaliações (rates)
- `average`: Nota média geral
- `project`: Nota do projeto
- `protection`: Nota da proteção
- `comfort`: Nota do conforto
- `safety`: Nota da segurança

---

## 📝 Notas Técnicas

- **Larguras**: Sempre em centímetros (cm)
- **Extensões**: Sempre em metros (m)
- **Identificação de cidade**: Por sufixo no gpx_name (`- BC` ou `- Cb`)
- **Tipo de estrutura**: Extraído do nome do GPX ou campo tipo_da_via
- **Valores ausentes**: Tratados como 0

---

## 🛠️ Requisitos

- Node.js v14+
- Arquivo `assets/data/rated-data.json` atualizado
- Arquivos GeoJSON das cidades

---

## 📄 Licença

GNU General Public License v3.0
