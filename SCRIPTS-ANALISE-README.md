# Scripts de Análise de Dados - IDECICLO

Este diretório contém scripts Node.js para processar e analisar dados das auditorias cicloviárias de Camboriú e Balneário Camboriú.

## 📋 Scripts Disponíveis

### 1. `compile-obstacles.js` - Análise de Obstáculos

Compila todos os obstáculos encontrados nas estruturas cicloviárias por cidade.

**Execução:**
```bash
node compile-obstacles.js
```

**Gera:** `assets/data/obstacles-by-city.json`

**Dados incluídos:**
- Total de obstáculos por cidade
- Tipos de obstáculos (bueiros, buracos, raízes, etc.)
- Lista de estruturas com obstáculos
- Médias por estrutura

**Documentação:** [COMO-COMPILAR-OBSTACULOS.md](./COMO-COMPILAR-OBSTACULOS.md)

---

### 2. `compile-widths.js` - Análise de Larguras

Analisa as larguras (ridable_width) de todas as estruturas cicloviárias.

**Execução:**
```bash
node compile-widths.js
```

**Gera:** `assets/data/widths-analysis.json`

**Dados incluídos:**
- Larguras mínima, máxima e média
- Análise por cidade e tipo de estrutura
- Distribuição por faixas de largura (0-100cm, 100-150cm, etc.)
- Extensão total por faixa
- Lista completa ordenada por largura

**Documentação:** [COMO-ANALISAR-LARGURAS.md](./COMO-ANALISAR-LARGURAS.md)

---

## 🎯 Resultados Rápidos

### Obstáculos
```
Balneário Camboriú: 531 obstáculos em 70 estruturas (média: 7.59)
Camboriú: 420 obstáculos em 41 estruturas (média: 10.24)
```

### Larguras
```
Geral: 75cm (min) | 350cm (max) | 181.97cm (média)
Ciclovias: 218.33cm (média)
Ciclofaixas: 166.62cm (média)
```

## 📁 Estrutura de Arquivos

```
ideciclo-camborius/
├── compile-obstacles.js          # Script de obstáculos
├── compile-widths.js              # Script de larguras
├── COMO-COMPILAR-OBSTACULOS.md    # Doc obstáculos
├── COMO-ANALISAR-LARGURAS.md      # Doc larguras
└── assets/
    └── data/
        ├── rated-data.json              # Fonte (entrada)
        ├── obstacles-by-city.json       # Gerado
        └── widths-analysis.json         # Gerado
```

## 🔄 Workflow de Atualização

Após novas auditorias ou alterações no `rated-data.json`:

```bash
# Atualizar análise de obstáculos
node compile-obstacles.js

# Atualizar análise de larguras
node compile-widths.js
```

## 💡 Uso no Dashboard

Os arquivos JSON gerados podem ser usados para:

### Obstáculos
- Gráficos comparativos entre cidades
- Ranking de estruturas problemáticas
- Análise de tipos de obstáculos mais comuns
- Priorização de manutenção

### Larguras
- Histogramas de distribuição
- Comparativos por cidade/tipo
- Identificação de estruturas inadequadas (<100cm)
- Mapas de calor por região

## 🛠️ Requisitos

- Node.js (v14+)
- Arquivo `assets/data/rated-data.json` atualizado

## 📊 Exemplos de Visualização

### Gráfico de Barras - Distribuição de Larguras
```javascript
// Usar widthData.width_distribution
const labels = Object.keys(widthData.width_distribution);
const counts = labels.map(l => widthData.width_distribution[l].count);
```

### Gráfico de Pizza - Obstáculos por Tipo
```javascript
// Usar obstaclesByCity[city].obstacleTypes
const types = Object.keys(obstacleTypes);
const values = types.map(t => obstacleTypes[t]);
```

## 🔍 Campos Importantes

### rated-data.json (fonte)
- `gpx_name`: Nome da estrutura
- `city`: Cidade
- `ridable_width`: Largura útil (cm)
- `seg_length`: Extensão (m)
- `all_obstacles_count`: Total de obstáculos
- `manhole_covers`: Bueiros
- `potholes`: Buracos
- `roots`: Raízes
- `deep_gutters_along_structure`: Valas profundas
- `unevenness_obstacles`: Desníveis
- `other_obstacles`: Outros

## 📝 Notas

- Larguras em **centímetros** (cm)
- Extensões em **metros** (m)
- Identificação de cidade por sufixo: `- BC` ou `- Cb`
- Tipo de estrutura extraído do nome do GPX
- Estruturas sem dados são tratadas com valor 0

## 🤝 Contribuindo

Para adicionar novos scripts de análise:

1. Criar arquivo `.js` na raiz
2. Seguir padrão de leitura do `rated-data.json`
3. Gerar JSON em `assets/data/`
4. Criar documentação `.md` explicativa
5. Atualizar este README

## 📄 Licença

GNU General Public License v3.0
